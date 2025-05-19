// pages/admin-users.jsx
import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import URL_BACK from '../config/urlBack'

export default function AdminUsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState(null)
  const [role, setRole] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ username: '', email: '', role: '' })

  const token = typeof window !== 'undefined' && localStorage.getItem('token')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUsername(localStorage.getItem('username'))
      setRole(localStorage.getItem('role'))
    }
    fetchUsers()
  }, [])

  async function fetchUsers() {
    if (!token) {
      alert('No tienes permisos para ver esta página.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`${URL_BACK}/api/auth/profile/all`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('No se pudo cargar la lista de usuarios.')
      setUsers(await res.json())
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  function startEdit(user) {
    setEditingId(user.id)
    setFormData({ username: user.username, email: user.email, role: user.role })
  }

  async function submitEdit(e) {
    e.preventDefault()
    if (!token) {
      alert('No tienes permisos para editar.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`${URL_BACK}/api/auth/update/${editingId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      if (!res.ok) throw new Error('Error al actualizar el usuario.')
      alert('Usuario actualizado correctamente.')
      setEditingId(null)
      fetchUsers()
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Admin • Gestión de Usuarios</title>
      </Head>
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Header fijo */}
        <div className="fixed top-0 w-full z-20">
          <Header username={username} />
        </div>

        <main className="pt-24 pb-24 flex-grow container mx-auto px-4">
          {editingId !== null ? (
            <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4 text-center">Editar Usuario</h2>
              <form onSubmit={submitEdit} className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium">Usuario</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Rol</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Usuarios Registrados</h1>
                <button
                  onClick={() => router.push('/create-event')}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  + Agregar Evento
                </button>
              </div>
              {loading ? (
                <div className="flex justify-center py-10">
                  <svg
                    className="animate-spin h-8 w-8 text-blue-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
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
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {users.map((user) => (
                    <li
                      key={user.id}
                      className="bg-white p-4 rounded-lg shadow flex flex-col"
                    >
                      <p className="font-semibold">{user.username}</p>
                      <p className="text-gray-600">{user.email}</p>
                      <p className="text-gray-600 mb-4">Rol: {user.role}</p>
                      <button
                        onClick={() => startEdit(user)}
                        className="mt-auto px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                      >
                        Editar
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
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
