import { useEffect, useState } from 'react';

const targetDate = new Date('2025-10-22T17:00:00-03:00'); // Horário de São Paulo (GMT-3)

const getTimeRemaining = () => {
  const now = new Date();
  const total = targetDate.getTime() - now.getTime();
  const clamp = (n: number) => Math.max(0, n);
  const days = clamp(Math.floor(total / (1000 * 60 * 60 * 24)));
  const hours = clamp(Math.floor((total / (1000 * 60 * 60)) % 24));
  const minutes = clamp(Math.floor((total / (1000 * 60)) % 60));
  const seconds = clamp(Math.floor((total / 1000) % 60));
  return { days, hours, minutes, seconds };
};

function Digit({ value, label }: { value: number; label: string }) {
  const [prev, setPrev] = useState(value);
  const [phase, setPhase] = useState<'idle' | 'out' | 'in'>('idle');

  useEffect(() => {
    if (value === prev) return;
    // 1) faz o valor anterior sair
    setPhase('out');
    const t1 = setTimeout(() => {
      // 2) troca para o novo valor e entra
      setPrev(value);
      setPhase('in');
      const t2 = setTimeout(() => setPhase('idle'), 260);
      return () => clearTimeout(t2);
    }, 260);
    return () => clearTimeout(t1);
  }, [value, prev]);

  const show = phase === 'out' ? prev : value;

  return (
    <div className="text-center flip w-20 select-none">
      <span
        className={[
          'block text-4xl md:text-6xl font-bold text-gold flip-card',
          phase === 'out' ? 'animate-flip-out' : '',
          phase === 'in' ? 'animate-flip-in' : '',
        ].join(' ')}
      >
        {show}
      </span>
      <span className="text-xs text-sageDark">{label}</span>
    </div>
  );
}

export const Countdown = () => {
  const [time, setTime] = useState(getTimeRemaining());

  useEffect(() => {
    const timer = setInterval(() => setTime(getTimeRemaining()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex justify-center md:gap-6 my-12">
      <Digit value={time.days} label="dias" />
      <Digit value={time.hours} label="horas" />
      <Digit value={time.minutes} label="min" />
      <Digit value={time.seconds} label="seg" />
    </div>
  );
};
