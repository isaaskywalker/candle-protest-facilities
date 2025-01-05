import { useState } from 'react'
import type { Facility, FacilityCategory } from '@/types'

interface CategoryListProps {
  facilities: Facility[]
  onSelectFacility: (facility: Facility) => void
}

export default function CategoryList({ facilities, onSelectFacility }: CategoryListProps) {
  const [selectedCategory, setSelectedCategory] = useState<FacilityCategory | null>(null)
  const [isListOpen, setIsListOpen] = useState(false)

  const categories = [
    { name: '화장실', color: 'bg-red-500' },
    { name: '음식', color: 'bg-green-500' },
    { name: '지하철', color: 'bg-blue-500' }
  ] as const

  const filteredFacilities = selectedCategory
    ? facilities.filter(f => f.category === selectedCategory)
    : []

  return (
    <div className="absolute top-4 right-4 z-10">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="flex space-x-2 p-2">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => {
                setSelectedCategory(category.name as FacilityCategory)
                setIsListOpen(true)
              }}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors
                ${selectedCategory === category.name ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
            >
              <div className={`w-3 h-3 rounded-full ${category.color}`} />
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {isListOpen && selectedCategory && (
          <div className="mt-2 p-2 border-t max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold">{selectedCategory} 목록</h3>
              <button
                onClick={() => setIsListOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            {filteredFacilities.length > 0 ? (
              <ul className="space-y-2">
                {filteredFacilities.map((facility) => (
                  <li 
                    key={facility.id}
                    onClick={() => onSelectFacility(facility)}
                    className="p-2 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <p className="font-medium">{facility.name}</p>
                    <p className="text-sm text-gray-600">{facility.address}</p>
                    <p className="text-sm text-gray-500">
                      현재 인원: {facility.population}명
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-4">
                등록된 {selectedCategory}이(가) 없습니다
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
