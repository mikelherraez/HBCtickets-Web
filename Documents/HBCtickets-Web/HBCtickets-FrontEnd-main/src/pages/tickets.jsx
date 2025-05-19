// pages/tickets.jsx
import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import QRCode from 'qrcode.react'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import URL_BACK from '../config/urlBack'

export default function TicketsPage() {
  const router = useRouter()
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all') // 'all' | 'ongoing' | 'past'
  const [modalTicket, setModalTicket] = useState(null)
  const [username, setUsername] = useState(null)
  const [role, setRole] = useState(null)

  const token = typeof window !== 'undefined' && localStorage.getItem('token')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUsername(localStorage.getItem('username'))
      setRole(localStorage.getItem('role'))
    }
    fetchTickets()
  }, [])

  async function fetchTickets() {
    setLoading(true)
    setError('')
    try {
      if (!token) throw new Error('No autenticado')
      const res = await fetch(`${URL_BACK}/api/tickets/view`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('No se pudo cargar los tickets.')
      const data = await res.json()
      // enrich with event details
      const withEvents = await Promise.all(
        data.map(async t => {
          const r = await fetch(`${URL_BACK}/api/events/${t.eventId}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          const ev = await r.json()
          return { ...t, event: ev }
        })
      )
      setTickets(withEvents)
    } catch (err) {
      setError(err.message || 'Error al cargar tickets.')
    } finally {
      setLoading(false)
    }
  }

  function filtered() {
    const now = new Date()
    return tickets.filter(t => {
      const d = new Date(t.event.date)
      if (filter === 'ongoing') return d >= now
      if (filter === 'past') return d < now
      return true
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <svg
          className="animate-spin h-10 w-10 text-blue-600"
          viewBox="0 0 24 24"
          fill="none"
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
        <title>Entradas Compradas • HBC Tickets</title>
      </Head>
      <div className="flex flex-col min-h-screen bg-gray-100">
        {/* Header fijo */}
        <div className="fixed top-0 w-full z-20">
          <Header username={username} />
        </div>
        <main className="pt-24 pb-24 flex-grow container mx-auto px-4">
          <h1 className="text-2xl font-bold text-center mb-6 bg-blue-600 text-white py-3 rounded">
            Entradas Compradas
          </h1>
          {error && (
            <p className="text-red-600 text-center mb-4">{error}</p>
          )}
          <div className="flex justify-center space-x-4 mb-6">
            {['all', 'ongoing', 'past'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded ${
                  filter === f
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300'
                }`}
              >
                {f === 'all'
                  ? 'Todas'
                  : f === 'ongoing'
                  ? 'En Curso'
                  : 'Finalizadas'}
              </button>
            ))}
          </div>
          {filtered().length === 0 ? (
            <p className="text-gray-600 text-center">
              No tienes entradas en esta categoría.
            </p>
          ) : (
            <ul className="space-y-6">
              {filtered().map((t, i) => {
                const ev = t.event || {}
                const d = ev.date
                  ? new Date(ev.date).toLocaleString('es-ES')
                  : 'Fecha no disponible'
                const isPast = ev.date && new Date(ev.date) < new Date()
                return (
                  <li
                    key={`${ev.id}-${i}`}
                    className={`bg-white rounded-lg shadow p-4 flex items-center space-x-4 ${
                      isPast ? 'opacity-60' : ''
                    }`}
                  >
                    <img
                      src={`${URL_BACK}/uploaded-images/${ev.imageUrl}`}
                      alt={ev.title}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold">{ev.title}</h2>
                      <p className="text-gray-600">{ev.localizacion}</p>
                      <p className="text-gray-600">{d}</p>
                    </div>
                    <button
                      onClick={() => setModalTicket(t)}
                      className="text-orange-500 hover:text-orange-600"
                    >
                      <FontAwesomeIcon icon={faStarSolid} size="2x" />
                    </button>
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
        {/* Modal QR */}
        {modalTicket && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-xl font-bold mb-4">Tu Código QR</h3>
              <QRCode value={modalTicket.code || ''} size={200} />
              <button
                onClick={() => setModalTicket(null)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
