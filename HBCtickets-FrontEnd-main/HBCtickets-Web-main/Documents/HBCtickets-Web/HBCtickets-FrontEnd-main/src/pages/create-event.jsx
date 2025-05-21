import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import URL_BACK from '../config/urlBack'

export default function CreateEventPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dateInput, setDateInput] = useState('')
  const [availableTickets, setAvailableTickets] = useState('')
  const [price, setPrice] = useState('')
  const [localizacion, setLocalizacion] = useState('')
  const [eventUrl, setEventUrl] = useState('')
  const [categories, setCategories] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState(null)

  const token = typeof window !== 'undefined' && localStorage.getItem('token')

  useEffect(() => {
    // Load user info
    if (typeof window !== 'undefined') {
      setUsername(localStorage.getItem('username'))
    }
    // Fetch categories
    fetch(`${URL_BACK}/api/categories`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(() => {})
  }, [])

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
    if (!title || !dateInput || !availableTickets || !price) {
      alert('Completa título, fecha, entradas y precio.')
      return
    }
    if (!token) {
      alert('Por favor inicia sesión.')
      router.push('/login')
      return
    }
    setLoading(true)
    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('date', new Date(dateInput).toISOString())
    formData.append('available_tickets', availableTickets)
    formData.append('price', price)
    formData.append('localizacion', localizacion)
    formData.append('event_url', eventUrl)
    selectedCategories.forEach(id => formData.append('categories', id))
    if (imageFile) {
      formData.append('image', imageFile)
    }
    try {
      const res = await fetch(`${URL_BACK}/api/events/create`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      })
      const text = await res.text()
      if (!res.ok) throw new Error(text)
      alert(text)
      router.push('/')
    } catch (err) {
      alert(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Crear Evento • HBC Tickets</title>
      </Head>
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Header fijo */}
        <div className="fixed top-0 w-full z-20">
          <Header username={username} />
        </div>

        <main className="pt-24 pb-24 flex-grow container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
            <h1 className="text-3xl font-bold mb-6 text-center">Crear Evento</h1>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block mb-1 font-medium">Título</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Descripción</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Fecha y hora</label>
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
                  <label className="block mb-1 font-medium">Entradas disponibles</label>
                  <input
                    type="number"
                    min="1"
                    value={availableTickets}
                    onChange={e => setAvailableTickets(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Precio (€)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 font-medium">Localización</label>
                <input
                  type="text"
                  value={localizacion}
                  onChange={e => setLocalizacion(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">URL del evento (opcional)</label>
                <input
                  type="url"
                  value={eventUrl}
                  onChange={e => setEventUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <p className="mb-2 font-medium">Categorías</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategory(cat.id)}
                      className={`px-3 py-1 rounded-full border transition ${
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
                <p className="mb-2 font-medium">Imagen del evento</p>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-60 object-cover rounded mb-2"
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
                  disabled={loading}
                  className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50"
                >
                  {loading ? 'Creando...' : 'Crear Evento'}
                </button>
              </div>
            </form>
          </div>
        </main>

        {/* Bottom nav fijo */}
        <div className="fixed bottom-0 w-full z-20">
          <BottomNav username={username} />
        </div>
      </div>
    </>
  )
}
