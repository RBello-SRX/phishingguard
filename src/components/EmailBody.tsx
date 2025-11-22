import { useState } from "react";

interface EmailBodyProps {
  body: string;
}

const EmailBody: React.FC<EmailBodyProps> = ({ body }) => {
  const [showFull, setShowFull] = useState(false);

  const preview = body.slice(0, 300); // first 300 chars

  const isHtml = body.trim().startsWith("<");

  return (
    <div className="mt-3">
      <p className="font-semibold">Body:</p>

      {/* Preview Box */}
      <div className="bg-gray-100 p-3 rounded text-xs whitespace-pre-wrap border">
        {!showFull ? (
          <>
            {preview}
            {body.length > 300 && (
              <span className="text-blue-500"> ...</span>
            )}
          </>
        ) : (
          <div>
            {isHtml ? (
              <pre className="whitespace-pre-wrap">
                {body}
              </pre>
            ) : (
              body
            )}
          </div>
        )}
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setShowFull(!showFull)}
        className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-xs"
      >
        {showFull ? "Hide Full Content" : "View Full Content"}
      </button>
    </div>
  );
};

export default EmailBody;
