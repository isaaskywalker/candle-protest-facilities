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

  const handleEndUse = async () => {
    const db = getDatabase()
    const facilityRef = ref(db, `facilities/${facility.id}`)
    
    // 인구수가 0 미만이 되지 않도록 체크
    const newPopulation = Math.max((facility.population || 0) - 1, 0)
    
    await update(facilityRef, {
      population: newPopulation
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

  // 혼잡도 상태에 따른 색상과 메시지
  const getCrowdStatus = (population: number) => {
    if (population < 5) return { color: 'text-green-600', text: '여유' }
    if (population < 15) return { color: 'text-yellow-600', text: '보통' }
    if (population < 30) return { color: 'text-orange-600', text: '혼잡' }
    return { color: 'text-red-600', text: '매우 혼잡' }
  }

  const crowdStatus = getCrowdStatus(facility.population || 0)

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
        <div className="flex justify-between items-center mb-3">
          <span>인구 밀집도:</span>
          <span className={`font-medium ${crowdStatus.color}`}>
            {facility.population || 0}명 ({crowdStatus.text})
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleUse}
            className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            사용
          </button>
          <button
            onClick={handleEndUse}
            className="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
          >
            사용 종료
          </button>
        </div>
      </div>
    </GoogleInfoWindow>
  )
}
