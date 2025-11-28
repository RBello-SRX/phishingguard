import React from "react";

interface EmailModalProps {
  open: boolean;
  onClose: () => void;
  html: string;
}

const EmailModal: React.FC<EmailModalProps> = ({ open, onClose, html }) => {
  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div className="bg-white w-[90%] max-w-3xl p-4 rounded shadow-xl overflow-y-auto max-h-[85vh]">
        <button 
          className="mb-4 bg-red-500 text-white px-3 py-1 rounded"
          onClick={onClose}
        >
          Close
        </button>

        {/* Render sanitized HTML safely */}
        <div 
          dangerouslySetInnerHTML={{ __html: html }} 
        />
      </div>
    </div>
  );
};

export default EmailModal;
