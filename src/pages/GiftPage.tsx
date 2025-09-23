import { Back } from '@/components/Back';
import { Container } from '@/components/Container';
import { GiftCard } from '@/components/GiftCard';
import { Loading } from '@/components/Loading';
import { getGifts } from '@/services/sheet';
import { Gift } from '@/services/types';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GiftPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const loadGifts = async () => {
      const cached = localStorage.getItem('giftList');
      let cachedList: Gift[] = [];

      // Se existe cache, exibe imediatamente
      if (cached) {
        try {
          cachedList = JSON.parse(cached);
          setItems(cachedList);
          setLoading(false);
        } catch (err) {
          console.error('Erro ao parsear cache:', err);
          localStorage.removeItem('giftList'); // Remove cache inválido
        }
      }

      // Busca dados atualizados em background
      try {
        setUpdating(true);
        const rawList = await getGifts();
        const freshList: Gift[] = rawList.map((item: any) => ({
          id: item.id,
          titulo: item.titulo,
          valor: item.valor,
          imagem: item.imagem,
          ativo: item.ativo,
        }));

        // Atualiza apenas se houver diferença
        const hasChanged =
          JSON.stringify(freshList) !== JSON.stringify(cachedList);
        if (hasChanged) {
          setItems(freshList);
          localStorage.setItem('giftList', JSON.stringify(freshList));
        }
      } catch (err) {
        console.error('Erro ao buscar presentes:', err);
        // Se não tinha cache e falhou, mostra erro
        if (!cached) {
          setItems([]);
        }
      } finally {
        setUpdating(false);
        setLoading(false);
      }
    };

    loadGifts();
  }, []);

  return (
    <Container>
      <Back onClick={() => navigate(-1)} />
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold">Lista de Presentes</h3>
          {updating && (
            <span className="text-sm text-gray-500">Atualizando...</span>
          )}
        </div>
        {loading && <Loading />}
        {!loading && items.length === 0 && (
          <p>Nenhum item disponível no momento.</p>
        )}
        <div className="grid justify-center md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((g) => (
            <GiftCard
              key={g.id}
              id={g.id}
              titulo={g.titulo}
              valor={g.valor}
              imagem={g.imagem}
              ativo={g.ativo}
            />
          ))}
        </div>
      </section>
    </Container>
  );
};

export default GiftPage;
