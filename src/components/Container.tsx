import { Footer } from './Footer'
import { ScrollIndicator } from './ScrollIndicator'

interface ContainerProps {
  children: React.ReactNode
}

export const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <>
      <main className="relative m-auto flex min-h-screen w-full max-w-[430px] justify-center overflow-hidden p-8 sm:p-8 md:max-w-[1330px] md:p-12">
        <div className="absolute right-[-15%] top-5 z-10 h-24 w-64 rotate-[45deg] bg-cream md:right-[-5%] md:top-10 lg:right-[-4%] lg:top-10 lg:h-32 lg:w-96"></div>
        <img
          src={'/flor.png'}
          alt="Description of image"
          className="absolute right-[-22.5%] top-[-3.5%] z-20 h-[162px] rotate-[45deg] object-cover md:right-[-10%] md:top-[-2%] lg:right-[-11%] lg:top-[-4%] lg:h-[242px] xl:right-[-11%] xl:top-[-5%] xl:h-[264px]"
        />
        <div
          className="box-border h-full min-h-[calc(100dvh-2rem)] w-full overflow-y-auto rounded-soft border-4 border-[#a0af9b] p-4 sm:p-8 md:p-12"
          style={{
            touchAction: 'pan-y',
            WebkitOverflowScrolling: 'touch',
            position: 'relative',
            maxHeight: 'calc(100dvh - 2rem)' // Fallback para navegadores que não suportam dvh
          }}
          id="container-scroll"
        >
          {children}
          {/* Scroll indicator for small screens */}
          <ScrollIndicator />
        </div>
      </main>
      <Footer />
    </>
  )
}
