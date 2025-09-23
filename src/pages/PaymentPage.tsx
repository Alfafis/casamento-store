import { Back } from '@/components/Back';
import { Container } from '@/components/Container';
import { gerarPixCopiaEColaEstatico } from '@/services/pix-brcode';
import { sendGift } from '@/services/sheet';
import { copyToClipboard, toQRDataURL } from '@/services/util';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

type GiftItem = { id: string; titulo: string; valor: number; imagem?: string };

export const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // carrega o item salvo (ex.: vindo da lista)
  const item = useMemo<GiftItem | null>(() => {
    const giftList = localStorage.getItem('giftList');
    if (!giftList) return null;
    try {
      const list: GiftItem[] = JSON.parse(giftList);
      return list.find((i) => i.id === id) || null;
    } catch {
      return null;
    }
  }, [id]);

  // variáveis de ambiente (para gerar payload EMV Pix)
  const chavePix = (import.meta.env.VITE_PIX_KEY as string) || ''; // sua chave Pix no Nubank
  const favorecido =
    (import.meta.env.VITE_PIX_FAVORECIDO as string) || 'Favorecido';
  const cidade = (import.meta.env.VITE_PIX_CIDADE as string) || 'SAO PAULO';

  // fallback opcional: template "copia e cola" vindo do .env (com {{VALOR}})
  const copiaColaTemplate =
    (import.meta.env.VITE_PIX_COPIA_E_COLA as string) || '';

  // estados de UI
  const [qr, setQr] = useState(''); // dataURL do QR
  const [payload, setPayload] = useState(''); // copia-e-cola (EMV Pix)
  const [copied, setCopied] = useState(false); // feedback de cópia
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!item) return;

    // Gera payload ESTÁTICO (PIM=11, TXID=***), com valor do presente
    const copiaECola = gerarPixCopiaEColaEstatico({
      chave: chavePix,
      nome: favorecido,
      cidade,
      valor: item.valor,
    });
    setPayload(copiaECola);

    // Gera QR correspondente
    toQRDataURL(copiaECola)
      .then(setQr)
      .catch((err) => {
        console.error('Erro ao gerar QR:', err);
        setQr('');
      });
  }, [chavePix, cidade, favorecido, item, item.id]);

  async function handleCopy() {
    try {
      await copyToClipboard(payload);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  }

  async function handleConfirm() {
    if (!item) return;
    if (!nome.trim() || !email.trim()) {
      setError('Nome e e-mail são obrigatórios.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await sendGift({
        itemId: item.id,
        itemTitulo: item.titulo,
        valor: item.valor,
        nome: nome.trim(),
        email: email.trim(),
        mensagem: mensagem.trim(),
      });
      setSent(true);
    } catch (err) {
      setError('Erro ao registrar o presente. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  if (!item) {
    return (
      <Container>
        <Back onClick={() => navigate(-1)} />
        <div className="text-center py-8 mt-16">
          <p className="text-lg text-sageDark">Presente não encontrado.</p>
          <p className="text-sm text-sage mt-2">
            Volte para a lista de presentes.
          </p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Back onClick={() => navigate(-1)} />
      <div className="mt-16 flex flex-col gap-4 items-center max-w-md mx-auto">
        <h3 className="text-center text-xl text-sage mb-2">
          Presentear: {item.titulo}
        </h3>
        <p className="text-center text-2xl font-semibold text-gold">
          R$ {item.valor.toFixed(2)}
        </p>

        {qr && (
          <img
            src={qr}
            alt="QR Code PIX"
            className="w-48 h-48 rounded-lg border border-sage/20 shadow-sm"
          />
        )}

        {/* Copia e Cola */}
        <div className="bg-cream rounded-xl p-4 w-full border border-sage/20">
          <p className="text-sm font-medium text-sageDark text-center mb-2">
            Código PIX (Copia e Cola):
          </p>
          <div className="text-xs text-sageDark break-all text-center select-all max-h-40 overflow-y-auto">
            {payload || 'Gerando código Pix...'}
          </div>
        </div>

        <Button
          text={copied ? 'Copiado! ✅' : 'Copiar código PIX'}
          onClick={handleCopy}
          disabled={!payload}
          className="w-full"
        />

        <p className="text-center text-sm text-sage px-4">
          Copie o código acima ou aponte a câmera para o QR Code no app do seu
          banco.
        </p>

        <div className="w-full space-y-4">
          <Input
            placeholder="Seu nome *"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          <Input
            placeholder="Seu e-mail *"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
          <Input
            placeholder="Mensagem (opcional)"
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
          />

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <Button
            text={
              sent
                ? 'Registrado! Obrigado ❤️'
                : loading
                ? 'Registrando...'
                : 'Registrar presente'
            }
            onClick={handleConfirm}
            disabled={sent || loading}
            className="w-full"
          />
        </div>
      </div>
    </Container>
  );
};
