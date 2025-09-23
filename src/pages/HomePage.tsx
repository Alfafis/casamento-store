import { Button } from '@/components/Button';
import { Container } from '@/components/Container';
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
      <div className="relative flex gap-8 items-center justify-center">
        <div className="text-center mt-24">
          <h1 className="font-pinyon text-7xl md:text-[92px] lg:text-[124px] text-sage mt-3">
            Rafael
          </h1>
          <div className="text-gold font-amsterdam text-7xl md:text-[92px] my-2 ">
            &
          </div>
          <h1 className="font-pinyon text-7xl md:text-[92px] lg:text-[124px] text-sage mb-16">
            Isabella
          </h1>
          <p className="text-sm lg:text-2xl uppercase font-medium tracking-[1.2px] text-gray-800">
            convidam para uma celebração após o casamento civil
          </p>
        </div>
      </div>
      <div className="flex justify-center gap-4 items-center text-center my-8">
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
      <div className="flex flex-col sm:flex-row justify-center gap-4 items-center text-center mt-12 mb-32 lg:mb-0 lg:mt-0 lg:absolute lg:bottom-24 lg:left-1/2 lg:-translate-x-1/2 w-full lg:px-24">
        {listButtons.map((button, index) => (
          <Button
            key={index}
            text={button.text}
            onClick={() => navigate(button.path)}
          />
        ))}
      </div>
    </Container>
  );
};

export default HomePage;
