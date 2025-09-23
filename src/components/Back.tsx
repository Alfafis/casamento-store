interface BackProps {
  onClick: () => void
}

export const Back: React.FC<BackProps> = ({ onClick }) => {
  return (
    <button
      className="mb-4 w-full text-start text-2xl font-semibold text-sage transition-all duration-300 hover:scale-[102%] hover:text-sage/80"
      onClick={onClick}
    >
      {'← Voltar'}
    </button>
  )
}
