export const Footer = () => {
  return (
    <footer className="fixed bottom-1 z-20 w-dvw bg-cream md:bottom-4">
      <div className="container-narrow text-center text-xs text-sage">
        <p>
          Site feito com muito amor ❤ - Desenvolvido por{' '}
          <a
            href="https://www.instagram.com/alfafis/"
            className="cursor-pointer underline hover:text-gold"
            target="_blank"
            rel="noopener noreferrer"
          >
            Alfafis
          </a>
        </p>
      </div>
    </footer>
  )
}
