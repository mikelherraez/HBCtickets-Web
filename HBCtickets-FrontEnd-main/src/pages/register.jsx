// pages/register.jsx
import React, { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import URL_BACK from '../config/urlBack'

export default function RegisterPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleRegister = async () => {
    try {
      const registerRes = await fetch(
        `${URL_BACK}/api/auth/register`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password }),
        }
      )
      if (!registerRes.ok) {
        const errorText = await registerRes.text()
        console.error('Registro fallido:', errorText)
        alert('Error al registrar: ' + errorText)
        return
      }

      const msg = await registerRes.text()
      if (msg.includes('Usuario registrado exitosamente')) {
        const loginRes = await fetch(
          `${URL_BACK}/api/auth/login`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
          }
        )
        if (!loginRes.ok) {
          const errorText = await loginRes.text()
          console.error('Login fallido:', errorText)
          alert('Error al iniciar sesión: ' + errorText)
          return
        }
        const { token } = await loginRes.json()
        if (token) {
          localStorage.setItem('token', token)
          localStorage.setItem('username', username)
          router.push('/')
        } else {
          alert('Registro OK, pero no se recibió token.')
        }
      } else {
        alert('Error en registro: ' + msg)
      }
    } catch (err) {
      console.error(err)
      alert('No se pudo completar el registro.')
    }
  }

  return (
    <>
      <Head>
        <title>Registro • HBC Tickets</title>
      </Head>
      <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center mb-6">Registro</h1>

          <input
            type="text"
            placeholder="Nombre de usuario"
            className="w-full mb-4 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full mb-4 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Contraseña"
            className="w-full mb-6 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleRegister}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded mb-4 transition"
          >
            Registrarse
          </button>

          <button
            onClick={() => router.push('/')}
            className="w-full text-center text-blue-600 hover:underline"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    </>
  )
}
