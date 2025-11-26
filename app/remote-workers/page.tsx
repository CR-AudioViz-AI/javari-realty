// app/remote-workers/page.tsx
import Link from 'next/link'

export const metadata = {
  title: 'Remote Worker Housing | CR Realtor Platform',
  description: 'Homes optimized for remote work.'
}

export default function RemoteWorkersPage() {
  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-3xl font-bold">Remote Workers Housing</h1>
      <p className="mt-4">Find the perfect home for remote work.</p>
      <Link href="/" className="text-blue-600 hover:underline mt-4 block">
        Back to Home
      </Link>
    </div>
  )
}
