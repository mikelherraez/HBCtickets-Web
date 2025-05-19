// src/components/Header.tsx
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCircle, faBars } from '@fortawesome/free-solid-svg-icons'

interface HeaderProps {
  username: string | null
}

export default function Header({ username }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="bg-blue-600 text-white fixed top-0 w-full z-30">
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <img src="/logo.png" alt="Logo" className="h-12 w-auto object-contain" />
        </Link>

        {/* Usuario y menú */}
        <div className="flex items-center space-x-4">
          {username ? (
            <Link
              href="/profile"
              className="text-lg font-medium hover:underline"
            >
              {username}
            </Link>
          ) : (
            <Link
              href="/profile"
              className="hover:text-gray-200"
              aria-label="Perfil"
            >
              <FontAwesomeIcon icon={faUserCircle} size="2x" />
            </Link>
          )}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="hover:text-gray-200 focus:outline-none"
            aria-label="Toggle menu"
          >
            <FontAwesomeIcon icon={faBars} size="2x" />
          </button>
        </div>
      </div>

      {/* Dropdown */}
      {menuOpen && (
        <nav className="bg-blue-700 border-t border-blue-500">
          <div className="container mx-auto flex justify-around py-4 px-2">
            <Link href="/recommendations" className="text-white font-semibold hover:underline">
              Cerca de ti
            </Link>
            <Link href="/coming-soon" className="text-white font-semibold hover:underline">
              Próximamente
            </Link>
            <Link href="/categories" className="text-white font-semibold hover:underline">
              Categorías
            </Link>
            <Link href="/help" className="text-white font-semibold hover:underline">
              Ayuda
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
