'use client'

import { InfoWindow as GoogleInfoWindow } from '@react-google-maps/api'
import { getDatabase, ref, update, remove } from 'firebase/database'
import type { Facility } from '@/types'

interface InfoWindowProps {
  facility: Facility
  onClose: () => void
}

export default function InfoWindow({ facility, onClose }: InfoWindowProps) {
  const handleUse = async () => {
    const db = getDatabase()
    const facilityRef = ref(db, `facilities/${facility.id}`)
    
    await update(facilityRef, {
      population: (facility.population || 0) + 1
    })
  }

  const handleDelete = async () => {
    if (window.confirm('이 시설을 정말 삭제하시겠습니까?')) {
      try {
        const db = getDatabase()
        const facilityRef = ref(db, `facilities/${facility.id}`)
        await remove(facilityRef)
        onClose()
      } catch (error) {
        console.error('시설 삭제 중 오류 발생:', error)
        alert('시설 삭제에 실패했습니다.')
      }
    }
  }

  return (
    <GoogleInfoWindow
      position={facility.location}
      onCloseClick={onClose}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold">{facility.name}</h3>
          <button
            onClick={handleDelete}
            className="text-sm px-2 py-1 text-red-500 hover:text-red-700"
            title="시설 삭제"
          >
            ✕
          </button>
        </div>
        <p className="text-gray-600 mb-2">{facility.address}</p>
        <div className="flex justify-between items-center mb-2">
          <span>인구 밀집도:</span>
          <span className="font-medium">{facility.population || 0}명</span>
        </div>
        <button
          onClick={handleUse}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          사용
        </button>
      </div>
    </GoogleInfoWindow>
  )
}
