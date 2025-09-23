import { sendRSVP } from '@/services/sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  nome: z.string().min(2),
  email: z.string().email(),
  telefone: z.string().min(8),
  qtdeConvidados: z.coerce.number().min(0).max(10),
  convidados: z.string().optional(),
  observacoes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const ConfirmPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
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
    reset();
  }

  return (
    <section>
      <h3>Confirmação de Presença</h3>
      <p>Preencha seus dados e dos acompanhantes.</p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-2xl mx-auto grid gap-4"
      >
        <input
          className="card"
          placeholder="Nome completo"
          {...register('nome')}
        />
        <input className="card" placeholder="E-mail" {...register('email')} />
        <input
          className="card"
          placeholder="Telefone"
          {...register('telefone')}
        />
        <input
          className="card"
          type="number"
          min={0}
          max={10}
          placeholder="Quantidade de acompanhantes"
          {...register('qtdeConvidados')}
        />
        <textarea
          className="card"
          placeholder="Nomes dos convidados (separados por vírgula)"
          rows={3}
          {...register('convidados')}
        />
        <textarea
          className="card"
          placeholder="Observações (alergias, etc.)"
          rows={3}
          {...register('observacoes')}
        />
        <button className="btn btn-primary" type="submit">
          Enviar confirmação
        </button>
        {isSubmitSuccessful && (
          <p className="text-green-700">
            Recebemos sua confirmação. Obrigado! 💚
          </p>
        )}
      </form>
    </section>
  );
};

export default ConfirmPage;
