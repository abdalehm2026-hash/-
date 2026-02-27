import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  MapPin, 
  MessageCircle, 
  Star, 
  Gift, 
  CreditCard, 
  CheckCircle2, 
  Menu, 
  X,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sparkles,
  Wand2,
  Loader2,
  Maximize2,
  ArrowLeft,
  Award,
  ShieldCheck,
  Clock,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Share2,
  Facebook,
  Instagram,
  Twitter,
  Mail
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { enhanceFurnitureImage } from './services/geminiImageService';
import {
  Wallet,
  Copy,
  Check
} from 'lucide-react';

const stripePromise = null; // Stripe disabled

const GALLERY_IMAGES = [
  { 
    id: 1, 
    url: "https://ais-dev-qqfzatkzklzzxfxnmevoif-347188629918.europe-west2.run.app/input_file_0.png", 
    title: "غرفة نوم 'رويال'", 
    category: "غرف نوم", 
    style: "كلاسيك",
    rating: 4.8,
    colors: ["ذهبي", "أبيض", "بني"],
    sizes: ["كينج", "كوين"]
  },
  { 
    id: 2, 
    url: "https://ais-dev-qqfzatkzklzzxfxnmevoif-347188629918.europe-west2.run.app/input_file_1.png", 
    title: "تسريحة 'إيليت'", 
    category: "إكسسوارات", 
    style: "نيوكلاسيك",
    rating: 4.5,
    colors: ["أبيض", "ذهبي"],
    sizes: ["كبير", "وسط"]
  },
  { 
    id: 3, 
    url: "https://ais-dev-qqfzatkzklzzxfxnmevoif-347188629918.europe-west2.run.app/input_file_2.png", 
    title: "دولاب 'برستيج'", 
    category: "غرف نوم", 
    style: "كلاسيك",
    rating: 4.7,
    colors: ["بني", "رمادي"],
    sizes: ["٤ ضلفة", "٦ ضلفة"]
  },
  { 
    id: 4, 
    url: "https://ais-dev-qqfzatkzklzzxfxnmevoif-347188629918.europe-west2.run.app/input_file_4.png", 
    title: "غرفة نوم 'مودرن'", 
    category: "غرف نوم", 
    style: "مودرن",
    rating: 4.6,
    colors: ["رمادي", "أزرق"],
    sizes: ["كينج"]
  },
  { 
    id: 5, 
    url: "https://ais-dev-qqfzatkzklzzxfxnmevoif-347188629918.europe-west2.run.app/input_file_8.png", 
    title: "ركنة 'لاونج'", 
    category: "أنتريهات", 
    style: "مودرن",
    rating: 4.5,
    colors: ["بيج", "كحلي", "أخضر"],
    sizes: ["L-Shape", "U-Shape"]
  },
  { 
    id: 6, 
    url: "https://ais-dev-qqfzatkzklzzxfxnmevoif-347188629918.europe-west2.run.app/input_file_9.png", 
    title: "أنتريه 'كلاسيك'", 
    category: "أنتريهات", 
    style: "كلاسيك",
    rating: 4.9,
    colors: ["ذهبي", "نبيتي"],
    sizes: ["٤ قطع", "٦ قطع"]
  },
  { 
    id: 7, 
    url: "https://ais-dev-qqfzatkzklzzxfxnmevoif-347188629918.europe-west2.run.app/input_file_5.png", 
    title: "غرفة سفرة 'فينيسيا'", 
    category: "سفرة", 
    style: "نيوكلاسيك",
    rating: 4.7,
    colors: ["بني محروق", "بيج"],
    sizes: ["٦ كراسي", "٨ كراسي"]
  },
  { 
    id: 8, 
    url: "https://ais-dev-qqfzatkzklzzxfxnmevoif-347188629918.europe-west2.run.app/input_file_6.png", 
    title: "غرفة سفرة 'مودرن'", 
    category: "سفرة", 
    style: "مودرن",
    rating: 4.5,
    colors: ["أبيض", "رمادي"],
    sizes: ["٦ كراسي"]
  },
];

