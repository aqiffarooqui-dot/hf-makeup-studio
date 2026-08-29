import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Calendar as CalendarIcon, MapPin, Check, Calculator, Crown, ChevronRight, 
  ShieldCheck, Star, Car, CheckCircle2, PackageCheck, Tag, Gift, X, 
  Volume2, Sun, Moon, Send, Percent, Camera, Award, Heart, Download, Image as ImageIcon,
  Play, Film, ExternalLink, User, Flame, ArrowRight, Eye, Info, Activity, Clock, AlertCircle,
  Receipt, FileText, Hash, Wrench, ShieldAlert, Users, Plus, Trash2, MessageSquare, Share2, QrCode, Copy, CheckCheck
} from 'lucide-react';
import { STUDIO_CONFIG } from './config';
import { subscribeToLiveConfig, db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const DEFAULT_PROFILE_IMG = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80";
const DEFAULT_STUDIO_LOGO = "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&auto=format&fit=crop&q=80";

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
    simple_party: { num: 1, name: "Simple Party Makeup (Luxury)", desc: "Natural dewy skin glow with Dior & NARS, soft contour & luxury hair styling." },
    hd_party: { num: 2, name: "HD Party Makeup (Luxury)", desc: "High-definition camera ready base with Charlotte Tilbury & Huda, designer hair styling." },
    super_hd_party: { num: 3, name: "Super HD Glam Party (Luxury)", desc: "Flawless poreless glass skin, 3D luxury lashes, statement eye look & hair artistry." },
    cocktail_glam: { num: 4, name: "Cocktail / Reception Glam (Luxury)", desc: "Red-carpet celebrity glam, smokey or shimmer eye art, luxury extensions & styling." },
    engagement_bride: { num: 5, name: "Engagement / Sagan Bride (Luxury)", desc: "Radiant luxury bridal base, sculpted features, premium lash drama, draping & hair styling." },
    royal_bridal: { num: 6, name: "Royal Asian Bridal (Luxury)", desc: "Signature bridal artistry, 16HR waterproof HD finish with Estee Lauder & MAC, master draping & styling." }
  },
  drugstore: {
    simple_party: { num: 1, name: "Simple Party Makeup (HD Classic)", desc: "Clean everyday fresh look, light foundation base & classic hair styling." },
    hd_party: { num: 2, name: "HD Party Makeup (HD Classic)", desc: "High-definition camera ready base with PAC/Milani, customized eye look & hair styling." },
    super_hd_party: { num: 3, name: "Super HD Glam Party (HD Classic)", desc: "Long-wear HD base, dramatic eye shimmer, 3D lashes & elegant hair styling." },
    cocktail_glam: { num: 4, name: "Cocktail / Reception Glam (HD Classic)", desc: "Even toned radiant glam, bold lip contour, full party hair styling." },
    engagement_bride: { num: 5, name: "Engagement / Sagan Bride (HD Classic)", desc: "HD bridal glow, durable base, customized lash placement, dupatta draping." },
    royal_bridal: { num: 6, name: "Royal Asian Bridal (HD Classic)", desc: "Complete Asian bridal makeover, smudge-proof HD base, jewelry setting & bridal draping." }
  }
};

