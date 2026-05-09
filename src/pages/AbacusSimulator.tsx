import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, Calculator, Settings2, Volume2, VolumeX, Smartphone, Monitor, Maximize2, Minus, Plus, Columns3, Sparkles, Star, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  RealisticAbacus, 
  AbacusModeSelector,
  FullscreenAbacus,
  type AbacusMode,
  type AbacusOrientation,
} from '@/components/abacus';
import { useSound } from '@/hooks/useSound';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

export type BeadSoundType = 'pop' | 'bead' | 'beadHigh' | 'tick' | 'correct' | 'incorrect' | 'start' | 'countdown' | 'combo' | 'levelUp' | 'complete' | 'winner' | 'whoosh' | 'sparkle' | 'bounce';

interface ColumnOption {
  value: number;
  label: string;
  description: string;
  level: string;
  iconBg: string;
  iconFg: string;
  cardGradient: string;
  cardBorder: string;
  cardHoverBorder: string;
  numberColor: string;
  recommended?: boolean;
  maxNumber: string;
}

const COLUMN_OPTIONS: ColumnOption[] = [
  {
    value: 3,
    label: '3',
    description: 'Yuzlikgacha',
    level: 'Boshlovchi',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
    iconFg: 'text-emerald-600',
    cardGradient: 'from-emerald-50/80 to-green-50/30 dark:from-emerald-950/30 dark:to-green-950/20',
    cardBorder: 'border-emerald-200/60 dark:border-emerald-800/40',
    cardHoverBorder: 'hover:border-emerald-400 dark:hover:border-emerald-600',
    numberColor: 'text-emerald-600',
    maxNumber: 'Maks: 999',
  },
  {
    value: 5,
    label: '5',
    description: "O'n minglikgacha",
    level: "O'rta daraja",
    iconBg: 'bg-orange-100 dark:bg-orange-900/40',
    iconFg: 'text-orange-600',
    cardGradient: 'from-orange-50/80 to-amber-50/30 dark:from-orange-950/30 dark:to-amber-950/20',
    cardBorder: 'border-orange-200/60 dark:border-orange-800/40',
    cardHoverBorder: 'hover:border-orange-400 dark:hover:border-orange-600',
    numberColor: 'text-orange-600',
    recommended: true,
    maxNumber: 'Maks: 99 999',
  },
  {
    value: 7,
    label: '7',
    description: 'Milliongacha',
    level: 'Murakkab',
    iconBg: 'bg-purple-100 dark:bg-purple-900/40',
    iconFg: 'text-purple-600',
    cardGradient: 'from-purple-50/80 to-fuchsia-50/30 dark:from-purple-950/30 dark:to-fuchsia-950/20',
    cardBorder: 'border-purple-200/60 dark:border-purple-800/40',
    cardHoverBorder: 'hover:border-purple-400 dark:hover:border-purple-600',
    numberColor: 'text-purple-600',
    maxNumber: 'Maks: 9 999 999',
  },
  {
    value: 10,
    label: '10',
    description: 'Milliardgacha',
    level: 'Pro',
    iconBg: 'bg-rose-100 dark:bg-rose-900/40',
    iconFg: 'text-rose-600',
    cardGradient: 'from-rose-50/80 to-pink-50/30 dark:from-rose-950/30 dark:to-pink-950/20',
    cardBorder: 'border-rose-200/60 dark:border-rose-800/40',
    cardHoverBorder: 'hover:border-rose-400 dark:hover:border-rose-600',
    numberColor: 'text-rose-600',
    maxNumber: 'Maks: 9 999 999 999',
  },
];

/**
 * Mini abakus preview — vertical sticks with one bead above and beads below the bar.
 */
const AbacusPreview = ({ columns, color }: { columns: number; color: string }) => {
  return (
    <div className="flex items-end justify-center gap-1 h-16 px-2">
      {Array.from({ length: columns }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-0.5 h-full justify-end">
          {/* Top bead (one) */}
          <div className={cn('w-2 h-2 rounded-full', color)} />
          {/* Vertical line / bar */}
          <div className="w-px h-1 bg-current opacity-30" />
          {/* Bottom 4 beads */}
          {[...Array(4)].map((_, j) => (
            <div key={j} className={cn('w-2 h-2 rounded-full', color, j === 3 ? 'opacity-100' : 'opacity-90')} />
          ))}
        </div>
      ))}
    </div>
  );
};

