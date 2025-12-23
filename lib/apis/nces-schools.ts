// lib/apis/nces-schools.ts
// National Center for Education Statistics - FREE (no key required)
// Source: https://nces.ed.gov/ccd/elsi/

export interface School {
  ncesschoolid: string
  name: string
  address: string
  city: string
  state: string
  zip: string
  phone: string
  type: 'elementary' | 'middle' | 'high' | 'other'
  level: string
  status: string
  enrollment: number
  teachers: number
  studentTeacherRatio: number
  freeReducedLunchPercent: number
  titleI: boolean
  magnetSchool: boolean
  charterSchool: boolean
  virtualSchool: boolean
  lat: number
  lng: number
  distanceMiles?: number
  districtName: string
  districtId: string
}

export interface SchoolSearchResult {
  schools: School[]
  totalCount: number
  searchRadiusMiles: number
  nearestSchools: {
    elementary: School | null
    middle: School | null
    high: School | null
  }
  averageRatios: {
    studentTeacher: number
    freeReducedLunch: number
  }
  sourceUrl: string
}

// Florida school district codes by county
export const FLORIDA_DISTRICTS: Record<string, string> = {
  'Lee': '1200390', 'Collier': '1200210', 'Charlotte': '1200150',
  'Hendry': '1200480', 'Sarasota': '1201110', 'Manatee': '1200720',
  'Hillsborough': '1200540', 'Pinellas': '1200990', 'Pasco': '1200930',
  'Polk': '1201020', 'Orange': '1200870', 'Osceola': '1200900',
  'Miami-Dade': '1200780', 'Broward': '1200120', 'Palm Beach': '1200910',
  'Duval': '1200300', 'Alachua': '1200030', 'Volusia': '1201230'
}

// Calculate distance between two points (Haversine formula)
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959 // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Determine school type from grade span
function determineSchoolType(lowestGrade: string, highestGrade: string): School['type'] {
  const gradeToNum = (grade: string): number => {
    if (grade === 'PK' || grade === 'KG') return 0
    return parseInt(grade) || 0
  }
  
  const low = gradeToNum(lowestGrade)
  const high = gradeToNum(highestGrade)
  
  if (high <= 5) return 'elementary'
  if (low >= 6 && high <= 8) return 'middle'
  if (low >= 9) return 'high'
  if (high >= 9) return 'high'
  return 'other'
}

export async function searchSchoolsNearby(
  lat: number,
  lng: number,
  radiusMiles: number = 5,
  countyName?: string
): Promise<SchoolSearchResult> {
  try {
    // Using the NCES Edge Geocoding service for nearby schools
    // This is a fallback approach using public school data
    
    // For production, you would use the NCES API or a local database
    // Here we'll simulate with Florida-specific school data
    
    const schools: School[] = []
    
    // In production, this would query the NCES API or database
    // For now, we return structured data that can be populated
    
    // Calculate nearest schools by type
    const elementary = schools.filter(s => s.type === 'elementary').sort((a, b) => (a.distanceMiles || 999) - (b.distanceMiles || 999))[0] || null
    const middle = schools.filter(s => s.type === 'middle').sort((a, b) => (a.distanceMiles || 999) - (b.distanceMiles || 999))[0] || null
    const high = schools.filter(s => s.type === 'high').sort((a, b) => (a.distanceMiles || 999) - (b.distanceMiles || 999))[0] || null

    // Calculate averages
    const avgStudentTeacher = schools.length > 0 
      ? schools.reduce((sum, s) => sum + s.studentTeacherRatio, 0) / schools.length 
      : 0
    const avgFreeReduced = schools.length > 0 
      ? schools.reduce((sum, s) => sum + s.freeReducedLunchPercent, 0) / schools.length 
      : 0

    return {
      schools: schools.sort((a, b) => (a.distanceMiles || 999) - (b.distanceMiles || 999)),
      totalCount: schools.length,
      searchRadiusMiles: radiusMiles,
      nearestSchools: { elementary, middle, high },
      averageRatios: {
        studentTeacher: Math.round(avgStudentTeacher * 10) / 10,
        freeReducedLunch: Math.round(avgFreeReduced)
      },
      sourceUrl: 'https://nces.ed.gov/ccd/schoolsearch/'
    }
  } catch (error) {
    console.error('School search error:', error)
    return {
      schools: [],
      totalCount: 0,
      searchRadiusMiles: radiusMiles,
      nearestSchools: { elementary: null, middle: null, high: null },
      averageRatios: { studentTeacher: 0, freeReducedLunch: 0 },
      sourceUrl: 'https://nces.ed.gov/ccd/schoolsearch/'
    }
  }
}

// Alternative: Use GreatSchools API proxy (if available)
// This would require setting up a proxy to their API
export async function getSchoolRatings(schoolId: string): Promise<{ rating: number; parentRating: number } | null> {
  // GreatSchools requires API key - this is a placeholder
  // In production, you would integrate with their API
  return null
}

// Florida public school statistics by county
export const FLORIDA_SCHOOL_STATS: Record<string, { schools: number; students: number; avgRatio: number }> = {
  'Lee': { schools: 132, students: 96000, avgRatio: 15.2 },
  'Collier': { schools: 66, students: 48000, avgRatio: 14.8 },
  'Charlotte': { schools: 28, students: 18000, avgRatio: 14.5 },
  'Sarasota': { schools: 52, students: 44000, avgRatio: 15.1 },
  'Manatee': { schools: 65, students: 50000, avgRatio: 15.4 },
  'Hillsborough': { schools: 268, students: 220000, avgRatio: 16.2 },
  'Pinellas': { schools: 153, students: 96000, avgRatio: 15.0 },
  'Orange': { schools: 211, students: 210000, avgRatio: 16.5 },
  'Miami-Dade': { schools: 471, students: 345000, avgRatio: 16.8 },
  'Broward': { schools: 333, students: 260000, avgRatio: 16.3 },
  'Palm Beach': { schools: 187, students: 190000, avgRatio: 15.8 }
}

// School type icons for UI
export function getSchoolTypeIcon(type: School['type']): string {
  switch (type) {
    case 'elementary': return '🏫'
    case 'middle': return '🎓'
    case 'high': return '📚'
    default: return '🏛️'
  }
}

// Get school quality indicator based on metrics
export function getSchoolQualityIndicator(school: School): { label: string; color: string } {
  // Based on student-teacher ratio and other factors
  if (school.studentTeacherRatio <= 15 && school.freeReducedLunchPercent <= 40) {
    return { label: 'Above Average', color: 'green' }
  }
  if (school.studentTeacherRatio <= 18 && school.freeReducedLunchPercent <= 60) {
    return { label: 'Average', color: 'yellow' }
  }
  return { label: 'Below Average', color: 'orange' }
}
