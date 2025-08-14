import React, { useEffect, useMemo, useRef, useState } from "react";

type Mode = "general" | "interview" | "resume" | "storytelling";
type Role = "user" | "assistant";
type Msg = { role: Role; content: string };

// Read from Vite env (set in .env and/or Amplify).
const LAMBDA_URL: string | undefined = import.meta.env.VITE_MENTOR_API_URL;

const Mentorship: React.FC = () => {
  const [mode, setMode] = useState<Mode>("general");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "👋 Hi! I’m PMory Mentor. Pick a mode (general / interview / resume / storytelling). Click a sample to insert it, edit as you like, then press Send.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  const endRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const samples = useMemo<Record<Mode, string[]>>(
    () => ({
      general: [
        "Make me a 30-60-90 plan to break into PM from Emory.",
        "What are 3 concrete projects I can ship this month to show PM skills?",
        "How do I prioritize features for a campus dining app?",
      ],
      interview: [
        "Run a product sense mock about Spotify’s student plan.",
        "Execution round: reduce checkout drop-off by 20% for DoorDash.",
        "Estimation: How many umbrellas are sold in NYC each year?",
      ],
      resume: [
        "Rewrite these bullets to highlight impact for APM roles: [paste bullets].",
        "Turn this internship into 3 quantified resume bullets: [paste notes].",
        "Which metrics signal impact on my resume for product roles?",
      ],
      storytelling: [
        "Turn this experience into a 60s STAR story: [paste details].",
        "Coach me on a failure story that shows learning and ownership.",
        "Help me explain a tough stakeholder tradeoff I handled.",
      ],
    }),
    []
  );

  function insertSample(text: string) {
    setInput(text);
    textareaRef.current?.focus();
  }

  async function sendMessage(text?: string) {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    if (!LAMBDA_URL) {
      setMessages((m) => [
        ...m,
        { role: "user", content },
        {
          role: "assistant",
          content:
            "⚠️ Missing VITE_MENTOR_API_URL. Put your Lambda Function URL in the repo root .env and/or Amplify env vars.",
        },
      ]);
      return;
    }

    setInput("");
    setLoading(true);
    setLastError(null);
    setMessages((m) => [...m, { role: "user", content }]);

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 25000);

      const res = await fetch(LAMBDA_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content, mode }),
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (!res.ok) {
        const t = await res.text();
        throw new Error(`HTTP ${res.status} ${res.statusText}: ${t}`);
      }

      const data = await res.json();
      const answer = typeof data?.text === "string" ? data.text : "⚠️ Unexpected response.";
      setMessages((m) => [...m, { role: "assistant", content: answer }]);
    } catch (err: unknown) {
      const e = err as Error;
      const msg =
        e?.name === "TypeError" && /fetch/i.test(String(e?.message))
          ? "Failed to fetch (network/CORS). Check ALLOWED_ORIGIN in Lambda (no trailing slash) and verify the Function URL."
          : e?.message || String(err);
      setLastError(msg);
      setMessages((m) => [...m, { role: "assistant", content: `⚠️ Error: ${msg}` }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold text-gray-900">Mentorship</h1>
        <p className="text-gray-600 mt-2">
          Get guidance, ask questions, and explore insights with the PMory AI Mentor.
        </p>

        {/* Mode selector */}
        <div className="mt-4 flex gap-2 text-xs">
          {(["general", "interview", "resume", "storytelling"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1 rounded-full border capitalize ${
                mode === m ? "bg-emerald-600 text-white" : "bg-white"
              }`}
              aria-pressed={mode === m}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Samples: click = insert; arrow = send */}
        <div className="mt-4 grid sm:grid-cols-2 gap-2">
          {samples[mode].map((q) => (
            <div key={q} className="flex items-center gap-2">
              <button
                className="flex-1 text-left text-sm border rounded-xl px-3 py-2 bg-white hover:bg-gray-50"
                onClick={() => insertSample(q)}
                title="Insert into textbox so you can edit before sending"
              >
                {q}
              </button>
              <button
                className="shrink-0 text-xs border rounded-lg px-2 py-2 bg-white hover:bg-gray-50"
                onClick={() => sendMessage(q)}
                title="Send immediately"
              >
                ➤
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div className="max-w-3xl mx-auto px-4 pb-16">
        <div className="bg-white rounded-2xl border shadow-sm p-4">
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`px-4 py-2 rounded-2xl max-w-[80%] leading-relaxed ${
                    m.role === "user"
                      ? "bg-sky-50 border border-sky-200"
                      : "bg-emerald-50 border border-emerald-200"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <div className="mt-3 flex gap-2">
            <textarea
              ref={textareaRef}
              className="flex-1 resize-none rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              rows={1}
              placeholder="Ask about resumes, interviews, PRDs, roadmaps…"
              value={input}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <button
              className="rounded-xl px-4 py-2 bg-emerald-600 text-white disabled:opacity-50"
              onClick={() => sendMessage()}
              disabled={loading}
            >
              {loading ? "Thinking…" : "Send"}
            </button>
          </div>
        </div>
        
        {/* TEMP debug — remove later */}
<div className="mt-4 text-xs border rounded-xl bg-white p-3">
  <button
    className="border px-2 py-1 rounded mr-2"
    onClick={async () => {
      try {
        const res = await fetch(LAMBDA_URL!, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: "Ping", mode: "general" })
        });
        const txt = await res.text();
        alert(
          `Status: ${res.status}\n` +
          `ACAO: ${res.headers.get("access-control-allow-origin")}\n` +
          `Body: ${txt.slice(0, 200)}…`
        );
      } catch (e:any) {
        alert("Network error: " + e.message);
      }
    }}
  >
    Debug API Call
  </button>
  <span className="text-gray-500">Shows status, CORS header, and first 200 chars of the body.</span>
</div>


        {/* Tiny debug footer to diagnose CORS/URL */}
        <div className="text-[11px] text-gray-400 mt-2 space-y-1">
          <div>API URL seen by the browser: <code>{String(LAMBDA_URL || "undefined")}</code></div>
          <div>Origin: <code>{typeof window !== "undefined" ? window.location.origin : ""}</code></div>
          {lastError && <div className="text-amber-600">Last error: {lastError}</div>}
        </div>
      </div>
    </div>
  );
};

export default Mentorship;
