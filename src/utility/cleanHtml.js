import { convert } from 'html-to-text';

export function cleanHtml(html) {
  if (!html || typeof html !== "string") return "";

  // Convert HTML → Readable plain text
  const text = convert(html, {
    wordwrap: false,
    selectors: [
      { selector: 'img', format: 'skip' },   // ignore images
      { selector: 'a', options: { hideLinkHrefIfSameAsText: true } }
    ]
  });

  return text.trim();
}
