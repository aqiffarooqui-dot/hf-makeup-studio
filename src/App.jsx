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
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-[60px] border border-white/20 p-8 rounded-[36px] space-y-4 shadow-[0_32px_80px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.4)]">
            <div className="w-14 h-14 rounded-[22px] bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-400/40 shadow-[0_0_25px_rgba(245,158,11,0.3)]">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">System Safe Mode Active</h2>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              We encountered a minor display update glitch. Our automated system has protected your session.
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="w-full py-3.5 rounded-[20px] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs transition-all duration-300 shadow-[0_10px_25px_rgba(37,99,235,0.4)] active:scale-[0.98]"
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
    bg: "bg-[#06070b] text-[#FFFFFF]",
    card: "bg-purple-950/35 backdrop-blur-[50px] border border-purple-400/40 shadow-[0_28px_70px_rgba(168,85,247,0.22),inset_0_1.5px_2px_rgba(255,255,255,0.35),inset_0_8px_20px_rgba(255,255,255,0.08)] rounded-[32px]",
    innerCard: "bg-purple-900/25 border border-purple-400/35 backdrop-blur-md shadow-inner",
    accent: "text-purple-300",
    btn: "bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white font-bold shadow-[0_12px_32px_rgba(236,72,153,0.45)] hover:shadow-[0_16px_36px_rgba(236,72,153,0.6)] rounded-[20px]",
    glowOrb1: "radial-gradient(circle, rgba(168, 85, 247, 0.45) 0%, rgba(168, 85, 247, 0) 70%)",
    glowOrb2: "radial-gradient(circle, rgba(236, 72, 153, 0.38) 0%, rgba(236, 72, 153, 0) 70%)"
  },
  sunset_glow: {
    bg: "bg-[#080605] text-[#FFFFFF]",
    card: "bg-amber-950/35 backdrop-blur-[50px] border border-amber-400/40 shadow-[0_28px_70px_rgba(245,158,11,0.22),inset_0_1.5px_2px_rgba(255,255,255,0.35),inset_0_8px_20px_rgba(255,255,255,0.08)] rounded-[32px]",
    innerCard: "bg-amber-900/25 border border-amber-400/35 backdrop-blur-md shadow-inner",
    accent: "text-amber-300",
    btn: "bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 text-white font-bold shadow-[0_12px_32px_rgba(244,63,94,0.45)] hover:shadow-[0_16px_36px_rgba(244,63,94,0.6)] rounded-[20px]",
    glowOrb1: "radial-gradient(circle, rgba(245, 158, 11, 0.45) 0%, rgba(245, 158, 11, 0) 70%)",
    glowOrb2: "radial-gradient(circle, rgba(244, 63, 94, 0.38) 0%, rgba(244, 63, 94, 0) 70%)"
  },
  cyber_matrix: {
    bg: "bg-[#020808] text-[#FFFFFF]",
    card: "bg-cyan-950/35 backdrop-blur-[50px] border border-cyan-400/40 shadow-[0_28px_70px_rgba(6,182,212,0.22),inset_0_1.5px_2px_rgba(255,255,255,0.35),inset_0_8px_20px_rgba(255,255,255,0.08)] rounded-[32px]",
    innerCard: "bg-cyan-900/25 border border-cyan-400/35 backdrop-blur-md shadow-inner",
    accent: "text-cyan-300",
    btn: "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-neutral-950 font-bold shadow-[0_12px_32px_rgba(6,182,212,0.45)] hover:shadow-[0_16px_36px_rgba(6,182,212,0.6)] rounded-[20px]",
    glowOrb1: "radial-gradient(circle, rgba(6, 182, 212, 0.45) 0%, rgba(6, 182, 212, 0) 70%)",
    glowOrb2: "radial-gradient(circle, rgba(16, 185, 129, 0.38) 0%, rgba(16, 185, 129, 0) 70%)"
  },
  real_glass_lens: {
    bg: "bg-[#06080e] text-[#FFFFFF]",
    card: "bg-blue-950/35 backdrop-blur-[50px] border border-blue-400/40 shadow-[0_28px_70px_rgba(0,122,255,0.22),inset_0_1.5px_2px_rgba(255,255,255,0.35),inset_0_8px_20px_rgba(255,255,255,0.08)] rounded-[32px]",
    innerCard: "bg-blue-900/25 border border-blue-400/35 backdrop-blur-md shadow-inner",
    accent: "text-sky-300",
    btn: "bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-[0_12px_32px_rgba(0,122,255,0.45)] hover:shadow-[0_16px_36px_rgba(0,122,255,0.6)] rounded-[20px]",
    glowOrb1: "radial-gradient(circle, rgba(0, 122, 255, 0.45) 0%, rgba(0, 122, 255, 0) 70%)",
    glowOrb2: "radial-gradient(circle, rgba(99, 102, 241, 0.38) 0%, rgba(99, 102, 241, 0) 70%)"
  },
  real_ios_glass: {
    bg: "bg-[#06070a] text-[#FFFFFF]",
    card: "bg-zinc-900/40 backdrop-blur-[50px] border border-white/30 shadow-[0_28px_70px_rgba(0,0,0,0.65),inset_0_1.5px_2px_rgba(255,255,255,0.4),inset_0_8px_20px_rgba(255,255,255,0.08)] rounded-[36px]",
    innerCard: "bg-white/[0.08] border border-white/20 backdrop-blur-md shadow-inner",
    accent: "text-sky-300",
    btn: "bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 text-white font-bold shadow-[0_12px_32px_rgba(37,99,235,0.45)] hover:shadow-[0_16px_36px_rgba(37,99,235,0.6)] rounded-[22px]",
    glowOrb1: "radial-gradient(circle, rgba(56, 189, 248, 0.42) 0%, rgba(56, 189, 248, 0) 70%)",
    glowOrb2: "radial-gradient(circle, rgba(99, 102, 241, 0.35) 0%, rgba(99, 102, 241, 0) 70%)"
  },
  liquid_glass: {
    bg: "bg-[#030610] text-[#FFFFFF]",
    card: "bg-sky-950/35 backdrop-blur-[50px] border border-cyan-400/45 shadow-[0_28px_70px_rgba(6,182,212,0.25),inset_0_1.5px_2px_rgba(255,255,255,0.4),inset_0_8px_20px_rgba(255,255,255,0.08)] rounded-[32px]",
    innerCard: "bg-sky-900/25 border border-cyan-400/35 backdrop-blur-md shadow-inner",
    accent: "text-cyan-300",
    btn: "bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 text-white font-bold shadow-[0_12px_32px_rgba(6,182,212,0.45)] hover:shadow-[0_16px_36px_rgba(6,182,212,0.6)] rounded-[20px]",
    glowOrb1: "radial-gradient(circle, rgba(6, 182, 212, 0.45) 0%, rgba(6, 182, 212, 0) 70%)",
    glowOrb2: "radial-gradient(circle, rgba(37, 99, 235, 0.38) 0%, rgba(37, 99, 235, 0) 70%)"
  },
  one_ui_9: {
    bg: "bg-[#08080a] text-[#FFFFFF]",
    card: "bg-zinc-900/75 backdrop-blur-[50px] border border-zinc-500/50 shadow-[0_28px_70px_rgba(0,0,0,0.6),inset_0_1.5px_2px_rgba(255,255,255,0.25)] rounded-[30px]",
    innerCard: "bg-zinc-800/60 border border-zinc-500/40 backdrop-blur-md shadow-inner",
    accent: "text-violet-300",
    btn: "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold shadow-[0_12px_32px_rgba(139,92,246,0.45)] rounded-[20px]",
    glowOrb1: "radial-gradient(circle, rgba(139, 92, 246, 0.42) 0%, rgba(139, 92, 246, 0) 70%)",
    glowOrb2: "radial-gradient(circle, rgba(168, 85, 247, 0.32) 0%, rgba(168, 85, 247, 0) 70%)"
  },
  gold_rose: {
    bg: "bg-[#0a0506] text-[#FFFFFF]",
    card: "bg-rose-950/35 backdrop-blur-[50px] border border-amber-400/45 shadow-[0_28px_70px_rgba(244,63,94,0.22),inset_0_1.5px_2px_rgba(255,255,255,0.35),inset_0_8px_20px_rgba(255,255,255,0.08)] rounded-[32px]",
    innerCard: "bg-rose-900/25 border border-amber-400/35 backdrop-blur-md shadow-inner",
    accent: "text-amber-300",
    btn: "bg-gradient-to-r from-amber-500 via-rose-500 to-pink-600 text-white font-bold shadow-[0_12px_32px_rgba(244,63,94,0.45)] hover:shadow-[0_16px_36px_rgba(244,63,94,0.6)] rounded-[20px]",
    glowOrb1: "radial-gradient(circle, rgba(245, 158, 11, 0.45) 0%, rgba(245, 158, 11, 0) 70%)",
    glowOrb2: "radial-gradient(circle, rgba(244, 63, 94, 0.38) 0%, rgba(244, 63, 94, 0) 70%)"
  },
  champagne: {
    bg: "bg-[#0a0604] text-[#FFFFFF]",
    card: "bg-orange-950/35 backdrop-blur-[50px] border border-orange-400/45 shadow-[0_28px_70px_rgba(249,115,22,0.22),inset_0_1.5px_2px_rgba(255,255,255,0.35),inset_0_8px_20px_rgba(255,255,255,0.08)] rounded-[32px]",
    innerCard: "bg-orange-900/25 border border-orange-400/35 backdrop-blur-md shadow-inner",
    accent: "text-amber-300",
    btn: "bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-neutral-950 font-bold shadow-[0_12px_32px_rgba(249,115,22,0.45)] hover:shadow-[0_16px_36px_rgba(249,115,22,0.6)] rounded-[20px]",
    glowOrb1: "radial-gradient(circle, rgba(245, 158, 11, 0.45) 0%, rgba(245, 158, 11, 0) 70%)",
    glowOrb2: "radial-gradient(circle, rgba(249, 115, 22, 0.35) 0%, rgba(249, 115, 22, 0) 70%)"
  },
  emerald: {
    bg: "bg-[#030907] text-[#FFFFFF]",
    card: "bg-emerald-950/35 backdrop-blur-[50px] border border-emerald-400/45 shadow-[0_28px_70px_rgba(16,185,129,0.22),inset_0_1.5px_2px_rgba(255,255,255,0.35),inset_0_8px_20px_rgba(255,255,255,0.08)] rounded-[32px]",
    innerCard: "bg-emerald-900/25 border border-emerald-400/35 backdrop-blur-md shadow-inner",
    accent: "text-emerald-300",
    btn: "bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 text-white font-bold shadow-[0_12px_32px_rgba(16,185,129,0.45)] hover:shadow-[0_16px_36px_rgba(16,185,129,0.6)] rounded-[20px]",
    glowOrb1: "radial-gradient(circle, rgba(16, 185, 129, 0.45) 0%, rgba(16, 185, 129, 0) 70%)",
    glowOrb2: "radial-gradient(circle, rgba(20, 184, 166, 0.35) 0%, rgba(20, 184, 166, 0) 70%)"
  },
  violet: {
    bg: "bg-[#06030c] text-[#FFFFFF]",
    card: "bg-purple-950/35 backdrop-blur-[50px] border border-purple-400/45 shadow-[0_28px_70px_rgba(168,85,247,0.22),inset_0_1.5px_2px_rgba(255,255,255,0.35),inset_0_8px_20px_rgba(255,255,255,0.08)] rounded-[32px]",
    innerCard: "bg-purple-900/25 border border-purple-400/35 backdrop-blur-md shadow-inner",
    accent: "text-purple-300",
    btn: "bg-gradient-to-r from-purple-600 via-indigo-600 to-fuchsia-600 text-white font-bold shadow-[0_12px_32px_rgba(168,85,247,0.45)] hover:shadow-[0_16px_36px_rgba(168,85,247,0.6)] rounded-[20px]",
    glowOrb1: "radial-gradient(circle, rgba(168, 85, 247, 0.45) 0%, rgba(168, 85, 247, 0) 70%)",
    glowOrb2: "radial-gradient(circle, rgba(99, 102, 241, 0.38) 0%, rgba(99, 102, 241, 0) 70%)"
  },
  ruby: {
    bg: "bg-[#0c0305] text-[#FFFFFF]",
    card: "bg-rose-950/35 backdrop-blur-[50px] border border-rose-400/45 shadow-[0_28px_70px_rgba(244,63,94,0.22),inset_0_1.5px_2px_rgba(255,255,255,0.35),inset_0_8px_20px_rgba(255,255,255,0.08)] rounded-[32px]",
    innerCard: "bg-rose-900/25 border border-rose-400/35 backdrop-blur-md shadow-inner",
    accent: "text-rose-300",
    btn: "bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 text-white font-bold shadow-[0_12px_32px_rgba(244,63,94,0.45)] hover:shadow-[0_16px_36px_rgba(244,63,94,0.6)] rounded-[20px]",
    glowOrb1: "radial-gradient(circle, rgba(244, 63, 94, 0.45) 0%, rgba(244, 63, 94, 0) 70%)",
    glowOrb2: "radial-gradient(circle, rgba(225, 29, 72, 0.35) 0%, rgba(225, 29, 72, 0) 70%)"
  },
  sapphire: {
    bg: "bg-[#03050c] text-[#FFFFFF]",
    card: "bg-blue-950/35 backdrop-blur-[50px] border border-blue-400/45 shadow-[0_28px_70px_rgba(37,99,235,0.22),inset_0_1.5px_2px_rgba(255,255,255,0.35),inset_0_8px_20px_rgba(255,255,255,0.08)] rounded-[32px]",
    innerCard: "bg-blue-900/25 border border-blue-400/35 backdrop-blur-md shadow-inner",
    accent: "text-blue-300",
    btn: "bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 text-white font-bold shadow-[0_12px_32px_rgba(37,99,235,0.45)] hover:shadow-[0_16px_36px_rgba(37,99,235,0.6)] rounded-[20px]",
    glowOrb1: "radial-gradient(circle, rgba(37, 99, 235, 0.45) 0%, rgba(37, 99, 235, 0) 70%)",
    glowOrb2: "radial-gradient(circle, rgba(79, 70, 229, 0.35) 0%, rgba(79, 70, 229, 0) 70%)"
  },
  default: {
    bg: "bg-[#06070a] text-[#FFFFFF]",
    card: "bg-white/[0.09] backdrop-blur-[50px] border border-white/25 shadow-[0_28px_70px_rgba(0,0,0,0.6),inset_0_1.5px_2px_rgba(255,255,255,0.35),inset_0_8px_20px_rgba(255,255,255,0.08)] rounded-[32px]",
    innerCard: "bg-white/[0.06] border border-white/15 backdrop-blur-md shadow-inner",
    accent: "text-sky-300",
    btn: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-[0_12px_32px_rgba(0,122,255,0.45)] rounded-[20px]",
    glowOrb1: "radial-gradient(circle, rgba(0, 122, 255, 0.42) 0%, rgba(0, 122, 255, 0) 70%)",
    glowOrb2: "radial-gradient(circle, rgba(56, 189, 248, 0.32) 0%, rgba(56, 189, 248, 0) 70%)"
  }
};