const DEFAULT_GALLERY = [
  { type: "image", title: "Royal Asian Bridal", sub: "Prestige HD Artistry", url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop&q=80" },
  { type: "video", title: "Dewy Glow Finishing", sub: "16HR Stay Artistry", url: "https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-woman-applying-makeup-41419-large.mp4" },
  { type: "image", title: "Engagement Glow", sub: "Dewy Glass Finish", url: "https://images.unsplash.com/photo-1594465919760-441fe5908ab0?w=800&auto=format&fit=crop&q=80" },
  { type: "video", title: "Cocktail Reception Glam", sub: "Smokey Eyes & Bold Lips", url: "https://assets.mixkit.co/videos/preview/mixkit-woman-putting-on-makeup-41418-large.mp4" }
];

const WA_SERVER_URL = "https://simple-holidays-enable-ranger.trycloudflare.com";

export default function App() {
  const [config, setConfig] = useState(STUDIO_CONFIG || {});
  const [activeTab, setActiveTab] = useState('menu');
  const [selectedKit, setSelectedKit] = useState('international');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [splashFade, setSplashFade] = useState(false);
  const [viewingPackage, setViewingPackage] = useState(null);

  const [calcPackage, setCalcPackage] = useState('royal_bridal');
  const [calcKit, setCalcKit] = useState('international');
  const [calcZone, setCalcZone] = useState('delhi_near');

  const [familyGuests, setFamilyGuests] = useState([]);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [venueAddress, setVenueAddress] = useState('');
  const [currentBookingNumber, setCurrentBookingNumber] = useState('');

  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isBookingDone, setIsBookingDone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setSplashFade(true);
      setTimeout(() => setShowSplash(false), 500);
    }, 2000);
    return () => clearTimeout(splashTimer);
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToLiveConfig(STUDIO_CONFIG, (live) => {
      if (!live) return;
      setConfig(prev => ({ ...prev, ...live }));
    });
    return () => unsubscribe();
  }, []);

  const handleDirectEstimateBooking = async (e) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim() || !eventDate) {
      alert("Please fill Name, Phone, and Event Date.");
      return;
    }

    setIsSubmitting(true);
    const generatedBookingNo = "#HF-" + Math.floor(100000 + Math.random() * 900000);
    setCurrentBookingNumber(generatedBookingNo);

    try {
      await addDoc(collection(db, "bookings"), {
        bookingNumber: generatedBookingNo,
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        eventDate: eventDate,
        kitType: config?.pricingByKit?.[calcKit]?.name || 'Vanity Kit',
        packageKey: calcPackage,
        packageName: calcPackage,
        totalAmount: 15000,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      setIsBookingDone(true);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Explicit guaranteed fallback styles so screen is NEVER black
  const containerStyle = {
    backgroundColor: isDarkMode ? '#121212' : '#F8F5F2',
    color: isDarkMode ? '#FFFFFF' : '#1C1C1E',
    minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    paddingBottom: '120px'
  };

  return (
    <div style={containerStyle} className="select-none" onContextMenu={e => e.preventDefault()}>
      {showSplash && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#1C1C1E', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', transition: 'opacity 0.5s', opacity: splashFade ? 0 : 1, pointerEvents: splashFade ? 'none' : 'auto' }}>
          <div style={{ width: '100px', height: '100px', background: 'rgba(255,255,255,0.1)', borderRadius: '28px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
            <Crown style={{ width: '50px', height: '50px', color: '#007AFF' }} />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#007AFF', margin: 0 }}>H&F Makeup Artist</h1>
          <p style={{ fontSize: '13px', color: '#8E8E93', marginTop: '6px', textTransform: 'uppercase', letterSpacing: '2px' }}>Beauty, Styled Your Way</p>
        </div>
      )}

      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 40, background: isDarkMode ? 'rgba(28,28,30,0.85)' : 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', borderBottom: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: '#007AFF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '18px', boxShadow: '0 4px 12px rgba(0,122,255,0.3)' }}>
            H
          </div>
          <div>
            <h1 style={{ fontSize: '17px', fontWeight: 'bold', margin: 0 }}>{config?.studioName || 'H&F Makeup Artist'}</h1>
            <p style={{ fontSize: '12px', color: '#8E8E93', margin: 0 }}>{config?.artistTagline || 'Beauty, Styled Your Way'}</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="button" onClick={() => setIsDarkMode(!isDarkMode)} style={{ background: isDarkMode ? 'rgba(255,255,255,0.1)' : '#E5E5EA', border: 'none', padding: '10px', borderRadius: '12px', cursor: 'pointer', color: isDarkMode ? '#FFD60A' : '#007AFF' }}>
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px 16px' }}>
        {activeTab === 'menu' && (
          <div style={{ textAlign: 'center', spaceY: '20px' }}>
            <span style={{ display: 'inline-block', padding: '6px 16px', background: 'rgba(0,122,255,0.15)', color: '#007AFF', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', marginBottom: '12px' }}>
              Professional Vanity Packages
            </span>
            <h2 style={{ fontSize: '32px', fontWeight: 'bold', margin: '0 0 10px 0' }}>Curated Makeup Menu</h2>
            <p style={{ fontSize: '14px', color: '#8E8E93', marginBottom: '30px' }}>Explore our luxury makeup artistry and book your special day.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', textAlign: 'left' }}>
              {['royal_bridal', 'engagement_bride', 'cocktail_glam', 'hd_party'].map((pkgKey) => (
                <div key={pkgKey} style={{ background: isDarkMode ? '#1C1C1E' : '#FFFFFF', borderRadius: '24px', padding: '20px', border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.06)', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', textTransform: 'capitalize', margin: '0 0 8px 0' }}>{pkgKey.replace('_', ' ')}</h3>
                  <p style={{ fontSize: '13px', color: '#8E8E93', margin: '0 0 16px 0' }}>Professional camera-ready makeup with premium international cosmetics.</p>
                  <button type="button" onClick={() => { setCalcPackage(pkgKey); setActiveTab('calculator'); }} style={{ width: '100%', padding: '12px', background: '#007AFF', color: '#fff', border: 'none', borderRadius: '14px', fontWeight: 'bold', cursor: 'pointer' }}>
                    Estimate & Book
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'calculator' && (
          <div style={{ background: isDarkMode ? '#1C1C1E' : '#FFFFFF', padding: '30px', borderRadius: '28px', maxWidth: '600px', margin: '0 auto', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>Book Appointment</h3>
            {isBookingDone ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <CheckCircle2 size={50} color="#34C759" style={{ margin: '0 auto 15px auto' }} />
                <h4 style={{ fontSize: '18px', fontWeight: 'bold' }}>Booking Submitted Successfully!</h4>
                <p style={{ fontSize: '13px', color: '#8E8E93', margin: '10px 0 20px 0' }}>Booking No: {currentBookingNumber}</p>
                <button type="button" onClick={() => setIsBookingDone(false)} style={{ padding: '12px 24px', background: '#007AFF', color: '#fff', border: 'none', borderRadius: '14px', fontWeight: 'bold', cursor: 'pointer' }}>Book Another</button>
              </div>
            ) : (
              <form onSubmit={handleDirectEstimateBooking} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#8E8E93', display: 'block', marginBottom: '6px' }}>Full Name *</label>
                  <input type="text" required placeholder="e.g. Aliza Khan" value={clientName} onChange={e => setClientName(e.target.value)} style={{ width: '100%', padding: '12px 16px', background: isDarkMode ? '#2C2C2E' : '#F2F2F7', border: 'none', borderRadius: '14px', fontSize: '14px', color: isDarkMode ? '#fff' : '#000', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#8E8E93', display: 'block', marginBottom: '6px' }}>Phone Number *</label>
                  <input type="tel" required placeholder="e.g. 9876543210" value={clientPhone} onChange={e => setClientPhone(e.target.value)} style={{ width: '100%', padding: '12px 16px', background: isDarkMode ? '#2C2C2E' : '#F2F2F7', border: 'none', borderRadius: '14px', fontSize: '14px', color: isDarkMode ? '#fff' : '#000', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#8E8E93', display: 'block', marginBottom: '6px' }}>Event Date *</label>
                  <input type="date" required value={eventDate} onChange={e => setEventDate(e.target.value)} style={{ width: '100%', padding: '12px 16px', background: isDarkMode ? '#2C2C2E' : '#F2F2F7', border: 'none', borderRadius: '14px', fontSize: '14px', color: isDarkMode ? '#fff' : '#000', outline: 'none' }} />
                </div>
                <button type="submit" disabled={isSubmitting} style={{ width: '100%', padding: '14px', background: '#007AFF', color: '#fff', border: 'none', borderRadius: '16px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', marginTop: '10px' }}>
                  {isSubmitting ? 'Submitting...' : 'Confirm Booking'}
                </button>
              </form>
            )}
          </div>
        )}
      </main>

      {/* Floating Capsule Bottom Navigation */}
      <nav style={{ position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)', zIndex: 50, width: 'calc(100% - 32px)', maxWidth: '400px', height: '64px', background: isDarkMode ? 'rgba(28,28,30,0.85)' : 'rgba(255,255,255,0.85)', backdropFilter: 'blur(25px)', borderRadius: '32px', border: isDarkMode ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'around', alignItems: 'center', padding: '0 8px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
        {[
          { id: 'menu', label: 'Packages', icon: Crown },
          { id: 'calculator', label: 'Bookings', icon: Calculator },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: isActive ? '#007AFF' : 'transparent', color: isActive ? '#fff' : '#8E8E93', border: 'none', height: '48px', borderRadius: '24px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
