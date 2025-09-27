import { Footer } from './Footer'

interface ContainerProps {
  children: React.ReactNode
}

export const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <>
      <main className="relative m-auto flex w-dvw max-w-[430px] justify-center p-8 sm:p-8 md:max-w-[1440px] md:p-12">
        <img
          src={'/flor_rot_45_square1.png'}
          alt="Description of image"
          className="absolute right-0 top-0 z-10 h-32 overflow-hidden object-cover md:h-56"
        />
        <div
          className="box-border h-full min-h-[90dvh] w-full rounded-soft border-b-4 border-l-4 border-r-4 border-t-4 border-[#a0af9b] p-4 pt-14 sm:p-8 md:p-12"
          style={{
            touchAction: 'pan-y',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {children}
        </div>
      </main>
      <Footer />
    </>
  )
}
