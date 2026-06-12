import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from './ui/carousel';
import { Button } from './ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import Autoplay from 'embla-carousel-autoplay';
import api from '@/lib/axios';
import { getImageUrl } from '@/lib/axios';

// ----- Rang konfiguratsiyasi -----
const OVERLAY_COLORS: Record<string, { from: string; via: string; badge: string; title: string; desc: string }> = {
  white:   { from: 'from-white/95',          via: 'via-white/80',          badge: 'bg-emerald-500/10 text-emerald-700 border-emerald-300/40',  title: 'text-gray-900',  desc: 'text-gray-600'  },
  emerald: { from: 'from-emerald-500/95',     via: 'via-emerald-500/80',    badge: 'bg-white/20 text-white border-white/30',                     title: 'text-white',     desc: 'text-white/85'  },
  blue:    { from: 'from-blue-600/95',        via: 'via-blue-600/80',       badge: 'bg-white/20 text-white border-white/30',                     title: 'text-white',     desc: 'text-white/85'  },
  violet:  { from: 'from-violet-600/95',      via: 'via-violet-600/80',     badge: 'bg-white/20 text-white border-white/30',                     title: 'text-white',     desc: 'text-white/85'  },
  amber:   { from: 'from-amber-400/95',       via: 'via-amber-400/80',      badge: 'bg-white/20 text-amber-900 border-white/30',                 title: 'text-amber-900', desc: 'text-amber-800' },
  rose:    { from: 'from-rose-600/95',        via: 'via-rose-600/80',       badge: 'bg-white/20 text-white border-white/30',                     title: 'text-white',     desc: 'text-white/85'  },
  slate:   { from: 'from-slate-800/95',       via: 'via-slate-800/80',      badge: 'bg-white/20 text-white border-white/30',                     title: 'text-white',     desc: 'text-white/75'  },
};

interface AdSlide {
  id: number;
  title: string;
  description: string;
  image: string;
  tag: string | null;
  overlay_color: string;
}

interface HeroCarouselProps {
  userRole?: 'student' | 'parent' | 'teacher' | 'admin' | null;
}

export const HeroCarousel = ({ userRole }: HeroCarouselProps = {}) => {
  const navigate = useNavigate();
  const [apiCarousel, setApiCarousel] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState<AdSlide[]>([]);

  useEffect(() => {
    api.get('ads/').then(res => setSlides(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!apiCarousel) return;
    setCurrent(apiCarousel.selectedScrollSnap());
    apiCarousel.on('select', () => {
      setCurrent(apiCarousel.selectedScrollSnap());
    });
  }, [apiCarousel]);

  if (slides.length === 0) {
    return (
      <div className="w-full min-h-[280px] xs:min-h-[320px] sm:min-h-[380px] lg:min-h-[420px] rounded-2xl sm:rounded-3xl bg-muted animate-pulse" />
    );
  }

  return (
    <div className="w-full">
      <Carousel
        setApi={setApiCarousel}
        opts={{ align: 'start', loop: true }}
        plugins={[Autoplay({ delay: 5000, stopOnInteraction: true })]}
        className="w-full"
      >
        <CarouselContent className="-ml-0">
          {slides.map((slide) => {
            const colorKey = slide.overlay_color || 'white';
            const colors = OVERLAY_COLORS[colorKey] || OVERLAY_COLORS['white'];

            return (
              <CarouselItem key={slide.id} className="pl-0 basis-full">
                <div className="relative w-full min-h-[280px] xs:min-h-[320px] sm:min-h-[380px] lg:min-h-[420px] rounded-2xl sm:rounded-3xl overflow-hidden group shadow-lg flex">

                  {/* Background image — o'ng tomonda */}
                  <img
                    src={getImageUrl(slide.image)}
                    alt={slide.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Chap tomondagi rangli overlay panel */}
                  <div
                    className={`relative z-10 w-[55%] sm:w-[48%] lg:w-[42%] flex flex-col justify-center px-5 sm:px-8 lg:px-10 py-6 sm:py-8
                      bg-gradient-to-r ${colors.from} ${colors.via} to-transparent`}
                  >
                    {/* Tag badge */}
                    {slide.tag && (
                      <span className={`inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold border mb-3 sm:mb-4 ${colors.badge}`}>
                        <Sparkles className="w-3 h-3" />
                        {slide.tag}
                      </span>
                    )}

                    {/* Title */}
                    <h2 className={`text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-black leading-tight mb-2 sm:mb-3 ${colors.title}`}>
                      {slide.title}
                    </h2>

                    {/* Description */}
                    <p className={`text-xs sm:text-sm lg:text-base font-medium leading-relaxed line-clamp-3 sm:line-clamp-4 mb-4 sm:mb-6 ${colors.desc}`}>
                      {slide.description}
                    </p>

                    {/* CTA Button */}
                    <button
                      onClick={() => navigate('/train')}
                      className="inline-flex items-center gap-2 self-start px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-sm font-bold transition-all hover:scale-105 active:scale-95 text-inherit"
                      style={{ color: colorKey === 'white' || colorKey === 'amber' ? '#1f2937' : 'white' }}
                    >
                      Batafsil
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* O'ng tomonda qora gradient (rasmni chiroyliroq ko'rsatish uchun) */}
                  <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-black/30 to-transparent pointer-events-none" />
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {/* Dots */}
        <div className="flex justify-center gap-1.5 sm:gap-2 mt-3 sm:mt-4">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => apiCarousel?.scrollTo(index)}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                current === index
                  ? 'w-6 sm:w-8 bg-primary'
                  : 'w-1.5 sm:w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </Carousel>
    </div>
  );
};
