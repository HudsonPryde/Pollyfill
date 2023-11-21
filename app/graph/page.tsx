'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
const GraphView = dynamic(() => import('@/lib/graph/graph'), { ssr: false });

export default function Page() {
    return (
        <div>
            <GraphView />
        </div>
    );
}