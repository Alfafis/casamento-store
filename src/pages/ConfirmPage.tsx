import { Back } from '@/components/Back';
import { Button } from '@/components/Button';
import { Container } from '@/components/Container';
import { Input } from '@/components/Input';
import { sendRSVP } from '@/services/sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { z } from 'zod';

const schema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  telefone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  qtdeConvidados: z.coerce
    .number()
    .min(0, 'Mínimo 0')
    .max(10, 'Máximo 10 acompanhantes'),
  convidados: z.string().optional(),
  observacoes: z.string().max(200, 'Máximo 200 caracteres').optional(),
});

type FormData = z.infer<typeof schema>;

const ConfirmPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setLoading(true);
    try {
      const convidados = (data.convidados || '')
        .split(/,|;|\n/)
        .map((s) => s.trim())
        .filter(Boolean);
      await sendRSVP({
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        qtdeConvidados: data.qtdeConvidados,
        convidados,
        observacoes: data.observacoes,
      });
      setSubmitted(true);
      reset();
    } catch (err) {
      console.error('Erro ao enviar RSVP:', err);
      // TODO: show error message
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <Container>
        <Back onClick={() => navigate(-1)} />
        <div className="mt-16 text-center">
          <h3 className="text-2xl text-sage mb-4">Confirmação Enviada! 💚</h3>
          <p className="text-lg mb-6">
            Recebemos sua confirmação de presença. Obrigado!
          </p>
          <Button text="Voltar ao início" onClick={() => navigate('/')} />
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Back onClick={() => navigate(-1)} />
      <div className="mt-16 flex flex-col gap-2 mb-8">
        <h3 className="text-2xl font-semibold text-sage">
          Confirmação de Presença
        </h3>
        <p className="text-gray-700">
          Preencha seus dados e dos acompanhantes para confirmar sua presença.
        </p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
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
            {...register('telefone')}
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
            {...register('qtdeConvidados', {
              valueAsNumber: true,
              setValueAs: (v) => (v === '' ? 0 : Number(v)),
            })}
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
  );
};

export default ConfirmPage;
