import React, { useState, useEffect, useRef, Component } from 'react';
import { 
  Sparkles, Calendar as CalendarIcon, MapPin, Check, Calculator, Crown, ChevronRight, 
  ShieldCheck, Star, Car, CheckCircle2, PackageCheck, Tag, Gift, X, 
  Volume2, Sun, Moon, Send, Percent, Camera, Award, Heart, Download, Image as ImageIcon,
  Play, Film, ExternalLink, User, Flame, ArrowRight, Eye, Info, Activity, Clock, AlertCircle,
  Receipt, FileText, Hash, Wrench, ShieldAlert, Users, Plus, Trash2, MessageSquare, Share2, QrCode, Copy, CheckCheck, RefreshCw,
  Home, Building2, Navigation, Compass, Zap, Droplet
} from 'lucide-react';
import { STUDIO_CONFIG } from './config';
import { subscribeToLiveConfig, db } from './firebase';
import { collection, addDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';

class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Critical Runtime Crash Caught by Safe Boundary:", error, errorInfo);
    try {
      addDoc(collection(db, "crash_logs"), {
        error: error.toString(),
        stack: errorInfo.componentStack || '',
        timestamp: serverTimestamp()
      });
    } catch (e) {}
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-white/80 backdrop-blur-3xl border border-slate-200 p-8 rounded-[32px] space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-[20px] bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto border border-amber-500/20">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-semibold">System Safe Mode Active</h2>
            <p className="text-xs opacity-75 leading-relaxed">
              We encountered a minor display update glitch. Our automated system has protected your session.
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="w-full py-2.5 rounded-[16px] bg-blue-600 text-white font-medium text-xs transition active:scale-[0.98]"
            >
              Refresh to Safe Version
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const DEFAULT_PROFILE_IMG = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80";
const DEFAULT_STUDIO_LOGO = "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&auto=format&fit=crop&q=80";

const DEFAULT_BRANDS = [
  { category: "Base & Foundation", name: "Dior / Charlotte Tilbury / NARS", desc: "For flawless, long-lasting luxury base." },
  { category: "Eyes & Pigments", name: "Huda Beauty / Anastasia Beverly Hills", desc: "Highly pigmented luxury palettes." },
  { category: "Setting & Finish", name: "Urban Decay / MAC Cosmetics", desc: "16-HR waterproof makeup locking." },
  { category: "Skin Prep", name: "Estée Lauder / Smashbox", desc: "Premium hydration and primer layer." }
];

const DEFAULT_KIT_IMAGES = {
  international: {
    simple_party: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
    hd_party: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&auto=format&fit=crop&q=80",
    super_hd_party: "https://images.unsplash.com/photo-1503236823255-94609f598e71?w=800&auto=format&fit=crop&q=80",
    cocktail_glam: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80",
    engagement_bride: "https://images.unsplash.com/photo-1594465919760-441fe5908ab0?w=800&auto=format&fit=crop&q=80",
    royal_bridal: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop&q=80"
  },
  drugstore: {
    simple_party: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&auto=format&fit=crop&q=80",
    hd_party: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop&q=80",
    super_hd_party: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&auto=format&fit=crop&q=80",
    cocktail_glam: "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=800&auto=format&fit=crop&q=80",
    engagement_bride: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&auto=format&fit=crop&q=80",
    royal_bridal: "https://images.unsplash.com/photo-1617083934555-563d41f021e0?w=800&auto=format&fit=crop&q=80"
  }
};

const DEFAULT_KIT_TEXT = {
  international: {
    simple_party: { num: 1, name: "Simple Party Makeup (Luxury)", desc: "Natural dewy skin glow with Dior & NARS, soft contour & luxury hair styling.", skinFinish: "16-Hour Water Resistant HD Glass", includes: "Full Makeup + Hair Styling + Draping" },
    hd_party: { num: 2, name: "HD Party Makeup (Luxury)", desc: "High-definition camera ready base with Charlotte Tilbury & Huda, designer hair styling.", skinFinish: "16-Hour Water Resistant HD Glass", includes: "Full Makeup + Hair Styling + Draping" },
    super_hd_party: { num: 3, name: "Super HD Glam Party (Luxury)", desc: "Flawless poreless glass skin, 3D luxury lashes, statement eye look & hair artistry.", skinFinish: "16-Hour Water Resistant HD Glass", includes: "Full Makeup + Hair Styling + Draping" },
    cocktail_glam: { num: 4, name: "Cocktail / Reception Glam (Luxury)", desc: "Red-carpet celebrity glam, smokey or shimmer eye art, luxury extensions & styling.", skinFinish: "16-Hour Water Resistant HD Glass", includes: "Full Makeup + Hair Styling + Draping" },
    engagement_bride: { num: 5, name: "Engagement / Sagan Bride (Luxury)", desc: "Radiant luxury bridal base, sculpted features, premium lash drama, draping & hair styling.", skinFinish: "16-Hour Water Resistant HD Glass", includes: "Full Makeup + Hair Styling + Draping" },
    royal_bridal: { num: 6, name: "Royal Asian Bridal (Luxury)", desc: "Signature bridal artistry, 16HR waterproof HD finish with Estee Lauder & MAC, master draping & styling.", skinFinish: "16-Hour Water Resistant HD Glass", includes: "Full Makeup + Hair Styling + Draping" }
  },
  drugstore: {
    simple_party: { num: 1, name: "Simple Party Makeup (HD Classic)", desc: "Clean everyday fresh look, light foundation base & classic hair styling.", skinFinish: "16-Hour Water Resistant HD Glass", includes: "Full Makeup + Hair Styling + Draping" },
    hd_party: { num: 2, name: "HD Party Makeup (HD Classic)", desc: "High-definition camera ready base with PAC/Milani, customized eye look & hair styling.", skinFinish: "16-Hour Water Resistant HD Glass", includes: "Full Makeup + Hair Styling + Draping" },
    super_hd_party: { num: 3, name: "Super HD Glam Party (HD Classic)", desc: "Long-wear HD base, dramatic eye shimmer, 3D lashes & elegant hair styling.", skinFinish: "16-Hour Water Resistant HD Glass", includes: "Full Makeup + Hair Styling + Draping" },
    cocktail_glam: { num: 4, name: "Cocktail / Reception Glam (HD Classic)", desc: "Even toned radiant glam, bold lip contour, full party hair styling.", skinFinish: "16-Hour Water Resistant HD Glass", includes: "Full Makeup + Hair Styling + Draping" },
    engagement_bride: { num: 5, name: "Engagement / Sagan Bride (HD Classic)", desc: "HD bridal glow, durable base, customized lash placement, dupatta draping.", skinFinish: "16-Hour Water Resistant HD Glass", includes: "Full Makeup + Hair Styling + Draping" },
    royal_bridal: { num: 6, name: "Royal Asian Bridal (HD Classic)", desc: "Complete Asian bridal makeover, smudge-proof HD base, jewelry setting & bridal draping.", skinFinish: "16-Hour Water Resistant HD Glass", includes: "Full Makeup + Hair Styling + Draping" }
  }
};

const DEFAULT_GALLERY = [
  { type: "image", title: "Royal Asian Bridal", sub: "Prestige HD Artistry", url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop&q=80" },
  { type: "video", title: "Dewy Glow Finishing", sub: "16HR Stay Artistry", url: "https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-woman-applying-makeup-41419-large.mp4" },
  { type: "image", title: "Engagement Glow", sub: "Dewy Glass Finish", url: "https://images.unsplash.com/photo-1594465919760-441fe5908ab0?w=800&auto=format&fit=crop&q=80" },
  { type: "video", title: "Cocktail Reception Glam", sub: "Smokey Eyes & Bold Lips", url: "https://assets.mixkit.co/videos/preview/mixkit-woman-putting-on-makeup-41418-large.mp4" }
];

const FONT_OPTIONS = [
  { id: 'plus_jakarta_sans', name: 'Plus Jakarta Sans' },
  { id: 'outfit', name: 'Outfit' },
  { id: 'inter', name: 'Inter' },
  { id: 'poppins', name: 'Poppins' },
  { id: 'montserrat', name: 'Montserrat' },
  { id: 'roboto', name: 'Roboto' },
  { id: 'open_sans', name: 'Open Sans' },
  { id: 'lato', name: 'Lato' },
  { id: 'nunito', name: 'Nunito' },
  { id: 'raleway', name: 'Raleway' },
  { id: 'work_sans', name: 'Work Sans' },
  { id: 'dm_sans', name: 'DM Sans' },
  { id: 'manrope', name: 'Manrope' },
  { id: 'rubik', name: 'Rubik' },
  { id: 'mulish', name: 'Mulish' },
  { id: 'quicksand', name: 'Quicksand' },
  { id: 'urbanist', name: 'Urbanist' },
  { id: 'space_grotesk', name: 'Space Grotesk' },
  { id: 'sora', name: 'Sora' },
  { id: 'bebas_neue', name: 'Bebas Neue' },
  { id: 'oswald', name: 'Oswald' },
  { id: 'barlow', name: 'Barlow' },
  { id: 'barlow_condensed', name: 'Barlow Condensed' },
  { id: 'archivo', name: 'Archivo' },
  { id: 'archivo_narrow', name: 'Archivo Narrow' },
  { id: 'merriweather', name: 'Merriweather' },
  { id: 'playfair_display', name: 'Playfair Display' },
  { id: 'cormorant_garamond', name: 'Cormorant Garamond' },
  { id: 'cinzel', name: 'Cinzel' },
  { id: 'libre_baskerville', name: 'Libre Baskerville' },
  { id: 'bodoni_moda', name: 'Bodoni Moda' },
  { id: 'dm_serif_display', name: 'DM Serif Display' },
  { id: 'abril_fatface', name: 'Abril Fatface' },
  { id: 'prata', name: 'Prata' },
  { id: 'lora', name: 'Lora' },
  { id: 'cardo', name: 'Cardo' },
  { id: 'spectral', name: 'Spectral' },
  { id: 'eb_garamond', name: 'EB Garamond' },
  { id: 'cormorant_infant', name: 'Cormorant Infant' },
  { id: 'josefin_sans', name: 'Josefin Sans' },
  { id: 'josefin_slab', name: 'Josefin Slab' },
  { id: 'karla', name: 'Karla' },
  { id: 'cabin', name: 'Cabin' },
  { id: 'dosis', name: 'Dosis' },
  { id: 'exo_2', name: 'Exo 2' },
  { id: 'figtree', name: 'Figtree' },
  { id: 'lexend', name: 'Lexend' },
  { id: 'league_spartan', name: 'League Spartan' },
  { id: 'kanit', name: 'Kanit' },
  { id: 'teko', name: 'Teko' },
  { id: 'marcellus', name: 'Marcellus' },
  { id: 'yeseva_one', name: 'Yeseva One' },
  { id: 'great_vibes', name: 'Great Vibes' },
  { id: 'dancing_script', name: 'Dancing Script' },
  { id: 'pacifico', name: 'Pacifico' },
  { id: 'caveat', name: 'Caveat' },
  { id: 'comfortaa', name: 'Comfortaa' },
  { id: 'maven_pro', name: 'Maven Pro' },
  { id: 'alata', name: 'Alata' },
  { id: 'asap', name: 'Asap' },
  { id: 'heebo', name: 'Heebo' },
  { id: 'titillium_web', name: 'Titillium Web' },
];

const FONT_MAP = {
  plus_jakarta_sans: "'Plus Jakarta Sans', sans-serif",
  outfit: "'Outfit', sans-serif",
  inter: "'Inter', sans-serif",
  poppins: "'Poppins', sans-serif",
  montserrat: "'Montserrat', sans-serif",
  roboto: "'Roboto', sans-serif",
  open_sans: "'Open Sans', sans-serif",
  lato: "'Lato', sans-serif",
  nunito: "'Nunito', sans-serif",
  raleway: "'Raleway', sans-serif",
  work_sans: "'Work Sans', sans-serif",
  dm_sans: "'DM Sans', sans-serif",
  manrope: "'Manrope', sans-serif",
  rubik: "'Rubik', sans-serif",
  mulish: "'Mulish', sans-serif",
  quicksand: "'Quicksand', sans-serif",
  urbanist: "'Urbanist', sans-serif",
  space_grotesk: "'Space Grotesk', sans-serif",
  sora: "'Sora', sans-serif",
  bebas_neue: "'Bebas Neue', sans-serif",
  oswald: "'Oswald', sans-serif",
  barlow: "'Barlow', sans-serif",
  barlow_condensed: "'Barlow Condensed', sans-serif",
  archivo: "'Archivo', sans-serif",
  archivo_narrow: "'Archivo Narrow', sans-serif",
  merriweather: "'Merriweather', sans-serif",
  playfair_display: "'Playfair Display', sans-serif",
  cormorant_garamond: "'Cormorant Garamond', sans-serif",
  cinzel: "'Cinzel', sans-serif",
  libre_baskerville: "'Libre Baskerville', sans-serif",
  bodoni_moda: "'Bodoni Moda', sans-serif",
  dm_serif_display: "'DM Serif Display', sans-serif",
  abril_fatface: "'Abril Fatface', sans-serif",
  prata: "'Prata', sans-serif",
  lora: "'Lora', sans-serif",
  cardo: "'Cardo', sans-serif",
  spectral: "'Spectral', sans-serif",
  eb_garamond: "'EB Garamond', sans-serif",
  cormorant_infant: "'Cormorant Infant', sans-serif",
  josefin_sans: "'Josefin Sans', sans-serif",
  josefin_slab: "'Josefin Slab', sans-serif",
  karla: "'Karla', sans-serif",
  cabin: "'Cabin', sans-serif",
  dosis: "'Dosis', sans-serif",
  exo_2: "'Exo 2', sans-serif",
  figtree: "'Figtree', sans-serif",
  lexend: "'Lexend', sans-serif",
  league_spartan: "'League Spartan', sans-serif",
  kanit: "'Kanit', sans-serif",
  teko: "'Teko', sans-serif",
  marcellus: "'Marcellus', sans-serif",
  yeseva_one: "'Yeseva One', sans-serif",
  great_vibes: "'Great Vibes', sans-serif",
  dancing_script: "'Dancing Script', sans-serif",
  pacifico: "'Pacifico', sans-serif",
  caveat: "'Caveat', sans-serif",
  comfortaa: "'Comfortaa', sans-serif",
  maven_pro: "'Maven Pro', sans-serif",
  alata: "'Alata', sans-serif",
  asap: "'Asap', sans-serif",
  heebo: "'Heebo', sans-serif",
  titillium_web: "'Titillium Web', sans-serif",
  sans: "'Plus Jakarta Sans', sans-serif"
};

// EXACT ADMIN-CLONE THEME ENGINE WITH IPHONE LIQUID GLASS & LUMINESCENT BORDERS
const THEME_STYLES = {
  admin_aurora: {
    bg: "bg-[#090a0f] text-[#F2F2F7]",
    card: "bg-gradient-to-br from-purple-950/40 via-purple-900/20 to-slate-950/60 backdrop-blur-[32px] border border-purple-400/50 shadow-[0_16px_50px_rgba(168,85,247,0.25)] rounded-[32px]",
    accent: "text-purple-400",
    btn: "bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white font-bold shadow-[0_10px_25px_rgba(236,72,153,0.35)] rounded-[20px]",
    glowOrb: "from-purple-600/35 via-pink-600/20 to-transparent"
  },
  sunset_glow: {
    bg: "bg-[#0c0a09] text-[#F2F2F7]",
    card: "bg-gradient-to-br from-amber-950/40 via-rose-950/25 to-slate-950/60 backdrop-blur-[32px] border border-amber-400/50 shadow-[0_16px_50px_rgba(245,158,11,0.25)] rounded-[32px]",
    accent: "text-amber-400",
    btn: "bg-gradient-to-r from-amber-500 to-rose-600 text-white font-bold shadow-[0_10px_25px_rgba(244,63,94,0.35)] rounded-[20px]",
    glowOrb: "from-amber-600/35 via-rose-600/20 to-transparent"
  },
  cyber_matrix: {
    bg: "bg-[#030a0a] text-[#F2F2F7]",
    card: "bg-gradient-to-br from-cyan-950/40 via-emerald-950/25 to-slate-950/60 backdrop-blur-[32px] border border-cyan-400/50 shadow-[0_16px_50px_rgba(6,182,212,0.25)] rounded-[32px]",
    accent: "text-cyan-400",
    btn: "bg-gradient-to-r from-emerald-500 to-cyan-600 text-neutral-950 font-bold shadow-[0_10px_25px_rgba(6,182,212,0.35)] rounded-[20px]",
    glowOrb: "from-emerald-600/35 via-cyan-600/20 to-transparent"
  },
  real_glass_lens: {
    bg: "bg-[#090a0f] text-[#F2F2F7]",
    card: "bg-gradient-to-br from-blue-950/40 via-indigo-950/25 to-slate-950/60 backdrop-blur-[32px] border border-blue-400/50 shadow-[0_16px_50px_rgba(0,122,255,0.25)] rounded-[32px]",
    accent: "text-blue-400",
    btn: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-[0_10px_25px_rgba(0,122,255,0.3)] rounded-[20px]",
    glowOrb: "from-blue-600/35 via-indigo-600/20 to-transparent"
  },
  real_ios_glass: {
    bg: "bg-[#090a0f] text-[#F2F2F7]",
    card: "bg-[#18181b]/70 backdrop-blur-[32px] border border-white/30 shadow-[0_20px_60px_rgba(0,0,0,0.5)] rounded-[36px]",
    accent: "text-sky-400",
    btn: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg rounded-[22px]",
    glowOrb: "from-indigo-600/35 via-blue-600/20 to-transparent"
  },
  liquid_glass: {
    bg: "bg-[#060b14] text-[#F2F2F7]",
    card: "bg-[#0f172a]/70 backdrop-blur-[32px] border border-cyan-400/50 shadow-[0_20px_60px_rgba(6,182,212,0.2)] rounded-[32px]",
    accent: "text-cyan-400",
    btn: "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md rounded-[20px]",
    glowOrb: "from-cyan-600/35 via-blue-600/20 to-transparent"
  },
  one_ui_9: {
    bg: "bg-[#0c0c0e] text-[#F2F2F7]",
    card: "bg-[#18181b]/85 backdrop-blur-[32px] border border-zinc-600 shadow-xl rounded-[30px]",
    accent: "text-violet-400",
    btn: "bg-violet-600 hover:bg-violet-700 text-white shadow-md rounded-[20px]",
    glowOrb: "from-violet-600/35 via-purple-600/20 to-transparent"
  },
  gold_rose: {
    bg: "bg-[#0f090a] text-[#F2F2F7]",
    card: "bg-[#1a1113]/85 backdrop-blur-[32px] border border-amber-400/50 shadow-xl rounded-[32px]",
    accent: "text-amber-400",
    btn: "bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-md rounded-[20px]",
    glowOrb: "from-amber-600/35 via-rose-600/20 to-transparent"
  },
  champagne: {
    bg: "bg-[#100b07] text-[#F2F2F7]",
    card: "bg-[#1c140d]/85 backdrop-blur-[32px] border border-orange-400/50 shadow-xl rounded-[32px]",
    accent: "text-amber-400",
    btn: "bg-gradient-to-r from-amber-600 to-orange-500 text-white shadow-md rounded-[20px]",
    glowOrb: "from-amber-600/35 via-orange-600/20 to-transparent"
  },
  emerald: {
    bg: "bg-[#060f0c] text-[#F2F2F7]",
    card: "bg-[#0f1c18]/85 backdrop-blur-[32px] border border-emerald-400/50 shadow-xl rounded-[32px]",
    accent: "text-emerald-400",
    btn: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md rounded-[20px]",
    glowOrb: "from-emerald-600/35 via-teal-600/20 to-transparent"
  },
  violet: {
    bg: "bg-[#0a0612] text-[#F2F2F7]",
    card: "bg-[#161024]/85 backdrop-blur-[32px] border border-purple-400/50 shadow-xl rounded-[32px]",
    accent: "text-purple-400",
    btn: "bg-purple-600 hover:bg-purple-700 text-white shadow-md rounded-[20px]",
    glowOrb: "from-purple-600/35 via-indigo-600/20 to-transparent"
  },
  ruby: {
    bg: "bg-[#120608] text-[#F2F2F7]",
    card: "bg-[#200f12]/85 backdrop-blur-[32px] border border-rose-400/50 shadow-xl rounded-[32px]",
    accent: "text-rose-400",
    btn: "bg-rose-600 hover:bg-rose-700 text-white shadow-md rounded-[20px]",
    glowOrb: "from-rose-600/35 via-pink-600/20 to-transparent"
  },
  sapphire: {
    bg: "bg-[#060812] text-[#F2F2F7]",
    card: "bg-[#0f1424]/85 backdrop-blur-[32px] border border-blue-400/50 shadow-xl rounded-[32px]",
    accent: "text-blue-400",
    btn: "bg-blue-600 hover:bg-blue-700 text-white shadow-md rounded-[20px]",
    glowOrb: "from-blue-600/35 via-indigo-600/20 to-transparent"
  },
  default: {
    bg: "bg-[#090a0f] text-[#F2F2F7]",
    card: "bg-[#18181b]/75 backdrop-blur-[32px] border border-white/25 shadow-xl rounded-[32px]",
    accent: "text-sky-400",
    btn: "bg-blue-600 hover:bg-blue-700 text-white shadow-md rounded-[20px]",
    glowOrb: "from-blue-600/30 to-transparent"
  }
};

Object.entries(THEME_STYLES).forEach(([, theme]) => { if (!theme.accentText) theme.accentText = theme.accent; });

// DAY MODE TRUE LIQUID GLASS WITH CRISP SEPARATING BORDERS
const DAY_MODE_OVERRIDES = {
  bg: "bg-slate-100 text-slate-900",
  card: "bg-white/85 backdrop-blur-[32px] border border-slate-300 shadow-[0_20px_50px_rgba(15,23,42,0.12)] rounded-[32px]",
  glowOrb: "from-blue-500/25 via-indigo-500/15 to-transparent"
};

const ALL_INDIA_STATES_AND_CITIES = {
  "Delhi": ["New Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi", "Central Delhi", "Old Delhi", "Chandni Chowk", "Civil Lines", "Model Town", "Kamla Nagar", "Mukherjee Nagar", "GTB Nagar", "Shalimar Bagh", "Ashok Vihar", "Pitampura", "Rohini", "Prashant Vihar", "Kohat Enclave", "Keshav Puram", "Wazirpur", "Punjabi Bagh", "Rajouri Garden", "Tilak Nagar", "Janakpuri", "Vikaspuri", "Uttam Nagar", "Dwarka", "Palam", "Mahavir Enclave", "Vasant Kunj", "Vasant Vihar", "R K Puram", "Munirka", "Hauz Khas", "Green Park", "Saket", "Malviya Nagar", "Mehrauli", "Chhatarpur", "Greater Kailash", "GK-I", "GK-II", "Kalkaji", "Nehru Place", "Govindpuri", "Tughlakabad", "Okhla", "Okhla Phase I", "Okhla Phase II", "Okhla Phase III", "Jamia Nagar", "Abul Fazal Enclave", "Batla House", "Shaheen Bagh", "Jasola", "Sarita Vihar", "Madanpur Khadar", "Lajpat Nagar", "Amar Colony", "Greater Kailash", "Defence Colony", "Jangpura", "Lodi Colony", "South Extension", "Srinivaspuri", "East of Kailash", "Mayur Vihar", "Preet Vihar", "Laxmi Nagar", "Shahdara", "Patparganj", "Vivek Vihar", "Anand Vihar", "IP Extension", "Dilshad Garden", "Seelampur", "Karawal Nagar", "Burari", "Narela", "Bawana", "Najafgarh", "Dhaula Kuan", "Chanakyapuri", "Karol Bagh", "Paharganj", "Rajinder Nagar", "Patel Nagar", "Kirti Nagar", "Moti Nagar", "Naraina", "Connaught Place", "Barakhamba", "India Gate", "Pragati Maidan"],
  "Uttar Pradesh": ["Noida", "Greater Noida", "Amroha", "Ghaziabad", "Lucknow", "Kanpur", "Agra", "Varanasi", "Meerut", "Moradabad", "Bareilly", "Aligarh", "Mathura", "Sambhal"],
  "Haryana": ["Gurugram (Gurgaon)", "Faridabad", "Panipat", "Ambala", "Karnal", "Rohtak", "Hisar", "Sonipat"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur", "Kolhapur"],
  "Karnataka": ["Bengaluru (Bangalore)", "Mysuru (Mysore)", "Hubballi", "Mangaluru", "Belagavi"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer", "Bikaner", "Alwar"],
  "Punjab": ["Chandigarh", "Amritsar", "Ludhiana", "Jalandhar", "Patiala", "Bathinda"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar", "Bhavnagar"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Vellore"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Khammam"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain"],
  "Bihar": ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur", "Purnia"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Puri"],
  "Other State / UT": ["Other Major City"]
};

const getTimeRemaining = (expiryDateStr) => {
  if (!expiryDateStr) return null;
  const total = Date.parse(expiryDateStr) - Date.now();
  if (total <= 0) return { expired: true, text: "Expired" };

  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return {
    expired: false,
    text: `${days > 0 ? `${days}d ` : ''}${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`
  };
};

const isVideoMedia = (item) => {
  if (item?.type === 'video') return true;
  if (typeof item?.url === 'string') {
    const u = item.url.toLowerCase();
    return u.startsWith('data:video') || u.endsWith('.mp4') || u.endsWith('.webm') || u.endsWith('.mov') || u.endsWith('.mkv') || u.includes('video/');
  }
  return false;
};

const getCleanInstagramUrl = (handleOrUrl) => {
  if (!handleOrUrl) return "https://www.instagram.com/husna_farooqui_makeup/";
  let clean = String(handleOrUrl).trim();
  if (clean.startsWith('http://') || clean.startsWith('https://')) return clean;
  clean = clean.replace(/^@+/, '').replace(/^\/+|\/+$/g, '');
  return `https://www.instagram.com/${clean}/`;
};

const resolveProfileImageUrl = (configData) => {
  if (configData?.profilePhotoType === 'instagram') {
    const handle = (configData.instagramHandle || '').replace('@', '').trim();
    if (handle) {
      return `https://wsrv.nl/?url=https://unavatar.io/instagram/${handle}&w=300&h=300&fit=cover&default=${encodeURIComponent(DEFAULT_PROFILE_IMG)}`;
    }
  }
  if (configData?.profileImage && configData.profileImage.trim().length > 0) {
    return configData.profileImage;
  }
  return DEFAULT_PROFILE_IMG;
};

const AutoPlayVideoCard = ({ item }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => {});
        }
      });
    }
  }, [item.url]);

  return (
    <div className="h-72 sm:h-84 overflow-hidden relative bg-neutral-950 flex items-center justify-center group rounded-[32px] shadow-md transition-all duration-300 hover:scale-[1.01]">
      <video
        ref={videoRef}
        src={item.url}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out pointer-events-none"
      />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/95 via-black/40 to-transparent flex flex-col justify-end p-5 text-white">
        <span className="text-[11px] uppercase font-mono font-black text-cyan-300 tracking-wider drop-shadow-lg">{item.sub || 'Client Transformation'}</span>
        <h4 className="font-black text-sm sm:text-base mt-0.5 flex items-center gap-1.5 text-pink-300 drop-shadow-md">
          <Film className="w-4 h-4 text-pink-400 shrink-0 animate-pulse" />
          <span>{item.title}</span>
        </h4>
      </div>
    </div>
  );
};

