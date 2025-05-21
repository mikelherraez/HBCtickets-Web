import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Carousel } from 'react-responsive-carousel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faClock, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

import Header     from '../components/Header';
import Footer     from '../components/Footer';
import BottomNav  from '../components/BottomNav';
import URL_BACK   from '../config/urlBack';

import 'react-responsive-carousel/lib/styles/carousel.min.css'; // estilos del carrusel

const formatEventTime = (d) =>
  new Date(d).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

export default function HomePage() {
  const router = useRouter();

  const [username, setUsername]       = useState(null);
  const [role, setRole]               = useState(null);
  const [events, setEvents]           = useState([]);
  const [filteredEvents, setFiltered] = useState([]);
  const [culturalEvents, setCultura]  = useState([]);
  const [upcomingEvents, setUpcoming] = useState([]);
  const [lastTicketsEvents, setLast]  = useState([]);
  const [searchQuery, setSearch]      = useState('');

  /* ---------- usuario ---------- */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUsername(localStorage.getItem('username'));
      setRole(localStorage.getItem('role'));
    }
  }, []);

  /* ---------- fetch ---------- */
  const fetchEvents = async () => {
    try {
      const res  = await fetch(`${URL_BACK}/api/events/filter/bypopular`);
      if (!res.ok) throw new Error('Error fetching popular');
      const data = await res.json();
      const now  = new Date();
      const upcoming = data.filter(e => new Date(e.date) > now);

      setEvents(upcoming);
      setFiltered(upcoming);
      setCultura(upcoming.filter(e => e.categories.some(c => c.name.toLowerCase() === 'cultura')));
      setLast(upcoming.filter(e => e.availableTickets < 100));
    } catch (err) { console.error(err); }
  };

  const fetchUpcoming = async () => {
    try {
      const res  = await fetch(`${URL_BACK}/api/events/filter/bydate`);
      if (!res.ok) throw new Error('Error fetching by date');
      const data = await res.json();
      const now  = new Date();
      setUpcoming(data.filter(e => new Date(e.date) > now));
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchEvents(); fetchUpcoming(); }, []);

  /* ---------- búsqueda ---------- */
  useEffect(() => {
    if (!searchQuery) return setFiltered(events);
    const q = searchQuery.toLowerCase();
    setFiltered(events.filter(e =>
      (e.title || '').toLowerCase().includes(q) ||
      (e.localizacion || '').toLowerCase().includes(q)
    ));
  }, [searchQuery, events]);

  const goToEvent = (e) =>
    router.push({ pathname: '/event/[id]', query: { id: e.id } });

  /* ---------- render ---------- */
  return (
    <>
      <Head><title>Home • HBC Tickets</title></Head>

      <div className="hbc-container">
        {/* Header */}
        <header className="hbc-header"><Header username={username} /></header>

        <main className="hbc-main">
          {/* === Carrusel === */}
          <div className="relative">
            <Carousel autoPlay infiniteLoop interval={4500} showThumbs={false} showStatus={false}>
              {[1,2,3].map(i => (
                <div key={i} className="select-none pointer-events-none">
                  <img src={`/assets/evento${i}.jpg`} alt={`Evento ${i}`} />
                </div>
              ))}
            </Carousel>

            <div className="carousel-overlay">
              <h1 className="carousel-title">
                La forma más segura de<br className="hidden sm:block" />comprar y vender entradas
              </h1>

              <label className="search-box">
                <FontAwesomeIcon icon={faSearch} className="text-primary text-lg" />
                <input
                  className="search-input"
                  placeholder="Buscar por ciudad o título de evento"
                  value={searchQuery}
                  onChange={e => setSearch(e.target.value)}
                />
              </label>
            </div>
          </div>

          {/* === Destacado === */}
          <h2 className="section-title">Destacado</h2>
          <div className="grid-destacado">
            {filteredEvents.slice(0, 8).map(evt => (
              <article key={evt.id} className="card" onClick={() => goToEvent(evt)}>
                <img src={`${evt.imageUrl}`} alt={evt.title} />
                <h3 className="card-title">{evt.title}</h3>
              </article>
            ))}
          </div>

          {/* === Últimas Entradas === */}
          <h2 className="section-title">Últimas Entradas Disponibles</h2>
          <div className="h-scroll">
            {lastTicketsEvents.map(evt => (
              <div key={evt.id} className="item item-pulse" onClick={() => goToEvent(evt)}>
                <img src={`${evt.imageUrl}`} alt={evt.title} />
                <p className="item-title">{evt.title}</p>
                <span className="item-info">
                  <FontAwesomeIcon icon={faClock} className="text-accent" />
                  {formatEventTime(evt.date)}
                </span>
              </div>
            ))}
          </div>

          {/* === Próximos === */}
          <h2 className="section-title">Eventos Más Próximos</h2>
          <div className="h-scroll">
            {upcomingEvents.map(evt => (
              <div key={evt.id} className="item" onClick={() => goToEvent(evt)}>
                <img src={`${evt.imageUrl}`} alt={evt.title} />
                <p className="item-title">{evt.title}</p>
                <span className="item-info">
                  <FontAwesomeIcon icon={faClock} className="text-accent" />
                  {formatEventTime(evt.date)}
                </span>
              </div>
            ))}
          </div>

          {/* === Cultura === */}
          <h2 className="section-title">Cultura</h2>
          <div className="h-scroll">
            {culturalEvents.map(evt => (
              <div key={evt.id} className="item" onClick={() => goToEvent(evt)}>
                <img src={`${evt.imageUrl}`} alt={evt.title} />
                <p className="item-title">{evt.title}</p>
                <span className="item-info">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-primary" />
                  {evt.localizacion}
                </span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="footer-space"><Footer /></div>
        </main>

        <nav className="hbc-bottom"><BottomNav role={role} /></nav>
      </div>
    </>
  );
}
