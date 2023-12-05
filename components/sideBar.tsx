"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { listTopics } from "@/lib/data/storage";

export default function SideBar() {
  const router = useRouter();
  const path = usePathname();
  const [topics, setTopics] = useState<any[] | null>(null);

  useEffect(() => {
    const topics = listTopics();
    setTopics(topics);
  }, [path]);

  return (
    <div className="flex flex-2 flex-col gap-y-4 w-64 h-screen px-4 py-8 bg-white border-r dark:bg-gray-800 dark:border-gray-600">
      <button
        onClick={() => router.push("/")}
        className="flex justify-center w-full h-16 border-2 border-gray-400 rounded-lg hover:bg-slate-700 transition-colors"
      >
        <Image src="/add.svg" width={34} height={34} alt="add" />
      </button>
      {topics &&
        topics.map((topic) => {
          return (
            <button
              key={topic.id}
              className={`bg-slate-700 flex justify-center items-center w-full h-16 border-2 
              border-gray-400 rounded-lg hover:border-blue-400 transition-colors text-gray-200 hover:text-blue-400
              ${
                path === `/graph/${topic.id}`
                  ? "border-blue-400 text-blue-400"
                  : "border-gray-400 text-gray-200"
              }
              `}
              onClick={() => router.push(`/graph/${topic.id}`)}
            >
              <p>{topic.label}</p>
            </button>
          );
        })}
    </div>
  );
}
