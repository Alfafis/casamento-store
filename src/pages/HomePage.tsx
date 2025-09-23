import { Button } from '@/components/Button';
import { Container } from '@/components/Container';
import { Countdown } from '@/components/Countdown';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const listButtons = [
    { text: 'Confirmar Presença', path: '/confirmar-presenca' },
    { text: 'Sobre o Evento', path: '/sobre-o-evento' },
    { text: 'Lista de Presentes', path: '/lista-de-presentes' },
  ];

  return (
    <Container>
      <section className="flex flex-col h-full gap-4 justify-center items-center">
        <div className="text-center flex flex-col gap-2">
          <h1 className="font-pinyon text-7xl md:text-[92px] lg:text-[124px] text-sage">
            Rafael
          </h1>
          <div className="text-gold font-amsterdam text-7xl md:text-[92px]">
            &
          </div>
          <h1 className="font-pinyon text-7xl md:text-[92px] lg:text-[124px] text-sage">
            Isabella
          </h1>
        </div>
        <div className="text-center flex flex-col gap-12 items-center justify-center">
          <p className="text-base lg:text-2xl uppercase font-medium tracking-[1.2px] text-gray-800 text-center">
            convidam para uma celebração após o casamento civil
          </p>
          <div className="flex justify-center gap-4 items-center text-center">
            <h2 className="border-r-[3px] pr-3 border-gold/80 text-2xl font-semibold lg:text-3xl text-gray-800">
              OUT
            </h2>
            <h2 className="font-roca text-5xl md:text-xl lg:text-7xl text-gold pb-2">
              22
            </h2>
            <h2 className="border-l-[3px] border-gold/80 pl-3 lg:text-3xl text-2xl font-semibold text-gray-800">
              2025
            </h2>
          </div>
          <p className="text-center text-sm lg:text-2xl font-medium text-gray-800">
            Às 17h00, no Restaurante Rancho do Boi
          </p>
        </div>
        <div className="text-center flex flex-col gap-12 items-center justify-center">
          <Countdown />
          <div className="flex flex-col sm:flex-row justify-center gap-4 items-center text-center w-full">
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
  );
};

export default HomePage;
