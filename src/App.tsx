import React from 'react';
import logo from './logo.svg';
import Navbar from "./components/Navbar";
import FileUpload from "./components/FileUpload";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex flex-col items-center justify-center px-4">
        <FileUpload />
      </main>
    </div>
  );
}

export default App;

