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

  useEffect(() => {
    (async () => {
      try {
        const rawList = await getGifts();
        // Ensure each item has the required properties
        const list: Gift[] = rawList.map((item: any) => ({
          id: item.id,
          titulo: item.titulo,
          valor: item.valor,
          imagem: item.imagem,
          ativo: item.ativo,
        }));
        setItems(list);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Container>
      <section className="flex flex-col gap-4">
        <Back onClick={() => navigate(-1)} />
        <h3 className="text-2xl font-semibold">Lista de Presentes</h3>
        {loading && <Loading />}
        {!loading && items.length === 0 && (
          <p>Nenhum item disponível no momento.</p>
        )}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items
            .slice()
            .sort(() => Math.random() - 0.5)
            .map((g) => (
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
