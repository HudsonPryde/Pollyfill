"use client";
import { useEffect, useState, Suspense, useCallback } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { ICanvasData } from "react-dag-editor";
import axios from "axios";
import { createBaseGraph } from "@/lib/utils/createBaseGraph";
const GraphView = dynamic(() => import("@/lib/graph/graph"), { ssr: false });

export default function Page({ params }: { params: { slug: string } }) {
  const topic = params.slug.replace(/_/g, " ");
  const [graphData, setGraphData] = useState<ICanvasData | undefined>(
    undefined
  );

  useEffect(() => {
    async function getBaseSubtopics() {
      if (!topic) return;
      interface ISubtopics {
        [key: string]: string;
      }
      // const res = await axios.post<ISubtopics>(`/graph/${topic}/api`);
      const res = {
        data: {
          "1": "Yarn",
          "2": "Crochet Hooks",
          "3": "Basic Stitches",
          "4": "Crochet Patterns",
          "5": "Crochet Terminology",
          "6": "Crochet Techniques",
        },
      };
      const subtopics = Object.values(res.data);
      console.log("subtopics", subtopics);
      const data = createBaseGraph(topic, subtopics);
      setGraphData(data);
    }
    getBaseSubtopics();
  }, [topic]);

  return (
    <Suspense fallback={<Loading />}>
      {graphData && <GraphView data={graphData} />}
    </Suspense>
  );
}

function Loading() {
  return <h2>🌀 Loading...</h2>;
}
