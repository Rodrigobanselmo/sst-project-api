export function hasAcgihCeilingMarker(value?: string | null): boolean {
  if (!value?.trim()) return false;
  const normalized = value.trim();

  return (
    /\bC(eiling)?\b/i.test(normalized) ||
    /\bC$/i.test(normalized) ||
    /\(C\)/i.test(normalized)
  );
}
