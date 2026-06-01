import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Truck, Shield, RotateCcw } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import ProductCard from '../components/ProductCard';
import { useReveal } from '../hooks/useReveal';

const heroSlides = [
  {
    img: 'https://images.unsplash.com/photo-1615412704911-55d589229864?w=1920&h=1080&fit=crop&q=85',
    tag: 'Colección Oriental',
    title: 'El arte del perfume oriental',
    sub: 'Oud, sándalo y especias raras, compuestos para quienes entienden el lujo sin esfuerzo.',
  },
  {
    img: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1920&h=1080&fit=crop&q=85',
    tag: 'Colección Floral',
    title: 'Flores que perduran',
    sub: 'Bouquets nocturnos de jazmín y tuberosa, capturados en su momento más sensual.',
  },
  {
    img: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=1920&h=1080&fit=crop&q=85',
    tag: 'Edición Limitada',
    title: 'Maderas nobles del mundo',
    sub: 'Una estela que te precede. Cedro, guayaco y vainilla bourbon en perfecta armonía.',
  },
];

const features = [
  { icon: Truck,     title: 'Envío Premium',   desc: 'Entrega con empaque de lujo en 24–48 h' },
  { icon: Shield,    title: '100% Auténtico',  desc: 'Cada frasco certificado y sellado de origen' },
  { icon: RotateCcw, title: '30 días',          desc: 'Devolución sin preguntas, garantizado' },
];

const testimonials = [
  { name: 'María G.',  city: 'Madrid',          text: 'El Oud Royale superó todas mis expectativas. La proyección dura más de 12 horas.', stars: 5 },
  { name: 'Carlos M.', city: 'Buenos Aires',    text: 'El empaque es impecable, parece un regalo de alta joyería. Volveré a comprar.', stars: 5 },
  { name: 'Ana R.',    city: 'Ciudad de México', text: "Llevo tres años siendo clienta. L'Essence siempre me sorprende con algo único.", stars: 5 },
];

