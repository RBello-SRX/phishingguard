import { parseEml, readEml } from "@vortiq/eml-parse-js";
import { normalizeAddress } from "./normalizeEmailAddress";
import { normalizeDate } from "./normalizeDate";
import { extractUrls } from "./extractURLs";
import { extractDomains } from "./extractDomain";   // ⭐ ADD THIS


export const extractEmailData = (text: string) => {
  const parsed = parseEml(text);
  const data = readEml(parsed);

  // Extract URLs
  const urls = extractUrls(data.text || "");



  // Extract domains (from html + text)
  const domains = extractDomains(
    data.html || "",
    data.text || ""
  );

  return {
    subject: data.subject || "(No Subject)",
    from: normalizeAddress(data.from?.[0]?.email) || "(Unknown Sender)",
    to: normalizeAddress(data.to?.[0]?.email) || "(Unknown Recipient)",
    date: normalizeDate(data.date) || "(No Date)",

    // Body priority
    body: data.text || data.html || "(No Body Content)",

    // Keep raw HTML for analysis
    htmlBody: data.html || "",

    // Outputs
    urls,
    domains,    // ⭐ Now added
  };
};
