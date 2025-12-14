// src/components/EmailValidator.tsx
import React, { useState } from "react";
import FileUpload from "./FileUpload";
import EmailBody from "./EmailBody";
import { analyzeHeuristics } from "../utility/emailHeuristics";

/**
 * Cyber Dark Mode — Email Validator
 * - Tabbed: Email Details | AI Analysis
 * - AI tab disabled until a file is uploaded (parsedData != null)
 * - Glass/Neon styling, hover + fade transitions via Tailwind
 */

const TabBtn: React.FC<{
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}> = ({ active, disabled, onClick, children }) => {
  const base = "px-4 py-2 rounded-lg text-sm font-medium transition transform duration-200";
  const activeStyle = "bg-gradient-to-r from-blue-500 to-cyan-400 text-black shadow-lg";
  const inactiveStyle = "bg-black/30 text-slate-200 hover:bg-black/40 hover:scale-[1.02]";
  const disabledStyle = "opacity-40 cursor-not-allowed grayscale";

  return (
    <button
      onClick={disabled ? undefined : onClick}
      className={`${base} ${active ? activeStyle : inactiveStyle} ${disabled ? disabledStyle : ""}`}
      aria-disabled={disabled}
    >
      {children}
    </button>
  );
};

const EmailValidator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"details" | "ai">("details");
  const [parsedData, setParsedData] = useState<any | null>(null);
  const [aiRunning, setAiRunning] = useState(false);
  const [aiResult, setAiResult] = useState<any | null>(null);

  const getRiskScore = () => {
    if (!parsedData?.heuristics) return 0;
    return parsedData.heuristics.riskSignals.length * 18;
  };

  const buildAiPayload = () => {
    if (!parsedData) return null;

    return {
      meta: {
        subject: parsedData.subject,
        from: parsedData.from,
        to: parsedData.to,
        date: parsedData.date
      },
      content: {
        bodyPreview: parsedData.body?.slice(0, 1000),
        urls: parsedData.urls || [],
        domains: parsedData.domains || []
      },
      heuristics: parsedData.heuristics,
      riskScore: getRiskScore(),
      instruction: "Analyze this email for phishing, spoofing, social engineering, and malware delivery techniques. Respond with verdict, reasoning, and confidence."
    };
  };

  // Called by FileUpload when it finishes parsing
  const handleDataExtracted = (data: any) => {
    // 1) compute heuristics using the utility
    const heuristics = analyzeHeuristics(data);

    // 2) store the parsed data plus heuristics in one object
    setParsedData({
      ...data,
      heuristics
    });

    // 3) UX: show the details tab and clear any prior AI results
    setActiveTab("details");
    setAiResult(null);
  };

  // Placeholder: simulate AI run (we will integrate actual AI later)
