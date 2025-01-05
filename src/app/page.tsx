'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const MapComponent = dynamic(
  () => import('@/components/Map'),
  { 
    ssr: false,
    loading: LoadingSpinner
  }
)

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500" />
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="w-full min-h-screen">
        <MapComponent />
      </div>
    </Suspense>
  )
}
