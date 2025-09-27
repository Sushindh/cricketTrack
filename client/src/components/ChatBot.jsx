import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const ChatBot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { type: "bot", content: "Hello! Ask me anything about cricket." }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { type: "user", content: input }]);
    setLoading(true);
    try {
      const result = await model.generateContent(input);
      setMessages(prev => [
        ...prev,
        { type: "bot", content: result.response.text() }
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        { type: "bot", content: "Error: Could not get response from Gemini." }
      ]);
    }
    setLoading(false);
    setInput("");
  };

  return (
    <div className="bg-white border-2 border-gray-200 rounded-2xl p-3 flex flex-col h-80">
      <div className="flex-1 overflow-y-auto mb-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`my-2 flex ${m.type === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-2xl border font-medium ${
                m.type === "user"
                  ? "bg-blue-500 text-white border-blue-700"
                  : "bg-gray-100 text-black border-gray-300"
              }`}
            >
              <ReactMarkdown>{m.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="max-w-xs px-4 py-2 rounded-2xl border bg-gray-100 text-black border-gray-300">
              <span>Gemini is typing...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 px-4 py-1 border-2 border-gray-300 rounded-xl"
          placeholder="Type your cricket question..."
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading}
          onKeyDown={e => {
            if (e.key === "Enter") send();
          }}
        />
        <button
          className="px-4 py-1 bg-blue-500 text-white border-2 border-blue-700 rounded-xl font-bold"
          onClick={send}
          disabled={loading}
        >
          Send
        </button>
        <button
          className="px-4 py-1 bg-gray-300 text-black border-2 border-gray-700 rounded-xl font-bold"
          onClick={() => setMessages([{ type: "bot", content: "Hello! Ask me anything about cricket." }])}
          disabled={loading}
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
