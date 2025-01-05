import { useState, useEffect } from 'react'
import { getDatabase, ref, onValue, update } from 'firebase/database'
import type { Facility } from '@/types'

interface UseFacilitiesReturn {
  facilities: Facility[]
  loading: boolean
  error: Error | null
  updateFacility: (id: string, data: Partial<Facility>) => Promise<void>
  incrementPopulation: (id: string) => Promise<void>
}

export function useFacilities(): UseFacilitiesReturn {
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const db = getDatabase()
    const facilitiesRef = ref(db, 'facilities')

    try {
      const unsubscribe = onValue(facilitiesRef, (snapshot) => {
        const data = snapshot.val()
        if (data) {
          const facilitiesArray = Object.values(data) as Facility[]
          setFacilities(facilitiesArray)
        }
        setLoading(false)
      }, (error) => {
        setError(error)
        setLoading(false)
      })

      return () => unsubscribe()
    } catch (err) {
      setError(err as Error)
      setLoading(false)
    }
  }, [])

  const updateFacility = async (id: string, data: Partial<Facility>) => {
    try {
      const db = getDatabase()
      const facilityRef = ref(db, `facilities/${id}`)
      await update(facilityRef, data)
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }

  const incrementPopulation = async (id: string) => {
    const facility = facilities.find(f => f.id === id)
    if (facility) {
      await updateFacility(id, {
        population: (facility.population || 0) + 1
      })
    }
  }

  return {
    facilities,
    loading,
    error,
    updateFacility,
    incrementPopulation
  }
}
