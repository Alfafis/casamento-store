interface ContainerProps {
  children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <main className="max-w-[430px] md:max-w-[1440px] w-full flex justify-center relative p-6 sm:p-8 md:p-12 m-auto overflow-hidden">
      <div className="absolute w-64 h-24 bg-cream z-0 right-[-15%] top-5 rotate-[45deg] md:right-[-5%] md:top-10 lg:top-12 lg:right-[-4%] lg:w-96 lg:h-32"></div>
      <img
        src={'/flor.png'}
        alt="Description of image"
        className="absolute h-[162px] lg:h-[256px] object-cover z-10 lg:right-[-14%] lg:top-[-5%] rotate-[45deg] right-[-22.5%] top-[-3.5%] md:right-[-10%] md:top-[-2%]"
      />
      <div
        className="w-full h-full max-h-dvh border-4 border-[#a0af9b] rounded-soft box-border p-4 sm:p-8 md:p-12 overflow-y-auto"
        style={{ touchAction: 'pan-y', WebkitOverflowScrolling: 'touch' }}
      >
        {children}
      </div>
    </main>
  );
};
