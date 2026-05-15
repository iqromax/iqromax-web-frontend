import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Volume2, VolumeX, User, LogOut, Play, Home, Settings, Moon, Sun, ShieldCheck, GraduationCap, Sparkles, ChevronDown, Trophy, Menu, X, BookOpen, Calendar, MessageCircle, BarChart3, Calculator, Users, FileText, Video, ClipboardList, Star } from 'lucide-react';
import { Logo } from './Logo';
import { Button } from './ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { useTheme } from 'next-themes';
import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { XPLevelBar } from './XPLevelBar';

interface NavbarProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Navbar = ({ soundEnabled, onToggleSound }: NavbarProps) => {
  const { user, signOut } = useAuth();
  const { role, isAdmin, isParent, isTeacher, isStudent } = useUserRole();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<{ username: string; avatar_url: string | null; total_score: number } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navScrollRef = useRef<HTMLDivElement>(null);
  
  const isTrainPage = location.pathname === '/train';
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    let scrollTimeout: ReturnType<typeof setTimeout> | null = null;
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      scrollTimeout = setTimeout(() => {
        const activeButton = navScrollRef.current?.querySelector('[data-active="true"]');
        if (activeButton) {
          activeButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setProfile(null);
        return;
      }
      const { data } = await supabase
        .from('profiles')
        .select('username, avatar_url, total_score')
        .eq('user_id', user.id)
        .maybeSingle();
      if (data) {
        setProfile(data);
      }
    };
    fetchProfile();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const handleNavigation = useCallback((path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  }, [navigate]);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', icon: Home, label: "Uy", emoji: "🏠" },
    { path: '/subjects', icon: BookOpen, label: "Fanlar", emoji: "📚" },
    { path: '/abacus-simulator', icon: Calculator, label: "Abakus", emoji: "🧮" },
    { path: '/train', icon: ClipboardList, label: "Masalalar", emoji: "📝" },
    { path: '/tournaments', icon: Trophy, label: "Musobaqa", emoji: "🏆" },
    { path: '/live', icon: Video, label: "Live", emoji: "📹" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full safe-top">
        <div className="absolute inset-0 bg-background/85 backdrop-blur-xl" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />
        
        <div className="container relative flex h-11 sm:h-12 items-center justify-between px-2 xs:px-3 sm:px-4 lg:px-6">
          <Link to="/" className="flex-shrink-0 hover:opacity-80 active:scale-95 transition-all">
            <Logo size="xs" />
          </Link>
          
          <nav className="hidden lg:flex items-center gap-1 bg-secondary/60 backdrop-blur-sm rounded-full px-1.5 py-1 border border-border/30">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                  ${isActive(item.path) 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }
                `}
              >
                <item.icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden h-9 w-9 rounded-full hover:bg-secondary active:scale-95 transition-all"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] animate-fade-in"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div 
        className={`fixed top-0 right-0 h-full w-[80%] max-w-[280px] z-[70] bg-card/98 backdrop-blur-xl shadow-2xl transform transition-transform duration-250 ease-out flex flex-col ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-3 border-b border-border/40">
          <Logo size="sm" />
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setMobileMenuOpen(false)}
            className="h-8 w-8 rounded-full hover:bg-secondary active:scale-95"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {user && profile && (
          <div className="p-3 border-b border-border/40 space-y-2">
            <button
              onClick={() => handleNavigation('/settings')}
              className="w-full flex items-center gap-2.5 p-2.5 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 active:scale-[0.98] transition-all"
            >
              <Avatar className="h-10 w-10 border-2 border-primary/40 shadow-sm">
                <AvatarImage src={profile.avatar_url || undefined} />
                <AvatarFallback className="bg-primary text-primary-foreground font-bold text-sm">
                  {profile.username?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left min-w-0">
                <p className="font-semibold text-sm truncate">{profile.username}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Trophy className="h-3 w-3 text-warning" />
                    {profile.total_score}
                  </span>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground -rotate-90 flex-shrink-0" />
            </button>
            
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              className="w-full h-9 rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10 active:scale-[0.98] text-sm"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Chiqish
            </Button>
          </div>
        )}

        <div ref={navScrollRef} className="flex-1 overflow-y-auto p-3">
          <div className="grid grid-cols-2 gap-2 mb-3">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all duration-200 active:scale-95 ${
                  isActive(item.path)
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-secondary/60 hover:bg-secondary border border-border/30'
                }`}
              >
                <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${
                  isActive(item.path) ? 'bg-white/20' : 'bg-background/60'
                }`}>
                  <span className="text-lg">{item.emoji}</span>
                </div>
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="h-px bg-border/40 my-3" />

          <div className="space-y-1.5">
            <button
              onClick={() => onToggleSound()}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-secondary/60 active:scale-[0.98] transition-all"
            >
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                soundEnabled ? 'bg-primary/15 text-primary' : 'bg-secondary text-muted-foreground'
              }`}>
                {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </div>
              <span className="text-sm font-medium flex-1 text-left">Ovoz</span>
            </button>

            <button
              onClick={() => handleNavigation('/settings')}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-secondary/60 active:scale-[0.98] transition-all"
            >
              <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center">
                <Settings className="h-4 w-4 text-muted-foreground" />
              </div>
              <span className="text-sm font-medium">Sozlamalar</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
