"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SideBar() {
  const router = useRouter();
  return (
    <div className="flex-2 flex-col w-64 h-screen px-4 py-8 bg-white border-r dark:bg-gray-800 dark:border-gray-600">
      <button
        onClick={() => router.push("/")}
        className="flex justify-center w-full h-16 border-2 border-gray-400 rounded-lg hover:bg-slate-700 transition-colors"
      >
        <Image src="/add.svg" width={34} height={34} alt="add" />
      </button>
    </div>
  );
}
