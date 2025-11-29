'use client'

import { Suspense } from 'react'
import SocialContent from './SocialContent'
import { Loader2 } from 'lucide-react'

export default function SocialMediaPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    }>
      <SocialContent />
    </Suspense>
  )
}
