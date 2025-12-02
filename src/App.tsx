import React from "react";
import Navbar from "./components/Navbar";
import EmailValidator from "./components/EmailValidator";

function App() {
  return (
    <div className="min-h-screen bg-[#03050a]">
      <Navbar />
      <main className="py-8">
        <EmailValidator />
      </main>
    </div>
  );
}

export default App;
