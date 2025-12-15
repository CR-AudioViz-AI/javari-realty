'use client'

import { useState } from 'react'
import { QrCode, Download, Copy, Check, Loader2 } from 'lucide-react'

interface QRCodeGeneratorProps {
  url: string
  title?: string
  size?: number
  className?: string
  showDownload?: boolean
  showCopy?: boolean
}

export default function QRCodeGenerator({
  url,
  title = 'Scan to view listing',
  size = 200,
  className = '',
  showDownload = true,
  showCopy = true
}: QRCodeGeneratorProps) {
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)

  // QRServer API is 100% FREE - no API key required
  // Supports PNG, SVG, EPS formats
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}&format=png&margin=10`
  const qrUrlHigh = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(url)}&format=png&margin=10`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Copy failed:', err)
    }
  }

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const response = await fetch(qrUrlHigh)
      const blob = await response.blob()
      const downloadUrl = URL.createObjectURL(blob)
      
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = `qr-code-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(downloadUrl)
    } catch (err) {
      console.error('Download failed:', err)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className={`bg-white rounded-xl border p-6 text-center ${className}`}>
      <h3 className="font-semibold mb-4 flex items-center justify-center gap-2">
        <QrCode className="text-blue-600" size={20} /> {title}
      </h3>
      
      <div className="bg-white p-4 rounded-lg inline-block shadow-sm border mb-4">
        <img
          src={qrUrl}
          alt="QR Code"
          width={size}
          height={size}
          className="mx-auto"
        />
      </div>
      
      <p className="text-sm text-gray-500 mb-4 break-all max-w-xs mx-auto">
        {url.length > 50 ? url.substring(0, 50) + '...' : url}
      </p>

      <div className="flex justify-center gap-2">
        {showCopy && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            {copied ? (
              <>
                <Check size={18} className="text-green-600" />
                <span className="text-green-600">Copied!</span>
              </>
            ) : (
              <>
                <Copy size={18} />
                <span>Copy Link</span>
              </>
            )}
          </button>
        )}
        
        {showDownload && (
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {downloading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Download size={18} />
            )}
            <span>Download QR</span>
          </button>
        )}
      </div>
      
      <p className="text-xs text-gray-400 mt-4">
        Print this QR code on flyers, yard signs, and marketing materials
      </p>
    </div>
  )
}
