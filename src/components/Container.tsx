import { Footer } from './Footer'

interface ContainerProps {
  children: React.ReactNode
}

export const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <>
      <main className="relative m-auto mb-4 flex w-dvw max-w-[430px] justify-center p-8 sm:p-8 md:max-w-[1330px] md:p-12">
        <div
          className="relative -z-20 box-border h-full w-full rounded-soft border-b-4 border-l-4 border-r-4 border-t-4 border-[#a0af9b] p-4 pt-14 sm:p-8 md:p-12"
          style={{
            touchAction: 'pan-y',
            WebkitOverflowScrolling: 'touch',
            position: 'relative'
          }}
          id="container-scroll"
        >
          <img
            src={'/flor_rot_45_square.png'}
            alt="Description of image"
            className="absolute right-[calc(324px-135%)] top-[calc(324px-7%)] -z-30 h-[324px] md:right-[calc(424px-94%)] md:top-[calc(424px-17%)] md:h-[424px] lg:right-[calc(424px-66%)] lg:top-[calc(424px-21%)] lg:h-[424px] xl:right-[calc(424px-51%)] xl:top-[calc(424px-23%)] xl:h-[424px]"
          />
          {children}
        </div>
      </main>
      <Footer />
    </>
  )
}
