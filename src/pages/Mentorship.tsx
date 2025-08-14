import React, { useEffect, useRef, useState } from "react";

const LAMBDA_URL = "https://x667bbpbo6wf22bvoi27xmob3y0nrecg.lambda-url.us-east-1.on.aws/"; // <-- paste yours

type Role = "user" | "assistant";
type Msg = { role: Role; content: string };

const Mentorship: React.FC = () => {
  const [mode, setMode] = useState<"general"|"interview"|"resume"|"storytelling">("general");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "👋 Hi! I’m PMory Mentor. Ask me about resumes, interviews, PRDs, or storytelling. Pick a mode below if you like." }
  ]);
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function sendMessage(text?: string) {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    setInput("");
    setLoading(true);
    setMessages(m => [...m, { role: "user", content }]);

    try {
      const res = await fetch(LAMBDA_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content, mode })
      });
      const data = await res.json();
      setMessages(m => [...m, { role: "assistant", content: data.text || "⚠️ No response" }]);
    } catch (e:any) {
      setMessages(m => [...m, { role: "assistant", content: `⚠️ Error: ${e.message}` }]);
    } finally {
      setLoading(false);
    }
  }

  const quickStarts = [
    "How do I frame my internship impact for an APM resume?",
    "Run a product sense mock interview about Spotify student plan",
    "Make me a 30-60-90 plan to break into PM from Emory",
    "Turn this experience into a 60s STAR story: [paste details here]"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold text-gray-900">Mentorship</h1>
        <p className="text-gray-600 mt-2">Get guidance, ask questions, and explore insights with the PMory AI Mentor.</p>

        {/* Mode selector */}
        <div className="mt-4 flex gap-2 text-xs">
          {(["general","interview","resume","storytelling"] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1 rounded-full border ${mode===m ? "bg-emerald-600 text-white" : "bg-white"}`}
            >{m}</button>
          ))}
        </div>

        {/* Quick starts */}
        <div className="mt-4 grid sm:grid-cols-2 gap-2">
          {quickStarts.map(q => (
            <button
              key={q}
              className="text-left text-sm border rounded-xl px-3 py-2 bg-white hover:bg-gray-50"
              onClick={() => sendMessage(q)}
            >{q}</button>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div className="max-w-3xl mx-auto px-4 pb-16">
        <div className="bg-white rounded-2xl border shadow-sm p-4">
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role==="user" ? "justify-end" : "justify-start"}`}>
                <div className={`px-4 py-2 rounded-2xl max-w-[80%] leading-relaxed ${
                  m.role==="user" ? "bg-sky-50 border border-sky-200" : "bg-emerald-50 border border-emerald-200"
                }`}>{m.content}</div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <div className="mt-3 flex gap-2">
            <textarea
              className="flex-1 resize-none rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              rows={1}
              placeholder="Ask about resumes, interviews, PRDs, roadmaps…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => (e.key === "Enter" && !e.shiftKey ? (e.preventDefault(), sendMessage()) : null)}
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
      </div>
    </div>
  );
};

export default Mentorship;
