import React from 'react';
import logo from './logo.svg';
import Navbar from "./components/Navbar";
import FileUpload from "./components/FileUpload";
import { useState } from "react";
import EmailModal from "./components/EmailModal";


function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [emailHtml, setEmailHtml] = useState("");

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex flex-col items-center justify-center px-4">
        <FileUpload 
   onHtmlExtracted={(html: string) => {
    setEmailHtml(html);
    setModalOpen(true);
  }}
/>
      </main>
    </div>
  );
}

export default App;

