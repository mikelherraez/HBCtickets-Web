// pages/organizer-request.jsx
import React, { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFutbol,
  faMusic,
  faGraduationCap,
  faBuilding,
  faEllipsisH
} from '@fortawesome/free-solid-svg-icons'
import URL_BACK from '../config/urlBack'

const EVENT_TYPES = [
  { name: 'Deportivo', icon: faFutbol },
  { name: 'Cultural', icon: faMusic },
  { name: 'Académico', icon: faGraduationCap },
  { name: 'Corporativo', icon: faBuilding },
  { name: 'Otro', icon: faEllipsisH }
]

export default function OrganizerRequestPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [reason, setReason] = useState('')
  const [experience, setExperience] = useState('')
  const [selectedTypes, setSelectedTypes] = useState([])
  const [formError, setFormError] = useState('')
  const [success, setSuccess] = useState(false)

  const token =
    typeof window !== 'undefined' && localStorage.getItem('token')

  const toggleType = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    )
  }

  const handleSubmit = async () => {
    if (
      !username ||
      !email ||
      !reason ||
      selectedTypes.length === 0
    ) {
      setFormError('Por favor completa todos los campos.')
      return
    }
    setFormError('')

    try {
      const res = await fetch(
        `${URL_BACK}/api/auth/request-organizer`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username,
            email,
            reason,
            experience,
            eventTypes: selectedTypes
          })
        }
      )
      if (!res.ok) throw new Error()
      setSuccess(true)
      // clear form
      setUsername('')
      setEmail('')
      setReason('')
      setExperience('')
      setSelectedTypes([])
    } catch {
      setFormError('No se pudo enviar la solicitud.')
    }
  }

  if (success) {
    return (
      <>
        <Head>
          <title>Solicitud enviada • HBC Tickets</title>
        </Head>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
          <div className="bg-white p-8 rounded shadow-md text-center">
            <h1 className="text-2xl font-bold mb-4">
              ¡Solicitud enviada exitosamente!
            </h1>
            <button
              onClick={() => router.back()}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Volver
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Solicitar organizador • HBC Tickets</title>
      </Head>
      <div className="flex justify-center py-12 bg-gray-50 min-h-screen px-4">
        <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Solicitar rol de organizador
          </h1>

          {formError && (
            <p className="text-red-600 mb-4">{formError}</p>
          )}

          <label className="block mb-2 font-medium">Usuario</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full mb-4 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />

          <label className="block mb-2 font-medium">
            Correo electrónico
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />

          <label className="block mb-2 font-medium">
            Motivo de la solicitud
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows="4"
            className="w-full mb-4 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />

          <label className="block mb-2 font-medium">
            Experiencia previa (opcional)
          </label>
          <textarea
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            rows="4"
            className="w-full mb-6 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />

          <p className="font-medium mb-2">
            Tipos de evento que deseas organizar:
          </p>
          <div className="flex space-x-2 overflow-x-auto mb-6">
            {EVENT_TYPES.map((et) => (
              <button
                key={et.name}
                onClick={() => toggleType(et.name)}
                className={`flex items-center space-x-2 px-4 py-2 border rounded transition ${
                  selectedTypes.includes(et.name)
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300'
                }`}
              >
                <FontAwesomeIcon icon={et.icon} />
                <span>{et.name}</span>
              </button>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded transition mb-4"
          >
            Solicitar ser organizador
          </button>

          <button
            onClick={() => router.back()}
            className="w-full text-center text-blue-600 hover:underline"
          >
            Volver
          </button>
        </div>
      </div>
    </>
  )
}
