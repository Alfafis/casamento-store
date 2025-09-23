import { useEffect, useState } from 'react'

export const ScrollIndicator: React.FC = () => {
  const [isAtBottom, setIsAtBottom] = useState(false)
  const [isFlipping, setIsFlipping] = useState(false)

  useEffect(() => {
    const updateScrollState = () => {
      const container = document.getElementById('container-scroll')
      if (container) {
        const { scrollTop, scrollHeight, clientHeight } = container
        const atBottom = scrollTop + clientHeight >= scrollHeight - 10 // 10px tolerance
        if (atBottom !== isAtBottom) {
          setIsFlipping(true)
          setTimeout(() => {
            setIsAtBottom(atBottom)
            setIsFlipping(false)
          }, 300)
        }
      }
    }

    const container = document.getElementById('container-scroll')
    if (container) {
      container.addEventListener('scroll', updateScrollState)
      updateScrollState() // Initial check
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', updateScrollState)
      }
    }
  }, [isAtBottom])

  const handleClick = () => {
    const container = document.getElementById('container-scroll')
    if (container) {
      container.scrollTo({
        top: isAtBottom ? 0 : container.scrollHeight,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="fixed bottom-2 right-2 z-50">
      <button
        className={`flex size-12 items-center justify-center rounded-full border-2 border-sage/30 bg-gold transition-all duration-300 hover:scale-110 ${
          isFlipping ? 'animate-spin' : ''
        }`}
        onClick={handleClick}
        aria-label={isAtBottom ? 'Scroll to top' : 'Scroll to bottom'}
      >
        <div
          className={`text-xl text-white transition-transform duration-300 ${
            isFlipping ? 'scale-0' : 'scale-100'
          }`}
        >
          {isAtBottom ? '↑' : '↓'}
        </div>
      </button>
    </div>
  )
}