const ColumnSelector = ({ onSelect }: { onSelect: (cols: number) => void }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50/40 via-background to-amber-50/30 dark:from-emerald-950/20 dark:via-background dark:to-amber-950/20">
      {/* Decorative background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-24 w-96 h-96 rounded-full bg-emerald-300/20 dark:bg-emerald-500/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-amber-200/20 dark:bg-amber-400/5 blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/40">
        <div className="container mx-auto px-3 sm:px-6 py-3 flex items-center gap-3">
          <Link
            to="/"
            className="h-10 w-10 rounded-xl flex items-center justify-center hover:bg-secondary transition-colors group"
            aria-label="Orqaga"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-base sm:text-lg font-display font-black flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-sm">
                <Calculator className="w-4 h-4 text-white" />
              </div>
              <span>Abakus simulator</span>
            </h1>
          </div>
        </div>
      </header>

      {/* Main */}
      <div className="flex-1 flex items-start justify-center px-3 sm:px-6 py-6 sm:py-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-5xl space-y-8"
        >
          {/* HERO */}
          <section className="rounded-3xl bg-gradient-to-br from-emerald-50/80 via-amber-50/40 to-white dark:from-emerald-950/30 dark:via-amber-950/20 dark:to-card border border-emerald-200/60 dark:border-emerald-800/40 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 px-5 sm:px-7 py-6 sm:py-7">
              <div className="min-w-0">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500 text-white shadow-sm mb-3">
                  <Columns3 className="h-3 w-3" />
                  ABAKUS SOZLAMALARI
                </span>
                <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl leading-tight">
                  Nechta <span className="text-emerald-600">ustunli abakus</span>?
                </h2>
                <p className="text-sm text-muted-foreground mt-2 max-w-xl">
                  Mashqlaringiz uchun mos ustunlar sonini tanlang. Boshlovchilar uchun 3 yoki 5 ustunli, malakaliroqlar uchun esa 7 yoki 10 ustunli abakus tavsiya qilinadi.
                </p>
              </div>

              {/* Quick info */}
              <div className="hidden lg:flex flex-col gap-2 text-xs">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-semibold">
                  <Sparkles className="h-3 w-3" /> Tavsiya: 5 ustun
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 font-semibold">
                  <Star className="h-3 w-3" /> Keyin o'zgartirish mumkin
                </div>
              </div>
            </div>
          </section>

          {/* OPTIONS GRID */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {COLUMN_OPTIONS.map((option, index) => (
              <motion.button
                key={option.value}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.06 }}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(option.value)}
                className={cn(
                  'relative group text-left rounded-2xl bg-gradient-to-br border-2 p-5 transition-all duration-300',
                  'shadow-sm hover:shadow-xl',
                  option.cardGradient,
                  option.cardBorder,
                  option.cardHoverBorder,
                  'focus:outline-none focus:ring-2 focus:ring-emerald-500/40'
                )}
              >
                {/* Tavsiya badge */}
                {option.recommended && (
                  <span className="absolute -top-2 right-4 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black text-white bg-amber-500 shadow-md">
                    <Sparkles className="h-2.5 w-2.5" /> TAVSIYA
                  </span>
                )}

                {/* Header — icon + level */}
                <div className="flex items-center justify-between mb-3">
                  <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center shadow-sm', option.iconBg)}>
                    <Columns3 className={cn('h-5 w-5', option.iconFg)} />
                  </div>
                  <span className={cn('text-[10px] font-bold uppercase tracking-wider', option.iconFg)}>
                    {option.level}
                  </span>
                </div>

                {/* Big number */}
                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className={cn('text-5xl font-display font-black leading-none', option.numberColor)}>
                    {option.label}
                  </span>
                  <span className="text-xs text-muted-foreground font-semibold">ustun</span>
                </div>

                {/* Description */}
                <div className="text-sm font-bold text-foreground mb-1">{option.description}</div>
                <div className="text-[11px] text-muted-foreground mb-4">{option.maxNumber}</div>

                {/* Abakus preview */}
                <div className="rounded-xl bg-card/60 border border-border/40 mb-4">
                  <AbacusPreview columns={option.value} color={option.numberColor} />
                </div>

                {/* CTA */}
                <div className={cn('flex items-center justify-between pt-3 border-t border-border/40 text-xs font-bold transition-transform group-hover:translate-x-0.5', option.iconFg)}>
                  <span>Tanlash</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </motion.button>
            ))}
          </section>

          {/* INFO HINT */}
          <section className="rounded-2xl bg-card border border-border/40 shadow-sm p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-4 w-4 text-amber-600" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold mb-1">Maslahat</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Endigina boshlayotgan bo'lsangiz <span className="font-bold text-emerald-600">3 ustunli</span> abakusdan boshlang. Asosiy mashqlar uchun <span className="font-bold text-orange-600">5 ustunli</span> eng mos. Tezroq hisoblashga o'tganingizda <span className="font-bold text-purple-600">7 yoki 10 ustunli</span> abakusni tanlang. Keyin sozlamalardan istalgan vaqtda o'zgartira olasiz.
                </p>
              </div>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

