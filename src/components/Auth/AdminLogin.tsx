import { useState } from 'react'
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth'

interface AdminLoginProps {
  isAdmin: boolean;
}

export default function AdminLogin({ isAdmin }: AdminLoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const auth = getAuth()
      await signInWithEmailAndPassword(auth, email, password)
      setIsModalOpen(false)
      setError('')
    } catch (err) {
      setError('로그인에 실패했습니다.')
    }
  }

  const handleLogout = async () => {
    const auth = getAuth()
    await signOut(auth)
  }

  if (isAdmin) {
    return (
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 z-20"
      >
        로그아웃
      </button>
    )
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="absolute top-4 right-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 z-20"
      >
        관리자 로그인
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">관리자 로그인</h2>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  이메일
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  비밀번호
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              {error && (
                <p className="text-red-500 text-sm mb-4">{error}</p>
              )}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  로그인
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
