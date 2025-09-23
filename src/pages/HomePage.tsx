import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { Countdown } from '@/components/Countdown'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  const navigate = useNavigate()

  const listButtons = [
    { text: 'Confirmar Presença', path: '/confirmar-presenca' },
    { text: 'Sobre o Evento', path: '/sobre-o-evento' },
    { text: 'Lista de Presentes', path: '/lista-de-presentes' }
  ]

  return (
    <Container>
      <section className="mb-10 flex flex-col items-center justify-start gap-4 lg:mb-0">
        <div className="mt-16 flex flex-col gap-2 text-center lg:mb-6">
          <h1 className="font-pinyon text-7xl text-sage md:text-7xl lg:text-8xl">
            Rafael
          </h1>
          <div className="font-amsterdam text-7xl text-gold md:text-7xl">&</div>
          <h1 className="font-pinyon text-7xl text-sage md:text-7xl lg:text-8xl">
            Isabella
          </h1>
        </div>
        <div className="flex flex-col items-center justify-center gap-12 text-center lg:gap-8">
          <p className="text-center text-base font-medium uppercase tracking-[1.2px] text-gray-800 lg:text-2xl">
            convidam para uma celebração após o casamento civil
          </p>
          <div className="flex items-center justify-center gap-4 text-center">
            <h2 className="border-r-[3px] border-gold/80 pr-3 text-2xl font-semibold text-gray-800 lg:text-3xl">
              OUT
            </h2>
            <h2 className="pb-2 font-roca text-5xl text-gold md:text-xl lg:text-7xl">
              22
            </h2>
            <h2 className="border-l-[3px] border-gold/80 pl-3 text-2xl font-semibold text-gray-800 lg:text-3xl">
              2025
            </h2>
          </div>
          <p className="text-center text-sm font-medium text-gray-800 lg:text-2xl">
            Às 17h00, no Restaurante Rancho do Boi
          </p>
        </div>
        <div className="flex flex-col items-center justify-center gap-12 text-center">
          <Countdown />
          <div className="flex w-full flex-col items-center justify-center gap-4 text-center sm:flex-row">
            {listButtons.map((button, index) => (
              <Button
                key={index}
                text={button.text}
                className="w-full sm:w-auto"
                onClick={() => navigate(button.path)}
              />
            ))}
          </div>
        </div>
      </section>
    </Container>
  )
}

export default HomePage