const AbacusSimulator = () => {
  const isMobile = useIsMobile();
  const [columns, setColumns] = useState<number | null>(null);
  const [value, setValue] = useState(0);
  const [mode, setMode] = useState<AbacusMode>('beginner');
  const [orientation, setOrientation] = useState<AbacusOrientation>('horizontal');
  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const colorScheme = 'classic' as const;
  const { soundEnabled, toggleSound, playSound } = useSound();

  const handleBeadSound = useCallback(() => {
    if (soundEnabled) {
      playSound('tick');
    }
  }, [soundEnabled, playSound]);

  const handleReset = useCallback(() => {
    setValue(0);
  }, []);

  const adjustColumns = useCallback((delta: number) => {
    setColumns(prev => {
      const current = prev ?? 10;
      const newColumns = Math.max(3, Math.min(17, current + delta));
      const maxValue = Math.pow(10, newColumns) - 1;
      setValue(v => Math.min(v, maxValue));
      // Auto-switch orientation on mobile
      if (isMobile) {
        setOrientation(newColumns > 5 ? 'vertical' : 'horizontal');
      }
      return newColumns;
    });
  }, [isMobile]);

  const columnLabels = [
    'Birlik', "O'nlik", 'Yuzlik', 'Minglik', "O'n minglik", "Yuz minglik",
    'Million', "O'n mln", "Yuz mln", 'Milliard', "O'n mlrd", "Yuz mlrd",
    'Trillion', "O'n trln", "Yuz trln", "Ming trln", "O'n ming trln"
  ];

  const handleColumnSelect = useCallback((cols: number) => {
    setColumns(cols);
    // Mobile: auto-switch to vertical for 5+ columns
    if (isMobile && cols > 5) {
      setOrientation('vertical');
    } else {
      setOrientation('horizontal');
    }
  }, [isMobile]);

  if (columns === null) {
    return <ColumnSelector onSelect={handleColumnSelect} />;
  }

  return (
    <>
      <FullscreenAbacus
        isOpen={isFullscreen}
        onClose={() => setIsFullscreen(false)}
        initialColumns={columns}
        initialValue={value}
        initialMode={mode}
        colorScheme={colorScheme}
        onBeadSound={handleBeadSound}
      />

      <div className="min-h-screen bg-background relative">
        {/* Subtle ambient background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-primary/3 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[350px] bg-accent/3 rounded-full blur-[120px]" />
        </div>

        {/* Glass header */}
        <header className="sticky top-0 z-40 bg-background/60 backdrop-blur-xl border-b border-border/20">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => { setColumns(null); setValue(0); }}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-muted/80 group-hover:bg-muted flex items-center justify-center transition-colors">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              </div>
            </button>
            
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-sm">
                <Calculator className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-base font-bold text-foreground leading-tight">
                  <span className="hidden sm:inline">Abakus Simulator</span>
                  <span className="sm:hidden">Abakus</span>
                </h1>
                <p className="text-[10px] text-muted-foreground leading-tight hidden sm:block">
                  {columns} ustunli · {mode === 'beginner' ? "Boshlang'ich" : mode === 'mental' ? 'Mental' : 'Test'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" size="sm" 
                onClick={toggleSound} 
                className="w-9 h-9 p-0 rounded-xl hover:bg-muted/80"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-muted-foreground" />}
              </Button>
              <Button 
                variant="ghost" size="sm" 
                onClick={() => setShowSettings(!showSettings)}
                className={cn(
                  "w-9 h-9 p-0 rounded-xl transition-colors",
                  showSettings ? "bg-primary/10 text-primary" : "hover:bg-muted/80"
                )}
              >
                <Settings2 className="w-4 h-4" />
              </Button>
              <div className="w-px h-5 bg-border/50 mx-0.5 hidden sm:block" />
              <Button 
                variant="ghost" size="sm" 
                onClick={handleReset} 
                className="gap-1.5 rounded-xl hover:bg-muted/80 h-9 px-3"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-xs">Reset</span>
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-5 pb-24 space-y-5 relative z-10">

          {/* Settings panel */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, height: 0, scale: 0.98 }}
                animate={{ opacity: 1, height: 'auto', scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
              >
                <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border/30 p-5 shadow-sm space-y-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Settings2 className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground">Sozlamalar</h3>
                  </div>

                  {/* Columns adjuster */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Ustunlar soni</span>
                    <div className="flex items-center gap-1.5">
                      <button 
                        onClick={() => adjustColumns(-1)} 
                        disabled={columns <= 3}
                        className="w-8 h-8 rounded-lg bg-muted/80 hover:bg-muted flex items-center justify-center text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-10 text-center font-bold text-lg tabular-nums text-foreground">{columns}</span>
                      <button 
                        onClick={() => adjustColumns(1)} 
                        disabled={columns >= 17}
                        className="w-8 h-8 rounded-lg bg-muted/80 hover:bg-muted flex items-center justify-center text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Orientation toggle */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Yo'nalish</span>
                    <div className="flex items-center gap-1 bg-muted/60 rounded-xl p-1">
                      <button
                        onClick={() => setOrientation('horizontal')}
                        className={cn(
                          "flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium transition-all",
                          orientation === 'horizontal' 
                            ? "bg-background text-foreground shadow-sm" 
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Monitor className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Gorizontal</span>
                      </button>
                      <button
                        onClick={() => setOrientation('vertical')}
                        className={cn(
                          "flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium transition-all",
                          orientation === 'vertical' 
                            ? "bg-background text-foreground shadow-sm" 
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Vertikal</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Column labels */}
                  <div className="pt-2 border-t border-border/20">
                    <div className="flex flex-wrap justify-center gap-1.5">
                      {Array.from({ length: columns }).reverse().map((_, i) => {
                        const colIndex = columns - 1 - i;
                        return (
                          <span 
                            key={colIndex}
                            className={cn(
                              "text-[10px] px-2 py-0.5 rounded-full font-medium transition-colors",
                              colIndex === 0 
                                ? "bg-primary/15 text-primary border border-primary/20" 
                                : "bg-muted/60 text-muted-foreground"
                            )}
                          >
                            {columnLabels[colIndex]}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Abacus area */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            {/* Fullscreen button */}
            <div className="flex justify-center mb-3">
              <button
                onClick={() => setIsFullscreen(true)}
                className="flex items-center gap-2 h-8 px-4 rounded-full bg-card/80 backdrop-blur-sm border border-border/30 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all shadow-sm"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Fullscreen</span>
              </button>
            </div>
            
            {/* Abacus container */}
            <div className={cn(
              "flex justify-center items-center py-6 w-full max-w-[100vw]",
              orientation === 'vertical' && "min-h-[400px]"
            )}>
              <RealisticAbacus
                columns={columns}
                value={value}
                onChange={setValue}
                mode={mode}
                showValue={mode !== 'mental'}
                orientation={orientation}
                colorScheme={colorScheme}
                onBeadSound={handleBeadSound}
              />
            </div>
          </motion.div>
        </main>
      </div>
    </>
  );
};

export default AbacusSimulator;
