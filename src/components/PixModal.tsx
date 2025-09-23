import { sendGift } from '@/services/sheet';
import { Gift } from '@/services/types';
import { useMemo, useState } from 'react';

interface PixModalProps {
  onClose: () => void;
  item: Gift;
}

export const PixModal: React.FC<PixModalProps> = ({ onClose, item }) => {
  const copiaColaBase = (import.meta.env.VITE_PIX_COPIA_E_COLA as string) || '';
  const favorecido =
    (import.meta.env.VITE_PIX_FAVORECIDO as string) || 'Favorecido';

  const payload = useMemo(() => {
    return copiaColaBase.includes('{{VALOR}}')
      ? copiaColaBase.replace('{{VALOR}}', item.valor.toFixed(2))
      : copiaColaBase;
  }, [copiaColaBase, item.valor]);

  const [dataUrl, setDataUrl] = useState('');
  // useEffect(() => {
  //   createQRFromPayloadAsync(payload).then(setDataUrl);
  // }, [payload]);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [sent, setSent] = useState(false);

  async function handleConfirm() {
    await sendGift({
      itemId: item.id,
      itemTitulo: item.titulo,
      valor: item.valor,
      nome,
      email,
      mensagem,
    });
    setSent(true);
    // dica: você pode disparar um refresh da lista ao fechar o modal
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="card max-w-lg w-full relative">
        <button
          className="absolute -top-3 -right-3 bg-gold text-white rounded-full w-9 h-9"
          onClick={onClose}
        >
          ×
        </button>
        <h3 className="heading">PIX para: {favorecido}</h3>
        <p className="mt-1 subtle">
          Item: {item.titulo} • R$ {item.valor.toFixed(2)}
        </p>
        {dataUrl && (
          <img
            src={dataUrl}
            alt="QR Code PIX"
            className="mx-auto my-4 w-56 h-56"
          />
        )}
        <div className="bg-white rounded-xl p-3 text-center select-all break-all border border-sage/20">
          {payload}
        </div>
        <p className="subtle mt-2">
          Copie o código acima no app do seu banco ou aponte a câmera para o QR
          Code.
        </p>

        <div className="mt-5 grid gap-3">
          <input
            className="card"
            placeholder="Seu nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <input
            className="card"
            placeholder="Seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <textarea
            className="card"
            placeholder="Mensagem (opcional)"
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleConfirm}>
            {sent ? 'Registrado! Obrigado ❤️' : 'Registrei o presente'}
          </button>
        </div>
      </div>
    </div>
  );
};
