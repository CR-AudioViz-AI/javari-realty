'use client'

import { useEffect, useRef, useState } from 'react'
import { MapPin, Maximize2, Minimize2 } from 'lucide-react'

interface PropertyMapProps {
  latitude: number
  longitude: number
  address?: string
  price?: number
  className?: string
  height?: string
  showFullscreenButton?: boolean
}

export default function PropertyMap({
  latitude,
  longitude,
  address,
  price,
  className = '',
  height = '300px',
  showFullscreenButton = true
}: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    if (!mapRef.current || mapLoaded) return

    // Dynamically load Leaflet CSS
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

    // Dynamically load Leaflet JS
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.async = true
    script.onload = () => initMap()
    document.body.appendChild(script)

    return () => {
      // Cleanup
    }
  }, [latitude, longitude])

  const initMap = () => {
    if (!mapRef.current || !(window as any).L) return

    const L = (window as any).L
    
    // Clear any existing map
    mapRef.current.innerHTML = ''
    
    const map = L.map(mapRef.current).setView([latitude, longitude], 15)

    // Use OpenStreetMap tiles (FREE)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)

    // Custom marker
    const markerIcon = L.divIcon({
      html: `<div style="background: #3B82F6; width: 32px; height: 32px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
      className: 'custom-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    })

    const marker = L.marker([latitude, longitude], { icon: markerIcon }).addTo(map)

    // Popup with property info
    if (address || price) {
      const popupContent = `
        <div style="padding: 8px; min-width: 150px;">
          ${address ? `<p style="font-weight: 600; margin: 0 0 4px 0;">${address}</p>` : ''}
          ${price ? `<p style="color: #10B981; font-weight: 700; margin: 0;">$${price.toLocaleString()}</p>` : ''}
        </div>
      `
      marker.bindPopup(popupContent).openPopup()
    }

    setMapLoaded(true)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  if (!latitude || !longitude) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`} style={{ height }}>
        <div className="text-center text-gray-500">
          <MapPin className="mx-auto mb-2" size={32} />
          <p>No location data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''} ${className}`}>
      <div
        ref={mapRef}
        className="w-full rounded-lg overflow-hidden"
        style={{ height: isFullscreen ? '100vh' : height }}
      />
      
      {showFullscreenButton && (
        <button
          onClick={toggleFullscreen}
          className="absolute top-3 right-3 z-[1000] bg-white p-2 rounded-lg shadow-lg hover:bg-gray-50"
        >
          {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </button>
      )}
      
      {/* Street View Link */}
      <a
        href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${latitude},${longitude}`}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-3 right-3 z-[1000] bg-white px-3 py-2 rounded-lg shadow-lg text-sm font-medium text-blue-600 hover:bg-blue-50"
      >
        Street View →
      </a>
    </div>
  )
}
