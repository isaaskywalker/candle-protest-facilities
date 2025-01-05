import { InfoWindow as GoogleInfoWindow } from '@react-google-maps/api'
import { getDatabase, ref, update } from 'firebase/database'
import type { Facility } from '@/types'

interface InfoWindowProps {
  facility: Facility;
  onClose: () => void;
}

export default function InfoWindow({ facility, onClose }: InfoWindowProps) {
  const handleUse = async () => {
    const db = getDatabase()
    const facilityRef = ref(db, `facilities/${facility.id}`)
    
    await update(facilityRef, {
      population: (facility.population || 0) + 1
    })
  }

  return (
    <GoogleInfoWindow
      position={facility.location}
      onCloseClick={onClose}
    >
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2">{facility.name}</h3>
        <p className="text-gray-600 mb-2">{facility.address}</p>
        <p className="mb-2">
          인구 밀집도: <span className="font-medium">{facility.population || 0}명</span>
        </p>
        <button
          onClick={handleUse}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          사용
        </button>
      </div>
    </GoogleInfoWindow>
  )
}
