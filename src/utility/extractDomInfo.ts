// src/utility/extractDomInfo.ts

export function extractDomInfo(html: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const links: string[] = [];
  const domains: string[] = [];
  const forms: string[] = [];
  const buttons: string[] = [];

  // Extract links
  doc.querySelectorAll("a[href]").forEach(a => {
    const href = a.getAttribute("href") || "";
    links.push(href);

    try {
      const url = new URL(href);
      domains.push(url.hostname);
    } catch {}
  });

  // Extract forms
  doc.querySelectorAll("form").forEach(form => {
    forms.push(form.outerHTML);
  });

  // Extract clickable buttons
  doc.querySelectorAll("button, input[type='button'], input[type='submit']").forEach(btn => {
    buttons.push(btn.outerHTML);
  });

  // Suspicious patterns
  const suspicious = {
    hasBase64Images: html.includes("data:image/"),
    hasJavascriptLinks: html.includes("javascript:"),
    hasIPDomains: domains.some(d => /^\d+\.\d+\.\d+\.\d+$/.test(d)),
    hasShorteners: domains.some(d =>
      ["bit.ly", "t.co", "tinyurl.com", "is.gd", "buff.ly"].includes(d)
    )
  };

  return {
    links,
    domains: Array.from(new Set(domains)),
    forms,
    buttons,
    suspicious
  };
}
