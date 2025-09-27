export const Footer = () => {
  return (
    <footer className="border-1 flex w-full items-center justify-center border-t border-sage bg-cream/90 p-2 backdrop-blur-sm">
      <div className="container-narrow text-center text-xs text-sage">
        <p>
          Site feito com muito amor ❤ - Desenvolvido por{' '}
          <button
            className="cursor-pointer border-none bg-transparent p-0 text-inherit underline hover:text-gold"
            onClick={() =>
              window.open(
                'https://www.instagram.com/alfafis',
                '_blank',
                'noopener,noreferrer'
              )
            }
            type="button"
          >
            Alfafis
          </button>
        </p>
      </div>
    </footer>
  )
}
