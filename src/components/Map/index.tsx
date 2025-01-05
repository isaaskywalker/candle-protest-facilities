'use client'

import { useState, useEffect, useCallback } from 'react'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'
import { getDatabase, ref, onValue, push } from 'firebase/database'
import { v4 as uuidv4 } from 'uuid'
import dynamic from 'next/dynamic'
import CustomMarker from './Marker'
import InfoWindow from './InfoWindow'
import SearchBox from './SearchBox'
import CategoryList from './CategoryList'
import type { Facility, Location } from '@/types'
import { database } from '@/lib/firebase'

// 동적 임포트로 Auth 관련 컴포넌트 로드
const AddFacilityModal = dynamic(() => import('../UI/AddFacilityModal'))
const AdminLogin = dynamic(() => import('../Auth/AdminLogin'))

const mapContainerStyle = {
  width: '100%',
  height: 'calc(100vh - 4rem)'
}

const defaultCenter = {
  lat: 37.5665,
  lng: 126.9780
}

const libraries: ("places" | "geometry" | "drawing" | "visualization")[] = ["places"]

export default function Map() {
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null)
  const [clickedLocation, setClickedLocation] = useState<Location | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [mapCenter, setMapCenter] = useState(defaultCenter)
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries
  })

  useEffect(() => {
    // 시설 데이터 가져오기
    const facilitiesRef = ref(database, 'facilities')
    const unsubscribe = onValue(facilitiesRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const facilitiesArray = Object.values(data) as Facility[]
        setFacilities(facilitiesArray)
      }
    })

    // 관리자 상태 확인 - 클라이언트 사이드에서만 실행
    if (typeof window !== 'undefined') {
      import('firebase/auth').then(({ getAuth, onAuthStateChanged }) => {
        const auth = getAuth()
        const authUnsubscribe = onAuthStateChanged(auth, (user) => {
          setIsAdmin(!!user)
        })
        return () => authUnsubscribe()
      })
    }

    return () => unsubscribe()
  }, [])

  // ... 나머지 코드는 동일

  return (
    <div className="relative w-full h-full">
      <AdminLogin isAdmin={isAdmin} />
      <SearchBox onPlacesChanged={handlePlacesChanged} />
      <CategoryList 
        facilities={facilities} 
        onSelectFacility={handleSelectFromList} 
      />
      
      {/* ... 나머지 JSX는 동일 */}
    </div>
  )
}
