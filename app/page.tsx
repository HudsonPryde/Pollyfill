"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  createTopic,
  setTopicHistory,
  setTopicGraphData,
} from "@/lib/data/storage";
import { createBaseGraph } from "@/lib/utils/createBaseGraph";
import axios from "axios";
interface ISubtopics {
  [key: string]: string;
}

export default function Home() {
  const router = useRouter();
  const [topic, setTopic] = useState("");

  async function handleNavigate() {
    if (!topic) {
      return;
    }
    const id = createTopic(topic);
    let data = new FormData();
    data.append("topic", topic);
    data.append("chat_history", "[]");
    const res = await axios.post<ISubtopics>(`/graph/api`, data);
    const subtopics = Object.values(res.data);
    const history = JSON.stringify({
      inputs: { topic: topic },
      outputs: { subtopics: res.data },
    });
    setTopicHistory(id, history);
    const graph = createBaseGraph(topic, subtopics);
    setTopicGraphData(id, JSON.stringify(graph));
    router.push(`/graph/${id}`);
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
          autoFocus
          onInput={(e) => setTopic(e.currentTarget.value)}
          className="flex-1 focus:outline-none"
        />

        <button
          className="flex justify-center items-center"
          onClick={handleNavigate}
        >
          <Image src="/send.svg" width={44} height={44} alt="send" />
        </button>
      </div>
    </div>
  );
}
