// pages/edit-event.jsx
import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import URL_BACK from '../config/urlBack'

export default function EditEventPage() {
  const router = useRouter()
  const { eventId } = router.query
  const [eventData, setEventData] = useState(null)
  const [categories, setCategories] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [dateInput, setDateInput] = useState('')
  const [loading, setLoading] = useState(true)

  const token =
    typeof window !== 'undefined' && localStorage.getItem('token')

  // Fetch event details and categories
  useEffect(() => {
    if (!eventId) return
    setLoading(true)

    // Fetch event
    fetch(`${URL_BACK}/api/events/${eventId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then(data => {
        setEventData(data)
        // Pre-select categories
        setSelectedCategories(data.categories.map(c => c.id))
        // Set image preview to existing URL
        setImagePreview(`${URL_BACK}/uploaded-images/${data.imageUrl}`)
        // Format date to yyyy-MM-ddThh:mm
        const d = new Date(data.date)
        const tzOffset = d.getTimezoneOffset() * 60000
        const localISO = new Date(d - tzOffset).toISOString().slice(0, 16)
        setDateInput(localISO)
      })
      .catch(() => {
        alert('No se pudo cargar el evento.')
        router.back()
      })
      .finally(() => setLoading(false))

    // Fetch categories
    fetch(`${URL_BACK}/api/categories`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(() => {})
  }, [eventId])

  const toggleCategory = (id) => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!eventData) return

    const formData = new FormData()
    formData.append('title', eventData.title)
    formData.append('description', eventData.description)
    formData.append('date', new Date(dateInput).toISOString())
    formData.append('available_tickets', eventData.availableTickets)
    formData.append('price', eventData.price)
    formData.append('localizacion', eventData.localizacion)
    formData.append('event_url', eventData.eventUrl)
    selectedCategories.forEach(id => formData.append('categories', id))
    if (imageFile) {
      formData.append('image', imageFile)
    }

    try {
      const res = await fetch(`${URL_BACK}/api/events/edit/${eventId}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      })
      if (!res.ok) throw new Error()
      alert('Evento actualizado correctamente')
      router.back()
    } catch {
      alert('Error al guardar los cambios')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
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
    )
  }

  return (
    <>
      <Head>
        <title>Editar Evento • HBC Tickets</title>
      </Head>
      <div className="flex flex-col min-h-screen bg-gray-100">
        {/* Header fijo */}
        <div className="fixed top-0 w-full z-20">
          <Header />
        </div>

        <main className="pt-24 pb-24 flex-grow container mx-auto px-4">
          <div className="bg-white p-6 rounded-lg shadow max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-center">Editar Evento</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Título</label>
                <input
                  type="text"
                  value={eventData.title}
                  onChange={e =>
                    setEventData({ ...eventData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Descripción</label>
                <textarea
                  value={eventData.description}
                  onChange={e =>
                    setEventData({ ...eventData, description: e.target.value })
                  }
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Fecha y hora</label>
                <input
                  type="datetime-local"
                  value={dateInput}
                  onChange={e => setDateInput(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">Entradas disponibles</label>
                  <input
                    type="number"
                    min="1"
                    value={eventData.availableTickets}
                    onChange={e =>
                      setEventData({
                        ...eventData,
                        availableTickets: e.target.value
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Precio (€)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={eventData.price}
                    onChange={e =>
                      setEventData({ ...eventData, price: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">Localización</label>
                <input
                  type="text"
                  value={eventData.localizacion}
                  onChange={e =>
                    setEventData({ ...eventData, localizacion: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block font-medium mb-1">URL del evento</label>
                <input
                  type="url"
                  value={eventData.eventUrl}
                  onChange={e =>
                    setEventData({ ...eventData, eventUrl: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <p className="font-medium mb-2">Categorías</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategory(cat.id)}
                      className={`px-4 py-2 rounded-full border transition ${
                        selectedCategories.includes(cat.id)
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-medium mb-2">Imagen del evento</p>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded mb-2"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block"
                />
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </main>

        {/* Bottom nav fijo */}
        <div className="fixed bottom-0 w-full z-20">
          <BottomNav />
        </div>
      </div>
    </>
  )
}
