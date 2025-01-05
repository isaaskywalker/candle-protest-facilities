import { useState } from 'react'
import type { Facility, FacilityCategory } from '@/types'

interface AddFacilityModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Omit<Facility, 'id' | 'location' | 'population'>) => void
}

export default function AddFacilityModal({
  isOpen,
  onClose,
  onSubmit
}: AddFacilityModalProps) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState<FacilityCategory>('화장실')
  const [address, setAddress] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      name,
      category,
      address
    })
    setName('')
    setAddress('')
    setCategory('화장실')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">새로운 시설 추가</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              시설 종류
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as FacilityCategory)}
              className="w-full p-2 border rounded"
            >
              <option value="화장실">화장실</option>
              <option value="음식">음식</option>
              <option value="지하철">지하철</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이름
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="시설 이름을 입력하세요"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              주소
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="주소를 입력하세요"
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              추가하기
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
