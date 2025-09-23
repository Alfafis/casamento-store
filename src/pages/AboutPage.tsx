import { Back } from '@/components/Back'
import { Container } from '@/components/Container'
import { useNavigate } from 'react-router'

const AboutPage = () => {
  const navigate = useNavigate()
  const maps = import.meta.env.VITE_EVENT_GOOGLE_MAPS as string
  const address = import.meta.env.VITE_EVENT_ADDRESS as string

  return (
    <Container>
      <h3 className="flex flex-col gap-4 text-center text-xl font-semibold text-sage lg:mb-8 lg:mt-8 lg:text-4xl">
        <Back onClick={() => navigate('/')} />
        Evento & Local
      </h3>
      <div>
        <p>Detalhes para você se programar.</p>
        <ul className="mb-12 list-disc space-y-2 pl-5">
          <li className="text-lg">
            Início às <b>17h00</b>
          </li>
          <li>Traje sugerido: esporte fino</li>
          <li>Estacionamento no local</li>
          <li>Comandas individuais</li>
        </ul>
      </div>
      <section className="flex flex-col items-start justify-between gap-12 md:flex-col lg:flex-row lg:justify-between">
        <article className="flex flex-col justify-center gap-6 lg:w-6/12">
          <h4 className="text-center text-2xl font-semibold text-sage">
            Como chegar
          </h4>
          <p>
            <strong>Local:</strong> {address}
            <br />
            <strong>Endereço:</strong> BR-040, Km 545 - s/n - Estância Serrana,
            Nova Lima - MG, 34000-000
          </p>
          <a
            className="text-center font-semibold text-sage underline"
            href={maps}
            target="_blank"
          >
            Abrir no Google Maps
          </a>
          <iframe
            className="mx-auto h-96 w-full max-w-4xl rounded-soft border border-sage/20"
            loading="lazy"
            allowFullScreen
            src={maps + '&output=embed'}
          ></iframe>
        </article>
        <aside className="flex flex-col justify-center gap-6 lg:w-6/12">
          <h4 className="text-center text-2xl font-semibold text-sage">
            Cardápio
          </h4>
          <p>
            <strong>Opções:</strong> Rodízio de pizza, carnes, parrilla,
            sobremesas, drinks, vinhos, champanhes e muito mais!
          </p>
          <a
            className="text-center font-semibold text-sage underline"
            href="https://livemenu.app/menu/65cf5b6ab4cea6006abfb1cb"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver Cardápio Completo
          </a>
          <iframe
            className="mx-auto h-96 w-full max-w-4xl rounded-soft border border-sage/20"
            loading="lazy"
            src="https://livemenu.app/menu/65cf5b6ab4cea6006abfb1cb"
            title="Cardápio Digital"
          ></iframe>
        </aside>
      </section>
    </Container>
  )
}

export default AboutPage
