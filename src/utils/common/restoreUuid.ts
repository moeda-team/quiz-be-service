export function restoreUUID(tokenNoDash: string): string {
  if (!tokenNoDash || tokenNoDash.length !== 32) return tokenNoDash; // fallback

  return (
    tokenNoDash.substring(0, 8) +
    '-' +
    tokenNoDash.substring(8, 12) +
    '-' +
    tokenNoDash.substring(12, 16) +
    '-' +
    tokenNoDash.substring(16, 20) +
    '-' +
    tokenNoDash.substring(20)
  );
}
