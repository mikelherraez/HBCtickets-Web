// pages/coming-soon.jsx
import React, { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt, faTicketAlt, faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import URL_BACK from '../config/urlBack'

export default function ComingSoonPage() {
  const router = useRouter()
  const [events, setEvents] = useState([])
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState(null)
  const [role, setRole] = useState(null)

  const token = typeof window !== 'undefined' && localStorage.getItem('token')

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`${URL_BACK}/api/events/filter/bydate`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      const now = new Date()
      setEvents(data.filter(e => new Date(e.date) > now))
    } catch {
      alert('Error al obtener eventos')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchFavorites = useCallback(async () => {
    if (!token) return
    try {
      const res = await fetch(`${URL_BACK}/api/events/favorites/list`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error()
      setFavorites(await res.json())
    } catch {
      // ignore
    }
  }, [token])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUsername(localStorage.getItem('username'))
      setRole(localStorage.getItem('role'))
    }
    fetchEvents()
    fetchFavorites()
  }, [fetchEvents, fetchFavorites])

  const toggleFavorite = async (id) => {
    if (!token) {
      alert('Por favor, inicia sesión.')
      router.push('/login')
      return
    }
    const isFav = favorites.includes(id)
    const action = isFav ? 'remove' : 'add'
    try {
      const res = await fetch(`${URL_BACK}/api/events/favorites/${action}/${id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error()
      setFavorites(prev =>
        isFav ? prev.filter(x => x !== id) : [...prev, id]
      )
    } catch {
      alert('Error al actualizar favoritos.')
    }
  }

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('es-ES', {
      weekday: 'short', day: 'numeric',
      month: 'short', hour: '2-digit', minute: '2-digit'
    })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <svg className="animate-spin h-10 w-10 text-blue-600" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
        </svg>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Próximamente • HBC Tickets</title>
      </Head>
      <div className="flex flex-col min-h-screen bg-gray-100">
        {/* Header fija */}
        <div className="fixed top-0 w-full z-20">
          <Header username={username} />
        </div>

        <main className="pt-24 pb-24 flex-grow container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-6">Eventos Próximos</h1>

          {events.length === 0 ? (
            <p className="text-gray-600">No hay eventos próximos.</p>
          ) : (
            <ul className="space-y-6">
              {events.map(evt => {
                const isFav = favorites.includes(evt.id)
                return (
                  <li key={evt.id} className="bg-white rounded-lg shadow flex overflow-hidden">
                    <img
                      src={`${URL_BACK}/uploaded-images/${evt.imageUrl}`}
                      alt={evt.title}
                      className="w-32 h-32 object-cover cursor-pointer"
                      onClick={() => router.push(`/event/${evt.id}`)}
                    />
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <h2
                          className="text-lg font-semibold cursor-pointer hover:text-blue-600"
                          onClick={() => router.push(`/event/${evt.id}`)}
                        >
                          {evt.title}
                        </h2>
                        <p className="text-gray-600">{evt.localizacion || 'Ubicación no disponible'}</p>
                        <div className="flex items-center text-sm text-gray-600 mt-2 space-x-4">
                          <span className="flex items-center">
                            <FontAwesomeIcon icon={faCalendarAlt} className="mr-1 text-red-500" />
                            {formatDate(evt.date)}
                          </span>
                          <span className="flex items-center">
                            <FontAwesomeIcon icon={faTicketAlt} className="mr-1 text-blue-600" />
                            {evt.availableTickets} disponibles
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleFavorite(evt.id)}
                        className="self-end mt-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition flex items-center"
                      >
                        <FontAwesomeIcon icon={faStarSolid} className="mr-2 text-yellow-300" />
                        {isFav ? 'Eliminar' : 'Favorito'}
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </main>

        {/* Bottom nav fija */}
        <div className="fixed bottom-0 w-full z-20">
          <BottomNav role={role} />
        </div>
      </div>
    </>
  )
}
