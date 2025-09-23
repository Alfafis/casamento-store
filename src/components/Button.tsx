import { cn } from '@/services/util'

interface ButtonProps {
  text: string
  className?: string
  onClick?: () => void | Promise<void>
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
}

export const Button = ({
  text,
  className,
  onClick,
  disabled,
  loading,
  type = 'button'
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={cn(
        'w-full cursor-pointer rounded-soft bg-gold px-4 py-2 font-semibold text-white underline transition-all duration-300 hover:scale-[102%] hover:bg-gold-dark',
        (disabled || loading) &&
          'cursor-not-allowed opacity-50 hover:scale-100',
        className
      )}
      onClick={disabled || loading ? undefined : onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <svg
            className="mr-2 h-5 w-5 animate-spin text-white"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          Carregando...
        </span>
      ) : (
        text
      )}
    </button>
  )
}
