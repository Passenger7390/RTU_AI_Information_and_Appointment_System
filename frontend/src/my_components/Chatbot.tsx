import React, { useState, useRef, useEffect } from "react";
// Import shadcn components (adjust paths based on your project structure)
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getChatbotResponse, getFAQs } from "@/api";
import MarkdownResponse from "@/my_components/MarkdownResponse";
import { KeyboardInput } from "./KeyboardInput";
import { FAQ, Message } from "@/interface";

const Chatbot: React.FC = () => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [faqs, setFaqs] = useState([]);

  async function fetchFAQs() {
    const res = await getFAQs();
    setFaqs(res);
  }

  const newChat = () => {
    fetchFAQs();
    setMessages([]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!query.trim()) return;

    // Append user message
    const userMessage: Message = { sender: "user", text: query };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setQuery("");
    try {
      const res = await getChatbotResponse(query);

      if (res.suggestions) {
        const botMessage: Message = {
          sender: "bot",
          text: res.response,
        };
        setMessages((prev) => [...prev, botMessage]);
        const suggestionsMessage: Message = {
          sender: "bot",
          text: res.suggestions.join(", "),
        };
        setMessages((prev) => [...prev, suggestionsMessage]);
      } else {
        const botMessage: Message = {
          sender: "bot",
          text: res.response,
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, an error occurred." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setQuery(query);
    setLastActivity(Date.now());

    if (query && !isTyping) {
      setIsTyping(true);
    } else if (!query && isTyping) {
      setIsTyping(false);
    }
  };

  async function handleChooseFAQ(question: string) {
    // No need to set query in the input field first
    const userMessage: Message = { sender: "user", text: question };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await getChatbotResponse(question);

      if (res.suggestions) {
        const botMessage: Message = {
          sender: "bot",
          text: res.response,
        };
        setMessages((prev) => [...prev, botMessage]);
        const suggestionsMessage: Message = {
          sender: "bot",
          text: res.suggestions.join(", "),
        };
        setMessages((prev) => [...prev, suggestionsMessage]);
      } else {
        const botMessage: Message = {
          sender: "bot",
          text: res.response,
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, an error occurred." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // The timer will check for inactivity every two seconds
    const inactivityTimer = setInterval(() => {
      const now = Date.now();
      const inactiveTime = now - lastActivity; // This will measure the inactive time of the user
      if (inactiveTime > 60000 && messages.length > 0 && isTyping) {
        // If the inactive time exceeds 60 seconds, the chat will be reset
        newChat();
        setQuery("");
      }
    }, 5000);

    return () => clearInterval(inactivityTimer);
  }, [lastActivity, messages, isTyping]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetchFAQs();
  }, []);

  return (
    <div className="w-3/4 h-full mx-auto my-auto p-2">
      <Card className="h-[95vh] flex flex-col bg-blue-800">
        <CardHeader className="border-b">
          <CardTitle className="text-center text-xl font-semibold flex justify-center h-10 items-center">
            <div className="w-24">
              <Button
                variant="secondary"
                onClick={newChat}
                className="bg-black text-white"
              >
                New chat
              </Button>
            </div>
            <div className="flex-1 justify-between items-center text-white">
              RAY Chatbot
            </div>
            <div className="w-24"></div>
          </CardTitle>
        </CardHeader>
        <CardContent
          className="flex-1 overflow-y-auto p-2 space-y-2 bg-blue-400"
          onScroll={() => setLastActivity(Date.now())}
        >
          {messages.length === 0 ? ( // This block is a welcome message, this will disappear when the user asks RAY
            <div className="flex h-[95%] items-center justify-center flex-col space-y-10">
              <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold text-white">
                  Welcome to RAY Chatbot!
                </h1>
                <p className="text-lg text-gray-200">
                  Start a conversation by typing a message below.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {faqs
                  .filter((faq: FAQ) => faq.isPinned)
                  .map((faq: FAQ) => (
                    <Button onClick={() => handleChooseFAQ(faq.question)}>
                      {faq.question}
                    </Button>
                  ))}
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
                    className={`flex p-3 rounded-lg max-w-[75%] w-[fit-content] my-10 ${
                      msg.sender === "user"
                        ? "bg-yellow-500 text-black self-end justify-end ml-auto"
                        : "bg-white self-start justify-center items-center mr-auto"
                    }`}
                  >
                    <MarkdownResponse response={msg.text} />
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
          {/* <form
            onSubmit={handleSubmit}
            className="flex gap-2 w-full border border-yellow-500"
          > */}
          <KeyboardInput
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-1 !text-lg !text-black !bg-white rounded-md p-2"
            keyboardType="alphanumeric"
          />
          <Button
            type="submit"
            disabled={loading}
            onClick={handleSubmit}
            className="bg-yellow-500"
          >
            Send
          </Button>
          {/* </form> */}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Chatbot;
