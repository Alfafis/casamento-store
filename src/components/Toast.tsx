import React, { useEffect } from 'react'

type ToastProps = {
  message: string
  show: boolean
  onClose: () => void
  duration?: number // ms
}

const Toast: React.FC<ToastProps> = ({
  message,
  show,
  onClose,
  duration = 3000
}) => {
  useEffect(() => {
    if (!show) return
    const timer = setTimeout(onClose, duration) // Duração do toast
    return () => clearTimeout(timer)
  }, [show, duration, onClose])

  if (!show) return null

  return (
    <div
      className={`fixed bottom-10 right-10 z-50 -translate-x-1/2 rounded bg-gray-900 px-4 py-2 text-white shadow-lg transition-all duration-300 ${show ? 'translate-x-0 opacity-100' : 'pointer-events-none translate-x-full opacity-0'} `}
      style={{
        transitionProperty: 'transform, opacity',
        pointerEvents: show ? 'auto' : 'none'
      }}
    >
      <span>{message}</span>
      <button
        className="ml-3 text-gray-300 hover:text-white focus:outline-none"
        onClick={onClose}
        aria-label="Fechar"
      >
        ×
      </button>
    </div>
  )
}

export default Toast
