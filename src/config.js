// =======================================================
// 💄 HUSNA FAROOQUI MAKEUP - OFFICIAL PACKAGES & CONFIG
// =======================================================

export const STUDIO_CONFIG = {
  whatsappNumber: "919997210876",
  instagramHandle: "husna.farooqui.makeup",

  // Base Studio Location
  baseLocation: "Okhla / Jamia Nagar, New Delhi",

  // Top Authenticity & Quality Banner
  announcement: "✨ 100% Authenticated & International Branded Luxury Products Used Across All Services ✨",

  // Exact Packages & Pricing
  packages: {
    // Party Makeup Packages
    simple_party: { 
      num: 1,
      name: "Simple Party Makeup", 
      price: 1500, 
      desc: "Clean, elegant, and subtle daytime or evening event makeup." 
    },
    hd_party: { 
      num: 2,
      name: "HD Party Makeup", 
      price: 2500, 
      desc: "High-definition finish for a flawless, camera-ready, and long-lasting look." 
    },
    super_hd_party: { 
      num: 3,
      name: "Super HD Party Makeup", 
      price: 4000, 
      desc: "Premium, ultra-smooth finish using advanced makeup techniques for a picture-perfect look." 
    },
    cocktail_glam: { 
      num: 4,
      name: "Cocktail Glam Look", 
      price: 7000, 
      desc: "Bold, glamorous, and statement-making styles, perfect for cocktail nights and receptions." 
    },

    // Signature & Bridal Packages
    engagement_bride: { 
      num: 5,
      name: "Engagement Bride", 
      price: 8000, 
      desc: "A stunning, radiant look tailored perfectly for your ring ceremony." 
    },
    royal_bridal: { 
      num: 6,
      name: "The Royal Bridal Package", 
      price: 15000, 
      badge: "Signature Bridal",
      desc: "The ultimate bridal transformation: a detailed and flawless full-face makeup look designed to perfection, featuring custom draping, elaborate eye makeup, full hair styling, and premium long-lasting products. Includes ONE complimentary party makeup for a family member or friend." 
    }
  },

  // Distance/Cab Based Convenience Charges (From Okhla / Jamia Nagar base)
  convenienceZones: {
    // Delhi Zones
    delhi_near: { name: "South Delhi / Nearby (Okhla, Jamia, Saket, Lajpat)", fee: 350, distance: "~5-10 km" },
    delhi_central: { name: "Central / East Delhi (CP, Mayur Vihar, Laxmi Nagar)", fee: 600, distance: "~15-20 km" },
    delhi_west: { name: "West Delhi (Janakpuri, Rajouri, Dwarka)", fee: 900, distance: "~25-35 km" },
    delhi_north: { name: "North Delhi / Rohini / Pitampura", fee: 1100, distance: "~30-40 km" },
    noida_faridabad: { name: "Noida / Greater Noida / Faridabad", fee: 750, distance: "~15-25 km" },
    gurugram: { name: "Gurugram (Cyber City, Golf Course Rd)", fee: 1200, distance: "~35-45 km" },
    // Amroha & Outstation
    amroha: { name: "Amroha City & Nearby", fee: 500, distance: "Local Base" },
    outstation_up: { name: "Moradabad / Sambhal / Outstation UP", fee: 1500, distance: "Intercity" }
  },

  // Updated Official Vanity Brands
  vanityBrands: [
    { name: "NARS", desc: "Radiant Creamy Base & Longwear Foundations", category: "Base & Complexion" },
    { name: "Charlotte Tilbury", desc: "Hollywood Flawless Filter & Airbrush Finish", category: "Glow & Setting" },
    { name: "Too Faced", desc: "Born This Way Complexion & Concealers", category: "Full Coverage" },
    { name: "Benefit", desc: "Precise Brow Artistry & Porefessional Primers", category: "Brows & Primers" },
    { name: "Urban Decay", desc: "All Nighter 16HR Lock Setting Sprays", category: "Long-Stay Setting" },
    { name: "Tarte", desc: "Shape Tape Concealers & Amazonian Clay", category: "High Definition" },
    { name: "Laura Mercier", desc: "Translucent Loose Setting Powder (Zero Flashback)", category: "Baking & Setting" },
    { name: "Coty Airspun", desc: "Extra Coverage Micro-spun Flawless Setting", category: "Velvet Matte Finish" }
  ]
};
