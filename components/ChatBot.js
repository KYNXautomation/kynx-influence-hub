"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

// The n8n Chat Trigger production URL (n8n/kynx-chatbot.json). Empty hides the chat.
export const chatUrl = "";

const greeting = { from: "bot", text: "Hi! Ask me about KYNX artists, campaigns or working with us." };

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
  const log = useRef(null);
  const input = useRef(null);

  useEffect(() => {
    if (open) input.current?.focus();
  }, [open]);

  useEffect(() => {
    log.current?.scrollTo({ top: log.current.scrollHeight });
  }, [messages, busy]);

  if (!chatUrl) return null;

  async function send(event) {
    event.preventDefault();
    const text = draft.trim();
    if (!text || busy) return;
    setDraft("");
    setMessages((list) => [...list, { from: "me", text }]);
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
            <strong>KYNX chat</strong>
            <button type="button" className="chatbot-close" aria-label="Close chat" onClick={() => setOpen(false)}>×</button>
          </header>
          <div className="chatbot-log" ref={log} aria-live="polite">
            {messages.map((message, index) => (
              <p key={index} className={`chatbot-msg ${message.from}`}>{message.text}</p>
            ))}
            {busy ? <p className="chatbot-msg bot typing">Typing…</p> : null}
          </div>
          <form onSubmit={send}>
            <input ref={input} value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Type a message" aria-label="Message" maxLength={1000} />
            <button type="submit" className="join" disabled={busy || !draft.trim()}>Send</button>
          </form>
        </section>
      ) : null}
      <button type="button" className="chatbot-toggle" aria-expanded={open} aria-label={open ? "Close chat" : "Open chat"} onClick={() => setOpen(!open)}>
        {open ? "×" : "Chat"}
      </button>
    </div>
  );
}
