export function normalizeDate(input: any): string {
  if (!input) return "(No Date)";

  try {
    // If it's already a Date object
    if (input instanceof Date) {
      return input.toISOString(); // or any format you prefer
    }

    // If it's a string the browser can parse
    const parsed = new Date(input);
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }

    // If unrecognized format
    return "(Invalid Date)";
  } catch {
    return "(Invalid Date)";
  }
}
