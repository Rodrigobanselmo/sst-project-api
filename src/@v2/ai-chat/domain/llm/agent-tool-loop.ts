import { HumanMessage } from '@langchain/core/messages';
import type { BaseMessage } from '@langchain/core/messages';
import type { BaseChatModel } from '@langchain/core/language_models/chat_models';
import type { StructuredToolInterface } from '@langchain/core/tools';
import type { CallbackManager } from '@langchain/core/callbacks/manager';
import type { StreamEvent } from '../types/stream-events';
import { BINARY_RESULT_PREFIX } from '../tools/file.tools';

export interface AgentToolLoopOptions {
  llm: BaseChatModel;
  messages: BaseMessage[];
  tools: StructuredToolInterface[];
  callbacks?: CallbackManager;
  maxIterations?: number;
  /** Optional smarter LLM to use for specific tools that require more reasoning */
  smarterLlm?: BaseChatModel;
  /** Tool names that should always use the smarter LLM */
  toolsRequiringSmarterLlm?: string[];
}

/**
 * Shared tool loop for all agents.
 * Streams LLM responses, detects tool calls, executes tools, and loops until a final text response.
 *
 * When smarterLlm is provided, it switches to it only for the iteration after
 * a tool in toolsRequiringSmarterLlm returns — so the smarter model processes
 * that tool's result while all other iterations use the default (fast) LLM.
 */
