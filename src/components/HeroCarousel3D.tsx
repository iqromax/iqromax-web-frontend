import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselApi } from
'./ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import {
  Play,
  GraduationCap,
  BarChart3,
  Gamepad2,
  Rocket,
  Eye,
  FileText } from
'lucide-react';
import iqromaxLogo from '@/assets/iqromax-logo-full.png';
import heroSlideKids from '@/assets/hero-slide-kids.jpg';
import heroSlideParents from '@/assets/hero-slide-parents.jpg';
import heroSlideTeachers from '@/assets/hero-slide-teachers.jpg';

interface HeroSlide {
  id: string;
  image: string;
  gradientOverlay: string;
  badge: {
    icon: React.ElementType;
    text: string;
    bgColor: string;
    extraBadge?: string;
  };
  title: React.ReactNode;
  shortTitle: React.ReactNode;
  description: React.ReactNode;
  shortDescription: React.ReactNode;
  cta: {
    icon: React.ElementType;
    text: string;
    className: string;
  };
  showLogo?: boolean;
  secondaryCta?: {
    icon: React.ElementType;
    text: string;
  };
}

interface HeroCarousel3DProps {
  totalUsers: number;
}

export const HeroCarousel3D = ({ totalUsers }: HeroCarousel3DProps) => {
  const navigate = useNavigate();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [expandedSlides, setExpandedSlides] = useState<Record<number, boolean>>({});
  const isExpanded = (i: number) => expandedSlides[i] ?? false;
  const toggleExpanded = (i: number) =>
    setExpandedSlides((p) => ({ ...p, [i]: !isExpanded(i) }));

  // 4 separate slides - one per audience
  const slides: HeroSlide[] = useMemo(() => [
  {
    id: 'main',
    image: heroSlideKids,
    gradientOverlay: 'from-black/70 via-black/30 to-transparent',
    badge: {
      icon: Rocket,
      text: "Bolalar • Trenerlar • Ota-onalar uchun",
      bgColor: 'bg-primary/90 text-white'
    },
    title:
    <>
          <span className="block text-primary drop-shadow-[0_2px_8px_rgba(34,197,94,0.4)]">IQROMAX —</span>
          <span className="block mt-1 text-white/95">tez hisoblashni o'rgatuvchi platforma</span>
        </>,
    shortTitle: <span className="block text-primary">IQROMAX</span>,

    description:
    <>
          ⚡ Tez va samarali metodika · 🎮 O'yin tarzida o'qitish · 📊 Real natijani ko'rish
        </>,
    shortDescription: <>⚡ Tez · 🎮 O'yin · 📊 Natija</>,

    cta: {
      icon: Rocket,
      text: 'Bepul boshlash',
      className: 'bg-primary text-primary-foreground hover:bg-primary/90'
    },
    showLogo: true
  },
  {
    id: 'kids',
    image: heroSlideKids,
    gradientOverlay: 'from-blue-900/60 via-blue-900/20 to-transparent',
    badge: {
      icon: Gamepad2,
      text: "Bolalar uchun",
      bgColor: 'bg-blue-500 text-white'
    },
    title:
    <>
          <span className="block">O'ynab o'rganing,</span>
          <span className="block text-kid-yellow">tez rivojlaning! 🚀</span>
        </>,
    shortTitle: <span className="block text-kid-yellow">O'ynab o'rganing 🚀</span>,

    description:
    <>
          🎯 Qiziqarli mashqlar · ⭐ XP va level tizimi · 🏆 Reyting va musobaqalar · 🎖️ Badges va mukofotlar
        </>,
    shortDescription: <>🎯 Mashqlar · ⭐ XP · 🏆 Reyting</>,

    cta: {
      icon: Rocket,
      text: 'Boshlash',
      className: 'bg-blue-500 text-white hover:bg-blue-600'
    }
  },
  {
    id: 'parents',
    image: heroSlideParents,
    gradientOverlay: 'from-orange-900/60 via-orange-900/20 to-transparent',
    badge: {
      icon: Eye,
      text: 'Ota-onalar uchun',
      bgColor: 'bg-orange-500 text-white'
    },
    title:
    <>
          <span className="block">Farzandingiz rivojini</span>
          <span className="block text-kid-yellow">nazorat qiling 📊</span>
        </>,
    shortTitle: <span className="block text-kid-yellow">Nazorat qiling 📊</span>,

    description:
    <>
          ✅ Real vaqtda natijalar · 📋 Kunlik mashqlar va progress · 💡 Tavsiyalar va tahlillar · 🎯 Motivatsiya va maqsadlar
        </>,
    shortDescription: <>✅ Natijalar · 📋 Progress · 💡 Tavsiyalar</>,

    cta: {
      icon: BarChart3,
      text: "Natijalarni ko'rish",
      className: 'bg-orange-500 text-white hover:bg-orange-600'
    }
  },
  {
    id: 'teachers',
    image: heroSlideTeachers,
    gradientOverlay: 'from-emerald-900/60 via-emerald-900/20 to-transparent',
    badge: {
      icon: GraduationCap,
      text: "Trenerlar uchun",
      bgColor: 'bg-emerald-500 text-white'
    },
    title:
    <>
          <span className="block">Trener bo'lib</span>
          <span className="block text-kid-yellow">daromad toping! 💰</span>
        </>,
    shortTitle: <span className="block text-kid-yellow">Daromad toping 💰</span>,

    description:
    <>
          ✅ 1 oyda professional trener · 👥 O'z guruhingizni ochasiz · 🌐 Onlayn va oflayn o'qitish · 📈 Barqaror daromad manbai
        </>,
    shortDescription: <>✅ 1 oyda · 👥 Guruh · 📈 Daromad</>,

    cta: {
      icon: FileText,
      text: "Trener bo'lish",
      className: 'bg-emerald-500 text-white hover:bg-emerald-600'
    }
  }],
  []);

  const slideLabels: Record<string, string> = {
    main: 'IQROMAX',
    kids: 'Bolalar',
    parents: 'Ota-onalar',
    teachers: 'Trenerlar'
  };

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on('select', onSelect);
    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  const scrollTo = useCallback((index: number) => {
    api?.scrollTo(index);
  }, [api]);

  // Keyboard navigation: ←/→ arrows, Home/End
  useEffect(() => {
    if (!api) return;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); api.scrollNext(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); api.scrollPrev(); }
      else if (e.key === 'Home') { e.preventDefault(); api.scrollTo(0); }
      else if (e.key === 'End') { e.preventDefault(); api.scrollTo(slides.length - 1); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [api, slides.length]);

  // Autoplay plugin with touch-friendly settings
  const autoplayPlugin = useMemo(() =>
  Autoplay({
    delay: 4000,
    stopOnInteraction: false,
    stopOnMouseEnter: true
  }),
  []);

  return (
    <div
      className="relative overflow-hidden rounded-none sm:rounded-2xl md:rounded-3xl shadow-2xl -mx-4 sm:mx-0">

      <Carousel
        setApi={setApi}
        opts={{
          loop: true,
          dragFree: false,
          containScroll: 'trimSnaps',
          skipSnaps: false,
          duration: 15,
          dragThreshold: 3
        }}
        plugins={[autoplayPlugin]}
        className="w-full touch-pan-y select-none">

        <CarouselContent className="ml-0" style={{ touchAction: 'pan-y pinch-zoom' }}>
          {slides.map((slide, index) =>
          <CarouselItem key={slide.id} className="touch-manipulation cursor-grab active:cursor-grabbing pl-0 [perspective:1400px]">
              {/* Mobile-optimized height - simplified for performance */}
              <div
              className={`group relative h-[320px] xs:h-[360px] sm:h-[480px] md:h-[560px] lg:h-[640px] overflow-hidden transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [transform-style:preserve-3d] hover:[transform:rotateY(-3deg)_rotateX(2deg)_scale(1.01)] ${current === index ? '[transform:rotateY(0deg)_scale(1)]' : '[transform:rotateY(2deg)_scale(0.97)] opacity-80'}`}>

                {/* Image Background with Ken Burns + parallax */}
                <img
                src={slide.image}
                alt={slide.id}
                loading={index === 0 ? 'eager' : 'lazy'}
                decoding="async"
                className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 ${current === index ? 'scale-105' : 'scale-100'}`} />


                {/* Simple gradient overlay - no animation on mobile */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-kid-yellow/20 opacity-60 hidden sm:block" />
                
                {/* Stronger gradient for mobile readability - simplified */}
                <div className={`absolute inset-0 bg-gradient-to-t ${slide.gradientOverlay}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 sm:from-black/60 sm:via-transparent sm:to-transparent" />
                
                {/* Vignette effect - static, no hover */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)]" />
                
                {/* Animated glow spots - only on desktop */}
                <div className="hidden sm:block absolute top-1/4 left-1/4 w-48 md:w-64 h-48 md:h-64 bg-kid-yellow/20 rounded-full blur-3xl opacity-50" />
                <div className="hidden sm:block absolute bottom-1/3 right-1/4 w-36 md:w-48 h-36 md:h-48 bg-primary/20 rounded-full blur-3xl opacity-40" />

                {/* Floating particles - only on desktop */}
                <div className="hidden sm:block absolute inset-0 overflow-hidden pointer-events-none">
                  {[...Array(6)].map((_, i) =>
                <div
                  key={i}
                  className="absolute w-1.5 h-1.5 bg-white rounded-full opacity-60"
                  style={{
                    left: `${10 + i * 12 % 80}%`,
                    top: `${20 + i * 11 % 60}%`,
                    animation: `float ${4 + i % 3}s ease-in-out infinite`,
                    animationDelay: `${i * 0.4}s`,
                    boxShadow: '0 0 6px 2px rgba(255,255,255,0.6)'
                  }} />

                )}
                </div>

                {/* Content */}
                <div
                className={`absolute inset-0 flex flex-col items-center justify-end p-4 xs:p-5 sm:p-8 md:p-10 text-white text-center [transform-style:preserve-3d] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                current === index ? 'opacity-100 [transform:translateZ(40px)]' : 'opacity-0 [transform:translateZ(0px)]'}`
                }>

                  {/* Badge Row */}
                <div
                  className={`flex flex-wrap items-center justify-center gap-1.5 xs:gap-2 sm:gap-3 mb-2 xs:mb-3 sm:mb-5 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  current === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`
                  } style={{ transitionDelay: current === index ? '120ms' : '0ms' }}>

                    {slide.showLogo &&
                  <div className="bg-white/95 rounded-xl xs:rounded-2xl sm:rounded-2xl p-2 xs:p-2.5 sm:p-3 shadow-2xl ring-2 ring-white/30 transition-transform duration-500 hover:scale-110 hover:rotate-2">
                        <img src={iqromaxLogo} alt="IQROMAX" className="h-7 xs:h-8 sm:h-10 md:h-12 w-auto" />
                      </div>
                  }
                    <div className="relative">
                      <span className={`relative inline-flex items-center gap-1.5 xs:gap-2 sm:gap-2.5 px-3 xs:px-4 sm:px-5 py-1.5 xs:py-2 sm:py-2.5 ${slide.badge.bgColor} rounded-full text-[11px] xs:text-xs sm:text-sm font-black shadow-2xl border border-white/20 transition-transform duration-300 hover:scale-105`}>
                        <slide.badge.icon className="h-3.5 w-3.5 xs:h-4 xs:w-4 sm:h-5 sm:w-5" />
                        <span className="tracking-wide">{slide.badge.text}</span>
                      </span>
                    </div>
                    {slide.badge.extraBadge &&
                  <span className="px-2.5 xs:px-3 py-1 xs:py-1.5 bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-400 text-amber-900 rounded-full text-[10px] xs:text-xs sm:text-sm font-black shadow-xl border border-amber-200/50 animate-pulse">
                        ✨ {slide.badge.extraBadge}
                      </span>
                  }
                  </div>

                  {/* Title with staggered slide-up */}
                  <h1
                  className={`text-xl xs:text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-black leading-[1.05] mb-2 xs:mb-3 sm:mb-5 md:mb-6 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  current === index ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-6 blur-sm'}`
                  } style={{ transitionDelay: current === index ? '240ms' : '0ms' }}>

                    <span className="text-white drop-shadow-2xl">
                      {/* Mobile: short by default unless expanded; sm+: always full */}
                      <span className="sm:hidden">{isExpanded(index) ? slide.title : slide.shortTitle}</span>
                      <span className="hidden sm:inline">{slide.title}</span>
                    </span>
                  </h1>

                  {/* Description glass card */}
                  <div
                  className={`mb-2 xs:mb-3 sm:mb-7 md:mb-8 flex flex-col items-center gap-2 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  current === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`
                  } style={{ transitionDelay: current === index ? '360ms' : '0ms' }}>

                    <div className="relative">
                      <p
                      className="relative text-center text-xs xs:text-sm sm:text-xl md:text-2xl lg:text-3xl text-white max-w-xs xs:max-w-sm sm:max-w-xl md:max-w-2xl leading-snug xs:leading-relaxed sm:leading-loose font-semibold tracking-wide px-2.5 py-1.5 xs:px-3 xs:py-2 sm:px-6 sm:py-4 bg-black/30 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/20 transition-all duration-500 hover:bg-black/40 hover:border-white/30"
                      style={{
                        textShadow: '0 2px 4px rgba(0,0,0,1), 0 4px 20px rgba(0,0,0,0.9)'
                      }}>

                        <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                          <span className="sm:hidden">{isExpanded(index) ? slide.description : slide.shortDescription}</span>
                          <span className="hidden sm:inline">{slide.description}</span>
                        </span>
                      </p>
                    </div>

                    {/* Mobile-only toggle: short ↔ full */}
                    <button
                      type="button"
                      onClick={() => toggleExpanded(index)}
                      aria-expanded={isExpanded(index)}
                      className="sm:hidden inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 text-white text-[11px] font-bold border border-white/25 backdrop-blur-sm transition-all"
                    >
                      {isExpanded(index) ? '▲ Yashirish' : '▼ Batafsil'}
                    </button>
                  </div>

                  {/* CTA Buttons */}
                  <div
                  className={`flex flex-row items-center justify-center gap-3 xs:gap-3.5 sm:gap-4 md:gap-5 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  current === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`
                  } style={{ transitionDelay: current === index ? '480ms' : '0ms' }}>

                    <Button
                    size="lg"
                    onClick={() => navigate('/auth')}
                    className={`gap-2 xs:gap-2.5 sm:gap-4 ${slide.cta.className} font-black active:scale-95 h-10 xs:h-12 sm:h-16 md:h-[72px] text-sm xs:text-base sm:text-xl md:text-2xl px-5 xs:px-6 sm:px-10 md:px-14 rounded-xl sm:rounded-3xl border-2 border-white/40 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:-translate-y-0.5`}>

                      <slide.cta.icon className="h-4 w-4 xs:h-5 xs:w-5 sm:h-8 sm:w-8" />
                      <span className="truncate font-black tracking-wide">{slide.cta.text}</span>
                    </Button>
                    {slide.showLogo &&
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate('/train')}
                    className="gap-2.5 xs:gap-3 bg-white/25 border-2 border-white/50 text-white hover:bg-white/40 active:scale-95 h-12 xs:h-14 sm:h-16 md:h-[72px] text-base xs:text-lg sm:text-xl md:text-2xl px-6 xs:px-8 sm:px-10 md:px-14 rounded-2xl sm:rounded-3xl font-black shadow-xl">

                        <Gamepad2 className="h-6 w-6 xs:h-7 xs:w-7 sm:h-8 sm:w-8" />
                        <span className="hidden xs:inline font-black">Demo sinash</span>
                        <span className="xs:hidden text-xl">🎮</span>
                      </Button>
                  }
                  </div>
                </div>
              </div>
            </CarouselItem>
          )}
        </CarouselContent>
        
        {/* Navigation Arrows - Hidden on mobile */}
        <CarouselPrevious className="hidden sm:flex left-2 md:left-3 bg-white/20 border-white/30 text-white hover:bg-white/40 active:scale-90 sm:h-10 sm:w-10 md:h-12 md:w-12 shadow-xl" />
        <CarouselNext className="hidden sm:flex right-2 md:right-3 bg-white/20 border-white/30 text-white hover:bg-white/40 active:scale-90 sm:h-10 sm:w-10 md:h-12 md:w-12 shadow-xl" />
      </Carousel>

      {/* Dot Indicators - Simplified */}
      


























      {/* Slide Indicators - numbers + section labels */}
      <div
        role="tablist"
        aria-label="Hero slaydlar"
        className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-black/45 backdrop-blur-md rounded-full border border-white/15 shadow-xl"
      >
        {slides.map((slide, index) => {
          const active = current === index;
          return (
            <button
              key={slide.id}
              role="tab"
              aria-selected={active}
              aria-label={`${index + 1}. ${slideLabels[slide.id] ?? slide.id}`}
              onClick={() => scrollTo(index)}
              className={`group flex items-center gap-1.5 rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                active
                  ? 'bg-white text-gray-900 px-3 sm:px-3.5 py-1 sm:py-1.5 shadow-lg'
                  : 'bg-white/10 text-white hover:bg-white/25 px-2 sm:px-2.5 py-1 sm:py-1.5'
              }`}
            >
              <span className={`flex items-center justify-center text-[10px] sm:text-xs font-black rounded-full transition-all ${
                active ? 'bg-primary text-primary-foreground w-4 h-4 sm:w-5 sm:h-5' : 'bg-white/20 w-4 h-4 sm:w-5 sm:h-5'
              }`}>
                {index + 1}
              </span>
              <span className={`text-[11px] sm:text-xs font-bold tracking-wide whitespace-nowrap transition-all ${
                active ? 'inline opacity-100' : 'hidden sm:inline opacity-80 group-hover:opacity-100'
              }`}>
                {slideLabels[slide.id] ?? slide.id}
              </span>
            </button>
          );
        })}
      </div>

      {/* Social Proof Overlay - Compact on mobile */}
      <div className="absolute top-2 right-2 xs:top-3 xs:right-3 sm:top-4 sm:right-4 z-10">
        <div className="flex items-center gap-1.5 xs:gap-2 px-2 xs:px-3 py-1 xs:py-1.5 bg-black/50 backdrop-blur-sm rounded-full text-[10px] xs:text-xs text-white border border-white/20">
          <div className="flex -space-x-1 xs:-space-x-1.5">
            <div className="w-4 h-4 xs:w-5 xs:h-5 rounded-full bg-gradient-to-br from-kid-green to-emerald-600 border border-white/50 flex items-center justify-center text-[7px] xs:text-[8px]">👦</div>
            <div className="w-4 h-4 xs:w-5 xs:h-5 rounded-full bg-gradient-to-br from-kid-pink to-pink-600 border border-white/50 flex items-center justify-center text-[7px] xs:text-[8px]">👧</div>
            <div className="w-4 h-4 xs:w-5 xs:h-5 rounded-full bg-gradient-to-br from-kid-yellow to-amber-600 border border-white/50 flex items-center justify-center text-[7px] xs:text-[8px]">🧒</div>
          </div>
          <span className="font-semibold whitespace-nowrap">{totalUsers > 0 ? totalUsers.toLocaleString() : '500'}+</span>
        </div>
      </div>

    </div>);

};