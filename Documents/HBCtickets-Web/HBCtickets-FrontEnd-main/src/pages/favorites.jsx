// pages/favorites.jsx
import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar, faTicketAlt, faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import URL_BACK from '../config/urlBack'

export default function FavoritesPage() {
  const router = useRouter()
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [username, setUsername] = useState(null)
  const [role, setRole] = useState(null)

  const token = typeof window !== 'undefined' && localStorage.getItem('token')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUsername(localStorage.getItem('username'))
      setRole(localStorage.getItem('role'))
    }
    fetchFavorites()
  }, [])

  async function fetchFavorites() {
    setLoading(true)
    setError(null)
    try {
      const resIds = await fetch(`${URL_BACK}/api/events/favorites/list`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!resIds.ok) throw new Error()
      const ids = await resIds.json()
      const details = await Promise.all(
        ids.map(async (id) => {
          const res = await fetch(`${URL_BACK}/api/events/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          if (!res.ok) throw new Error()
          return res.json()
        })
      )
      setFavorites(details)
    } catch {
      setError('Error al cargar tus favoritos. Inténtalo más tarde.')
    } finally {
      setLoading(false)
    }
  }

  async function removeFavorite(id) {
    try {
      const res = await fetch(`${URL_BACK}/api/events/favorites/remove/${id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error()
      setFavorites(favorites.filter(evt => evt.id !== id))
    } catch {
      alert('No se pudo eliminar de favoritos.')
    }
  }

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'short', day: 'numeric',
      month: 'short', hour: '2-digit', minute: '2-digit'
    })

  return (
    <>
      <Head>
        <title>Mis Favoritos • HBC Tickets</title>
      </Head>
      <div className="flex flex-col min-h-screen bg-gray-100">
        {/* Header fijo */}
        <div className="fixed top-0 w-full z-20">
          <Header username={username} />
        </div>

        <main className="pt-24 pb-24 flex-grow container mx-auto px-4">
          <h1 className="text-2xl font-bold text-center mb-6 bg-blue-600 text-white py-3 rounded">
            Mis Favoritos
          </h1>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <svg
                className="animate-spin h-8 w-8 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25" cx="12" cy="12" r="10"
                  stroke="currentColor" strokeWidth="4"
                />
                <path
                  className="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
            </div>
          ) : error ? (
            <p className="text-red-600 text-center mb-6">{error}</p>
          ) : favorites.length === 0 ? (
            <p className="text-gray-600 text-center mt-10">No tienes eventos favoritos.</p>
          ) : (
            <ul className="space-y-6">
              {favorites.map((evt) => (
                <li
                  key={evt.id}
                  className="bg-white rounded-lg shadow flex overflow-hidden"
                >
                  <img
                    src={`${URL_BACK}/uploaded-images/${evt.imageUrl}`}
                    alt={evt.title}
                    className="w-32 h-32 object-cover"
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
                          <FontAwesomeIcon icon={faCalendar} className="mr-1 text-red-500" />
                          {formatDate(evt.date)}
                        </span>
                        <span className="flex items-center">
                          <FontAwesomeIcon icon={faTicketAlt} className="mr-1 text-blue-600" />
                          {evt.availableTickets} disponibles
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFavorite(evt.id)}
                      className="self-end mt-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition flex items-center"
                    >
                      <FontAwesomeIcon icon={faStarSolid} className="mr-2 text-yellow-300" />
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
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
