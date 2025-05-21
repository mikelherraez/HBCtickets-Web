// pages/recommendations.jsx
import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSearch,
  faCalendar,
  faTicketAlt,
  faExclamationTriangle,
  faFrown
} from '@fortawesome/free-solid-svg-icons'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import URL_BACK from '../config/urlBack'

const CITIES = ['Madrid', 'Barcelona', 'Sevilla', 'Valencia', 'Bilbao', 'Granada', 'Malaga']

export default function RecommendationsPage() {
  const router = useRouter()
  const [location, setLocation] = useState('')
  const [events, setEvents] = useState([])
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(false)
  const [showTitle, setShowTitle] = useState(false)
  const [noEventsMsg, setNoEventsMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [username, setUsername] = useState(null)
  const [role, setRole] = useState(null)
  const token = typeof window !== 'undefined' && localStorage.getItem('token')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUsername(localStorage.getItem('username'))
      setRole(localStorage.getItem('role'))
    }
    fetchFavorites()
    fetchAllEvents()
  }, [])

  async function fetchFavorites() {
    if (!token) return
    try {
      const res = await fetch(`${URL_BACK}/api/events/favorites/list`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) setFavorites(await res.json())
    } catch (err) {
      console.error(err)
    }
  }

  async function fetchAllEvents() {
    setLoading(true)
    setShowTitle(false)
    setNoEventsMsg('')
    setErrorMsg('')
    try {
      const res = await fetch(`${URL_BACK}/api/events/filter/bydate`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      setEvents(data)
    } catch {
      setErrorMsg('Hubo un error al cargar los eventos.')
    } finally {
      setLoading(false)
    }
  }

  async function fetchByLocation(loc) {
    setLoading(true)
    setShowTitle(true)
    setErrorMsg('')
    setNoEventsMsg('')
    setLocation(loc)
    try {
      const res = await fetch(`${URL_BACK}/api/events/filter?localizacion=${encodeURIComponent(loc)}`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      if (data.length === 0) setNoEventsMsg('Actualmente no hay eventos en esta ciudad.')
      setEvents(data)
    } catch {
      setNoEventsMsg('Hubo un problema al obtener los eventos.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddFav = async (id) => {
    if (!token) return
    try {
      const res = await fetch(`${URL_BACK}/api/events/favorites/add/${id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) setFavorites(old => [...old, id])
    } catch (err) {
      console.error(err)
    }
  }

  const handleRemoveFav = async (id) => {
    if (!token) return
    try {
      const res = await fetch(`${URL_BACK}/api/events/favorites/remove/${id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) setFavorites(old => old.filter(fid => fid !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const handleEventClick = (id) => {
    router.push(`/event/${id}`)
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
        <title>Recomendaciones • HBC Tickets</title>
      </Head>
      <div className="flex flex-col min-h-screen bg-gray-100">
        {/* Header fijo */}
        <div className="fixed top-0 w-full z-20">
          <Header username={username} />
        </div>

        <main className="pt-20 pb-24 flex-grow container mx-auto px-4">
          {/* Filtro ubicación */}
          <h2 className="text-lg font-semibold mb-2">Filtrar por localización</h2>
          <div className="flex items-center mb-4">
            <input
              type="text"
              placeholder="Ingresa la localización"
              className="flex-grow px-3 py-2 border border-gray-300 rounded-l focus:outline-none focus:border-blue-500"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <button
              onClick={() => fetchByLocation(location)}
              className="px-4 py-2 bg-blue-600 text-white rounded-r hover:bg-blue-700 transition"
            >
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>

          {/* Lista de ciudades */}
          <div className="flex space-x-2 overflow-x-auto mb-6">
            {CITIES.map((city) => (
              <button
                key={city}
                onClick={() => fetchByLocation(city)}
                className="flex-shrink-0 px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 transition"
              >
                {city}
              </button>
            ))}
          </div>

          {/* Título de ubicación */}
          {showTitle && !loading && !errorMsg && (
            <h3 className="text-xl font-bold mb-4">Eventos en {location}</h3>
          )}

          {/* Mensajes de error o sin eventos */}
          {!loading && errorMsg && (
            <div className="flex flex-col items-center text-red-600 mb-6">
              <FontAwesomeIcon icon={faExclamationTriangle} size="2x" />
              <p className="mt-2">{errorMsg}</p>
            </div>
          )}
          {!loading && noEventsMsg && (
            <div className="flex flex-col items-center text-gray-600 mb-6">
              <FontAwesomeIcon icon={faFrown} size="2x" />
              <p className="mt-2">{noEventsMsg}</p>
            </div>
          )}

          {/* Spinner */}
          {loading && (
            <div className="flex justify-center py-10">
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
          )}

          {/* Lista de eventos */}
          {!loading && !noEventsMsg && !errorMsg && (
            <ul className="space-y-4">
              {events.map((evt) => {
                const fav = favorites.includes(evt.id)
                return (
                  <li
                    key={evt.id}
                    className="flex items-start bg-white p-4 rounded shadow"
                  >
                    <img
                      src={`${URL_BACK}/uploaded-images/${evt.imageUrl}`}
                      alt={evt.title}
                      className="w-24 h-24 object-cover rounded mr-4"
                    />
                    <div className="flex-1">
                      <h4
                        className="font-semibold text-lg cursor-pointer hover:text-blue-600"
                        onClick={() => handleEventClick(evt.id)}
                      >
                        {evt.title}
                      </h4>
                      <p className="text-gray-600">{formatDate(evt.date)}</p>
                      <p className="text-gray-600">{evt.localizacion}</p>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <button
                        onClick={() =>
                          fav ? handleRemoveFav(evt.id) : handleAddFav(evt.id)
                        }
                        className="text-yellow-500 hover:text-yellow-600 transition"
                      >
                        <FontAwesomeIcon icon={faTicketAlt} />
                      </button>
                      <button
                        onClick={() => handleEventClick(evt.id)}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Ver detalles
                      </button>
                    </div>
                  </li>
                )
              })}
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
