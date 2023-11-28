"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
const GraphView = dynamic(() => import("@/lib/graph/graph"), { ssr: false });

export default function Page() {
  const params = useSearchParams();
  const topic = params.get("t");
  return (
    <div>
      <GraphView topic={topic ?? ""} />
    </div>
  );
}
