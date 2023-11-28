"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  if (inputRef.current) {
    inputRef.current.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        router.push(`/graph?t=${topic}`);
      }
    });
  }

  return (
    <div className="flex min-h-screen flex-col items-center p-24 text-neutral-700">
      {/* header message */}
      <div className="w-full max-w-4xl h-96 flex justify-center items-center">
        <h1 className="text-6xl font-bold text-center leading-normal animate-fadeIn">
          What would you like to learn today?
        </h1>
      </div>
      {/* user input */}
      <div className="rounded-lg shadow-md w-full max-w-4xl h-12 focus:outline-none p-2 flex flex-row bg-white">
        <input
          ref={inputRef}
          autoFocus
          onInput={(e) => setTopic(e.currentTarget.value)}
          onSubmit={() => router.push(`/graph?t=${topic}`)}
          className="flex-1 focus:outline-none"
        />

        <button
          className="flex justify-center items-center"
          onClick={() => router.push(`/graph?t=${topic}`)}
        >
          <Image src="/send.svg" width={44} height={44} alt="send" />
        </button>
      </div>
    </div>
  );
}
