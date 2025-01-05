import { useState } from 'react'
import Link from 'next/link'

interface Category {
  id: string
  name: string
  color: string
}

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)

  const categories: Category[] = [
    { id: 'toilet', name: '화장실', color: 'bg-red-500' },
    { id: 'food', name: '음식', color: 'bg-green-500' },
    { id: 'subway', name: '지하철', color: 'bg-blue-500' }
  ]

  return (
    <header className="bg-white shadow-sm z-50 relative">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <Link 
            href="/" 
            className="text-xl font-bold text-gray-900"
          >
            촛불집회 편의시설
          </Link>

          {/* 데스크톱 메뉴 */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {categories.map((category) => (
              <div 
                key={category.id}
                className="flex items-center space-x-2"
              >
                <div 
                  className={`w-3 h-3 rounded-full ${category.color}`} 
                  aria-hidden="true"
                />
                <span className="text-sm text-gray-700">
                  {category.name}
                </span>
              </div>
            ))}
          </div>

          {/* 모바일 메뉴 버튼 */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="sr-only">메뉴 열기</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* 모바일 메뉴 */}
        {isOpen && (
          <div className="md:hidden py-4">
            <div className="space-y-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center space-x-2 px-2 py-2 rounded-md hover:bg-gray-100"
                >
                  <div 
                    className={`w-3 h-3 rounded-full ${category.color}`}
                    aria-hidden="true"
                  />
                  <span className="text-sm text-gray-700">
                    {category.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header
