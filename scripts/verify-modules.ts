#!/usr/bin/env node
// scripts/verify-all-modules.ts
// Automated verification of all 20 social impact modules

const modules = [
  { path: '/veterans', name: 'Veterans' },
  { path: '/first-responders', name: 'First Responders' },
  { path: '/seniors', name: 'Seniors 55+' },
  { path: '/first-time-buyers', name: 'First-Time Buyers' },
  { path: '/faith-based', name: 'Faith-Based' },
  { path: '/disabilities', name: 'Disabilities & Accessibility' },
  { path: '/healthcare-workers', name: 'Healthcare Workers' },
  { path: '/teachers', name: 'Teachers & Educators' },
  { path: '/low-income', name: 'Low-Income Housing' },
  { path: '/single-parents', name: 'Single Parents' },
  { path: '/military-families', name: 'Military Families' },
  { path: '/lgbtq', name: 'LGBTQ+ Friendly' },
  { path: '/artists', name: 'Artists & Creatives' },
  { path: '/refugees', name: 'Refugees & Immigrants' },
  { path: '/remote-workers', name: 'Remote Workers' },
  { path: '/foster-families', name: 'Foster/Adoptive Families' },
  { path: '/survivors', name: 'Domestic Violence Survivors' },
  { path: '/eco-living', name: 'Green/Eco Living' },
  { path: '/tiny-homes', name: 'Tiny Home Communities' },
  { path: '/co-living', name: 'Co-Housing & Co-Living' }
]

const BASE_URL = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}` 
  : 'http://localhost:3000'

async function checkModule(path: string, name: string) {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'HEAD',
      headers: { 'User-Agent': 'CR-Verifier/1.0' }
    })
    
    if (response.ok) {
      console.log(`✅ ${name.padEnd(35)} - OK (${response.status})`)
      return { success: true, module: name, status: response.status }
    } else {
      console.log(`❌ ${name.padEnd(35)} - FAILED (${response.status})`)
      return { success: false, module: name, status: response.status }
    }
  } catch (err) {
    const error = err as Error
    console.log(`❌ ${name.padEnd(35)} - ERROR (${error.message})`)
    return { success: false, module: name, error: error.message }
  }
}

async function verifyAll() {
  console.log('🔍 CR REALTOR PLATFORM - MODULE VERIFICATION')
  console.log('='.repeat(70))
  console.log(`Base URL: ${BASE_URL}`)
  console.log(`Testing ${modules.length} modules...`)
  console.log('')

  const results = []
  
  for (const module of modules) {
    const result = await checkModule(module.path, module.name)
    results.push(result)
    // Small delay to avoid overwhelming server
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  console.log('')
  console.log('='.repeat(70))
  console.log('SUMMARY:')
  console.log('='.repeat(70))
  
  const successful = results.filter(r => r.success).length
  const failed = results.filter(r => !r.success).length
  const percentage = Math.round((successful / modules.length) * 100)

  console.log(`✅ Successful: ${successful}/${modules.length}`)
  console.log(`❌ Failed: ${failed}/${modules.length}`)
  console.log(`📊 Success Rate: ${percentage}%`)
  console.log('')

  if (failed > 0) {
    console.log('FAILED MODULES:')
    results.filter(r => !r.success).forEach(r => {
      console.log(`  • ${r.module} (${r.status || r.error})`)
    })
    console.log('')
  }

  if (percentage === 100) {
    console.log('🎊 ALL MODULES WORKING PERFECTLY!')
    console.log('✅ Platform is READY FOR PRODUCTION')
  } else if (percentage >= 90) {
    console.log('⚠️  MOSTLY WORKING - Minor issues to fix')
  } else if (percentage >= 70) {
    console.log('⚠️  NEEDS ATTENTION - Several broken modules')
  } else {
    console.log('❌ CRITICAL ISSUES - Major debugging needed')
  }

  console.log('='.repeat(70))

  // Exit with error code if any failures
  process.exit(failed > 0 ? 1 : 0)
}

// Run verification
verifyAll().catch(error => {
  console.error('Fatal error during verification:', error)
  process.exit(1)
})
