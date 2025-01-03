import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import * as React from 'react';
import { Suspense } from 'react'
import AuthProvider from './AuthProvider';
import NavBar from '../components/NavBar';
import LoadingOnNav from '../components/LoadingOnNav';

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
    <AuthProvider>
      <html lang="en">
        <body className={inter.className}>
          <NavBar />
          <Suspense fallback={<LoadingOnNav />}>
            {children}
          </Suspense>
        </body>
      </html>
    </AuthProvider>
  )
}
