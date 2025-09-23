import { Gift } from '@/services/types';
import { useState } from 'react';
import { Button } from './Button';
import { PixModal } from './PixModal';

export const GiftCard: React.FC<Gift> = ({ id, titulo, valor, imagem }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white border-2 border-gold/30 rounded-[6px] p-4 cursor-pointer flex max-w-xs flex-col justify-between items-center">
      {imagem && (
        <img
          src={imagem}
          alt={titulo}
          className="w-full h-40 object-contain rounded-2xl mb-6"
        />
      )}
      <div className="flex flex-col gap-2 items-center">
        <h3
          className="text-xl text-sage mb-2 text-center max-w-8/10"
          title={titulo}
        >
          {titulo}
        </h3>
        <p className="text-gold-dark font-semibold text-2xl mb-4">
          R$ {valor.toFixed(2)}
        </p>
        <Button
          text="Escolher este presente"
          onClick={() => setOpen(true)}
          className="w-11/12"
        />
      </div>
      {open && (
        <PixModal
          onClose={() => setOpen(false)}
          item={{ id, titulo, valor, imagem, ativo: 'sim' }}
        />
      )}
    </div>
  );
};
