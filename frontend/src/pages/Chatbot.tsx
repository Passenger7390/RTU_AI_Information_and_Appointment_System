import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
// Import shadcn components (adjust paths based on your project structure)
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface Message {
  sender: "user" | "bot";
  text: string;
}

const Chatbot: React.FC = () => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Append user message
    const userMessage: Message = { sender: "user", text: query };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setQuery("");
    try {
      const res = await axios.post("http://localhost:8000/chat", { query });
      const botMessage: Message = { sender: "bot", text: res.data.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, an error occurred." },
      ]);
    } finally {
      setQuery("");
      setLoading(false);
    }
  };
  // TODO: Format the bot message
  return (
    <div className="max-w-6xl mx-auto my-10 p-4">
      <Card className="h-[80vh] flex flex-col">
        <CardHeader className="border-b">
          <CardTitle className="text-center text-xl font-semibold flex justify-center">
            <div className="">
              <Button>New chat</Button>
            </div>
            <div className="flex-1 justify-between items-center">
              RAY Chatbot
            </div>
            <div></div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-2 space-y-2 bg-blue-500">
          {messages.length === 0 ? ( // This block is a welcome message, this will disappear when the user asks RAY
            <div className="flex h-full items-center justify-center">
              <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold text-white">
                  Welcome to RAY Chatbot!
                </h1>
                <p className="text-lg text-gray-200">
                  Start a conversation by typing a message below.
                </p>
              </div>
            </div>
          ) : (
            <>
              {messages.map(
                (
                  msg,
                  index // This block is a chat message
                ) => (
                  <div
                    key={index}
                    className={`flex p-3 rounded-lg max-w-[75%] w-[fit-content] ${
                      msg.sender === "user"
                        ? "bg-yellow-500 text-black self-end justify-end ml-auto"
                        : "bg-blue-800 self-start justify-start mr-auto"
                    }`}
                  >
                    {msg.text}
                  </div>
                )
              )}
            </>
          )}
          {loading && ( // This block is a loading indicator
            <Skeleton className="h-20 max-w-[75%]" />
          )}
          <div ref={messagesEndRef} />
        </CardContent>
        <CardFooter className="p-5">
          <form onSubmit={handleSubmit} className="flex gap-2 w-full">
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button type="submit" disabled={loading}>
              Send
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Chatbot;
