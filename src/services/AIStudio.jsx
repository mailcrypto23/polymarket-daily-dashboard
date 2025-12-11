// src/pages/AIStudio.jsx
import React, { useState } from "react";

export default function AIStudio() {
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function run() {
    if (!prompt) return;
    setLoading(true);
    setAnswer("");
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      setAnswer(data.text || JSON.stringify(data));
    } catch (e) {
      setAnswer("AI request failed: " + e.message);
    } finally { setLoading(false); }
  }

  return (
    <div style={{ padding: 12 }}>
      <h2>AI Studio — Market Explainer</h2>
      <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={6} style={{ width: "100%" }} placeholder="Ask market question e.g. 'Explain why ETH probability moved 10% today'"></textarea>
      <div style={{ marginTop: 8 }}>
        <button onClick={run} disabled={loading || !prompt}>Run</button>
      </div>
      <div style={{ marginTop: 12, whiteSpace: "pre-wrap" }}>
        {loading ? "Thinking..." : answer}
      </div>
    </div>
  );
}