const runAiAnalysis = async () => {
  if (!parsedData) return;

  setAiRunning(true);
  setAiResult(null);

  try {
    const response = await fetch("/api/analyze-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(buildAiPayload())
    });

    if (!response.ok) {
      throw new Error("AI service failed");
    }

    const result = await response.json();

    setAiResult({
      verdict: result.verdict,
      score: result.score,
      highlights: result.highlights,
      explanation: result.explanation
    });
  } catch (err) {
    setAiResult({
      verdict: "Analysis Failed",
      score: 0,
      highlights: ["Unable to analyze email"],
      explanation: "AI service unreachable or returned invalid response."
    });
  } finally {
    setAiRunning(false);
  }
};


  return (
    <div className="min-h-[70vh] p-6">
      {/* Page header / hero */}
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
              PhishingGuard
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Validate .eml files and get an AI-assisted risk analysis.
            </p>
          </div>

          <div className="flex gap-3 items-center">
            <div className="text-xs px-3 py-2 rounded-md bg-black/30 border border-cyan-800 text-slate-200">
              <span className="text-cyan-300 font-medium">Cyber</span>{" "}
              <span className="opacity-70">Dark Mode</span>
            </div>
          </div>
        </div>

        {/* card */}
        <div className="bg-[rgba(10,12,18,0.6)] border border-[#07203b] backdrop-blur-md rounded-2xl p-6 shadow-2xl">
          {/* Tabs */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-3">
              <TabBtn
                active={activeTab === "details"}
                onClick={() => setActiveTab("details")}
              >
                Email Details
              </TabBtn>

              <TabBtn
                active={activeTab === "ai"}
                disabled={!parsedData}
                onClick={() => setActiveTab("ai")}
              >
                AI Analysis
              </TabBtn>
            </div>

            {/* small helper */}
            <div className="text-xs text-slate-400">
              {parsedData ? (
                <span className="text-slate-300">
                  Parsed:{" "}
                  <span className="text-cyan-300 font-medium">
                    {parsedData.from ?? "—"}
                  </span>
                </span>
              ) : (
                <span>Upload an .eml to enable AI</span>
              )}
            </div>
          </div>

          {/* content area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: main content */}
            <div className="lg:col-span-2">
              <div
                className="p-4 rounded-xl bg-gradient-to-b from-black/30 to-black/20 border border-[#073748] transition-opacity duration-300"
                key={activeTab}
              >
                {activeTab === "details" && (
                  <div className="space-y-4 text-slate-200">
                    {/* File upload */}
                    <div className="mb-4">
                      <FileUpload onDataExtracted={handleDataExtracted} />
                    </div>

                    {/* parsed info (if present) */}
                    {!parsedData ? (
                      <div className="p-6 rounded-lg bg-black/20 border border-[#052233]">
                        <p className="text-slate-400">
                          Upload an email to see parsed details here.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 rounded-lg border border-[#072b3a] bg-black/20">
                            <p className="text-xs text-slate-400">Subject</p>
                            <p className="text-sm mt-1 text-slate-100">
                              {parsedData.subject}
                            </p>
                          </div>

                          <div className="p-4 rounded-lg border border-[#072b3a] bg-black/20">
                            <p className="text-xs text-slate-400">From</p>
                            <p className="text-sm mt-1 text-slate-100">
                              {parsedData.from}
                            </p>
                          </div>

                          <div className="p-4 rounded-lg border border-[#072b3a] bg-black/20">
                            <p className="text-xs text-slate-400">To</p>
                            <p className="text-sm mt-1 text-slate-100">
                              {parsedData.to}
                            </p>
                          </div>

                          <div className="p-4 rounded-lg border border-[#072b3a] bg-black/20">
                            <p className="text-xs text-slate-400">Date</p>
                            <p className="text-sm mt-1 text-slate-100">
                              {parsedData.date
                                ? new Date(parsedData.date).toLocaleString()
                                : "(No Date)"}
                            </p>
                          </div>
                        </div>

                        {/* body preview card */}
                        <div className="mt-3 p-4 rounded-lg border border-[#073043] bg-black/10">
                          <p className="text-xs text-slate-400 mb-2">Body</p>
                          <div className="max-h-[360px] overflow-auto rounded-md p-3 bg-[#05070a] border border-[#03202a]">
                            <EmailBody body={parsedData.body} />
                          </div>
                        </div>

                        {/* urls + domains */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-3 rounded-lg border border-[#072b3a] bg-black/10">
                            <p className="text-xs text-slate-400 mb-2">Links</p>
                            {parsedData.urls?.length ? (
                              <ul className="list-disc ml-4 text-slate-200">
                                {parsedData.urls.map((u: string, i: number) => (
                                  <li key={i}>
                                    <a
                                      href={u}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-cyan-300 hover:underline"
                                    >
                                      {u}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-slate-400">No links found</p>
                            )}
                          </div>

                          <div className="p-3 rounded-lg border border-[#072b3a] bg-black/10">
                            <p className="text-xs text-slate-400 mb-2">
                              Extracted Domains
                            </p>
                            {parsedData.domains?.length ? (
                              <div className="flex flex-wrap gap-2">
                                {parsedData.domains.map((d: string, i: number) => (
                                  <span
                                    key={i}
                                    className="px-2 py-1 rounded-full bg-[#021824] border border-[#00475b] text-cyan-300 text-xs hover:scale-105 transition"
                                  >
                                    {d}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p className="text-slate-400">No domains</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Heuristic Signals */}
                    {parsedData?.heuristics && (
                      <div className="mt-6 p-4 rounded-lg border border-[#402020] bg-[#1a0e0e]">
                        <p className="text-xs text-red-400 font-semibold mb-2">
                          Detected Risk Signals
                        </p>

                        {parsedData.heuristics.riskSignals.length > 0 ? (
                          <ul className="list-disc ml-5 space-y-1">
                            {parsedData.heuristics.riskSignals.map((signal: string, i: number) => (
                              <li key={i} className="text-sm text-red-300">
                                {signal}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-slate-400">
                            No obvious risk indicators found.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "ai" && (
                  <div className="space-y-4 text-slate-200">
                    <div className="p-4 rounded-lg border border-[#072b3a] bg-black/20 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold">
                          AI Risk Analysis
                        </p>
                        <p className="text-xs text-slate-400">
                          Run AI to receive a risk score and explanation.
                        </p>
                      </div>

                      <div>
                        <button
                          className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-500 to-cyan-400 text-black font-medium hover:scale-105 transition"
                          onClick={runAiAnalysis}
                          disabled={!parsedData || aiRunning}
                        >
                          {aiRunning ? "Analyzing…" : "Run AI Analysis"}
                        </button>
                      </div>
                    </div>

                    {/* AI result area */}
                    {!parsedData ? (
                      /* 1️⃣ No email uploaded */
                      <div className="p-6 rounded-lg border border-[#072b3a] bg-black/20">
                        <p className="text-slate-400">
                          Upload an email to enable AI analysis.
                        </p>
                      </div>
                    ) : !aiResult ? (
                      /* 2️⃣ AI NOT RUN YET → SHOW PROMPT PREVIEW */
                      <div className="p-4 rounded-lg border border-[#073043] bg-black/10 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-cyan-300">
                              AI Prompt Preview
                            </p>
                            <p className="text-xs text-slate-400">
                              This is the data that will be sent to the AI engine
                            </p>
                          </div>

                          <button
                            className="px-3 py-2 text-xs rounded-md bg-[#001e2b] border border-[#003b4f] text-cyan-300 hover:scale-105 transition"
                            onClick={runAiAnalysis}
                          >
                            Run AI
                          </button>
                        </div>

                        <pre className="max-h-[400px] overflow-auto rounded-lg bg-[#05070a] p-4 text-xs text-slate-200 border border-[#03202a]">
                          {JSON.stringify(buildAiPayload(), null, 2)}
                        </pre>
                      </div>
                    ) : (
                      /* 3️⃣ AI RESULT */
                      <div className="p-4 rounded-lg border border-[#073043] bg-black/10 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-slate-300 font-semibold">
                              Verdict:
                              <span className="text-cyan-300 ml-2">
                                {aiResult.verdict}
                              </span>
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                              Score:
                              <span className="font-mono text-cyan-300 ml-1">
                                {aiResult.score}/100
                              </span>
                            </p>
                          </div>

                          <div className="px-3 py-2 rounded-md bg-[#001e2b] border border-[#003b4f]">
                            <p className="text-xs text-slate-400">Confidence</p>
                            <p className="text-sm text-cyan-300 font-semibold">
                              Medium
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-slate-400 mb-2">Highlights</p>
                          <ul className="list-disc ml-5">
                            {aiResult.highlights.map((h: string, i: number) => (
                              <li key={i} className="text-slate-200">
                                {h}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <p className="text-xs text-slate-400 mb-2">Explanation</p>
                          <p className="text-sm text-slate-200">
                            {aiResult.explanation}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right: quick summary / actions */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-[#032f3e] bg-gradient-to-b from-black/30 to-black/10">
                <p className="text-xs text-slate-400">Quick Actions</p>
                <div className="mt-3 flex flex-col gap-3">
                  <button className="px-3 py-2 rounded-md bg-[#001e2b] hover:bg-[#002a37] text-cyan-300 transition">
                    Quarantine
                  </button>
                  <button className="px-3 py-2 rounded-md bg-[#001e2b] hover:bg-[#002a37] text-cyan-300 transition">
                    Mark as Spam
                  </button>
                  <button className="px-3 py-2 rounded-md bg-[#001e2b] hover:bg-[#002a37] text-cyan-300 transition">
                    Export JSON
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-[#032f3e] bg-black/20">
                <p className="text-xs text-slate-400">Status</p>
                {parsedData && (
                  <div className="mt-4">
                    <p className="text-xs text-slate-400 mb-1">Risk Score</p>
                    <div className="w-full h-3 rounded-full bg-black/40 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          getRiskScore() > 60
                            ? "bg-red-500"
                            : getRiskScore() > 30
                            ? "bg-yellow-400"
                            : "bg-green-400"
                        }`}
                        style={{
                          width: `${Math.min(getRiskScore(), 100)}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      {getRiskScore()}/100
                    </p>
                  </div>
                )}

                <div className="mt-2">
                  <p className="text-sm text-slate-200">
                    Parsed:{" "}
                    <span className="text-cyan-300">{parsedData ? "Yes" : "No"}</span>
                  </p>
                  <p className="text-sm text-slate-200">
                    AI:{" "}
                    <span className="text-cyan-300">{aiResult ? "Done" : "Idle"}</span>
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-[#032f3e] bg-black/10">
                <p className="text-xs text-slate-400">Shortcuts</p>
                <div className="mt-2 flex flex-col gap-2">
                  <button className="text-left text-sm px-3 py-1 rounded hover:bg-black/20 transition text-slate-200">
                    View recent uploads
                  </button>
                  <button className="text-left text-sm px-3 py-1 rounded hover:bg-black/20 transition text-slate-200">
                    Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="mt-8 text-sm text-slate-500">
          Built with ❤️ — PhishingGuard
        </div>
      </div>
    </div>
  );
};

export default EmailValidator;