import { useState, useEffect, useCallback } from 'react'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'
import { getDatabase, ref, onValue, push } from 'firebase/database'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { v4 as uuidv4 } from 'uuid'
import CustomMarker from './Marker'
import InfoWindow from './InfoWindow'
import SearchBox from './SearchBox'
import CategoryList from './CategoryList'
import AddFacilityModal from '../UI/AddFacilityModal'
import AdminLogin from '../Auth/AdminLogin'
import type { Facility, Location } from '@/types'
import { database } from '@/lib/firebase'

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

    // 관리자 상태 확인
    const auth = getAuth()
    const authUnsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAdmin(!!user)
    })

    return () => {
      unsubscribe()
      authUnsubscribe()
    }
  }, [])

  const handlePlacesChanged = useCallback((location: google.maps.LatLng) => {
    const newCenter = {
      lat: location.lat(),
      lng: location.lng()
    }
    setMapCenter(newCenter)
    mapInstance?.panTo(newCenter)
    mapInstance?.setZoom(16)
  }, [mapInstance])

  const handleSelectFromList = useCallback((facility: Facility) => {
    setSelectedFacility(facility)
    setMapCenter(facility.location)
    mapInstance?.panTo(facility.location)
    mapInstance?.setZoom(17)
  }, [mapInstance])

  const onMapLoad = (map: google.maps.Map) => {
    setMapInstance(map)
  }

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (!isAdmin) return // 관리자가 아니면 클릭 무시
    if (!e.latLng) return
    
    const newLocation = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    }
    
    setClickedLocation(newLocation)
    setIsAddModalOpen(true)
  }

  const handleAddFacility = async (data: Omit<Facility, 'id' | 'location' | 'population'>) => {
    if (!clickedLocation) return

    const facilitiesRef = ref(database, 'facilities')
    const newFacility: Facility = {
      id: uuidv4(),
      ...data,
      location: clickedLocation,
      population: 0
    }

    await push(facilitiesRef, newFacility)
    setIsAddModalOpen(false)
    setClickedLocation(null)
  }

  if (!isLoaded) return null

  return (
    <div className="relative w-full h-full">
      <AdminLogin isAdmin={isAdmin} />
      <SearchBox onPlacesChanged={handlePlacesChanged} />
      <CategoryList 
        facilities={facilities} 
        onSelectFacility={handleSelectFromList} 
      />
      
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={14}
        center={mapCenter}
        onClick={handleMapClick}
        onLoad={onMapLoad}
        options={{
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false
        }}
      >
        {facilities.map((facility) => (
          <CustomMarker
            key={facility.id}
            facility={facility}
            onSelect={() => setSelectedFacility(facility)}
          />
        ))}
        
        {selectedFacility && (
          <InfoWindow
            facility={selectedFacility}
            onClose={() => setSelectedFacility(null)}
          />
        )}
      </GoogleMap>

      {isAdmin && (
        <AddFacilityModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false)
            setClickedLocation(null)
          }}
          onSubmit={handleAddFacility}
        />
      )}
    </div>
  )
}
