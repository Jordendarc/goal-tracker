import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import NavBar from '../../components/NavBar'
import * as React from 'react';
import LoadingOnNav from '../../components/LoadingOnNav';
import { Suspense } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ジョジョのGoal Tracker',
  description: 'ジョジョのGoal Tracker',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavBar />
        <Suspense fallback={<LoadingOnNav />}>
          {children}
        </Suspense>
      </body>
    </html>
  )
}
