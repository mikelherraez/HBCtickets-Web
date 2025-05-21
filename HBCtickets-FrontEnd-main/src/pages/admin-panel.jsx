// pages/admin-panel.jsx
import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import URL_BACK from '../config/urlBack'

export default function AdminPanelPage() {
  const router = useRouter()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [username, setUsername] = useState(null)
  const [role, setRole] = useState(null)

  const token =
    typeof window !== 'undefined' && localStorage.getItem('token')

  useEffect(() => {
    // load user info
    if (typeof window !== 'undefined') {
      setUsername(localStorage.getItem('username'))
      setRole(localStorage.getItem('role'))
    }
    fetchEvents()
  }, [])

  async function fetchEvents() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${URL_BACK}/api/events/admin/panel`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('No tienes permisos para acceder a este panel')
      setEvents(await res.json())
    } catch (err) {
      setError(err.message || 'Error al obtener eventos')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar este evento?')) return
    try {
      const res = await fetch(`${URL_BACK}/api/events/delete/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error()
      setEvents(events.filter(evt => evt.id !== id))
    } catch {
      alert('Error al eliminar el evento.')
    }
  }

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
        <title>Panel de Administración • HBC Tickets</title>
      </Head>
      <div className="flex flex-col min-h-screen bg-gray-100">
        {/* Header fijo */}
        <div className="fixed top-0 w-full z-20">
          <Header username={username} />
        </div>

        <main className="pt-24 pb-24 flex-grow container mx-auto px-4">
          <h1 className="text-2xl font-bold text-center mb-6 bg-blue-600 text-white py-3 rounded">
            Panel de Administración
          </h1>

          {error && <p className="text-red-600 text-center mb-4">{error}</p>}

          {events.length === 0 ? (
            <p className="text-gray-600 text-center">No hay eventos disponibles.</p>
          ) : (
            <ul className="space-y-6">
              {events.map(evt => (
                <li
                  key={evt.id}
                  className="bg-white rounded-lg shadow flex overflow-hidden"
                >
                  <img
                    src={`${URL_BACK}/uploaded-images/${evt.imageUrl}`}
                    alt={evt.title}
                    className="w-32 h-32 object-cover"
                  />
                  <div className="flex-1 p-4">
                    <h2 className="text-lg font-semibold mb-1">{evt.title}</h2>
                    <p className="text-gray-600 mb-3">{new Date(evt.date).toLocaleString('es-ES')}</p>
                    <div className="flex space-x-4">
                      <button
                        onClick={() =>
                          router.push({
                            pathname: '/edit-event',
                            query: { eventId: evt.id }
                          })
                        }
                        className="flex items-center px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded transition"
                      >
                        <FontAwesomeIcon icon={faEdit} className="mr-2" />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(evt.id)}
                        className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition"
                      >
                        <FontAwesomeIcon icon={faTrash} className="mr-2" />
                        Eliminar
                      </button>
                    </div>
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
