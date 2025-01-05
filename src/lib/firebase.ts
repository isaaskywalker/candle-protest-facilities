import { initializeApp, getApps } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
}

// Firebase 초기화 (중복 초기화 방지)
export const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

// Realtime Database 인스턴스
export const database = getDatabase(firebaseApp)

// Firebase 초기 데이터 구조
export const initialFacilities = {
  facilities: {
    // 예시 데이터
    'facility1': {
      id: 'facility1',
      name: '시청역 공공화장실',
      category: '화장실',
      address: '서울특별시 중구 세종대로 110',
      location: {
        lat: 37.5666,
        lng: 126.9784
      },
      population: 0
    }
  }
}
