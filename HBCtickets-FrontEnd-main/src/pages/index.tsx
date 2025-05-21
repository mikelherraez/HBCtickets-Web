// src/pages/index.tsx
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Carousel } from 'react-responsive-carousel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faClock, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

import Header from '../components/Header';
import Footer from '../components/Footer';
import BottomNav from '../components/BottomNav';
import URL_BACK from '../config/urlBack';

import 'react-responsive-carousel/lib/styles/carousel.min.css';

const formatTime = (d: string) =>
  new Date(d).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });

export default function HomePage() {
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  /** ──────────────── Cargar usuario ──────────────── */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUsername(localStorage.getItem('username'));
      setRole(localStorage.getItem('role'));
    }
  }, []);

  /** ──────────────── Fetch de eventos populares ──────────────── */
  useEffect(() => {
    fetch(`${URL_BACK}/api/events/filter/bypopular`)
      .then(r => r.json())
      .then(data => {
        const up = data.filter((e: any) => new Date(e.date) > new Date());
        setEvents(up);
        setFiltered(up);
      })
      .catch(console.error);
  }, []);

  /** ──────────────── Filtrado en tiempo real ──────────────── */
  useEffect(() => {
    if (!query) return setFiltered(events);
    const q = query.toLowerCase();
    setFiltered(
      events.filter(
        e =>
          e.title.toLowerCase().includes(q) ||
          e.localizacion.toLowerCase().includes(q)
      )
    );
  }, [query, events]);

  const goTo = (id: number) => void router.push(`/event/${id}`);

  return (
    <>
      <Head>
        <title>HBC Tickets • Inicio</title>
      </Head>

      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
        {/* HEADER */}
        <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow">
          <Header username={username} />
        </header>

        {/* HERO */}
        <main className="flex-grow">
          <section className="relative px-4 md:px-8 py-8">
            <Carousel
              autoPlay
              infiniteLoop
              interval={5000}
              showThumbs={false}
              showStatus={false}
              showIndicators={false}
              emulateTouch
            >
              {[1, 2, 3].map(i => (
                <div key={i} className="px-2">
                  <div className="h-64 md:h-96 overflow-hidden rounded-lg relative">
                    <Image
                      src={`/assets/evento${i}.jpg`}
                      alt={`Evento ${i}`}
                      fill
                      className="object-cover"
                      sizes="(min-width: 768px) 50vw, 100vw"
                      priority={i === 1} // solo la primera se marca como crítica
                    />
                  </div>
                </div>
              ))}
            </Carousel>

            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center px-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white text-center drop-shadow-lg max-w-3xl">
                Encuentra tus eventos favoritos
              </h1>
              <div className="mt-8 w-full max-w-md">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar por ciudad o evento..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    className="
                      w-full pl-4 pr-12 py-3 rounded-full
                      bg-white/90 dark:bg-gray-800/90
                      focus:outline-none focus:ring-2 focus:ring-primary
                      text-gray-800 dark:text-gray-100
                    "
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 btn btn-primary">
                    <FontAwesomeIcon icon={faSearch} />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* DESTACADOS */}
          <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
              Destacados
            </h2>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.slice(0, 8).map(evt => (
                <div
                  key={evt.id}
                  onClick={() => goTo(evt.id)}
                  className="
                    bg-white dark:bg-gray-800 rounded-xl overflow-hidden
                    shadow-md hover:shadow-xl transition-shadow cursor-pointer
                    flex flex-col
                  "
                >
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={evt.imageUrl}
                      alt={evt.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                      {evt.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-1">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="inline mr-1" />
                      {evt.localizacion}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <FontAwesomeIcon icon={faClock} />
                        {formatTime(evt.date)}
                      </span>
                      <button className="btn btn-secondary">
                        Ver más
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* FOOTER */}
        <Footer />

        {/* BOTTOM NAV */}
        <BottomNav role={role} />
      </div>
    </>
  );
}
