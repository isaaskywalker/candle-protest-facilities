import { firebaseApp } from '@/lib/firebase'

let auth: any = null

export const getFirebaseAuth = async () => {
  if (typeof window === 'undefined') return null
  
  if (!auth) {
    const { getAuth } = await import('firebase/auth')
    auth = getAuth(firebaseApp)
  }
  return auth
}

export const initializeAuth = async () => {
  const auth = await getFirebaseAuth()
  if (!auth) return null

  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user: any) => {
      unsubscribe()
      resolve(user)
    })
  })
}
