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

// ----- Rang konfiguratsiyasi (inline CSS - Tailwind purge muammosidan xoli) -----
const OVERLAY_STYLES: Record<string, {
  gradient: string;
  badgeBg: string;
  badgeColor: string;
  badgeBorder: string;
  titleColor: string;
  descColor: string;
  btnColor: string;
}> = {
  white:   {
    gradient:    'linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0.97) 55%, rgba(255,255,255,0.6) 75%, transparent 100%)',
    badgeBg:     'rgba(16,185,129,0.15)',
    badgeColor:  '#065f46',
    badgeBorder: '1px solid rgba(16,185,129,0.35)',
    titleColor:  '#111827',
    descColor:   '#374151',
    btnColor:    '#111827',
  },
  emerald: {
    gradient:    'linear-gradient(to right, rgba(5,150,105,1) 0%, rgba(5,150,105,0.97) 50%, rgba(5,150,105,0.55) 75%, transparent 100%)',
    badgeBg:     'rgba(255,255,255,0.28)',
    badgeColor:  '#fff',
    badgeBorder: '1px solid rgba(255,255,255,0.45)',
    titleColor:  '#ffffff',
    descColor:   'rgba(255,255,255,0.92)',
    btnColor:    '#ffffff',
  },
  blue: {
    gradient:    'linear-gradient(to right, rgba(29,78,216,1) 0%, rgba(29,78,216,0.97) 50%, rgba(29,78,216,0.55) 75%, transparent 100%)',
    badgeBg:     'rgba(255,255,255,0.28)',
    badgeColor:  '#fff',
    badgeBorder: '1px solid rgba(255,255,255,0.45)',
    titleColor:  '#ffffff',
    descColor:   'rgba(255,255,255,0.92)',
    btnColor:    '#ffffff',
  },
  violet: {
    gradient:    'linear-gradient(to right, rgba(109,40,217,1) 0%, rgba(109,40,217,0.97) 50%, rgba(109,40,217,0.55) 75%, transparent 100%)',
    badgeBg:     'rgba(255,255,255,0.28)',
    badgeColor:  '#fff',
    badgeBorder: '1px solid rgba(255,255,255,0.45)',
    titleColor:  '#ffffff',
    descColor:   'rgba(255,255,255,0.92)',
    btnColor:    '#ffffff',
  },
  amber: {
    gradient:    'linear-gradient(to right, rgba(217,119,6,1) 0%, rgba(217,119,6,0.97) 50%, rgba(217,119,6,0.55) 75%, transparent 100%)',
    badgeBg:     'rgba(255,255,255,0.28)',
    badgeColor:  '#fff',
    badgeBorder: '1px solid rgba(255,255,255,0.45)',
    titleColor:  '#ffffff',
    descColor:   'rgba(255,255,255,0.92)',
    btnColor:    '#ffffff',
  },
  rose: {
    gradient:    'linear-gradient(to right, rgba(190,18,60,1) 0%, rgba(190,18,60,0.97) 50%, rgba(190,18,60,0.55) 75%, transparent 100%)',
    badgeBg:     'rgba(255,255,255,0.28)',
    badgeColor:  '#fff',
    badgeBorder: '1px solid rgba(255,255,255,0.45)',
    titleColor:  '#ffffff',
    descColor:   'rgba(255,255,255,0.92)',
    btnColor:    '#ffffff',
  },
  slate: {
    gradient:    'linear-gradient(to right, rgba(15,23,42,1) 0%, rgba(15,23,42,0.97) 50%, rgba(15,23,42,0.55) 75%, transparent 100%)',
    badgeBg:     'rgba(255,255,255,0.18)',
    badgeColor:  '#fff',
    badgeBorder: '1px solid rgba(255,255,255,0.3)',
    titleColor:  '#ffffff',
    descColor:   'rgba(255,255,255,0.85)',
    btnColor:    '#ffffff',
  },
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

  const fetchSlides = () => {
    api.get(`ads/?t=${Date.now()}`).then(res => setSlides(res.data)).catch(() => {});
  };

  useEffect(() => {
    fetchSlides();

    // Sahifa fokusga qaytganda (admin paneldan asosiy sahifaga o'tganda) qayta yuklash
    const onVisible = () => {
      if (document.visibilityState === 'visible') fetchSlides();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
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
            const style = OVERLAY_STYLES[colorKey] || OVERLAY_STYLES['white'];

            return (
              <CarouselItem key={slide.id} className="pl-0 basis-full">
                <div className="relative w-full min-h-[280px] xs:min-h-[320px] sm:min-h-[380px] lg:min-h-[420px] rounded-2xl sm:rounded-3xl overflow-hidden group shadow-lg flex">

                  {/* Background image */}
                  <img
                    src={getImageUrl(slide.image)}
                    alt={slide.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Chap tomondagi rangli overlay panel — inline gradient */}
                  <div
                    className="relative z-10 w-[55%] sm:w-[48%] lg:w-[42%] flex flex-col justify-center px-5 sm:px-8 lg:px-10 py-6 sm:py-8"
                    style={{ background: style.gradient }}
                  >
                    {/* Tag badge */}
                    {slide.tag && (
                      <span
                        className="inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold mb-3 sm:mb-4"
                        style={{
                          background: style.badgeBg,
                          color: style.badgeColor,
                          border: style.badgeBorder,
                        }}
                      >
                        <Sparkles className="w-3 h-3" />
                        {slide.tag}
                      </span>
                    )}

                    {/* Title */}
                    <h2
                      className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-black leading-tight mb-2 sm:mb-3"
                      style={{ color: style.titleColor }}
                    >
                      {slide.title}
                    </h2>

                    {/* Description */}
                    <p
                      className="text-xs sm:text-sm lg:text-base font-medium leading-relaxed line-clamp-3 sm:line-clamp-4 mb-4 sm:mb-6"
                      style={{ color: style.descColor }}
                    >
                      {slide.description}
                    </p>

                    {/* CTA Button */}
                    <button
                      onClick={() => navigate('/train')}
                      className="inline-flex items-center gap-2 self-start px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl backdrop-blur-sm text-sm font-bold transition-all hover:scale-105 active:scale-95"
                      style={{
                        color: style.btnColor,
                        background: 'rgba(128,128,128,0.18)',
                        border: `1px solid ${style.btnColor === '#ffffff' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.15)'}`,
                      }}
                    >
                      Batafsil
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* O'ng tomonda qora gradient */}
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
