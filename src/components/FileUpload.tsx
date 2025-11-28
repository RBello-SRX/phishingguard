import { useState } from "react";
import { extractEmailData } from "../utility/parseEml";
import EmailBody from "./EmailBody";
import { sanitizeHtml } from "../utility/sanitizeHTML";
import { extractDomains } from "../utility/extractDomain";




interface FileUploadProps {
  onHtmlExtracted: (html: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onHtmlExtracted }) => {
  const [fileName, setFileName] = useState("");
  const [emailData, setEmailData] = useState<any>(null);
  const [domains, setDomains] = useState<string[]>([]);



  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setFileName(file.name);
  const text = await file.text();

  try {
    const data = extractEmailData(text);           // existing parser
    setEmailData(data);

    // NEW: Extract domains
    const domains = extractDomains(data.htmlBody, data.body);

    console.log("Extracted domains:", domains);

    // Store in state if you want to display it later
    setDomains(domains);

  } catch (err) {
    console.error("Parsing failed:", err);
  }
};

  return (
    <div className="mt-10 mx-auto w-full max-w-md p-4 bg-white rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-2">Upload Email File (.eml)</h2>

      <input
        type="file"
        accept=".eml"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
      />

      {fileName && (
        <p className="mt-2 text-sm text-green-700">Selected: {fileName}</p>
      )}

      {emailData && (
        <div className="mt-4 text-left text-sm text-gray-800 space-y-1">
          <p><strong>Subject:</strong> {emailData.subject}</p>
          <p><strong>From:</strong> {emailData.from}</p>
          <p><strong>To:</strong> {emailData.to}</p>
          <p>
            <strong>Date:</strong>{" "}
            {emailData.date
              ? new Date(emailData.date).toLocaleString()
              : "(No Date)"}
          </p>

          <hr className="my-2" />

          <EmailBody body={emailData.body} />
        </div>
      )}
    </div>
  );
};

export default FileUpload;


