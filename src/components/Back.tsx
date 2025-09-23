interface BackProps {
  onClick: () => void;
}

export const Back: React.FC<BackProps> = ({ onClick }) => {
  return (
    <button
      className="mb-4 text-2xl w-full text-start transition-all duration-300 text-sage hover:text-sage/80 font-semibold hover:scale-[102%]"
      onClick={onClick}
    >
      {'← Voltar'}
    </button>
  );
};
