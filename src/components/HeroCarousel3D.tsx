import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from './ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import {
  Play,
  ChevronRight,
  Star,
  Trophy,
  Target,
  Award,
  ShieldCheck,
  TrendingUp,
  Users,
  CalendarCheck,
  CheckCircle2,
  Quote,
  Zap,
  GraduationCap,
  BarChart3,
  Gamepad2,
  Eye,
} from 'lucide-react';
import iqromaxLogo from '@/assets/iqromax-logo.png';
import heroKids from '@/assets/hero-kids-learning.jpg';
import heroParents from '@/assets/hero-parents-child.jpg';
import heroTeachers from '@/assets/hero-teacher-class.jpg';

interface HeroCarousel3DProps {
  totalUsers: number;
}

const fmt = (n: number) => (n >= 10000 ? `${Math.round(n / 1000)}K+` : `${n.toLocaleString()}+`);

export const HeroCarousel3D = ({ totalUsers }: HeroCarousel3DProps) => {
  const navigate = useNavigate();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on('select', onSelect);
    return () => { api.off('select', onSelect); };
  }, [api]);

  useEffect(() => {
    if (!api) return;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') { e.preventDefault(); api.scrollNext(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); api.scrollPrev(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [api]);

  const autoplay = useMemo(() => Autoplay({ delay: 6000, stopOnInteraction: false, stopOnMouseEnter: true }), []);

  const slides = [
    { id: 'main', label: 'IQROMAX' },
    { id: 'kids', label: 'Bolalar' },
    { id: 'parents', label: 'Ota-onalar' },
    { id: 'teachers', label: 'Trenerlar' },
  ];

  const scrollTo = useCallback((i: number) => api?.scrollTo(i), [api]);

  return (
    <div className="relative">
      <Carousel
        setApi={setApi}
        opts={{ loop: true, duration: 25 }}
        plugins={[autoplay]}
        className="w-full"
      >
        <CarouselContent className="ml-0">
          <CarouselItem className="pl-0"><MainSlide totalUsers={totalUsers} navigate={navigate} /></CarouselItem>
          <CarouselItem className="pl-0"><KidsSlide navigate={navigate} /></CarouselItem>
          <CarouselItem className="pl-0"><ParentsSlide navigate={navigate} /></CarouselItem>
          <CarouselItem className="pl-0"><TeachersSlide navigate={navigate} /></CarouselItem>
        </CarouselContent>
      </Carousel>

      {/* Indicators */}
      <div role="tablist" aria-label="Hero slaydlar" className="mt-4 mx-auto w-fit flex items-center gap-2 px-3 py-2 rounded-full bg-background/80 backdrop-blur-md border border-border/50 shadow-lg">
        {slides.map((s, i) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={current === i}
            aria-label={`Slayd ${i + 1}: ${s.label}`}
            onClick={() => scrollTo(i)}
            className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all ${
              current === i ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'
            }`}
          >
            <span className={`text-[10px] font-black ${current === i ? 'text-primary-foreground' : 'text-foreground'}`}>{i + 1}</span>
            <span className="text-[10px] font-semibold hidden xs:inline">{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

/* ─────────────── Shared shell ─────────────── */
type ShellProps = {
  badge: { text: string; icon: React.ElementType; className: string };
  titleLeft: React.ReactNode;
  titleAccent: React.ReactNode;
  titleAccentColor: string;
  description: string;
  features?: { icon: string; title: string; desc?: string }[];
  bullets?: string[];
  primaryCta: { text: string; icon: React.ElementType; onClick: () => void; className: string };
  secondaryCta?: { text: string; icon: React.ElementType; onClick: () => void };
  image: string;
  imageMaskShape?: 'circle' | 'rect';
  bg: string;
  textOnDark?: boolean;
  sideContent: React.ReactNode;
  bottomStats?: { icon: React.ElementType; value: string; label: string; color: string }[];
  showLogo?: boolean;
  navTopLeft?: React.ReactNode;
};

const SlideShell = ({
  badge, titleLeft, titleAccent, titleAccentColor, description, features, bullets,
  primaryCta, secondaryCta, image, imageMaskShape = 'rect', bg, textOnDark, sideContent, bottomStats, showLogo, navTopLeft,
}: ShellProps) => (
  <div className={`relative overflow-hidden rounded-3xl ${bg} ${textOnDark ? 'text-white' : 'text-foreground'}`}>
    {/* Optional grid pattern for dark slides */}
    {textOnDark && (
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />
    )}

    <div className="relative grid lg:grid-cols-[1.05fr_1fr] gap-4 lg:gap-6 p-4 sm:p-8 lg:p-10 min-h-[380px] sm:min-h-[480px] lg:min-h-[560px]">
      {/* LEFT: text */}
      <div className="flex flex-col justify-center max-w-2xl order-2 lg:order-1">
        {showLogo && (
          <img src={iqromaxLogo} alt="IQROMAX" className="h-7 w-auto mb-3 object-contain self-start" />
        )}
        <div className={`inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full font-bold text-xs mb-4 ${badge.className}`}>
          <badge.icon className="h-3.5 w-3.5" />
          {badge.text}
        </div>
        <h1 className={`text-[26px] xs:text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.05] mb-4`}>
          <span className="block">{titleLeft}</span>
          <span className={`block ${titleAccentColor}`}>{titleAccent}</span>
        </h1>
        <p className={`text-sm sm:text-base mb-5 max-w-lg leading-relaxed ${textOnDark ? 'text-white/70' : 'text-muted-foreground'}`}>
          {description}
        </p>

        {features && (
          <ul className="space-y-3 mb-6">
            {features.map((f, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className={`h-9 w-9 rounded-xl flex items-center justify-center text-base ${textOnDark ? 'bg-white/10' : 'bg-primary/10'}`}>
                  <span>{f.icon}</span>
                </div>
                <div>
                  <p className="text-sm font-bold">{f.title}</p>
                  {f.desc && <p className={`text-xs ${textOnDark ? 'text-white/60' : 'text-muted-foreground'}`}>{f.desc}</p>}
                </div>
              </li>
            ))}
          </ul>
        )}

        {bullets && (
          <ul className="space-y-2 mb-6">
            {bullets.map((b, i) => (
              <li key={i} className="flex items-center gap-2.5 text-sm">
                <CheckCircle2 className={`h-4 w-4 shrink-0 ${textOnDark ? 'text-emerald-400' : 'text-emerald-500'}`} />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-wrap gap-3">
          <Button size="lg" onClick={primaryCta.onClick} className={`h-12 px-6 rounded-full font-bold gap-2 shadow-lg ${primaryCta.className}`}>
            <primaryCta.icon className="h-4 w-4" />
            {primaryCta.text}
            <ChevronRight className="h-4 w-4" />
          </Button>
          {secondaryCta && (
            <Button size="lg" variant="outline" onClick={secondaryCta.onClick} className={`h-12 px-6 rounded-full font-bold gap-2 ${textOnDark ? 'bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white' : ''}`}>
              <secondaryCta.icon className="h-4 w-4" />
              {secondaryCta.text}
            </Button>
          )}
        </div>

        {bottomStats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-current/10">
            {bottomStats.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <s.icon className={`h-4 w-4 ${s.color}`} />
                <div>
                  <p className="text-sm font-black leading-none">{s.value}</p>
                  <p className={`text-[10px] ${textOnDark ? 'text-white/60' : 'text-muted-foreground'}`}>{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT: image + overlay cards */}
      <div className="relative min-h-[420px] sm:min-h-[480px] lg:min-h-[480px] order-1 lg:order-2">
        <div className={`absolute inset-0 ${imageMaskShape === 'circle' ? 'rounded-[40%_40%_40%_40%/30%_30%_30%_30%]' : 'rounded-2xl'} overflow-hidden`}>
          <img src={image} alt="" className="w-full h-full object-cover" />
        </div>
        {sideContent}
      </div>
    </div>
  </div>
);

/* ─────────────── Slide 1: MAIN (dark green) ─────────────── */
const MainSlide = ({ totalUsers, navigate }: any) => (
  <SlideShell
    bg="bg-gradient-to-br from-[#06180e] via-[#0a2818] to-[#0f3a22]"
    textOnDark
    showLogo
    badge={{ text: 'Bolalar • Trenerlar • Ota-onalar', icon: Star, className: 'bg-emerald-500/15 border border-emerald-400/30 text-emerald-300' }}
    titleLeft={<span className="text-emerald-400">IQROMAX —</span>}
    titleAccent="tez hisoblashni o'rgatuvchi platforma"
    titleAccentColor="text-white"
    description="5–15 yoshdagi bolalar uchun yapon abakus metodikasi asosida ishlab chiqilgan zamonaviy ta'lim platformasi."
    features={[
      { icon: '⚡', title: 'Tez va samarali metodika', desc: 'Yapon abakus metodiga asoslangan' },
      { icon: '🏆', title: "O'yin tarzida o'qitish", desc: 'XP, level, reyting va badges tizimi' },
      { icon: '📊', title: "Real natijani ko'rish", desc: 'Har kuni progress va tahlillar' },
    ]}
    primaryCta={{ text: 'Bepul boshlash', icon: Play, onClick: () => navigate('/auth'), className: 'bg-emerald-500 hover:bg-emerald-400 text-white' }}
    secondaryCta={{ text: 'Nima uchun IQROMAX?', icon: ChevronRight, onClick: () => navigate('/about') }}
    image={heroKids}
    sideContent={
      <>
        {/* Level card */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-[#0a2818]/90 backdrop-blur-md border border-emerald-400/30 rounded-2xl p-3 sm:p-4 shadow-2xl w-[150px] sm:w-[180px]">
          <div className="flex items-center gap-2 mb-2">
            <div>
              <p className="text-base sm:text-lg font-black text-white leading-none">Level 7</p>
              <p className="text-[10px] text-emerald-300/70 mt-1">XP 650 / 1200</p>
            </div>
            <Trophy className="h-4 w-4 text-amber-400 ml-auto" />
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-400 rounded-full" style={{ width: '54%' }} />
          </div>
          <p className="text-[10px] text-emerald-300/70 text-right mt-1">54%</p>
        </div>
        {/* Progress card */}
        <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-[#0a2818]/90 backdrop-blur-md border border-emerald-400/30 rounded-2xl p-3 sm:p-4 shadow-2xl w-[200px] sm:w-[230px]">
          <p className="text-xs font-bold text-white mb-2">Progress</p>
          <svg viewBox="0 0 200 70" className="w-full h-14">
            <polyline points="0,55 33,48 66,40 99,30 132,22 165,16 200,8" fill="none" stroke="rgb(52,211,153)" strokeWidth="2.5" strokeLinecap="round" />
            {[[0,55],[33,48],[66,40],[99,30],[132,22],[165,16],[200,8]].map(([x,y],i)=>(
              <circle key={i} cx={x} cy={y} r="2.5" fill="rgb(52,211,153)" />
            ))}
          </svg>
          <div className="flex justify-between text-[8px] text-emerald-300/60 mt-1">
            {['1-hafta','2-hafta','3-hafta','4-hafta'].map((d) => <span key={d}>{d}</span>)}
          </div>
        </div>
      </>
    }
  />
);

/* ─────────────── Slide 2: KIDS (light blue) ─────────────── */
const KidsSlide = ({ navigate }: any) => (
  <SlideShell
    bg="bg-gradient-to-br from-sky-50 via-white to-blue-50 dark:from-sky-950/30 dark:via-card dark:to-blue-950/20"
    badge={{ text: 'BOLALAR UCHUN', icon: Gamepad2, className: 'bg-sky-500 text-white' }}
    titleLeft="O'ynab o'rganing,"
    titleAccent="tez rivojlaning!"
    titleAccentColor="text-sky-500"
    description="Qiziqarli mashqlar, darajalar va o'yinlar bilan matematikani sevib o'rganing va do'stlaringiz orasida eng zo'r bo'ling!"
    features={[
      { icon: '🎮', title: 'Qiziqarli mashqlar', desc: "O'yin ko'rinishidagi mashqlar zeriktirmaydi" },
      { icon: '⭐', title: 'XP va level tizimi', desc: "XP to'plang va yangi levelga o'ting" },
      { icon: '🏆', title: 'Reyting va musobaqalar', desc: "Do'stlaringiz bilan bellashing va g'alaba qozoning" },
      { icon: '🎖️', title: 'Badges va mukofotlar', desc: 'Yutuqlaringiz uchun maxsus nishonlar oling' },
    ]}
    primaryCta={{ text: 'Boshlash', icon: Play, onClick: () => navigate('/courses'), className: 'bg-sky-500 hover:bg-sky-600 text-white' }}
    image={heroKids}
    sideContent={
      <>
        {/* Level card (purple) */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-gradient-to-br from-violet-600 to-violet-700 rounded-2xl p-3 sm:p-4 shadow-2xl w-[160px] sm:w-[200px] text-white">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-base sm:text-lg font-black leading-none">Level 7</p>
              <p className="text-[10px] text-white/70 mt-1">XP 900 / 1200</p>
            </div>
            <Trophy className="h-4 w-4 text-amber-300" />
          </div>
          <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-amber-300 rounded-full" style={{ width: '75%' }} />
          </div>
          <p className="text-[10px] text-amber-200 text-right mt-1 font-bold">Zo'r!</p>
        </div>

        {/* Reyting card */}
        <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-white dark:bg-card rounded-2xl p-3 shadow-xl border border-border/40 w-[160px] sm:w-[200px]">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold">Reyting</p>
            <Trophy className="h-3.5 w-3.5 text-amber-500" />
          </div>
          <ul className="space-y-1">
            {[
              { n: 'Asadbek', s: '15 300' },
              { n: 'Zarina', s: '12 450' },
              { n: 'Jahongir', s: '11 200' },
              { n: 'Sarvar', s: '10 150' },
            ].map((p, i) => (
              <li key={i} className="flex items-center justify-between text-[10px]">
                <span className="flex items-center gap-1">
                  <span className="font-bold text-muted-foreground w-3">{i + 1}</span>
                  <span className="font-semibold">{p.n}</span>
                </span>
                <span className="font-bold">{p.s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Daily goal */}
        <div className="absolute bottom-[110px] right-3 sm:bottom-[120px] sm:right-4 bg-white dark:bg-card rounded-2xl p-3 shadow-xl border border-border/40 w-[160px] sm:w-[200px]">
          <p className="text-xs font-bold mb-2 flex items-center gap-1">Kunlik maqsad <Target className="h-3 w-3 text-emerald-500" /></p>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-1.5">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '60%' }} />
          </div>
          <div className="flex justify-between text-[10px]">
            <span className="text-muted-foreground">Yana 2 ta mashq</span>
            <span className="font-bold">3/5</span>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-gradient-to-br from-violet-600 to-violet-700 rounded-2xl p-3 shadow-xl w-[160px] sm:w-[200px] text-white flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-400 flex items-center justify-center">
            <Star className="h-5 w-5 text-amber-700 fill-amber-600" />
          </div>
          <div>
            <p className="text-[10px] text-white/70">Badges</p>
            <p className="text-lg font-black"><span>12</span> <span className="text-sm font-bold text-white/60">/ 24</span></p>
          </div>
        </div>
      </>
    }
  />
);

/* ─────────────── Slide 3: PARENTS (light orange) ─────────────── */
const ParentsSlide = ({ navigate }: any) => (
  <SlideShell
    bg="bg-gradient-to-br from-orange-50 via-amber-50/50 to-white dark:from-orange-950/30 dark:to-card"
    badge={{ text: 'OTA-ONALAR UCHUN', icon: Eye, className: 'bg-orange-500 text-white' }}
    titleLeft="Farzandingiz rivojini"
    titleAccent="nazorat qiling"
    titleAccentColor="text-orange-500"
    description="IQROMAX orqali farzandingizning o'quv jarayoni, natijalari va progressini real vaqtda kuzatib boring."
    bullets={[
      "Kunlik mashg'ulotlar va natijalarni kuzatish",
      'Real vaqt rejimida progress va statistikalar',
      "Tavsiyalar va rivojlantirish yo'nalishlari",
      'Motivatsiya va yutuqlar tizimi',
      'Xavfsiz va ishonchli muhit',
    ]}
    primaryCta={{ text: "Natijalarni ko'rish", icon: BarChart3, onClick: () => navigate('/ota-onalar'), className: 'bg-orange-500 hover:bg-orange-600 text-white' }}
    image={heroParents}
    sideContent={
      <>
        {/* Profile + stats card */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white dark:bg-card rounded-2xl p-3 sm:p-4 shadow-2xl border border-border/40 w-[210px] sm:w-[260px]">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-[11px] font-black">A</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">Asadbek Abduazizov</p>
              <p className="text-[10px] text-orange-600 font-semibold">Level 7</p>
            </div>
            <Award className="h-4 w-4 text-violet-600" />
          </div>
          <div className="h-1 bg-muted rounded-full mb-3">
            <div className="h-full bg-violet-600 rounded-full" style={{ width: '70%' }} />
          </div>
          <div className="grid grid-cols-4 gap-1 text-center">
            {[
              { v: '12', l: 'Kurslar' },
              { v: '2350', l: 'XP' },
              { v: '75%', l: 'Progress' },
              { v: '15', l: 'Seriya 🔥' },
            ].map((s) => (
              <div key={s.l}>
                <p className="text-xs font-black">{s.v}</p>
                <p className="text-[8px] text-muted-foreground">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly progress chart */}
        <div className="absolute top-[150px] right-3 sm:top-[170px] sm:right-4 bg-white dark:bg-card rounded-2xl p-3 shadow-xl border border-border/40 w-[210px] sm:w-[260px]">
          <p className="text-xs font-bold mb-1">Haftalik progress</p>
          <svg viewBox="0 0 200 60" className="w-full h-14">
            <polyline points="0,50 33,42 66,32 99,25 132,18 165,12 200,5" fill="none" stroke="rgb(249,115,22)" strokeWidth="2.5" strokeLinecap="round" />
            {[[0,50],[33,42],[66,32],[99,25],[132,18],[165,12],[200,5]].map(([x,y],i)=>(
              <circle key={i} cx={x} cy={y} r="2.5" fill="rgb(249,115,22)" />
            ))}
          </svg>
          <div className="flex justify-between text-[9px] text-muted-foreground">
            {['Du','Se','Ch','Pa','Ju','Sh','Ya'].map((d)=><span key={d}>{d}</span>)}
          </div>
        </div>

        {/* So'nggi faoliyat */}
        <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-white dark:bg-card rounded-2xl p-3 shadow-xl border border-border/40 w-[210px] sm:w-[260px]">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold">So'nggi faoliyat</p>
            <span className="text-[9px] text-orange-600 font-bold">Barchasi</span>
          </div>
          <div className="space-y-1.5">
            {[
              { t: "4. Ko'paytirish qoidalari", s: '92%' },
              { t: 'Tez hisoblash – 1-daraja', s: '85%' },
            ].map((a, i) => (
              <div key={i} className="flex items-center justify-between text-[10px]">
                <span className="truncate flex-1 mr-2">{a.t}</span>
                <span className="flex items-center gap-1 font-bold text-emerald-600">{a.s} <CheckCircle2 className="h-3 w-3" /></span>
              </div>
            ))}
          </div>
        </div>
      </>
    }
  />
);

/* ─────────────── Slide 4: TEACHERS (light green) ─────────────── */
const TeachersSlide = ({ navigate }: any) => (
  <SlideShell
    bg="bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-emerald-950/20 dark:to-card"
    badge={{ text: 'TRENERLAR UCHUN', icon: GraduationCap, className: 'bg-violet-500 text-white' }}
    titleLeft="Trener bo'lib"
    titleAccent="daromad toping!"
    titleAccentColor="text-emerald-600"
    description="IQROMAX platformasi orqali o'z bilim va tajribangizni minglab bolalar bilan baham ko'ring va daromad qiling."
    bullets={[
      "1 oyda professional trener bo'lasiz",
      "O'z guruhingizni ochasiz va boshqarasiz",
      'Dars materiallari va mashqlar biz tomondan taqdim etiladi',
      "O'quvchilaringiz natijasini kuzatib borasiz",
      "Barqaror daromad manbaiga ega bo'lasiz",
    ]}
    primaryCta={{ text: "Trener bo'lish", icon: GraduationCap, onClick: () => navigate('/lms'), className: 'bg-emerald-500 hover:bg-emerald-600 text-white' }}
    secondaryCta={{ text: "Qanday ishlashini ko'rish", icon: Play, onClick: () => navigate('/about') }}
    image={heroTeachers}
    imageMaskShape="circle"
    sideContent={
      <>
        {/* Income card */}
        <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-white dark:bg-card rounded-2xl p-3 sm:p-4 shadow-2xl border border-border/40 w-[210px] sm:w-[270px]">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] text-muted-foreground">Oylik daromad</p>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded-full">+18%</span>
          </div>
          <p className="text-base sm:text-lg font-black mb-2">12 450 000 <span className="text-xs font-bold">so'm</span></p>
          <svg viewBox="0 0 200 50" className="w-full h-12">
            <polyline points="0,40 50,32 100,22 150,14 200,5" fill="none" stroke="rgb(16,185,129)" strokeWidth="2.5" strokeLinecap="round" />
            {[[0,40],[50,32],[100,22],[150,14],[200,5]].map(([x,y],i)=>(
              <circle key={i} cx={x} cy={y} r="2.5" fill="rgb(16,185,129)" />
            ))}
          </svg>
          <div className="flex justify-between text-[9px] text-muted-foreground">
            {['1-h','2-h','3-h','4-h'].map((d)=><span key={d}>{d}</span>)}
          </div>
        </div>

        {/* Students */}
        <div className="absolute top-[170px] right-3 sm:top-[200px] sm:right-4 bg-white dark:bg-card rounded-2xl p-3 shadow-xl border border-border/40 w-[210px] sm:w-[270px] flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-violet-100 dark:bg-violet-950/40 flex items-center justify-center">
            <Users className="h-5 w-5 text-violet-600" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] text-muted-foreground">O'quvchilar</p>
            <p className="text-lg font-black">56</p>
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">Batafsil ›</span>
        </div>

        {/* Quote */}
        <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-white dark:bg-card rounded-2xl p-3 sm:p-4 shadow-2xl border border-border/40 w-[230px] sm:w-[300px]">
          <Quote className="h-4 w-4 text-emerald-500 mb-1" />
          <p className="text-[11px] sm:text-xs leading-snug mb-2">IQROMAX bilan trenerlikni boshladim va 3 oy ichida o'zim orzu qilgan daromadga erishdim!</p>
          <div className="flex items-center gap-2 pt-2 border-t border-border/40">
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-[10px] font-black">N</div>
            <div>
              <p className="text-[10px] font-bold">Nilufar Saidova</p>
              <p className="text-[9px] text-muted-foreground">Trener, Toshkent shahri</p>
            </div>
          </div>
        </div>
      </>
    }
  />
);
