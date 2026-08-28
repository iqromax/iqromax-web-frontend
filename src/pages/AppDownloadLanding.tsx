import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Download, Gift, CheckCircle2, ShieldCheck, Zap, Trophy, ArrowRight } from 'lucide-react';
import iqromaxLogo from '../assets/iqromax-logo-full.png';

const AppDownloadLanding = () => {
  const [searchParams] = useSearchParams();
  const rawPromoParam = searchParams.get('promo') || searchParams.get('ref');
  const [isCopied, setIsCopied] = useState(false);
  const [downloadLink, setDownloadLink] = useState('https://iqromax.net');
  const [isValidatingPromo, setIsValidatingPromo] = useState(!!rawPromoParam);
  const [validPromoCode, setValidPromoCode] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLinkAndValidate() {
      try {
        const res = await fetch('/api/download-link');
        if (res.ok) {
          const data = await res.json();
          if (data.link) setDownloadLink(data.link);
        }
      } catch (e) {}

      if (rawPromoParam) {
        try {
          const cleanPromo = rawPromoParam.replace(/^#+/, '').trim();
          const res = await fetch(`/api/promo/validate/${encodeURIComponent(cleanPromo)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.valid && data.promo) {
              setValidPromoCode(data.promo);
            } else {
              setValidPromoCode(null);
            }
          } else {
            setValidPromoCode(null);
          }
        } catch (e) {
          setValidPromoCode(null);
        } finally {
          setIsValidatingPromo(false);
        }
      } else {
        setIsValidatingPromo(false);
      }
    }
    fetchLinkAndValidate();
  }, [rawPromoParam]);

  const handleCopyPromo = () => {
    if (!validPromoCode) return;
    navigator.clipboard.writeText(validPromoCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleDownloadApp = () => {
    // Redirect to direct APK or store link configured by admin
    window.location.href = downloadLink;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col items-center justify-between font-sans selection:bg-emerald-500 selection:text-white relative overflow-hidden">
      {/* Soft Light Background Glow Elements */}
      <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-emerald-300/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[400px] h-[400px] bg-sky-300/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[450px] h-[450px] bg-amber-200/40 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Bar */}
      <header className="w-full max-w-5xl px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <img src={iqromaxLogo} alt="IQROMAX Logo" className="h-10 sm:h-12 w-auto object-contain" />
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm px-4 py-2 rounded-2xl text-xs font-semibold text-slate-600">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Rasmiy Mobil Ilova</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-4xl px-4 py-6 flex flex-col items-center text-center z-10 space-y-8">
        
        {/* Special Invitation Badge (Only if invited via valid promo link) */}
        {!isValidatingPromo && validPromoCode && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 shadow-sm">
            <Gift className="w-4 h-4 text-emerald-600" />
            <span className="text-xs sm:text-sm font-bold text-emerald-700">
              Maxsus Taklifnoma Qabul Qilindi! 🎁
            </span>
          </div>
        )}

        {/* Hero Title */}
        <div className="space-y-4 max-w-2xl">
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 leading-tight tracking-tight">
            IQROMAX Ilovasini Yuklab Oling va <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent">3 Kunlik BEPUL Premium</span> ga Ega Bo'ling!
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
            Mental arifmetika, tezkor hisoblash hamda mantiqiy mashqlar bilan bilamingizni oshiring! Sirli sandiqlarni oching va cheksiz chaqmoq energiyaga ega bo'ling.
          </p>
        </div>

        {/* Promo Code Card (Rendered ONLY when promo URL parameter is valid and user exists in DB) */}
        {!isValidatingPromo && validPromoCode && (
          <div className="w-full max-w-md bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/60 relative group">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-[11px] px-4 py-1.5 rounded-full shadow-md uppercase tracking-wider">
              Sizning Bonus Promokodingiz
            </div>

            <div className="mt-2 space-y-3">
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-2xl sm:text-3xl font-mono font-black text-emerald-600 tracking-wider">
                  {validPromoCode}
                </span>
                <button
                  onClick={handleCopyPromo}
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md cursor-pointer active:scale-95"
                >
                  {isCopied ? <CheckCircle2 className="w-4 h-4 text-white" /> : null}
                  <span>{isCopied ? 'Nusxalandi!' : 'Nusxalash'}</span>
                </button>
              </div>
              
              <p className="text-[11px] text-slate-500 text-center font-medium">
                * Ilovani yuklab olib ro'yxatdan o'tayotganda ushbu promokod avtomatik yoziladi va bonuslarga ega bo'lasiz!
              </p>
            </div>
          </div>
        )}

        {/* Download Buttons Section */}
        <div className="w-full max-w-md space-y-4 pt-2">
          <button
            onClick={handleDownloadApp}
            className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-lg rounded-2xl shadow-xl shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-3 border border-emerald-400/30"
          >
            <Download className="w-6 h-6 animate-bounce" />
            <span>Mobil Ilovani Yuklab Olish</span>
            <ArrowRight className="w-5 h-5 opacity-80" />
          </button>

          {/* Features Badges Grid */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="bg-white border border-slate-200/80 p-3 rounded-2xl flex flex-col items-center text-center shadow-sm">
              <Zap className="w-5 h-5 text-amber-500 mb-1" />
              <span className="text-[11px] font-bold text-slate-700">Cheksiz Energiya</span>
            </div>

            <div className="bg-white border border-slate-200/80 p-3 rounded-2xl flex flex-col items-center text-center shadow-sm">
              <Gift className="w-5 h-5 text-emerald-500 mb-1" />
              <span className="text-[11px] font-bold text-slate-700">Sirli Sandiq</span>
            </div>

            <div className="bg-white border border-slate-200/80 p-3 rounded-2xl flex flex-col items-center text-center shadow-sm">
              <Trophy className="w-5 h-5 text-sky-500 mb-1" />
              <span className="text-[11px] font-bold text-slate-700">Onlayn Battle</span>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full py-5 text-center text-xs text-slate-500 border-t border-slate-200 bg-white/60 z-10">
        <p>© 2026 IQROMAX. Barcha huquqlar himoyalangan.</p>
      </footer>
    </div>
  );
};

export default AppDownloadLanding;
