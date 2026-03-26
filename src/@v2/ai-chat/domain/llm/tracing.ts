import { RunTree } from 'langsmith';
import { CallbackManager } from '@langchain/core/callbacks/manager';
import { LangChainTracer } from '@langchain/core/tracers/tracer_langchain';

/**
 * Creates a LangChain CallbackManager linked to a RunTree parent.
 * LLM calls using this as `callbacks` will appear as children of the parent RunTree
 * in LangSmith, and the existing auto-tracer won't duplicate because
 * CallbackManager deduplicates handlers named "langchain_tracer".
 */
export function createTracingCallbacks(parentRun: RunTree): CallbackManager {
  const projectName = process.env.LANGCHAIN_PROJECT || 'default';
  const tracer = new LangChainTracer({ projectName });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- langsmith version mismatch between root and @langchain/core
  tracer.updateFromRunTree(parentRun as any);

  const manager = new CallbackManager(parentRun.id);
  manager.addHandler(tracer, true);
  return manager;
}

/**
 * Creates a child RunTree under a parent, posts it to LangSmith,
 * and returns the child + a callbacks manager for LLM calls within this child.
 */
export async function createChildRun(
  parent: RunTree,
  name: string,
  options?: { run_type?: 'chain' | 'tool' | 'llm'; tags?: string[]; inputs?: Record<string, unknown> },
): Promise<{ childRun: RunTree; callbacks: CallbackManager }> {
  const childRun = parent.createChild({
    name,
    run_type: options?.run_type ?? 'chain',
    inputs: options?.inputs,
    tags: options?.tags,
  });

  await childRun.postRun();

  return { childRun, callbacks: createTracingCallbacks(childRun) };
}

/**
 * Ends a RunTree (success or error) and patches it to LangSmith.
 */
export async function endRun(run: RunTree, result?: { outputs?: Record<string, unknown>; error?: string }): Promise<void> {
  if (result?.error) {
    await run.end({ error: result.error });
  } else {
    await run.end(result?.outputs ? { outputs: result.outputs } : undefined);
  }
  await run.patchRun();
}
