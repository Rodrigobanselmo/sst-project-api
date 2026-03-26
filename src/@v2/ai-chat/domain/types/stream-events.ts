export type AgentType = 'user' | 'document' | 'characterization' | 'general';

export type StreamEvent =
  | { type: 'content'; content: string }
  | { type: 'tool_start'; tool: string; args: Record<string, unknown>; description: string }
  | { type: 'tool_end'; tool: string; result: string; success: boolean }
  | { type: 'agent_start'; agent: AgentType; name: string; description: string }
  | { type: 'agent_end'; agent: AgentType; success: boolean }
  | { type: 'error'; message: string };
