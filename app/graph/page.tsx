"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import axios from "axios";
const GraphView = dynamic(() => import("@/lib/graph/graph"), { ssr: false });

export default function Page() {
  const params = useSearchParams();
  const topic = params.get("t");

  async function getSubtopics() {
    const res = await axios.post("/graph/api", { topic });
  }

  return (
    <div>
      <GraphView topic={topic ?? ""} />
    </div>
  );
}
