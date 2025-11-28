// src/utility/extractLinks.ts
export function extractLinks(text: string): string[] {
  if (!text) return [];

  const urlRegex =
    /\bhttps?:\/\/[^\s"'<>]+/gi;

  const matches = text.match(urlRegex);
  return matches ? Array.from(new Set(matches)) : [];
}