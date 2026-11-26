"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

// The n8n Chat Trigger production URL (n8n/kynx-chatbot.json). Empty hides the chat.
export const chatUrl = "https://kynx.app.n8n.cloud/webhook/c7116de1-b42a-4a5f-bc30-d6f90a96b93d/chat";

const greeting = { from: "bot", text: "Hi! Ask me about KYNX artists, campaigns or working with us." };
const starters = ["Who are your artists?", "How do I start a campaign?", "How can I join as a creator?"];

const bubbleIcon = (
  <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
    <path fill="currentColor" d="M12 3C6.5 3 2 6.9 2 11.7c0 2.4 1.1 4.6 3 6.2-.2 1.3-.8 2.6-1.8 3.6 2 0 3.8-.7 5.1-1.7 1.2.3 2.4.5 3.7.5 5.5 0 10-3.9 10-8.6S17.5 3 12 3Zm-4.5 10a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6Zm4.5 0a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6Zm4.5 0a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6Z" />
  </svg>
);

function sessionId() {
  try {
    let id = sessionStorage.getItem("kynx-chat-session");
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem("kynx-chat-session", id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

export function ChatBot() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([greeting]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [seen, setSeen] = useState(false);
  const log = useRef(null);
  const input = useRef(null);

  useEffect(() => {
    if (open) input.current?.focus();
  }, [open]);

  useEffect(() => {
    log.current?.scrollTo({ top: log.current.scrollHeight });
  }, [messages, busy]);

  // Local preview shows the chat before n8n is connected; the live site waits for chatUrl.
  if (!chatUrl && process.env.NODE_ENV !== "development") return null;

  function toggle() {
    setOpen(!open);
    setSeen(true);
  }

  async function send(event, preset) {
    event.preventDefault();
    const text = (preset ?? draft).trim();
    if (!text || busy) return;
    setDraft("");
    setMessages((list) => [...list, { from: "me", text }]);
    if (!chatUrl) {
      setMessages((list) => [...list, { from: "bot", text: "Not connected yet. Add the n8n Production URL to chatUrl in components/ChatBot.js." }]);
      return;
    }
    setBusy(true);
    try {
      const response = await fetch(chatUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sendMessage", sessionId: sessionId(), chatInput: text, metadata: { page: pathname } }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const reply = (Array.isArray(data) ? data[0] : data)?.output;
      setMessages((list) => [...list, { from: "bot", text: reply || "Sorry, I have no answer for that. Try the contact page." }]);
    } catch {
      setMessages((list) => [...list, { from: "bot", text: "The chat is not reachable right now. Please try again, or use the contact page." }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="chatbot" onKeyDown={(event) => event.key === "Escape" && setOpen(false)}>
      {open ? (
        <section className="chatbot-panel" role="dialog" aria-label="KYNX chat">
          <header>
            <span className="chatbot-avatar" aria-hidden="true">K</span>
            <span className="chatbot-title"><strong>KYNX</strong><small>Usually replies in seconds</small></span>
            <button type="button" className="chatbot-close" aria-label="Close chat" onClick={() => setOpen(false)}>×</button>
          </header>
          <div className="chatbot-log" ref={log} aria-live="polite">
            {messages.map((message, index) => (
              <p key={index} className={`chatbot-msg ${message.from}`}>{message.text}</p>
            ))}
            {busy ? <p className="chatbot-msg bot typing">Typing…</p> : null}
            {messages.length === 1 && !busy ? (
              <div className="chatbot-starters">
                {starters.map((question) => (
                  <button key={question} type="button" onClick={(event) => send(event, question)}>{question}</button>
                ))}
              </div>
            ) : null}
          </div>
          <form onSubmit={send}>
            <input ref={input} value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Type a message" aria-label="Message" maxLength={1000} />
            <button type="submit" className="join" disabled={busy || !draft.trim()}>Send</button>
          </form>
        </section>
      ) : null}
      {!open && !seen ? <p className="chatbot-tooltip" aria-hidden="true">Hello 👋 do you have any questions?</p> : null}
      <button type="button" className="chatbot-toggle" aria-expanded={open} aria-label={open ? "Close chat" : "Open chat"} onClick={toggle}>
        {open ? <span aria-hidden="true">×</span> : bubbleIcon}
      </button>
    </div>
  );
}
