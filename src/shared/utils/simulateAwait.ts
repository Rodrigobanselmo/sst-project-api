export function simulateAwait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
