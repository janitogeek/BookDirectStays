# About Page Images & Logos Guide

## 🖼️ Required Images for About Page

### 1. **Team Photo (Primary)**
- **File**: `elsa-jan-profile.jpg`
- **Location**: `client/public/uploads/elsa-jan-profile.jpg`
- **Requirements**: 
  - Elsa on the LEFT, Jan on the RIGHT
  - High quality, professional headshot
  - Recommended size: 400x400px or larger
  - Both people clearly visible and smiling
  - Business casual or professional attire
  - Good lighting and background

### 2. **Individual Profile Pictures**
- **Jan's Profile**: `jan-profile.png` ✅ (Already added)
- **Elsa's Profile**: `elsa-profile.jpg` ✅ (Already added)

## 🏢 Company Logos Section (New Addition)

### **Where to Add Company Logos**
Add a new section after the team descriptions and before the Directory + Partnerships section. This will showcase your credibility and experience.

### **Recommended Layout:**
```tsx
{/* Companies I've Worked With Section */}
<section className="py-16 bg-gray-50">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">
        Trusted by Industry Leaders
      </h2>
      <p className="text-lg text-gray-600 mb-12">
        I've collaborated with 100+ property management companies, helping them optimize their direct booking strategies and maximize profitability.
      </p>
      
      {/* Company Logos Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
        <div className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <img 
            src="/uploads/company-logos/we-host-logo.png" 
            alt="We Host Logo"
            className="w-full h-16 object-contain"
          />
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <img 
            src="/uploads/company-logos/brickon-logo.png" 
            alt="Brickon Logo"
            className="w-full h-16 object-contain"
          />
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <img 
            src="/uploads/company-logos/stayc-logo.png" 
            alt="StayC Logo"
            className="w-full h-16 object-contain"
          />
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <img 
            src="/uploads/company-logos/astay-logo.png" 
            alt="Astay Logo"
            className="w-full h-16 object-contain"
          />
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <img 
            src="/uploads/company-logos/in-playa-rentals-logo.png" 
            alt="In Playa Rentals Logo"
            className="w-full h-16 object-contain"
          />
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <img 
            src="/uploads/company-logos/momentum-cabo-logo.png" 
            alt="Momentum Cabo Logo"
            className="w-full h-16 object-contain"
          />
        </div>
      </div>
    </div>
  </div>
</section>
```

## 📁 File Structure for Company Logos

```
client/public/uploads/
├── elsa-jan-profile.jpg          # Team photo (Elsa left, Jan right)
├── jan-profile.png               # Jan's individual photo ✅
├── elsa-profile.jpg              # Elsa's individual photo ✅
└── company-logos/                # New folder for company logos
    ├── we-host-logo.png
    ├── brickon-logo.png
    ├── stayc-logo.png
    ├── astay-logo.png
    ├── in-playa-rentals-logo.png
    └── momentum-cabo-logo.png
```

## 🎯 Logo Requirements

### **Technical Specifications:**
- **Format**: PNG with transparent background (preferred) or JPG
- **Size**: Minimum 200x100px, recommended 300x150px
- **Quality**: High resolution, crisp edges
- **Background**: Transparent or white background preferred
- **Style**: Professional, recognizable brand logos

### **Logo Sources:**
1. **We Host** - Get from their website or marketing materials
2. **Brickon** - Official company logo
3. **StayC** - Company branding assets
4. **Astay** - Official logo files
5. **In Playa Rentals** - Company logo
6. **Momentum Cabo** - Brand assets

## 🚀 Implementation Steps

### **Phase 1: Team Photo**
1. ✅ Add `elsa-jan-profile.jpg` to `client/public/uploads/`
2. ✅ Ensure Elsa is on the left, Jan on the right
3. ✅ Test display on About page

### **Phase 2: Company Logos**
1. Create `client/public/uploads/company-logos/` folder
2. Add all 6 company logos with proper naming
3. Implement the "Trusted by Industry Leaders" section
4. Test responsive grid layout
5. Ensure logos display correctly on all devices

### **Phase 3: Content Optimization**
1. ✅ Team descriptions updated and reordered
2. ✅ Story section optimized for LLM searches
3. ✅ "Why Book Direct" section removed (duplicate)
4. ✅ Custom partnerships text updated
5. ✅ Professional credibility established

## 🔍 SEO & LLM Optimization Features

### **Keywords Added:**
- Property Management Companies (PMCs)
- Short-term rental technology
- Property Management Systems (PMS)
- Direct booking strategies
- Workflow optimization
- Industry leaders
- We Host, Brickon, StayC, Astay, In Playa Rentals, Momentum Cabo

### **Professional Credibility:**
- 100+ PMCs experience
- Industry leader collaborations
- Technology expertise
- Global perspective
- Direct booking optimization

## 📱 Responsive Design

The new company logos section will be:
- **Mobile**: 2 columns
- **Tablet**: 3 columns  
- **Desktop**: 6 columns
- **Hover effects**: Subtle shadow increases
- **Professional appearance**: Clean white cards with logos

## 🎨 Visual Hierarchy

1. **Team Photo** - Large, prominent display
2. **Team Descriptions** - Professional credentials with arrows
3. **Company Logos** - Social proof and credibility
4. **Story Section** - Color-coded expertise areas
5. **Partnerships** - Clear value proposition
6. **Global Coverage** - Visual region breakdown

This structure creates a compelling narrative that builds trust and demonstrates your expertise in the STR industry!
