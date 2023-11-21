'use client';
import * as React from 'react';
import Image from 'next/image'
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center p-24 text-neutral-700">
      {/* header message */}
      <div className='w-full max-w-4xl h-96 flex justify-center items-center'>
        <h1 className='text-6xl font-bold text-center leading-normal animate-fadeIn'>What would you like to learn today?</h1>
      </div>
      {/* user input */}
      <div className='rounded-lg shadow-md w-full max-w-4xl h-12 focus:outline-none p-2 flex flex-row bg-white'>
        <input autoFocus className='flex-1 focus:outline-none'/>
        <button className='flex justify-center items-center' onClick={() => router.push('/graph')}>
          <Image src='/send.svg' width={44} height={44} alt='send'/>
        </button>
      </div>
    </div>
  )
}