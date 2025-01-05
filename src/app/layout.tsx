import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from '@/components/Layout/Header'
import Footer from '@/components/Layout/Footer'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '촛불집회 편의시설',
  description: '실시간 화장실, 음식점, 지하철역 위치 정보',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
