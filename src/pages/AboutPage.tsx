const AboutPage = () => {
  const maps = import.meta.env.VITE_EVENT_GOOGLE_MAPS as string;
  const address = import.meta.env.VITE_EVENT_ADDRESS as string;
  return (
    <>
      <section>
        <h3>Evento & Local</h3>
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
          <div className="card">
            <h4 className="font-serif text-xl mb-2">Como chegar</h4>
            <p className="mb-2">{address}</p>
            <a className="btn btn-outline mb-3" href={maps} target="_blank">
              Abrir no Google Maps
            </a>
            <iframe
              className="w-full h-72 rounded-2xl border border-sage/20"
              loading="lazy"
              allowFullScreen
              src={maps + '&output=embed'}
            ></iframe>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
