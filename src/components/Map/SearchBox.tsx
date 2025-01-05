import { useState, useEffect } from 'react'
import { StandaloneSearchBox } from '@react-google-maps/api'

interface SearchBoxProps {
  onPlacesChanged: (location: google.maps.LatLng) => void;
}

export default function SearchBox({ onPlacesChanged }: SearchBoxProps) {
  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox | null>(null)

  const onLoad = (ref: google.maps.places.SearchBox) => {
    setSearchBox(ref)
  }

  const onUnmount = () => {
    setSearchBox(null)
  }

  useEffect(() => {
    if (!searchBox) return

    const listener = searchBox.addListener('places_changed', () => {
      const places = searchBox.getPlaces()
      if (!places || places.length === 0) return

      const place = places[0]
      if (!place.geometry || !place.geometry.location) return

      onPlacesChanged(place.geometry.location)
    })

    return () => {
      if (listener) google.maps.event.removeListener(listener)
    }
  }, [searchBox, onPlacesChanged])

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-80">
      <StandaloneSearchBox
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        <input
          type="text"
          placeholder="주소 검색"
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </StandaloneSearchBox>
    </div>
  )
}
