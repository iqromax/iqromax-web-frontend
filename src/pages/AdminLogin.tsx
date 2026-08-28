import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/axios';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await api.post('token/', {
        username: formData.username,
        password: formData.password
      });

      if (response.data && response.data.access) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        toast.success("Xush kelibsiz, Admin!");
        navigate('/admin');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error("Username yoki parol noto'g'ri");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-end p-6 md:pr-24 lg:pr-32 xl:pr-48 bg-[#050510]"
      style={{
        backgroundImage: "url('/admin-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[460px] z-10"
      >
        <div className="rounded-[28px] overflow-hidden bg-[#0A0B1A]/80 backdrop-blur-xl border border-indigo-500/20 shadow-2xl shadow-purple-900/20 p-10">
          
          <div className="flex justify-center mb-6">
            <img src="/admin-logo.png" alt="Admin Logo" className="w-24 h-24 object-contain" />
          </div>

          <div className="text-center mb-10">
            <h1 className="text-2xl font-bold text-white mb-2 tracking-wide">Xush kelibsiz!</h1>
            <p className="text-sm text-indigo-200/60 font-light">
              Hisobingizga kirish uchun ma'lumotlaringizni kiriting
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label 
                htmlFor="username" 
                className="text-xs font-medium text-indigo-100/80 ml-1"
              >
                Username
              </Label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-indigo-300/50 transition-colors group-focus-within:text-purple-400" />
                <Input
                  id="username"
                  placeholder="Username kiriting"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="h-12 pl-12 rounded-xl border-indigo-500/20 bg-[#060714]/80 text-white placeholder:text-indigo-300/30 focus:bg-[#0A0C1D] focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label 
                htmlFor="password" 
                className="text-xs font-medium text-indigo-100/80 ml-1"
              >
                Password
              </Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-indigo-300/50 transition-colors group-focus-within:text-purple-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Parol kiriting"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="h-12 pl-12 pr-12 rounded-xl border-indigo-500/20 bg-[#060714]/80 text-white placeholder:text-indigo-300/30 focus:bg-[#0A0C1D] focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-300/50 hover:text-indigo-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="w-4 h-4 rounded border border-indigo-500/30 flex items-center justify-center bg-[#060714]/80 group-hover:border-purple-500/50 transition-colors">
                  <input type="checkbox" className="opacity-0 absolute" />
                  {/* Custom checkmark using CSS or an icon could be added here later */}
                </div>
                <span className="text-xs text-indigo-200/60 group-hover:text-indigo-200/80 transition-colors">Meni eslab qol</span>
              </label>
              
              <a href="#" className="text-xs text-blue-500/80 hover:text-blue-400 transition-colors">
                Parolni unutdingizmi?
              </a>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold text-sm tracking-wide transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] active:scale-[0.98] mt-4 hover:from-purple-500 hover:to-blue-400 border-0"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="opacity-90">KIRITILMOQDA...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                  <span>KIRISH</span>
                </div>
              )}
            </Button>
          </form>

        </div>
      </motion.div>
      
      {/* Footer text */}
      <div className="absolute bottom-6 left-0 right-0 text-center flex items-center justify-center gap-2">
         <ShieldCheck className="w-4 h-4 text-purple-600" />
         <p className="text-[#6D6D8A] text-xs font-medium">
           &copy; 2026 IQROMAX. Barcha huquqlar himoyalangan.
         </p>
      </div>
    </div>
  );
};

export default AdminLogin;
