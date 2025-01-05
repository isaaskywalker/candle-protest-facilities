import { Marker } from '@react-google-maps/api'
import type { Facility } from '@/types'

interface MarkerProps {
  facility: Facility;
  onSelect: () => void;
}

const markerColors = {
  '화장실': 'red',
  '음식': 'green',
  '지하철': 'blue'
} as const

export default function CustomMarker({ facility, onSelect }: MarkerProps) {
  return (
    <Marker
      position={facility.location}
      onClick={onSelect}
      icon={{
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: markerColors[facility.category],
        fillOpacity: 0.7,
        strokeWeight: 2,
        scale: 10
      }}
      title={facility.name}
    />
  )
}