const RatingStars = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => {
        const isFull = i + 1 <= Math.floor(rating);
        const isHalf = !isFull && i < rating;
        return (
          <Star 
            key={i} 
            size={14} 
            className={`${isFull || isHalf ? 'text-gold fill-gold' : 'text-slate-300'} ${isHalf ? 'opacity-50' : ''}`} 
          />
        );
      })}
      <span className="text-[10px] font-black text-gold mr-2">{rating}</span>
    </div>
  );
};

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{id: number, url: string, title: string, category: string, style: string, rating: number, colors?: string[], sizes?: string[]} | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [activeStyle, setActiveStyle] = useState("الكل");
  const [cart, setCart] = useState<{id: number, title: string, url: string, quantity: number, color?: string, size?: string}[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartBump, setCartBump] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");

  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setNewsletterEmail("");
      setTimeout(() => setNewsletterSubscribed(false), 5000);
    }
  };

  const VODAFONE_CASH_NUMBER = "01124705599";

  const addToCart = (product: any) => {
    setCart(prev => {
      const cartItemId = `${product.id}-${selectedColor}-${selectedSize}`;
      const existing = prev.find(item => `${item.id}-${item.color}-${item.size}` === cartItemId);
      
      if (existing) {
        return prev.map(item => `${item.id}-${item.color}-${item.size}` === cartItemId 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
        );
      }
      return [...prev, { ...product, quantity: 1, color: selectedColor, size: selectedSize }];
    });
    setCartBump(true);
    setTimeout(() => setCartBump(false), 300);
    setIsCartOpen(true);
  };

  const removeFromCart = (id: number, color?: string, size?: string) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.color === color && item.size === size)));
  };

  const updateQuantity = (id: number, delta: number, color?: string, size?: string) => {
    setCart(prev => prev.map(item => {
      if (item.id === id && item.color === color && item.size === size) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(VODAFONE_CASH_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmVodafone = () => {
    const itemsList = cart.map(item => `${item.title} ${item.color ? `(${item.color})` : ''} ${item.size ? `(${item.size})` : ''} (الكمية: ${item.quantity})`).join('\n');
    const message = `مرحباً معرض الفتح، أود تأكيد طلبي عبر فودافون كاش:\n\nالمنتجات:\n${itemsList}\n\nلقد قمت بتحويل المبلغ، يرجى التأكيد.`;
    window.open(`https://wa.me/201124705599?text=${encodeURIComponent(message)}`, '_blank');
    setPaymentSuccess(true);
    setCart([]);
  };

  const handleShare = async (product: any) => {
    const shareData = {
      title: product.title,
      text: `شاهد هذا المنتج الرائع من معرض الفتح للأثاث: ${product.title}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text} - ${shareData.url}`);
        alert('تم نسخ رابط المنتج لمشاركته!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleEnhance = async (url: string, title: string) => {
    setIsEnhancing(true);
    setEnhancedImage(null);
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        const result = await enhanceFurnitureImage(base64, title);
        setEnhancedImage(result);
        setIsEnhancing(false);
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error("Enhancement failed", error);
      setIsEnhancing(false);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const filteredImages = GALLERY_IMAGES.filter(img => {
    const categoryMatch = activeCategory === "الكل" || img.category === activeCategory;
    const styleMatch = activeStyle === "الكل" || img.style === activeStyle;
    return categoryMatch && styleMatch;
  });

  return (
    <div className="min-h-screen font-sans selection:bg-gold selection:text-white">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-xl py-4 shadow-lg' : 'bg-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => scrollToSection('home')}>
            <div className="w-12 h-12 gold-gradient rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
              <Sparkles className="text-white w-7 h-7" />
            </div>
            <div className="flex flex-col">
              <span className={`text-2xl font-black tracking-tighter ${scrolled ? 'text-navy' : 'text-white'}`}>الفتح للأثاث</span>
              <span className={`text-[10px] uppercase tracking-[0.2em] font-bold ${scrolled ? 'text-gold' : 'text-gold-light'}`}>Luxury Collection</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-10">
            {['الرئيسية', 'عروض رمضان', 'الكتالوج', 'تواصل معنا'].map((item, idx) => (
              <button 
                key={idx}
                onClick={() => scrollToSection(['home', 'offers', 'products', 'contact'][idx])}
                className={`text-sm font-bold uppercase tracking-widest transition-all hover:text-gold relative group ${scrolled ? 'text-navy' : 'text-white'}`}
              >
                {item}
                <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-gold transition-all group-hover:w-full"></span>
              </button>
            ))}
            
            <motion.button 
              onClick={() => setIsCartOpen(true)}
              animate={cartBump ? { scale: [1, 1.3, 1] } : {}}
              className={`relative p-2 transition-colors hover:text-gold ${scrolled ? 'text-navy' : 'text-white'}`}
            >
              <ShoppingCart size={24} />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 bg-gold text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <a 
              href="tel:01124705599"
              className="bg-gold text-white px-8 py-3 rounded-full font-black text-sm tracking-widest hover:bg-gold-dark transition-all shadow-xl shadow-gold/20 flex items-center gap-2"
            >
              <Phone size={16} />
              اتصل بنا
            </a>
          </div>

          <div className="flex items-center gap-4 lg:hidden">
            <motion.button 
              onClick={() => setIsCartOpen(true)}
              animate={cartBump ? { scale: [1, 1.3, 1] } : {}}
              className={`relative p-2 ${scrolled ? 'text-navy' : 'text-white'}`}
            >
              <ShoppingCart size={24} />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 bg-gold text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? (
                <X className={scrolled ? 'text-navy' : 'text-white'} size={32} />
              ) : (
                <Menu className={scrolled ? 'text-navy' : 'text-white'} size={32} />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://ais-dev-qqfzatkzklzzxfxnmevoif-347188629918.europe-west2.run.app/input_file_3.png" 
            alt="Al-Fath Furniture Hero" 
            className="w-full h-full object-cover animate-slow-zoom"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-navy/40"></div>
        </div>

        <motion.div 
          style={{ opacity: heroOpacity }}
          className="relative z-10 text-center px-8 max-w-5xl mt-24"
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2 rounded-full mb-8 drop-shadow-lg">
              <Moon className="text-gold w-5 h-5" />
              <span className="text-white text-xs font-black uppercase tracking-[0.3em]">Ramadan Collection 2026</span>
            </div>
            <h1 className="text-6xl md:text-9xl font-serif font-bold text-white mb-8 leading-none drop-shadow-2xl">
              فخامة <span className="text-gold-gradient italic">تليق بك</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-12 font-medium max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
              نحن لا نصنع الأثاث، نحن نصنع التحف الفنية التي تمنح منزلك روحاً من الرقي والتميز. اكتشف عالم الفتح للأثاث.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button 
                onClick={() => scrollToSection('offers')}
                className="bg-gold text-white px-12 py-5 rounded-full font-black text-lg tracking-widest hover:scale-105 transition-all shadow-2xl shadow-gold/40"
              >
                اكتشف العروض
              </button>
              <button 
                onClick={() => scrollToSection('products')}
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-12 py-5 rounded-full font-black text-lg tracking-widest hover:bg-white/20 transition-all"
              >
                عرض الكتالوج
              </button>
            </div>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-gold rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-white border-b border-cream">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Award, title: "جودة عالمية", desc: "خامات أصلية ١٠٠٪" },
              { icon: ShieldCheck, title: "ضمان حقيقي", desc: "خدمة ما بعد البيع" },
              { icon: Clock, title: "تسليم دقيق", desc: "التزام بالمواعيد" },
              { icon: CreditCard, title: "تقسيط مريح", desc: "بدون فوائد" },
            ].map((badge, idx) => (
              <div key={idx} className="flex flex-col items-center text-center gap-3">
                <badge.icon className="text-gold w-8 h-8" />
                <div>
                  <h4 className="font-black text-navy text-sm">{badge.title}</h4>
                  <p className="text-xs text-slate-400">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ramadan Offers */}
      <section id="offers" className="py-32 bg-navy relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-gold font-black text-sm uppercase tracking-[0.4em] mb-6">Exclusive Ramadan Deals</div>
              <h2 className="text-5xl md:text-7xl font-serif font-bold text-white mb-10 leading-tight">
                عروض <span className="text-gold-gradient italic">البركة</span> <br />
                لبيت العمر
              </h2>
              <div className="space-y-10">
                {[
                  { title: "باقة الـ ٣ غرف", desc: "فرش كامل (نوم، سفرة، أطفال) بخصم يصل لـ ٤٠٪", price: "عرض خاص" },
                  { title: "هدايا ملكية", desc: "طقم إكسسوارات فاخر مع كل غرفة نوم كاملة", price: "مجاناً" },
                  { title: "أنظمة سداد ذكية", desc: "قسط على ٢٤ شهر بدون مقدم طوال شهر رمضان", price: "تسهيلات" },
                ].map((offer, idx) => (
                  <div key={idx} className="flex items-start gap-6 group">
                    <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-gold transition-colors">
                      <Sparkles className="text-gold group-hover:text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-2xl font-bold text-white">{offer.title}</h3>
                        <span className="bg-gold/20 text-gold px-3 py-1 rounded-full text-xs font-black">{offer.price}</span>
                      </div>
                      <p className="text-white/50 leading-relaxed">{offer.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="glass-card p-12 rounded-[3rem] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 gold-gradient"></div>
                <div className="text-center mb-12">
                  <Moon className="text-gold w-16 h-16 mx-auto mb-6" />
                  <h3 className="text-3xl font-black text-navy mb-4">احجز الآن قبل الزحمة</h3>
                  <p className="text-slate-500">العروض سارية حتى نهاية شهر رمضان المبارك</p>
                </div>
                <div className="space-y-4">
                  <a 
                    href="https://wa.me/201124705599" 
                    className="flex items-center justify-center gap-3 w-full bg-gold text-white py-5 rounded-2xl font-black text-xl hover:bg-gold-dark transition-all shadow-xl shadow-gold/20"
                  >
                    <MessageCircle size={24} />
                    تواصل عبر واتساب
                  </a>
                  <p className="text-center text-xs text-slate-400 mt-6">أو شرفنا بالزيارة في فرعنا بجوار مسجد السيدة زينب</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] -mr-64 -mt-64"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] -ml-64 -mb-64"></div>
      </section>

      {/* Products Showcase */}
      <section id="products" className="py-32 bg-cream">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="text-right">
              <div className="text-gold font-black text-sm uppercase tracking-[0.4em] mb-4">Our Masterpieces</div>
              <h2 className="text-5xl font-serif font-bold text-navy">كتالوج <span className="italic">التميز</span></h2>
            </div>
            <div className="flex flex-col gap-6 w-full lg:w-auto">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-3 justify-end">
                <span className="text-navy/40 text-[10px] font-black uppercase tracking-widest w-full text-right mb-1">التصنيف</span>
                {["الكل", "غرف نوم", "أنتريهات", "سفرة", "إكسسوارات"].map((cat) => (
                  <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-6 py-2 rounded-xl text-xs font-black tracking-widest transition-all ${activeCategory === cat ? 'bg-gold text-white shadow-lg shadow-gold/20' : 'bg-white text-slate-400 hover:text-navy border border-cream'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              
              {/* Style Filter */}
              <div className="flex flex-wrap gap-3 justify-end">
                <span className="text-navy/40 text-[10px] font-black uppercase tracking-widest w-full text-right mb-1">الستايل</span>
                {["الكل", "كلاسيك", "مودرن", "نيوكلاسيك"].map((style) => (
                  <button 
                    key={style}
                    onClick={() => setActiveStyle(style)}
                    className={`px-6 py-2 rounded-xl text-xs font-black tracking-widest transition-all ${activeStyle === style ? 'bg-navy text-white shadow-lg shadow-navy/20' : 'bg-white text-slate-400 hover:text-navy border border-cream'}`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <AnimatePresence mode="popLayout">
              {filteredImages.map((img, idx) => (
                <motion.div 
                  layout
                  key={img.url}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="group relative overflow-hidden rounded-[2.5rem] bg-white premium-shadow aspect-[4/5] cursor-pointer"
                  onClick={() => {
                    setSelectedImage(img);
                    setSelectedColor(img.colors?.[0] || "");
                    setSelectedSize(img.sizes?.[0] || "");
                  }}
                >
                  <img 
                    src={img.url} 
                    alt={img.title} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-10">
                    <div className="flex justify-between items-end translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <div className="text-right">
                        <span className="text-gold text-xs font-black uppercase tracking-widest mb-2 block">{img.category}</span>
                        <h3 className="text-white text-3xl font-serif font-bold mb-2">{img.title}</h3>
                        <div className="mb-4 flex justify-end">
                          <RatingStars rating={img.rating} />
                        </div>
                        <div className="flex flex-col gap-3">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              // Set default variants before adding to cart from catalog
                              const defaultColor = img.colors?.[0] || "";
                              const defaultSize = img.sizes?.[0] || "";
                              setSelectedColor(defaultColor);
                              setSelectedSize(defaultSize);
                              // We need to use the local variables because state update is async
                              setCart(prev => {
                                const cartItemId = `${img.id}-${defaultColor}-${defaultSize}`;
                                const existing = prev.find(item => `${item.id}-${item.color}-${item.size}` === cartItemId);
                                if (existing) {
                                  return prev.map(item => `${item.id}-${item.color}-${item.size}` === cartItemId 
                                    ? { ...item, quantity: item.quantity + 1 } 
                                    : item
                                  );
                                }
                                return [...prev, { ...img, quantity: 1, color: defaultColor, size: defaultSize }];
                              });
                              setCartBump(true);
                              setTimeout(() => setCartBump(false), 300);
                              setIsCartOpen(true);
                            }}
                            className="bg-gold text-white px-6 py-3 rounded-full text-xs font-black hover:bg-gold-dark transition-all flex items-center justify-center gap-2 shadow-lg"
                          >
                            <Plus size={14} />
                            إضافة للسلة
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedImage(img);
                              setSelectedColor(img.colors?.[0] || "");
                              setSelectedSize(img.sizes?.[0] || "");
                            }}
                            className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-6 py-3 rounded-full text-xs font-black hover:bg-white/40 transition-all flex items-center justify-center gap-2"
                          >
                            <Maximize2 size={14} />
                            عرض سريع
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Virtual Staging Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-navy/95 backdrop-blur-2xl flex items-center justify-center p-6 md:p-12"
          >
            <button 
              onClick={() => {
                setSelectedImage(null);
                setEnhancedImage(null);
              }}
              className="absolute top-8 right-8 text-white/30 hover:text-white transition-colors z-[110]"
            >
              <X size={48} />
            </button>

            <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-16 items-center">
              <div className="relative rounded-[3rem] overflow-hidden aspect-[4/5] bg-white/5 border border-white/10 shadow-2xl">
                <img 
                  src={enhancedImage || selectedImage.url} 
                  alt={selectedImage.title}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
                {isEnhancing && (
                  <div className="absolute inset-0 bg-navy/80 backdrop-blur-md flex flex-col items-center justify-center text-white gap-6">
                    <div className="relative">
                      <Loader2 className="w-20 h-20 animate-spin text-gold" />
                      <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white w-8 h-8" />
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-serif font-bold mb-2">Virtual Staging</div>
                      <div className="text-gold font-black text-sm uppercase tracking-widest animate-pulse">جاري محاكاة الديكور الفاخر...</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-right">
                <div className="text-gold font-black text-sm uppercase tracking-[0.4em] mb-4">{selectedImage.category}</div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-6xl font-serif font-bold text-white">{selectedImage.title}</h3>
                </div>
                <div className="flex justify-end mb-8">
                  <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                    <RatingStars rating={selectedImage.rating} />
                  </div>
                </div>
                <p className="text-white/60 text-xl mb-8 leading-relaxed">
                  استخدم تقنية <span className="text-gold font-bold">Virtual Staging</span> المدعومة بالذكاء الاصطناعي لرؤية هذه القطعة في بيئة منزلية فاخرة ومصممة خصيصاً لإبراز تفاصيلها.
                </p>

                <div className="grid grid-cols-2 gap-8 mb-10">
                  {selectedImage.colors && (
                    <div className="text-right">
                      <span className="text-gold text-xs font-black uppercase tracking-widest mb-3 block">اللون</span>
                      <div className="flex flex-wrap justify-end gap-2">
                        {selectedImage.colors.map(color => (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${selectedColor === color ? 'bg-gold text-white border-gold' : 'bg-white/5 text-white/60 border-white/10 hover:border-white/30'}`}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedImage.sizes && (
                    <div className="text-right">
                      <span className="text-gold text-xs font-black uppercase tracking-widest mb-3 block">المقاس / النوع</span>
                      <div className="flex flex-wrap justify-end gap-2">
                        {selectedImage.sizes.map(size => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${selectedSize === size ? 'bg-gold text-white border-gold' : 'bg-white/5 text-white/60 border-white/10 hover:border-white/30'}`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {cart.find(item => item.id === selectedImage.id && item.color === selectedColor && item.size === selectedSize) ? (
                      <div className="flex items-center justify-between bg-white text-navy py-4 px-8 rounded-3xl shadow-2xl border border-cream">
                        <button 
                          onClick={() => updateQuantity(selectedImage.id, -1, selectedColor, selectedSize)}
                          className="w-12 h-12 rounded-full border-2 border-cream flex items-center justify-center hover:bg-cream transition-colors"
                        >
                          <Minus size={24} />
                        </button>
                        <div className="flex flex-col items-center">
                          <span className="font-black text-3xl">{cart.find(item => item.id === selectedImage.id && item.color === selectedColor && item.size === selectedSize)?.quantity}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">في السلة</span>
                        </div>
                        <button 
                          onClick={() => updateQuantity(selectedImage.id, 1, selectedColor, selectedSize)}
                          className="w-12 h-12 rounded-full border-2 border-cream flex items-center justify-center hover:bg-cream transition-colors"
                        >
                          <Plus size={24} />
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => addToCart(selectedImage)}
                        className="bg-white text-navy py-6 rounded-3xl font-black text-xl flex items-center justify-center gap-4 hover:bg-gold hover:text-white transition-all shadow-2xl"
                      >
                        <ShoppingCart size={28} />
                        إضافة للسلة
                      </button>
                    )}
                    
                    {!enhancedImage ? (
                      <button 
                        onClick={() => handleEnhance(selectedImage.url, selectedImage.title)}
                        disabled={isEnhancing}
                        className="gold-gradient text-white py-6 rounded-3xl font-black text-xl flex items-center justify-center gap-4 hover:scale-[1.02] transition-all disabled:opacity-50 shadow-2xl shadow-gold/30"
                      >
                        <Wand2 size={28} />
                        تفعيل العرض الذكي
                      </button>
                    ) : (
                      <div className="bg-white/5 border border-gold/30 p-6 rounded-[2rem] flex flex-col justify-center">
                        <div className="flex items-center gap-4 text-gold mb-2 font-black text-lg">
                          <CheckCircle2 size={24} />
                          تمت المحاكاة
                        </div>
                        <button 
                          onClick={() => setEnhancedImage(null)}
                          className="text-white/30 hover:text-white text-sm underline underline-offset-8"
                        >
                          العودة للعرض الواقعي
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <a 
                      href="https://wa.me/201124705599" 
                      className="bg-white/10 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-white/20 transition-all border border-white/10"
                    >
                      <MessageCircle size={24} />
                      استفسار سريع
                    </a>
                    <button 
                      onClick={() => handleShare(selectedImage)}
                      className="bg-white/10 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-white/20 transition-all border border-white/10"
                    >
                      <Share2 size={24} />
                      مشاركة المنتج
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer id="contact" className="bg-navy py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="grid lg:grid-cols-4 gap-12 mb-20">
            <div className="text-right">
              <div className="flex items-center gap-3 mb-8 justify-end">
                <span className="text-3xl font-black text-white">الفتح للأثاث</span>
                <div className="w-12 h-12 gold-gradient rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="text-white w-7 h-7" />
                </div>
              </div>
              <p className="text-white/40 text-lg leading-relaxed mb-8">
                نحن نؤمن بأن الأثاث هو استثمار في جودة الحياة. منذ سنوات ونحن نقدم لعملائنا أرقى التصاميم وأجود الخامات.
              </p>
              <div className="flex justify-end gap-4">
                {[
                  { icon: Facebook, href: "#" },
                  { icon: Instagram, href: "#" },
                  { icon: Twitter, href: "#" }
                ].map((social, idx) => (
                  <a 
                    key={idx}
                    href={social.href}
                    className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white/40 hover:text-gold hover:border-gold transition-all"
                  >
                    <social.icon size={20} />
                  </a>
                ))}
              </div>
            </div>

            <div className="text-right">
              <h4 className="text-gold font-black text-sm uppercase tracking-[0.4em] mb-8">Newsletter</h4>
              <p className="text-white/40 text-sm mb-6 leading-relaxed">اشترك في نشرتنا الإخبارية ليصلك أحدث العروض والموديلات الحصرية.</p>
              
              <AnimatePresence mode="wait">
                {newsletterSubscribed ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-gold/10 border border-gold/20 p-4 rounded-xl text-gold text-xs font-bold text-center"
                  >
                    شكراً لاشتراكك! سنوافيك بكل جديد.
                  </motion.div>
                ) : (
                  <motion.form 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleNewsletterSubmit} 
                    className="space-y-3"
                  >
                    <div className="relative">
                      <input 
                        type="email" 
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        placeholder="البريد الإلكتروني" 
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white text-sm focus:outline-none focus:border-gold transition-colors text-right placeholder:text-white/20"
                        required
                      />
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4" />
                    </div>
                    <button 
                      type="submit"
                      className="w-full bg-gold text-white py-4 rounded-xl font-black text-sm hover:bg-gold-dark transition-all shadow-lg shadow-gold/20 flex items-center justify-center gap-2"
                    >
                      اشترك الآن
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            <div className="text-right">
              <h4 className="text-gold font-black text-sm uppercase tracking-[0.4em] mb-8">Quick Links</h4>
              <ul className="space-y-4">
                {['الرئيسية', 'عروض رمضان', 'الكتالوج', 'تواصل معنا'].map((item) => (
                  <li key={item}>
                    <button className="text-white/60 hover:text-gold transition-colors font-bold">{item}</button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-right">
              <h4 className="text-gold font-black text-sm uppercase tracking-[0.4em] mb-8">Contact Us</h4>
              <div className="space-y-6">
                <div className="flex items-center gap-4 justify-end">
                  <div className="text-right">
                    <div className="text-white font-bold">بجوار مسجد السيدة زينب</div>
                    <div className="text-white/40 text-sm">القاهرة، مصر</div>
                    <a 
                      href="https://www.google.com/maps/search/?api=1&query=Sayyida+Zeinab+Mosque+Cairo" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gold text-xs font-bold hover:underline mt-2 inline-flex items-center gap-1"
                    >
                      <MapPin size={12} />
                      عرض على الخريطة
                    </a>
                  </div>
                  <MapPin className="text-gold" />
                </div>
                <div className="flex items-center gap-4 justify-end">
                  <div className="text-right">
                    <div className="text-white font-bold">01124705599</div>
                    <div className="text-white/40 text-sm">المبيعات</div>
                  </div>
                  <Phone className="text-gold" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-white/20 text-sm font-bold">
            <div>&copy; {new Date().getFullYear()} AL-FATH FURNITURE. ALL RIGHTS RESERVED.</div>
            <div className="flex gap-8">
              <button className="hover:text-gold transition-colors">Privacy Policy</button>
              <button className="hover:text-gold transition-colors">Terms of Service</button>
            </div>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 z-[150] bg-navy/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 z-[160] w-full max-w-md bg-white shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-cream flex justify-between items-center">
                <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-navy transition-colors">
                  <X size={24} />
                </button>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-black text-navy">سلة المشتريات</span>
                  <ShoppingBag className="text-gold" />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                    <ShoppingCart size={64} className="mb-6" />
                    <p className="text-xl font-bold">السلة فارغة حالياً</p>
                    <p className="text-sm">ابدأ بإضافة قطع الأثاث المفضلة لديك</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <AnimatePresence initial={false}>
                      {cart.map((item) => (
                        <motion.div 
                          layout
                          key={item.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="flex gap-4 items-center"
                        >
                          <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                            <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 text-right">
                            <h4 className="font-bold text-navy mb-1">{item.title}</h4>
                            {(item.color || item.size) && (
                              <div className="flex justify-end gap-2 mb-2">
                                {item.size && <span className="text-[10px] bg-cream text-navy px-2 py-0.5 rounded font-bold">{item.size}</span>}
                                {item.color && <span className="text-[10px] bg-gold/10 text-gold px-2 py-0.5 rounded font-bold">{item.color}</span>}
                              </div>
                            )}
                            <div className="flex items-center justify-end gap-3">
                              <button 
                                onClick={() => updateQuantity(item.id, -1, item.color, item.size)}
                                className="w-8 h-8 rounded-full border border-cream flex items-center justify-center hover:bg-cream transition-colors"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="font-black w-6 text-center">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, 1, item.color, item.size)}
                                className="w-8 h-8 rounded-full border border-cream flex items-center justify-center hover:bg-cream transition-colors"
                              >
                                <Plus size={14} />
                              </button>
                              <button 
                                onClick={() => removeFromCart(item.id, item.color, item.size)}
                                className="mr-auto text-red-400 hover:text-red-600 transition-colors"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-8 bg-cream/50 border-t border-cream">
                  <button 
                    onClick={() => setIsCheckoutOpen(true)}
                    className="w-full bg-navy text-white py-5 rounded-2xl font-black text-lg hover:bg-gold transition-all shadow-xl"
                  >
                    إتمام الطلب (فودافون كاش)
                  </button>
                  <p className="text-center text-[10px] text-slate-400 mt-4">سيتم توجيهك لتعليمات التحويل عبر فودافون كاش</p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Checkout Modal (Vodafone Cash) */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-navy/95 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <div className="bg-white w-full max-w-lg rounded-[3rem] p-10 relative overflow-hidden text-right">
              <div className="absolute top-0 left-0 w-full h-2 gold-gradient"></div>
              
              {!paymentSuccess ? (
                <>
                  <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Wallet className="text-red-600 w-8 h-8" />
                    </div>
                    <h3 className="text-3xl font-serif font-bold text-navy mb-2">الدفع عبر فودافون كاش</h3>
                    <p className="text-slate-500">يرجى تحويل المبلغ المتفق عليه للرقم التالي:</p>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-2xl mb-8 flex items-center justify-between border border-slate-100">
                    <button 
                      onClick={handleCopyNumber}
                      className="text-navy hover:text-gold transition-colors flex items-center gap-2 font-bold"
                    >
                      {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                      {copied ? "تم النسخ" : "نسخ الرقم"}
                    </button>
                    <div className="text-2xl font-black text-navy tracking-wider">{VODAFONE_CASH_NUMBER}</div>
                  </div>

                  <div className="space-y-4">
                    <button 
                      onClick={handleConfirmVodafone}
                      className="w-full bg-red-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-red-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-red-200"
                    >
                      <MessageCircle size={24} />
                      تأكيد التحويل عبر واتساب
                    </button>
                    <button 
                      onClick={() => setIsCheckoutOpen(false)}
                      className="w-full bg-slate-100 text-slate-500 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                    >
                      إلغاء
                    </button>
                  </div>
                  <p className="text-center text-[10px] text-slate-400 mt-6">بعد التحويل، يرجى إرسال صورة الإيصال عبر الواتساب لتأكيد الطلب.</p>
                </>
              ) : (
                <div className="text-center py-10">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 className="text-green-500 w-12 h-12" />
                  </div>
                  <h3 className="text-4xl font-serif font-bold text-navy mb-4">تم إرسال طلبك!</h3>
                  <p className="text-slate-500 mb-10 text-lg">شكراً لثقتكم في معرض الفتح للأثاث. سيقوم فريقنا بمراجعة التحويل والتواصل معكم فوراً.</p>
                  <button 
                    onClick={() => {
                      setIsCheckoutOpen(false);
                      setPaymentSuccess(false);
                    }}
                    className="bg-navy text-white px-12 py-4 rounded-full font-black hover:bg-gold transition-all"
                  >
                    العودة للمتجر
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.a 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        href="https://wa.me/201124705599"
        className="fixed bottom-10 left-10 z-[90] bg-[#25D366] text-white p-5 rounded-full shadow-[0_20px_50px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform"
      >
        <MessageCircle size={32} />
      </motion.a>
    </div>
  );
}
