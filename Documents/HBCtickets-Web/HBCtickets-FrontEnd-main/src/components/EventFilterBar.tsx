// src/components/EventFilterBar.tsx
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons'

interface FilterOption {
  label: string
  icon: typeof faCalendarAlt
  color: string
  filterKey: string
}

const filters: FilterOption[] = [
  { label: 'Hoy', icon: faCalendarAlt, color: '#3498db', filterKey: 'today' },
  { label: 'Mañana', icon: faCalendarAlt, color: '#3498db', filterKey: 'tomorrow' },
  { label: 'Este fin de semana', icon: faCalendarAlt, color: '#3498db', filterKey: 'weekend' },
  { label: 'Ver todo', icon: faCalendarAlt, color: '#3498db', filterKey: 'all' },
]

interface EventFilterBarProps {
  onFilterSelect: (filterKey: string) => void
}

export default function EventFilterBar({ onFilterSelect }: EventFilterBarProps) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-4">
        {filters.map(({ label, icon, color, filterKey }) => (
          <button
            key={filterKey}
            onClick={() => onFilterSelect(filterKey)}
            className="flex items-center space-x-2 p-3 border rounded-lg hover:shadow transition"
            style={{ borderColor: color }}
          >
            <FontAwesomeIcon icon={icon} color={color} />
            <span className="text-gray-700">{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
