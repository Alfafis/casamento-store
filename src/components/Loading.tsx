export const Loading: React.FC = () => {
  return (
    <div className="my-4 flex w-full items-center justify-center">
      <div className="flex h-14 w-14 animate-spin items-center justify-center rounded-full bg-gradient-to-tr from-gold/80 to-sage/80">
        <div className="h-9 w-9 rounded-full bg-white"></div>
      </div>
    </div>
  );
};
