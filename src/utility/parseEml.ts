import { parseEml, readEml } from "@vortiq/eml-parse-js";
import { normalizeAddress } from "./normalizeEmailAddress";
import { normalizeDate } from "./normalizeDate";


export const extractEmailData = (text: string) => {
  const parsed = parseEml(text);
  const data = readEml(parsed);

 return {
  subject: data.subject || "(No Subject)",
  from: normalizeAddress(data.from?.[0]),
  to: normalizeAddress(data.to?.[0]),
  date: normalizeDate(data.date),
  body: data.text || data.html || "(No Body Content)",
};

};
