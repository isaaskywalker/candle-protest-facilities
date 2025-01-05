# src/components/Map/index.tsx
'use client'

import { useState, useEffect } from 'react'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'
import { initializeApp } from 'firebase/app'
import { getDatabase, ref, onValue } from 'firebase/database'
import CustomMarker from './Marker'
import InfoWindow from './InfoWindow'
import type { Facility } from '@/types'

// Firebase 설정
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
}

// Firebase 초기화
initializeApp(firebaseConfig)

// 지도 스타일 설정
const mapContainerStyle = {
  width: '100%',
  height: 'calc(100vh - 4rem)'  // 헤더 높이만큼 제외
}

// 서울시청 좌표 (초기 중심점)
const defaultCenter = {
  lat: 37.5665,
  lng: 126.9780
}

export default function Map() {
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null)
  const [userLocation, setUserLocation] = useState<google.maps.LatLng | null>(null)

  // Google Maps API 로드
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  })

  useEffect(() => {
    // 사용자 위치 가져오기
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newUserLocation = new google.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          )
          
          // 서울 지역 확인 (대략적인 범위)
          const seoulBounds = {
            north: 37.7010,
            south: 37.4283,
            east: 127.1830,
            west: 126.7794
          }

          if (
            position.coords.latitude >= seoulBounds.south &&
            position.coords.latitude <= seoulBounds.north &&
            position.coords.longitude >= seoulBounds.west &&
            position.coords.longitude <= seoulBounds.east
          ) {
            setUserLocation(newUserLocation)
          }
        },
        (error) => {
          console.error('위치 정보를 가져올 수 없습니다:', error)
        }
      )
    }

    // Firebase에서 시설 데이터 가져오기
    const db = getDatabase()
    const facilitiesRef = ref(db, 'facilities')
    
    const unsubscribe = onValue(facilitiesRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const facilitiesArray = Object.values(data) as Facility[]
        setFacilities(facilitiesArray)
      }
    })

    return () => unsubscribe()
  }, [])

  // 사용자와 시설 사이의 거리 계산
  const calculateDistance = (facilityLocation: { lat: number; lng: number }) => {
    if (!userLocation) return null

    const userLatLng = userLocation
    const facilityLatLng = new google.maps.LatLng(
      facilityLocation.lat,
      facilityLocation.lng
    )

    const distance = google.maps.geometry.spherical.computeDistanceBetween(
      userLatLng,
      facilityLatLng
    )

    return (distance / 1000).toFixed(1) // km 단위로 변환
  }

  if (!isLoaded) return null

  return (
    <div className="w-full h-full relative">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={14}
        center={userLocation?.toJSON() || defaultCenter}
        options={{
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        }}
      >
        {/* 시설 마커 표시 */}
        {facilities.map((facility) => (
          <CustomMarker
            key={facility.id}
            facility={facility}
            onSelect={() => setSelectedFacility(facility)}
          />
        ))}
        
        {/* 선택된 시설 정보창 */}
        {selectedFacility && (
          <InfoWindow
            facility={{
              ...selectedFacility,
              distance: calculateDistance(selectedFacility.location)
            }}
            onClose={() => setSelectedFacility(null)}
          />
        )}

        {/* 사용자 위치 마커 */}
        {userLocation && (
          <CustomMarker
            facility={{
              id: 'user-location',
              name: '내 위치',
              category: '화장실',
              location: userLocation.toJSON(),
              population: 0,
              address: ''
            }}
            onSelect={() => {}}
            isUserLocation
          />
        )}
      </GoogleMap>
    </div>
  )
}
