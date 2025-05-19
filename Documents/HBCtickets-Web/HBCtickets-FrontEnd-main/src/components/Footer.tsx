// src/components/Footer.jsx
import React from 'react'

const patrocinadores = [
  { src: '/patrocinadores/staltra.png',    url: 'https://www.staltra.es/' },
  { src: '/patrocinadores/avonni2.png',    url: 'https://www.hbcavonni.com/' },
  { src: '/patrocinadores/innova.png',     url: 'https://www.hbcinnova.com/' },
  { src: '/patrocinadores/taiko.png',      url: 'https://www.sbksocialclub.com/' },
  { src: '/patrocinadores/sbk.png',        url: 'https://www.sbksocialclub.com/' },
  { src: '/patrocinadores/ja.png',         url: '#' },
  { src: '/patrocinadores/js.png',         url: '#' },
  { src: '/patrocinadores/jm.png',         url: '#' },
]

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
                <img
                  src={src}
                  alt=""
                  className="h-12 object-contain"
                />
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
                src="/colaboradores/orale-padre.png"
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
  )
}
