import { Back } from '@/components/Back'
import { Container } from '@/components/Container'
import { gerarPixCopiaEColaEstatico } from '@/services/pix-brcode'
import { sendGift } from '@/services/sheet'
import { copyToClipboard, toQRDataURL } from '@/services/util'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '../components/Button'
import { Input } from '../components/Input'

type GiftItem = { id: string; titulo: string; valor: number; imagem?: string }

export const PaymentPage: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  // carrega o item salvo (ex.: vindo da lista)
  const item = useMemo<GiftItem | null>(() => {
    const giftList = localStorage.getItem('giftList')
    if (!giftList) return null
    try {
      const list: GiftItem[] = JSON.parse(giftList)
      return list.find((i) => i.id === id) || null
    } catch {
      return null
    }
  }, [id])

  // variáveis de ambiente (para gerar payload EMV Pix)
  const chavePix = (import.meta.env.VITE_PIX_KEY as string) || '' // sua chave Pix no Nubank
  const favorecido =
    (import.meta.env.VITE_PIX_FAVORECIDO as string) || 'Favorecido'
  const cidade = (import.meta.env.VITE_PIX_CIDADE as string) || 'SAO PAULO'

  // fallback opcional: template "copia e cola" vindo do .env (com {{VALOR}})
  const copiaColaTemplate =
    (import.meta.env.VITE_PIX_COPIA_E_COLA as string) || ''

  // estados de UI
  const [qr, setQr] = useState('') // dataURL do QR
  const [payload, setPayload] = useState('') // copia-e-cola (EMV Pix)
  const [copied, setCopied] = useState(false) // feedback de cópia
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0) // segundos restantes

  // Timer de 5 minutos (300 segundos)
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  async function handleGeneratePix() {
    if (!item) return
    if (!nome.trim() || !email.trim()) {
      setError('Nome e e-mail são obrigatórios.')
      return
    }
    setLoading(true)
    setError('')
    try {
      // Gera payload com mensagem incluída
      const copiaECola = gerarPixCopiaEColaEstatico({
        chave: chavePix,
        nome: favorecido,
        cidade,
        valor: item.valor,
        descricao: mensagem.trim() || `Presente: ${item.titulo}`
      })
      setPayload(copiaECola)

      // Gera QR correspondente
      const qrData = await toQRDataURL(copiaECola)
      setQr(qrData)

      setFormSubmitted(true)
      setTimeLeft(300) // 5 minutos
    } catch (err) {
      console.error('Erro ao gerar PIX:', err)
      setError('Erro ao gerar código PIX. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    try {
      await copyToClipboard(payload)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch (err) {
      console.error('Erro ao copiar:', err)
    }
  }

  async function handleConfirm() {
    if (!item) return
    setLoading(true)
    setError('')
    try {
      const now = new Date()
      const pad = (n: number) => n.toString().padStart(2, '0')
      const formattedTimestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
      await sendGift({
        itemId: item.id,
        itemTitulo: item.titulo,
        valor: item.valor,
        nome: nome.trim(),
        email: email.trim(),
        mensagem: mensagem.trim(),
        timestamp: formattedTimestamp,
        status: 'pendente'
      })
      setSent(true)
    } catch (err) {
      setError('Erro ao registrar o presente. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (!item) {
    return (
      <Container>
        <Back onClick={() => navigate(-1)} />
        <div className="py-8 text-center">
          <p className="text-sageDark text-lg">Presente não encontrado.</p>
          <p className="mt-2 text-sm text-sage">
            Volte para a lista de presentes.
          </p>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <Back onClick={() => navigate(-1)} />
      <div className="flex flex-col items-center gap-4">
        <div className="flex w-full flex-col items-center gap-2">
          <h3 className="text-sageDark text-center text-3xl font-bold">
            Presentear
          </h3>
          <p className="text-sageDark text-center text-xl font-medium">
            {item.titulo}
          </p>
          {!formSubmitted && item.imagem && (
            <img
              src={item.imagem}
              alt={item.titulo}
              className="mb-2 h-44 w-44 rounded-xl border border-sage/10 object-cover shadow-md"
            />
          )}
          <div className="mt-1 flex items-center justify-center gap-2">
            <span className="text-2xl font-bold text-gold">
              R$ {item.valor.toFixed(2)}
            </span>
          </div>
          <span className="rounded bg-gold/10 px-2 py-1 text-xs font-semibold text-gold">
            Valor do presente
          </span>
        </div>

        {!formSubmitted ? (
          // Formulário para coletar dados
          <aside className="flex w-7/12 flex-col gap-8 bg-cream">
            <p className="px-4 text-center text-lg font-semibold text-sage">
              Preencha seus dados para gerar o código PIX personalizado.
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
                placeholder="Mensagem personalizada (opcional)"
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
              />

              {error && (
                <p className="text-center text-sm text-red-500">{error}</p>
              )}

              <Button
                text={loading ? 'Gerando PIX...' : 'Gerar Código PIX'}
                onClick={handleGeneratePix}
                disabled={loading}
                className="w-full"
              />
            </div>
          </aside>
        ) : (
          // Seção PIX com timer
          <article className="flex w-7/12 flex-col items-center gap-8 bg-cream p-6">
            {timeLeft > 0 ? (
              <>
                <div className="text-center">
                  <p className="text-2xl text-red-500">
                    Código válido por:{' '}
                    <span className="font-semibold text-red-500">
                      {Math.floor(timeLeft / 60)}:
                      {(timeLeft % 60).toString().padStart(2, '0')}
                    </span>
                  </p>
                </div>

                {qr && (
                  <img
                    src={qr}
                    alt="QR Code PIX"
                    className="h-48 w-48 rounded-lg border border-sage/20 shadow-sm"
                  />
                )}

                {/* Copia e Cola */}
                <div className="w-full rounded-xl border border-sage/20 bg-cream p-4">
                  <p className="text-sageDark mb-2 text-center text-sm font-medium">
                    Código PIX (Copia e Cola):
                  </p>
                  <div className="text-sageDark max-h-40 select-all overflow-y-auto break-all text-center text-xs">
                    {payload}
                  </div>
                </div>

                <Button
                  text={copied ? 'Copiado! ✅' : 'Copiar código PIX'}
                  onClick={handleCopy}
                  disabled={!payload}
                  className="w-full"
                />

                <p className="px-4 text-center text-sm text-sage">
                  Copie o código acima ou aponte a câmera para o QR Code no app
                  do seu banco.
                </p>

                <Button
                  text={
                    sent
                      ? 'Registrado! Obrigado ❤️'
                      : loading
                        ? 'Registrando...'
                        : 'Confirmar Pagamento'
                  }
                  onClick={handleConfirm}
                  disabled={sent || loading}
                  className="w-full"
                />
              </>
            ) : (
              // Timer expirado
              <div className="text-center">
                <p className="mb-4 text-lg text-red-500">
                  ⏰ Código PIX expirado!
                </p>
                <p className="mb-6 text-sm text-sage">
                  Gere um novo código para continuar.
                </p>
                <Button
                  text="Gerar Novo Código"
                  onClick={() => {
                    setFormSubmitted(false)
                    setQr('')
                    setPayload('')
                    setTimeLeft(0)
                  }}
                  className="w-full"
                />
              </div>
            )}
          </article>
        )}
      </div>
    </Container>
  )
}
