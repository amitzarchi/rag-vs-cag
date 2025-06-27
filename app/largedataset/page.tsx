"use client";

import { useChat } from "@ai-sdk/react";
import { Bot, Clock, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { MemoizedMarkdown } from "../chat/components/memoized-markdown";
import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { useStopwatch } from "react-timer-hook";
import { ToolInvocation } from "../app/chat/components/tools";

export default function LargeDatasetChat() {
  const [sharedInput, setSharedInput] = useState("");

  // Timer for first chat (RAG)
  const {
    milliseconds: timer1Milliseconds,
    totalSeconds: timer1Seconds,
    minutes: timer1Minutes,
    seconds: timer1Secs,
    isRunning: timer1Running,
    start: startTimer1,
    pause: pauseTimer1,
    reset: resetTimer1,
  } = useStopwatch({ autoStart: false, interval: 10 });

  // Timer for second chat (CAG)
  const {
    milliseconds: timer2Milliseconds,
    totalSeconds: timer2Seconds,
    minutes: timer2Minutes,
    seconds: timer2Secs,
    isRunning: timer2Running,
    start: startTimer2,
    pause: pauseTimer2,
    reset: resetTimer2,
  } = useStopwatch({ autoStart: false, interval: 10 });

  // First chat instance for /api/largedataset/rag
  const { 
    messages: messages1, 
    handleSubmit: handleSubmit1, 
    status: status1,
    append: append1 
  } = useChat({
    api: "/api/largedataset/rag",
    maxSteps: 5,
    async onToolCall({ toolCall }) {
      // Tool calls will be handled by the server
    },
  });

  // Second chat instance for /api/largedataset/cag
  const { 
    messages: messages2, 
    handleSubmit: handleSubmit2, 
    status: status2,
    append: append2 
  } = useChat({
    api: "/api/largedataset/cag",
    maxSteps: 5,
    async onToolCall({ toolCall }) {
      // Tool calls will be handled by the server
    },
  });

  // Effect to stop timer1 when chat1 response is complete
  useEffect(() => {
    if (status1 === "submitted" && !timer1Running) {
      startTimer1();
    } else if (status1 !== "submitted" && timer1Running) {
      pauseTimer1();
    }
  }, [status1, timer1Running, startTimer1, pauseTimer1]);

  // Effect to stop timer2 when chat2 response is complete
  useEffect(() => {
    if (status2 === "submitted" && !timer2Running) {
      startTimer2();
    } else if (status2 !== "submitted" && timer2Running) {
      pauseTimer2();
    }
  }, [status2, timer2Running, startTimer2, pauseTimer2]);

  const handleSharedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sharedInput.trim()) return;

    // Reset both timers
    resetTimer1();
    resetTimer2();

    // Send the same message to both chats
    await Promise.all([
      append1({ role: "user", content: sharedInput }),
      append2({ role: "user", content: sharedInput })
    ]);

    setSharedInput("");
  };

  const formatTime = (seconds: number, milliseconds: number) => {
    return `${seconds}.${milliseconds.toString().padStart(3, '0')}s`;
  };

  const renderMessages = (messages: any[], status: string, title: string, timerMilliseconds: number, timerSeconds: number, isTimerRunning: boolean) => (
    <ScrollArea type="always" className="flex-1 px-4 pt-6 h-0">
      <ScrollBar className="" />
      <div className="pr-5">
        <div className="flex justify-between items-center">
          <span className="text-xl ml-2 text-neutral-700 font-extrabold">{title}</span>
          <div className="text-md font-mono bg-neutral-200 dark:bg-neutral-800 px-2 pt-2 pb-1 rounded">
            {isTimerRunning ? (
              <span className="text-blue-600 dark:text-blue-400 flex justify-center font-bold items-center gap-2">
                <Clock className="size-4 mb-1 stroke-3" /> {formatTime(timerSeconds, timerMilliseconds)}
              </span>
            ) : (
              <span className="text-neutral-800 flex justify-center font-bold items-center gap-2">
                <Clock className="size-4 mb-1 stroke-3" /> {formatTime(timerSeconds, timerMilliseconds)}
              </span>
            )}
          </div>
        </div>
        <Separator className="my-2 bg-neutral-100" />
        {messages.map((message) => (
          <div key={message.id} className="whitespace-pre-wrap py-2 flex flex-row gap-2">
            <div className="font-semibold mb-1 flex flex-row gap-2">
              {message.role === "user" ? (
                <div className="flex gap-1">
                  <User className="size-6 stroke-2" />
                  <span></span>
                </div>
              ) : (
                <div className="flex gap-1">
                  <Bot className="size-6 stroke-2" />
                  <span></span>
                </div>
              )}
            </div>
            <div>
              {message.parts.map((part: any, i: number) => {
                switch (part.type) {
                  case "text":
                    return <div key={`${message.id}-${i}`} className="ml-1"><MemoizedMarkdown key={`${message.id}-${i}`} content={part.text} id={message.id} /></div>;
                  case "tool-invocation":
                    return <ToolInvocation key={`${message.id}-${i}`} toolInvocation={part.toolInvocation} />;
                  default:
                    return null;
                }
              })}
            </div>
          </div>
        ))}

        {status === "submitted" && (
          <div className="whitespace-pre-wrap animate-fadeIn">
            <div className="flex gap-2">
              <Bot className="size-6 stroke-2" />
              <div className="text-sm animate-pulse my-1 ml-1">Thinking...</div>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );

  return (
    <div className="flex flex-col mt-[5vh] h-[calc(80vh)] w-full max-w-7xl mx-auto rounded-lg">
      {/* Messages area with two columns */}
      <div className="flex flex-1 gap-4 p-4 h-0">
        {/* First chat messages (RAG) */}
        <div className="flex-1 flex flex-col border-neutral-500 border-3 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 rounded-lg">
          {renderMessages(messages1, status1, "RAG - NBA Players", timer1Milliseconds, timer1Seconds, timer1Running)}
        </div>

        {/* Second chat messages (CAG) */}
        <div className="flex-1 flex flex-col border-neutral-500 border-3 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 rounded-lg">
          {renderMessages(messages2, status2, "CAG - NBA Players", timer2Milliseconds, timer2Seconds, timer2Running)}
        </div>
      </div>

      {/* Shared input area at bottom */}
      <div className="p-4 dark:border-t-neutral-800 bg-background flex justify-center">
        <form onSubmit={handleSharedSubmit} className="w-4/5">
          <Input
            className="bg-card w-full h-12"
            value={sharedInput}
            onChange={(e) => setSharedInput(e.target.value)}
            placeholder="Ask about NBA players..."
          />
        </form>
      </div>
    </div>
  );
} 