export async function* agentToolLoop(options: AgentToolLoopOptions): AsyncGenerator<StreamEvent, void, undefined> {
  const { tools, callbacks, maxIterations = 300, smarterLlm, toolsRequiringSmarterLlm = [] } = options;
  const defaultLlm = options.llm.bindTools(tools);
  const boundSmarterLlm = smarterLlm ? smarterLlm.bindTools(tools) : null;
  const callConfig = callbacks ? { callbacks } : undefined;

  let currentMessages = [...options.messages];
  let useSmartNextIteration = false;
  let hasGeneratedContent = false;
  let totalToolCalls = 0;
  let terminateAfterToolBatch = false;
  let suppressContent = false;

  for (let i = 0; i < maxIterations; i++) {
    console.log('[AgentToolLoop] iteration ' + i + ' starting');
    const activeLlm = useSmartNextIteration && boundSmarterLlm ? boundSmarterLlm : defaultLlm;
    if (useSmartNextIteration && boundSmarterLlm) {
      console.log(`[AgentToolLoop] Using SMARTER LLM for this iteration`);
    }
    useSmartNextIteration = false;

    let accumulated: any = null;

    try {
      const stream = await activeLlm.stream(currentMessages, callConfig);

      for await (const chunk of stream) {
        accumulated = accumulated ? accumulated.concat(chunk) : chunk;

        const text =
          typeof chunk.content === 'string'
            ? chunk.content
            : Array.isArray(chunk.content)
              ? chunk.content
                  .filter((c): c is { type: 'text'; text: string } => c.type === 'text')
                  .map((c) => c.text)
                  .join('')
              : '';

        if (text) {
          if (suppressContent) {
            console.log('[AgentToolLoop] suppressing content after navigation_card: ' + text.substring(0, 60));
          } else {
            hasGeneratedContent = true;
            yield { type: 'content', content: text };
          }
        }
      }
    } catch (streamError) {
      const errorMsg = streamError instanceof Error ? streamError.message : 'Erro desconhecido no streaming';
      console.error('[AgentToolLoop] Stream error:', streamError);
      yield { type: 'error', message: `Erro ao gerar resposta: ${errorMsg}` };
      break;
    }

    if (!accumulated) break;

    const toolCalls = 'tool_calls' in accumulated && Array.isArray(accumulated.tool_calls) ? (accumulated.tool_calls as Array<{ id?: string; name: string; args: Record<string, unknown> }>) : [];

    if (toolCalls.length === 0) break;

    currentMessages = [...currentMessages, accumulated as BaseMessage];
    totalToolCalls += toolCalls.length;

    for (const toolCall of toolCalls) {
      const foundTool = tools.find((t) => t.name === toolCall.name);
      if (!foundTool) continue;

      const args = toolCall.args;
      const description = (args._actionDescription as string | undefined) ?? toolCall.name;

      yield { type: 'tool_start', tool: toolCall.name, args, description };

      // Flag smarter LLM for next iteration if this tool requires it
      if (boundSmarterLlm && toolsRequiringSmarterLlm.includes(toolCall.name)) {
        useSmartNextIteration = true;
      }

      try {
        // Pass callbacks so tool execution traces nest under the parent in LangSmith
        const toolResult = await (foundTool.invoke as (args: unknown, config?: any) => Promise<string>)(toolCall.args, callConfig);
        const resultStr = typeof toolResult === 'string' ? toolResult : JSON.stringify(toolResult);

        // Check if tool result contains an action card (backend-driven mutation)
        let actionCardData: any = null;
        let navigationCardData: any = null;
        try {
          const parsed = JSON.parse(resultStr);
          if (parsed._action_type && parsed._action_id) {
            actionCardData = {
              actionId: parsed._action_id,
              summary: parsed._action_summary || 'Ação pendente',
              details: parsed._action_details || {},
            };
          }
          if (parsed._navigation_type && parsed._navigation_target && parsed._navigation_kind) {
            navigationCardData = {
              kind: parsed._navigation_kind,
              target: parsed._navigation_target,
              label: parsed._navigation_label || 'Abrir',
              description: parsed._navigation_description,
              params: parsed._navigation_params || {},
              icon: parsed._navigation_icon,
            };
          }
        } catch {
          // Not JSON or doesn't have action markers — proceed normally
        }

        if (resultStr.startsWith(BINARY_RESULT_PREFIX)) {
          const binaryJson = resultStr.slice(BINARY_RESULT_PREFIX.length);
          const binaryData = JSON.parse(binaryJson) as { filename: string; mimeType: string; dataUrl: string };

          yield { type: 'tool_end', tool: toolCall.name, result: `Loaded ${binaryData.filename}`, success: true };

          currentMessages.push({
            role: 'tool',
            content: `File ${binaryData.filename} loaded — see the image below.`,
            tool_call_id: toolCall.id,
            name: toolCall.name,
          } as unknown as BaseMessage);

          currentMessages.push(
            new HumanMessage({
              content: [
                { type: 'text' as const, text: `[Re-read file: ${binaryData.filename}]` },
                { type: 'image_url' as const, image_url: { url: binaryData.dataUrl, detail: 'auto' as const } },
              ],
            }),
          );
        } else {
          yield {
            type: 'tool_end',
            tool: toolCall.name,
            result: resultStr,
            success: !resultStr.toLowerCase().startsWith('failed'),
          };

          // Emit action_card SSE event if detected
          if (actionCardData) {
            yield {
              type: 'action_card',
              actionId: actionCardData.actionId,
              summary: actionCardData.summary,
              details: actionCardData.details,
            };
          }

          // Emit navigation_card SSE event if detected
          if (navigationCardData) {
            yield {
              type: 'navigation_card',
              kind: navigationCardData.kind,
              target: navigationCardData.target,
              label: navigationCardData.label,
              description: navigationCardData.description,
              params: navigationCardData.params,
              icon: navigationCardData.icon,
            };
            // The card IS the final response for navigation intent.
            // Stop further iterations so the LLM doesn't re-emit the whole
            // reply + tool call in a loop.
            terminateAfterToolBatch = true;
            suppressContent = true;
            console.log('[AgentToolLoop] navigation_card emitted → terminateAfterToolBatch=true, suppressContent=true (iteration ' + i + ')');
          }

          currentMessages.push({
            role: 'tool',
            content: resultStr,
            tool_call_id: toolCall.id,
            name: toolCall.name,
          } as unknown as BaseMessage);
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        yield { type: 'tool_end', tool: toolCall.name, result: errorMsg, success: false };
        yield { type: 'error', message: errorMsg };
      }
    }

    if (terminateAfterToolBatch) {
      console.log('[AgentToolLoop] breaking outer loop after iteration ' + i);
      break;
    }
  }
  console.log('[AgentToolLoop] outer loop exited. hasGeneratedContent=' + hasGeneratedContent + ', totalToolCalls=' + totalToolCalls + ', terminateAfterToolBatch=' + terminateAfterToolBatch);

  // If agent called tools but never generated content, prompt it to explain what it did
  if (totalToolCalls > 0 && !hasGeneratedContent) {
    console.warn(`[AgentToolLoop] Agent called ${totalToolCalls} tools but generated no content. Prompting for explanation.`);

    // Add a system message asking the agent to explain what it did
    currentMessages.push(new HumanMessage('Por favor, resuma o que você fez e responda à pergunta do usuário com base nos resultados das ferramentas que você executou.'));

    // Force one more LLM call to get a summary
    const activeLlm = defaultLlm;
    const stream = await activeLlm.stream(currentMessages, callConfig);

    for await (const chunk of stream) {
      const text =
        typeof chunk.content === 'string'
          ? chunk.content
          : Array.isArray(chunk.content)
            ? chunk.content
                .filter((c): c is { type: 'text'; text: string } => c.type === 'text')
                .map((c) => c.text)
                .join('')
            : '';

      if (text) {
        yield { type: 'content', content: text };
      }
    }
  }
}
