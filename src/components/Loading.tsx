interface LoadingProps {
  size?: number // tamanho em pixels, padrão 56 (14 * 4)
}

export const Loading: React.FC<LoadingProps> = ({ size = 56 }) => {
  const innerSize = Math.round(size * 0.64) // proporcional ao original (9/14)
  return (
    <div className="my-4 flex items-center justify-center">
      <div
        className="flex animate-spin items-center justify-center rounded-full bg-gradient-to-tr from-gold/80 to-sage/80"
        style={{ width: size, height: size }}
      >
        <div
          className="rounded-full bg-white"
          style={{ width: innerSize, height: innerSize }}
        ></div>
      </div>
    </div>
  )
}
