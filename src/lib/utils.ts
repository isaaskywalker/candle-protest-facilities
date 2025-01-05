import type { Facility } from '@/types'

// 두 지점 간 거리 계산 (Haversine 공식)
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371 // 지구 반경 (km)
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c

  return Number(distance.toFixed(1))
}

// 도(degrees)를 라디안(radians)으로 변환
const toRad = (degrees: number): number => {
  return degrees * (Math.PI / 180)
}

// 시설 정렬 (거리 기준)
export const sortFacilitiesByDistance = (
  facilities: Facility[],
  userLat: number,
  userLng: number
): Facility[] => {
  return [...facilities].sort((a, b) => {
    const distA = calculateDistance(userLat, userLng, a.location.lat, a.location.lng)
    const distB = calculateDistance(userLat, userLng, b.location.lat, b.location.lng)
    return distA - distB
  })
}

// 카테고리별 마커 색상
export const markerColors = {
  '화장실': 'red',
  '음식': 'green',
  '지하철': 'blue'
} as const

// 서울 경계 좌표
export const SEOUL_BOUNDS = {
  north: 37.7010,
  south: 37.4283,
  east: 127.1830,
  west: 126.7794
}

// 위치가 서울 내부인지 확인
export const isInSeoul = (lat: number, lng: number): boolean => {
  return (
    lat >= SEOUL_BOUNDS.south &&
    lat <= SEOUL_BOUNDS.north &&
    lng >= SEOUL_BOUNDS.west &&
    lng <= SEOUL_BOUNDS.east
  )
}

// 현재 시간 기준 혼잡도 메시지
export const getCrowdMessage = (population: number): string => {
  if (population < 10) return '여유'
  if (population < 30) return '보통'
  if (population < 50) return '혼잡'
  return '매우 혼잡'
}

// 파이어베이스 에러 메시지 한글화
export const getFirebaseErrorMessage = (error: any): string => {
  const errorCode = error.code
  switch (errorCode) {
    case 'permission-denied':
      return '권한이 없습니다'
    case 'disconnected':
      return '인터넷 연결을 확인해주세요'
    default:
      return '오류가 발생했습니다'
  }
}