Object.entries(THEME_STYLES).forEach(([, theme]) => { if (!theme.accentText) theme.accentText = theme.accent; });

const DAY_MODE_OVERRIDES = {
  bg: "bg-[#eef2f8] text-[#0f172a]",
  card: "bg-white/70 backdrop-blur-[50px] border border-white/95 shadow-[0_24px_60px_rgba(15,23,42,0.1),inset_0_2px_3px_rgba(255,255,255,0.95),inset_0_8px_24px_rgba(255,255,255,0.6)] rounded-[32px]",
  innerCard: "bg-white/80 border border-slate-200/80 shadow-[0_4px_16px_rgba(15,23,42,0.04)]",
  accent: "text-blue-600 font-bold",
  accentText: "text-blue-600 font-bold",
  glowOrb1: "radial-gradient(circle, rgba(168, 85, 247, 0.22) 0%, rgba(168, 85, 247, 0) 70%)",
  glowOrb2: "radial-gradient(circle, rgba(56, 189, 248, 0.22) 0%, rgba(56, 189, 248, 0) 70%)"
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
    <div className="h-72 sm:h-84 overflow-hidden relative bg-neutral-950 flex items-center justify-center group rounded-[32px] shadow-[inset_0_0_25px_rgba(0,0,0,0.9)] transition-all duration-700 ease-out hover:scale-[1.02] border border-white/20">
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
  const [mediaAssets, setMediaAssets] = useState({});
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

  const topHeaderWrapperRef = useRef(null);
  const [headerOffsetHeight, setHeaderOffsetHeight] = useState(130);

  const canvasRef = useRef(null);
  const [generatedJpgUrl, setGeneratedJpgUrl] = useState(null);

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

    const guestRowsHeight = familyGuests.length * 84;
    canvas.width = 1200;
    canvas.height = Math.max(2600, 2150 + guestRowsHeight);

    const drawText = (text, x, y, size, weight = 'normal', color = '#ffffff', align = 'left', family = 'sans-serif') => {
      ctx.textAlign = align; ctx.fillStyle = color; ctx.font = `${weight} ${size}px ${family}`; ctx.fillText(String(text ?? ''), x, y);
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
      let lines = []; let curLine = '';
      for (let i = 0; i < words.length; i++) {
        const testLine = curLine + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && i > 0) { lines.push(curLine.trim()); curLine = words[i] + ' '; } 
        else { curLine = testLine; }
      }
      if (curLine.trim()) lines.push(curLine.trim());
      if (lines.length === 0) lines = [String(value || '')];

      const lineHeight = 24; const rowHeight = Math.max(54, 24 + (lines.length * lineHeight));
      ctx.fillStyle = options.bg || 'rgba(255,255,255,0.035)'; ctx.fillRect(90, y, 1020, rowHeight);
      drawText(label, 120, y + 34, options.labelSize || 18, 'bold', options.labelColor || '#94a3b8');
      lines.forEach((line, lIdx) => { drawText(line, 1080, y + 34 + (lIdx * lineHeight), options.valueSize || 18, 'bold', options.valueColor || '#ffffff', 'right'); });
      return y + rowHeight + (options.gap ?? 6);
    };

    const drawSectionTitle = (title, y, accent = '#7c3aed') => {
      ctx.fillStyle = accent === '#7c3aed' ? 'rgba(192,132,252,0.12)' : 'rgba(56,189,248,0.10)';
      ctx.fillRect(90, y, 1020, 56); drawText(title, 120, y + 36, 20, 'bold', accent); return y + 64;
    };

    const drawContent = (logoImageObj) => {
      ctx.fillStyle = '#09090b'; ctx.fillRect(0, 0, 1200, canvas.height);
      ctx.strokeStyle = '#c084fc'; ctx.lineWidth = 6; ctx.strokeRect(40, 40, 1120, canvas.height - 80);
      ctx.strokeStyle = 'rgba(124, 58, 237, 0.25)'; ctx.lineWidth = 2; ctx.strokeRect(55, 55, 1090, canvas.height - 110);

      if (logoImageObj) {
        try {
          ctx.save(); ctx.globalAlpha = 0.04; ctx.drawImage(logoImageObj, 300, 900, 600, 600); ctx.restore();
          ctx.save(); ctx.beginPath(); ctx.arc(140, 140, 60, 0, Math.PI * 2, true); ctx.closePath(); ctx.clip();
          ctx.drawImage(logoImageObj, 80, 80, 120, 120); ctx.restore();
          ctx.strokeStyle = '#c084fc'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(140, 140, 60, 0, Math.PI * 2, true); ctx.stroke();
        } catch (e) { console.warn('Canvas image draw security pass:', e); }
        drawText(config.studioName || 'H&F MAKEUP ARTIST', 230, 130, 44, 'bold', '#ffffff');
        drawText(config.artistTagline || 'Beauty, Styled Your Way', 230, 175, 22, 'bold', '#7c3aed');
      } else {
        drawText(config.studioName || 'H&F MAKEUP ARTIST', 600, 135, 50, 'bold', '#ffffff', 'center');
        drawText(config.artistTagline || 'Beauty, Styled Your Way', 600, 175, 22, 'bold', '#7c3aed', 'center');
      }

      ctx.strokeStyle = 'rgba(124, 58, 237, 0.2)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(90, 230); ctx.lineTo(1110, 230); ctx.stroke();
      drawText('⏳ OFFICIAL BOOKING REQUEST SLIP', 600, 290, 26, 'bold', '#fbbf24', 'center');

      const pkgText = config.kitText?.[calcKit]?.[calcPackage] || DEFAULT_KIT_TEXT[calcKit][calcPackage];
      const kitName = config.pricingByKit[calcKit]?.name || 'Luxury Kit'; const zone = config.convenienceZones[calcZone];

      let startY = 340;
      startY = drawRow('BOOKING NUMBER', bNumber || '#HF-PENDING', startY, { valueColor: '#7c3aed', mono: true });
      startY = drawRow('CLIENT NAME', clientName || 'Not Provided', startY);
      startY = drawRow('CONTACT NUMBER', clientPhone || 'Not Provided', startY);
      startY = drawRow('EVENT DATE', eventDate || 'Not Provided', startY);
      startY += 10;
      startY = drawSectionTitle('📍 VENUE DESTINATION & STRUCTURED ADDRESS', startY, '#0284c7');
      startY = drawRow('Address Type:', `[ ${addressType} ]`, startY, { valueColor: '#0284c7' });
      if (flatHouseNo.trim()) startY = drawDynamicRow('Flat / House No., Building:', flatHouseNo.trim(), startY);
      startY = drawDynamicRow('Street, Sector, Locality:', streetLocality.trim() || 'Not Provided', startY);
      if (landmark.trim()) startY = drawDynamicRow('Landmark:', landmark.trim(), startY);
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
      if (guestDiscountSavedAmount > 0) startY = drawRow(`• Extra Guest Discount (${guestDiscountPercent}%):`, `-₹${guestDiscountSavedAmount.toLocaleString('en-IN')}`, startY, { valueColor: '#16a34a', mono: true });
      if (appliedCoupon && couponDiscountAmount > 0) startY = drawRow(`• Coupon Code (${appliedCoupon.code}):`, `-₹${couponDiscountAmount.toLocaleString('en-IN')}`, startY, { valueColor: '#16a34a', mono: true });
      if (guestDiscountSavedAmount === 0 && (!appliedCoupon || couponDiscountAmount === 0)) startY = drawRow('• No discounts applied', '₹0', startY, { valueColor: '#71717a', mono: true });
      startY = drawRow('Total Discounts:', `-₹${(guestDiscountSavedAmount + couponDiscountAmount).toLocaleString('en-IN')}`, startY, { labelColor: '#16a34a', valueColor: '#16a34a', mono: true });

      startY += 18;
      ctx.fillStyle = 'rgba(192,132,252,0.20)'; ctx.fillRect(90, startY, 1020, 115);
      ctx.strokeStyle = '#c084fc'; ctx.lineWidth = 3; ctx.strokeRect(90, startY, 1020, 115);

      drawText('FINAL AMOUNT PAYABLE', 600, startY + 38, 22, 'bold', '#e2e8f0', 'center');
      drawText(`₹${finalEstimate.toLocaleString('en-IN')}`, 600, startY + 92, 48, 'bold', '#ffffff', 'center', 'serif');

      const footerY = canvas.height - 75;
      drawText(`Studio Base Location: ${config.baseLocation} • Instagram: @${(config.instagramHandle || '').replace('@','')}`, 600, footerY, 17, 'normal', '#94a3b8', 'center');
      drawText(config.artistTagline || 'Beauty, Styled Your Way', 600, footerY + 32, 18, 'italic', '#7c3aed', 'center');

      try {
        const jpgUrl = canvas.toDataURL('image/jpeg', 0.95);
        setGeneratedJpgUrl(jpgUrl);
      } catch (e) {
        console.warn('Canvas export skipped:', e);
      }
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
      } catch (tgErr) { console.warn('Telegram notification silent skip:', tgErr); }

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
  const baseThemeStyle = THEME_STYLES[rawThemeKey] || THEME_STYLES.real_glass_lens;
  const activeThemeStyle = isDarkMode ? baseThemeStyle : { ...baseThemeStyle, ...DAY_MODE_OVERRIDES };
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
      <div style={{ fontFamily: currentFontFamily }} className={`min-h-screen ${activeThemeStyle.bg} flex items-center justify-center p-4 relative overflow-hidden transition-all duration-700 ease-in-out`}>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ background: activeThemeStyle.glowOrb1 }} />
        <div className={`max-w-md w-full ${activeThemeStyle.card} p-8 text-center space-y-4 shadow-2xl relative z-10`}>
          <div className="w-14 h-14 rounded-[24px] bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-400/40 shadow-[0_0_30px_rgba(245,158,11,0.3)]">
            <Wrench className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-mono tracking-wider text-amber-300 bg-amber-500/20 px-3 py-1.5 rounded-full inline-block font-bold border border-amber-400/40">Scheduled System Upgrade</span>
            <h2 className="text-xl font-bold tracking-tight">We'll Be Back Shortly</h2>
            <p className="text-xs opacity-85 leading-relaxed font-medium">We are currently fine-tuning our luxury digital experience and updating reservation systems. We appreciate your patience.</p>
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
      className={`hf-app min-h-screen ${activeThemeStyle.bg} relative transition-all duration-700 ease-in-out overflow-x-hidden`}
      onContextMenu={(e) => e.preventDefault()}
    >
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        button, a, input, select, textarea, [role="button"] { -webkit-tap-highlight-color: transparent; }
        
        /* Ultra Smooth Day/Night & Element Transitions */
        .hf-app,
        .hf-app * {
          transition: background-color 0.6s cubic-bezier(0.4, 0, 0.2, 1),
                      border-color 0.6s cubic-bezier(0.4, 0, 0.2, 1),
                      color 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                      box-shadow 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        button, a { 
          will-change: transform, opacity;
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), 
                      opacity 0.25s ease, 
                      background 0.5s ease,
                      box-shadow 0.4s ease !important; 
        }
        
        select option { background-color: #090a0f; color: #ffffff; }
        html, body, #root { min-height: 100%; width: 100%; margin: 0; }
        html { overflow-x: hidden; scroll-behavior: smooth; }
        body { overflow-x: hidden; }

        /* Liquid Organic Ambient Glowing Lights */
        .hf-mesh-glow {
          position: fixed;
          pointer-events: none;
          z-index: 0;
          border-radius: 9999px;
          filter: blur(100px);
          transform: translate3d(0,0,0);
          will-change: transform;
          animation: hfLiquidFloat 18s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate;
        }
        @keyframes hfLiquidFloat {
          0% { transform: scale(1) translate(0px, 0px) rotate(0deg); }
          50% { transform: scale(1.25) translate(60px, 40px) rotate(180deg); }
          100% { transform: scale(0.95) translate(-40px, 20px) rotate(360deg); }
        }

        /* Seamless Continuous Running Marquee */
        .hf-marquee-track {
          display: flex;
          width: max-content;
          animation: hfRunMarquee 24s linear infinite;
        }
        .hf-marquee-track:hover {
          animation-play-state: paused;
        }
        @keyframes hfRunMarquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }

        /* Smooth Tab Entrance */
        .hf-tab-enter {
          animation: hfFadeScale 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes hfFadeScale {
          0% { opacity: 0; transform: scale(0.98) translateY(16px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }

        /* Ambient Glow Highlights */
        .hf-app[data-hf-mode="night"] h1,
        .hf-app[data-hf-mode="night"] h2,
        .hf-app[data-hf-mode="night"] h3,
        .hf-app[data-hf-mode="night"] h4,
        .hf-app[data-hf-mode="night"] .font-mono {
          text-shadow: 0 0 20px rgba(255, 255, 255, 0.15);
        }

        /* Modals & Backdrop Blur */
        .hf-modal-backdrop { 
          position: fixed; inset: 0; z-index: 90; display: flex; align-items: center; justify-content: center; 
          padding: max(16px, env(safe-area-inset-top)) 16px max(16px, env(safe-area-inset-bottom)); 
          background: rgba(0, 0, 0, 0.75); backdrop-filter: blur(35px); -webkit-backdrop-filter: blur(35px); overflow-y: auto; 
        }
        .hf-modal-card { width: min(100%, 560px); max-height: min(88dvh, 760px); overflow-y: auto; margin: auto; }

        .hf-floating-banner { 
          position: fixed; bottom: calc(84px + env(safe-area-inset-bottom)); right: max(12px, env(safe-area-inset-right)); 
          width: min(360px, calc(100vw - 24px)); z-index: 40;
        }
        @media (min-width: 640px) { .hf-floating-banner { bottom: 24px; right: 24px; width: 340px; } }

        .hf-bottom-nav { 
          position: fixed; bottom: max(12px, env(safe-area-inset-bottom)); left: 50%; transform: translateX(-50%); 
          width: calc(100% - 24px); max-width: 520px; padding: 6px; border-radius: 9999px !important; 
          backdrop-filter: blur(50px); -webkit-backdrop-filter: blur(50px);
          box-shadow: 0 20px 50px rgba(0,0,0,0.5), inset 0 1.5px 2px rgba(255,255,255,0.35); z-index: 50;
        }
        .hf-bottom-nav button { min-height: 48px; border-radius: 9999px !important; }
      `}</style>

      {/* DYNAMIC LIQUID GLASS RADIANT GLOW LIGHTS */}
      <div className="hf-mesh-glow w-[600px] h-[600px] -top-28 -left-28 opacity-70" style={{ background: activeThemeStyle.glowOrb1 }} />
      <div className="hf-mesh-glow w-[550px] h-[550px] top-1/3 -right-28 opacity-60" style={{ background: activeThemeStyle.glowOrb2, animationDelay: '-7s' }} />
      <div className="hf-mesh-glow w-[650px] h-[650px] -bottom-36 left-1/4 opacity-50" style={{ background: activeThemeStyle.glowOrb1, animationDelay: '-12s' }} />

      {showSplash && (
        <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center ${activeThemeStyle.bg} transition-opacity duration-1000 ${splashFade ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="flex flex-col items-center space-y-4 px-4 text-center">
            <div className={`w-24 h-24 rounded-[28px] overflow-hidden ${activeThemeStyle.card} p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-pulse`}>
              <img src={resolvedLogoUrl} alt="Studio Logo" onError={() => setLogoLoadFailed(true)} className="w-full h-full object-contain rounded-[24px]" />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-black tracking-tight">{config.studioName || 'H&F Makeup Artist'}</h1>
              <p className={`text-xs ${activeThemeStyle.accentText} font-bold uppercase tracking-widest`}>{config.artistTagline || 'Beauty, Styled Your Way'}</p>
            </div>
          </div>
        </div>
      )}

      {showShareModal && (
        <div className="hf-modal-backdrop">
          <div className={`hf-modal-card ${activeThemeStyle.card} p-7 text-center space-y-5 shadow-2xl hf-tab-enter`}>
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm flex items-center gap-2"><Share2 className={`w-4 h-4 ${activeThemeStyle.accentText}`} /> Share Studio Lookbook</span>
              <button onClick={() => setShowShareModal(false)} className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 opacity-80 hover:opacity-100 transition-all duration-300"><X className="w-4 h-4" /></button>
            </div>
            <div className="w-44 h-44 mx-auto bg-white p-3 rounded-[28px] border-2 border-white/40 flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
              <img src={qrCodeApiUrl} alt="App QR Code" className="w-full h-full object-contain rounded-[16px]" />
            </div>
            <p className="text-xs font-semibold opacity-85">Scan this QR code with any camera or scanner to explore the portfolio & book instantly.</p>
            <div className="flex gap-2.5 pt-1">
              <button onClick={handleCopyLink} className="flex-1 py-3 rounded-[18px] bg-white/10 hover:bg-white/20 text-xs font-bold flex items-center justify-center gap-2 border border-white/25 shadow-md active:scale-95 transition-all">
                {copiedLink ? <CheckCheck className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 opacity-80" />}
                <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
              </button>
              <a href={qrCodeApiUrl} download="HF_Studio_QR.png" target="_blank" rel="noreferrer" className={`px-6 py-3 rounded-[18px] ${activeThemeStyle.btn} text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95`}>
                <Download className="w-4 h-4" /> <span>Save QR</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {viewingPackage && (
        <div className="hf-modal-backdrop">
          <div className={`hf-modal-card ${activeThemeStyle.card} p-6 sm:p-7 space-y-5 shadow-2xl hf-tab-enter`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-400/30">
                  <Crown className={`w-4 h-4 text-amber-300`} />
                </div>
                <h3 className="font-bold text-base sm:text-lg">{viewingPackage.name}</h3>
              </div>
              <button onClick={() => setViewingPackage(null)} className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 opacity-80 hover:opacity-100 transition-all"><X className="w-4 h-4" /></button>
            </div>
            <div className="w-full h-44 sm:h-52 rounded-[24px] overflow-hidden bg-black/20 border border-white/25 shadow-inner relative">
              <img src={viewingPackage.image} alt={viewingPackage.name} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[11px] font-bold text-amber-300">
                {selectedKit === 'international' ? '👑 Luxury Tier' : '✨ HD Classic'}
              </div>
            </div>
            <p className="text-xs sm:text-sm opacity-90 leading-relaxed font-medium">{viewingPackage.desc}</p>
            <div className={`space-y-2.5 text-xs ${activeThemeStyle.innerCard} p-4 rounded-[22px]`}>
              <div className="flex justify-between items-center"><span className="opacity-75 font-medium">Vanity Tier:</span><strong className="font-bold">{config.pricingByKit[selectedKit]?.name}</strong></div>
              <div className="flex justify-between items-center"><span className="opacity-75 font-medium">Skin Finish:</span><span className="font-semibold">{viewingPackage.skinFinish}</span></div>
              <div className="flex justify-between items-center"><span className="opacity-75 font-medium">Includes:</span><span className="font-semibold">{viewingPackage.includes}</span></div>
              <div className="flex justify-between items-center font-bold text-sm pt-2 border-t border-white/15">
                <span>Investment Rate:</span>
                <span className={`${activeThemeStyle.accentText} font-mono text-base font-black`}>₹{(config.pricingByKit?.[selectedKit]?.[viewingPackage.key] || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>
            <button onClick={() => { setCalcPackage(viewingPackage.key); setCalcKit(selectedKit); setViewingPackage(null); setActiveTab('calculator'); }} className={`w-full py-4 ${activeThemeStyle.btn} text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-2 shadow-xl`}>
              <span>Estimate & Book This Look</span> <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TOP HEADER WRAPPER (TICKER + NAVBAR) WITH DYNAMIC HEIGHT REF */}
      <div ref={topHeaderWrapperRef} className="fixed top-0 inset-x-0 z-40">
        {/* TOP RUNNING MARQUEE TICKER */}
        {!showSplash && config.toggles?.enableAnnouncements !== false && config.showOfferSection !== false && (
          <div className={`w-full py-2 px-3 overflow-hidden text-[11px] font-bold border-b shadow-md backdrop-blur-[50px] ${isDarkMode ? 'bg-black/50 border-white/15 text-white' : 'bg-white/80 border-slate-300 text-slate-900'}`}>
            <div className="overflow-hidden whitespace-nowrap w-full flex items-center">
              <div className="hf-marquee-track flex items-center">
                {/* 1st copy of announcements */}
                {(config.announcements && config.announcements.length > 0 ? config.announcements : [
                  "🌟 Book Bridal Makeup for 2026-2027 Season & Get Complimentary Pre-Bridal Skin Consultation",
                  "✨ Flat 15% OFF on Family & Guest Makeovers with Main Bridal Package",
                  "💄 Certified International Makeup Artist • 100% Genuine Luxury Vanity Products (Dior, Charlotte Tilbury, Huda Beauty)"
                ]).map((ann, idx) => (
                  <span key={`a1-${idx}`} className="mx-8 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_10px_#ec4899] animate-pulse" />
                    <span>{ann}</span>
                  </span>
                ))}
                {/* 2nd copy for seamless continuous loop */}
                {(config.announcements && config.announcements.length > 0 ? config.announcements : [
                  "🌟 Book Bridal Makeup for 2026-2027 Season & Get Complimentary Pre-Bridal Skin Consultation",
                  "✨ Flat 15% OFF on Family & Guest Makeovers with Main Bridal Package",
                  "💄 Certified International Makeup Artist • 100% Genuine Luxury Vanity Products (Dior, Charlotte Tilbury, Huda Beauty)"
                ]).map((ann, idx) => (
                  <span key={`a2-${idx}`} className="mx-8 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_10px_#ec4899] animate-pulse" />
                    <span>{ann}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FIXED LIQUID GLASS HEADER */}
        <header className={`w-full px-4 sm:px-8 py-3.5 ${activeThemeStyle.card} !rounded-none !border-x-0 !border-t-0 backdrop-blur-[60px] shadow-2xl transition-all duration-500`}>
          <div className="max-w-5xl mx-auto flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3.5 select-none cursor-pointer min-w-0">
                {config.toggles?.showLogoOnApp !== false && (
                  <div className="w-11 h-11 rounded-[18px] overflow-hidden shrink-0 border-2 border-white/40 bg-white/10 flex items-center justify-center shadow-lg p-0.5">
                    <img src={resolvedLogoUrl} alt="Logo" onError={() => setLogoLoadFailed(true)} className="w-full h-full object-cover rounded-[14px]" draggable="false" />
                  </div>
                )}
                <div className="truncate">
                  <h1 className="font-extrabold text-base sm:text-lg truncate tracking-tight">{config.studioName || 'H&F Makeup Artist'}</h1>
                  <p className={`text-[11px] ${activeThemeStyle.accentText} flex items-center gap-1.5 truncate font-bold uppercase tracking-wider`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
                    <span className="truncate">{config.artistTagline || 'Beauty, Styled Your Way'}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => setShowShareModal(true)} title="Share & QR Code" className="p-2.5 rounded-[18px] border border-white/30 bg-white/10 hover:bg-white/20 transition-all duration-300 flex items-center justify-center shadow-sm active:scale-95">
                  <QrCode className="w-4 h-4" />
                </button>

                <button onClick={toggleTheme} title="Toggle Day/Night Mode" className="p-2.5 rounded-[18px] border border-white/30 bg-white/10 hover:bg-white/20 transition-all duration-300 flex items-center justify-center shadow-sm active:scale-95">
                  {isDarkMode ? <Sun className="w-4 h-4 text-amber-300 animate-spin-slow" /> : <Moon className="w-4 h-4 text-indigo-600" />}
                </button>

                <a href={getCleanInstagramUrl(config.instagramHandle)} target="_blank" rel="noopener noreferrer" className={`flex items-center space-x-2 ${activeThemeStyle.btn} text-xs font-bold px-4 py-2.5 transition-all duration-300 active:scale-95 shadow-lg`}>
                  <Camera className="w-4 h-4 shrink-0" />
                  <span className="hidden sm:inline">Instagram</span>
                </a>

                {shouldShowProfileInHeader && (
                  <div className="w-10 h-10 rounded-[18px] border-2 border-white/40 overflow-hidden shrink-0 shadow-md p-0.5">
                    <img src={resolvedAvatar} alt="Artist Profile" onError={() => setImgLoadFailed(true)} className="w-full h-full object-cover rounded-[14px]" />
                  </div>
                )}
              </div>
            </div>

            <div className="hidden sm:flex w-full items-center justify-center pt-0.5">
              <nav className="inline-flex space-x-1.5 p-1.5 rounded-full border border-white/30 bg-black/15 text-xs font-bold shadow-inner backdrop-blur-[50px]">
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
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full transition-all duration-300 ease-out ${isActive ? `${activeThemeStyle.btn} font-extrabold shadow-lg` : 'opacity-75 hover:opacity-100 hover:bg-white/15'}`}>
                      <Icon className="w-4 h-4 shrink-0" /><span>{tab.label}</span>
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
        <nav aria-label="Mobile Navigation" className={`hf-bottom-nav ${activeThemeStyle.card} sm:hidden flex items-center justify-around border border-white/40 shadow-[0_24px_60px_rgba(0,0,0,0.6)] backdrop-blur-[60px]`}>
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
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 flex flex-col items-center justify-center py-2 rounded-full transition-all duration-300 ease-out ${isActive ? `${activeThemeStyle.accentText} font-black bg-white/20 shadow-inner scale-105` : 'opacity-70 hover:opacity-100'}`}>
                <Icon className="w-4 h-4 shrink-0" /><span className="text-[10px] mt-0.5 font-bold">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      )}

      {/* MAIN CONTAINER WITH DYNAMIC PADDING TO PREVENT OVERLAP */}
      <main 
        style={{ paddingTop: `${headerOffsetHeight + 24}px` }} 
        className="max-w-5xl mx-auto px-4 sm:px-6 pb-32 sm:pb-24 relative z-10 transition-all duration-300"
      >
        {activeTab === 'menu' && (
          <div className="space-y-7 hf-tab-enter">
            <div className="text-center max-w-xl mx-auto space-y-2.5">
              <span className={`px-4 py-1.5 rounded-full bg-white/15 border border-white/35 ${activeThemeStyle.accentText} text-xs font-bold inline-flex items-center gap-1.5 shadow-md backdrop-blur-2xl`}>
                <Sparkles className="w-3.5 h-3.5" /> Professional Vanity Packages
              </span>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight">Curated Makeup Menu</h2>
              <p className="text-xs sm:text-sm font-medium opacity-80">Select your preferred vanity tier below to view package pricing & details:</p>

              <div className="inline-flex p-1.5 rounded-full bg-black/20 border border-white/30 mt-2 gap-2 shadow-inner backdrop-blur-[50px]">
                <button onClick={() => setSelectedKit('international')} className={`px-6 py-3 rounded-full text-xs font-extrabold transition-all duration-300 ease-out ${selectedKit === 'international' ? `${activeThemeStyle.btn} shadow-lg scale-105` : 'opacity-75 hover:opacity-100 hover:bg-white/10'}`}>👑 Luxury Kit</button>
                <button onClick={() => setSelectedKit('drugstore')} className={`px-6 py-3 rounded-full text-xs font-extrabold transition-all duration-300 ease-out ${selectedKit === 'drugstore' ? `${activeThemeStyle.btn} shadow-lg scale-105` : 'opacity-75 hover:opacity-100 hover:bg-white/10'}`}>✨ HD Kit</button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {Object.keys(config.kitText?.[selectedKit] || {}).map((key) => {
                const item = config.kitText?.[selectedKit]?.[key] || DEFAULT_KIT_TEXT[selectedKit][key];
                const price = config.pricingByKit?.[selectedKit]?.[key] || 0;
                const imgSrc = config.kitImages?.[selectedKit]?.[key] || DEFAULT_KIT_IMAGES[selectedKit][key];

                if (!item.name) return null;

                return (
                  <div key={`${selectedKit}_${key}`} className={`${activeThemeStyle.card} p-5 flex flex-col sm:flex-row gap-5 items-center transition-all duration-400 ease-out hover:scale-[1.02] hover:shadow-[0_30px_70px_rgba(0,0,0,0.5)]`}>
                    <div className="w-full sm:w-40 h-44 sm:h-40 shrink-0 rounded-[26px] overflow-hidden bg-white/10 relative border-2 border-white/35 shadow-inner">
                      <img src={imgSrc} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
                      <div className="absolute top-2.5 left-2.5 px-3 py-1 rounded-full bg-black/70 text-[10px] font-mono font-extrabold text-amber-300 backdrop-blur-md border border-white/30 shadow-md">
                        {selectedKit === 'international' ? '👑 Luxury' : '✨ HD Classic'}
                      </div>
                    </div>
                    <div className="flex-1 w-full flex flex-col justify-between space-y-2.5">
                      <div>
                        <div className="flex justify-between items-baseline gap-2">
                          <h4 className="font-extrabold text-base sm:text-lg leading-tight">{item.num ? `${item.num}. ` : ''}{item.name}</h4>
                          <span className={`font-mono font-black text-base sm:text-lg ${activeThemeStyle.accentText} shrink-0 drop-shadow-sm`}>₹{price.toLocaleString('en-IN')}</span>
                        </div>
                        <p className="text-xs font-medium opacity-85 mt-2 line-clamp-2 leading-relaxed">{item.desc}</p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-white/20">
                        <span className="text-[11px] font-bold opacity-90 truncate flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" /> 16HR HD Finish
                        </span>
                        <div className="flex items-center gap-2">
                          <button onClick={() => setViewingPackage({ key, ...item, image: imgSrc })} className="px-4 py-2.5 rounded-full border border-white/35 bg-white/15 text-xs font-bold hover:bg-white/25 transition-all shadow-sm active:scale-95">Details</button>
                          <button onClick={() => { setCalcPackage(key); setCalcKit(selectedKit); setActiveTab('calculator'); }} className={`px-5 py-2.5 ${activeThemeStyle.btn} text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 shadow-md`}>
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
          <div className="space-y-7 hf-tab-enter">
            <div className="text-center max-w-xl mx-auto space-y-2.5">
              <span className={`px-4 py-1.5 rounded-full bg-white/15 border border-white/35 ${activeThemeStyle.accentText} text-xs font-bold inline-flex items-center gap-1.5 shadow-md backdrop-blur-2xl`}>
                <Camera className="w-3.5 h-3.5" /> Discover Looks
              </span>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight">Featured Transformations</h2>
              <p className="text-xs sm:text-sm font-medium opacity-80">Explore signature makeup transformations crafted with precision and artistry.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {(config.galleryPhotos || DEFAULT_GALLERY).map((item, idx) => {
                const isVideo = isVideoMedia(item);
                return (
                  <div key={idx} className={`${activeThemeStyle.card} overflow-hidden flex flex-col justify-between transition-all duration-400 ease-out hover:scale-[1.03] hover:shadow-2xl p-1.5`}>
                    {isVideo ? <AutoPlayVideoCard item={item} /> : (
                      <div className="h-72 sm:h-80 overflow-hidden relative bg-white/5 rounded-[28px] border border-white/25 shadow-inner">
                        <img src={item.url} alt={item.title} className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent flex flex-col justify-end p-5 text-white">
                          <span className="text-[11px] uppercase font-mono font-bold text-cyan-300 drop-shadow-md">{item.sub || 'Client Transformation'}</span>
                          <h4 className="font-extrabold text-sm sm:text-base mt-1 text-white drop-shadow-lg"><span>{item.title}</span></h4>
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
          <div className="space-y-7 hf-tab-enter">
            <div className="text-center max-w-xl mx-auto space-y-2.5">
              <span className={`px-4 py-1.5 rounded-full bg-white/15 border border-white/35 ${activeThemeStyle.accentText} text-xs font-bold inline-flex items-center gap-1.5 shadow-md backdrop-blur-2xl`}>
                <Star className="w-3.5 h-3.5" /> Authentic Vanity
              </span>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight">Products In Our Kit</h2>
              <p className="text-xs sm:text-sm font-medium opacity-80">100% Genuine, skin-safe international luxury cosmetics used for all makeovers.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {(config.internationalBrands || DEFAULT_BRANDS).map((brand, idx) => (
                <div key={idx} className={`${activeThemeStyle.card} p-6 space-y-3.5 transition-all duration-400 ease-out hover:scale-[1.03] hover:shadow-2xl`}>
                  <span className={`text-[10px] font-extrabold ${activeThemeStyle.accentText} bg-amber-500/20 border border-amber-400/40 uppercase px-3 py-1.5 rounded-full font-mono inline-block shadow-sm`}>{brand.category}</span>
                  <h4 className="font-extrabold text-base sm:text-lg">{brand.name}</h4>
                  <p className="text-xs font-medium opacity-85 leading-relaxed">{brand.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'calculator' && config.toggles?.enableEstimator !== false && (
          <div className="max-w-4xl mx-auto hf-tab-enter">
            {isBookingDone ? (
              <div className={`${activeThemeStyle.card} p-8 sm:p-12 text-center space-y-6 shadow-2xl max-w-lg mx-auto`}>
                <div className="w-20 h-20 rounded-[28px] bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border-2 border-emerald-400/40 shadow-[0_0_35px_rgba(16,185,129,0.3)]">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="inline-block px-6 py-2.5 rounded-full bg-white/20 border border-white/40 font-mono font-black text-xs shadow-inner tracking-wider">
                  BOOKING NUMBER: {currentBookingNumber}
                </div>
                <h3 className="text-2xl font-black">Booking Request Submitted!</h3>
                <p className="text-xs sm:text-sm opacity-90 leading-relaxed font-medium">Your appointment request has been recorded securely. Our team will coordinate with you shortly to confirm timings.</p>
                {generatedJpgUrl && (
                  <div className="pt-2">
                    <a href={generatedJpgUrl} download={`Booking_Receipt_${currentBookingNumber}.jpg`} className={`px-8 py-4 rounded-full ${activeThemeStyle.btn} font-extrabold inline-flex items-center gap-2.5 text-sm transition-all shadow-2xl active:scale-95`}>
                      <Download className="w-5 h-5" /> <span>Download Official Slip (.JPG)</span>
                    </a>
                  </div>
                )}
                <button onClick={() => setIsBookingDone(false)} className="block w-full py-4 bg-white/10 hover:bg-white/20 text-xs font-bold rounded-full border border-white/30 transition-all active:scale-95 shadow-md">Make Another Calculation / Booking</button>
              </div>
            ) : (
              <form onSubmit={handleDirectEstimateBooking} className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* LEFT COLUMN: OPTIONS & CLIENT INFO */}
                <div className={`md:col-span-7 ${activeThemeStyle.card} p-6 sm:p-8 space-y-6 shadow-2xl`}>
                  <div className="border-b border-white/20 pb-3.5">
                    <h3 className="font-extrabold text-base sm:text-lg flex items-center gap-2.5">
                      <Calculator className={`w-5 h-5 ${activeThemeStyle.accentText}`} /> 1. Calculate & Choose Looks
                    </h3>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider mb-2 opacity-90">Main Makeover Package: Vanity Tier</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button type="button" onClick={() => setCalcKit('international')} className={`p-4 rounded-[22px] text-xs font-extrabold border text-center transition-all duration-300 shadow-sm ${calcKit === 'international' ? `${activeThemeStyle.btn} shadow-lg scale-102` : 'bg-white/10 border-white/30 opacity-80 hover:opacity-100 hover:bg-white/15'}`}>👑 Luxury Kit</button>
                      <button type="button" onClick={() => setCalcKit('drugstore')} className={`p-4 rounded-[22px] text-xs font-extrabold border text-center transition-all duration-300 shadow-sm ${calcKit === 'drugstore' ? `${activeThemeStyle.btn} shadow-lg scale-102` : 'bg-white/10 border-white/30 opacity-80 hover:opacity-100 hover:bg-white/15'}`}>✨ HD Kit</button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider mb-2 opacity-90">Main Makeover Package: Package</label>
                    <select value={calcPackage} onChange={(e) => setCalcPackage(e.target.value)} className="w-full bg-black/20 border-2 border-white/30 rounded-[20px] px-4 py-3.5 text-sm font-bold shadow-inner outline-none transition-all duration-300 focus:bg-black/30 focus:border-white/60">
                      {Object.keys(config.kitText?.[calcKit] || {}).map(k => {
                        const pData = config.kitText[calcKit][k];
                        const pPrice = config.pricingByKit?.[calcKit]?.[k] || 0;
                        return <option key={k} value={k}>{pData.num ? `${pData.num}. ` : ''}{pData.name} (₹{pPrice.toLocaleString('en-IN')})</option>;
                      })}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider mb-2 opacity-90">Venue Location Zone</label>
                    <select value={calcZone} onChange={(e) => setCalcZone(e.target.value)} className="w-full bg-black/20 border-2 border-white/30 rounded-[20px] px-4 py-3.5 text-sm font-bold shadow-inner outline-none transition-all duration-300 focus:bg-black/30 focus:border-white/60">
                      {Object.entries(config.convenienceZones).map(([key, zone]) => (
                        <option key={key} value={key}>{zone.name} (+₹{zone.fee})</option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-4 border-t border-white/20 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-extrabold text-xs uppercase tracking-wider flex items-center gap-2">
                          <Users className={`w-4 h-4 ${activeThemeStyle.accentText}`} /> Extra Family Makeup Customizer
                        </h4>
                        <p className="text-[11px] font-medium opacity-80 mt-0.5">Customize individual vanity tier & look for each family guest.</p>
                      </div>
                      <button type="button" onClick={handleAddFamilyGuest} className="px-4 py-2.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/35 text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-sm active:scale-95">
                        <Plus className="w-4 h-4" /> Add Guest
                      </button>
                    </div>

                    {isGuestDiscountActive && guestDiscountPercent > 0 && (
                      <div className="p-4 rounded-[22px] bg-emerald-500/20 border-2 border-emerald-400/40 flex items-center justify-between text-xs shadow-inner">
                        <div className="flex items-center gap-2.5">
                          <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                          <p className="text-emerald-300 font-extrabold">Flat {guestDiscountPercent}% Extra Family Makeup Discount Active!</p>
                        </div>
                        <span className="font-mono font-black text-emerald-300 bg-emerald-500/30 px-3 py-1 rounded-full text-[10px] shadow-sm">{guestDiscountPercent}% OFF</span>
                      </div>
                    )}

                    {familyGuests.length > 0 && (
                      <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                        {familyGuests.map((guest, idx) => {
                          const rawGuestPrice = config.pricingByKit[guest.kit]?.[guest.packageKey] || 2500;
                          return (
                            <div key={guest.id} className={`p-4 rounded-[22px] ${activeThemeStyle.innerCard} space-y-3 shadow-sm border border-white/25`}>
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-extrabold">Guest #{idx + 1}</span>
                                <div className="flex items-center gap-2.5">
                                  <span className={`text-sm font-black font-mono ${activeThemeStyle.accentText}`}>₹{rawGuestPrice.toLocaleString('en-IN')}</span>
                                  <button type="button" onClick={() => handleRemoveFamilyGuest(guest.id)} className="p-1.5 text-rose-400 hover:bg-rose-500/20 rounded-full transition-all"><Trash2 className="w-4 h-4" /></button>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[10px] font-bold opacity-80 mb-1.5">Vanity Tier</label>
                                  <select value={guest.kit} onChange={(e) => handleUpdateFamilyGuest(guest.id, 'kit', e.target.value)} className="w-full p-3 rounded-[16px] text-xs font-bold bg-black/30 border border-white/25 outline-none focus:border-white/60 transition-all">
                                    <option value="international">👑 Luxury Kit</option>
                                    <option value="drugstore">✨ HD Kit</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold opacity-80 mb-1.5">Package Look</label>
                                  <select value={guest.packageKey} onChange={(e) => handleUpdateFamilyGuest(guest.id, 'packageKey', e.target.value)} className="w-full p-3 rounded-[16px] text-xs font-bold bg-black/30 border border-white/25 outline-none focus:border-white/60 transition-all">
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
                    <div className="pt-4 border-t border-white/20 space-y-2.5">
                      <label className="block text-xs font-black uppercase tracking-wider flex items-center gap-1.5 opacity-90">
                        <Tag className={`w-4 h-4 ${activeThemeStyle.accentText}`} /> Promo Coupon Code
                      </label>
                      {appliedCoupon ? (
                        <div className={`${activeThemeStyle.innerCard} rounded-[22px] p-4 flex items-center justify-between gap-3 shadow-inner border border-white/25`}>
                          <div>
                            <span className="text-xs font-black font-mono">CODE: {appliedCoupon.code} APPLIED</span>
                            <p className="text-[11px] opacity-90 font-bold mt-0.5 text-emerald-400">🎉 {appliedCoupon.type === 'percent' ? `${appliedCoupon.value}% OFF` : `Flat ₹${appliedCoupon.value} OFF`}</p>
                          </div>
                          <button type="button" onClick={() => { setAppliedCoupon(null); setCouponInput(''); }} className="text-rose-400 text-xs font-bold hover:underline transition-all">Remove</button>
                        </div>
                      ) : (
                        <div className="flex gap-2.5">
                          <input type="text" placeholder="e.g. BRIDE2026" value={couponInput} onChange={(e) => setCouponInput(e.target.value.toUpperCase())} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleApplyCoupon(e); } }} className="flex-1 bg-black/20 border-2 border-white/30 rounded-[20px] px-4 py-3.5 text-sm uppercase font-mono font-bold outline-none shadow-inner transition-all focus:bg-black/30 focus:border-white/60" />
                          <button type="button" onClick={handleApplyCoupon} className={`px-6 py-3.5 ${activeThemeStyle.btn} text-xs font-bold rounded-full transition-all shadow-md active:scale-95`}>Apply</button>
                        </div>
                      )}
                      {couponError && <p className="text-[11px] text-rose-400 font-bold">{couponError}</p>}
                    </div>
                  )}

                  <div className="pt-4 border-t border-white/20 space-y-4">
                    <h4 className="font-extrabold text-xs uppercase tracking-wider flex items-center gap-2">
                      <User className={`w-4 h-4 ${activeThemeStyle.accentText}`} /> 2. Enter Client Details
                    </h4>
                    <div>
                      <label className="block text-xs font-bold opacity-85 mb-1.5">Full Name *</label>
                      <input type="text" required placeholder="e.g. Aliza Khan" value={clientName} onChange={(e) => setClientName(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }} className="w-full px-4 py-3.5 rounded-[20px] bg-black/20 border-2 border-white/30 text-sm font-semibold shadow-inner outline-none transition-all focus:bg-black/30 focus:border-white/60" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold opacity-85 mb-1.5">Contact Phone *</label>
                        <input type="tel" required placeholder="e.g. 9876543210" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }} className="w-full px-4 py-3.5 rounded-[20px] bg-black/20 border-2 border-white/30 text-sm font-mono font-bold shadow-inner outline-none transition-all focus:bg-black/30 focus:border-white/60" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold opacity-85 mb-1.5">Event Date *</label>
                        <input type="date" required value={eventDate} onChange={(e) => setEventDate(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }} className="w-full px-4 py-3.5 rounded-[20px] bg-black/20 border-2 border-white/30 text-sm font-mono font-bold shadow-inner outline-none transition-all focus:bg-black/30 focus:border-white/60" />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/20 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <h4 className="font-extrabold text-xs uppercase tracking-wider flex items-center gap-2">
                          <MapPin className={`w-4 h-4 ${activeThemeStyle.accentText}`} /> 3. Destination Venue & Address
                        </h4>
                        <div className="flex items-center gap-2">
                          {['Home', 'Work'].map((type) => (
                            <button key={type} type="button" onClick={() => setAddressType(type)} className={`px-4 py-2 rounded-full text-[10px] font-extrabold border transition-all ${addressType === type ? `${activeThemeStyle.btn} shadow-md` : 'bg-white/10 border-white/30 opacity-75 hover:opacity-100 hover:bg-white/20'}`}>
                              {type === 'Work' ? '🏢 Work' : '🏠 Home'}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold opacity-85 mb-1.5">Postal PIN Code *</label>
                          <input type="text" required maxLength={6} placeholder="e.g. 110025" value={pincode} onChange={(e) => { const val = e.target.value.replace(/\D/g, ''); setPincode(val === '0' ? '' : val); }} onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }} className="w-full px-4 py-3.5 rounded-[20px] bg-black/20 border-2 border-white/30 text-sm font-mono font-bold shadow-inner outline-none transition-all focus:bg-black/30 focus:border-white/60" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold opacity-85 mb-1.5">Flat, House No., Building</label>
                          <input type="text" placeholder="e.g. Flat 402" value={flatHouseNo} onChange={(e) => setFlatHouseNo(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }} className="w-full px-4 py-3.5 rounded-[20px] bg-black/20 border-2 border-white/30 text-sm font-semibold shadow-inner outline-none transition-all focus:bg-black/30 focus:border-white/60" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold opacity-85 mb-1.5">Street, Sector, Area, Locality *</label>
                        <input type="text" required placeholder="e.g. Jamia Nagar, Okhla" value={streetLocality} onChange={(e) => setStreetLocality(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }} className="w-full px-4 py-3.5 rounded-[20px] bg-black/20 border-2 border-white/30 text-sm font-semibold shadow-inner outline-none transition-all focus:bg-black/30 focus:border-white/60" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold opacity-85 mb-1.5">Landmark (Optional)</label>
                        <input type="text" placeholder="e.g. Near Metro Gate" value={landmark} onChange={(e) => setLandmark(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }} className="w-full px-4 py-3.5 rounded-[20px] bg-black/20 border-2 border-white/30 text-sm font-semibold shadow-inner outline-none transition-all focus:bg-black/30 focus:border-white/60" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold opacity-85 mb-1.5">State / Region *</label>
                          <select value={selectedState} onChange={(e) => { const st = e.target.value; setSelectedState(st); setState(st); setCity((ALL_INDIA_STATES_AND_CITIES[st] || ["Other Major City"])[0]); }} className="w-full px-4 py-3.5 rounded-[20px] bg-black/20 border-2 border-white/30 text-sm font-bold shadow-inner outline-none transition-all focus:bg-black/30 focus:border-white/60">
                            {Object.keys(ALL_INDIA_STATES_AND_CITIES).map(stName => <option key={stName} value={stName}>{stName}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold opacity-85 mb-1.5">Town / City *</label>
                          <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-4 py-3.5 rounded-[20px] bg-black/20 border-2 border-white/30 text-sm font-bold shadow-inner outline-none transition-all focus:bg-black/30 focus:border-white/60">
                            {(ALL_INDIA_STATES_AND_CITIES[selectedState] || [city]).map(cityName => <option key={cityName} value={cityName}>{cityName}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: ISOLATED STANDALONE TOTAL AMOUNT SUMMARY CARD */}
                <div className="md:col-span-5 flex flex-col gap-6">
                  <div className={`${activeThemeStyle.card} p-6 sm:p-8 flex flex-col justify-between space-y-5 shadow-2xl sticky top-28`}>
                    <div>
                      <span className="text-xs font-extrabold uppercase tracking-widest opacity-70">Total Amount Summary</span>
                      <div className="mt-1.5 text-3xl sm:text-4xl font-black flex items-baseline gap-1.5">
                        <span className={activeThemeStyle.accentText}>₹</span><span className="font-mono">{finalEstimate.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <div className="space-y-3.5 text-xs border-t border-b border-white/20 py-4">
                      <div className="p-4 rounded-[22px] border-2 border-sky-400/50 bg-sky-500/15 space-y-2 shadow-inner">
                        <div className="flex justify-between items-center font-black text-sky-300 text-sm">
                          <span>1. Main Makeover Package:</span>
                          <span className="font-mono">₹{mainBookingSubtotal.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between pl-1 font-semibold opacity-90"><span>• Vanity:</span><span>{config.pricingByKit?.[calcKit]?.name}</span></div>
                        <div className="flex justify-between pl-1 font-semibold opacity-90"><span>• Package:</span><span>{(config.kitText?.[calcKit]?.[calcPackage])?.name}</span></div>
                        <div className="flex justify-between pl-1 font-semibold opacity-90"><span>• Package Price:</span><span className="font-mono">₹{mainPackagePrice.toLocaleString('en-IN')}</span></div>
                        <div className="flex justify-between pl-1 font-semibold opacity-90"><span>• Travel Fee:</span><span className="font-mono">₹{zoneFee.toLocaleString('en-IN')}</span></div>
                      </div>

                      <div className="p-4 rounded-[22px] border-2 border-purple-400/50 bg-purple-500/15 space-y-2 shadow-inner">
                        <div className="flex justify-between items-center font-black text-purple-300 text-sm">
                          <span>2. Extra Guests ({familyGuests.length}):</span>
                          <span className="font-mono">₹{familyGuestsGross.toLocaleString('en-IN')}</span>
                        </div>
                        {familyGuests.length > 0 ? familyGuests.map((g, i) => {
                          const gp = config.pricingByKit[g.kit]?.[g.packageKey] || 2500;
                          return <div key={i} className="flex justify-between pl-1 font-semibold opacity-90"><span>• Guest #{i + 1}:</span><span className="font-mono">₹{gp.toLocaleString('en-IN')}</span></div>;
                        }) : <div className="flex justify-between pl-1 opacity-70 font-medium"><span>• No extra guests</span><span className="font-mono">₹0</span></div>}
                      </div>

                      <div className="flex justify-between items-center px-4 py-3.5 text-sm font-black rounded-full bg-white/15 border border-white/30 shadow-sm">
                        <span>Total Before Discounts:</span>
                        <span className="font-mono">₹{(mainBookingSubtotal + familyGuestsGross).toLocaleString('en-IN')}</span>
                      </div>

                      <div className="p-4 rounded-[22px] border-2 border-emerald-400/50 bg-emerald-500/15 space-y-2 shadow-inner">
                        <div className="flex justify-between items-center font-black text-emerald-300 text-sm">
                          <span>3. Discounts & Offers:</span>
                          <span className="font-mono">-₹{(guestDiscountSavedAmount + couponDiscountAmount).toLocaleString('en-IN')}</span>
                        </div>
                        {guestDiscountSavedAmount > 0 && <div className="flex justify-between pl-1 text-[11px] text-emerald-300 font-bold"><span>• Family Discount:</span><span className="font-mono">-₹{guestDiscountSavedAmount}</span></div>}
                        {appliedCoupon && couponDiscountAmount > 0 && <div className="flex justify-between pl-1 text-[11px] text-emerald-300 font-bold"><span>• Promo Code:</span><span className="font-mono">-₹{couponDiscountAmount}</span></div>}
                        {guestDiscountSavedAmount === 0 && (!appliedCoupon || couponDiscountAmount === 0) && <div className="flex justify-between pl-1 text-[11px] opacity-70 font-medium"><span>• No discounts</span><span className="font-mono">₹0</span></div>}
                      </div>
                    </div>

                    <button type="submit" disabled={isSubmitting} className={`w-full py-4.5 ${activeThemeStyle.btn} font-black text-sm rounded-full shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-2.5`}>
                      <Check className="w-5 h-5" /> <span>{isSubmitting ? 'Recording Booking...' : 'Confirm & Send Booking Request'}</span>
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className={`${activeThemeStyle.card} p-6 sm:p-9 rounded-[36px] max-w-xl mx-auto space-y-6 shadow-2xl hf-tab-enter`}>
            <div className="text-center space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-widest opacity-70">Client Experience</span>
              <h3 className="text-2xl font-black">Feedback & Suggestions</h3>
              <p className="text-xs sm:text-sm opacity-80 font-medium">Help us enhance your vanity experience by sharing your valuable thoughts.</p>
            </div>
            {feedbackSubmitted ? (
              <div className="p-7 rounded-[26px] bg-emerald-500/20 border-2 border-emerald-400/40 text-center space-y-3 shadow-inner">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="font-black text-lg text-emerald-300">Thank you for your feedback!</h4>
                <p className="text-xs opacity-90 leading-relaxed font-semibold">Your suggestion has been securely recorded to help us improve.</p>
                <button onClick={() => setFeedbackSubmitted(false)} className="mt-3 px-6 py-3 rounded-full bg-white/15 hover:bg-white/25 text-xs font-bold border border-white/35 transition-all active:scale-95 shadow-md">Submit Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmitFeedback} className="space-y-5">
                <div className="flex justify-center gap-3 py-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} type="button" onClick={() => setFeedbackRating(star)} className={`p-1 transition-all duration-300 ease-out ${star <= feedbackRating ? 'text-amber-400 scale-115 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]' : 'opacity-30 hover:opacity-100 hover:text-amber-400 hover:scale-110'}`}>
                      <Star className={`w-8 h-8 ${star <= feedbackRating ? 'fill-amber-400' : ''}`} />
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="text" placeholder="Your Name" value={feedbackName} onChange={e => setFeedbackName(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }} className="w-full px-4 py-3.5 rounded-[20px] bg-black/20 border-2 border-white/30 text-sm font-semibold shadow-inner outline-none transition-all focus:bg-black/30 focus:border-white/60" />
                  <input type="tel" placeholder="Phone Number" value={feedbackPhone} onChange={e => setFeedbackPhone(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }} className="w-full px-4 py-3.5 rounded-[20px] bg-black/20 border-2 border-white/30 text-sm font-mono font-bold shadow-inner outline-none transition-all focus:bg-black/30 focus:border-white/60" />
                </div>
                <textarea rows={4} required placeholder="Share your suggestions, review or thoughts..." value={feedbackMessage} onChange={e => setFeedbackMessage(e.target.value)} className="w-full p-4 rounded-[22px] bg-black/20 border-2 border-white/30 text-sm font-medium shadow-inner outline-none transition-all focus:bg-black/30 focus:border-white/60" />
                <button type="submit" disabled={isSubmittingFeedback} className={`w-full py-4 ${activeThemeStyle.btn} font-black text-sm rounded-full shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-2`}>
                  <Send className="w-4 h-4" /> <span>{isSubmittingFeedback ? 'Submitting Review...' : 'Send Feedback'}</span>
                </button>
              </form>
            )}
          </div>
        )}
      </main>

      {/* FLOATING PROMO OFFER BANNER */}
      {config.toggles?.enableFloatingBanner !== false && config.floatingBanner?.enabled !== false && showFloatingBanner && !shouldHideFloatingDueToExpiry && (
        <aside aria-label="Promotional offer" className={`hf-floating-banner ${activeThemeStyle.card} p-5 rounded-[30px] shadow-[0_25px_60px_rgba(0,0,0,0.6)] transition-all duration-500 border-2 border-white/40`}>
          <div className="flex items-start justify-between gap-3.5">
            <div className="w-9 h-9 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-400/30 shrink-0 mt-0.5">
              <Gift className="w-5 h-5 text-amber-300 animate-bounce" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-400/40 uppercase px-2.5 py-0.5 rounded-full font-mono shadow-sm">{config.floatingBanner?.tag || "SPECIAL OFFER"}</span>
                {isFloatingExpired ? <span className="text-[10px] font-mono bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-full">Expired</span> : floatingTimer ? <span className="text-[10px] font-mono font-bold opacity-90 px-2 py-0.5 rounded-full bg-white/10">{floatingTimer.text}</span> : null}
              </div>
              <h4 className="font-extrabold text-sm mt-1.5 leading-tight">{config.floatingBanner?.title || "Limited Wedding Season Discount"}</h4>
              <p className="text-xs mt-1 opacity-90 font-medium">{isFloatingExpired ? <span className="text-rose-400">Ended.</span> : <>Use code <span className="font-mono font-black text-amber-300 bg-black/30 px-1.5 py-0.5 rounded-md border border-amber-400/30">{floatingPromoCode}</span></>}</p>
            </div>
            <button onClick={() => setShowFloatingBanner(false)} className="opacity-70 hover:opacity-100 p-1.5 shrink-0 transition-all active:scale-90 bg-white/10 rounded-full hover:bg-white/20"><X className="w-4 h-4" /></button>
          </div>
          <button disabled={isFloatingExpired} onClick={() => { if (!isFloatingExpired) { handleApplyCoupon(null, floatingPromoCode); setActiveTab('calculator'); } }} className={`mt-3.5 w-full py-3 text-xs font-black rounded-full transition-all duration-300 shadow-lg ${isFloatingExpired ? 'bg-white/10 opacity-50 cursor-not-allowed' : `${activeThemeStyle.btn} active:scale-[0.98]`}`}>
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
