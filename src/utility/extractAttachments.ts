export interface ParsedAttachment {
  filename: string;
  mimeType: string;
  content: string; // base64
  size: number;
}

export const extractAttachments = (attachments: any[] = []): ParsedAttachment[] => {
  return attachments.map(att => ({
    filename: att.filename || "unknown",
    mimeType: att.contentType || "application/octet-stream",
    content: att.data || "",
    size: att.data ? Buffer.from(att.data, "base64").length : 0,
  }));
};
