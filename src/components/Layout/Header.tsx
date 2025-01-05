'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const categories = [
    { name: '화장실', color: 'bg-red-500' },
    { name: '음식', color: 'bg-green-500' },
    { name: '지하철', color: 'bg-blue-500' }
  ]

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            촛불집회 편의시설
          </Link>
          
          <div className="hidden md:flex space-x-4">
            {categories.map((category) => (
              <div key={category.name} className="flex items-center space-x-1">
                <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                <span>{category.name}</span>
              </div>
            ))}
          </div>

          <button 
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              {isOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* 모바일 메뉴 */}
        {isOpen && (
          <div className="md:hidden mt-4 space-y-2">
            {categories.map((category) => (
              <div 
                key={category.name} 
                className="flex items-center space-x-2 p-2"
              >
                <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                <span>{category.name}</span>
              </div>
            ))}
          </div>
        )}
      </nav>
    </header>
  )
}
