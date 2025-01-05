import { useState, useEffect } from 'react'
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api'
import type { Facility } from '@/types'

const mapContainerStyle = {
  width: '100%',
  height: 'calc(100vh - 4rem)'
}

const defaultCenter = {
  lat: 37.5665,
  lng: 126.9780
}

const libraries: ("places" | "geometry" | "drawing" | "visualization")[] = ["places"]

// 예시 데이터
const initialFacilities: Facility[] = [
  {
    id: '1',
    name: '시청역 공공화장실',
    category: '화장실',
    address: '서울특별시 중구 세종대로 110',
    location: {
      lat: 37.5666,
      lng: 126.9784
    },
    population: 0
  },
  {
    id: '2',
    name: '을지로입구역 화장실',
    category: '화장실',
    address: '서울특별시 중구 을지로 42',
    location: {
      lat: 37.5660,
      lng: 126.9821
    },
    population: 0
  }
]

const markerColors = {
  '화장실': 'red',
  '음식': 'green',
  '지하철': 'blue'
} as const

export default function Map() {
  const [facilities, setFacilities] = useState<Facility[]>(initialFacilities)
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null)
  const [mapCenter, setMapCenter] = useState(defaultCenter)
  const [userLocation, setUserLocation] = useState<google.maps.LatLng | null>(null)

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries
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
          setUserLocation(newUserLocation)
          setMapCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        () => {
          console.log('위치 정보를 가져올 수 없습니다.')
        }
      )
    }
  }, [])

  const handleMarkerClick = (facility: Facility) => {
    setSelectedFacility(facility)
  }

  const calculateDistance = (facilityLocation: { lat: number; lng: number }) => {
    if (!userLocation) return null

    const facilityLatLng = new google.maps.LatLng(
      facilityLocation.lat,
      facilityLocation.lng
    )

    const distance = google.maps.geometry.spherical.computeDistanceBetween(
      userLocation,
      facilityLatLng
    )

    return (distance / 1000).toFixed(1) // km로 변환
  }

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  return (
    <div className="relative w-full h-full">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={14}
        center={mapCenter}
        options={{
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false
        }}
      >
        {/* 시설 마커 */}
        {facilities.map((facility) => (
          <Marker
            key={facility.id}
            position={facility.location}
            onClick={() => handleMarkerClick(facility)}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: markerColors[facility.category],
              fillOpacity: 0.7,
              strokeWeight: 2,
              scale: 10
            }}
          />
        ))}

        {/* 선택된 시설 정보창 */}
        {selectedFacility && (
          <InfoWindow
            position={selectedFacility.location}
            onCloseClick={() => setSelectedFacility(null)}
          >
            <div className="p-4">
              <h3 className="text-lg font-bold mb-2">{selectedFacility.name}</h3>
              <p className="text-gray-600 mb-2">{selectedFacility.address}</p>
              {userLocation && (
                <p className="mb-2">
                  거리: {calculateDistance(selectedFacility.location)}km
                </p>
              )}
            </div>
          </InfoWindow>
        )}

        {/* 사용자 위치 마커 */}
        {userLocation && (
          <Marker
            position={userLocation.toJSON()}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: '#4285F4',
              fillOpacity: 1,
              strokeWeight: 2,
              scale: 8
            }}
          />
        )}
      </GoogleMap>
    </div>
  )
}
