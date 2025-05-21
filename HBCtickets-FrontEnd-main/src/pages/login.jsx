// pages/login.jsx
import React, { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import URL_BACK from '../config/urlBack'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    try {
      const res = await fetch(`${URL_BACK}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      const data = await res.json()
      if (data.token) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('username', username)
        localStorage.setItem('role', data.role)
        router.push('/')
      } else {
        alert(data.message || 'Credenciales incorrectas')
      }
    } catch (err) {
      console.error(err)
      alert('Credenciales incorrectas')
    }
  }

  return (
    <>
      <Head>
        <title>Login • HBC Tickets</title>
      </Head>
      <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow">
          <h1 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h1>

          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full mb-4 px-3 py-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-6 px-3 py-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
          />

          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded mb-4 transition"
          >
            Login
          </button>

          <p
            className="text-center text-blue-600 hover:underline cursor-pointer mb-2"
            onClick={() => router.push('/register')}
          >
            ¿No tienes cuenta? Regístrate
          </p>
          <p
            className="text-center text-blue-600 hover:underline cursor-pointer"
            onClick={() => router.push('/')}
          >
            Volver al Inicio
          </p>
        </div>
      </div>
    </>
  )
}
