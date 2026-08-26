// =======================================================
// 💄 HUSNA FAROOQUI MAKEUP - OFFICIAL CONFIG
// =======================================================

export const STUDIO_CONFIG = {
  adminPin: "8760",
  whatsappNumber: "919997210876",
  instagramHandle: "husna_farooqui_makeup",
  baseLocation: "Okhla / Jamia Nagar, New Delhi",

  // 🎛️ Master Feature Toggles
  showOfferSection: true,      // Enable / Disable Top Banner Announcements
  enableDiscountsAndCoupons: true, // Enable / Disable entire Discount & Coupon System

  announcements: [
    "✨ 100% Genuine Certified Cosmetics • International Luxury & Premium Drugstore Collections ✨",
    "🎉 Limited Season Offer: Use Code BRIDE2026 for Flat 10% OFF!",
    "📍 Serving Delhi NCR (From Okhla / Jamia Nagar) & Amroha • Pre-Bookings Open",
    "👑 The Royal Bridal Package (International Luxury) now includes 1 FREE Guest Makeover!"
  ],

  // 🎈 Floating Notification Config
  floatingBanner: {
    enabled: true,
    tag: "LIMITED PROMO",
    title: "Flat 10% OFF Wedding Season Deal",
    code: "BRIDE2026",
    actionText: "Apply"
  },

  // 🏷️ Discount Coupons with Configurable Max Usage Limits
  validCoupons: {
    "BRIDE2026": { type: "percent", value: 10, label: "10% Seasonal Wedding Discount", maxUses: 1 },
    "HUSNA15": { type: "percent", value: 15, label: "15% Special Bridal Promo", maxUses: 1 },
    "ROYAL1000": { type: "flat", value: 1000, label: "₹1,000 Flat Off on Packages", maxUses: 5 },
    "WELCOME500": { type: "flat", value: 500, label: "₹500 Flat First-Booking Offer", maxUses: "unlimited" }
  },

  // 💄 Package Pricing
  pricingByKit: {
    drugstore: {
      name: "Premium Drugstore / Classic HD Kit",
      tagline: "PAC, Milani, Maybelline, Coty Airspun",
      simple_party: 1500,
      hd_party: 2500,
      super_hd_party: 4000,
      cocktail_glam: 7000,
      engagement_bride: 8000,
      royal_bridal: 15000
    },
    international: {
      name: "International Luxury Vanity Kit",
      tagline: "NARS, Charlotte Tilbury, Too Faced, Huda, Laura Mercier",
      simple_party: 2500,
      hd_party: 4000,
      super_hd_party: 6000,
      cocktail_glam: 10000,
      engagement_bride: 12000,
      royal_bridal: 25000
    }
  },

  packageDetails: {
    simple_party: { num: 1, name: "Simple Party Makeup", desc: "Clean, elegant, and subtle daytime or evening event makeup." },
    hd_party: { num: 2, name: "HD Party Makeup", desc: "High-definition finish for a flawless, camera-ready, and long-lasting look." },
    super_hd_party: { num: 3, name: "Super HD Party Makeup", desc: "Premium, ultra-smooth finish using advanced makeup techniques for a picture-perfect look." },
    cocktail_glam: { num: 4, name: "Cocktail Glam Look", desc: "Bold, glamorous, and statement-making styles, perfect for cocktail nights and receptions." },
    engagement_bride: { num: 5, name: "Engagement Bride", desc: "A stunning, radiant look tailored perfectly for your ring ceremony." },
    royal_bridal: { num: 6, name: "The Royal Bridal Package", badge: "Signature Bridal", desc: "The ultimate bridal transformation: detailed full-face makeup, custom draping, elaborate eye artistry, full hairstyling, and 1 complimentary party makeup." }
  },

  convenienceZones: {
    delhi_near: { name: "South Delhi / Nearby (Okhla, Jamia, Saket, Lajpat)", fee: 350, distance: "~5-10 km" },
    delhi_central: { name: "Central / East Delhi (CP, Mayur Vihar, Laxmi Nagar)", fee: 600, distance: "~15-20 km" },
    delhi_west: { name: "West Delhi (Janakpuri, Rajouri, Dwarka)", fee: 900, distance: "~25-35 km" },
    delhi_north: { name: "North Delhi / Rohini / Pitampura", fee: 1100, distance: "~30-40 km" },
    noida_faridabad: { name: "Noida / Greater Noida / Faridabad", fee: 750, distance: "~15-25 km" },
    gurugram: { name: "Gurugram (Cyber City, Golf Course Rd)", fee: 1200, distance: "~35-45 km" },
    amroha: { name: "Amroha City & Nearby", fee: 500, distance: "Local Base" },
    outstation_up: { name: "Moradabad / Sambhal / Outstation UP", fee: 1500, distance: "Intercity" }
  },

  internationalBrands: [
    { name: "NARS", desc: "Radiant Creamy Foundations", category: "Prestige Base" },
    { name: "Charlotte Tilbury", desc: "Flawless Filter & Airbrush Setting", category: "Glow & Polish" },
    { name: "Too Faced", desc: "Born This Way Complexion", category: "High Coverage" },
    { name: "Benefit Cosmetics", desc: "Precisely My Brow & Primers", category: "Brows & Pore Prep" },
    { name: "Urban Decay", desc: "All Nighter 16HR Setting Spray", category: "Long-Stay Seal" },
    { name: "Tarte", desc: "Shape Tape Concealers", category: "HD Eye & Face" },
    { name: "Laura Mercier", desc: "Translucent Loose Setting Powder", category: "Baking & Setting" },
    { name: "Dior / Huda", desc: "Backstage Glow Palettes", category: "Luxury Pigments" }
  ],

  drugstoreBrands: [
    { name: "Coty Airspun", desc: "Loose Face Powder", category: "Baking Powder" },
    { name: "PAC Cosmetics", desc: "HD Liquid Foundations & Lashes", category: "HD Complexion" },
    { name: "Milani", desc: "Baked Blushes & Bases", category: "Cheeks & Glow" },
    { name: "Maybelline", desc: "SuperStay 24HR Base", category: "Long-Wear Base" },
    { name: "L'Oréal", desc: "Infallible Fresh Wear", category: "Base & Setting" },
    { name: "NYX", desc: "Epic Ink Liners & Sprays", category: "Liners & Correction" },
    { name: "Embryolisse", desc: "Lait-Crème Concentré", category: "Skin Prep Base" },
    { name: "Kryolan", desc: "DermaColor Waterproof Camouflage", category: "Correction & Fix" }
  ]
};
