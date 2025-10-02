import { Back } from '@/components/Back'
import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { Input } from '@/components/Input'
import { sendRSVP } from '@/services/sheet'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { z } from 'zod'

const schema = z.object({
  nome: z
    .string()
    .trim()
    .min(
      2,
      'Nome deve ter pelo menos 2 caracteres e não pode ser apenas espaços'
    ),
  email: z.string().trim().email('E-mail inválido').optional(),
  telefone: z
    .string()
    .min(14, 'Telefone deve ter pelo menos 14 caracteres')
    .regex(/^\(\d{2}\) \d{5}-\d{4}$/, 'Formato: (11) 91234-5678'),
  qtdeConvidados: z.preprocess(
    (val) => {
      const n = Number(val)
      return isNaN(n) ? 0 : n
    },
    z.number().min(0, 'Mínimo 0').max(10, 'Máximo 10 acompanhantes')
  ),
  convidados: z.string().optional(),
  observacoes: z.string().max(200, 'Máximo 200 caracteres').optional()
})

type FormData = z.infer<typeof schema>

const ConfirmPage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [closeConfirm, setCloseConfirm] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur' // Valida ao sair do campo
  })

  // Máscara simples para telefone
  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/)
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`
    }
    return value
  }

  const telefoneValue = watch('telefone')

  async function onSubmit(data: FormData) {
    setLoading(true)
    try {
      const convidados = (data.convidados || '')
        .split(/,|;|\n/)
        .map((s) => s.trim())
        .filter(Boolean)
      await sendRSVP({
        nome: data.nome,
        email: data.email,
        celular: data.telefone,
        qtdeConvidados: data.qtdeConvidados,
        convidados,
        observacoes: data.observacoes
      })
      setSubmitted(true)
      reset()
    } catch (err) {
      console.error('Erro ao enviar RSVP:', err)
      // TODO: show error message
    } finally {
      setLoading(false)
    }
  }

  if (closeConfirm) {
    return (
      <Container>
        <Back
          onClick={() => {
            if (window.history.length > 2) {
              navigate(-1)
            } else {
              navigate('/')
            }
          }}
        />
        <div className="text-center">
          <h3 className="mb-4 text-2xl text-sage">Confirmação encerrada! 💚</h3>
          <p className="mb-6 text-lg">
            A lista de confirmação de presença já foi encerrada. <br />
            Caso tenha qualquer dúvida ou necessidade especial, por favor entre
            em contato diretamente com os noivos. 💚
          </p>
          <Button text="Voltar ao início" onClick={() => navigate('/')} />
        </div>
      </Container>
    )
  }

  if (submitted) {
    return (
      <Container>
        <Back
          onClick={() => {
            if (window.history.length > 2) {
              navigate(-1)
            } else {
              navigate('/')
            }
          }}
        />
        <div className="text-center">
          <h3 className="mb-4 text-2xl text-sage">Confirmação Enviada! 💚</h3>
          <p className="mb-6 text-lg">
            Recebemos sua confirmação de presença. Obrigado!
          </p>
          <Button text="Voltar ao início" onClick={() => navigate('/')} />
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <div className="flex flex-col gap-4">
        <Back
          onClick={() => {
            if (window.history.length > 2) {
              navigate(-1)
            } else {
              navigate('/')
            }
          }}
        />
        <h3 className="text-2xl font-semibold text-sage">
          Confirmação de Presença
        </h3>
        <p className="text-gray-700">
          Preencha seus dados e dos acompanhantes para confirmar sua presença.
        </p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="nome" className="font-medium">
            Nome completo *
          </label>
          <Input
            id="nome"
            placeholder="ex: Maria da Silva"
            error={errors.nome?.message}
            {...register('nome')}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="font-medium">
            E-mail *
          </label>
          <Input
            id="email"
            type="email"
            placeholder="ex: nome@exemplo.com"
            error={errors.email?.message}
            {...register('email')}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="telefone" className="font-medium">
            Telefone *
          </label>
          <Input
            id="telefone"
            placeholder="ex: (11) 91234-5678"
            error={errors.telefone?.message}
            {...register('telefone', {
              onChange: (e) => {
                const formatted = formatPhone(e.target.value)
                e.target.value = formatted
              }
            })}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="qtdeConvidados" className="font-medium">
            Quantidade de acompanhantes *
          </label>
          <Input
            id="qtdeConvidados"
            type="number"
            min={0}
            max={10}
            placeholder="ex: 2"
            error={errors.qtdeConvidados?.message}
            {...register('qtdeConvidados')}
          />
        </div>
        <div className="flex flex-col gap-1 md:col-span-2">
          <label htmlFor="convidados" className="font-medium">
            Nomes dos acompanhantes
          </label>
          <Input
            id="convidados"
            placeholder="Nomes separados por vírgula (ex: João, Maria)"
            error={errors.convidados?.message}
            {...register('convidados')}
          />
        </div>
        <div className="flex flex-col gap-1 md:col-span-2">
          <label htmlFor="observacoes" className="font-medium">
            Observações
          </label>
          <Input
            id="observacoes"
            placeholder="Alergias, restrições alimentares, etc."
            error={errors.observacoes?.message}
            {...register('observacoes')}
          />
        </div>

        <Button
          type="submit"
          text={loading ? 'Enviando...' : 'Enviar confirmação'}
          className="md:col-span-2"
          disabled={loading}
        />
      </form>
    </Container>
  )
}

export default ConfirmPage
