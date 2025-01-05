import { useState, useEffect } from 'react'
import type { UserLocation } from '@/types'

interface UseLocationReturn {
  location: UserLocation | null
  loading: boolean
  error: Error | null
  updateLocation: () => Promise<void>
}

// 서울 경계 좌표
const SEOUL_BOUNDS = {
  north: 37.7010,
  south: 37.4283,
  east: 127.1830,
  west: 126.7794
}

export function useLocation(): UseLocationReturn {
  const [location, setLocation] = useState<UserLocation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const isInSeoul = (lat: number, lng: number): boolean => {
    return (
      lat >= SEOUL_BOUNDS.south &&
      lat <= SEOUL_BOUNDS.north &&
      lng >= SEOUL_BOUNDS.west &&
      lng <= SEOUL_BOUNDS.east
    )
  }

  const updateLocation = async (): Promise<void> => {
    setLoading(true)
    
    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by your browser')
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
      })

      const { latitude, longitude } = position.coords

      if (isInSeoul(latitude, longitude)) {
        setLocation({
          lat: latitude,
          lng: longitude
        })
      } else {
        throw new Error('현재 위치가 서울 지역을 벗어났습니다')
      }
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    updateLocation()
  }, [])

  return {
    location,
    loading,
    error,
    updateLocation
  }
}
