// pages/help.jsx
import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'

export default function HelpPage() {
  const router = useRouter()
  const [username, setUsername] = useState(null)
  const [role, setRole] = useState(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUsername(localStorage.getItem('username'))
      setRole(localStorage.getItem('role'))
    }
  }, [])

  const contactSupport = () => {
    window.location.href = 'mailto:support.tickets@hbcavonni.com'
  }

  const visitWebsite = () => {
    window.open('https://www.tusitio.com', '_blank')
  }

  return (
    <>
      <Head>
        <title>Ayuda • HBC Tickets</title>
      </Head>

      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Header fijo */}
        <div className="fixed top-0 w-full z-20">
          <Header username={username} />
        </div>

        <main className="pt-20 pb-24 flex-grow container mx-auto px-4 overflow-y-auto">
          {/* Título */}
          <h1 className="text-3xl font-bold mb-6 text-center">Centro de Ayuda</h1>

          {/* Sección FAQ */}
          <section className="mb-8 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Preguntas Frecuentes</h2>
            <div className="space-y-3">
              <div>
                <p className="font-medium">1. ¿Cómo crear una cuenta?</p>
                <p>Ve a la pantalla de registro, ingresa tus datos y presiona “Registrarse”.</p>
              </div>
              <div>
                <p className="font-medium">2. ¿Cómo comprar entradas?</p>
                <p>Selecciona el evento, haz clic en “Comprar Entradas” y sigue los pasos de pago.</p>
              </div>
              <div>
                <p className="font-medium">3. ¿Puedo cancelar o modificar mi compra?</p>
                <p>No es posible cancelarla o modificarla. Contacta soporte para más detalles.</p>
              </div>
              <div>
                <p className="font-medium">4. ¿Cómo ver los eventos cercanos a mí?</p>
                <p>Activa la opción de ubicación en la pantalla de inicio para ver eventos cercanos.</p>
              </div>
            </div>
          </section>

          {/* Sección Guías */}
          <section className="mb-8 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Guías</h2>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={visitWebsite}
                  className="flex items-center text-blue-600 hover:underline"
                >
                  Guía de uso completo <FontAwesomeIcon icon={faExternalLinkAlt} className="ml-2" />
                </button>
              </li>
              <li>
                <button
                  onClick={visitWebsite}
                  className="flex items-center text-blue-600 hover:underline"
                >
                  Preguntas frecuentes detalladas <FontAwesomeIcon icon={faExternalLinkAlt} className="ml-2" />
                </button>
              </li>
            </ul>
          </section>

          {/* Sección Soporte */}
          <section className="mb-8 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Soporte</h2>
            <p className="mb-4">Si tienes algún problema o pregunta, contáctanos:</p>
            <button
              onClick={contactSupport}
              className="flex items-center justify-center w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition"
            >
              <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
              Contactar con Soporte
            </button>
          </section>

          {/* Sección Términos */}
          <section className="mb-8 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Términos y Condiciones</h2>
            <button
              onClick={visitWebsite}
              className="flex items-center text-blue-600 hover:underline"
            >
              Lee nuestros Términos y Condiciones <FontAwesomeIcon icon={faExternalLinkAlt} className="ml-2" />
            </button>
          </section>
        </main>

        {/* Bottom nav fijo */}
        <div className="fixed bottom-0 w-full z-20">
          <BottomNav role={role} />
        </div>
      </div>
    </>
  )
}
