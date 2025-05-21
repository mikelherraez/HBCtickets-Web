// pages/categories.jsx
import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt, faTicketAlt, faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import URL_BACK from '../config/urlBack'

export default function CategoriesPage() {
  const router = useRouter()
  const [categories, setCategories] = useState([])
  const [events, setEvents] = useState([])
  const [selectedCats, setSelectedCats] = useState([])
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [noCatsMsg, setNoCatsMsg] = useState('')
  const [noEventsMsg, setNoEventsMsg] = useState('')
  const [username, setUsername] = useState(null)
  const [role, setRole] = useState(null)

  const token = typeof window !== 'undefined' && localStorage.getItem('token')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUsername(localStorage.getItem('username'))
      setRole(localStorage.getItem('role'))
    }
    fetchCategories()
    fetchEvents()
    loadFavorites()
  }, [])

  async function fetchCategories() {
    try {
      const res = await fetch(`${URL_BACK}/api/categories`)
      if (!res.ok) throw new Error()
      setCategories(await res.json())
    } catch {
      setNoCatsMsg('No se pudieron cargar las categorías.')
    }
  }

  async function fetchEvents() {
    setLoading(true)
    try {
      const res = await fetch(`${URL_BACK}/api/events/filter/bydate`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      setEvents(data)
    } catch {
      setNoEventsMsg('No se pudieron cargar los eventos.')
    } finally {
      setLoading(false)
    }
  }

  async function loadFavorites() {
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
  }

  function toggleCat(id) {
    setSelectedCats(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  function toggleFav(evtId) {
    if (!token) {
      alert('Por favor inicia sesión.')
      router.push('/login')
      return
    }
    const isFav = favorites.includes(evtId)
    const action = isFav ? 'remove' : 'add'
    fetch(`${URL_BACK}/api/events/favorites/${action}/${evtId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error()
        setFavorites(prev =>
          isFav ? prev.filter(x => x !== evtId) : [...prev, evtId]
        )
      })
      .catch(() => alert('Error al actualizar favoritos.'))
  }

  function filteredEvents() {
    if (selectedCats.length === 0) return events
    return events.filter(evt =>
      evt.categories.some(cat => selectedCats.includes(cat.id))
    )
  }

  function formatDate(d) {
    return new Date(d).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <>
      <Head>
        <title>Categorías • HBC Tickets</title>
      </Head>
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Header fijo */}
        <div className="fixed top-0 w-full z-20">
          <Header username={username} />
        </div>
        <main className="pt-24 pb-24 flex-grow container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center py-20">
              <svg
                className="animate-spin h-10 w-10 text-blue-600"
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
          ) : (
            <>
              {noCatsMsg && (
                <p className="text-red-600 text-center mb-4">{noCatsMsg}</p>
              )}
              {/* Lista de categorías */}
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => toggleCat(cat.id)}
                    className={`px-4 py-2 rounded-full border transition ${
                      selectedCats.includes(cat.id)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
              <h2 className="text-2xl font-bold mb-4">Eventos Disponibles</h2>
              {noEventsMsg && (
                <p className="text-red-600 text-center mb-4">{noEventsMsg}</p>
              )}
              {/* Lista de eventos */}
              {filteredEvents().length === 0 ? (
                <p className="text-gray-600 text-center">No hay eventos.</p>
              ) : (
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents().map(evt => {
                    const isFav = favorites.includes(evt.id)
                    return (
                      <li
                        key={evt.id}
                        className="bg-white rounded-lg shadow overflow-hidden"
                      >
                        <img
                          src={`${URL_BACK}/uploaded-images/${evt.imageUrl}`}
                          alt={evt.title}
                          className="w-full h-48 object-cover cursor-pointer"
                          onClick={() => router.push(`/event/${evt.id}`)}
                        />
                        <div className="p-4 flex flex-col justify-between h-64">
                          <div>
                            <h3
                              className="text-lg font-semibold mb-2 cursor-pointer hover:text-blue-600"
                              onClick={() => router.push(`/event/${evt.id}`)}
                            >
                              {evt.title}
                            </h3>
                            <p className="text-gray-600 mb-1">
                              {evt.localizacion}
                            </p>
                            <p className="text-gray-600 mb-3">
                              {formatDate(evt.date)}
                            </p>
                          </div>
                          <div className="flex justify-between items-center">
                            <button
                              onClick={() => toggleFav(evt.id)}
                              className="text-yellow-500 hover:text-yellow-600 transition"
                            >
                              <FontAwesomeIcon icon={faStarSolid} />
                            </button>
                            <span className="flex items-center text-gray-700">
                              <FontAwesomeIcon
                                icon={faTicketAlt}
                                className="mr-1 text-blue-600"
                              />
                              {evt.availableTickets}
                            </span>
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </>
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
