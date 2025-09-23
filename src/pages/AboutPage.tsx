import { Back } from '@/components/Back';
import { Container } from '@/components/Container';
import { useNavigate } from 'react-router';

const AboutPage = () => {
  const navigate = useNavigate();
  const maps = import.meta.env.VITE_EVENT_GOOGLE_MAPS as string;
  const address = import.meta.env.VITE_EVENT_ADDRESS as string;

  return (
    <Container>
      <Back onClick={() => navigate(-1)} />
      <section className="flex flex-col gap-6 mt-16">
        <h3 className="text-center text-xl text-sage mb-2 font-semibold">
          Evento & Local
        </h3>
        <p>Detalhes para você se programar.</p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card">
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Início às <b>17h00</b>
              </li>
              <li>Traje sugerido: esporte fino</li>
              <li>Estacionamento no local</li>
              <li>Comandas individuais</li>
            </ul>
          </div>
          <div className="">
            <h4 className="text-center text-xl text-sage mb-2 font-semibold">
              Como chegar
            </h4>
            <p className="mb-2">{address}</p>
            <a className="btn btn-outline mb-3" href={maps} target="_blank">
              Abrir no Google Maps
            </a>
            <iframe
              className="w-full h-72 rounded-soft border border-sage/20"
              loading="lazy"
              allowFullScreen
              src={maps + '&output=embed'}
            ></iframe>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-4">
          <h4 className="text-center text-xl text-sage font-semibold">
            Cardápio
          </h4>
          <p className=" text-gray-700">
            Rodízio de pizza, carnes e parrilla, sobremesas, drinks, vinhos,
            champanhes e muito mais!
          </p>
          <div className="flex gap-4">
            <a
              className="btn btn-primary"
              href="https://livemenu.app/menu/65cf5b6ab4cea6006abfb1cb"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver Cardápio Completo
            </a>
          </div>
          <iframe
            className="w-full h-96 rounded-soft border border-sage/20 mx-auto max-w-4xl"
            loading="lazy"
            src="https://livemenu.app/menu/65cf5b6ab4cea6006abfb1cb"
            title="Cardápio Digital"
          ></iframe>
        </div>
      </section>
    </Container>
  );
};

export default AboutPage;
