import { cn } from '@/services/util';

interface ButtonProps {
  text: string;
  className?: string;
  onClick?: () => void | Promise<void>;
}

export const Button = ({ text, className, onClick }: ButtonProps) => {
  return (
    <button
      className={cn(
        'bg-gold w-full text-white px-4 py-2 underline transition-all duration-300 hover:bg-gold-dark rounded-md cursor-pointer font-semibold hover:scale-[102%]',
        className
      )}
      onClick={onClick}
    >
      {text}
    </button>
  );
};
