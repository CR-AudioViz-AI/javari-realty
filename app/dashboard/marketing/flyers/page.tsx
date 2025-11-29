'use client'

import { Suspense } from 'react'
import FlyerContent from './FlyerContent'
import { Loader2 } from 'lucide-react'

export default function FlyerGeneratorPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    }>
      <FlyerContent />
    </Suspense>
  )
}
