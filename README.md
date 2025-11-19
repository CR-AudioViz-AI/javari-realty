# CR Realtor Platform

**Unified realtor platform that beats Zillow + 20 social impact modules**

Built by CR AudioViz AI, LLC | CEO: Roy Henderson

---

## 🎯 Project Overview

ONE comprehensive realtor platform combining:
- **Core competitive features** (Property Search, MLS, Analytics, etc.)
- **20 social impact modules** for underserved communities
- **Granular feature toggle system** with hierarchical permissions
- **Three dashboard views**: Realtor, Client, and Admin

### Current Status
- **Foundation:** ✅ Complete (100%)
- **Database Schema:** ✅ Complete (33 tables)
- **Authentication:** ✅ Complete
- **Feature Toggle System:** ✅ Complete
- **Dashboards:** ✅ Foundation complete
- **Overall:** 🟡 Foundation Phase Complete (25%)

---

## 🚀 Quick Start

```bash
# Clone and install
git clone https://github.com/CR-AudioViz-AI/cr-realtor-platform.git
cd cr-realtor-platform
npm install

# Set up environment (.env.local is already configured)

# Import database schema to Supabase
# (Copy supabase/schema.sql into Supabase SQL Editor and execute)

# Start development
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🏗️ Tech Stack

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, Supabase PostgreSQL
- **Auth:** Supabase Auth with Row Level Security
- **Deploy:** Vercel (preview-only mode for cost control)
- **Payments:** Stripe + PayPal

---

## 🎛️ Feature Toggle System

**Hierarchical Permissions:** Platform → Broker → Office → Realtor

1. **Platform Admin (Roy)** controls all features platform-wide
2. **Broker Admins** enable/disable for their organization
3. **Office Managers** control features for their office
4. **Realtors** toggle personal preferences (disable only)

### Usage
```typescript
// Check if enabled
const enabled = await isFeatureEnabled(userId, 'property_search')

// Track usage
await trackFeatureUsage(userId, 'mortgage_calculator')

// Admin toggle
await setPlatformFeatureToggle('veterans_module', true, adminId)
```

---

## 📊 Database Schema

33 tables including:
- **Users & Orgs:** profiles, brokers, offices
- **Features:** 5 tables for hierarchical toggles + analytics
- **Properties:** listings, amenities
- **CRM:** leads, activities
- **Transactions:** deals, documents
- **Social Impact:** eligibility, programs
- **Analytics:** market data

All tables have Row Level Security policies.

---

## 🌟 20 Social Impact Modules

### High Priority (Build First)
1. Veterans - VA loans, military relocation
2. First Responders - Hero programs
3. Seniors (55+) - Downsizing assistance
4. First-Time Buyers - Affordability programs
5. Faith-Based Communities - Ministry housing

### Additional Modules
6-20: Low-Income, Military Families, Special Needs, Foster/Adoption, Nonprofit, Accessibility, Emergency Housing, Green/Sustainable, Multigenerational, Tiny Homes, Co-Housing, Rural/Homesteading, Urban Revitalization, Community Land Trusts, Cultural Communities

---

## 📋 Development Roadmap

### ✅ Complete
- GitHub repo created
- Next.js 14 initialized
- Database schema (33 tables)
- Authentication system
- Middleware with role-based access
- Feature toggle infrastructure
- Dashboard layouts (realtor, client, admin)
- Admin feature toggle UI
- API routes for feature management

### ⏭️ Next Steps
1. Login/signup pages
2. Property search functionality
3. First 5 social impact modules
4. CRM features
5. Transaction management
6. Javari AI integration
7. Remaining 15 modules
8. MLS integration
9. Mobile optimization
10. Beta testing (December 31 deadline)

---

## 🔐 Authentication & Roles

**User Roles:**
- `platform_admin` - Roy (full control)
- `broker_admin` - Broker organization admin
- `office_manager` - Office manager
- `realtor` - Licensed agent
- `client` - Buyer/seller

**Protected Routes:**
- `/dashboard/*` - Requires auth
- `/dashboard/admin/*` - Requires platform_admin

---

## 🎯 Success Criteria

- ✅ One unified codebase
- ✅ Database schema complete
- ✅ Feature toggle system working
- ✅ Three dashboard views
- ⏳ Beats competitors on features
- ⏳ 20 social impact modules
- ⏳ Javari AI integration
- ⏳ Mobile responsive
- ⏳ Sub-2s page loads
- ⏳ Beta ready (Dec 31)

---

## 📞 Contact

**CR AudioViz AI, LLC**  
CEO: Roy Henderson  
Website: craudiovizai.com  
Mission: "Your Story. Our Design"

---

**Built with Henderson Standard: Fortune 50 quality, no shortcuts.**
