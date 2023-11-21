import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import SideBar from '../components/sideBar'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className} style={{display:'flex', flex: 1, flexDirection:'row'}}>
        <SideBar />
        <div className="flex-1 flex-row justify-center">
          {children}
        </div>
      </body>
    </html>
  )
}
