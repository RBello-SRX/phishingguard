import { parseEml, readEml } from "@vortiq/eml-parse-js";

export const extractEmailData = (text: string) => {
  const parsed = parseEml(text);
  const data = readEml(parsed);

  return {
    subject: data.subject || "(No Subject)",
    from: data.from?.[0]?.email || "(Unknown Sender)",
    to: data.to?.[0]?.email || "(Unknown Recipient)",
    date: data.date || "(No Date)",
    body: data.text || data.html || "(No Body Content)",
  };
};
