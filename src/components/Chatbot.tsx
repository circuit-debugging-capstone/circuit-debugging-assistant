import { useState } from "react";

export type ChatTurn = {
  role: "user" | "assistant";
  content: string;
};

type ChatbotProps = {
  referenceFile: File | null;
  photoFile: File | null;
};

const API_URL = import.meta.env.VITE_CHAT_API_URL || "/api/chat/";

export default function Chatbot({ referenceFile, photoFile }: ChatbotProps) {
  const [messages, setMessages] = useState<ChatTurn[]>([
    {
      role: "assistant",
      content:
        "Upload a reference circuit image and a breadboard photo, or ask a question about the loaded sample circuit.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    if (!referenceFile || !photoFile) {
      setError(
        "Both a Reference Schematic image (PNG/JPG/WebP) and an Actual Circuit Photo are required."
      );
      return;
    }

    setError(null);
    setIsLoading(true);

    // Keep only actual conversation turns (up to 12 prior turns per backend spec)
    const priorHistory = messages.slice(-12);

    const userTurn: ChatTurn = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userTurn]);
    setInput("");

    try {
      const formData = new FormData();
      formData.append("reference", referenceFile);
      formData.append("photo", photoFile);
      formData.append("message", trimmed);
      formData.append("history", JSON.stringify(priorHistory));

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errMsg =
          data.error ||
          data.detail ||
          JSON.stringify(data) ||
          `Server error (${response.status})`;
        throw new Error(errMsg);
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to connect to backend.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="w-120 border p-3 flex flex-col h-full">
      <div>
        <h2 className="font-bold">Circuit Photos Chat</h2>
      </div>

      <hr className="-mx-3 mt-3 mb-3" />

      <div className="space-y-3 min-h-0 flex-1 overflow-y-auto pr-1">
        {messages.map((turn, index) => (
          <div
            key={index}
            className={`flex ${
              turn.role === "user" ? "justify-start" : "justify-end"
            }`}
          >
            <p
              className={`border p-2 max-w-[85%] whitespace-pre-wrap ${
                turn.role === "user" ? "bg-white" : "bg-gray-100"
              }`}
            >
              {turn.content}
            </p>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-end">
            <p className="border p-2 bg-gray-50 text-gray-500 italic">
              Analyzing circuit images...
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-2 p-2 border border-red-400 bg-red-50 text-red-700 text-xs">
          {error}
        </div>
      )}

      <div className="flex gap-2 mt-3 shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
          placeholder="Ask about your circuit..."
          disabled={isLoading}
          className="flex-1 border px-3 py-2"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="border font-bold px-3 py-2 cursor-pointer disabled:opacity-50"
        >
          {isLoading ? "..." : "Send"}
        </button>
      </div>
    </section>
  );
}