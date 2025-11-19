import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">CR Realtor Platform</h1>
            <p className="text-sm text-muted-foreground">Your Complete Real Estate Solution</p>
          </div>
          <div className="space-x-4">
            <Link 
              href="/dashboard/realtor" 
              className="px-4 py-2 text-sm font-medium text-primary hover:underline"
            >
              Realtor Login
            </Link>
            <Link 
              href="/dashboard/admin" 
              className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Admin Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-5xl font-bold mb-6 text-gray-900">
            The All-in-One Realtor Platform
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Everything you need to serve your clients better. Property search, MLS integration, 
            market analytics, plus 20 specialized programs for veterans, first responders, seniors, and more.
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/properties" 
              className="px-8 py-4 bg-primary text-primary-foreground rounded-lg text-lg font-semibold hover:bg-primary/90 transition"
            >
              Search Properties
            </Link>
            <Link 
              href="/dashboard/realtor" 
              className="px-8 py-4 bg-white text-primary border-2 border-primary rounded-lg text-lg font-semibold hover:bg-blue-50 transition"
            >
              For Realtors
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Comprehensive Features</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-6 border rounded-lg hover:shadow-lg transition">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Impact Modules */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-4">20 Social Impact Modules</h3>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Specialized programs serving underserved communities with dedicated support and resources
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {socialImpactModules.map((module, index) => (
              <div key={index} className="p-4 bg-white rounded-lg border hover:border-primary transition">
                <div className="text-2xl mb-2">{module.icon}</div>
                <h5 className="font-semibold text-sm">{module.title}</h5>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-bold text-lg mb-4">CR Realtor Platform</h4>
              <p className="text-gray-400 text-sm">
                Your complete real estate solution with advanced features and social impact.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/properties" className="hover:text-white">Search Properties</Link></li>
                <li><Link href="/dashboard/realtor" className="hover:text-white">Realtor Dashboard</Link></li>
                <li><Link href="/modules" className="hover:text-white">Social Impact Programs</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Contact</h4>
              <p className="text-gray-400 text-sm">
                Built by CR AudioViz AI<br />
                © 2025 All rights reserved
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

const features = [
  {
    icon: "🔍",
    title: "Advanced Property Search",
    description: "Search millions of properties with powerful filters and real-time data"
  },
  {
    icon: "📊",
    title: "Market Analytics",
    description: "Comprehensive market trends, comparables, and investment insights"
  },
  {
    icon: "🏦",
    title: "MLS Integration",
    description: "Real-time access to Multiple Listing Service data nationwide"
  },
  {
    icon: "💰",
    title: "Mortgage Calculator",
    description: "Advanced calculators for affordability, payments, and scenarios"
  },
  {
    icon: "🤝",
    title: "Agent Matching",
    description: "Connect clients with ideal realtors based on specialty and location"
  },
  {
    icon: "🏠",
    title: "Virtual Tours",
    description: "Immersive 3D property tours and video walkthroughs"
  },
  {
    icon: "📝",
    title: "Document Management",
    description: "Secure storage and e-signatures for all transaction documents"
  },
  {
    icon: "📈",
    title: "CRM for Realtors",
    description: "Complete client relationship management and lead tracking"
  },
  {
    icon: "⚡",
    title: "Transaction Coordination",
    description: "Streamlined workflow for offers, inspections, and closings"
  }
]

const socialImpactModules = [
  { icon: "🎖️", title: "Veterans" },
  { icon: "🚒", title: "First Responders" },
  { icon: "👴", title: "Seniors (55+)" },
  { icon: "🏡", title: "First-Time Buyers" },
  { icon: "⛪", title: "Faith-Based" },
  { icon: "💙", title: "Low-Income Housing" },
  { icon: "✈️", title: "Military Families" },
  { icon: "♿", title: "Special Needs" },
  { icon: "👨‍👩‍👧", title: "Foster/Adoption" },
  { icon: "🏢", title: "Nonprofits" },
  { icon: "🦽", title: "Accessibility" },
  { icon: "🆘", title: "Emergency Housing" },
  { icon: "🌱", title: "Green/Sustainable" },
  { icon: "👪", title: "Multigenerational" },
  { icon: "🏘️", title: "Tiny Homes" },
  { icon: "🤲", title: "Co-Housing" },
  { icon: "🌾", title: "Rural/Homesteading" },
  { icon: "🏙️", title: "Urban Revitalization" },
  { icon: "🤝", title: "Community Land Trusts" },
  { icon: "🌍", title: "Cultural Communities" }
]
