'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface Marker {
  position: [number, number]
  popup?: string
  type?: string
}

interface PropertyMapProps {
  center: [number, number]
  markers?: Marker[]
  zoom?: number
}

// Fix Leaflet default icon issue
const createIcon = (type: string) => {
  const colors: Record<string, string> = {
    property: '#3b82f6',
    schools: '#8b5cf6',
    restaurants: '#f97316',
    shopping: '#22c55e',
    healthcare: '#ef4444',
    parks: '#10b981',
    transit: '#a855f7',
    fitness: '#ec4899',
    default: '#6b7280'
  }
  
  const color = colors[type] || colors.default
  
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background: ${color};
      width: ${type === 'property' ? '24px' : '16px'};
      height: ${type === 'property' ? '24px' : '16px'};
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [type === 'property' ? 24 : 16, type === 'property' ? 24 : 16],
    iconAnchor: [type === 'property' ? 12 : 8, type === 'property' ? 12 : 8],
  })
}

export default function PropertyMap({ center, markers = [], zoom = 14 }: PropertyMapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    // Initialize map
    mapRef.current = L.map(containerRef.current).setView(center, zoom)

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapRef.current)

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!mapRef.current) return

    // Update center
    mapRef.current.setView(center, zoom)

    // Clear existing markers
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapRef.current?.removeLayer(layer)
      }
    })

    // Add markers
    markers.forEach((marker) => {
      if (marker.position[0] && marker.position[1]) {
        const m = L.marker(marker.position, {
          icon: createIcon(marker.type || 'default')
        }).addTo(mapRef.current!)

        if (marker.popup) {
          m.bindPopup(marker.popup)
        }
      }
    })
  }, [center, markers, zoom])

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full rounded-xl"
      style={{ minHeight: '400px' }}
    />
  )
}
