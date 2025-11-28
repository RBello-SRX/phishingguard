export const extractDomains = (html: string, text: string) => {
  const content = `${html}\n${text}`;

  // Extract from email-like patterns
  const emailRegex = /[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;

  // Extract URL domains
  const urlRegex = /https?:\/\/([^\/\s]+)/g;

  const domains: string[] = [];

  let match;

  // Emails → domains
  while ((match = emailRegex.exec(content)) !== null) {
    domains.push(match[1]);
  }

  // URLs → domains
  while ((match = urlRegex.exec(content)) !== null) {
    domains.push(match[1]);
  }

  // Remove duplicates
  return Array.from(new Set(domains));
};
