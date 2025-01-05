export type FacilityCategory = '화장실' | '음식' | '지하철'

export interface Location {
  lat: number
  lng: number
}

export interface UserLocation extends Location {
  timestamp?: number
}

export interface Facility {
  id: string
  name: string
  category: FacilityCategory
  address: string
  location: Location
  population: number
}

export interface MarkerProps {
  facility: Facility
  onSelect: () => void
}

export interface InfoWindowProps {
  facility: Facility
  onClose: () => void
}
