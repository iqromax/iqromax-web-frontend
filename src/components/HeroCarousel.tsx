import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from './ui/carousel';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';
import Autoplay from 'embla-carousel-autoplay';

// Import hero images
import heroKidsImg from '@/assets/hero-kids.jpg';
import heroParentsImg from '@/assets/hero-parents.jpg';
import heroTeachersImg from '@/assets/hero-teachers.jpg';

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  gradient: string;
  buttonText: string;
  href: string;
  image: string;
  roles: string[]; // qaysi rollarga ko'rsatiladi
}

const heroSlides: HeroSlide[] = [
  {
    id: 'kids',
    title: "Bola uchun",
    subtitle: "O'yinlar orqali tez hisoblashni o'rgan",
    description: "Qiziqarli o'yinlar, animatsiyalar va mukofotlar bilan matematikani sevib o'rgan!",
    icon: "🎮",
    gradient: "from-emerald-500 via-green-500 to-teal-500",
    buttonText: "O'rganishni boshlash",
    href: "/train",
    image: heroKidsImg,
    roles: ['student', 'parent', 'teacher', 'admin'],
  },
  {
    id: 'competition',
    title: "Musobaqalar",
    subtitle: "Do'stlaring bilan bellashing!",
    description: "Haftalik musobaqalarda qatnashing, reyting jadvalida birinchi o'ringa chiqing!",
    icon: "🏆",
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    buttonText: "Musobaqaga o'tish",
    href: "/weekly-game",
    image: heroKidsImg,
    roles: ['student', 'parent', 'teacher', 'admin'],
  },
  {
    id: 'practice',
    title: "Mashq qiling",
    subtitle: "Har kuni mashq — har kuni yutuq!",
    description: "Mental arifmetika bo'yicha tezlikni oshiring, rekordlaringizni yangilang!",
    icon: "🧠",
    gradient: "from-rose-500 via-pink-500 to-red-400",
    buttonText: "Mashqni boshlash",
    href: "/abacus-practice",
    image: heroKidsImg,
    roles: ['student', 'parent', 'teacher', 'admin'],
  },
  {
    id: 'leaderboard',
    title: "Reyting jadvali",
    subtitle: "Eng yaxshilar orasida bo'ling!",
    description: "O'z natijalaringizni boshqalar bilan solishtiring va motivatsiya oling!",
    icon: "📊",
    gradient: "from-cyan-500 via-teal-500 to-emerald-400",
    buttonText: "Reytingni ko'rish",
    href: "/records",
    image: heroKidsImg,
    roles: ['student', 'admin'],
  },
  {
    id: 'parents',
    title: "Ota-ona uchun",
    subtitle: "Farzandingiz rivojini real vaqtda kuzating",
    description: "Batafsil statistika, kunlik hisobotlar va farzandingiz yutuqlarini ko'ring.",
    icon: "👨‍👩‍👧‍👦",
    gradient: "from-blue-500 via-cyan-500 to-sky-500",
    buttonText: "Kuzatishni boshlash",
    href: "/statistics",
    image: heroParentsImg,
    roles: ['parent', 'admin'],
  },
  {
    id: 'teachers',
    title: "O'qituvchi uchun",
    subtitle: "Darslarni oson boshqaring va natijani ko'ring",
    description: "O'quvchilar statistikasi, kurs yaratish va sertifikatlar berish imkoniyati.",
    icon: "👩‍🏫",
    gradient: "from-amber-500 via-yellow-500 to-orange-400",
    buttonText: "O'qitishni boshlash",
    href: "/courses",
    image: heroTeachersImg,
    roles: ['teacher', 'admin'],
  },
];

interface HeroCarouselProps {
  userRole?: 'student' | 'parent' | 'teacher' | 'admin' | null;
}

export const HeroCarousel = ({ userRole }: HeroCarouselProps = {}) => {
  const navigate = useNavigate();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  // Rolga qarab slaydlarni filtrlash
  const filteredSlides = userRole 
    ? heroSlides.filter(s => s.roles.includes(userRole))
    : heroSlides;

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="w-full">
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 5000,
            stopOnInteraction: true,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent className="-ml-0">
          {filteredSlides.map((slide) => (
            <CarouselItem key={slide.id} className="pl-0 basis-full">
              <div 
                className={`relative w-full min-h-[280px] xs:min-h-[320px] sm:min-h-[380px] lg:min-h-[420px] rounded-2xl sm:rounded-3xl p-4 xs:p-5 sm:p-8 lg:p-10 flex flex-col justify-center overflow-hidden group shadow-lg`}
              >
                {/* Background Image covering the whole container */}
                <img 
                  src={slide.image} 
                  alt={slide.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Gradient overlay to make text readable but keep the image visible */}
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/80 via-black/50 to-black/20 lg:to-transparent" />
                
                {/* Optional color tint based on the slide's original gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} opacity-20 mix-blend-overlay`} />

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left max-w-2xl mx-auto lg:mx-0 mt-auto lg:mt-0 pt-10 lg:pt-0">
                  <div className="flex items-center gap-2 sm:gap-3 justify-center lg:justify-start mb-3 sm:mb-4">
                    <span className="text-3xl xs:text-4xl sm:text-5xl animate-bounce-soft drop-shadow-md">
                      {slide.icon}
                    </span>
                    <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs sm:text-sm font-bold border border-white/30 shadow-sm">
                      {slide.title}
                    </span>
                  </div>
                  <h1 className="text-xl xs:text-2xl sm:text-3xl lg:text-5xl font-display font-black text-white mb-2 sm:mb-4 leading-tight drop-shadow-lg">
                    {slide.subtitle}
                  </h1>
                  <p className="text-white/90 text-sm sm:text-base lg:text-lg mb-4 sm:mb-8 font-medium drop-shadow-md line-clamp-3 sm:line-clamp-none">
                    {slide.description}
                  </p>
                  <Button 
                    size="default"
                    className="bg-white text-gray-900 hover:bg-white/90 font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 h-auto rounded-xl w-full sm:w-auto"
                    onClick={() => navigate(slide.href)}
                  >
                    {slide.buttonText}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>

                {/* Decorative floating elements */}
                <div className="hidden xs:block absolute top-4 right-6 text-2xl animate-bounce opacity-70 drop-shadow-md" style={{ animationDuration: '2s' }}>✨</div>
                <div className="hidden xs:block absolute bottom-6 right-12 text-xl animate-bounce opacity-60 drop-shadow-md" style={{ animationDelay: '0.5s' }}>⭐</div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Custom dots indicator */}
        <div className="flex justify-center gap-1.5 sm:gap-2 mt-3 sm:mt-4">
          {filteredSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
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
