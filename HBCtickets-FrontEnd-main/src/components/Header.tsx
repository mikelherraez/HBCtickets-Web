import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

interface HeaderProps { username: string | null; }

export default function Header({ username }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  /* NUEVA ruta: public/assets/avatar-default.png  */
  const avatarSrc = '/assets/avatar-default.png';

  return (
    <div className="container mx-auto px-6 py-4 flex items-center justify-between relative">
      {/* Logo / Home */}
      <Link
        href="/"
        className="text-2xl font-bold text-primary hover:text-primary-dark transition"
      >
        HBC Tickets
      </Link>

      {/* Desktop nav */}
      <div className="hidden md:flex space-x-6">
        <Link href="/" className="btn-text">Inicio</Link>
        <Link href="/categories" className="btn-text">Categorías</Link>
        <Link href="/help" className="btn-text">Ayuda</Link>
      </div>

      {/* Mobile menu button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden text-gray-700 dark:text-gray-200"
      >
        <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} size="lg" />
      </button>

      {/* Mobile nav */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-800 shadow-lg flex flex-col items-center py-4 space-y-2">
          <Link href="/" className="py-2 btn-text">Inicio</Link>
          <Link href="/categories" className="py-2 btn-text">Categorías</Link>
          <Link href="/help" className="py-2 btn-text">Ayuda</Link>

          {username ? (
            <Link href="/profile" className="py-2">
              <Image
                src={avatarSrc}
                alt="Perfil"
                width={32}
                height={32}
                className="rounded-full"
                priority
              />
            </Link>
          ) : (
            <Link href="/login" className="btn btn-outline py-2">Entrar</Link>
          )}
        </div>
      )}

      {/* Desktop search + avatar */}
      <div className="hidden md:flex items-center space-x-4">
        <FontAwesomeIcon icon={faSearch} className="text-xl text-gray-500" />
        {username ? (
          <Link href="/profile">
            <Image
              src={avatarSrc}
              alt="Perfil"
              width={32}
              height={32}
              className="rounded-full"
              priority
            />
          </Link>
        ) : (
          <Link href="/login" className="btn btn-outline">Entrar</Link>
        )}
      </div>
    </div>
  );
}
