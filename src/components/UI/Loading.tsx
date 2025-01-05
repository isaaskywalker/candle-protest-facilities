'use client'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  color?: string
  fullScreen?: boolean
}

const Loading = ({ 
  size = 'md', 
  color = 'border-blue-500', 
  fullScreen = false 
}: LoadingProps) => {
  const sizes = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-3',
    lg: 'h-16 w-16 border-4'
  }

  const spinner = (
    <div
      className={`
        ${sizes[size]}
        border-t-transparent
        rounded-full
        animate-spin
        ${color}
      `}
    />
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
        {spinner}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center p-4">
      {spinner}
    </div>
  )
}

export default Loading
