// pages/profile.jsx
import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUserCircle,
  faBars,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import URL_BACK from '../config/urlBack'

export default function ProfilePage() {
  const router = useRouter()
  const [username, setUsername] = useState(null)
  const [role, setRole] = useState(null)
  const [email, setEmail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showBar, setShowBar] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passError, setPassError] = useState('')

  // Check session & fetch profile
  useEffect(() => {
    const token = typeof window !== 'undefined' && localStorage.getItem('token')
    if (!token) return router.push('/login')
    fetch(`${URL_BACK}/api/auth/profile/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then(data => {
        setUsername(data.username)
        setRole(data.role)
        setEmail(data.email)
      })
      .catch(() => {
        alert('No se pudieron cargar los datos de perfil.')
      })
      .finally(() => setLoading(false))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('role')
    router.push('/login')
  }

  const handleDelete = () => {
    if (!confirm('¿Eliminar cuenta? Esta acción no puede deshacerse.')) return
    const token = localStorage.getItem('token')
    fetch(`${URL_BACK}/api/auth/selfdelete`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error()
        alert('Cuenta eliminada.')
        handleLogout()
      })
      .catch(() => alert('Error al eliminar la cuenta.'))
  }

  const handleChangePass = () => {
    setPassError('')
    if (!currentPassword || !newPassword || !confirmPassword) {
      return setPassError('Completa todos los campos.')
    }
    if (newPassword !== confirmPassword) {
      return setPassError('Las contraseñas no coinciden.')
    }
    if (newPassword.length < 6) {
      return setPassError('Mínimo 6 caracteres.')
    }
    const token = localStorage.getItem('token')
    fetch(`${URL_BACK}/api/auth/update-password`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password: newPassword })
    })
      .then(res => {
        if (!res.ok) throw new Error()
        alert('Contraseña actualizada.')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setShowBar(false)
      })
      .catch(() => alert('Error al cambiar la contraseña.'))
  }

  return (
    <>
      <Head>
        <title>Perfil • HBC Tickets</title>
      </Head>

      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Header fijo */}
        <div className="fixed top-0 w-full z-20">
          <Header username={username} />
        </div>

        <main className="pt-20 pb-24 flex-grow container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
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
          ) : (
            <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow">
              {/* Header interno */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                  <FontAwesomeIcon
                    icon={username ? faUserCircle : faUserCircle}
                    size="2x"
                    className="text-blue-600"
                  />
                  <span className="text-xl font-semibold">
                    {username || 'Invitado'}
                  </span>
                </div>
                <button
                  onClick={() => setShowBar(!showBar)}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <FontAwesomeIcon icon={faBars} size="lg" />
                </button>
              </div>

              {/* Barra de recomendaciones */}
              {showBar && (
                <div className="mb-6 space-y-2">
                  <button
                    onClick={() => router.push('/recommendations')}
                    className="w-full text-left px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    Te recomendamos
                  </button>
                  <button
                    onClick={() => router.push('/coming-soon')}
                    className="w-full text-left px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    Próximamente
                  </button>
                  <button
                    onClick={() => router.push('/help')}
                    className="w-full text-left px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    Ayudas
                  </button>
                </div>
              )}

              {/* Detalles de perfil */}
              <p className="text-gray-700 mb-2">Correo: {email}</p>
              <p className="text-gray-700 mb-4">Rol: {role}</p>

              <button
                onClick={() => setShowBar(prev => !prev)}
                className="w-full mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                {showBar ? 'Ocultar Opciones' : 'Mostrar Opciones'}
              </button>

              {/* Cambio de contraseña */}
              {showBar && (
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Cambiar contraseña</h3>
                  {passError && (
                    <div className="flex items-center text-red-600 mb-2">
                      <FontAwesomeIcon icon={faExclamationTriangle} />
                      <span className="ml-2">{passError}</span>
                    </div>
                  )}
                  <input
                    type="password"
                    placeholder="Actual"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    className="w-full mb-2 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="password"
                    placeholder="Nueva"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full mb-2 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="password"
                    placeholder="Confirmar"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full mb-4 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={handleChangePass}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  >
                    Cambiar contraseña
                  </button>
                </div>
              )}

              {/* Acciones */}
              <div className="space-y-3">
                <button
                  onClick={handleDelete}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Eliminar Cuenta
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                >
                  Cerrar Sesión
                </button>
                <button
                  onClick={() => router.push('/organizer-request')}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  Solicitar ser organizador
                </button>
              </div>
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
