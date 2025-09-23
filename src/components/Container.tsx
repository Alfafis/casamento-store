import { Footer } from './Footer'

interface ContainerProps {
  children: React.ReactNode
}

export const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <>
      <main className="relative m-auto flex w-dvw max-w-[430px] justify-center p-8 sm:p-8 md:max-w-[1330px] md:p-12">
        <div className="fixed -right-10 -top-2 z-10 h-24 w-64 rotate-[45deg] bg-cream md:-right-10 md:top-10 lg:-right-16 lg:top-14 lg:h-32 lg:w-96"></div>
        <img
          src={'/flor.png'}
          alt="Description of image"
          className="fixed -right-24 -top-10 z-20 h-40 max-w-[100vw] rotate-[45deg] overflow-hidden object-cover md:-right-24 md:-top-8 md:h-44 lg:-right-36 lg:-top-14 lg:h-64 xl:-right-24 xl:-top-14"
          style={{ maxWidth: '100vw', overflow: 'hidden' }}
        />
        <div
          className="box-border h-full w-full rounded-soft border-4 border-[#a0af9b] p-4 pt-14 sm:p-8 md:p-12"
          style={{
            touchAction: 'pan-y',
            WebkitOverflowScrolling: 'touch',
            position: 'relative'
          }}
          id="container-scroll"
        >
          {children}
          {/* Scroll indicator for small screens */}
          {/* <ScrollIndicator /> */}
        </div>
      </main>
      <Footer />
    </>
  )
}
