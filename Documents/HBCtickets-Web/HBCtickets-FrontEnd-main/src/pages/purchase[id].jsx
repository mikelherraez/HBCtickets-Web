// pages/purchase/[id].jsx
import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import URL_BACK from '../config/urlBack'

export default function PurchaseTicketPage() {
  const router = useRouter()
  const { id } = router.query
  const [event, setEvent] = useState(null)
  const [ticketQuantity, setTicketQuantity] = useState(1)
  const [loading, setLoading] = useState(true)

  // Fetch event details by ID
  useEffect(() => {
    if (!id) return
    fetch(`${URL_BACK}/api/events/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setEvent(data)
      })
      .catch((err) => {
        console.error('Error al cargar evento:', err)
        alert('No se pudo cargar el evento.')
        router.back()
      })
      .finally(() => setLoading(false))
  }, [id])

  const handlePurchase = () => {
    if (!event) return
    if (
      ticketQuantity <= 0 ||
      ticketQuantity > event.availableTickets
    ) {
      alert('Cantidad de entradas no válida.')
      return
    }
    alert(
      `Has comprado ${ticketQuantity} entradas para el evento: ${event.title}`
    )
    router.back()
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
        <title>Comprar Entradas • {event.title}</title>
      </Head>
      <div className="flex items-center justify-center py-12 bg-gray-50 min-h-screen px-4">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-2">{event.title}</h1>
          <p className="text-gray-600 mb-4">
            {new Date(event.date).toLocaleString('es-ES')}
          </p>
          <p className="text-gray-700 mb-6">{event.description}</p>

          <label className="block mb-2 font-medium">
            Cantidad de entradas
          </label>
          <input
            type="number"
            min="1"
            max={event.availableTickets}
            value={ticketQuantity}
            onChange={(e) =>
              setTicketQuantity(Number(e.target.value))
            }
            className="w-full mb-6 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />

          <button
            onClick={handlePurchase}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded transition"
          >
            Comprar Entradas
          </button>
        </div>
      </div>
    </>
  )
}
