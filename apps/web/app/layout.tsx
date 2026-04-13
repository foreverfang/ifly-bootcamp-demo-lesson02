import './globals.css'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { getAppName, getAppTagline } from '@repo/config'

export const metadata: Metadata = {
  title: getAppName(),
  description: getAppTagline(),
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
