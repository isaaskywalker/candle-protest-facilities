import { useState, useEffect, useCallback } from 'react'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'
import { getDatabase, ref, onValue, push } from 'firebase/database'
import { v4 as uuidv4 } from 'uuid'
import CustomMarker from './Marker'
import InfoWindow from './InfoWindow'
import SearchBox from './SearchBox'
import AddFacilityModal from '../UI/AddFacilityModal'
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

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries
  })

  useEffect(() => {
    const facilitiesRef = ref(database, 'facilities')
    const unsubscribe = onValue(facilitiesRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const facilitiesArray = Object.values(data) as Facility[]
        setFacilities(facilitiesArray)
      }
    })

    return () => unsubscribe()
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

  const onMapLoad = (map: google.maps.Map) => {
    setMapInstance(map)
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
      <SearchBox onPlacesChanged={handlePlacesChanged} />
      
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={14}
        center={mapCenter}
        onClick={(e) => {
          if (!e.latLng) return
          setClickedLocation({
            lat: e.latLng.lat(),
            lng: e.latLng.lng()
          })
          setIsAddModalOpen(true)
        }}
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

      <AddFacilityModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false)
          setClickedLocation(null)
        }}
        onSubmit={handleAddFacility}
      />
    </div>
  )
}
