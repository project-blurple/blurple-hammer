export const trail = "…";
export function fitText(string: string, length: number, includeTrail = true): string {
  if (string.length <= length) return string;
  if (includeTrail) return `${string.slice(0, length - trail.length).trimEnd()}${trail}`;
  return string.slice(0, length);
}
