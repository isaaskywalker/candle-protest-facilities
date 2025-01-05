// 시설 카테고리 타입
export type FacilityCategory = '화장실' | '음식' | '지하철'

// 위치 좌표 타입
export interface Location {
  lat: number
  lng: number
}

// 시설 정보 타입
export interface Facility {
  id: string
  name: string
  category: FacilityCategory
  address: string
  location: Location
  population: number
  distance?: number // 선택적 필드: 사용자와의 거리
}

// 사용자 위치 타입
export interface UserLocation extends Location {
  timestamp?: number
}

// 파이어베이스 에러 타입
export interface FirebaseError {
  code: string
  message: string
}

// 혼잡도 레벨 타입
export type CrowdLevel = '여유' | '보통' | '혼잡' | '매우 혼잡'

// 지도 옵션 타입
export interface MapOptions {
  zoom: number
  center: Location
  styles?: google.maps.MapTypeStyle[]
}

// 마커 스타일 타입
export interface MarkerStyle {
  fillColor: string
  strokeColor?: string
  scale: number
  fillOpacity: number
}

// 인포윈도우 props 타입
export interface InfoWindowProps {
  facility: Facility
  onClose: () => void
}

// 마커 props 타입
export interface MarkerProps {
  facility: Facility
  onSelect: () => void
  isUserLocation?: boolean
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
