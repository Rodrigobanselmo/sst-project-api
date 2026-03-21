import { SystemMessage, HumanMessage, AIMessage } from '@langchain/core/messages';
import type { BaseMessage } from '@langchain/core/messages';
import type { BaseChatModel } from '@langchain/core/language_models/chat_models';
import type { StreamEvent } from '../types/stream-events';
import { createUserTools } from '../tools/user.tools';
import type { UsersRepository } from '../../../../modules/users/repositories/implementations/UsersRepository';

const USER_AGENT_SYSTEM_PROMPT = `Voce e um assistente especializado em gerenciamento de usuarios.
Voce ajuda a listar e consultar informacoes sobre os usuarios da empresa.

IMPORTANTE: Sempre responda no MESMO IDIOMA que o usuario esta usando. Detecte o idioma da conversa e corresponda.

Voce tem acesso a ferramentas que permitem:
- Listar usuarios da empresa

Quando o usuario perguntar sobre usuarios, funcionarios ou colaboradores, use as ferramentas apropriadas.
Seja prestativo, amigavel e proativo nas respostas.
Sempre confirme antes de deletar qualquer coisa.
Formate as respostas de forma clara e legivel.`;

export interface UserAgentInput {
  message: string;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
  companyId: string;
  usersRepository: UsersRepository;
  llm: BaseChatModel;
}

/**
 * Streams the user agent response.
 * Returns an async generator that yields StreamEvent objects.
 * Follows the same streaming loop pattern as takehome's streamRecipeAgent.
 */
export async function* streamUserAgent(input: UserAgentInput): AsyncGenerator<StreamEvent, void, undefined> {
  const tools = createUserTools({
    usersRepository: input.usersRepository,
    companyId: input.companyId,
  });

  const llm = input.llm.bindTools(tools);

  // Convert history to LangChain messages
  const historyMessages: BaseMessage[] = (input.history ?? []).map((msg) =>
    msg.role === 'user' ? new HumanMessage(msg.content) : new AIMessage(msg.content),
  );

  const messagesWithSystem = [new SystemMessage(USER_AGENT_SYSTEM_PROMPT), ...historyMessages, new HumanMessage(input.message)];

  let currentMessages: BaseMessage[] = messagesWithSystem;
  let iterations = 0;
  const maxIterations = 300; // Prevent infinite loops

  while (iterations < maxIterations) {
    iterations++;
    const response = await llm.invoke(currentMessages);

    // Check if there are tool calls
    if ('tool_calls' in response && Array.isArray(response.tool_calls) && response.tool_calls.length > 0) {
      // Execute tools
      currentMessages = [...currentMessages, response];

      for (const toolCall of response.tool_calls) {
        const foundTool = tools.find((t) => t.name === toolCall.name);
        if (foundTool) {
          const args = toolCall.args as Record<string, unknown>;
          // Extract _actionDescription from args (LLM-generated, contextual, multi-language)
          const description = (args._actionDescription as string | undefined) ?? toolCall.name;

          // Emit tool start event with LLM-generated description
          yield { type: 'tool_start', tool: toolCall.name, args, description };

          try {
            const toolResult = await (foundTool.invoke as (args: unknown) => Promise<string>)(toolCall.args);
            const resultStr = typeof toolResult === 'string' ? toolResult : JSON.stringify(toolResult);

            // Emit tool end event
            yield {
              type: 'tool_end',
              tool: toolCall.name,
              result: resultStr,
              success: !resultStr.toLowerCase().startsWith('failed'),
            };

            currentMessages.push({
              role: 'tool',
              content: resultStr,
              tool_call_id: toolCall.id,
              name: toolCall.name,
            } as unknown as BaseMessage);
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Unknown error';
            yield { type: 'tool_end', tool: toolCall.name, result: errorMsg, success: false };
            yield { type: 'error', message: errorMsg };
          }
        }
      }
      // Continue loop to get final response
      continue;
    }

    // No tool calls - stream the final response
    const stream = await llm.stream(currentMessages);

    for await (const chunk of stream) {
      const content =
        typeof chunk.content === 'string'
          ? chunk.content
          : Array.isArray(chunk.content)
            ? chunk.content
                .filter((c): c is { type: 'text'; text: string } => c.type === 'text')
                .map((c) => c.text)
                .join('')
            : '';

      if (content) {
        yield { type: 'content', content };
      }
    }

    break;
  }
}
