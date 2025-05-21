import React from 'react';

const patrocinadores = [
  { src: '../public/assets/staltra.png',  url: 'https://www.staltra.es/' },
  { src: '../public/assets/avonni2.png',  url: 'https://www.hbcavonni.com/' },
  { src: '../public/assets/innova.png',   url: 'https://www.hbcinnova.com/' },
  { src: '../public/assets/taiko.png',    url: 'https://www.sbksocialclub.com/' },
  { src: '../public/assets/sbk.png',      url: 'https://www.sbksocialclub.com/' },
  { src: '../public/assets/ja.png',       url: '#' },
  { src: '../public/assets/js.png',       url: '#' },
  { src: '../public/assets/jm.png',       url: '#' },
];

export default function Footer() {
  return (
    <footer className="bg-blue-600 text-white py-8">
      <div className="container mx-auto px-4">
        {/* Patrocinadores */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-center mb-4">Patrocinadores:</h2>
          <div className="flex flex-wrap justify-between items-center">
            {patrocinadores.map(({ src, url }, i) => (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-1/4 mb-4 flex justify-center"
              >
                <img src={src} alt="" className="h-12 object-contain" />
              </a>
            ))}
          </div>
        </section>

        {/* Colaboradores */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-center mb-4">Colaboradores:</h2>
          <div className="flex justify-center">
            <a
              href="https://www.instagram.com/orale_padre"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/assets/colaboradores/orale-padre.png"
                alt="Orale Padre"
                className="h-12 object-contain"
              />
            </a>
          </div>
        </section>

        {/* Derechos */}
        <div className="border-t border-blue-500 pt-4">
          <p className="text-center text-sm">&copy; 2025 Todos los derechos reservados</p>
        </div>
      </div>
    </footer>
  );
}
