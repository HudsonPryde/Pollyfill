"use client";
import { useEffect, useState, Suspense, useCallback } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { ICanvasData } from "react-dag-editor";
import axios from "axios";
import { createBaseGraph } from "@/lib/utils/createBaseGraph";
const GraphView = dynamic(() => import("@/lib/graph/graph"), { ssr: false });

export default function Page() {
  const params = useSearchParams();
  const topic = params.get("t");
  const [graphData, setGraphData] = useState<ICanvasData | undefined>(
    undefined
  );

  useEffect(() => {
    async function getBaseSubtopics() {
      console.log("topic", topic);
      if (!topic) return;
      interface ISubtopics {
        [key: string]: string;
      }
      const res = await axios.post<ISubtopics>("/graph/api", { topic });
      const subtopics = Object.values(res.data);
      console.log("subtopics", subtopics);
      const data = createBaseGraph(topic, subtopics);
      setGraphData(data);
    }
    getBaseSubtopics();
  }, []);

  return (
    <Suspense fallback={<Loading />}>
      {graphData && <GraphView data={graphData} />}
    </Suspense>
  );
}

function Loading() {
  return <h2>🌀 Loading...</h2>;
}
