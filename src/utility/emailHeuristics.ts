// src/utility/emailHeuristics.ts

export const analyzeHeuristics = (data: any) => {
  const signals: string[] = [];

  // 1. From vs Domain mismatch
  const fromDomain =
    data.from && data.from.includes("@")
      ? data.from.split("@")[1]
      : "";

  const domainMismatch =
    fromDomain &&
    data.domains &&
    data.domains.length > 0 &&
    !data.domains.includes(fromDomain);

  if (domainMismatch) {
    signals.push("Sender domain does not match any linked domain");
  }

  // 2. IP-based links
  const ipLink = data.urls?.some((url: string) =>
    /^https?:\/\/\d{1,3}(\.\d{1,3}){3}/.test(url)
  );

  if (ipLink) {
    signals.push("IP-based link detected");
  }

  // 3. Urgency keywords
  const urgencyWords = [
    "urgent",
    "immediately",
    "verify",
    "suspended",
    "action required",
    "confirm",
    "reset password"
  ];

  const bodyLower = (data.body || "").toLowerCase();
  const urgencyFound = urgencyWords.some(word =>
    bodyLower.includes(word)
  );

  if (urgencyFound) {
    signals.push("Urgency language detected");
  }

  // 4. External link count
  const externalLinks = data.urls?.length || 0;
  if (externalLinks > 2) {
    signals.push("Multiple external links detected");
  }

  return {
    senderDomain: fromDomain,
    suspiciousDomains: data.domains || [],
    externalLinks,
    hasIpLinks: !!ipLink,
    fromDomainMismatch: !!domainMismatch,
    urgencyDetected: urgencyFound,
    riskSignals: signals
  };
};