const MEDIA_COLLECTION = 'studio_media';
const resolveMediaValue = (value, mediaMap) => typeof value === 'string' && value.startsWith('media://') ? (mediaMap[value.slice(8)] || value) : value;
const resolveConfigMedia = (live, mediaMap) => {
  const next = JSON.parse(JSON.stringify(live || {}));
  next.studioLogo = resolveMediaValue(next.studioLogo, mediaMap);
  next.profileImage = resolveMediaValue(next.profileImage, mediaMap);
  Object.entries(next.kitImages || {}).forEach(([kit, imgs]) => Object.entries(imgs || {}).forEach(([pkg, url]) => { next.kitImages[kit][pkg] = resolveMediaValue(url, mediaMap); }));
  (next.galleryPhotos || []).forEach(item => { if (item?.url) item.url = resolveMediaValue(item.url, mediaMap); });
  return next;
};

function MainAppContent() {
  const [config, setConfig] = useState(STUDIO_CONFIG);
  const [activeTab, setActiveTab] = useState('menu');
  const [selectedKit, setSelectedKit] = useState('international');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('hf_theme_preference');
      return saved === null ? true : saved === 'dark';
    } catch {
      return true;
    }
  });
  const [showFloatingBanner, setShowFloatingBanner] = useState(true);

  const [showSplash, setShowSplash] = useState(true);
  const [splashFade, setSplashFade] = useState(false);
  const [viewingPackage, setViewingPackage] = useState(null);
  const [nowTick, setNowTick] = useState(Date.now());

  const [calcPackage, setCalcPackage] = useState('royal_bridal');
  const [calcKit, setCalcKit] = useState('international');
  const [calcZone, setCalcZone] = useState('delhi_near');

  const [familyGuests, setFamilyGuests] = useState([]);

  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [eventDate, setEventDate] = useState('');

  const [addressType, setAddressType] = useState('Home');
  const [flatHouseNo, setFlatHouseNo] = useState('');
  const [streetLocality, setStreetLocality] = useState('');
  const [landmark, setLandmark] = useState('');
  const [selectedState, setSelectedState] = useState('Delhi');
  const [city, setCity] = useState('New Delhi');
  const [state, setState] = useState('Delhi');
  const [pincode, setPincode] = useState('');

  const [currentBookingNumber, setCurrentBookingNumber] = useState('');

  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isBookingDone, setIsBookingDone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imgLoadFailed, setImgLoadFailed] = useState(false);
  const [logoLoadFailed, setLogoLoadFailed] = useState(false);
  
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackPhone, setFeedbackPhone] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const canvasRef = useRef(null);
  const [generatedJpgUrl, setGeneratedJpgUrl] = useState(null);
  const [mediaAssets, setMediaAssets] = useState({});
  const [telegramStatus, setTelegramStatus] = useState('');

  // Day & Night Toggle Synchronization
  useEffect(() => {
    try {
      localStorage.setItem('hf_theme_preference', isDarkMode ? 'dark' : 'light');
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
      }
    } catch {}
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  useEffect(() => {
    const locked = Boolean(viewingPackage || showShareModal);
    document.body.style.overflow = locked ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [viewingPackage, showShareModal]);

  useEffect(() => {
    const handlePopState = (e) => {
      if (viewingPackage) {
        e.preventDefault();
        setViewingPackage(null);
        window.history.pushState(null, '', window.location.href);
      } else if (showShareModal) {
        e.preventDefault();
        setShowShareModal(false);
        window.history.pushState(null, '', window.location.href);
      } else if (activeTab !== 'menu') {
        e.preventDefault();
        setActiveTab('menu');
        window.history.pushState(null, '', window.location.href);
      }
    };

    window.history.pushState({ tab: activeTab }, '', window.location.href);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [activeTab, viewingPackage, showShareModal]);

  useEffect(() => {
    const timer = setInterval(() => setNowTick(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function logVisitorTraffic() {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const igRef = urlParams.get('ig') || urlParams.get('ref') || urlParams.get('utm_source') || 'Direct Visit';
        await addDoc(collection(db, "visitor_logs"), {
          instagramIdOrSource: igRef,
          userAgent: navigator.userAgent || 'Unknown Device',
          referrer: document.referrer || 'Direct / Browser',
          language: navigator.language || 'en',
          visitedAt: serverTimestamp()
        });
      } catch (err) {}
    }
    logVisitorTraffic();
  }, []);

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setSplashFade(true);
      setTimeout(() => setShowSplash(false), 600);
    }, 2000);
    return () => clearTimeout(splashTimer);
  }, []);

  useEffect(() => {
    let latestLive = STUDIO_CONFIG;
    let latestMedia = {};
    const applyLive = () => {
      const live = resolveConfigMedia(latestLive, latestMedia);
      const mergedKitImages = {
        international: { ...DEFAULT_KIT_IMAGES.international, ...(live.kitImages?.international || {}) },
        drugstore: { ...DEFAULT_KIT_IMAGES.drugstore, ...(live.kitImages?.drugstore || {}) }
      };
      const applyDefaults = (liveObj, defObj) => {
        const result = {};
        for (const k in defObj) result[k] = { ...defObj[k], ...(liveObj?.[k] || {}) };
        for (const k in (liveObj || {})) if (!result[k]) result[k] = liveObj[k];
        return result;
      };
      const mergedKitText = {
        international: applyDefaults(live.kitText?.international, DEFAULT_KIT_TEXT.international),
        drugstore: applyDefaults(live.kitText?.drugstore, DEFAULT_KIT_TEXT.drugstore)
      };
      setConfig({
        ...STUDIO_CONFIG, ...live,
        studioLogo: live.studioLogo || DEFAULT_STUDIO_LOGO,
        telegramBotToken: live.telegramBotToken || STUDIO_CONFIG.telegramBotToken || '',
        telegramChatId: live.telegramChatId || STUDIO_CONFIG.telegramChatId || '',
        kitText: mergedKitText, kitImages: mergedKitImages,
        internationalBrands: (live.internationalBrands?.length ? live.internationalBrands : DEFAULT_BRANDS),
        galleryPhotos: (live.galleryPhotos?.length ? live.galleryPhotos : DEFAULT_GALLERY)
      });
      setImgLoadFailed(false); setLogoLoadFailed(false);
    };
    const unsubscribeConfig = subscribeToLiveConfig(STUDIO_CONFIG, (live) => { latestLive = live || STUDIO_CONFIG; applyLive(); });
    let unsubscribeMedia = () => {};
    try {
      unsubscribeMedia = onSnapshot(collection(db, MEDIA_COLLECTION), (snapshot) => {
        const map = {}; snapshot.docs.forEach(d => { map[d.id] = d.data()?.dataUrl || ''; });
        latestMedia = map; setMediaAssets(map); applyLive();
      });
    } catch (e) { console.warn('Media live sync unavailable:', e); }
    return () => { unsubscribeConfig?.(); unsubscribeMedia?.(); };
  }, []);

  useEffect(() => {
    const id = 'hf-google-fonts';
    if (!document.getElementById(id)) {
      const link = document.createElement('link'); link.id = id; link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Alata&family=Archivo&family=Archivo+Narrow&family=Asap&family=Bebas+Neue&family=Barlow&family=Cabin&family=Cinzel&family=Comfortaa&family=Cormorant+Garamond&family=Dancing+Script&family=DM+Sans&family=DM+Serif+Display&family=Dosis&family=EB+Garamond&family=Exo+2&family=Figtree&family=Great+Vibes&family=Heebo&family=Inter&family=Josefin+Sans&family=Josefin+Slab&family=Kanit&family=Karla&family=League+Spartan&family=Lexend&family=Lato&family=Libre+Baskerville&family=Lora&family=Maven+Pro&family=Manrope&family=Marcellus&family=Merriweather&family=Montserrat&family=Mulish&family=Nunito&family=Open+Sans&family=Oswald&family=Outfit&family=Pacifico&family=Playfair+Display&family=Poppins&family=Prata&family=Quicksand&family=Raleway&family=Roboto&family=Rubik&family=Sora&family=Space+Grotesk&family=Spectral&family=Teko&family=Titillium+Web&family=Urbanist&family=Work+Sans&family=Yeseva+One&display=swap';
      document.head.appendChild(link);
    }
  }, []);

  const handleAddFamilyGuest = () => {
    const defaultKit = 'international';
    const firstPkgKey = Object.keys(config.kitText?.[defaultKit] || {})[0] || 'hd_party';
    setFamilyGuests([...familyGuests, {
      id: Date.now(),
      name: `Guest #${familyGuests.length + 1}`,
      kit: defaultKit,
      packageKey: firstPkgKey
    }]);
  };

  const handleRemoveFamilyGuest = (id) => {
    setFamilyGuests(familyGuests.filter(g => g.id !== id));
  };

  const handleUpdateFamilyGuest = (id, field, value) => {
    setFamilyGuests(familyGuests.map(g => {
      if (g.id !== id) return g;
      if (field === 'kit') {
        const availableKeys = Object.keys(config.kitText?.[value] || {});
        const nextKey = availableKeys.includes(g.packageKey) ? g.packageKey : (availableKeys[0] || 'hd_party');
        return { ...g, kit: value, packageKey: nextKey };
      }
      return { ...g, [field]: value };
    }));
  };

  const isGuestDiscountActive = config.toggles?.enableGuestDiscount !== false && config.guestDiscount?.enabled !== false;
  const guestDiscountPercent = isGuestDiscountActive ? (config.guestDiscount?.discountPercent ?? 15) : 0;

  const calculateFamilyGuestsGross = () => {
    let subtotal = 0;
    familyGuests.forEach(g => {
      const raw = config.pricingByKit[g.kit]?.[g.packageKey] || 2500;
      subtotal += raw;
    });
    return subtotal;
  };

  const mainPackagePrice = config.pricingByKit[calcKit]?.[calcPackage] || 15000;
  const zoneFee = config.convenienceZones[calcZone]?.fee || 350;
  
  const mainBookingSubtotal = mainPackagePrice + zoneFee;
  const familyGuestsGross = calculateFamilyGuestsGross();
  
  const guestDiscountSavedAmount = isGuestDiscountActive && familyGuests.length > 0
    ? Math.round((familyGuestsGross * guestDiscountPercent) / 100)
    : 0;
    
  const familyGuestsFinalTotal = familyGuestsGross - guestDiscountSavedAmount;
  const subtotalBeforePromo = mainBookingSubtotal + familyGuestsFinalTotal;

  const handleApplyCoupon = (e, customCode) => {
    if (e) e.preventDefault();
    setCouponError('');
    if (config.toggles?.enableCoupons === false || config.enableDiscountsAndCoupons === false) {
      setCouponError('❌ Coupon system is currently disabled.');
      return;
    }
    const code = (customCode || couponInput).trim().toUpperCase();
    if (!code) return;
    const couponData = config.validCoupons?.[code];
    if (!couponData) {
      setCouponError('❌ Invalid promo coupon code.');
      return;
    }
    if (couponData.enabled === false) {
      setCouponError('⚠️ This promo coupon code is currently unavailable.');
      return;
    }
    if (couponData.expiryDate) {
      const timeRemaining = getTimeRemaining(couponData.expiryDate);
      if (timeRemaining && timeRemaining.expired) {
        setCouponError(`⚠️ Coupon code ${code} expired on ${new Date(couponData.expiryDate).toLocaleDateString()}.`);
        return;
      }
    }
    setAppliedCoupon({ code, ...couponData });
    setCouponInput(code);
    setCouponError('');
  };

  const getDiscountAmount = (gross) => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === 'percent') return Math.round((gross * appliedCoupon.value) / 100);
    if (appliedCoupon.type === 'flat') return Math.min(gross, appliedCoupon.value);
    return 0;
  };

  const couponDiscountAmount = getDiscountAmount(subtotalBeforePromo);
  const finalEstimate = Math.max(0, subtotalBeforePromo - couponDiscountAmount);

  const generateBookingSentSlipJpg = (bNumber) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const guestRowsHeight = familyGuests.length * 84;
    canvas.width = 1200;
    canvas.height = Math.max(2600, 2150 + guestRowsHeight);

    const drawText = (text, x, y, size, weight = 'normal', color = '#ffffff', align = 'left', family = 'sans-serif') => {
      ctx.textAlign = align;
      ctx.fillStyle = color;
      ctx.font = `${weight} ${size}px ${family}`;
      ctx.fillText(String(text ?? ''), x, y);
    };

    const drawRow = (label, value, y, options = {}) => {
      const rowHeight = options.height || 54;
      ctx.fillStyle = options.bg || 'rgba(255,255,255,0.035)';
      ctx.fillRect(90, y, 1020, rowHeight);
      drawText(label, 120, y + 34, options.labelSize || 18, 'bold', options.labelColor || '#94a3b8');
      drawText(value, 1080, y + 34, options.valueSize || 19, 'bold', options.valueColor || '#ffffff', 'right', options.mono ? 'monospace' : 'sans-serif');
      return y + rowHeight + (options.gap ?? 6);
    };

    const drawDynamicRow = (label, value, y, options = {}) => {
      ctx.font = `bold ${options.valueSize || 18}px sans-serif`;
      const maxWidth = options.maxWidth || 500;
      const words = String(value || '').split(' ');
      let lines = [];
      let curLine = '';

      for (let i = 0; i < words.length; i++) {
        const testLine = curLine + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && i > 0) {
          lines.push(curLine.trim());
          curLine = words[i] + ' ';
        } else {
          curLine = testLine;
        }
      }
      if (curLine.trim()) lines.push(curLine.trim());
      if (lines.length === 0) lines = [String(value || '')];

      const lineHeight = 24;
      const rowHeight = Math.max(54, 24 + (lines.length * lineHeight));
      ctx.fillStyle = options.bg || 'rgba(255,255,255,0.035)';
      ctx.fillRect(90, y, 1020, rowHeight);

      drawText(label, 120, y + 34, options.labelSize || 18, 'bold', options.labelColor || '#94a3b8');
      lines.forEach((line, lIdx) => {
        drawText(line, 1080, y + 34 + (lIdx * lineHeight), options.valueSize || 18, 'bold', options.valueColor || '#ffffff', 'right');
      });

      return y + rowHeight + (options.gap ?? 6);
    };

    const drawSectionTitle = (title, y, accent = '#7c3aed') => {
      ctx.fillStyle = accent === '#7c3aed' ? 'rgba(192,132,252,0.12)' : 'rgba(56,189,248,0.10)';
      ctx.fillRect(90, y, 1020, 56);
      drawText(title, 120, y + 36, 20, 'bold', accent);
      return y + 64;
    };

    const drawContent = (logoImageObj) => {
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, 1200, canvas.height);

      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 6;
      ctx.strokeRect(40, 40, 1120, canvas.height - 80);

      ctx.strokeStyle = 'rgba(124, 58, 237, 0.25)';
      ctx.lineWidth = 2;
      ctx.strokeRect(55, 55, 1090, canvas.height - 110);

      if (logoImageObj) {
        ctx.save();
        ctx.globalAlpha = 0.04;
        ctx.drawImage(logoImageObj, 300, 900, 600, 600);
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.arc(140, 140, 60, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(logoImageObj, 80, 80, 120, 120);
        ctx.restore();

        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(140, 140, 60, 0, Math.PI * 2, true);
        ctx.stroke();

        drawText(config.studioName || 'H&F MAKEUP ARTIST', 230, 130, 44, 'bold', '#ffffff');
        drawText(config.artistTagline || 'Beauty, Styled Your Way', 230, 175, 22, 'bold', '#7c3aed');
      } else {
        drawText(config.studioName || 'H&F MAKEUP ARTIST', 600, 135, 50, 'bold', '#ffffff', 'center');
        drawText(config.artistTagline || 'Beauty, Styled Your Way', 600, 175, 22, 'bold', '#7c3aed', 'center');
      }

      ctx.strokeStyle = 'rgba(124, 58, 237, 0.2)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(90, 230);
      ctx.lineTo(1110, 230);
      ctx.stroke();

      drawText('⏳ OFFICIAL BOOKING REQUEST SLIP', 600, 290, 26, 'bold', '#fbbf24', 'center');

      const pkgText = config.kitText?.[calcKit]?.[calcPackage] || DEFAULT_KIT_TEXT[calcKit][calcPackage];
      const kitName = config.pricingByKit[calcKit].name;
      const zone = config.convenienceZones[calcZone];

      let startY = 340;
      startY = drawRow('BOOKING NUMBER', bNumber || '#HF-PENDING', startY, { valueColor: '#7c3aed', mono: true });
      startY = drawRow('CLIENT NAME', clientName || 'Not Provided', startY);
      startY = drawRow('CONTACT NUMBER', clientPhone || 'Not Provided', startY);
      startY = drawRow('EVENT DATE', eventDate || 'Not Provided', startY);

      startY += 10;
      startY = drawSectionTitle('📍 VENUE DESTINATION & STRUCTURED ADDRESS', startY, '#0284c7');
      startY = drawRow('Address Type:', `[ ${addressType} ]`, startY, { valueColor: '#0284c7' });
      if (flatHouseNo.trim()) {
        startY = drawDynamicRow('Flat / House No., Building:', flatHouseNo.trim(), startY);
      }
      startY = drawDynamicRow('Street, Sector, Locality:', streetLocality.trim() || 'Not Provided', startY);
      if (landmark.trim()) {
        startY = drawDynamicRow('Landmark:', landmark.trim(), startY);
      }
      startY = drawRow('Town / City & State:', `${city || 'New Delhi'}, ${state || 'Delhi'}`, startY);
      startY = drawRow('Postal PIN Code:', pincode.trim() || 'Not Provided', startY, { valueColor: '#7c3aed', mono: true });

      startY += 10;
      startY = drawSectionTitle('1. MAIN MAKEOVER PACKAGE', startY, '#0284c7');
      startY = drawRow('• Vanity:', kitName, startY);
      startY = drawRow('• Package:', pkgText.name, startY);
      startY = drawRow('• Package Price:', `₹${mainPackagePrice.toLocaleString('en-IN')}`, startY, { mono: true });
      startY = drawRow(`• Travel Fee (${zone?.name}):`, `₹${zoneFee.toLocaleString('en-IN')}`, startY, { mono: true });
      startY = drawRow('Main Makeover Package Total:', `₹${mainBookingSubtotal.toLocaleString('en-IN')}`, startY, { labelColor: '#0284c7', valueColor: '#0284c7', mono: true });

      startY += 10;
      startY = drawSectionTitle(`2. ADDITIONAL FAMILY & GUEST MAKEOVERS (${familyGuests.length})`, startY, '#7c3aed');
      if (familyGuests.length > 0) {
        familyGuests.forEach((g, gIdx) => {
          const rawP = config.pricingByKit[g.kit]?.[g.packageKey] || 2500;
          const vanityName = config.pricingByKit?.[g.kit]?.name || (g.kit === 'international' ? 'International Luxury Kit' : 'Premium HD Kit');
          const gPkgName = config.kitText?.[g.kit]?.[g.packageKey]?.name || g.packageKey;
          startY = drawRow(`Makeover #${gIdx + 1} • Vanity:`, vanityName, startY, { labelSize: 16, valueSize: 17 });
          startY = drawRow('• Package:', gPkgName, startY, { labelSize: 16, valueSize: 17 });
          startY = drawRow('• Price:', `₹${rawP.toLocaleString('en-IN')}`, startY, { labelSize: 16, mono: true });
        });
      } else {
        startY = drawRow('• No extra family guests selected', '₹0', startY, { valueColor: '#71717a', mono: true });
      }
      startY = drawRow('Additional Family & Guest Total:', `₹${familyGuestsGross.toLocaleString('en-IN')}`, startY, { labelColor: '#7c3aed', valueColor: '#7c3aed', mono: true });

      startY += 10;
      startY = drawSectionTitle('3. DISCOUNTS & OFFERS', startY, '#16a34a');
      if (guestDiscountSavedAmount > 0) {
        startY = drawRow(`• Extra Guest Discount (${guestDiscountPercent}%):`, `-₹${guestDiscountSavedAmount.toLocaleString('en-IN')}`, startY, { valueColor: '#16a34a', mono: true });
      }
      if (appliedCoupon && couponDiscountAmount > 0) {
        startY = drawRow(`• Coupon Code (${appliedCoupon.code}):`, `-₹${couponDiscountAmount.toLocaleString('en-IN')}`, startY, { valueColor: '#16a34a', mono: true });
      }
      if (guestDiscountSavedAmount === 0 && (!appliedCoupon || couponDiscountAmount === 0)) {
        startY = drawRow('• No discounts applied', '₹0', startY, { valueColor: '#71717a', mono: true });
      }
      startY = drawRow('Total Discounts:', `-₹${(guestDiscountSavedAmount + couponDiscountAmount).toLocaleString('en-IN')}`, startY, { labelColor: '#16a34a', valueColor: '#16a34a', mono: true });

      startY += 18;
      ctx.fillStyle = 'rgba(192,132,252,0.20)';
      ctx.fillRect(90, startY, 1020, 115);
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 3;
      ctx.strokeRect(90, startY, 1020, 115);

      drawText('FINAL AMOUNT PAYABLE', 600, startY + 38, 22, 'bold', '#e2e8f0', 'center');
      drawText(`₹${finalEstimate.toLocaleString('en-IN')}`, 600, startY + 92, 48, 'bold', '#ffffff', 'center', 'serif');

      const footerY = canvas.height - 75;
      drawText(`Studio Base Location: ${config.baseLocation} • Instagram: @${(config.instagramHandle || '').replace('@','')}`, 600, footerY, 17, 'normal', '#94a3b8', 'center');
      drawText(config.artistTagline || 'Beauty, Styled Your Way', 600, footerY + 32, 18, 'italic', '#7c3aed', 'center');

      const jpgUrl = canvas.toDataURL('image/jpeg', 0.95);
      setGeneratedJpgUrl(jpgUrl);
    };

    const logoUrlToLoad = config.studioLogo || DEFAULT_STUDIO_LOGO;
    const logoImg = new Image();
    logoImg.crossOrigin = "anonymous";
    logoImg.src = logoUrlToLoad;
    logoImg.onload = () => drawContent(logoImg);
    logoImg.onerror = () => drawContent(null);
  };

  const handleDirectEstimateBooking = async (e) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim() || !eventDate || !streetLocality.trim() || !pincode.trim()) {
      alert("Please fill your Name, Contact Phone, Event Date, Street/Locality, and Postal PIN Code.");
      return;
    }

    setIsSubmitting(true);
    const pkgText = config.kitText?.[calcKit]?.[calcPackage] || DEFAULT_KIT_TEXT[calcKit][calcPackage];
    const zone = config.convenienceZones[calcZone];
    const generatedBookingNo = `#HF-${Math.floor(100000 + Math.random() * 900000)}`;
    setCurrentBookingNumber(generatedBookingNo);

    const compiledAddress = `${flatHouseNo.trim() ? `${flatHouseNo.trim()}, ` : ''}${streetLocality.trim()}${landmark.trim() ? `, Near ${landmark.trim()}` : ''}, ${city}, ${state} - ${pincode.trim()}`;

    try {
      await addDoc(collection(db, "bookings"), {
        bookingNumber: generatedBookingNo,
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        eventDate: eventDate,
        kitType: config.pricingByKit[calcKit].name,
        packageKey: calcPackage,
        packageName: `${pkgText.num ? pkgText.num + '.' : ''} ${pkgText.name}`,
        basePackagePrice: mainPackagePrice,
        extraGuestsCount: familyGuests.length,
        extraGuestsList: familyGuests,
        extraGuestsCost: familyGuestsGross,
        extraGuestsFinalCost: familyGuestsFinalTotal,
        guestDiscountSaved: guestDiscountSavedAmount,
        zoneName: zone?.name || 'Delhi NCR',
        zoneFee: zone?.fee || 350,
        
        addressType: addressType,
        flatHouseNo: flatHouseNo.trim(),
        streetLocality: streetLocality.trim(),
        landmark: landmark.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        venueAddress: compiledAddress,

        appliedCoupon: appliedCoupon ? appliedCoupon.code : 'None',
        couponDiscountAmount: couponDiscountAmount,
        discountAmount: guestDiscountSavedAmount + couponDiscountAmount,
        totalAmount: finalEstimate,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      const telegramBotToken = config.telegramBotToken || STUDIO_CONFIG.telegramBotToken || "8891500480:AAGvxL16eNxSkn6ZXgoG28EW80VM75mwukg";
      const telegramChatId = config.telegramChatId || STUDIO_CONFIG.telegramChatId || "8891500480";
      
      const tgMsgText = 
        `🚨 <b>NEW APPOINTMENT BOOKING REQUEST</b> 🚨\n\n` +
        `🔢 <b>Booking No:</b> ${generatedBookingNo}\n` +
        `👤 <b>Client Name:</b> ${clientName.trim()}\n` +
        `📞 <b>Contact Phone:</b> ${clientPhone.trim()}\n` +
        `📅 <b>Event Date:</b> ${eventDate}\n` +
        `💄 <b>Main Look:</b> ${pkgText.name}\n` +
        `💎 <b>Vanity Tier:</b> ${config.pricingByKit[calcKit].name}\n` +
        `👥 <b>Extra Guests:</b> ${familyGuests.length} person(s)\n` +
        `🏷️ <b>Address Type:</b> ${addressType}\n` +
        `🏠 <b>Venue Address:</b> ${compiledAddress}\n` +
        `📮 <b>Postal PIN:</b> ${pincode.trim()}\n` +
        `🎁 <b>Discounts:</b> Guest (-₹${guestDiscountSavedAmount}) | Promo (-₹${couponDiscountAmount})\n` +
        `💰 <b>Final Amount:</b> ₹${finalEstimate.toLocaleString('en-IN')}\n\n` +
        `<i>Status: Pending Confirmation in Admin Console</i>`;

      try {
        if (!telegramBotToken || !telegramChatId) throw new Error('Telegram Bot Token / Chat ID is missing.');
        const tgResponse = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: telegramChatId, text: tgMsgText, parse_mode: 'HTML' })
        });
        const tgResult = await tgResponse.json().catch(() => ({}));
        if (!tgResponse.ok || !tgResult.ok) throw new Error(tgResult.description || `Telegram HTTP ${tgResponse.status}`);
        setTelegramStatus('Telegram notification sent successfully.');
      } catch (tgErr) {
        console.warn('Telegram dispatch warning:', tgErr);
        setTelegramStatus(`Telegram notification failed: ${tgErr.message}`);
      }

      generateBookingSentSlipJpg(generatedBookingNo);
      setIsBookingDone(true);
    } catch (err) {
      alert("Error submitting booking: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!feedbackMessage.trim()) return;

    setIsSubmittingFeedback(true);
    try {
      await addDoc(collection(db, "feedbacks"), {
        clientName: feedbackName.trim() || 'Valued Client',
        clientPhone: feedbackPhone.trim() || 'Not Provided',
        rating: feedbackRating,
        message: feedbackMessage.trim(),
        submittedAt: serverTimestamp()
      });
      setFeedbackSubmitted(true);
      setFeedbackMessage('');
    } catch (err) {
      alert("Error submitting suggestion: " + err.message);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // ADMIN-CLONE TRUE LIQUID GLASS ENGINE RESOLUTION
  const rawThemeKey = config.theme?.colorTheme || 'real_glass_lens';
  const baseThemeStyle = THEME_STYLES[rawThemeKey] || THEME_STYLES.real_glass_lens;
  const activeThemeStyle = isDarkMode
    ? baseThemeStyle
    : { ...baseThemeStyle, ...DAY_MODE_OVERRIDES };
  const currentFontFamily = FONT_MAP[config.theme?.fontFamily] || FONT_MAP.sans;

  const resolvedAvatar = imgLoadFailed ? DEFAULT_PROFILE_IMG : resolveProfileImageUrl(config);
  const resolvedLogoUrl = logoLoadFailed || !config.studioLogo ? DEFAULT_STUDIO_LOGO : config.studioLogo;

  const floatingPromoCode = config.floatingBanner?.code || "BRIDE2026";
  const floatingCouponData = config.validCoupons?.[floatingPromoCode];
  const floatingTimer = floatingCouponData?.expiryDate ? getTimeRemaining(floatingCouponData.expiryDate) : null;
  const isFloatingExpired = floatingTimer ? floatingTimer.expired : false;
  const shouldHideFloatingDueToExpiry = isFloatingExpired && (config.floatingBanner?.autoHideOnExpire !== false);

  const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(window.location.href)}`;
  const shouldShowProfileInHeader = config.toggles?.showProfileOnApp !== false;

  if (config.isAppDown || config.maintenanceMode) {
    return (
      <div style={{ fontFamily: currentFontFamily }} className={`min-h-screen ${activeThemeStyle.bg} flex items-center justify-center p-4 relative overflow-hidden`}>
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br ${activeThemeStyle.glowOrb} rounded-full blur-3xl pointer-events-none animate-pulse`} />
        <div className={`max-w-md w-full ${activeThemeStyle.card} p-8 text-center space-y-4 shadow-2xl relative z-10`}>
          <div className="w-12 h-12 rounded-[20px] bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto border border-amber-500/20">
            <Wrench className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] uppercase font-mono tracking-wider text-amber-600 bg-amber-500/10 px-2.5 py-1 rounded-md inline-block font-medium border border-amber-500/20">
              Scheduled System Upgrade
            </span>
            <h2 className="text-xl font-semibold">We'll Be Back Shortly</h2>
            <p className="text-xs opacity-75 leading-relaxed">
              We are currently fine-tuning our luxury digital experience and updating reservation systems. We appreciate your patience.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      style={{ fontFamily: currentFontFamily, WebkitUserSelect: 'none', userSelect: 'none' }} 
      data-hf-theme={rawThemeKey}
      data-hf-mode={isDarkMode ? 'night' : 'day'}
      className={`hf-app min-h-screen ${activeThemeStyle.bg} pb-24 sm:pb-16 relative transition-colors duration-500 overflow-x-hidden`}
      onContextMenu={(e) => e.preventDefault()}
    >
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        button, a, input, select, textarea, [role="button"] { -webkit-tap-highlight-color: transparent; }
        button, a { will-change: transform, opacity; }
        
        select option {
          background-color: #18181b;
          color: #f4f4f5;
        }
        html, body, #root { min-height: 100%; width: 100%; margin: 0; }
        html { overflow-x: hidden; }
        body { overflow-x: hidden; }

        .hf-app[data-hf-mode="night"] h1,
        .hf-app[data-hf-mode="night"] h2,
        .hf-app[data-hf-mode="night"] h3,
        .hf-app[data-hf-mode="night"] h4,
        .hf-app[data-hf-mode="night"] .font-mono {
          text-shadow: 0 0 12px rgba(95, 248, 255, 0.35);
        }

        .hf-modal-backdrop { 
          position: fixed; inset: 0; z-index: 90; display: flex; align-items: center; justify-content: center; 
          padding: max(16px, env(safe-area-inset-top)) 16px max(16px, env(safe-area-inset-bottom)); 
          background: rgba(0,0,0,0.65); backdrop-filter: blur(20px); overflow-y: auto; 
        }
        .hf-modal-card { width: min(100%, 560px); max-height: min(88dvh, 760px); overflow-y: auto; margin: auto; }

        .hf-floating-banner { 
          position: fixed; bottom: calc(84px + env(safe-area-inset-bottom)); right: max(12px, env(safe-area-inset-right)); 
          width: min(360px, calc(100vw - 24px)); z-index: 40;
        }
        @media (min-width: 640px) { .hf-floating-banner { bottom: 24px; right: 24px; width: 340px; } }

        .hf-bottom-nav { 
          position: fixed; bottom: max(12px, env(safe-area-inset-bottom)); left: 50%; transform: translateX(-50%); 
          width: calc(100% - 24px); max-width: 520px; padding: 8px; border-radius: 999px !important; 
          backdrop-filter: blur(24px); box-shadow: 0 20px 50px rgba(0,0,0,0.3); z-index: 50;
        }
        .hf-bottom-nav button { min-height: 48px; border-radius: 999px !important; }
      `}</style>

      {/* AMBIENT GLOW ORB BACKGROUND */}
      <div className={`absolute top-0 left-1/3 w-[650px] h-[650px] bg-gradient-to-br ${activeThemeStyle.glowOrb} rounded-full blur-3xl pointer-events-none animate-pulse`} />

      {showSplash && (
        <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center ${activeThemeStyle.bg} transition-opacity duration-600 ${splashFade ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="flex flex-col items-center space-y-4 px-4 text-center">
            <div className={`w-20 h-20 rounded-[24px] overflow-hidden ${activeThemeStyle.card} p-1 shadow-2xl animate-pulse`}>
              <img src={resolvedLogoUrl} alt="Studio Logo" onError={() => setLogoLoadFailed(true)} className="w-full h-full object-contain rounded-[20px]" />
            </div>
            <div className="space-y-1">
              <h1 className="text-xl font-bold tracking-tight">{config.studioName || 'H&F Makeup Artist'}</h1>
              <p className={`text-xs ${activeThemeStyle.accentText} font-medium uppercase tracking-wider`}>{config.artistTagline || 'Beauty, Styled Your Way'}</p>
            </div>
          </div>
        </div>
      )}

      {showShareModal && (
        <div className="hf-modal-backdrop">
          <div className={`hf-modal-card ${activeThemeStyle.card} rounded-[32px] p-6 text-center space-y-4 shadow-2xl`}>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs flex items-center gap-1.5"><Share2 className={`w-4 h-4 ${activeThemeStyle.accentText}`} /> Share Studio Lookbook</span>
              <button onClick={() => setShowShareModal(false)} className="p-1 rounded-full opacity-60 hover:opacity-100"><X className="w-4 h-4" /></button>
            </div>
            <div className="w-40 h-40 mx-auto bg-white p-2 rounded-[24px] border border-black/10 flex items-center justify-center shadow-inner">
              <img src={qrCodeApiUrl} alt="App QR Code" className="w-full h-full object-contain" />
            </div>
            <p className="text-xs opacity-75">Scan this QR code with any camera to explore portfolio.</p>
            <div className="flex gap-2">
              <button onClick={handleCopyLink} className="flex-1 py-2.5 rounded-[16px] bg-black/5 dark:bg-white/5 hover:bg-black/10 text-xs font-medium flex items-center justify-center gap-1.5 border border-black/10 dark:border-white/10 transition">
                {copiedLink ? <CheckCheck className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 opacity-60" />}
                <span>{copiedLink ? 'Copied' : 'Copy'}</span>
              </button>
              <a href={qrCodeApiUrl} download="QR.png" target="_blank" rel="noreferrer" className={`px-4 py-2.5 rounded-[16px] ${activeThemeStyle.btn} text-xs font-medium flex items-center justify-center gap-1 transition`}>
                <Download className="w-3.5 h-3.5" /> <span>Save</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {viewingPackage && (
        <div className="hf-modal-backdrop">
          <div className={`hf-modal-card ${activeThemeStyle.card} rounded-[32px] p-6 space-y-4 shadow-2xl`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Crown className={`w-4 h-4 ${activeThemeStyle.accentText}`} />
                <h3 className="font-semibold text-sm sm:text-base">{viewingPackage.name}</h3>
              </div>
              <button onClick={() => setViewingPackage(null)} className="p-1 rounded-full opacity-60 hover:opacity-100"><X className="w-4 h-4" /></button>
            </div>
            <div className="w-full h-40 sm:h-48 rounded-[24px] overflow-hidden bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 shadow-sm">
              <img src={viewingPackage.image} alt={viewingPackage.name} className="w-full h-full object-cover" />
            </div>
            <p className="text-xs opacity-80 leading-relaxed">{viewingPackage.desc}</p>
            <div className="space-y-2 text-xs border-t border-b border-black/10 dark:border-white/10 py-3">
              <div className="flex justify-between items-start gap-2"><span className="opacity-70">Vanity Tier:</span><strong className="font-medium">{config.pricingByKit[selectedKit]?.name}</strong></div>
              <div className="flex justify-between items-start gap-2"><span className="opacity-70">Skin Finish:</span><span>{viewingPackage.skinFinish}</span></div>
              <div className="flex justify-between items-start gap-2"><span className="opacity-70">Includes:</span><span>{viewingPackage.includes}</span></div>
              <div className="flex justify-between items-center font-semibold text-sm pt-1">
                <span>Rate:</span>
                <span className={`${activeThemeStyle.accentText} font-mono text-sm font-bold`}>₹{(config.pricingByKit?.[selectedKit]?.[viewingPackage.key] || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>
            <button onClick={() => { setCalcPackage(viewingPackage.key); setCalcKit(selectedKit); setViewingPackage(null); setActiveTab('calculator'); }} className={`w-full py-3 ${activeThemeStyle.btn} text-xs font-medium transition flex items-center justify-center gap-1.5`}>
              <span>Estimate & Book This Look</span> <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ANNOUNCEMENT TICKER: Rendered ONLY after splash screen is completely gone */}
      {!showSplash && config.toggles?.enableAnnouncements !== false && config.showOfferSection !== false && (
        <div className="bg-black text-white py-2 px-3 overflow-hidden text-xs font-medium relative flex items-center select-none shadow-sm z-50">
          <div className="flex overflow-hidden whitespace-nowrap w-full">
            <div className="inline-flex space-x-12 animate-[marquee_25s_linear_infinite] shrink-0">
              {(config.announcements || []).map((ann, idx) => (
                <span key={idx} className="mx-6 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-white/50" />{ann}</span>
              ))}
            </div>
          </div>
          <style>{`@keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-100%); } }`}</style>
        </div>
      )}

      {/* STICKY HEADER FOR BOTH MOBILE AND DESKTOP VIEWS */}
      <header className={`sticky top-0 z-40 px-4 sm:px-8 py-3 ${activeThemeStyle.card} !rounded-none !border-x-0 !border-t-0 backdrop-blur-3xl border-b transition-colors shadow-xl`}>
        <div className="max-w-5xl mx-auto flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 select-none cursor-pointer min-w-0">
              {config.toggles?.showLogoOnApp !== false && (
                <div className="w-10 h-10 rounded-[16px] overflow-hidden shrink-0 border border-black/10 dark:border-white/20 bg-black/5 dark:bg-white/10 flex items-center justify-center shadow-sm">
                  <img src={resolvedLogoUrl} alt="Logo" onError={() => setLogoLoadFailed(true)} className="w-full h-full object-cover rounded-[14px]" draggable="false" />
                </div>
              )}
              <div className="truncate">
                <h1 className="font-semibold text-sm sm:text-base truncate">{config.studioName || 'H&F Makeup Artist'}</h1>
                <p className={`text-xs ${activeThemeStyle.accentText} flex items-center gap-1 truncate font-medium`}><span className="truncate">{config.artistTagline || 'Beauty, Styled Your Way'}</span></p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => setShowShareModal(true)} title="Share & QR Code" className="p-2.5 rounded-[16px] border border-black/15 dark:border-white/25 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition flex items-center justify-center shadow-xs">
                <QrCode className="w-4 h-4" />
              </button>

              {/* DAY/NIGHT TOGGLE WITH ICON ONLY (NO TEXT) */}
              <button onClick={toggleTheme} title="Toggle Day/Night Mode" className="p-2.5 rounded-[16px] border border-black/15 dark:border-white/25 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition flex items-center justify-center shadow-xs">
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
              </button>

              {/* CAMERA/INSTAGRAM ICON & "View on Instagram" TEXT */}
              <a href={getCleanInstagramUrl(config.instagramHandle)} target="_blank" rel="noopener noreferrer" className={`flex items-center space-x-1.5 ${activeThemeStyle.btn} text-xs font-medium px-3.5 py-2.5 transition hover:opacity-90 shadow-md`}>
                <Camera className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">View on Instagram</span>
              </a>

              {shouldShowProfileInHeader && (
                <div className="w-9 h-9 rounded-[16px] border border-black/15 dark:border-white/25 overflow-hidden shrink-0 shadow-xs">
                  <img src={resolvedAvatar} alt="Artist Profile" onError={() => setImgLoadFailed(true)} className="w-full h-full object-cover rounded-[14px]" />
                </div>
              )}
            </div>
          </div>

          <div className="hidden sm:flex w-full items-center justify-center pt-1">
            <nav className="inline-flex space-x-1 p-1.5 rounded-[24px] border border-black/15 dark:border-white/25 bg-black/5 dark:bg-white/10 text-xs font-medium shadow-inner backdrop-blur-3xl">
              {[
                { id: 'menu', label: 'Packages', icon: Crown, show: true },
                { id: 'gallery', label: 'Transformations', icon: Camera, show: config.toggles?.enableGallery !== false },
                { id: 'brands', label: 'Vanity', icon: Star, show: config.toggles?.enableBrands !== false },
                { id: 'calculator', label: 'Estimate & Book', icon: Calculator, show: config.toggles?.enableEstimator !== false },
                { id: 'feedback', label: 'Feedback', icon: MessageSquare, show: true }
              ].filter(t => t.show).map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-1.5 px-4 py-2 rounded-[20px] transition ${isActive ? `${activeThemeStyle.btn} font-semibold shadow-md` : 'opacity-70 hover:opacity-100'}`}>
                    <Icon className="w-3.5 h-3.5 shrink-0" /><span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {!showSplash && (
        <nav aria-label="Mobile Navigation" className={`hf-bottom-nav ${activeThemeStyle.card} sm:hidden flex items-center justify-around backdrop-blur-3xl border border-black/15 dark:border-white/25`}>
          {[
            { id: 'menu', label: 'Packages', icon: Crown, show: true },
            { id: 'gallery', label: 'Gallery', icon: Camera, show: config.toggles?.enableGallery !== false },
            { id: 'brands', label: 'Vanity', icon: Star, show: config.toggles?.enableBrands !== false },
            { id: 'calculator', label: 'Book', icon: Calculator, show: config.toggles?.enableEstimator !== false },
            { id: 'feedback', label: 'Review', icon: MessageSquare, show: true }
          ].filter(t => t.show).map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 flex flex-col items-center justify-center py-1.5 rounded-[16px] transition ${isActive ? `${activeThemeStyle.accentText} font-semibold bg-black/10 dark:bg-white/20 shadow-xs` : 'opacity-60'}`}>
                <Icon className="w-4 h-4 shrink-0" /><span className="text-[10px] mt-0.5">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      )}

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 relative z-10">
        {activeTab === 'menu' && (
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className={`px-3.5 py-1.5 rounded-[16px] bg-black/5 dark:bg-white/10 border border-black/15 dark:border-white/25 ${activeThemeStyle.accentText} text-xs font-medium inline-block shadow-2xs`}>
                Professional Vanity Packages
              </span>
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">Curated Makeup Menu</h2>
              <p className="text-xs sm:text-sm opacity-70">Select kit tier below to view package pricing & details:</p>

              <div className="inline-flex p-1.5 rounded-[24px] bg-black/5 dark:bg-white/10 border border-black/15 dark:border-white/25 mt-2 gap-1 shadow-inner backdrop-blur-3xl">
                <button onClick={() => setSelectedKit('international')} className={`px-4 py-2 rounded-[20px] text-xs font-medium transition ${selectedKit === 'international' ? `${activeThemeStyle.btn} font-semibold shadow-sm` : 'opacity-70'}`}>👑 Luxury Kit</button>
                <button onClick={() => setSelectedKit('drugstore')} className={`px-4 py-2 rounded-[20px] text-xs font-medium transition ${selectedKit === 'drugstore' ? `${activeThemeStyle.btn} font-semibold shadow-sm` : 'opacity-70'}`}>✨ HD Kit</button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {Object.keys(config.kitText?.[selectedKit] || {}).map((key) => {
                const item = config.kitText?.[selectedKit]?.[key] || DEFAULT_KIT_TEXT[selectedKit][key];
                const price = config.pricingByKit?.[selectedKit]?.[key] || 0;
                const imgSrc = config.kitImages?.[selectedKit]?.[key] || DEFAULT_KIT_IMAGES[selectedKit][key];

                if (!item.name) return null;

                return (
                  <div key={`${selectedKit}_${key}`} className={`${activeThemeStyle.card} p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-center transition-all duration-300 hover:scale-[1.01]`}>
                    <div className="w-full sm:w-32 h-36 sm:h-32 shrink-0 rounded-[20px] overflow-hidden bg-black/5 dark:bg-white/10 relative border border-black/15 dark:border-white/25 shadow-sm">
                      <img src={imgSrc} alt={item.name} className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-[10px] bg-black/70 text-[10px] font-mono font-medium text-amber-300 backdrop-blur-xs">
                        {selectedKit === 'international' ? '👑 Luxury' : '✨ HD Classic'}
                      </div>
                    </div>
                    <div className="flex-1 w-full flex flex-col justify-between space-y-2">
                      <div>
                        <div className="flex justify-between items-baseline gap-2">
                          <h4 className="font-semibold text-sm sm:text-base">{item.num ? `${item.num}. ` : ''}{item.name}</h4>
                          <span className={`font-mono font-semibold text-sm sm:text-base ${activeThemeStyle.accentText} shrink-0`}>₹{price.toLocaleString('en-IN')}</span>
                        </div>
                        <p className="text-xs opacity-70 mt-1 line-clamp-2">{item.desc}</p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-black/10 dark:border-white/15">
                        <span className="text-[11px] opacity-70 font-normal truncate flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-500 shrink-0" /> 16HR HD Finish
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => setViewingPackage({ key, ...item, image: imgSrc })} className="px-3.5 py-2 rounded-[14px] border border-black/15 dark:border-white/25 text-xs font-medium hover:bg-black/10 dark:hover:bg-white/15 transition shadow-2xs">Details</button>
                          <button onClick={() => { setCalcPackage(key); setCalcKit(selectedKit); setActiveTab('calculator'); }} className={`px-4 py-2 ${activeThemeStyle.btn} text-xs font-medium transition flex items-center gap-1 shadow-sm`}>
                            <span>Book</span> <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'gallery' && config.toggles?.enableGallery !== false && (
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className={`px-3.5 py-1.5 rounded-[16px] bg-black/5 dark:bg-white/10 border border-black/15 dark:border-white/25 ${activeThemeStyle.accentText} text-xs font-medium inline-block shadow-2xs`}>Discover Looks</span>
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">Featured Transformations</h2>
              <p className="text-xs sm:text-sm opacity-70">Explore signature makeup transformations crafted with perfection.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(config.galleryPhotos || DEFAULT_GALLERY).map((item, idx) => {
                const isVideo = isVideoMedia(item);
                return (
                  <div key={idx} className={`${activeThemeStyle.card} overflow-hidden flex flex-col justify-between transition-all duration-300 hover:scale-[1.01]`}>
                    {isVideo ? <AutoPlayVideoCard item={item} /> : (
                      <div className="h-72 sm:h-80 overflow-hidden relative bg-black/5 dark:bg-white/10 rounded-[28px] border border-black/15 dark:border-white/25">
                        <img src={item.url} alt={item.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                          <span className="text-[11px] uppercase font-mono font-medium text-zinc-300">{item.sub || 'Client Transformation'}</span>
                          <h4 className="font-semibold text-sm mt-0.5 text-white"><span>{item.title}</span></h4>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'brands' && config.toggles?.enableBrands !== false && (
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className={`px-3.5 py-1.5 rounded-[16px] bg-black/5 dark:bg-white/10 border border-black/15 dark:border-white/25 ${activeThemeStyle.accentText} text-xs font-medium inline-block shadow-2xs`}>Authentic Vanity</span>
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">Products In Our Kit</h2>
              <p className="text-xs sm:text-sm opacity-70">100% Genuine, skin-safe international luxury cosmetics.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(config.internationalBrands || DEFAULT_BRANDS).map((brand, idx) => (
                <div key={idx} className={`${activeThemeStyle.card} p-5 space-y-2 transition-all duration-300 hover:scale-[1.01]`}>
                  <span className={`text-[10px] font-medium ${activeThemeStyle.accentText} bg-amber-500/10 border border-amber-500/20 uppercase px-2.5 py-1 rounded-[10px] font-mono inline-block`}>{brand.category}</span>
                  <h4 className="font-semibold text-sm">{brand.name}</h4>
                  <p className="text-xs opacity-70 leading-relaxed">{brand.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ESTIMATOR & BOOKING TAB WITH SEPARATE ISOLATED SUMMARY CARD */}
        {activeTab === 'calculator' && config.toggles?.enableEstimator !== false && (
          <div className="max-w-4xl mx-auto">
            {isBookingDone ? (
              <div className={`${activeThemeStyle.card} p-8 text-center space-y-4 shadow-2xl max-w-lg mx-auto`}>
                <div className="w-12 h-12 rounded-[20px] bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/20 shadow-xs">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="inline-block px-3.5 py-1.5 rounded-[16px] bg-black/5 dark:bg-white/10 border border-black/15 dark:border-white/25 font-mono font-medium text-xs shadow-2xs">
                  BOOKING NUMBER: {currentBookingNumber}
                </div>
                <h3 className="text-lg font-semibold">Booking Request Submitted Successfully</h3>
                <p className="text-xs opacity-70 leading-relaxed">Your appointment request has been recorded securely. Our team will coordinate with you shortly.</p>
                {telegramStatus && <p className={`text-[11px] ${telegramStatus.startsWith('Telegram notification sent') ? 'text-emerald-500' : 'text-amber-500'}`}>{telegramStatus}</p>}
                {generatedJpgUrl && (
                  <div className="pt-2">
                    <a href={generatedJpgUrl} download={`Booking_Sent_Receipt_${currentBookingNumber}.jpg`} className={`px-4 py-3 rounded-[16px] ${activeThemeStyle.btn} font-medium inline-flex items-center gap-2 text-xs transition shadow-sm`}>
                      <Download className="w-3.5 h-3.5" /> <span>Download Booking Receipt (.JPG)</span>
                    </a>
                  </div>
                )}
                <button onClick={() => setIsBookingDone(false)} className="block w-full py-3 bg-black/5 dark:bg-white/10 hover:bg-black/10 text-xs font-medium rounded-[16px] transition">Make Another Calculation / Booking</button>
              </div>
            ) : (
              <form onSubmit={handleDirectEstimateBooking} className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* LEFT COLUMN: OPTIONS & CLIENT INFO */}
                <div className={`md:col-span-7 ${activeThemeStyle.card} p-5 sm:p-7 space-y-5 shadow-2xl`}>
                  <div className="border-b border-black/10 dark:border-white/15 pb-2">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                      <Calculator className={`w-4 h-4 ${activeThemeStyle.accentText}`} /> 1. Calculate & Choose Looks
                    </h3>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2 opacity-70">Main Makeover Package: Vanity Tier</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button type="button" onClick={() => setCalcKit('international')} className={`p-3 rounded-[16px] text-xs font-medium border text-center transition shadow-2xs ${calcKit === 'international' ? `${activeThemeStyle.btn} font-semibold shadow-sm` : 'bg-black/5 dark:bg-white/10 border-black/15 dark:border-white/25 opacity-80'}`}>👑 Luxury Kit</button>
                      <button type="button" onClick={() => setCalcKit('drugstore')} className={`p-3 rounded-[16px] text-xs font-medium border text-center transition shadow-2xs ${calcKit === 'drugstore' ? `${activeThemeStyle.btn} font-semibold shadow-sm` : 'bg-black/5 dark:bg-white/10 border-black/15 dark:border-white/25 opacity-80'}`}>✨ HD Kit</button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 opacity-70">Main Makeover Package: Package</label>
                    <select value={calcPackage} onChange={(e) => setCalcPackage(e.target.value)} className="w-full bg-transparent border border-black/15 dark:border-white/25 rounded-[16px] px-3.5 py-3 text-xs font-medium shadow-2xs outline-none">
                      {Object.keys(config.kitText?.[calcKit] || {}).map(k => {
                        const pData = config.kitText[calcKit][k];
                        const pPrice = config.pricingByKit?.[calcKit]?.[k] || 0;
                        return <option key={k} value={k}>{pData.num ? `${pData.num}. ` : ''}{pData.name} (₹{pPrice.toLocaleString('en-IN')})</option>;
                      })}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 opacity-70">Venue Location Zone</label>
                    <select value={calcZone} onChange={(e) => setCalcZone(e.target.value)} className="w-full bg-transparent border border-black/15 dark:border-white/25 rounded-[16px] px-3.5 py-3 text-xs font-medium shadow-2xs outline-none">
                      {Object.entries(config.convenienceZones).map(([key, zone]) => (
                        <option key={key} value={key}>{zone.name} (+₹{zone.fee})</option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-3 border-t border-black/10 dark:border-white/15 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5">
                          <Users className={`w-3.5 h-3.5 ${activeThemeStyle.accentText}`} /> Extra Family Makeup Customizer
                        </h4>
                        <p className="text-[11px] opacity-70">Choose individual vanity tier & look for each family guest.</p>
                      </div>
                      <button type="button" onClick={handleAddFamilyGuest} className="px-3.5 py-2 rounded-[14px] bg-black/5 dark:bg-white/10 hover:bg-black/10 border border-black/15 dark:border-white/25 text-xs font-medium flex items-center gap-1 transition shadow-2xs">
                        <Plus className="w-3 h-3" /> Add Guest
                      </button>
                    </div>

                    {isGuestDiscountActive && guestDiscountPercent > 0 && (
                      <div className="p-3.5 rounded-[16px] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs shadow-2xs">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                          <p className="text-emerald-500 font-medium">Flat {guestDiscountPercent}% Extra Family Makeup Discount Active!</p>
                        </div>
                        <span className="font-mono font-medium text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-[8px] text-[10px]">{guestDiscountPercent}% OFF</span>
                      </div>
                    )}

                    {familyGuests.length > 0 && (
                      <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                        {familyGuests.map((guest, idx) => {
                          const rawGuestPrice = config.pricingByKit[guest.kit]?.[guest.packageKey] || 2500;
                          return (
                            <div key={guest.id} className="p-3.5 rounded-[16px] bg-black/5 dark:bg-white/10 border border-black/15 dark:border-white/25 space-y-2 shadow-2xs">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium">Guest #{idx + 1}</span>
                                <div className="flex items-center gap-2">
                                  <span className={`text-xs font-semibold font-mono ${activeThemeStyle.accentText}`}>₹{rawGuestPrice.toLocaleString('en-IN')}</span>
                                  <button type="button" onClick={() => handleRemoveFamilyGuest(guest.id)} className="p-1 text-rose-500 hover:bg-rose-500/10 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[10px] font-medium opacity-70 mb-1">Vanity Tier</label>
                                  <select value={guest.kit} onChange={(e) => handleUpdateFamilyGuest(guest.id, 'kit', e.target.value)} className="w-full p-2.5 rounded-[12px] text-xs font-medium bg-transparent border border-black/15 dark:border-white/25 outline-none">
                                    <option value="international">👑 Luxury Kit</option>
                                    <option value="drugstore">✨ HD Kit</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-[10px] font-medium opacity-70 mb-1">Package Look</label>
                                  <select value={guest.packageKey} onChange={(e) => handleUpdateFamilyGuest(guest.id, 'packageKey', e.target.value)} className="w-full p-2.5 rounded-[12px] text-xs font-medium bg-transparent border border-black/15 dark:border-white/25 outline-none">
                                    {Object.keys(config.kitText?.[guest.kit] || {}).map(k => (
                                      <option key={k} value={k}>{config.kitText[guest.kit][k]?.name || k} (₹{config.pricingByKit[guest.kit][k]})</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {config.toggles?.enableCoupons !== false && config.enableDiscountsAndCoupons !== false && (
                    <div className="pt-3 border-t border-black/10 dark:border-white/15 space-y-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 opacity-90">
                        <Tag className={`w-3.5 h-3.5 ${activeThemeStyle.accentText}`} /> Promo Coupon Code
                      </label>
                      {appliedCoupon ? (
                        <div className="bg-black/5 dark:bg-white/10 border border-black/15 dark:border-white/25 rounded-[16px] p-3.5 flex items-center justify-between gap-2 shadow-2xs">
                          <div>
                            <span className="text-xs font-semibold font-mono">CODE: {appliedCoupon.code} APPLIED</span>
                            <p className="text-[11px] opacity-70 font-normal">🎉 {appliedCoupon.type === 'percent' ? `${appliedCoupon.value}% OFF` : `Flat ₹${appliedCoupon.value} OFF`}</p>
                          </div>
                          <button type="button" onClick={() => { setAppliedCoupon(null); setCouponInput(''); }} className="text-rose-500 text-xs font-medium underline">Remove</button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <input type="text" placeholder="e.g. BRIDE2026" value={couponInput} onChange={(e) => setCouponInput(e.target.value.toUpperCase())} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleApplyCoupon(e); } }} className="flex-1 bg-transparent border border-black/15 dark:border-white/25 rounded-[16px] px-3.5 py-2.5 text-xs uppercase font-mono font-medium outline-none shadow-2xs" />
                          <button type="button" onClick={handleApplyCoupon} className={`px-4 py-2.5 ${activeThemeStyle.btn} text-xs font-medium rounded-[16px] transition shadow-sm`}>Apply</button>
                        </div>
                      )}
                      {couponError && <p className="text-[11px] text-rose-500 font-normal">{couponError}</p>}
                    </div>
                  )}

                  <div className="pt-3 border-t border-black/10 dark:border-white/15 space-y-3">
                    <h4 className="font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <User className={`w-3.5 h-3.5 ${activeThemeStyle.accentText}`} /> 2. Enter Client Details
                    </h4>
                    <div>
                      <label className="block text-xs font-medium opacity-70 mb-1">Full Name *</label>
                      <input type="text" required placeholder="e.g. Aliza Khan" value={clientName} onChange={(e) => setClientName(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }} className="w-full px-3.5 py-2.5 rounded-[16px] bg-transparent border border-black/15 dark:border-white/25 text-xs shadow-2xs outline-none" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium opacity-70 mb-1">Contact Phone *</label>
                        <input type="tel" required placeholder="e.g. 9876543210" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }} className="w-full px-3.5 py-2.5 rounded-[16px] bg-transparent border border-black/15 dark:border-white/25 text-xs font-mono shadow-2xs outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium opacity-70 mb-1">Event Date *</label>
                        <input type="date" required value={eventDate} onChange={(e) => setEventDate(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }} className="w-full px-3.5 py-2.5 rounded-[16px] bg-transparent border border-black/15 dark:border-white/25 text-xs font-mono shadow-2xs outline-none" />
                      </div>
                    </div>

                    <div className="pt-3 border-t border-black/10 dark:border-white/15 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5">
                          <MapPin className={`w-3.5 h-3.5 ${activeThemeStyle.accentText}`} /> 3. Destination Venue & Address
                        </h4>
                        <div className="flex items-center gap-1.5">
                          {['Home', 'Work'].map((type) => (
                            <button key={type} type="button" onClick={() => setAddressType(type)} className={`px-3.5 py-1.5 rounded-[12px] text-[10px] font-medium border transition shadow-2xs ${addressType === type ? `${activeThemeStyle.btn} font-semibold` : 'bg-black/5 dark:bg-white/10 border-black/15 dark:border-white/25 opacity-70'}`}>
                              {type === 'Work' ? '🏢 Work' : '🏠 Home'}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-medium opacity-70 mb-1">Postal PIN Code *</label>
                          <input type="text" required maxLength={6} placeholder="e.g. 110025" value={pincode} onChange={(e) => { const val = e.target.value.replace(/\D/g, ''); setPincode(val === '0' ? '' : val); }} onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }} className="w-full px-3.5 py-2.5 rounded-[16px] bg-transparent border border-black/15 dark:border-white/25 text-xs font-mono shadow-2xs outline-none" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium opacity-70 mb-1">Flat, House No., Building</label>
                          <input type="text" placeholder="e.g. Flat 402" value={flatHouseNo} onChange={(e) => setFlatHouseNo(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }} className="w-full px-3.5 py-2.5 rounded-[16px] bg-transparent border border-black/15 dark:border-white/25 text-xs shadow-2xs outline-none" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium opacity-70 mb-1">Street, Sector, Area, Locality *</label>
                        <input type="text" required placeholder="e.g. Jamia Nagar, Okhla" value={streetLocality} onChange={(e) => setStreetLocality(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }} className="w-full px-3.5 py-2.5 rounded-[16px] bg-transparent border border-black/15 dark:border-white/25 text-xs shadow-2xs outline-none" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium opacity-70 mb-1">Landmark (Optional)</label>
                        <input type="text" placeholder="e.g. Near Metro Gate" value={landmark} onChange={(e) => setLandmark(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }} className="w-full px-3.5 py-2.5 rounded-[16px] bg-transparent border border-black/15 dark:border-white/25 text-xs shadow-2xs outline-none" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-medium opacity-70 mb-1">State / Region *</label>
                          <select value={selectedState} onChange={(e) => { const st = e.target.value; setSelectedState(st); setState(st); setCity((ALL_INDIA_STATES_AND_CITIES[st] || ["Other Major City"])[0]); }} className="w-full px-3.5 py-2.5 rounded-[16px] bg-transparent border border-black/15 dark:border-white/25 text-xs font-medium shadow-2xs outline-none">
                            {Object.keys(ALL_INDIA_STATES_AND_CITIES).map(stName => <option key={stName} value={stName}>{stName}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium opacity-70 mb-1">Town / City *</label>
                          <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-3.5 py-2.5 rounded-[16px] bg-transparent border border-black/15 dark:border-white/25 text-xs font-medium shadow-2xs outline-none">
                            {(ALL_INDIA_STATES_AND_CITIES[selectedState] || [city]).map(cityName => <option key={cityName} value={cityName}>{cityName}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: INDEPENDENT STANDALONE TOTAL AMOUNT SUMMARY CARD */}
                <div className={`md:col-span-5 ${activeThemeStyle.card} p-5 sm:p-6 flex flex-col justify-between space-y-4 shadow-2xl`}>
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider opacity-60">Total Amount Summary</span>
                    <div className="mt-1 text-2xl sm:text-3xl font-semibold flex items-baseline gap-1">
                      <span>₹</span><span className="font-mono">{finalEstimate.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs border-t border-b border-black/10 dark:border-white/15 py-3">
                    <div className="p-3 rounded-[16px] border border-sky-500/30 bg-sky-500/10 space-y-1.5">
                      <div className="flex justify-between items-center font-bold text-sky-400">
                        <span>1. Main Makeover Package:</span>
                        <span className="font-mono">₹{mainBookingSubtotal.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between pl-1 text-[11px] opacity-80"><span>• Vanity:</span><span>{config.pricingByKit?.[calcKit]?.name}</span></div>
                      <div className="flex justify-between pl-1 text-[11px] opacity-80"><span>• Package:</span><span>{(config.kitText?.[calcKit]?.[calcPackage])?.name}</span></div>
                      <div className="flex justify-between pl-1 text-[11px] opacity-80"><span>• Package Price:</span><span className="font-mono">₹{mainPackagePrice.toLocaleString('en-IN')}</span></div>
                      <div className="flex justify-between pl-1 text-[11px] opacity-80"><span>• Travel Fee:</span><span className="font-mono">₹{zoneFee.toLocaleString('en-IN')}</span></div>
                    </div>

                    <div className="p-3 rounded-[16px] border border-purple-500/30 bg-purple-500/10 space-y-1.5">
                      <div className="flex justify-between items-center font-bold text-purple-400">
                        <span>2. Extra Guests ({familyGuests.length}):</span>
                        <span className="font-mono">₹{familyGuestsGross.toLocaleString('en-IN')}</span>
                      </div>
                      {familyGuests.length > 0 ? familyGuests.map((g, i) => {
                        const gp = config.pricingByKit[g.kit]?.[g.packageKey] || 2500;
                        return <div key={i} className="flex justify-between pl-1 text-[11px] opacity-80"><span>• Guest #{i + 1}:</span><span className="font-mono">₹{gp.toLocaleString('en-IN')}</span></div>;
                      }) : <div className="flex justify-between pl-1 text-[11px] opacity-60"><span>• No extra guests</span><span className="font-mono">₹0</span></div>}
                    </div>

                    <div className="flex justify-between items-center px-3 py-2 text-xs font-semibold rounded-[14px] bg-black/5 dark:bg-white/15">
                      <span>Total Before Discounts:</span>
                      <span className="font-mono">₹{(mainBookingSubtotal + familyGuestsGross).toLocaleString('en-IN')}</span>
                    </div>

                    <div className="p-3 rounded-[16px] border border-emerald-500/30 bg-emerald-500/10 space-y-1.5">
                      <div className="flex justify-between items-center font-bold text-emerald-400">
                        <span>3. Discounts & Offers:</span>
                        <span className="font-mono">-₹{(guestDiscountSavedAmount + couponDiscountAmount).toLocaleString('en-IN')}</span>
                      </div>
                      {guestDiscountSavedAmount > 0 && <div className="flex justify-between pl-1 text-[11px] text-emerald-400"><span>• Family Discount:</span><span className="font-mono">-₹{guestDiscountSavedAmount}</span></div>}
                      {appliedCoupon && couponDiscountAmount > 0 && <div className="flex justify-between pl-1 text-[11px] text-emerald-400"><span>• Promo Code:</span><span className="font-mono">-₹{couponDiscountAmount}</span></div>}
                      {guestDiscountSavedAmount === 0 && (!appliedCoupon || couponDiscountAmount === 0) && <div className="flex justify-between pl-1 text-[11px] opacity-60"><span>• No discounts</span><span className="font-mono">₹0</span></div>}
                    </div>
                  </div>

                  <button type="submit" disabled={isSubmitting} className={`w-full py-3.5 ${activeThemeStyle.btn} font-medium text-xs rounded-[16px] shadow-md active:scale-[0.98] transition flex items-center justify-center gap-1.5`}>
                    <Check className="w-3.5 h-3.5" /> <span>{isSubmitting ? 'Recording Booking...' : 'Confirm & Send Booking Request'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className={`${activeThemeStyle.card} p-6 sm:p-7 rounded-[32px] max-w-xl mx-auto space-y-5 shadow-2xl`}>
            <div className="text-center space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider opacity-60">Client Experience</span>
              <h3 className="text-lg font-semibold">Feedback & Suggestions</h3>
              <p className="text-xs opacity-70">Help us enhance your vanity experience by sharing your thoughts.</p>
            </div>
            {feedbackSubmitted ? (
              <div className="p-6 rounded-[24px] bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2 shadow-2xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <h4 className="font-semibold text-sm text-emerald-400">Thank you for your valuable feedback!</h4>
                <p className="text-xs opacity-70">Your suggestion has been securely submitted.</p>
                <button onClick={() => setFeedbackSubmitted(false)} className="mt-3 px-4 py-2.5 rounded-[16px] bg-black/5 dark:bg-white/10 hover:bg-white/15 text-xs font-medium transition">Submit Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmitFeedback} className="space-y-4">
                <div className="flex justify-center gap-1.5 py-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} type="button" onClick={() => setFeedbackRating(star)} className={`p-1 transition ${star <= feedbackRating ? 'text-amber-400' : 'opacity-20 hover:opacity-100 hover:text-amber-400'}`}>
                      <Star className={`w-6 h-6 ${star <= feedbackRating ? 'fill-amber-400' : ''}`} />
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="text" placeholder="Your Name" value={feedbackName} onChange={e => setFeedbackName(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }} className="w-full px-3.5 py-2.5 rounded-[16px] bg-transparent border border-black/15 dark:border-white/25 text-xs shadow-2xs outline-none" />
                  <input type="tel" placeholder="Phone Number" value={feedbackPhone} onChange={e => setFeedbackPhone(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }} className="w-full px-3.5 py-2.5 rounded-[16px] bg-transparent border border-black/15 dark:border-white/25 text-xs font-mono shadow-2xs outline-none" />
                </div>
                <textarea rows={4} required placeholder="Share your suggestion..." value={feedbackMessage} onChange={e => setFeedbackMessage(e.target.value)} className="w-full p-3.5 rounded-[16px] bg-transparent border border-black/15 dark:border-white/25 text-xs shadow-2xs outline-none" />
                <button type="submit" disabled={isSubmittingFeedback} className={`w-full py-3 ${activeThemeStyle.btn} font-medium text-xs rounded-[16px] shadow-md active:scale-[0.98] transition flex items-center justify-center gap-1.5`}>
                  <Send className="w-3.5 h-3.5" /> <span>{isSubmittingFeedback ? 'Submitting...' : 'Send Feedback'}</span>
                </button>
              </form>
            )}
          </div>
        )}
      </main>

      {config.toggles?.enableFloatingBanner !== false && config.floatingBanner?.enabled !== false && showFloatingBanner && !shouldHideFloatingDueToExpiry && (
        <aside aria-label="Promotional offer" className={`hf-floating-banner ${activeThemeStyle.card} p-4 rounded-[24px] shadow-2xl transition-all`}>
          <div className="flex items-start justify-between gap-3">
            <Gift className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase px-2 py-0.5 rounded-[10px] font-mono">{config.floatingBanner?.tag || "SPECIAL OFFER"}</span>
                {isFloatingExpired ? <span className="text-[10px] font-mono bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded-[10px]">Expired</span> : floatingTimer ? <span className="text-[10px] font-mono opacity-70 px-2 py-0.5 rounded-[10px]">{floatingTimer.text}</span> : null}
              </div>
              <h4 className="font-semibold text-xs mt-1.5">{config.floatingBanner?.title || "Limited Wedding Season Discount"}</h4>
              <p className="text-[11px] mt-0.5 opacity-70 font-normal">{isFloatingExpired ? <span className="text-rose-500">Ended.</span> : <>Use code <span className="font-mono font-semibold">{floatingPromoCode}</span></>}</p>
            </div>
            <button onClick={() => setShowFloatingBanner(false)} className="opacity-60 hover:opacity-100 p-1 shrink-0"><X className="w-4 h-4" /></button>
          </div>
          <button disabled={isFloatingExpired} onClick={() => { if (!isFloatingExpired) { handleApplyCoupon(null, floatingPromoCode); setActiveTab('calculator'); } }} className={`mt-3 w-full py-2.5 text-xs font-medium rounded-[16px] transition shadow-sm ${isFloatingExpired ? 'bg-black/5 opacity-50 cursor-not-allowed' : `${activeThemeStyle.btn} active:scale-[0.98]`}`}>
            {isFloatingExpired ? "Offer Expired" : (config.floatingBanner?.actionText || "Apply")}
          </button>
        </aside>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppErrorBoundary>
      <MainAppContent />
    </AppErrorBoundary>
  );
}
