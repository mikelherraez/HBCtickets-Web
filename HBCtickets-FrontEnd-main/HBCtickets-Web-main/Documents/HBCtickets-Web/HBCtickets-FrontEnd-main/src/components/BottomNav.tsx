// src/components/BottomNav.tsx
import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlusCircle,
  faHome,
  faTachometerAlt,
  faCalendarAlt,
  faStar as faStarSolid,
  faShoppingCart,
  faUser
} from '@fortawesome/free-solid-svg-icons'

interface BottomNavProps {
  role: string | null
}

export default function BottomNav({ role }: BottomNavProps) {
  const router = useRouter()
  const isActive = (path: string): boolean => router.pathname === path

  const items = []
  if (role === 'OWNER' || role === 'ADMINISTRADOR') {
    items.push(
      { href: '/create-event', icon: faPlusCircle,  label: 'AGREGAR' },
      { href: '/',            icon: faHome,        label: 'INICIO'  },
      { href: '/admin-panel', icon: faTachometerAlt,label: 'ADMIN'   }
    )
  } else if (role === 'ORGANIZADOR') {
    items.push(
      { href: '/create-event', icon: faPlusCircle,  label: 'CREAR'       },
      { href: '/',            icon: faHome,        label: 'INICIO'      },
      { href: '/my-events',   icon: faCalendarAlt, label: 'MIS EVENTOS' },
      { href: '/admin-panel', icon: faTachometerAlt,label: 'ADMIN'       }
    )
  } else {
    items.push(
      { href: '/tickets',   icon: faCalendarAlt,  label: 'EVENTOS'  },
      { href: '/favorites', icon: faStarSolid,    label: 'FAVORITOS'},
      { href: '/',          icon: faHome,         label: 'INICIO'   },
      { href: '/cart',      icon: faShoppingCart, label: 'CARRITO'  },
      { href: '/profile',   icon: faUser,         label: 'PERFIL'   }
    )
  }

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-blue-600 border-t border-blue-700 flex">
      {items.map(({ href, icon, label }) => (
        <Link
          key={label}
          href={href}
          className={`
            flex-1 py-2 flex flex-col items-center justify-center text-white text-xs
            ${isActive(href)
              ? 'opacity-100'
              : 'opacity-75 hover:opacity-100 transition'}
          `}
          aria-label={label}
        >
          <FontAwesomeIcon icon={icon} size="lg" />
          <span className="mt-1">{label}</span>
        </Link>
      ))}
    </nav>
  )
}
