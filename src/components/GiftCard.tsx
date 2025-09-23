import { Gift } from '@/services/types';
import { useNavigate } from 'react-router-dom';
import { Button } from './Button';

export const GiftCard: React.FC<Gift> = ({ id, titulo, valor, imagem }) => {
  const navigate = useNavigate();
  return (
    <div className="flex max-w-xs cursor-pointer flex-col items-center justify-between rounded-soft border-2 border-gold/30 bg-white p-4">
      {imagem && (
        <img
          src={imagem}
          alt={titulo}
          className="mb-6 h-40 w-full rounded-soft object-contain"
        />
      )}
      <div className="flex flex-col items-center gap-2">
        <h3
          className="max-w-10/12 mb-2 text-center text-xl text-sage"
          title={titulo}
        >
          {titulo}
        </h3>
        <p className="mb-4 text-2xl font-semibold text-gold-dark">
          R$ {valor.toFixed(2)}
        </p>
        <Button
          text="Escolher este presente"
          onClick={() => navigate(`/pagar-presente/${id}`)}
          className="w-11/12"
        />
      </div>
    </div>
  );
};
