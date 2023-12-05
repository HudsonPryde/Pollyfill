"use client";
import { useEffect, useState, Suspense, useCallback } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { ICanvasData } from "react-dag-editor";
import axios from "axios";
import { getTopic } from "@/lib/data/storage";
const GraphView = dynamic(() => import("@/lib/graph/graph"), { ssr: false });

export default function Page({ params }: { params: { slug: string } }) {
  const id = params.slug;
  const topic = getTopic(id);

  return (
    <Suspense fallback={<Loading />}>
      {topic ? <GraphView data={JSON.parse(topic.graphData)} /> : <Loading />}
    </Suspense>
  );
}

function Loading() {
  return <h2>🌀 Loading...</h2>;
}
