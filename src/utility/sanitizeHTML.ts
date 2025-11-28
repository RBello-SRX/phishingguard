export function sanitizeHtml(html: string): string {
  if (!html) return "";

  let cleaned = html;

  // Remove script tags
  cleaned = cleaned.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");

  // Remove iframes
  cleaned = cleaned.replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, "");

  // Remove base64 images (common phishing tracker trick)
  cleaned = cleaned.replace(/src=["']data:image\/[^"']+["']/gi, 'src=""');

  // Remove javascript: URLs
  cleaned = cleaned.replace(/href=["']javascript:[^"']*["']/gi, 'href="#"');

  return cleaned.trim();
}
