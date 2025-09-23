export const Loading: React.FC = () => {
  return (
    <div className="w-full flex justify-center items-center my-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-gold/80 to-sage/80 animate-spin">
        <div className="h-9 w-9 rounded-full bg-cream"></div>
      </div>
    </div>
  );
};