export default function Landing({ onCartOpen }) {
  const [slide, setSlide]       = useState(0);
  const [animating, setAnimating] = useState(false);
  const { inventory } = useAdmin();
  useReveal();

  const featured = inventory.filter(p => p.featured);

  useEffect(() => {
    const t = setInterval(() => {
      setAnimating(true);
      setTimeout(() => { setSlide(i => (i + 1) % heroSlides.length); setAnimating(false); }, 400);
    }, 5500);
    return () => clearInterval(t);
  }, []);

  function goSlide(i) {
    setAnimating(true);
    setTimeout(() => { setSlide(i); setAnimating(false); }, 300);
  }

  const current = heroSlides[slide];

  return (
    <div className="min-h-screen bg-[#FAF8F5]">

      {/* ── HERO ── */}
      <section className="relative h-[100svh] min-h-[580px] overflow-hidden">
        {heroSlides.map((s, i) => (
          <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === slide ? 'opacity-100' : 'opacity-0'}`}>
            <img src={s.img} alt="" className="w-full h-full object-cover object-center" />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1714]/80 via-[#1A1714]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1714]/60 via-transparent to-transparent" />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#1A1714]/50 to-transparent pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-end pb-16 sm:pb-20 px-5 sm:px-10 md:px-16 lg:px-24 max-w-5xl">
          <div
            key={slide}
            className={`transition-all duration-500 ${animating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
          >
            <p className="text-[10px] tracking-[0.4em] text-white/50 uppercase mb-3 sm:mb-4 font-medium">
              {current.tag}
            </p>
            <h1
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4 sm:mb-5"
              style={{ fontFamily: 'Georgia, serif', letterSpacing: '-0.02em' }}
            >
              {current.title}
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-white/65 max-w-sm sm:max-w-md mb-6 sm:mb-8 leading-relaxed">
              {current.sub}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/catalogo"
                className="inline-flex items-center gap-2 gold-gradient text-white px-5 sm:px-7 py-3 sm:py-3.5 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity btn-press shadow-xl"
              >
                Explorar colección <ArrowRight size={15} />
              </Link>
              <button
                onClick={onCartOpen}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-5 sm:px-7 py-3 sm:py-3.5 rounded-full text-sm font-medium hover:bg-white/20 transition-all btn-press"
              >
                Mi carrito
              </button>
            </div>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-6 right-5 sm:bottom-8 sm:right-8 md:right-16 flex gap-2 z-10">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => goSlide(i)}
              className={`transition-all duration-400 rounded-full ${i === slide ? 'w-8 h-1.5 bg-[#D4AF7A]' : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/60'}`}
            />
          ))}
        </div>

        <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-10 hidden sm:block">
          <div className="w-px h-8 bg-white/20 animate-pulse" />
        </div>
      </section>

      {/* ── FEATURES BAR ── */}
      <section className="bg-white border-b border-[#1A1714]/6">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-8 sm:py-10 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#1A1714]/6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-4 py-5 sm:py-0 sm:px-8 lg:px-10 first:pl-0 last:pr-0 reveal">
              <div className="w-10 h-10 rounded-xl bg-[#F5F0E8] flex items-center justify-center flex-shrink-0">
                <Icon size={18} className="text-[#B8955A]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1A1714]">{title}</p>
                <p className="text-xs text-[#6B6560] mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-14 sm:py-20 md:py-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-3">
          <div className="reveal">
            <p className="text-[10px] tracking-[0.4em] text-[#1A1714]/35 uppercase font-medium mb-2">Selección Exclusiva</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1A1714]" style={{ fontFamily: 'Georgia, serif' }}>
              Fragancias destacadas
            </h2>
          </div>
          <Link to="/catalogo" className="reveal delay-200 inline-flex items-center gap-1.5 text-sm font-medium text-[#1A1714]/45 hover:text-[#1A1714] transition-colors link-underline">
            Ver todas <ArrowRight size={13} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {featured.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>

      {/* ── BRAND STORY ── */}
      <section className="bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-14 sm:py-20 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="reveal order-2 lg:order-1">
            <p className="text-[10px] tracking-[0.4em] text-[#1A1714]/35 uppercase font-medium mb-4">Nuestra historia</p>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#1A1714] leading-tight mb-5 sm:mb-6"
              style={{ fontFamily: 'Georgia, serif', letterSpacing: '-0.02em' }}
            >
              El perfume como<br />expresión del ser
            </h2>
            <p className="text-sm sm:text-base text-[#6B6560] leading-relaxed mb-4">
              En L'Essence creemos que un perfume es la joya más íntima que puedes llevar. No se ve, pero se siente en cada habitación que pisas, en cada abrazo que das.
            </p>
            <p className="text-sm sm:text-base text-[#6B6560] leading-relaxed mb-7 sm:mb-8">
              Seleccionamos cada fragancia con el rigor de un coleccionista y la pasión de un artista. Solo los mejores aromas del mundo encuentran su lugar en nuestra boutique.
            </p>
            <Link
              to="/catalogo"
              className="inline-flex items-center gap-2 bg-[#1A1714] text-white px-6 sm:px-7 py-3 sm:py-3.5 rounded-full text-sm font-semibold hover:bg-[#B8955A] transition-colors btn-press"
            >
              Explorar colección <ArrowRight size={15} />
            </Link>
          </div>

          <div className="reveal-scale grid grid-cols-2 gap-3 sm:gap-4 order-1 lg:order-2 max-h-[420px] lg:max-h-none">
            <div className="rounded-2xl overflow-hidden img-zoom">
              <img src="https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=600&h=800&fit=crop&q=85" alt="" className="w-full h-full object-cover" style={{ aspectRatio:'3/4' }} />
            </div>
            <div className="flex flex-col gap-3 sm:gap-4 pt-8 sm:pt-10">
              <div className="rounded-2xl overflow-hidden img-zoom flex-1">
                <img src="https://images.unsplash.com/photo-1610461888750-10bfc601b874?w=400&h=400&fit=crop&q=85" alt="" className="w-full h-full object-cover" style={{ aspectRatio:'1' }} />
              </div>
              <div className="rounded-2xl overflow-hidden img-zoom flex-1">
                <img src="https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop&q=85" alt="" className="w-full h-full object-cover" style={{ aspectRatio:'1' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-10 sm:py-16">
        <div className="text-center mb-8 sm:mb-12 reveal">
          <p className="text-[10px] tracking-[0.4em] text-[#1A1714]/35 uppercase font-medium mb-2">Colecciones</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1A1714]" style={{ fontFamily: 'Georgia, serif' }}>Familias olfativas</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {[
            { name: 'Oriental',  img: 'https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?w=600&h=700&fit=crop&q=80', count: '4 fragancias' },
            { name: 'Floral',    img: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&h=700&fit=crop&q=80', count: '2 fragancias' },
            { name: 'Amaderado', img: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&h=700&fit=crop&q=80', count: '1 fragancia' },
            { name: 'Chypre',    img: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=600&h=700&fit=crop&q=80', count: '1 fragancia' },
          ].map((cat, i) => (
            <Link
              key={cat.name}
              to={`/catalogo?cat=${cat.name}`}
              className="group relative overflow-hidden rounded-xl sm:rounded-2xl aspect-[2/3] sm:aspect-[3/4] reveal card-lift"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <img src={cat.img} alt={cat.name} className="w-full h-full object-cover" style={{ transition: 'transform 0.7s cubic-bezier(0.16,1,0.3,1)' }} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1714]/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5">
                <p className="text-[9px] tracking-[0.3em] text-[#D4AF7A] uppercase font-medium mb-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block">
                  {cat.count}
                </p>
                <h3 className="text-sm sm:text-lg font-bold text-white" style={{ fontFamily: 'Georgia, serif' }}>{cat.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="bg-[#F5F0E8] py-14 sm:py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">
          <div className="text-center mb-10 sm:mb-14 reveal">
            <p className="text-[10px] tracking-[0.4em] text-[#1A1714]/35 uppercase font-medium mb-2">Clientes felices</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1A1714]" style={{ fontFamily: 'Georgia, serif' }}>Lo que dicen de nosotros</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm card-lift reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="flex gap-1 mb-4 sm:mb-5">
                  {Array(t.stars).fill(0).map((_, s) => <Star key={s} size={13} className="text-[#B8955A] fill-[#B8955A]" />)}
                </div>
                <p className="text-sm text-[#6B6560] leading-relaxed mb-5 sm:mb-6 italic">"{t.text}"</p>
                <div>
                  <p className="text-sm font-semibold text-[#1A1714]">{t.name}</p>
                  <p className="text-[11px] text-[#6B6560]">{t.city}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
