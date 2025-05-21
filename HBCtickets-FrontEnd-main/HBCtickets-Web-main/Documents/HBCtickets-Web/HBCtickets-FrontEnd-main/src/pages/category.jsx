// pages/category/[id].jsx
import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons'
import Header from '../../components/Header'
import BottomNav from '../../components/BottomNav'
import URL_BACK from '../../config/urlBack'

export default function EventsByCategoryPage() {
  const router = useRouter()
  const { id, name } = router.query
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState([])
  const [noEventsMsg, setNoEventsMsg] = useState('')
  const [username, setUsername] = useState(null)
  const [role, setRole] = useState(null)

  const token = typeof window !== 'undefined' && localStorage.getItem('token')

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setNoEventsMsg('')
    // Fetch events by category
    fetch(`${URL_BACK}/api/events/filter?category=${id}`)
      .then(res => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then(data => {
        if (!data.length) setNoEventsMsg('No hay eventos disponibles para esta categoría.')
        setEvents(data)
      })
      .catch(() => {
        setNoEventsMsg('Hubo un problema al cargar los eventos.')
      })
      .finally(() => setLoading(false))

    // Fetch favorites
    if (token) {
      fetch(`${URL_BACK}/api/events/favorites/list`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.ok ? res.json() : [])
        .then(ids => setFavorites(ids))
        .catch(() => {})
    }

    // Load user info
    if (typeof window !== 'undefined') {
      setUsername(localStorage.getItem('username'))
      setRole(localStorage.getItem('role'))
    }
  }, [id])

  const toggleFavorite = (eventId) => {
    if (!token) {
      alert('Por favor, inicia sesión.')
      router.push('/login')
      return
    }
    const isFav = favorites.includes(eventId)
    const url = `${URL_BACK}/api/events/favorites/${isFav ? 'remove' : 'add'}/${eventId}`
    fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error()
        setFavorites(prev =>
          isFav ? prev.filter(i => i !== eventId) : [...prev, eventId]
        )
      })
      .catch(() => alert('No se pudo actualizar favoritos.'))
  }

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

  return (
    <>
      <Head>
        <title>Eventos – {name || 'Categoría'}</title>
      </Head>
      <div className="flex flex-col min-h-screen bg-gray-100">
        {/* Header fijo */}
        <div className="fixed top-0 w-full z-20">
          <Header username={username} />
        </div>

        <main className="pt-24 pb-24 flex-grow container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-6">
            Eventos para la categoría: {name}
          </h1>

          {loading ? (
            <div className="flex justify-center py-10">
              <svg
                className="animate-spin h-8 w-8 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12" cy="12" r="10"
                  stroke="currentColor" strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
            </div>
          ) : noEventsMsg ? (
            <p className="text-center text-gray-600">{noEventsMsg}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map(evt => {
                const isFav = favorites.includes(evt.id)
                return (
                  <div
                    key={evt.id}
                    className="bg-white rounded-lg shadow hover:shadow-md transition overflow-hidden"
                  >
                    <img
                      src={`${URL_BACK}/uploaded-images/${evt.imageUrl}`}
                      alt={evt.title}
                      className="w-full h-48 object-cover cursor-pointer"
                      onClick={() => router.push(`/event/${evt.id}`)}
                    />
                    <div className="p-4">
                      <h2
                        className="text-lg font-semibold mb-2 cursor-pointer hover:text-blue-600"
                        onClick={() => router.push(`/event/${evt.id}`)}
                      >
                        {evt.title}
                      </h2>
                      <p className="text-gray-600 mb-1">{evt.localizacion}</p>
                      <p className="text-gray-600 mb-3">{formatDate(evt.date)}</p>
                      <button
                        onClick={() => toggleFavorite(evt.id)}
                        className="flex items-center space-x-2 text-sm"
                      >
                        <FontAwesomeIcon
                          icon={faStarSolid}
                          className={isFav ? 'text-yellow-400' : 'text-gray-400'}
                        />
                        <span>{isFav ? 'Favorito' : 'Añadir favorito'}</span>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </main>

        {/* Bottom nav fijo */}
        <div className="fixed bottom-0 w-full z-20">
          <BottomNav role={role} />
        </div>
      </div>
    </>
  )
}
