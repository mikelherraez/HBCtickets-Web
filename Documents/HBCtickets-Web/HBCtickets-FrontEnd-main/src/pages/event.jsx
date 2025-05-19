// pages/event/[id].jsx
import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCalendarAlt,
  faMapMarkerAlt,
  faTicketAlt,
  faEuroSign,
  faStar as faStarSolid,
  faShareAlt
} from '@fortawesome/free-solid-svg-icons'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import BottomNav from '../../components/BottomNav'
import URL_BACK from '../../config/urlBack'

export default function EventDetailsPage() {
  const router = useRouter()
  const { id } = router.query
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [username, setUsername] = useState(null)
  const [role, setRole] = useState(null)

  const token =
    typeof window !== 'undefined' && localStorage.getItem('token')

  // Load event data
  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetch(`${URL_BACK}/api/events/${id}`)
      .then(res => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then(data => setEvent(data))
      .catch(() => {
        alert('No se pudo cargar el evento.')
        router.back()
      })
      .finally(() => setLoading(false))
  }, [id])

  // Check favorite status
  useEffect(() => {
    if (!token || !id) return
    fetch(`${URL_BACK}/api/events/favorites/list`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => (res.ok ? res.json() : []))
      .then(ids => setIsFavorite(ids.includes(Number(id))))
      .catch(() => {})
  }, [id, token])

  // Load user info
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUsername(localStorage.getItem('username'))
      setRole(localStorage.getItem('role'))
    }
  }, [])

  const toggleFavorite = () => {
    if (!token) {
      alert('Por favor inicia sesión.')
      router.push('/login')
      return
    }
    const action = isFavorite ? 'remove' : 'add'
    fetch(
      `${URL_BACK}/api/events/favorites/${action}/${id}`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      }
    )
      .then(res => {
        if (!res.ok) throw new Error()
        setIsFavorite(!isFavorite)
      })
      .catch(() => alert('Error al actualizar favoritos.'))
  }

  const handleAddToCart = () => {
    if (!token) {
      alert('Por favor inicia sesión.')
      router.push('/login')
      return
    }
    fetch(
      `${URL_BACK}/api/events/cart/add/${id}/1`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )
      .then(res => {
        if (res.status === 401) {
          alert('Sesión expirada.')
          router.push('/login')
        } else if (!res.ok) {
          return res.text().then(txt => { throw new Error(txt) })
        } else {
          router.push('/cart')
        }
      })
      .catch(err => alert(`Error al añadir al carrito: ${err.message}`))
  }

  const handleShare = () => {
    const shareData = {
      title: event.title,
      text: `Entra a este evento: ${event.title}`,
      url: window.location.href
    }
    if (navigator.share) {
      navigator.share(shareData).catch(() => {
        alert('Error al compartir.')
      })
    } else {
      alert('Tu navegador no soporta compartir.')
    }
  }

  const openMap = () => {
    const query = encodeURIComponent(event.localizacion)
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`
    window.open(url, '_blank')
  }

  if (loading || !event) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <svg
          className="animate-spin h-10 w-10 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{event.title} • HBC Tickets</title>
      </Head>

      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Header fijo */}
        <div className="fixed top-0 w-full z-20">
          <Header username={username} />
        </div>

        <main className="pt-24 pb-24 flex-grow container mx-auto px-4">
          {/* Imagen */}
          <img
            src={`${URL_BACK}/uploaded-images/${event.imageUrl}`}
            alt={event.title}
            className="w-full h-64 object-cover rounded-md mb-6"
          />

          {/* Título */}
          <h1 className="text-3xl font-bold mb-4">{event.title}</h1>

          {/* Fecha y ubicación */}
          <div className="flex flex-col md:flex-row md:space-x-8 mb-6">
            <div className="flex items-center mb-3 md:mb-0">
              <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-600 mr-2" />
              <span>{new Date(event.date).toLocaleString('es-ES')}</span>
            </div>
            <div className="flex items-center">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-600 mr-2" />
              <button
                onClick={openMap}
                className="text-blue-600 hover:underline focus:outline-none"
              >
                {event.localizacion}
              </button>
            </div>
          </div>

          {/* Tickets y precio */}
          <div className="flex space-x-6 mb-6">
            <button
              onClick={handleAddToCart}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
            >
              <FontAwesomeIcon icon={faTicketAlt} className="mr-2" />
              {event.availableTickets}
            </button>
            <button
              onClick={handleAddToCart}
              className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
            >
              <FontAwesomeIcon icon={faEuroSign} className="mr-2" />
              {event.price}€
            </button>
          </div>

          {/* Categorías */}
          <div className="flex flex-wrap gap-2 mb-6">
            {event.categories.map((cat) => (
              <span
                key={cat.id}
                className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm"
              >
                {cat.name}
              </span>
            ))}
          </div>

          {/* Botones acción */}
          <div className="flex items-center space-x-4 mb-8">
            <button
              onClick={toggleFavorite}
              className="focus:outline-none"
            >
              <FontAwesomeIcon
                icon={faStarSolid}
                className={isFavorite ? 'text-yellow-400' : 'text-gray-400'}
                size="lg"
              />
            </button>
            <button
              onClick={handleAddToCart}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
            >
              Comprar Entrada
            </button>
            <button
              onClick={handleShare}
              className="focus:outline-none text-blue-600 hover:text-blue-800 transition"
            >
              <FontAwesomeIcon icon={faShareAlt} size="lg" />
            </button>
          </div>

          {/* Información */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3">Información</h2>
            <div className="mb-6">
              <h3 className="font-medium mb-1">Descripción</h3>
              <p className="text-gray-700">{event.description}</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Localización</h3>
              <p className="text-gray-700">{event.localizacion}</p>
            </div>
          </section>

          <Footer />
        </main>

        {/* BottomNav fijo */}
        <div className="fixed bottom-0 w-full z-20">
          <BottomNav role={role} />
        </div>
      </div>
    </>
  )
}
