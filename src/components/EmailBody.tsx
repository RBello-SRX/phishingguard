import React, { useState } from "react";

interface Props {
  body: string;
  htmlBody?: string;
}

const EmailBody = ({ body, htmlBody }: Props) => {
  const [showFull, setShowFull] = useState(false);

  const finalHtml = htmlBody || body;

  return (
    <div className="mt-2">
      {/* Render HTML safely */}
      <div
        className="bg-gray-100 p-3 rounded text-sm prose max-w-none"
        dangerouslySetInnerHTML={{
          __html: showFull
            ? finalHtml
            : finalHtml.slice(0, 800) + (finalHtml.length > 800 ? "..." : "")
        }}
      />

      {finalHtml.length > 800 && (
        <button
          className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm"
          onClick={() => setShowFull(!showFull)}
        >
          {showFull ? "Hide" : "View Full Content"}
        </button>
      )}
    </div>
  );
};

export default EmailBody;
