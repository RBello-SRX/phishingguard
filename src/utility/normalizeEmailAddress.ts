export function normalizeAddress(entry: any): string {
  if (!entry) return "(Unknown)";

  // Case 1: Already structured by parser
  if (typeof entry === "object" && entry.email) {
    return entry.email;
  }

  // Case 2: Raw string formats
  if (typeof entry === "string") {
    // Extract email inside <...> if present
    const match = entry.match(/<([^>]+)>/);
    if (match) return match[1];

    // Otherwise assume it's already the email
    return entry.trim();
  }

  return "(Unknown)";
}
