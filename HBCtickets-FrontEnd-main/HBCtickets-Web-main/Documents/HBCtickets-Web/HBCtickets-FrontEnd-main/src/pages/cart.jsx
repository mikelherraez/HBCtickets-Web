// pages/cart.jsx
import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import URL_BACK from '../config/urlBack'

export default function CartPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState([])
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState(null)
  const [role, setRole] = useState(null)

  // Carga token y usuario/rol
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const t = localStorage.getItem('token')
      const u = localStorage.getItem('username')
      const r = localStorage.getItem('role')
      if (t) setToken(t)
      if (u) setUsername(u)
      if (r) setRole(r)
    }
  }, [])

  // Fetch carrito
  useEffect(() => {
    if (!token) return
    setLoading(true)
    fetch(`${URL_BACK}/api/events/cart/view`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('No autorizado')
        return res.json()
      })
      .then(async data => {
        // Por cada item, obtenemos detalles
        const details = await Promise.all(data.map(async item => {
          const res = await fetch(`${URL_BACK}/api/events/${item.eventId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
          const event = await res.json()
          return { ...item, event }
        }))
        setCartItems(details)
      })
      .catch(err => {
        alert('Error al cargar el carrito.')
        console.error(err)
      })
      .finally(() => setLoading(false))
  }, [token])

  const removeFromCart = async (eventId) => {
    if (!confirm('¿Eliminar este evento del carrito?')) return
    try {
      const res = await fetch(`${URL_BACK}/api/events/cart/remove/${eventId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!res.ok) throw new Error()
      setCartItems(cartItems.filter(i => i.event.id !== eventId))
    } catch {
      alert('No se pudo eliminar el evento.')
    }
  }

  const updateQuantity = async (eventId, delta) => {
    const updated = cartItems.map(item => {
      if (item.event.id === eventId) {
        const newQty = Math.max(1, Math.min(item.quantity + delta, item.event.availableTickets))
        return { ...item, quantity: newQty }
      }
      return item
    })
    setCartItems(updated)
    // Sync con backend
    const item = updated.find(i => i.event.id === eventId)
    try {
      const res = await fetch(
        `${URL_BACK}/api/events/cart/update/${eventId}?quantity=${item.quantity}`,
        { method: 'PUT', headers: { 'Authorization': `Bearer ${token}` } }
      )
      if (!res.ok) throw new Error()
    } catch {
      alert('Error al actualizar la cantidad.')
    }
  }

  const calculateTotal = () =>
    cartItems.reduce((sum, i) => sum + i.event.price * i.quantity, 0).toFixed(2)

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert('El carrito está vacío.')
      return
    }
    if (!token) {
      alert('Por favor, inicia sesión.')
      router.push('/login')
      return
    }
    try {
      const res = await fetch(`${URL_BACK}/api/purchases/checkout`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      alert(`Compra realizada. Total: $${calculateTotal()}. ${data.message || ''}`)
      setCartItems([])
    } catch (err) {
      alert(err.message || 'Error al procesar la compra.')
    }
  }

  return (
    <>
      <Head>
        <title>Carrito • HBC Tickets</title>
      </Head>

      <div className="flex flex-col min-h-screen bg-white">
        {/* Header fijo */}
        <div className="fixed top-0 w-full z-20">
          <Header username={username} />
        </div>

        <main className="pt-20 pb-24 flex-grow container mx-auto px-4">
          <h1 className="text-2xl font-bold text-center bg-blue-600 text-white py-4 rounded">
            Tu Carrito
          </h1>

          {loading ? (
            <div className="flex justify-center items-center py-10">
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
          ) : cartItems.length > 0 ? (
            <ul className="space-y-4 mt-6">
              {cartItems.map(item => (
                <li
                  key={item.event.id}
                  className="flex items-center border-b pb-4"
                >
                  <img
                    src={`${URL_BACK}/uploaded-images/${item.event.imageUrl}`}
                    alt={item.event.title}
                    className="w-20 h-20 object-cover rounded mr-4"
                  />

                  <div className="flex-1">
                    <h2 className="font-semibold text-lg">{item.event.title}</h2>
                    <p className="text-gray-600">${item.event.price.toFixed(2)}</p>

                    <div className="flex items-center mt-2">
                      <button
                        onClick={() => updateQuantity(item.event.id, -1)}
                        className="px-2 py-1 bg-blue-500 text-white rounded"
                      >
                        −
                      </button>
                      <span className="mx-3">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.event.id, +1)}
                        className="px-2 py-1 bg-blue-500 text-white rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.event.id)}
                    className="ml-4 px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500 mt-10">
              Tu carrito está vacío.
            </p>
          )}

          {cartItems.length > 0 && (
            <div className="mt-8 flex flex-col items-center">
              <p className="text-xl font-bold mb-4">
                Total: <span className="text-blue-600">${calculateTotal()}</span>
              </p>
              <button
                onClick={handleCheckout}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
              >
                Terminar Compra
              </button>
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
