export const Footer = () => {
  return (
    <footer className="fixed bottom-1 z-20 w-full md:bottom-4">
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
