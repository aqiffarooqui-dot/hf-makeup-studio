import React, { useState, useEffect, useRef, Component } from 'react';
import { 
  Sparkles, Calendar as CalendarIcon, MapPin, Check, Calculator, Crown, ChevronRight, 
  ShieldCheck, Star, Car, CheckCircle2, PackageCheck, Tag, Gift, X, 
  Volume2, Sun, Moon, Send, Percent, Camera, Award, Heart, Download, Image as ImageIcon,
  Play, Film, ExternalLink, User, Flame, ArrowRight, Eye, Info, Activity, Clock, AlertCircle,
  Receipt, FileText, Hash, Wrench, ShieldAlert, Users, Plus, Trash2, MessageSquare, Share2, QrCode, Copy, CheckCheck, RefreshCw,
  Home, Building2, Navigation, Compass, Zap, Droplet, ZoomIn, ZoomOut, RotateCcw
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
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 text-center">
          <div className="max-w-md w-full bg-slate-900/90 backdrop-blur-[50px] border border-white/20 p-6 sm:p-8 rounded-[28px] sm:rounded-[36px] space-y-4 shadow-[0_32px_80px_rgba(0,0,0,0.7)]">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-[20px] bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-400/40 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              <ShieldAlert className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-white">System Safe Mode Active</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              We encountered a minor display update glitch. Our automated system has protected your session.
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="w-full py-3 sm:py-3.5 rounded-full hf-lens-btn text-white font-bold text-xs sm:text-sm transition-all duration-300 active:scale-[0.98]"
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
  { type: "image", title: "Royal Asian Bridal", sub: "Prestige HD Artistry", url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1600&auto=format&fit=crop&q=95" },
  { type: "video", title: "Dewy Glow Finishing", sub: "16HR Stay Artistry", url: "https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-woman-applying-makeup-41419-large.mp4" },
  { type: "image", title: "Engagement Glow", sub: "Dewy Glass Finish", url: "https://images.unsplash.com/photo-1594465919760-441fe5908ab0?w=1600&auto=format&fit=crop&q=95" },
  { type: "video", title: "Cocktail Reception Glam", sub: "Smokey Eyes & Bold Lips", url: "https://assets.mixkit.co/videos/preview/mixkit-woman-putting-on-makeup-41418-large.mp4" }
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

const THEME_STYLES = {
  admin_aurora: {
    night: {
      bg: "bg-[#06070b] text-[#FFFFFF]",
      card: "bg-purple-950/20 backdrop-blur-[40px] border border-purple-400/35 shadow-[0_24px_60px_rgba(168,85,247,0.18),inset_0_1.5px_2px_rgba(255,255,255,0.25)] rounded-[28px] sm:rounded-[32px]",
      innerCard: "bg-purple-900/20 backdrop-blur-[30px] border border-purple-400/30 shadow-inner",
      headingColor: "text-purple-300 drop-shadow-[0_2px_10px_rgba(168,85,247,0.4)]",
      tabActiveText: "text-purple-300 drop-shadow-[0_0_12px_rgba(168,85,247,0.9)]",
      accent: "text-purple-400",
      accentText: "text-purple-300 font-extrabold",
      pillBorder: "border border-purple-400/40 bg-purple-500/15 text-purple-200 backdrop-blur-[30px]",
      btnPrimary: "bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white font-black shadow-[0_10px_25px_rgba(236,72,153,0.45)] hover:shadow-[0_14px_30px_rgba(236,72,153,0.6)] rounded-full",
      inputBg: "bg-black/30 backdrop-blur-[30px] border border-purple-400/35 text-white placeholder-slate-400 focus:border-purple-300 focus:bg-black/50",
      glowOrb1: "radial-gradient(circle, rgba(168, 85, 247, 0.45) 0%, rgba(168, 85, 247, 0) 70%)",
      glowOrb2: "radial-gradient(circle, rgba(236, 72, 153, 0.38) 0%, rgba(236, 72, 153, 0) 70%)"
    },
    day: {
      bg: "bg-[#faf5ff] text-[#1e1b4b]",
      card: "bg-white/20 backdrop-blur-[40px] border border-purple-300/60 shadow-[0_24px_60px_rgba(168,85,247,0.12),inset_0_2px_4px_rgba(255,255,255,0.9)] rounded-[28px] sm:rounded-[32px]",
      innerCard: "bg-white/25 backdrop-blur-[30px] border border-purple-200/60 shadow-sm",
      headingColor: "text-purple-950 font-black drop-shadow-sm",
      tabActiveText: "text-purple-900 font-black drop-shadow-[0_0_10px_rgba(168,85,247,0.6)]",
      accent: "text-purple-700 font-bold",
      accentText: "text-purple-700 font-black",
      pillBorder: "border border-purple-400/70 bg-white/30 text-purple-950 font-black shadow-sm backdrop-blur-[30px]",
      btnPrimary: "bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white font-black shadow-[0_10px_25px_rgba(168,85,247,0.45)] active:scale-[0.98] rounded-full",
      inputBg: "bg-white/30 backdrop-blur-[30px] border border-purple-300/60 text-purple-950 placeholder-purple-400 focus:border-purple-600 focus:bg-white/50 shadow-inner font-medium",
      glowOrb1: "radial-gradient(circle, rgba(168, 85, 247, 0.35) 0%, rgba(168, 85, 247, 0) 70%)",
      glowOrb2: "radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, rgba(236, 72, 153, 0) 70%)"
    }
  },
  sunset_glow: {
    night: {
      bg: "bg-[#080605] text-[#FFFFFF]",
      card: "bg-amber-950/20 backdrop-blur-[40px] border border-amber-400/35 shadow-[0_24px_60px_rgba(245,158,11,0.18),inset_0_1.5px_2px_rgba(255,255,255,0.25)] rounded-[28px] sm:rounded-[32px]",
      innerCard: "bg-amber-900/20 backdrop-blur-[30px] border border-amber-400/30 shadow-inner",
      headingColor: "text-amber-300 drop-shadow-[0_2px_10px_rgba(245,158,11,0.4)]",
      tabActiveText: "text-amber-300 drop-shadow-[0_0_12px_rgba(245,158,11,0.9)]",
      accent: "text-amber-400",
      accentText: "text-amber-300 font-extrabold",
      pillBorder: "border border-amber-400/40 bg-amber-500/15 text-amber-200 backdrop-blur-[30px]",
      btnPrimary: "bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 text-white font-black shadow-[0_10px_25px_rgba(244,63,94,0.45)] hover:shadow-[0_14px_30px_rgba(244,63,94,0.6)] rounded-full",
      inputBg: "bg-black/30 backdrop-blur-[30px] border border-amber-400/35 text-white placeholder-slate-400 focus:border-amber-300 focus:bg-black/50",
      glowOrb1: "radial-gradient(circle, rgba(245, 158, 11, 0.45) 0%, rgba(245, 158, 11, 0) 70%)",
      glowOrb2: "radial-gradient(circle, rgba(244, 63, 94, 0.38) 0%, rgba(244, 63, 94, 0) 70%)"
    },
    day: {
      bg: "bg-[#fffbeb] text-[#451a03]",
      card: "bg-white/20 backdrop-blur-[40px] border border-amber-300/60 shadow-[0_24px_60px_rgba(245,158,11,0.12),inset_0_2px_4px_rgba(255,255,255,0.9)] rounded-[28px] sm:rounded-[32px]",
      innerCard: "bg-white/25 backdrop-blur-[30px] border border-amber-200/60 shadow-sm",
      headingColor: "text-amber-950 font-black drop-shadow-sm",
      tabActiveText: "text-amber-900 font-black drop-shadow-[0_0_10px_rgba(245,158,11,0.6)]",
      accent: "text-amber-700 font-bold",
      accentText: "text-amber-700 font-black",
      pillBorder: "border border-amber-400/70 bg-white/30 text-amber-950 font-black shadow-sm backdrop-blur-[30px]",
      btnPrimary: "bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 text-white font-black shadow-[0_10px_25px_rgba(245,158,11,0.45)] active:scale-[0.98] rounded-full",
      inputBg: "bg-white/30 backdrop-blur-[30px] border border-amber-300/60 text-amber-950 placeholder-amber-400 focus:border-amber-600 focus:bg-white/50 shadow-inner font-medium",
      glowOrb1: "radial-gradient(circle, rgba(245, 158, 11, 0.35) 0%, rgba(245, 158, 11, 0) 70%)",
      glowOrb2: "radial-gradient(circle, rgba(244, 63, 94, 0.3) 0%, rgba(244, 63, 94, 0) 70%)"
    }
  },
  cyber_matrix: {
    night: {
      bg: "bg-[#020808] text-[#FFFFFF]",
      card: "bg-cyan-950/20 backdrop-blur-[40px] border border-cyan-400/35 shadow-[0_24px_60px_rgba(6,182,212,0.18),inset_0_1.5px_2px_rgba(255,255,255,0.25)] rounded-[28px] sm:rounded-[32px]",
      innerCard: "bg-cyan-900/20 backdrop-blur-[30px] border border-cyan-400/30 shadow-inner",
      headingColor: "text-cyan-300 drop-shadow-[0_2px_10px_rgba(6,182,212,0.4)]",
      tabActiveText: "text-cyan-300 drop-shadow-[0_0_12px_rgba(6,182,212,0.9)]",
      accent: "text-cyan-400",
      accentText: "text-cyan-300 font-extrabold",
      pillBorder: "border border-cyan-400/40 bg-cyan-500/15 text-cyan-200 backdrop-blur-[30px]",
      btnPrimary: "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-neutral-950 font-black shadow-[0_10px_25px_rgba(6,182,212,0.45)] hover:shadow-[0_14px_30px_rgba(6,182,212,0.6)] rounded-full",
      inputBg: "bg-black/30 backdrop-blur-[30px] border border-cyan-400/35 text-white placeholder-slate-400 focus:border-cyan-300 focus:bg-black/50",
      glowOrb1: "radial-gradient(circle, rgba(6, 182, 212, 0.45) 0%, rgba(6, 182, 212, 0) 70%)",
      glowOrb2: "radial-gradient(circle, rgba(16, 185, 129, 0.38) 0%, rgba(16, 185, 129, 0) 70%)"
    },
    day: {
      bg: "bg-[#ecfeff] text-[#083344]",
      card: "bg-white/20 backdrop-blur-[40px] border border-cyan-300/60 shadow-[0_24px_60px_rgba(6,182,212,0.12),inset_0_2px_4px_rgba(255,255,255,0.9)] rounded-[28px] sm:rounded-[32px]",
      innerCard: "bg-white/25 backdrop-blur-[30px] border border-cyan-200/60 shadow-sm",
      headingColor: "text-cyan-950 font-black drop-shadow-sm",
      tabActiveText: "text-cyan-900 font-black drop-shadow-[0_0_10px_rgba(6,182,212,0.6)]",
      accent: "text-cyan-700 font-bold",
      accentText: "text-cyan-700 font-black",
      pillBorder: "border border-cyan-400/70 bg-white/30 text-cyan-950 font-black shadow-sm backdrop-blur-[30px]",
      btnPrimary: "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-neutral-950 font-black shadow-[0_10px_25px_rgba(6,182,212,0.45)] active:scale-[0.98] rounded-full",
      inputBg: "bg-white/30 backdrop-blur-[30px] border border-cyan-300/60 text-cyan-950 placeholder-cyan-400 focus:border-cyan-600 focus:bg-white/50 shadow-inner font-medium",
      glowOrb1: "radial-gradient(circle, rgba(6, 182, 212, 0.35) 0%, rgba(6, 182, 212, 0) 70%)",
      glowOrb2: "radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, rgba(16, 185, 129, 0) 70%)"
    }
  },
  real_glass_lens: {
    night: {
      bg: "bg-[#06080e] text-[#FFFFFF]",
      card: "bg-blue-950/20 backdrop-blur-[40px] border border-blue-400/35 shadow-[0_24px_60px_rgba(0,122,255,0.18),inset_0_1.5px_2px_rgba(255,255,255,0.25)] rounded-[28px] sm:rounded-[32px]",
      innerCard: "bg-blue-900/20 backdrop-blur-[30px] border border-blue-400/30 shadow-inner",
      headingColor: "text-sky-300 drop-shadow-[0_2px_10px_rgba(56,189,248,0.4)]",
      tabActiveText: "text-sky-300 drop-shadow-[0_0_12px_rgba(56,189,248,0.9)]",
      accent: "text-sky-400",
      accentText: "text-sky-300 font-extrabold",
      pillBorder: "border border-blue-400/40 bg-blue-500/15 text-blue-200 backdrop-blur-[30px]",
      btnPrimary: "bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 hover:from-blue-500 hover:to-indigo-500 text-white font-black shadow-[0_10px_25px_rgba(0,122,255,0.45)] hover:shadow-[0_14px_30px_rgba(0,122,255,0.6)] rounded-full",
      inputBg: "bg-black/30 backdrop-blur-[30px] border border-blue-400/35 text-white placeholder-slate-400 focus:border-sky-300 focus:bg-black/50",
      glowOrb1: "radial-gradient(circle, rgba(0, 122, 255, 0.45) 0%, rgba(0, 122, 255, 0) 70%)",
      glowOrb2: "radial-gradient(circle, rgba(99, 102, 241, 0.38) 0%, rgba(99, 102, 241, 0) 70%)"
    },
    day: {
      bg: "bg-[#eff6ff] text-[#1e3a8a]",
      card: "bg-white/20 backdrop-blur-[40px] border border-blue-300/60 shadow-[0_24px_60px_rgba(0,122,255,0.12),inset_0_2px_4px_rgba(255,255,255,0.9)] rounded-[28px] sm:rounded-[32px]",
      innerCard: "bg-white/25 backdrop-blur-[30px] border border-blue-200/60 shadow-sm",
      headingColor: "text-blue-950 font-black drop-shadow-sm",
      tabActiveText: "text-blue-900 font-black drop-shadow-[0_0_10px_rgba(0,122,255,0.6)]",
      accent: "text-blue-700 font-bold",
      accentText: "text-blue-700 font-black",
      pillBorder: "border border-blue-400/70 bg-white/30 text-blue-950 font-black shadow-sm backdrop-blur-[30px]",
      btnPrimary: "bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 text-white font-black shadow-[0_10px_25px_rgba(0,122,255,0.45)] active:scale-[0.98] rounded-full",
      inputBg: "bg-white/30 backdrop-blur-[30px] border border-blue-300/60 text-blue-950 placeholder-blue-400 focus:border-blue-600 focus:bg-white/50 shadow-inner font-medium",
      glowOrb1: "radial-gradient(circle, rgba(0, 122, 255, 0.35) 0%, rgba(0, 122, 255, 0) 70%)",
      glowOrb2: "radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, rgba(99, 102, 241, 0) 70%)"
    }
  },
  real_ios_glass: {
    night: {
      bg: "bg-[#06070a] text-[#FFFFFF]",
      card: "bg-zinc-900/30 backdrop-blur-[40px] border border-white/25 shadow-[0_24px_60px_rgba(0,0,0,0.6),inset_0_1.5px_2px_rgba(255,255,255,0.35)] rounded-[28px] sm:rounded-[36px]",
      innerCard: "bg-white/[0.06] backdrop-blur-[30px] border border-white/20 shadow-inner",
      headingColor: "text-sky-300 drop-shadow-[0_2px_10px_rgba(56,189,248,0.4)]",
      tabActiveText: "text-sky-300 drop-shadow-[0_0_12px_rgba(56,189,248,0.9)]",
      accent: "text-sky-400",
      accentText: "text-sky-300 font-extrabold",
      pillBorder: "border border-sky-400/40 bg-sky-500/15 text-sky-200 backdrop-blur-[30px]",
      btnPrimary: "bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 text-white font-black shadow-[0_10px_25px_rgba(37,99,235,0.45)] hover:shadow-[0_14px_30px_rgba(37,99,235,0.6)] rounded-full",
      inputBg: "bg-black/30 backdrop-blur-[30px] border border-white/25 text-white placeholder-slate-400 focus:border-sky-300 focus:bg-black/50",
      glowOrb1: "radial-gradient(circle, rgba(56, 189, 248, 0.42) 0%, rgba(56, 189, 248, 0) 70%)",
      glowOrb2: "radial-gradient(circle, rgba(99, 102, 241, 0.35) 0%, rgba(99, 102, 241, 0) 70%)"
    },
    day: {
      bg: "bg-[#f8fafc] text-[#0f172a]",
      card: "bg-white/20 backdrop-blur-[40px] border border-slate-300/60 shadow-[0_24px_60px_rgba(15,23,42,0.1),inset_0_2px_4px_rgba(255,255,255,0.9)] rounded-[28px] sm:rounded-[36px]",
      innerCard: "bg-white/25 backdrop-blur-[30px] border border-slate-200/60 shadow-sm",
      headingColor: "text-slate-950 font-black drop-shadow-sm",
      tabActiveText: "text-sky-900 font-black drop-shadow-[0_0_10px_rgba(56,189,248,0.6)]",
      accent: "text-sky-700 font-bold",
      accentText: "text-sky-700 font-black",
      pillBorder: "border border-slate-400/70 bg-white/30 text-slate-950 font-black shadow-sm backdrop-blur-[30px]",
      btnPrimary: "bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 text-white font-black shadow-[0_10px_25px_rgba(37,99,235,0.45)] active:scale-[0.98] rounded-full",
      inputBg: "bg-white/30 backdrop-blur-[30px] border border-slate-300/60 text-slate-950 placeholder-slate-400 focus:border-sky-600 focus:bg-white/50 shadow-inner font-medium",
      glowOrb1: "radial-gradient(circle, rgba(56, 189, 248, 0.35) 0%, rgba(56, 189, 248, 0) 70%)",
      glowOrb2: "radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, rgba(99, 102, 241, 0) 70%)"
    }
  },
  liquid_glass: {
    night: {
      bg: "bg-[#030610] text-[#FFFFFF]",
      card: "bg-sky-950/20 backdrop-blur-[40px] border border-cyan-400/35 shadow-[0_24px_60px_rgba(6,182,212,0.18),inset_0_1.5px_2px_rgba(255,255,255,0.25)] rounded-[28px] sm:rounded-[32px]",
      innerCard: "bg-sky-900/20 backdrop-blur-[30px] border border-cyan-400/30 shadow-inner",
      headingColor: "text-cyan-300 drop-shadow-[0_2px_10px_rgba(6,182,212,0.4)]",
      tabActiveText: "text-cyan-300 drop-shadow-[0_0_12px_rgba(6,182,212,0.9)]",
      accent: "text-cyan-400",
      accentText: "text-cyan-300 font-extrabold",
      pillBorder: "border border-cyan-400/40 bg-cyan-500/15 text-cyan-200 backdrop-blur-[30px]",
      btnPrimary: "bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 text-white font-black shadow-[0_10px_25px_rgba(6,182,212,0.45)] hover:shadow-[0_14px_30px_rgba(6,182,212,0.6)] rounded-full",
      inputBg: "bg-black/30 backdrop-blur-[30px] border border-cyan-400/35 text-white placeholder-slate-400 focus:border-cyan-300 focus:bg-black/50",
      glowOrb1: "radial-gradient(circle, rgba(6, 182, 212, 0.45) 0%, rgba(6, 182, 212, 0) 70%)",
      glowOrb2: "radial-gradient(circle, rgba(37, 99, 235, 0.38) 0%, rgba(37, 99, 235, 0) 70%)"
    },
    day: {
      bg: "bg-[#f0f9ff] text-[#0c4a6e]",
      card: "bg-white/20 backdrop-blur-[40px] border border-cyan-300/60 shadow-[0_24px_60px_rgba(6,182,212,0.12),inset_0_2px_4px_rgba(255,255,255,0.9)] rounded-[28px] sm:rounded-[32px]",
      innerCard: "bg-white/25 backdrop-blur-[30px] border border-cyan-200/60 shadow-sm",
      headingColor: "text-cyan-950 font-black drop-shadow-sm",
      tabActiveText: "text-cyan-900 font-black drop-shadow-[0_0_10px_rgba(6,182,212,0.6)]",
      accent: "text-cyan-700 font-bold",
      accentText: "text-cyan-700 font-black",
      pillBorder: "border border-cyan-400/70 bg-white/30 text-cyan-950 font-black shadow-sm backdrop-blur-[30px]",
      btnPrimary: "bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 text-white font-black shadow-[0_10px_25px_rgba(6,182,212,0.45)] active:scale-[0.98] rounded-full",
      inputBg: "bg-white/30 backdrop-blur-[30px] border border-cyan-300/60 text-cyan-950 placeholder-cyan-400 focus:border-cyan-600 focus:bg-white/50 shadow-inner font-medium",
      glowOrb1: "radial-gradient(circle, rgba(6, 182, 212, 0.35) 0%, rgba(6, 182, 212, 0) 70%)",
      glowOrb2: "radial-gradient(circle, rgba(37, 99, 235, 0.3) 0%, rgba(37, 99, 235, 0) 70%)"
    }
  },
  one_ui_9: {
    night: {
      bg: "bg-[#08080a] text-[#FFFFFF]",
      card: "bg-zinc-900/35 backdrop-blur-[40px] border border-zinc-500/40 shadow-[0_24px_60px_rgba(0,0,0,0.6),inset_0_1.5px_2px_rgba(255,255,255,0.25)] rounded-[28px] sm:rounded-[30px]",
      innerCard: "bg-zinc-800/25 backdrop-blur-[30px] border border-zinc-500/35 shadow-inner",
      headingColor: "text-violet-300 drop-shadow-[0_2px_10px_rgba(139,92,246,0.4)]",
      tabActiveText: "text-violet-300 drop-shadow-[0_0_12px_rgba(139,92,246,0.9)]",
      accent: "text-violet-400",
      accentText: "text-violet-300 font-extrabold",
      pillBorder: "border border-violet-400/40 bg-violet-500/15 text-violet-200 backdrop-blur-[30px]",
      btnPrimary: "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-black shadow-[0_10px_25px_rgba(139,92,246,0.45)] rounded-full",
      inputBg: "bg-black/30 backdrop-blur-[30px] border border-zinc-500/40 text-white placeholder-slate-400 focus:border-violet-300 focus:bg-black/50",
      glowOrb1: "radial-gradient(circle, rgba(139, 92, 246, 0.42) 0%, rgba(139, 92, 246, 0) 70%)",
      glowOrb2: "radial-gradient(circle, rgba(168, 85, 247, 0.32) 0%, rgba(168, 85, 247, 0) 70%)"
    },
    day: {
      bg: "bg-[#f5f3ff] text-[#2e1065]",
      card: "bg-white/20 backdrop-blur-[40px] border border-violet-300/60 shadow-[0_24px_60px_rgba(139,92,246,0.12),inset_0_2px_4px_rgba(255,255,255,0.9)] rounded-[28px] sm:rounded-[30px]",
      innerCard: "bg-white/25 backdrop-blur-[30px] border border-violet-200/60 shadow-sm",
      headingColor: "text-violet-950 font-black drop-shadow-sm",
      tabActiveText: "text-violet-900 font-black drop-shadow-[0_0_10px_rgba(139,92,246,0.6)]",
      accent: "text-violet-700 font-bold",
      accentText: "text-violet-700 font-black",
      pillBorder: "border border-violet-400/70 bg-white/30 text-violet-950 font-black shadow-sm backdrop-blur-[30px]",
      btnPrimary: "bg-gradient-to-r from-violet-600 to-purple-600 text-white font-black shadow-[0_10px_25px_rgba(139,92,246,0.45)] active:scale-[0.98] rounded-full",
      inputBg: "bg-white/30 backdrop-blur-[30px] border border-violet-300/60 text-violet-950 placeholder-violet-400 focus:border-violet-600 focus:bg-white/50 shadow-inner font-medium",
      glowOrb1: "radial-gradient(circle, rgba(139, 92, 246, 0.35) 0%, rgba(139, 92, 246, 0) 70%)",
      glowOrb2: "radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, rgba(168, 85, 247, 0) 70%)"
    }
  },
  gold_rose: {
    night: {
      bg: "bg-[#0a0506] text-[#FFFFFF]",
      card: "bg-rose-950/20 backdrop-blur-[40px] border border-amber-400/35 shadow-[0_24px_60px_rgba(244,63,94,0.18),inset_0_1.5px_2px_rgba(255,255,255,0.25)] rounded-[28px] sm:rounded-[32px]",
      innerCard: "bg-rose-900/20 backdrop-blur-[30px] border border-amber-400/30 shadow-inner",
      headingColor: "text-rose-300 drop-shadow-[0_2px_10px_rgba(244,63,94,0.4)]",
      tabActiveText: "text-rose-300 drop-shadow-[0_0_12px_rgba(244,63,94,0.9)]",
      accent: "text-amber-400",
      accentText: "text-amber-300 font-extrabold",
      pillBorder: "border border-rose-400/40 bg-rose-500/15 text-rose-200 backdrop-blur-[30px]",
      btnPrimary: "bg-gradient-to-r from-amber-500 via-rose-500 to-pink-600 text-white font-black shadow-[0_10px_25px_rgba(244,63,94,0.45)] hover:shadow-[0_14px_30px_rgba(244,63,94,0.6)] rounded-full",
      inputBg: "bg-black/30 backdrop-blur-[30px] border border-rose-400/35 text-white placeholder-slate-400 focus:border-rose-300 focus:bg-black/50",
      glowOrb1: "radial-gradient(circle, rgba(245, 158, 11, 0.45) 0%, rgba(245, 158, 11, 0) 70%)",
      glowOrb2: "radial-gradient(circle, rgba(244, 63, 94, 0.38) 0%, rgba(244, 63, 94, 0) 70%)"
    },
    day: {
      bg: "bg-[#fff1f2] text-[#4c0519]",
      card: "bg-white/20 backdrop-blur-[40px] border border-rose-300/60 shadow-[0_24px_60px_rgba(244,63,94,0.12),inset_0_2px_4px_rgba(255,255,255,0.9)] rounded-[28px] sm:rounded-[32px]",
      innerCard: "bg-white/25 backdrop-blur-[30px] border border-rose-200/60 shadow-sm",
      headingColor: "text-rose-950 font-black drop-shadow-sm",
      tabActiveText: "text-rose-900 font-black drop-shadow-[0_0_10px_rgba(244,63,94,0.6)]",
      accent: "text-rose-700 font-bold",
      accentText: "text-rose-700 font-black",
      pillBorder: "border border-rose-400/70 bg-white/30 text-rose-950 font-black shadow-sm backdrop-blur-[30px]",
      btnPrimary: "bg-gradient-to-r from-amber-500 via-rose-500 to-pink-600 text-white font-black shadow-[0_10px_25px_rgba(244,63,94,0.45)] active:scale-[0.98] rounded-full",
      inputBg: "bg-white/30 backdrop-blur-[30px] border border-rose-300/60 text-rose-950 placeholder-rose-400 focus:border-rose-600 focus:bg-white/50 shadow-inner font-medium",
      glowOrb1: "radial-gradient(circle, rgba(245, 158, 11, 0.35) 0%, rgba(245, 158, 11, 0) 70%)",
      glowOrb2: "radial-gradient(circle, rgba(244, 63, 94, 0.3) 0%, rgba(244, 63, 94, 0) 70%)"
    }
  },
  champagne: {
    night: {
      bg: "bg-[#0a0604] text-[#FFFFFF]",
      card: "bg-orange-950/20 backdrop-blur-[40px] border border-orange-400/35 shadow-[0_24px_60px_rgba(249,115,22,0.18),inset_0_1.5px_2px_rgba(255,255,255,0.25)] rounded-[28px] sm:rounded-[32px]",
      innerCard: "bg-orange-900/20 backdrop-blur-[30px] border border-orange-400/30 shadow-inner",
      headingColor: "text-amber-300 drop-shadow-[0_2px_10px_rgba(245,158,11,0.4)]",
      tabActiveText: "text-amber-300 drop-shadow-[0_0_12px_rgba(245,158,11,0.9)]",
      accent: "text-amber-400",
      accentText: "text-amber-300 font-extrabold",
      pillBorder: "border border-orange-400/40 bg-orange-500/15 text-orange-200 backdrop-blur-[30px]",
      btnPrimary: "bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-neutral-950 font-black shadow-[0_10px_25px_rgba(249,115,22,0.45)] hover:shadow-[0_14px_30px_rgba(249,115,22,0.6)] rounded-full",
      inputBg: "bg-black/30 backdrop-blur-[30px] border border-orange-400/35 text-white placeholder-slate-400 focus:border-amber-300 focus:bg-black/50",
      glowOrb1: "radial-gradient(circle, rgba(245, 158, 11, 0.45) 0%, rgba(245, 158, 11, 0) 70%)",
      glowOrb2: "radial-gradient(circle, rgba(249, 115, 22, 0.35) 0%, rgba(249, 115, 22, 0) 70%)"
    },
    day: {
      bg: "bg-[#fff7ed] text-[#431407]",
      card: "bg-white/20 backdrop-blur-[40px] border border-orange-300/60 shadow-[0_24px_60px_rgba(249,115,22,0.12),inset_0_2px_4px_rgba(255,255,255,0.9)] rounded-[28px] sm:rounded-[32px]",
      innerCard: "bg-white/25 backdrop-blur-[30px] border border-orange-200/60 shadow-sm",
      headingColor: "text-orange-950 font-black drop-shadow-sm",
      tabActiveText: "text-orange-900 font-black drop-shadow-[0_0_10px_rgba(249,115,22,0.6)]",
      accent: "text-orange-700 font-bold",
      accentText: "text-orange-700 font-black",
      pillBorder: "border border-orange-400/70 bg-white/30 text-orange-950 font-black shadow-sm backdrop-blur-[30px]",
      btnPrimary: "bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-neutral-950 font-black shadow-[0_10px_25px_rgba(249,115,22,0.45)] active:scale-[0.98] rounded-full",
      inputBg: "bg-white/30 backdrop-blur-[30px] border border-orange-300/60 text-orange-950 placeholder-orange-400 focus:border-orange-600 focus:bg-white/50 shadow-inner font-medium",
      glowOrb1: "radial-gradient(circle, rgba(245, 158, 11, 0.35) 0%, rgba(245, 158, 11, 0) 70%)",
      glowOrb2: "radial-gradient(circle, rgba(249, 115, 22, 0.3) 0%, rgba(249, 115, 22, 0) 70%)"
    }
  },
  emerald: {
    night: {
      bg: "bg-[#030907] text-[#FFFFFF]",
      card: "bg-emerald-950/20 backdrop-blur-[40px] border border-emerald-400/35 shadow-[0_24px_60px_rgba(16,185,129,0.18),inset_0_1.5px_2px_rgba(255,255,255,0.25)] rounded-[28px] sm:rounded-[32px]",
      innerCard: "bg-emerald-900/20 backdrop-blur-[30px] border border-emerald-400/30 shadow-inner",
      headingColor: "text-emerald-300 drop-shadow-[0_2px_10px_rgba(168,85,247,0.4)]",
      tabActiveText: "text-emerald-300 drop-shadow-[0_0_12px_rgba(16,185,129,0.9)]",
      accent: "text-emerald-400",
      accentText: "text-emerald-300 font-extrabold",
      pillBorder: "border border-emerald-400/40 bg-emerald-500/15 text-emerald-200 backdrop-blur-[30px]",
      btnPrimary: "bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 text-white font-black shadow-[0_10px_25px_rgba(16,185,129,0.45)] hover:shadow-[0_14px_30px_rgba(16,185,129,0.6)] rounded-full",
      inputBg: "bg-black/30 backdrop-blur-[30px] border border-emerald-400/35 text-white placeholder-slate-400 focus:border-emerald-300 focus:bg-black/50",
      glowOrb1: "radial-gradient(circle, rgba(16, 185, 129, 0.45) 0%, rgba(16, 185, 129, 0) 70%)",
      glowOrb2: "radial-gradient(circle, rgba(20, 184, 166, 0.35) 0%, rgba(20, 184, 166, 0) 70%)"
    },
    day: {
      bg: "bg-[#ecfdf5] text-[#064e3b]",
      card: "bg-white/20 backdrop-blur-[40px] border border-emerald-300/60 shadow-[0_24px_60px_rgba(16,185,129,0.12),inset_0_2px_4px_rgba(255,255,255,0.9)] rounded-[28px] sm:rounded-[32px]",
      innerCard: "bg-white/25 backdrop-blur-[30px] border border-emerald-200/60 shadow-sm",
      headingColor: "text-emerald-950 font-black drop-shadow-sm",
      tabActiveText: "text-emerald-900 font-black drop-shadow-[0_0_10px_rgba(16,185,129,0.6)]",
      accent: "text-emerald-700 font-bold",
      accentText: "text-emerald-700 font-black",
      pillBorder: "border border-emerald-400/70 bg-white/30 text-emerald-950 font-black shadow-sm backdrop-blur-[30px]",
      btnPrimary: "bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 text-white font-black shadow-[0_10px_25px_rgba(16,185,129,0.45)] active:scale-[0.98] rounded-full",
      inputBg: "bg-white/30 backdrop-blur-[30px] border border-emerald-300/60 text-emerald-950 placeholder-emerald-400 focus:border-emerald-600 focus:bg-white/50 shadow-inner font-medium",
      glowOrb1: "radial-gradient(circle, rgba(16, 185, 129, 0.35) 0%, rgba(16, 185, 129, 0) 70%)",
      glowOrb2: "radial-gradient(circle, rgba(20, 184, 166, 0.3) 0%, rgba(20, 184, 166, 0) 70%)"
    }
  },
  violet: {
    night: {
      bg: "bg-[#06030c] text-[#FFFFFF]",
      card: "bg-purple-950/20 backdrop-blur-[40px] border border-purple-400/35 shadow-[0_24px_60px_rgba(168,85,247,0.18),inset_0_1.5px_2px_rgba(255,255,255,0.25)] rounded-[28px] sm:rounded-[32px]",
      innerCard: "bg-purple-900/20 backdrop-blur-[30px] border border-purple-400/30 shadow-inner",
      headingColor: "text-purple-300 drop-shadow-[0_2px_10px_rgba(168,85,247,0.4)]",
      tabActiveText: "text-purple-300 drop-shadow-[0_0_12px_rgba(168,85,247,0.9)]",
      accent: "text-purple-400",
      accentText: "text-purple-300 font-extrabold",
      pillBorder: "border border-purple-400/40 bg-purple-500/15 text-purple-200 backdrop-blur-[30px]",
      btnPrimary: "bg-gradient-to-r from-purple-600 via-indigo-600 to-fuchsia-600 text-white font-black shadow-[0_10px_25px_rgba(168,85,247,0.45)] hover:shadow-[0_14px_30px_rgba(168,85,247,0.6)] rounded-full",
      inputBg: "bg-black/30 backdrop-blur-[30px] border border-purple-400/35 text-white placeholder-slate-400 focus:border-purple-300 focus:bg-black/50",
      glowOrb1: "radial-gradient(circle, rgba(168, 85, 247, 0.45) 0%, rgba(168, 85, 247, 0) 70%)",
      glowOrb2: "radial-gradient(circle, rgba(99, 102, 241, 0.38) 0%, rgba(99, 102, 241, 0) 70%)"
    },
    day: {
      bg: "bg-[#faf5ff] text-[#3b0764]",
      card: "bg-white/20 backdrop-blur-[40px] border border-purple-300/60 shadow-[0_24px_60px_rgba(168,85,247,0.12),inset_0_2px_4px_rgba(255,255,255,0.9)] rounded-[28px] sm:rounded-[32px]",
      innerCard: "bg-white/25 backdrop-blur-[30px] border border-purple-200/60 shadow-sm",
      headingColor: "text-purple-950 font-black drop-shadow-sm",
      tabActiveText: "text-purple-900 font-black drop-shadow-[0_0_10px_rgba(168,85,247,0.6)]",
      accent: "text-purple-700 font-bold",
      accentText: "text-purple-700 font-black",
      pillBorder: "border border-purple-400/70 bg-white/30 text-purple-950 font-black shadow-sm backdrop-blur-[30px]",
      btnPrimary: "bg-gradient-to-r from-purple-600 via-indigo-600 to-fuchsia-600 text-white font-black shadow-[0_10px_25px_rgba(168,85,247,0.45)] active:scale-[0.98] rounded-full",
      inputBg: "bg-white/30 backdrop-blur-[30px] border border-purple-300/60 text-purple-950 placeholder-purple-400 focus:border-purple-600 focus:bg-white/50 shadow-inner font-medium",
      glowOrb1: "radial-gradient(circle, rgba(168, 85, 247, 0.35) 0%, rgba(168, 85, 247, 0) 70%)",
      glowOrb2: "radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, rgba(99, 102, 241, 0) 70%)"
    }
  },
  ruby: {
    night: {
      bg: "bg-[#0c0305] text-[#FFFFFF]",
      card: "bg-rose-950/20 backdrop-blur-[40px] border border-rose-400/35 shadow-[0_24px_60px_rgba(244,63,94,0.18),inset_0_1.5px_2px_rgba(255,255,255,0.25)] rounded-[28px] sm:rounded-[32px]",
      innerCard: "bg-rose-900/20 backdrop-blur-[30px] border border-rose-400/30 shadow-inner",
      headingColor: "text-rose-300 drop-shadow-[0_2px_10px_rgba(244,63,94,0.4)]",
      tabActiveText: "text-rose-300 drop-shadow-[0_0_12px_rgba(244,63,94,0.9)]",
      accent: "text-rose-400",
      accentText: "text-rose-300 font-extrabold",
      pillBorder: "border border-rose-400/40 bg-rose-500/15 text-rose-200 backdrop-blur-[30px]",
      btnPrimary: "bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 text-white font-black shadow-[0_10px_25px_rgba(244,63,94,0.45)] hover:shadow-[0_14px_30px_rgba(244,63,94,0.6)] rounded-full",
      inputBg: "bg-black/30 backdrop-blur-[30px] border border-rose-400/35 text-white placeholder-slate-400 focus:border-rose-300 focus:bg-black/50",
      glowOrb1: "radial-gradient(circle, rgba(244, 63, 94, 0.45) 0%, rgba(244, 63, 94, 0) 70%)",
      glowOrb2: "radial-gradient(circle, rgba(225, 29, 72, 0.35) 0%, rgba(225, 29, 72, 0) 70%)"
    },
    day: {
      bg: "bg-[#fff1f2] text-[#4c0519]",
      card: "bg-white/20 backdrop-blur-[40px] border border-rose-300/60 shadow-[0_24px_60px_rgba(244,63,94,0.12),inset_0_2px_4px_rgba(255,255,255,0.9)] rounded-[28px] sm:rounded-[32px]",
      innerCard: "bg-white/25 backdrop-blur-[30px] border border-rose-200/60 shadow-sm",
      headingColor: "text-rose-950 font-black drop-shadow-sm",
      tabActiveText: "text-rose-900 font-black drop-shadow-[0_0_10px_rgba(244,63,94,0.6)]",
      accent: "text-rose-700 font-bold",
      accentText: "text-rose-700 font-black",
      pillBorder: "border border-rose-400/70 bg-white/30 text-rose-950 font-black shadow-sm backdrop-blur-[30px]",
      btnPrimary: "bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 text-white font-black shadow-[0_10px_25px_rgba(244,63,94,0.45)] active:scale-[0.98] rounded-full",
      inputBg: "bg-white/30 backdrop-blur-[30px] border border-rose-300/60 text-rose-950 placeholder-rose-400 focus:border-rose-600 focus:bg-white/50 shadow-inner font-medium",
      glowOrb1: "radial-gradient(circle, rgba(244, 63, 94, 0.35) 0%, rgba(244, 63, 94, 0) 70%)",
      glowOrb2: "radial-gradient(circle, rgba(225, 29, 72, 0.3) 0%, rgba(225, 29, 72, 0) 70%)"
    }
  },
  sapphire: {
    night: {
      bg: "bg-[#03050c] text-[#FFFFFF]",
      card: "bg-blue-950/20 backdrop-blur-[40px] border border-blue-400/35 shadow-[0_24px_60px_rgba(37,99,235,0.18),inset_0_1.5px_2px_rgba(255,255,255,0.25)] rounded-[28px] sm:rounded-[32px]",
      innerCard: "bg-blue-900/20 backdrop-blur-[30px] border border-blue-400/30 shadow-inner",
      headingColor: "text-blue-300 drop-shadow-[0_2px_10px_rgba(37,99,235,0.4)]",
      tabActiveText: "text-blue-300 drop-shadow-[0_0_12px_rgba(37,99,235,0.9)]",
      accent: "text-blue-400",
      accentText: "text-blue-300 font-extrabold",
      pillBorder: "border border-blue-400/40 bg-blue-500/15 text-blue-200 backdrop-blur-[30px]",
      btnPrimary: "bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 text-white font-black shadow-[0_10px_25px_rgba(37,99,235,0.45)] hover:shadow-[0_14px_30px_rgba(37,99,235,0.6)] rounded-full",
      inputBg: "bg-black/30 backdrop-blur-[30px] border border-blue-400/35 text-white placeholder-slate-400 focus:border-blue-300 focus:bg-black/50",
      glowOrb1: "radial-gradient(circle, rgba(37, 99, 235, 0.45) 0%, rgba(37, 99, 235, 0) 70%)",
      glowOrb2: "radial-gradient(circle, rgba(79, 70, 229, 0.35) 0%, rgba(79, 70, 229, 0) 70%)"
    },
    day: {
      bg: "bg-[#eff6ff] text-[#1e3a8a]",
      card: "bg-white/20 backdrop-blur-[40px] border border-blue-300/60 shadow-[0_24px_60px_rgba(37,99,235,0.12),inset_0_2px_4px_rgba(255,255,255,0.9)] rounded-[28px] sm:rounded-[32px]",
      innerCard: "bg-white/25 backdrop-blur-[30px] border border-blue-200/60 shadow-sm",
      headingColor: "text-blue-950 font-black drop-shadow-sm",
      tabActiveText: "text-blue-900 font-black drop-shadow-[0_0_10px_rgba(37,99,235,0.6)]",
      accent: "text-blue-700 font-bold",
      accentText: "text-blue-700 font-black",
      pillBorder: "border border-blue-400/70 bg-white/30 text-blue-950 font-black shadow-sm backdrop-blur-[30px]",
      btnPrimary: "bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 text-white font-black shadow-[0_10px_25px_rgba(37,99,235,0.45)] active:scale-[0.98] rounded-full",
      inputBg: "bg-white/30 backdrop-blur-[30px] border border-blue-300/60 text-blue-950 placeholder-blue-400 focus:border-blue-600 focus:bg-white/50 shadow-inner font-medium",
      glowOrb1: "radial-gradient(circle, rgba(37, 99, 235, 0.35) 0%, rgba(37, 99, 235, 0) 70%)",
      glowOrb2: "radial-gradient(circle, rgba(79, 70, 229, 0.3) 0%, rgba(79, 70, 229, 0) 70%)"
    }
  },
  default: {
    night: {
      bg: "bg-[#06070a] text-[#FFFFFF]",
      card: "bg-white/[0.06] backdrop-blur-[40px] border border-white/25 shadow-[0_24px_60px_rgba(0,0,0,0.6),inset_0_1.5px_2px_rgba(255,255,255,0.25)] rounded-[28px] sm:rounded-[32px]",
      innerCard: "bg-white/[0.04] backdrop-blur-[30px] border border-white/20 shadow-inner",
      headingColor: "text-sky-300 drop-shadow-[0_2px_10px_rgba(56,189,248,0.4)]",
      tabActiveText: "text-sky-300 drop-shadow-[0_0_12px_rgba(56,189,248,0.9)]",
      accent: "text-sky-400",
      accentText: "text-sky-300 font-extrabold",
      pillBorder: "border border-white/30 bg-white/10 text-white backdrop-blur-[30px]",
      btnPrimary: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black shadow-[0_10px_25px_rgba(0,122,255,0.45)] rounded-full",
      inputBg: "bg-black/30 backdrop-blur-[30px] border border-white/25 text-white placeholder-slate-400 focus:border-sky-300 focus:bg-black/50",
      glowOrb1: "radial-gradient(circle, rgba(0, 122, 255, 0.42) 0%, rgba(0, 122, 255, 0) 70%)",
      glowOrb2: "radial-gradient(circle, rgba(56, 189, 248, 0.32) 0%, rgba(56, 189, 248, 0) 70%)"
    },
    day: {
      bg: "bg-[#f8fafc] text-[#0f172a]",
      card: "bg-white/20 backdrop-blur-[40px] border border-slate-300/60 shadow-[0_24px_60px_rgba(15,23,42,0.1),inset_0_2px_4px_rgba(255,255,255,0.9)] rounded-[28px] sm:rounded-[32px]",
      innerCard: "bg-white/25 backdrop-blur-[30px] border border-slate-200/60 shadow-sm",
      headingColor: "text-slate-950 font-black drop-shadow-sm",
      tabActiveText: "text-sky-900 font-black drop-shadow-[0_0_10px_rgba(0,122,255,0.6)]",
      accent: "text-sky-700 font-bold",
      accentText: "text-sky-700 font-black",
      pillBorder: "border border-slate-400/70 bg-white/30 text-slate-950 font-black shadow-sm backdrop-blur-[30px]",
      btnPrimary: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black shadow-[0_10px_25px_rgba(0,122,255,0.45)] active:scale-[0.98] rounded-full",
      inputBg: "bg-white/30 backdrop-blur-[30px] border border-slate-300/60 text-slate-950 placeholder-slate-400 focus:border-sky-600 focus:bg-white/50 shadow-inner font-medium",
      glowOrb1: "radial-gradient(circle, rgba(0, 122, 255, 0.35) 0%, rgba(0, 122, 255, 0) 70%)",
      glowOrb2: "radial-gradient(circle, rgba(56, 189, 248, 0.3) 0%, rgba(56, 189, 248, 0) 70%)"
    }
  }
};

const ALL_INDIA_STATES_AND_CITIES = {
  "Delhi": ["New Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi", "Central Delhi", "Old Delhi", "Chandni Chowk", "Civil Lines", "Model Town", "Kamla Nagar", "Mukherjee Nagar", "GTB Nagar", "Shalimar Bagh", "Ashok Vihar", "Pitampura", "Rohini", "Prashant Vihar", "Kohat Enclave", "Keshav Puram", "Wazirpur", "Punjabi Bagh", "Rajouri Garden", "Tilak Nagar", "Janakpuri", "Vikaspuri", "Uttam Nagar", "Dwarka", "Palam", "Mahavir Enclave", "Vasant Kunj", "Vasant Vihar", "R K Puram", "Munirka", "Hauz Khas", "Green Park", "Saket", "Malviya Nagar", "Mehrauli", "Chhatarpur", "Greater Kailash", "GK-I", "GK-II", "Kalkaji", "Nehru Place", "Govindpuri", "Tughlakabad", "Okhla", "Okhla Phase I", "Okhla Phase II", "Okhla Phase III", "Jamia Nagar", "Abul Fazal Enclave", "Batla House", "Shaheen Bagh", "Jasola", "Sarita Vihar", "Madanpur Khadar", "Lajpat Nagar", "Amar Colony", "Defence Colony", "Jangpura", "Lodi Colony", "South Extension", "Srinivaspuri", "East of Kailash", "Mayur Vihar", "Preet Vihar", "Laxmi Nagar", "Shahdara", "Patparganj", "Vivek Vihar", "Anand Vihar", "IP Extension", "Dilshad Garden", "Seelampur", "Karawal Nagar", "Burari", "Narela", "Bawana", "Najafgarh", "Dhaula Kuan", "Chanakyapuri", "Karol Bagh", "Paharganj", "Rajinder Nagar", "Patel Nagar", "Kirti Nagar", "Moti Nagar", "Naraina", "Connaught Place", "Barakhamba", "India Gate", "Pragati Maidan"],
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

const AutoPlayVideoCard = ({ item, onOpen }) => {
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
    <div 
      onClick={() => onOpen?.(item)} 
      className="h-64 sm:h-80 overflow-hidden relative bg-neutral-950 flex items-center justify-center group rounded-[24px] sm:rounded-[32px] shadow-[inset_0_0_25px_rgba(0,0,0,0.9)] transition-all duration-500 ease-out hover:scale-[1.01] border border-white/20 cursor-pointer"
    >
      <video
        ref={videoRef}
        src={item.url}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.2s] ease-out pointer-events-none"
      />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/95 via-black/40 to-transparent flex flex-col justify-end p-4 sm:p-5 text-white">
        <span className="text-[10px] sm:text-[11px] uppercase font-mono font-black text-cyan-300 tracking-wider drop-shadow-lg">{item.sub || 'Client Transformation'}</span>
        <h4 className="font-extrabold text-xs sm:text-base mt-0.5 flex items-center gap-1.5 text-pink-300 drop-shadow-md">
          <Film className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-400 shrink-0 animate-pulse" />
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
  const [mediaAssets, setMediaAssets] = useState({});
  const [activeTab, setActiveTab] = useState(() => {
    try {
      return localStorage.getItem('hf_active_tab') || 'menu';
    } catch {
      return 'menu';
    }
  });
  const [selectedKit, setSelectedKit] = useState(() => {
    try {
      return localStorage.getItem('hf_selected_kit') || 'international';
    } catch {
      return 'international';
    }
  });
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
  const [viewingMedia, setViewingMedia] = useState(null);
  const [zoomScale, setZoomScale] = useState(1);
  const [panPos, setPanPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
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

  const topHeaderWrapperRef = useRef(null);
  const [headerOffsetHeight, setHeaderOffsetHeight] = useState(130);

  const canvasRef = useRef(null);
  const [generatedJpgUrl, setGeneratedJpgUrl] = useState(null);

  const desktopNavRef = useRef(null);
  const mobileNavRef = useRef(null);
  const [desktopGlider, setDesktopGlider] = useState({ left: 0, width: 0 });
  const [mobileGlider, setMobileGlider] = useState({ left: 0, width: 0 });

  useEffect(() => {
    try {
      localStorage.setItem('hf_active_tab', activeTab);
    } catch {}
  }, [activeTab]);

  useEffect(() => {
    try {
      localStorage.setItem('hf_selected_kit', selectedKit);
    } catch {}
  }, [selectedKit]);

  useEffect(() => {
    try {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      const handleResize = () => {
        const nextVh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${nextVh}px`);
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    } catch {}
  }, []);

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

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  useEffect(() => {
    const updateDynamicHeaderHeight = () => {
      if (topHeaderWrapperRef.current) {
        setHeaderOffsetHeight(topHeaderWrapperRef.current.offsetHeight);
      }
    };
    updateDynamicHeaderHeight();
    window.addEventListener('resize', updateDynamicHeaderHeight);
    return () => window.removeEventListener('resize', updateDynamicHeaderHeight);
  }, [showSplash, config.toggles?.enableAnnouncements, config.showOfferSection, config.announcements]);

  useEffect(() => {
    const locked = Boolean(viewingPackage || showShareModal || viewingMedia);
    document.body.style.overflow = locked ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [viewingPackage, showShareModal, viewingMedia]);

  useEffect(() => {
    const handlePopState = (e) => {
      if (viewingMedia) {
        e.preventDefault();
        setViewingMedia(null);
        setZoomScale(1);
        setPanPos({ x: 0, y: 0 });
        window.history.pushState(null, '', window.location.href);
      } else if (viewingPackage) {
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
  }, [activeTab, viewingPackage, showShareModal, viewingMedia]);

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
    setFamilyGuests([...familyGuests, { id: Date.now(), name: `Guest #${familyGuests.length + 1}`, kit: defaultKit, packageKey: firstPkgKey }]);
  };

  const handleRemoveFamilyGuest = (id) => setFamilyGuests(familyGuests.filter(g => g.id !== id));

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
    familyGuests.forEach(g => { subtotal += (config.pricingByKit[g.kit]?.[g.packageKey] || 2500); });
    return subtotal;
  };

  const mainPackagePrice = config.pricingByKit[calcKit]?.[calcPackage] || 15000;
  const zoneFee = config.convenienceZones[calcZone]?.fee || 350;
  const mainBookingSubtotal = mainPackagePrice + zoneFee;
  const familyGuestsGross = calculateFamilyGuestsGross();
  
  const guestDiscountSavedAmount = isGuestDiscountActive && familyGuests.length > 0
    ? Math.round((familyGuestsGross * guestDiscountPercent) / 100) : 0;
    
  const familyGuestsFinalTotal = familyGuestsGross - guestDiscountSavedAmount;
  const subtotalBeforePromo = mainBookingSubtotal + familyGuestsFinalTotal;

  const handleApplyCoupon = (e, customCode) => {
    if (e) e.preventDefault();
    setCouponError('');
    if (config.toggles?.enableCoupons === false || config.enableDiscountsAndCoupons === false) {
      setCouponError('❌ Coupon system is currently disabled.'); return;
    }
    const code = (customCode || couponInput).trim().toUpperCase();
    if (!code) return;
    const couponData = config.validCoupons?.[code];
    if (!couponData) { setCouponError('❌ Invalid promo coupon code.'); return; }
    if (couponData.enabled === false) { setCouponError('⚠️ This promo coupon code is currently unavailable.'); return; }
    if (couponData.expiryDate) {
      const timeRemaining = getTimeRemaining(couponData.expiryDate);
      if (timeRemaining && timeRemaining.expired) {
        setCouponError(`⚠️ Coupon code ${code} expired on ${new Date(couponData.expiryDate).toLocaleDateString()}.`); return;
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

    const padding = 80;
    const cardWidth = 1040;
    const leftX = padding;
    const rightX = leftX + cardWidth;
    const labelX = leftX + 30;
    const valueX = rightX - 30;
    const contentMaxWidth = 520;

    const measureDynamicHeight = (text, maxWidth, fontSize) => {
      ctx.font = `bold ${fontSize}px sans-serif`;
      const words = String(text || '').split(' ');
      let lines = [];
      let curLine = '';
      for (let i = 0; i < words.length; i++) {
        const testLine = curLine + words[i] + ' ';
        if (ctx.measureText(testLine).width > maxWidth && i > 0) {
          lines.push(curLine.trim());
          curLine = words[i] + ' ';
        } else {
          curLine = testLine;
        }
      }
      if (curLine.trim()) lines.push(curLine.trim());
      if (lines.length === 0) lines = [''];
      const lineHeight = fontSize + 6;
      return { lines, height: Math.max(50, 22 + lines.length * lineHeight) };
    };

    let estHeight = 360;
    estHeight += 4 * 56;
    estHeight += 64 + 54;
    if (flatHouseNo.trim()) estHeight += measureDynamicHeight(flatHouseNo.trim(), contentMaxWidth, 18).height + 6;
    estHeight += measureDynamicHeight(streetLocality.trim() || 'Not Provided', contentMaxWidth, 18).height + 6;
    if (landmark.trim()) estHeight += measureDynamicHeight(landmark.trim(), contentMaxWidth, 18).height + 6;
    estHeight += 2 * 56;

    estHeight += 64 + 5 * 56;
    estHeight += 64 + (familyGuests.length > 0 ? familyGuests.length * 3 * 54 : 54) + 54;
    estHeight += 64 + 4 * 54;
    estHeight += 135;
    estHeight += 140;

    canvas.width = 1200;
    canvas.height = Math.ceil(estHeight);

    const drawText = (text, x, y, size, weight = 'normal', color = '#ffffff', align = 'left', family = 'sans-serif') => {
      ctx.textAlign = align; ctx.fillStyle = color; ctx.font = `${weight} ${size}px ${family}`; ctx.fillText(String(text ?? ''), x, y);
    };

    const drawRow = (label, value, y, options = {}) => {
      const rowHeight = options.height || 50;
      ctx.fillStyle = options.bg || 'rgba(255,255,255,0.035)';
      ctx.fillRect(leftX, y, cardWidth, rowHeight);
      drawText(label, labelX, y + rowHeight / 2 + 6, options.labelSize || 18, 'bold', options.labelColor || '#94a3b8');
      drawText(value, valueX, y + rowHeight / 2 + 6, options.valueSize || 19, 'bold', options.valueColor || '#ffffff', 'right', options.mono ? 'monospace' : 'sans-serif');
      return y + rowHeight + (options.gap ?? 6);
    };

    const drawDynamicRow = (label, value, y, options = {}) => {
      const { lines, height } = measureDynamicHeight(value, contentMaxWidth, options.valueSize || 18);
      ctx.fillStyle = options.bg || 'rgba(255,255,255,0.035)';
      ctx.fillRect(leftX, y, cardWidth, height);
      drawText(label, labelX, y + 30, options.labelSize || 18, 'bold', options.labelColor || '#94a3b8');
      const lineHeight = (options.valueSize || 18) + 6;
      lines.forEach((line, lIdx) => {
        drawText(line, valueX, y + 30 + lIdx * lineHeight, options.valueSize || 18, 'bold', options.valueColor || '#ffffff', 'right');
      });
      return y + height + (options.gap ?? 6);
    };

    const drawSectionTitle = (title, y, accent = '#7c3aed') => {
      ctx.fillStyle = accent === '#7c3aed' ? 'rgba(192,132,252,0.12)' : 'rgba(56,189,248,0.10)';
      ctx.fillRect(leftX, y, cardWidth, 52);
      drawText(title, labelX, y + 34, 19, 'bold', accent);
      return y + 58;
    };

    const drawContent = (logoImageObj) => {
      ctx.fillStyle = '#09090b'; ctx.fillRect(0, 0, 1200, canvas.height);
      ctx.strokeStyle = '#c084fc'; ctx.lineWidth = 4; ctx.strokeRect(30, 30, 1140, canvas.height - 60);
      ctx.strokeStyle = 'rgba(124, 58, 237, 0.25)'; ctx.lineWidth = 1.5; ctx.strokeRect(42, 42, 1116, canvas.height - 84);

      if (logoImageObj) {
        try {
          ctx.save(); ctx.beginPath(); ctx.arc(140, 130, 50, 0, Math.PI * 2, true); ctx.closePath(); ctx.clip();
          ctx.drawImage(logoImageObj, 90, 80, 100, 100); ctx.restore();
          ctx.strokeStyle = '#c084fc'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(140, 130, 50, 0, Math.PI * 2, true); ctx.stroke();
        } catch (e) {}
        drawText(config.studioName || 'H&F MAKEUP ARTIST', 220, 125, 40, 'bold', '#ffffff');
        drawText(config.artistTagline || 'Beauty, Styled Your Way', 220, 165, 20, 'bold', '#c084fc');
      } else {
        drawText(config.studioName || 'H&F MAKEUP ARTIST', 600, 125, 44, 'bold', '#ffffff', 'center');
        drawText(config.artistTagline || 'Beauty, Styled Your Way', 600, 165, 20, 'bold', '#c084fc', 'center');
      }

      ctx.strokeStyle = 'rgba(124, 58, 237, 0.2)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(leftX, 210); ctx.lineTo(rightX, 210); ctx.stroke();
      drawText('⏳ OFFICIAL BOOKING REQUEST SLIP', 600, 260, 24, 'bold', '#fbbf24', 'center');

      const pkgText = config.kitText?.[calcKit]?.[calcPackage] || DEFAULT_KIT_TEXT[calcKit][calcPackage];
      const kitName = config.pricingByKit[calcKit]?.name || 'Luxury Kit';
      const zone = config.convenienceZones[calcZone];

      let startY = 300;
      startY = drawRow('BOOKING NUMBER', bNumber || '#HF-PENDING', startY, { valueColor: '#c084fc', mono: true });
      startY = drawRow('CLIENT NAME', clientName || 'Not Provided', startY);
      startY = drawRow('CONTACT NUMBER', clientPhone || 'Not Provided', startY);
      startY = drawRow('EVENT DATE', eventDate || 'Not Provided', startY);
      startY += 6;
      startY = drawSectionTitle('📍 VENUE DESTINATION & STRUCTURED ADDRESS', startY, '#38bdf8');
      startY = drawRow('Address Type:', `[ ${addressType} ]`, startY, { valueColor: '#38bdf8' });
      if (flatHouseNo.trim()) startY = drawDynamicRow('Flat / House No., Building:', flatHouseNo.trim(), startY);
      startY = drawDynamicRow('Street, Sector, Locality:', streetLocality.trim() || 'Not Provided', startY);
      if (landmark.trim()) startY = drawDynamicRow('Landmark:', landmark.trim(), startY);
      startY = drawRow('Town / City & State:', `${city || 'New Delhi'}, ${state || 'Delhi'}`, startY);
      startY = drawRow('Postal PIN Code:', pincode.trim() || 'Not Provided', startY, { valueColor: '#c084fc', mono: true });

      startY += 6;
      startY = drawSectionTitle('1. MAIN MAKEOVER PACKAGE', startY, '#38bdf8');
      startY = drawRow('• Vanity:', kitName, startY);
      startY = drawRow('• Package:', pkgText.name, startY);
      startY = drawRow('• Package Price:', `₹${mainPackagePrice.toLocaleString('en-IN')}`, startY, { mono: true });
      startY = drawRow(`• Convenience Fee (${zone?.name || 'Local'}):`, `₹${zoneFee.toLocaleString('en-IN')}`, startY, { mono: true });
      startY = drawRow('Main Makeover Package Total:', `₹${mainBookingSubtotal.toLocaleString('en-IN')}`, startY, { labelColor: '#38bdf8', valueColor: '#38bdf8', mono: true });

      startY += 6;
      startY = drawSectionTitle(`2. ADDITIONAL FAMILY & GUEST MAKEOVERS (${familyGuests.length})`, startY, '#c084fc');
      if (familyGuests.length > 0) {
        familyGuests.forEach((g, gIdx) => {
          const rawP = config.pricingByKit[g.kit]?.[g.packageKey] || 2500;
          const vanityName = config.pricingByKit?.[g.kit]?.name || (g.kit === 'international' ? 'Luxury Kit' : 'HD Kit');
          const gPkgName = config.kitText?.[g.kit]?.[g.packageKey]?.name || g.packageKey;
          startY = drawRow(`Makeover #${gIdx + 1} • Vanity:`, vanityName, startY, { labelSize: 16, valueSize: 17 });
          startY = drawRow('• Package:', gPkgName, startY, { labelSize: 16, valueSize: 17 });
          startY = drawRow('• Price:', `₹${rawP.toLocaleString('en-IN')}`, startY, { labelSize: 16, mono: true });
        });
      } else {
        startY = drawRow('• No extra family guests selected', '₹0', startY, { valueColor: '#71717a', mono: true });
      }
      startY = drawRow('Additional Family & Guest Total:', `₹${familyGuestsGross.toLocaleString('en-IN')}`, startY, { labelColor: '#c084fc', valueColor: '#c084fc', mono: true });

      startY += 6;
      startY = drawSectionTitle('3. DISCOUNTS & OFFERS', startY, '#4ade80');
      if (guestDiscountSavedAmount > 0) startY = drawRow(`• Extra Guest Discount (${guestDiscountPercent}%):`, `-₹${guestDiscountSavedAmount.toLocaleString('en-IN')}`, startY, { valueColor: '#4ade80', mono: true });
      if (appliedCoupon && couponDiscountAmount > 0) startY = drawRow(`• Coupon Code (${appliedCoupon.code}):`, `-₹${couponDiscountAmount.toLocaleString('en-IN')}`, startY, { valueColor: '#4ade80', mono: true });
      if (guestDiscountSavedAmount === 0 && (!appliedCoupon || couponDiscountAmount === 0)) startY = drawRow('• No discounts applied', '₹0', startY, { valueColor: '#71717a', mono: true });
      startY = drawRow('Total Discounts:', `-₹${(guestDiscountSavedAmount + couponDiscountAmount).toLocaleString('en-IN')}`, startY, { labelColor: '#4ade80', valueColor: '#4ade80', mono: true });

      startY += 14;
      ctx.fillStyle = 'rgba(192,132,252,0.18)'; ctx.fillRect(leftX, startY, cardWidth, 105);
      ctx.strokeStyle = '#c084fc'; ctx.lineWidth = 2; ctx.strokeRect(leftX, startY, cardWidth, 105);

      drawText('FINAL AMOUNT PAYABLE', 600, startY + 36, 20, 'bold', '#e2e8f0', 'center');
      drawText(`₹${finalEstimate.toLocaleString('en-IN')}`, 600, startY + 84, 44, 'bold', '#ffffff', 'center', 'serif');

      const footerY = canvas.height - 65;
      drawText(`Studio Base Location: ${config.baseLocation} • Instagram: @${(config.instagramHandle || '').replace('@','')}`, 600, footerY, 16, 'normal', '#94a3b8', 'center');
      drawText(config.artistTagline || 'Beauty, Styled Your Way', 600, footerY + 28, 17, 'italic', '#c084fc', 'center');

      try {
        const jpgUrl = canvas.toDataURL('image/jpeg', 0.95);
        setGeneratedJpgUrl(jpgUrl);
      } catch (e) {}
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
      alert("Please fill your Name, Contact Phone, Event Date, Street/Locality, and Postal PIN Code."); return;
    }
    setIsSubmitting(true);
    const pkgText = config.kitText?.[calcKit]?.[calcPackage] || DEFAULT_KIT_TEXT[calcKit][calcPackage];
    const zone = config.convenienceZones[calcZone];
    const generatedBookingNo = `#HF-${Math.floor(100000 + Math.random() * 900000)}`;
    setCurrentBookingNumber(generatedBookingNo);

    const compiledAddress = `${flatHouseNo.trim() ? `${flatHouseNo.trim()}, ` : ''}${streetLocality.trim()}${landmark.trim() ? `, Near ${landmark.trim()}` : ''}, ${city}, ${state} - ${pincode.trim()}`;

    try {
      await addDoc(collection(db, "bookings"), {
        bookingNumber: generatedBookingNo, clientName: clientName.trim(), clientPhone: clientPhone.trim(), eventDate: eventDate,
        kitType: config.pricingByKit[calcKit]?.name || 'Luxury Kit', packageKey: calcPackage, packageName: `${pkgText.num ? pkgText.num + '.' : ''} ${pkgText.name}`,
        basePackagePrice: mainPackagePrice, extraGuestsCount: familyGuests.length, extraGuestsList: familyGuests, extraGuestsCost: familyGuestsGross, extraGuestsFinalCost: familyGuestsFinalTotal,
        guestDiscountSaved: guestDiscountSavedAmount, zoneName: zone?.name || 'Delhi NCR', zoneFee: zone?.fee || 350,
        addressType: addressType, flatHouseNo: flatHouseNo.trim(), streetLocality: streetLocality.trim(), landmark: landmark.trim(), city: city.trim(), state: state.trim(), pincode: pincode.trim(), venueAddress: compiledAddress,
        appliedCoupon: appliedCoupon ? appliedCoupon.code : 'None', couponDiscountAmount: couponDiscountAmount, discountAmount: guestDiscountSavedAmount + couponDiscountAmount, totalAmount: finalEstimate, status: 'pending', createdAt: serverTimestamp()
      });

      const telegramBotToken = config.telegramBotToken;
      const telegramChatId = config.telegramChatId;
      
      const tgMsgText = `🚨 <b>NEW APPOINTMENT BOOKING REQUEST</b> 🚨\n\n🔢 <b>Booking No:</b> ${generatedBookingNo}\n👤 <b>Client Name:</b> ${clientName.trim()}\n📞 <b>Contact Phone:</b> ${clientPhone.trim()}\n📅 <b>Event Date:</b> ${eventDate}\n💄 <b>Main Look:</b> ${pkgText.name}\n💎 <b>Vanity Tier:</b> ${config.pricingByKit[calcKit]?.name || 'Luxury Kit'}\n👥 <b>Extra Guests:</b> ${familyGuests.length} person(s)\n🏷️ <b>Address Type:</b> ${addressType}\n🏠 <b>Venue Address:</b> ${compiledAddress}\n📮 <b>Postal PIN:</b> ${pincode.trim()}\n🎁 <b>Discounts:</b> Guest (-₹${guestDiscountSavedAmount}) | Promo (-₹${couponDiscountAmount})\n💰 <b>Final Amount:</b> ₹${finalEstimate.toLocaleString('en-IN')}\n\n<i>Status: Pending Confirmation in Admin Console</i>`;

      try {
        if (telegramBotToken && telegramChatId) {
          await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ chat_id: telegramChatId, text: tgMsgText, parse_mode: 'HTML' }) 
          });
        }
      } catch (tgErr) {}

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
      await addDoc(collection(db, "feedbacks"), { clientName: feedbackName.trim() || 'Valued Client', clientPhone: feedbackPhone.trim() || 'Not Provided', rating: feedbackRating, message: feedbackMessage.trim(), submittedAt: serverTimestamp() });
      setFeedbackSubmitted(true); setFeedbackMessage('');
    } catch (err) { alert("Error submitting suggestion: " + err.message); } finally { setIsSubmittingFeedback(false); }
  };

  const handleCopyLink = () => { navigator.clipboard.writeText(window.location.href); setCopiedLink(true); setTimeout(() => setCopiedLink(false), 2500); };

  const rawThemeKey = config.theme?.colorTheme || 'real_glass_lens';
  const currentThemeGroup = THEME_STYLES[rawThemeKey] || THEME_STYLES.real_glass_lens;
  const activeThemeStyle = isDarkMode ? currentThemeGroup.night : currentThemeGroup.day;
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

  const navTabs = [
    { id: 'menu', label: 'Packages', icon: Crown, show: true },
    { id: 'gallery', label: 'Transformations', icon: Camera, show: config.toggles?.enableGallery !== false },
    { id: 'brands', label: 'Vanity', icon: Star, show: config.toggles?.enableBrands !== false },
    { id: 'calculator', label: 'Booking', icon: Calculator, show: config.toggles?.enableEstimator !== false },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare, show: true }
  ].filter(t => t.show);

  const updateGliders = () => {
    if (desktopNavRef.current) {
      const activeBtn = desktopNavRef.current.querySelector(`[data-tab-id="${activeTab}"]`);
      if (activeBtn) {
        setDesktopGlider({ left: activeBtn.offsetLeft, width: activeBtn.offsetWidth });
      }
    }
    if (mobileNavRef.current) {
      const activeBtn = mobileNavRef.current.querySelector(`[data-tab-id="${activeTab}"]`);
      if (activeBtn) {
        setMobileGlider({ left: activeBtn.offsetLeft, width: activeBtn.offsetWidth });
      }
    }
  };

  useEffect(() => {
    updateGliders();
    window.addEventListener('resize', updateGliders);
    return () => window.removeEventListener('resize', updateGliders);
  }, [activeTab, navTabs.length, showSplash]);

  const handleMouseDown = (e) => {
    if (zoomScale <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panPos.x, y: e.clientY - panPos.y });
  };
  const handleMouseMove = (e) => {
    if (!isDragging || zoomScale <= 1) return;
    setPanPos({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e) => {
    if (zoomScale <= 1 || !e.touches[0]) return;
    setIsDragging(true);
    setDragStart({ x: e.touches[0].clientX - panPos.x, y: e.touches[0].clientY - panPos.y });
  };
  const handleTouchMove = (e) => {
    if (!isDragging || zoomScale <= 1 || !e.touches[0]) return;
    setPanPos({ x: e.touches[0].clientX - dragStart.x, y: e.touches[0].clientY - dragStart.y });
  };
  const handleTouchEnd = () => setIsDragging(false);

  if (config.isAppDown || config.maintenanceMode) {
    return (
      <div style={{ fontFamily: currentFontFamily }} className={`min-h-[100dvh] ${activeThemeStyle.bg} flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300 ease-out`}>
        <div className="absolute top-1/4 left-1/4 w-80 sm:w-96 h-80 sm:h-96 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ background: activeThemeStyle.glowOrb1 }} />
        <div className={`max-w-md w-full ${activeThemeStyle.card} p-6 sm:p-8 text-center space-y-4 shadow-2xl relative z-10`}>
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-[22px] bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-400/40 shadow-[0_0_25px_rgba(245,158,11,0.3)]">
            <Wrench className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div className="space-y-2">
            <span className={`text-[10px] sm:text-xs uppercase font-mono tracking-wider ${activeThemeStyle.pillBorder} px-3 py-1.5 rounded-full inline-block font-extrabold`}>Scheduled Upgrade</span>
            <h2 className={`text-lg sm:text-2xl font-black tracking-tight ${activeThemeStyle.headingColor}`}>We'll Be Back Shortly</h2>
            <p className="text-xs sm:text-sm font-semibold opacity-90 leading-relaxed">We are currently fine-tuning our luxury digital experience. We appreciate your patience.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      style={{ fontFamily: currentFontFamily, WebkitUserSelect: 'none', userSelect: 'none', minHeight: 'calc(var(--vh, 1vh) * 100)' }} 
      data-hf-theme={rawThemeKey}
      data-hf-mode={isDarkMode ? 'night' : 'day'}
      className={`hf-app min-h-[100dvh] ${activeThemeStyle.bg} relative transition-colors duration-300 ease-out overflow-x-hidden`}
      onContextMenu={(e) => e.preventDefault()}
    >
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        button, a, input, select, textarea, [role="button"] { -webkit-tap-highlight-color: transparent; }
        
        .hf-app {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }

        .hf-lens-btn {
          position: relative;
          background: rgba(255, 255, 255, 0.03) !important;
          backdrop-filter: blur(28px) saturate(240%) contrast(120%);
          -webkit-backdrop-filter: blur(28px) saturate(240%) contrast(120%);
          border: 1px solid rgba(255, 255, 255, 0.4) !important;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.28), 
                      inset 0 1.5px 3px rgba(255, 255, 255, 0.8), 
                      inset 0 -1.5px 3px rgba(0, 0, 0, 0.45) !important;
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease, background 0.25s ease;
          overflow: hidden;
        }
        .hf-lens-btn::before {
          content: '';
          position: absolute;
          top: 1px;
          left: 14%;
          right: 14%;
          height: 38%;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.01) 100%);
          border-radius: 9999px;
          pointer-events: none;
        }
        .hf-lens-btn:hover {
          background: rgba(255, 255, 255, 0.08) !important;
          transform: translateY(-1px) scale(1.01);
          box-shadow: 0 14px 36px rgba(0, 0, 0, 0.35), 
                      inset 0 2px 4px rgba(255, 255, 255, 0.9) !important;
        }
        .hf-lens-btn:active {
          transform: scale(0.97) translateY(0);
        }

        .hf-app[data-hf-mode="day"] .hf-lens-btn {
          background: rgba(255, 255, 255, 0.65) !important;
          backdrop-filter: blur(40px) saturate(200%);
          -webkit-backdrop-filter: blur(40px) saturate(200%);
          border: 1px solid rgba(99, 102, 241, 0.4) !important;
          color: #1e1b4b !important;
          box-shadow: 0 8px 24px rgba(99, 102, 241, 0.15), 
                      inset 0 1.5px 3px rgba(255, 255, 255, 0.95), 
                      inset 0 -1.5px 2.5px rgba(99, 102, 241, 0.15) !important;
        }

        .hf-ios-dock-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
          height: 52px;
          padding: 4px;
        }
        .hf-ios-glider {
          position: absolute;
          top: 4px;
          bottom: 4px;
          border-radius: 9999px;
          transition: left 0.35s cubic-bezier(0.34, 1.3, 0.64, 1), width 0.35s cubic-bezier(0.34, 1.3, 0.64, 1);
          pointer-events: none;
          z-index: 1;
        }

        .hf-kit-enter {
          animation: hfKitFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes hfKitFade {
          0% { opacity: 0; transform: translateY(10px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        .hf-zoomable-media {
          will-change: transform;
          user-select: none;
          -webkit-user-drag: none;
        }

        .hf-mesh-glow {
          position: fixed;
          pointer-events: none;
          z-index: 0;
          border-radius: 9999px;
          filter: blur(85px);
          transform: translate3d(0,0,0);
          will-change: transform;
          animation: hfLiquidFloat 16s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate;
        }
        @keyframes hfLiquidFloat {
          0% { transform: scale(1) translate(0px, 0px); }
          50% { transform: scale(1.25) translate(40px, 25px); }
          100% { transform: scale(0.9) translate(-25px, 20px); }
        }

        .hf-marquee-track {
          display: flex;
          width: max-content;
          animation: hfRunMarquee 26s linear infinite;
        }
        .hf-marquee-track:hover {
          animation-play-state: paused;
        }
        @keyframes hfRunMarquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }

        .hf-tab-enter {
          animation: hfFadeScale 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes hfFadeScale {
          0% { opacity: 0; transform: scale(0.98) translateY(12px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }

        .hf-modal-backdrop { 
          position: fixed; inset: 0; z-index: 90; display: flex; align-items: center; justify-content: center; 
          padding: max(12px, env(safe-area-inset-top)) 12px max(12px, env(safe-area-inset-bottom)); 
          background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px); overflow-y: auto; 
        }
        .hf-app[data-hf-mode="day"] .hf-modal-backdrop {
          background: rgba(15, 23, 42, 0.25) !important;
          backdrop-filter: blur(35px) !important;
          -webkit-backdrop-filter: blur(35px) !important;
        }
        .hf-modal-card { width: min(100%, 540px); max-height: min(90dvh, 740px); overflow-y: auto; margin: auto; }

        .hf-floating-banner-mobile {
          position: fixed;
          bottom: calc(76px + env(safe-area-inset-bottom));
          left: 14px;
          right: 14px;
          max-width: 440px;
          margin: 0 auto;
          z-index: 45;
        }
        @media (min-width: 640px) {
          .hf-floating-banner-mobile {
            bottom: 24px;
            right: 24px;
            left: auto;
            width: 320px;
          }
        }

        .hf-bottom-nav { 
          position: fixed; 
          bottom: max(12px, env(safe-area-inset-bottom)); 
          left: 50%; 
          transform: translateX(-50%); 
          width: calc(100% - 24px); 
          max-width: 460px; 
          border-radius: 9999px !important; 
          backdrop-filter: blur(40px); 
          -webkit-backdrop-filter: blur(40px);
          box-shadow: 0 20px 50px rgba(0,0,0,0.5); 
          z-index: 50;
        }
      `}</style>

      {/* AMBIENT ENHANCED GLOWS */}
      <div className="hf-mesh-glow w-[380px] sm:w-[560px] h-[380px] sm:h-[560px] -top-20 -left-20 opacity-70" style={{ background: activeThemeStyle.glowOrb1 }} />
      <div className="hf-mesh-glow w-[340px] sm:w-[500px] h-[340px] sm:h-[500px] top-1/3 -right-20 opacity-60" style={{ background: activeThemeStyle.glowOrb2, animationDelay: '-5s' }} />
      <div className="hf-mesh-glow w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] -bottom-32 left-1/4 opacity-50" style={{ background: activeThemeStyle.glowOrb1, animationDelay: '-10s' }} />

      {/* SPLASH SCREEN (ANIMATED LOGO ONLY) */}
      {showSplash && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center ${activeThemeStyle.bg} transition-opacity duration-700 ${splashFade ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className={`w-28 h-28 sm:w-36 sm:h-36 rounded-[32px] overflow-hidden ${activeThemeStyle.card} p-2 shadow-2xl animate-pulse flex items-center justify-center`}>
            <img src={resolvedLogoUrl} alt="Studio Logo" onError={() => setLogoLoadFailed(true)} className="w-full h-full object-contain rounded-[24px]" />
          </div>
        </div>
      )}

      {/* ZOOMABLE & DRAGGABLE MEDIA MODAL */}
      {viewingMedia && (
        <div className="hf-modal-backdrop">
          <div className={`hf-modal-card ${activeThemeStyle.card} p-4 sm:p-6 space-y-4 shadow-2xl hf-tab-enter relative`}>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] sm:text-xs uppercase font-mono font-black text-cyan-400">{viewingMedia.sub || 'Client Transformation'}</span>
                <h3 className={`font-black text-sm sm:text-lg ${activeThemeStyle.headingColor}`}>{viewingMedia.title}</h3>
              </div>
              <button 
                onClick={() => { setViewingMedia(null); setZoomScale(1); setPanPos({ x: 0, y: 0 }); }} 
                className="p-1.5 rounded-full bg-slate-500/20 hover:bg-slate-500/40 text-white transition-all active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div 
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="relative w-full h-72 sm:h-96 rounded-[22px] overflow-hidden bg-black flex items-center justify-center border border-white/20 select-none touch-none"
            >
              {isVideoMedia(viewingMedia) ? (
                <video src={viewingMedia.url} controls autoPlay className="w-full h-full object-contain" />
              ) : (
                <div 
                  className={`w-full h-full flex items-center justify-center ${zoomScale > 1 ? 'cursor-grab active:cursor-grabbing' : ''}`}
                >
                  <img 
                    src={viewingMedia.url} 
                    alt={viewingMedia.title} 
                    style={{ 
                      transform: `translate(${panPos.x}px, ${panPos.y}px) scale(${zoomScale})`,
                      transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.25, 1, 0.5, 1)'
                    }}
                    className="hf-zoomable-media max-w-full max-h-full object-contain pointer-events-none" 
                  />
                </div>
              )}

              {!isVideoMedia(viewingMedia) && (
                <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/75 backdrop-blur-md p-1.5 rounded-full border border-white/20 z-20">
                  <button onClick={() => setZoomScale(prev => Math.min(3.5, prev + 0.3))} className="p-1.5 text-white hover:text-cyan-300 transition-all"><ZoomIn className="w-4 h-4" /></button>
                  <button onClick={() => { setZoomScale(prev => { const next = Math.max(1, prev - 0.3); if (next === 1) setPanPos({ x: 0, y: 0 }); return next; }); }} className="p-1.5 text-white hover:text-cyan-300 transition-all"><ZoomOut className="w-4 h-4" /></button>
                  <button onClick={() => { setZoomScale(1); setPanPos({ x: 0, y: 0 }); }} className="p-1.5 text-white hover:text-cyan-300 transition-all"><RotateCcw className="w-4 h-4" /></button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className={`text-[11px] font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>Explore Makeup Transformations</span>
              <button 
                onClick={() => { setViewingMedia(null); setActiveTab('calculator'); }} 
                className={`px-5 py-2.5 ${activeThemeStyle.btnPrimary} text-xs font-black`}
              >
                Book Similar Look
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SHARE MODAL */}
      {showShareModal && (
        <div className="hf-modal-backdrop">
          <div className={`hf-modal-card ${activeThemeStyle.card} p-5 sm:p-7 text-center space-y-4 shadow-2xl hf-tab-enter`}>
            <div className="flex items-center justify-between">
              <span className={`font-black text-xs sm:text-sm flex items-center gap-2 ${activeThemeStyle.headingColor}`}><Share2 className="w-4 h-4" /> Share Lookbook</span>
              <button onClick={() => setShowShareModal(false)} className="p-1.5 rounded-full bg-slate-500/10 hover:bg-slate-500/20 opacity-80 hover:opacity-100 transition-all"><X className="w-4 h-4" /></button>
            </div>
            <div className="w-36 h-36 sm:w-44 sm:h-44 mx-auto bg-white/90 p-2.5 rounded-[24px] border border-slate-300 flex items-center justify-center shadow-md backdrop-blur-md">
              <img src={qrCodeApiUrl} alt="App QR Code" className="w-full h-full object-contain rounded-[14px]" />
            </div>
            <p className={`text-xs sm:text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Scan this QR code with any camera or scanner to explore the portfolio & book instantly.</p>
            <div className="flex gap-2 pt-1">
              <button onClick={handleCopyLink} className={`flex-1 py-2.5 sm:py-3 rounded-full ${activeThemeStyle.pillBorder} text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all`}>
                {copiedLink ? <CheckCheck className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 opacity-80" />}
                <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
              </button>
              <a href={qrCodeApiUrl} download="HF_Studio_QR.png" target="_blank" rel="noreferrer" className={`px-5 sm:px-6 py-2.5 sm:py-3 rounded-full ${activeThemeStyle.btnPrimary} text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 shrink-0`}>
                <Download className="w-4 h-4" /> <span>Save QR</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* PACKAGE DETAILS MODAL */}
      {viewingPackage && (
        <div className="hf-modal-backdrop">
          <div className={`hf-modal-card ${activeThemeStyle.card} p-5 sm:p-6 space-y-4 shadow-2xl hf-tab-enter`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Crown className={`w-4 h-4 sm:w-5 sm:h-5 ${activeThemeStyle.accentText}`} />
                <h3 className={`font-black text-sm sm:text-lg ${activeThemeStyle.headingColor}`}>{viewingPackage.name}</h3>
              </div>
              <button onClick={() => setViewingPackage(null)} className="p-1.5 rounded-full bg-slate-500/10 hover:bg-slate-500/20 opacity-80 hover:opacity-100 transition-all"><X className="w-4 h-4" /></button>
            </div>
            <div className="w-full h-40 sm:h-48 rounded-[20px] sm:rounded-[24px] overflow-hidden bg-black/20 border border-slate-300 relative">
              <img src={viewingPackage.image} alt={viewingPackage.name} className="w-full h-full object-cover" />
              <div className="absolute top-2.5 left-2.5 px-3 py-1 rounded-full bg-black/75 text-[10px] sm:text-xs font-mono font-bold text-amber-300 backdrop-blur-md border border-white/20">
                {selectedKit === 'international' ? '👑 Luxury Tier' : '✨ HD Classic'}
              </div>
            </div>
            <p className={`text-xs sm:text-sm font-medium leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>{viewingPackage.desc}</p>
            <div className={`space-y-2 text-xs sm:text-sm ${activeThemeStyle.innerCard} p-3.5 sm:p-4 rounded-[20px]`}>
              <div className="flex justify-between items-center"><span className="font-semibold opacity-80">Vanity Tier:</span><strong className="font-black">{config.pricingByKit[selectedKit]?.name}</strong></div>
              <div className="flex justify-between items-center"><span className="font-semibold opacity-80">Finish:</span><span className="font-bold">{viewingPackage.skinFinish}</span></div>
              <div className="flex justify-between items-center"><span className="font-semibold opacity-80">Includes:</span><span className="font-bold">{viewingPackage.includes}</span></div>
              <div className="flex justify-between items-center font-black text-sm sm:text-base pt-2 border-t border-slate-400/30">
                <span>Investment:</span>
                <span className={`${activeThemeStyle.accentText} font-mono text-base sm:text-lg font-black`}>₹{(config.pricingByKit?.[selectedKit]?.[viewingPackage.key] || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>
            <button onClick={() => { setCalcPackage(viewingPackage.key); setCalcKit(selectedKit); setViewingPackage(null); setActiveTab('calculator'); }} className={`w-full py-3 sm:py-3.5 ${activeThemeStyle.btnPrimary} text-xs sm:text-sm font-black transition-all active:scale-95 flex items-center justify-center gap-2`}>
              <span>Estimate & Book This Look</span> <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TOP FIXED TICKER & HEADER */}
      <div ref={topHeaderWrapperRef} className="fixed top-0 inset-x-0 z-40">
        {!showSplash && config.toggles?.enableAnnouncements !== false && config.showOfferSection !== false && (
          <div className={`w-full py-1.5 px-3 overflow-hidden text-[10px] sm:text-xs font-bold border-b shadow-sm ${isDarkMode ? 'bg-black/50 border-white/10 text-white backdrop-blur-[40px]' : 'bg-white/20 border-slate-300/60 text-slate-900 backdrop-blur-[40px]'}`}>
            <div className="overflow-hidden whitespace-nowrap w-full flex items-center">
              <div className="hf-marquee-track flex items-center">
                {(config.announcements && config.announcements.length > 0 ? config.announcements : [
                  "🌟 Book Bridal Makeup for 2026-2027 Season & Get Complimentary Pre-Bridal Consultation",
                  "✨ Flat 15% OFF on Family & Guest Makeovers with Main Bridal Package",
                  "💄 Certified International Makeup Artist • 100% Genuine Luxury Vanity Products (Dior, Charlotte Tilbury, Huda Beauty)"
                ]).concat(config.announcements && config.announcements.length > 0 ? config.announcements : [
                  "🌟 Book Bridal Makeup for 2026-2027 Season & Get Complimentary Pre-Bridal Consultation",
                  "✨ Flat 15% OFF on Family & Guest Makeovers with Main Bridal Package",
                  "💄 Certified International Makeup Artist • 100% Genuine Luxury Vanity Products (Dior, Charlotte Tilbury, Huda Beauty)"
                ]).map((ann, idx) => (
                  <span key={idx} className="mx-6 sm:mx-8 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-pink-500 animate-pulse shrink-0 shadow-[0_0_10px_#ec4899]" />
                    <span>{ann}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TRANSLUCENT HEADER NAVBAR */}
        <header className={`w-full px-3 sm:px-8 py-2.5 sm:py-3.5 ${activeThemeStyle.card} !rounded-none !border-x-0 !border-t-0 shadow-lg backdrop-blur-[40px]`}>
          <div className="max-w-5xl mx-auto flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5 sm:space-x-3.5 select-none min-w-0">
                {config.toggles?.showLogoOnApp !== false && (
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-[16px] sm:rounded-[18px] overflow-hidden shrink-0 border border-slate-400/40 bg-white/10 flex items-center justify-center p-0.5 shadow-sm">
                    <img src={resolvedLogoUrl} alt="Logo" onError={() => setLogoLoadFailed(true)} className="w-full h-full object-cover rounded-[13px]" draggable="false" />
                  </div>
                )}
                <div className="truncate">
                  <h1 className={`font-black text-sm sm:text-lg truncate tracking-tight ${activeThemeStyle.headingColor}`}>{config.studioName || 'H&F Makeup Artist'}</h1>
                  <p className={`text-[10px] sm:text-xs ${activeThemeStyle.accentText} flex items-center gap-1.5 truncate font-extrabold uppercase tracking-wider`}>
                    <span className="truncate">{config.artistTagline || 'Beauty, Styled Your Way'}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <button onClick={() => setShowShareModal(true)} title="Share QR" className={`p-2 sm:p-2.5 rounded-full ${activeThemeStyle.pillBorder} transition-all flex items-center justify-center shadow-sm active:scale-95`}>
                  <QrCode className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>

                <button onClick={toggleTheme} title="Toggle Day/Night" className={`p-2 sm:p-2.5 rounded-full ${activeThemeStyle.pillBorder} transition-all flex items-center justify-center shadow-sm active:scale-95`}>
                  {isDarkMode ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600" />}
                </button>

                <a href={getCleanInstagramUrl(config.instagramHandle)} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-1.5 ${activeThemeStyle.btnPrimary} text-[11px] sm:text-xs font-bold px-3.5 sm:px-4 py-2 sm:py-2.5 active:scale-95 shadow-md`}>
                  <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                  <span className="hidden sm:inline">Instagram</span>
                </a>

                {shouldShowProfileInHeader && (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-[14px] sm:rounded-[18px] border border-slate-400/40 overflow-hidden shrink-0 shadow-sm p-0.5">
                    <img src={resolvedAvatar} alt="Artist Profile" onError={() => setImgLoadFailed(true)} className="w-full h-full object-cover rounded-[12px]" />
                  </div>
                )}
              </div>
            </div>

            {/* DESKTOP FLUID TABS */}
            <div className="hidden sm:flex w-full items-center justify-center">
              <nav ref={desktopNavRef} className="hf-ios-dock-wrapper rounded-full border border-slate-400/30 bg-black/10 backdrop-blur-[40px] max-w-xl">
                <div 
                  className="hf-ios-glider hf-lens-btn"
                  style={{
                    left: `${desktopGlider.left}px`,
                    width: `${desktopGlider.width}px`
                  }}
                />
                {navTabs.map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button 
                      key={tab.id} 
                      data-tab-id={tab.id}
                      onClick={() => setActiveTab(tab.id)} 
                      className={`relative z-10 flex-1 h-full flex items-center justify-center gap-1.5 px-3 rounded-full text-xs font-black transition-colors duration-200 text-center ${isActive ? `${activeThemeStyle.tabActiveText}` : (isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900')}`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" /><span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </header>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      {!showSplash && (
        <nav aria-label="Mobile Navigation" className={`hf-bottom-nav ${activeThemeStyle.card} sm:hidden border border-slate-400/40 shadow-2xl`}>
          <div ref={mobileNavRef} className="hf-ios-dock-wrapper">
            <div 
              className="hf-ios-glider hf-lens-btn"
              style={{
                left: `${mobileGlider.left}px`,
                width: `${mobileGlider.width}px`
              }}
            />
            {navTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button 
                  key={tab.id} 
                  data-tab-id={tab.id}
                  onClick={() => setActiveTab(tab.id)} 
                  className={`relative z-10 flex-1 h-full flex flex-col items-center justify-center rounded-full transition-colors duration-200 text-center ${isActive ? `${activeThemeStyle.tabActiveText} font-black` : (isDarkMode ? 'text-slate-400' : 'text-slate-600')}`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="text-[9px] mt-0.5 font-extrabold">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}

      {/* MAIN VIEWPORT */}
      <main 
        style={{ paddingTop: `${headerOffsetHeight + 18}px` }} 
        className="max-w-5xl mx-auto px-3 sm:px-6 pb-28 sm:pb-24 relative z-10"
      >
        {activeTab === 'menu' && (
          <div className="space-y-6 sm:space-y-7 hf-tab-enter">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className={`px-3.5 py-1 rounded-full ${activeThemeStyle.pillBorder} text-[10px] sm:text-xs font-black inline-flex items-center gap-1.5 shadow-sm`}>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Professional Vanity Packages
              </span>
              <h2 className={`text-xl sm:text-3xl font-black tracking-tight ${activeThemeStyle.headingColor}`}>Curated Makeup Menu</h2>
              <p className={`text-xs sm:text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Select your vanity tier to view tailored makeover packages:</p>

              <div className="inline-flex p-1 rounded-full bg-slate-500/10 border border-slate-400/40 mt-1 gap-1.5">
                <button onClick={() => setSelectedKit('international')} className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs font-black transition-all ${selectedKit === 'international' ? `${activeThemeStyle.btnPrimary} shadow-md` : `${isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-slate-900'}`}`}>👑 Luxury Kit</button>
                <button onClick={() => setSelectedKit('drugstore')} className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs font-black transition-all ${selectedKit === 'drugstore' ? `${activeThemeStyle.btnPrimary} shadow-md` : `${isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-slate-900'}`}`}>✨ HD Kit</button>
              </div>
            </div>

            {/* Smooth transition animated card grid for Luxury & HD kits */}
            <div key={selectedKit} className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 hf-kit-enter">
              {Object.keys(config.kitText?.[selectedKit] || {}).map((key) => {
                const item = config.kitText?.[selectedKit]?.[key] || DEFAULT_KIT_TEXT[selectedKit][key];
                const price = config.pricingByKit?.[selectedKit]?.[key] || 0;
                const imgSrc = config.kitImages?.[selectedKit]?.[key] || DEFAULT_KIT_IMAGES[selectedKit][key];

                if (!item.name) return null;

                const displaySkinFinish = item.skinFinish || "16-Hour Water Resistant HD Glass";

                return (
                  <div key={`${selectedKit}_${key}`} className={`${activeThemeStyle.card} p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-5 items-center transition-all duration-300 hover:scale-[1.01] hover:shadow-xl`}>
                    <div className="w-full sm:w-36 h-40 sm:h-36 shrink-0 rounded-[20px] sm:rounded-[24px] overflow-hidden bg-slate-900/20 relative border border-slate-400/30">
                      <img src={imgSrc} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                      <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-black/75 text-[10px] font-mono font-extrabold text-amber-300 border border-white/20 shadow-sm">
                        {selectedKit === 'international' ? '👑 Luxury' : '✨ HD Classic'}
                      </div>
                    </div>
                    <div className="flex-1 w-full flex flex-col justify-between space-y-2 min-w-0">
                      <div>
                        <div className="flex justify-between items-baseline gap-2">
                          <h4 className={`font-black text-sm sm:text-base leading-snug break-words ${activeThemeStyle.headingColor}`}>{item.num ? `${item.num}. ` : ''}{item.name}</h4>
                          <span className={`font-mono font-black text-sm sm:text-base ${activeThemeStyle.accentText} shrink-0`}>₹{price.toLocaleString('en-IN')}</span>
                        </div>
                        <p className={`text-xs font-medium mt-1 leading-relaxed whitespace-normal break-words ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>{item.desc}</p>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2.5 border-t border-slate-400/25 gap-2">
                        <div className="min-w-0 flex-1">
                          <span className={`text-[10px] sm:text-[11px] font-extrabold flex items-center gap-1 ${isDarkMode ? 'text-cyan-300' : 'text-indigo-900'}`} title={displaySkinFinish}>
                            <Sparkles className="w-3 h-3 text-amber-400 shrink-0 animate-pulse" />
                            <span className="whitespace-normal break-words leading-tight">{displaySkinFinish}</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button onClick={() => setViewingPackage({ key, ...item, image: imgSrc })} className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full ${activeThemeStyle.pillBorder} text-xs font-bold hover:opacity-90 transition-all active:scale-95`}>Details</button>
                          <button onClick={() => { setCalcPackage(key); setCalcKit(selectedKit); setActiveTab('calculator'); }} className={`px-4 sm:px-5 py-1.5 sm:py-2 ${activeThemeStyle.btnPrimary} text-xs font-extrabold transition-all active:scale-95 flex items-center gap-1`}>
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
          <div className="space-y-6 sm:space-y-7 hf-tab-enter">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className={`px-3.5 py-1 rounded-full ${activeThemeStyle.pillBorder} text-[10px] sm:text-xs font-black inline-flex items-center gap-1.5 shadow-sm`}>
                <Camera className="w-3.5 h-3.5" /> Discover Looks
              </span>
              <h2 className={`text-xl sm:text-3xl font-black tracking-tight ${activeThemeStyle.headingColor}`}>Featured Transformations</h2>
              <p className={`text-xs sm:text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Explore signature makeup transformations. Click to zoom, inspect details, and pan around.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {(config.galleryPhotos || DEFAULT_GALLERY).map((item, idx) => {
                const isVideo = isVideoMedia(item);
                return (
                  <div key={idx} className={`${activeThemeStyle.card} overflow-hidden flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] p-1.5`}>
                    {isVideo ? <AutoPlayVideoCard item={item} onOpen={(it) => setViewingMedia(it)} /> : (
                      <div 
                        onClick={() => setViewingMedia(item)}
                        className="h-64 sm:h-80 overflow-hidden relative bg-slate-900/20 rounded-[22px] sm:rounded-[26px] border border-slate-400/30 cursor-pointer group"
                      >
                        <img src={item.url} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent flex flex-col justify-end p-4 text-white">
                          <span className="text-[10px] sm:text-[11px] uppercase font-mono font-bold text-cyan-300">{item.sub || 'Client Transformation'}</span>
                          <h4 className="font-extrabold text-xs sm:text-sm mt-0.5 text-white flex items-center justify-between">
                            <span>{item.title}</span>
                            <ZoomIn className="w-4 h-4 opacity-75 group-hover:opacity-100" />
                          </h4>
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
          <div className="space-y-6 sm:space-y-7 hf-tab-enter">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className={`px-3.5 py-1 rounded-full ${activeThemeStyle.pillBorder} text-[10px] sm:text-xs font-black inline-flex items-center gap-1.5 shadow-sm`}>
                <Star className="w-3.5 h-3.5" /> Authentic Vanity
              </span>
              <h2 className={`text-xl sm:text-3xl font-black tracking-tight ${activeThemeStyle.headingColor}`}>Products In Our Kit</h2>
              <p className={`text-xs sm:text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>100% Genuine, skin-safe international luxury cosmetics used for all makeovers.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {(config.internationalBrands || DEFAULT_BRANDS).map((brand, idx) => (
                <div key={idx} className={`${activeThemeStyle.card} p-5 space-y-2.5 transition-all duration-300 hover:scale-[1.02]`}>
                  <span className={`text-[10px] font-extrabold ${activeThemeStyle.accentText} bg-amber-500/15 border border-amber-400/40 uppercase px-3 py-1 rounded-full font-mono inline-block`}>{brand.category}</span>
                  <h4 className={`font-black text-sm sm:text-base ${activeThemeStyle.headingColor}`}>{brand.name}</h4>
                  <p className={`text-xs font-medium leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>{brand.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'calculator' && config.toggles?.enableEstimator !== false && (
          <div className="max-w-4xl mx-auto hf-tab-enter">
            {isBookingDone ? (
              <div className={`${activeThemeStyle.card} p-6 sm:p-10 text-center space-y-5 shadow-2xl max-w-lg mx-auto`}>
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[24px] bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-400/40 shadow-[0_0_25px_rgba(16,185,129,0.3)]">
                  <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <div className={`inline-block px-5 py-2 rounded-full ${activeThemeStyle.pillBorder} font-mono font-black text-xs`}>
                  BOOKING NO: {currentBookingNumber}
                </div>
                <h3 className={`text-xl sm:text-2xl font-black ${activeThemeStyle.headingColor}`}>Booking Request Sent!</h3>
                <p className={`text-xs sm:text-sm font-semibold leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>Your appointment request has been recorded securely. Our team will coordinate with you shortly.</p>
                {generatedJpgUrl && (
                  <div className="pt-2">
                    <a href={generatedJpgUrl} download={`Booking_Receipt_${currentBookingNumber}.jpg`} className={`px-6 py-3.5 rounded-full ${activeThemeStyle.btnPrimary} font-extrabold inline-flex items-center gap-2 text-xs sm:text-sm transition-all shadow-xl active:scale-95`}>
                      <Download className="w-4 h-4" /> <span>Download Official Slip (.JPG)</span>
                    </a>
                  </div>
                )}
                <button onClick={() => setIsBookingDone(false)} className={`block w-full py-3.5 ${activeThemeStyle.pillBorder} text-xs font-bold rounded-full transition-all active:scale-95`}>Done</button>
              </div>
            ) : (
              <form onSubmit={handleDirectEstimateBooking} className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6">
                
                {/* LEFT OPTIONS & DETAILS */}
                <div className={`md:col-span-7 ${activeThemeStyle.card} p-5 sm:p-7 space-y-5 shadow-xl`}>
                  <div className="border-b border-slate-400/30 pb-3">
                    <h3 className={`font-black text-sm sm:text-base flex items-center gap-2 ${activeThemeStyle.headingColor}`}>
                      <Calculator className="w-4 h-4 sm:w-5 sm:h-5" /> 1. Calculate & Choose Looks
                    </h3>
                  </div>

                  <div>
                    <label className={`block text-xs font-black uppercase tracking-wider mb-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Main Makeover Package: Vanity Tier</label>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button type="button" onClick={() => setCalcKit('international')} className={`p-3 sm:p-3.5 rounded-full text-xs font-extrabold border text-center transition-all ${calcKit === 'international' ? `${activeThemeStyle.btnPrimary} shadow-md` : `${activeThemeStyle.pillBorder} opacity-80 hover:opacity-100`}`}>👑 Luxury Kit</button>
                      <button type="button" onClick={() => setCalcKit('drugstore')} className={`p-3 sm:p-3.5 rounded-full text-xs font-extrabold border text-center transition-all ${calcKit === 'drugstore' ? `${activeThemeStyle.btnPrimary} shadow-md` : `${activeThemeStyle.pillBorder} opacity-80 hover:opacity-100`}`}>✨ HD Kit</button>
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-black uppercase tracking-wider mb-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Main Makeover Package: Package</label>
                    <select value={calcPackage} onChange={(e) => setCalcPackage(e.target.value)} className={`w-full ${activeThemeStyle.inputBg} rounded-[18px] px-3.5 py-3 text-xs sm:text-sm font-bold outline-none`}>
                      {Object.keys(config.kitText?.[calcKit] || {}).map(k => {
                        const pData = config.kitText[calcKit][k];
                        const pPrice = config.pricingByKit?.[calcKit]?.[k] || 0;
                        return <option key={k} value={k} className="bg-slate-900 text-white">{pData.num ? `${pData.num}. ` : ''}{pData.name} (₹{pPrice.toLocaleString('en-IN')})</option>;
                      })}
                    </select>
                  </div>

                  <div>
                    <label className={`block text-xs font-black uppercase tracking-wider mb-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Venue Location Zone</label>
                    <select value={calcZone} onChange={(e) => setCalcZone(e.target.value)} className={`w-full ${activeThemeStyle.inputBg} rounded-[18px] px-3.5 py-3 text-xs sm:text-sm font-bold outline-none`}>
                      {Object.entries(config.convenienceZones).map(([key, zone]) => (
                        <option key={key} value={key} className="bg-slate-900 text-white">{zone.name} (+₹{zone.fee})</option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-3 border-t border-slate-400/30 space-y-3.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className={`font-black text-xs uppercase tracking-wider flex items-center gap-1.5 ${activeThemeStyle.headingColor}`}>
                          <Users className="w-4 h-4" /> Extra Family Makeup Customizer
                        </h4>
                        <p className={`text-[11px] font-semibold mt-0.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Add vanity look for each family guest.</p>
                      </div>
                      <button type="button" onClick={handleAddFamilyGuest} className={`px-3.5 py-1.5 rounded-full ${activeThemeStyle.pillBorder} text-xs font-black flex items-center gap-1 active:scale-95`}>
                        <Plus className="w-3.5 h-3.5" /> Add Guest
                      </button>
                    </div>

                    {isGuestDiscountActive && guestDiscountPercent > 0 && (
                      <div className="p-3 rounded-[18px] bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
                          <p className="text-emerald-500 font-black">Flat {guestDiscountPercent}% Extra Family Discount Active!</p>
                        </div>
                        <span className="font-mono font-black text-emerald-500 bg-emerald-500/20 px-2.5 py-0.5 rounded-full text-[10px]">{guestDiscountPercent}% OFF</span>
                      </div>
                    )}

                    {familyGuests.length > 0 && (
                      <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                        {familyGuests.map((guest, idx) => {
                          const rawGuestPrice = config.pricingByKit[guest.kit]?.[guest.packageKey] || 2500;
                          return (
                            <div key={guest.id} className={`p-3.5 rounded-[20px] ${activeThemeStyle.innerCard} space-y-2.5`}>
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-black">Guest #{idx + 1}</span>
                                <div className="flex items-center gap-2">
                                  <span className={`text-xs sm:text-sm font-black font-mono ${activeThemeStyle.accentText}`}>₹{rawGuestPrice.toLocaleString('en-IN')}</span>
                                  <button type="button" onClick={() => handleRemoveFamilyGuest(guest.id)} className="p-1 text-rose-500 hover:bg-rose-500/10 rounded-full"><Trash2 className="w-4 h-4" /></button>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-2.5">
                                <div>
                                  <label className="block text-[10px] font-black opacity-80 mb-1">Vanity Tier</label>
                                  <select value={guest.kit} onChange={(e) => handleUpdateFamilyGuest(guest.id, 'kit', e.target.value)} className={`w-full p-2.5 rounded-[14px] text-xs font-bold ${activeThemeStyle.inputBg}`}>
                                    <option value="international" className="bg-slate-900 text-white">👑 Luxury Kit</option>
                                    <option value="drugstore" className="bg-slate-900 text-white">✨ HD Kit</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-[10px] font-black opacity-80 mb-1">Package Look</label>
                                  <select value={guest.packageKey} onChange={(e) => handleUpdateFamilyGuest(guest.id, 'packageKey', e.target.value)} className={`w-full p-2.5 rounded-[14px] text-xs font-bold ${activeThemeStyle.inputBg}`}>
                                    {Object.keys(config.kitText?.[guest.kit] || {}).map(k => (
                                      <option key={k} value={k} className="bg-slate-900 text-white">{config.kitText[guest.kit][k]?.name || k} (₹{config.pricingByKit[guest.kit][k]})</option>
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
                    <div className="pt-3 border-t border-slate-400/30 space-y-2">
                      <label className={`block text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                        <Tag className="w-3.5 h-3.5" /> Promo Coupon Code
                      </label>
                      {appliedCoupon ? (
                        <div className={`${activeThemeStyle.innerCard} rounded-[18px] p-3 flex items-center justify-between gap-2`}>
                          <div>
                            <span className="text-xs font-black font-mono">CODE: {appliedCoupon.code} APPLIED</span>
                            <p className="text-[11px] font-black text-emerald-500">🎉 {appliedCoupon.type === 'percent' ? `${appliedCoupon.value}% OFF` : `Flat ₹${appliedCoupon.value} OFF`}</p>
                          </div>
                          <button type="button" onClick={() => { setAppliedCoupon(null); setCouponInput(''); }} className="text-rose-500 text-xs font-bold hover:underline">Remove</button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <input type="text" placeholder="e.g. BRIDE2026" value={couponInput} onChange={(e) => setCouponInput(e.target.value.toUpperCase())} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleApplyCoupon(e); } }} className={`flex-1 ${activeThemeStyle.inputBg} rounded-full px-4 py-2.5 text-xs sm:text-sm uppercase font-mono font-black outline-none`} />
                          <button type="button" onClick={handleApplyCoupon} className={`px-5 py-2.5 ${activeThemeStyle.btnPrimary} text-xs font-black rounded-full shrink-0 shadow-md active:scale-95`}>Apply</button>
                        </div>
                      )}
                      {couponError && <p className="text-[11px] text-rose-500 font-bold">{couponError}</p>}
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-400/30 space-y-3.5">
                    <h4 className={`font-black text-xs uppercase tracking-wider flex items-center gap-1.5 ${activeThemeStyle.headingColor}`}>
                      <User className="w-4 h-4" /> 2. Enter Client Details
                    </h4>
                    <div>
                      <label className={`block text-xs font-bold mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>Full Name *</label>
                      <input type="text" required placeholder="e.g. Aliza Khan" value={clientName} onChange={(e) => setClientName(e.target.value)} className={`w-full px-3.5 py-2.5 sm:py-3 rounded-[18px] ${activeThemeStyle.inputBg} text-xs sm:text-sm font-semibold outline-none`} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className={`block text-xs font-bold mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>Contact Phone *</label>
                        <input type="tel" required placeholder="e.g. 9876543210" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} className={`w-full px-3.5 py-2.5 sm:py-3 rounded-[18px] ${activeThemeStyle.inputBg} text-xs sm:text-sm font-mono font-bold outline-none`} />
                      </div>
                      <div>
                        <label className={`block text-xs font-bold mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>Event Date *</label>
                        <input type="date" required value={eventDate} onChange={(e) => setEventDate(e.target.value)} className={`w-full px-3.5 py-2.5 sm:py-3 rounded-[18px] ${activeThemeStyle.inputBg} text-xs sm:text-sm font-mono font-bold outline-none`} />
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-400/30 space-y-3.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <h4 className={`font-black text-xs uppercase tracking-wider flex items-center gap-1.5 ${activeThemeStyle.headingColor}`}>
                          <MapPin className="w-4 h-4" /> 3. Destination Venue & Address
                        </h4>
                        <div className="flex items-center gap-1.5">
                          {['Home', 'Work'].map((type) => (
                            <button key={type} type="button" onClick={() => setAddressType(type)} className={`px-3 py-1 rounded-full text-[10px] font-black border transition-all ${addressType === type ? `${activeThemeStyle.btnPrimary} shadow-sm` : `${activeThemeStyle.pillBorder} opacity-80 hover:opacity-100`}`}>
                              {type === 'Work' ? '🏢 Work' : '🏠 Home'}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className={`block text-xs font-bold mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>Postal PIN Code *</label>
                          <input type="text" required maxLength={6} placeholder="e.g. 110025" value={pincode} onChange={(e) => { const val = e.target.value.replace(/\D/g, ''); setPincode(val === '0' ? '' : val); }} className={`w-full px-3.5 py-2.5 sm:py-3 rounded-[18px] ${activeThemeStyle.inputBg} text-xs sm:text-sm font-mono font-bold outline-none`} />
                        </div>
                        <div>
                          <label className={`block text-xs font-bold mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>Flat, House No., Building</label>
                          <input type="text" placeholder="e.g. Flat 402" value={flatHouseNo} onChange={(e) => setFlatHouseNo(e.target.value)} className={`w-full px-3.5 py-2.5 sm:py-3 rounded-[18px] ${activeThemeStyle.inputBg} text-xs sm:text-sm font-semibold outline-none`} />
                        </div>
                      </div>
                      <div>
                        <label className={`block text-xs font-bold mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>Street, Sector, Area, Locality *</label>
                        <input type="text" required placeholder="e.g. Jamia Nagar, Okhla" value={streetLocality} onChange={(e) => setStreetLocality(e.target.value)} className={`w-full px-3.5 py-2.5 sm:py-3 rounded-[18px] ${activeThemeStyle.inputBg} text-xs sm:text-sm font-semibold outline-none`} />
                      </div>
                      <div>
                        <label className={`block text-xs font-bold mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>Landmark (Optional)</label>
                        <input type="text" placeholder="e.g. Near Metro Gate" value={landmark} onChange={(e) => setLandmark(e.target.value)} className={`w-full px-3.5 py-2.5 sm:py-3 rounded-[18px] ${activeThemeStyle.inputBg} text-xs sm:text-sm font-semibold outline-none`} />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className={`block text-xs font-bold mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>State / Region *</label>
                          <select value={selectedState} onChange={(e) => { const st = e.target.value; setSelectedState(st); setState(st); setCity((ALL_INDIA_STATES_AND_CITIES[st] || ["Other Major City"])[0]); }} className={`w-full px-3.5 py-2.5 sm:py-3 rounded-[18px] ${activeThemeStyle.inputBg} text-xs sm:text-sm font-bold outline-none`}>
                            {Object.keys(ALL_INDIA_STATES_AND_CITIES).map(stName => <option key={stName} value={stName} className="bg-slate-900 text-white">{stName}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className={`block text-xs font-bold mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>Town / City *</label>
                          <select value={city} onChange={(e) => setCity(e.target.value)} className={`w-full px-3.5 py-2.5 sm:py-3 rounded-[18px] ${activeThemeStyle.inputBg} text-xs sm:text-sm font-bold outline-none`}>
                            {(ALL_INDIA_STATES_AND_CITIES[selectedState] || [city]).map(cityName => <option key={cityName} value={cityName} className="bg-slate-900 text-white">{cityName}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT SUMMARY */}
                <div className="md:col-span-5 flex flex-col gap-5">
                  <div className={`${activeThemeStyle.card} p-5 sm:p-7 flex flex-col justify-between space-y-4 shadow-xl sticky top-28`}>
                    <div>
                      <span className={`text-[11px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Total Investment Summary</span>
                      <div className="mt-1 text-2xl sm:text-4xl font-black flex items-baseline gap-1">
                        <span className={activeThemeStyle.accentText}>₹</span><span className={`font-mono ${activeThemeStyle.headingColor}`}>{finalEstimate.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <div className="space-y-3 text-xs border-t border-b border-slate-400/30 py-3.5">
                      <div className={`p-3 sm:p-3.5 rounded-[18px] border border-sky-400/50 ${isDarkMode ? 'bg-sky-500/10' : 'bg-sky-50/50'} space-y-1.5`}>
                        <div className="flex justify-between items-center font-black text-sky-500 text-xs sm:text-sm">
                          <span>1. Main Makeover Package:</span>
                          <span className="font-mono">₹{mainBookingSubtotal.toLocaleString('en-IN')}</span>
                        </div>
                        <div className={`flex justify-between pl-1 font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}><span>• Vanity:</span><span>{config.pricingByKit?.[calcKit]?.name}</span></div>
                        <div className={`flex justify-between pl-1 font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}><span>• Package:</span><span>{(config.kitText?.[calcKit]?.[calcPackage])?.name}</span></div>
                        <div className={`flex justify-between pl-1 font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}><span>• Package Price:</span><span className="font-mono">₹{mainPackagePrice.toLocaleString('en-IN')}</span></div>
                        <div className={`flex justify-between pl-1 font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}><span>• Convenience Fee:</span><span className="font-mono">₹{zoneFee.toLocaleString('en-IN')}</span></div>
                      </div>

                      <div className={`p-3 sm:p-3.5 rounded-[18px] border border-purple-400/50 ${isDarkMode ? 'bg-purple-500/10' : 'bg-purple-50/50'} space-y-1.5`}>
                        <div className="flex justify-between items-center font-black text-purple-500 text-xs sm:text-sm">
                          <span>2. Extra Guests ({familyGuests.length}):</span>
                          <span className="font-mono">₹{familyGuestsGross.toLocaleString('en-IN')}</span>
                        </div>
                        {familyGuests.length > 0 ? (
                          <div className="space-y-2 pt-1 border-t border-purple-400/20">
                            {familyGuests.map((g, i) => {
                              const gp = config.pricingByKit[g.kit]?.[g.packageKey] || 2500;
                              const vanityName = config.pricingByKit?.[g.kit]?.name || (g.kit === 'international' ? 'Luxury Kit' : 'HD Kit');
                              const gPkgName = config.kitText?.[g.kit]?.[g.packageKey]?.name || g.packageKey;
                              return (
                                <div key={i} className={`p-2.5 rounded-[14px] border border-purple-400/30 backdrop-blur-[25px] ${isDarkMode ? 'bg-purple-900/20 text-purple-200' : 'bg-purple-100/35 text-purple-950'} space-y-1 shadow-sm`}>
                                  <div className="flex justify-between items-center font-bold">
                                    <span>Guest #{i + 1} ({vanityName}):</span>
                                    <span className="font-mono font-black">₹{gp.toLocaleString('en-IN')}</span>
                                  </div>
                                  <div className="text-[11px] font-semibold opacity-85 pl-1">
                                    • Look: {gPkgName}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className={`flex justify-between pl-1 font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}><span>• No extra guests</span><span className="font-mono">₹0</span></div>
                        )}
                      </div>

                      <div className={`flex justify-between items-center px-3.5 py-2.5 text-xs sm:text-sm font-black rounded-full ${activeThemeStyle.pillBorder}`}>
                        <span>Total Before Discounts:</span>
                        <span className="font-mono">₹{(mainBookingSubtotal + familyGuestsGross).toLocaleString('en-IN')}</span>
                      </div>

                      <div className={`p-3 sm:p-3.5 rounded-[18px] border border-emerald-400/50 ${isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-50/50'} space-y-1.5`}>
                        <div className="flex justify-between items-center font-black text-emerald-500 text-xs sm:text-sm">
                          <span>3. Discounts & Offers:</span>
                          <span className="font-mono">-₹{(guestDiscountSavedAmount + couponDiscountAmount).toLocaleString('en-IN')}</span>
                        </div>
                        {guestDiscountSavedAmount > 0 && <div className="flex justify-between pl-1 text-[11px] text-emerald-500 font-bold"><span>• Family Discount:</span><span className="font-mono">-₹{guestDiscountSavedAmount}</span></div>}
                        {appliedCoupon && couponDiscountAmount > 0 && <div className="flex justify-between pl-1 text-[11px] text-emerald-500 font-bold"><span>• Promo Code:</span><span className="font-mono">-₹{couponDiscountAmount}</span></div>}
                        {guestDiscountSavedAmount === 0 && (!appliedCoupon || couponDiscountAmount === 0) && <div className={`flex justify-between pl-1 text-[11px] font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}><span>• No discounts</span><span className="font-mono">₹0</span></div>}
                      </div>
                    </div>

                    <button type="submit" disabled={isSubmitting} className={`w-full py-3.5 sm:py-4 ${activeThemeStyle.btnPrimary} font-black text-xs sm:text-sm rounded-full shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2`}>
                      <Check className="w-4 h-4 sm:w-5 sm:h-5" /> <span>{isSubmitting ? 'Recording...' : 'Confirm & Send Booking'}</span>
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className={`${activeThemeStyle.card} p-5 sm:p-8 rounded-[28px] sm:rounded-[36px] max-w-xl mx-auto space-y-5 shadow-2xl hf-tab-enter`}>
            <div className="text-center space-y-1">
              <span className={`text-[10px] font-extrabold uppercase tracking-widest ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Client Experience</span>
              <h3 className={`text-xl sm:text-2xl font-black ${activeThemeStyle.headingColor}`}>Feedback & Suggestions</h3>
              <p className={`text-xs sm:text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Help us enhance your vanity experience by sharing your valuable thoughts.</p>
            </div>
            {feedbackSubmitted ? (
              <div className="p-6 rounded-[22px] bg-emerald-500/20 border border-emerald-400/40 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto shadow-[0_0_20px_rgba(16,185,129,0.4)]" />
                <h4 className="font-black text-base sm:text-lg text-emerald-500">Thank you for your feedback!</h4>
                <p className={`text-xs font-semibold leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Your suggestion has been securely recorded to help us improve.</p>
                <button onClick={() => setFeedbackSubmitted(false)} className={`mt-2 px-5 py-2.5 rounded-full ${activeThemeStyle.pillBorder} text-xs font-bold transition-all active:scale-95`}>Submit Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmitFeedback} className="space-y-4">
                <div className="flex justify-center gap-2 py-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} type="button" onClick={() => setFeedbackRating(star)} className={`p-1 transition-all ${star <= feedbackRating ? 'text-amber-400 scale-110 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]' : 'opacity-30 hover:opacity-100 hover:text-amber-400'}`}>
                      <Star className={`w-7 h-7 sm:w-8 sm:h-8 ${star <= feedbackRating ? 'fill-amber-400' : ''}`} />
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="text" placeholder="Your Name" value={feedbackName} onChange={e => setFeedbackName(e.target.value)} className={`w-full px-3.5 py-2.5 sm:py-3 rounded-[18px] ${activeThemeStyle.inputBg} text-xs sm:text-sm font-semibold outline-none`} />
                  <input type="tel" placeholder="Phone Number" value={feedbackPhone} onChange={e => setFeedbackPhone(e.target.value)} className={`w-full px-3.5 py-2.5 sm:py-3 rounded-[18px] ${activeThemeStyle.inputBg} text-xs sm:text-sm font-mono font-bold outline-none`} />
                </div>
                <textarea rows={3} required placeholder="Share your suggestions, review or thoughts..." value={feedbackMessage} onChange={e => setFeedbackMessage(e.target.value)} className={`w-full p-3.5 rounded-[18px] ${activeThemeStyle.inputBg} text-xs sm:text-sm font-medium outline-none`} />
                <button type="submit" disabled={isSubmittingFeedback} className={`w-full py-3.5 sm:py-4 ${activeThemeStyle.btnPrimary} font-black text-xs sm:text-sm rounded-full shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2`}>
                  <Send className="w-4 h-4" /> <span>{isSubmittingFeedback ? 'Submitting...' : 'Send Feedback'}</span>
                </button>
              </form>
            )}
          </div>
        )}
      </main>

      {/* FLOATING PROMO BANNER (MOBILE-OPTIMIZED ABOVE NAV PILL BAR) */}
      {config.toggles?.enableFloatingBanner !== false && config.floatingBanner?.enabled !== false && showFloatingBanner && !shouldHideFloatingDueToExpiry && (
        <aside aria-label="Promotional offer" className={`hf-floating-banner-mobile ${activeThemeStyle.card} p-3.5 sm:p-4 rounded-[22px] sm:rounded-[28px] shadow-2xl transition-all border border-slate-400/40 backdrop-blur-[60px]`}>
          <div className="flex items-start justify-between gap-2.5">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-400/30 shrink-0 mt-0.5 shadow-[0_0_15px_rgba(245,158,11,0.25)]">
              <Gift className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[9px] font-black bg-amber-500/20 text-amber-400 border border-amber-400/40 uppercase px-2 py-0.5 rounded-full font-mono">{config.floatingBanner?.tag || "SPECIAL OFFER"}</span>
                {isFloatingExpired ? <span className="text-[9px] font-mono bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-full">Expired</span> : floatingTimer ? <span className="text-[9px] font-mono font-bold opacity-90 px-2 py-0.5 rounded-full bg-slate-500/10">{floatingTimer.text}</span> : null}
              </div>
              <h4 className={`font-black text-xs sm:text-sm mt-1 leading-tight ${activeThemeStyle.headingColor}`}>{config.floatingBanner?.title || "Wedding Season Discount"}</h4>
              <p className={`text-[11px] mt-0.5 font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>{isFloatingExpired ? <span className="text-rose-400">Ended.</span> : <>Use code <span className="font-mono font-black text-amber-400 bg-black/40 px-1.5 py-0.5 rounded border border-amber-400/30">{floatingPromoCode}</span></>}</p>
            </div>
            <button onClick={() => setShowFloatingBanner(false)} className="opacity-70 hover:opacity-100 p-1 shrink-0 transition-all active:scale-90"><X className="w-3.5 h-3.5" /></button>
          </div>
          <button disabled={isFloatingExpired} onClick={() => { if (!isFloatingExpired) { handleApplyCoupon(null, floatingPromoCode); setActiveTab('calculator'); } }} className={`mt-2.5 w-full py-2 sm:py-2.5 text-xs font-black rounded-full transition-all shadow-md ${isFloatingExpired ? 'bg-slate-500/20 opacity-50 cursor-not-allowed' : `${activeThemeStyle.btnPrimary} active:scale-[0.98]`}`}>
            {isFloatingExpired ? "Offer Expired" : (config.floatingBanner?.actionText || "Apply Code & Book")}
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
