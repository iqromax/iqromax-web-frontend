import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Trophy, 
  Settings, 
  Bell, 
  Search, 
  Menu,
  ChevronLeft,
  LogOut,
  TrendingUp,
  Target,
  Zap,
  Star,
  ChevronRight,
  Plus,
  Filter,
  BarChart3,
  MessageSquare,
  Globe,
  Shield,
  Upload,
  ImageIcon,
  Sparkles,
  Hash
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [hoveredSubItem, setHoveredSubItem] = useState<string | null>(null);
  const [isAddAdModalOpen, setIsAddAdModalOpen] = useState(false);
  const [isEditAdModalOpen, setIsEditAdModalOpen] = useState(false);
  const [isAddFeatureModalOpen, setIsAddFeatureModalOpen] = useState(false);
  const [isEditFeatureModalOpen, setIsEditFeatureModalOpen] = useState(false);
  const [isAddFeatureDetailModalOpen, setIsAddFeatureDetailModalOpen] = useState(false);
  const [isEditFeatureDetailModalOpen, setIsEditFeatureDetailModalOpen] = useState(false);
  const [isAddNewsModalOpen, setIsAddNewsModalOpen] = useState(false);
  const [isEditNewsModalOpen, setIsEditNewsModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<any>(null);
  const [editingFeature, setEditingFeature] = useState<any>(null);
  const [editingFeatureDetail, setEditingFeatureDetail] = useState<any>(null);
  const [editingNews, setEditingNews] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [authorImagePreview, setAuthorImagePreview] = useState<string | null>(null);
  const [featureName, setFeatureName] = useState("");
  const [detailSteps, setDetailSteps] = useState([{ name: "", desc: "" }, { name: "", desc: "" }, { name: "", desc: "" }]);

  const stats = [
    { label: "Jami O'quvchilar", value: "1,284", growth: "+12%", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Faol Kurslar", value: "24", growth: "+4", icon: BookOpen, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Haftalik Daromad", value: "$4,250", growth: "+18%", icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Yangi Xabarlar", value: "12", growth: "Bugun", icon: MessageSquare, color: "text-rose-500", bg: "bg-rose-500/10" },
  ];

  const recentUsers = [
    { name: "Asilbek Olimov", email: "asilbek@mail.uz", date: "2 daqiqa oldin", status: "Faol", avatar: "AO" },
    { name: "Zuhra Karimova", email: "zuhra@mail.uz", date: "15 daqiqa oldin", status: "Yangi", avatar: "ZK" },
    { name: "Jasur Rahimov", email: "jasur@mail.uz", date: "1 soat oldin", status: "Offline", avatar: "JR" },
    { name: "Malika Saida", email: "malika@mail.uz", date: "3 soat oldin", status: "Faol", avatar: "MS" },
  ];

  const ads = [
    { id: 1, title: "Mental Arifmetika Kursi", desc: "Bolalar uchun eng yaxshi metodika", date: "12.05.2024", image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=200" },
    { id: 2, title: "Yozgi Lager 2024", desc: "Unutilmas yozgi sarguzashtlar", date: "10.05.2024", image: "https://images.unsplash.com/photo-1473679408190-0693dd22fe6a?q=80&w=200" },
    { id: 3, title: "Matematika Olimpiadasi", desc: "Bilimingizni sinab ko'ring", date: "05.05.2024", image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=200" },
  ];

  const features = [
    { id: 1, name: "Tezkor O'rganish", desc: "Metodikamiz orqali 2 barobar tezroq hisoblash", icon: Zap, date: "14.05.2024" },
    { id: 2, name: "Individual Yondashuv", desc: "Har bir bolaga alohida dastur", icon: Users, date: "13.05.2024" },
    { id: 3, name: "Xalqaro Sertifikat", desc: "Bitiruvchilarga nufuzli diplomlar", icon: Trophy, date: "11.05.2024" },
  ];

  const newsItems = [
    { id: 1, title: "Mental Arifmetika bo'yicha Respublika Olimpiadasi", category: "Musobaqa", author: "Admin", authorImage: "https://i.pravatar.cc/100?u=admin", date: "14.05.2024", image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=200", hashtags: "#olimpiada #matematika" },
    { id: 2, title: "Yozgi lagerga qabul boshlandi", category: "Yangilik", author: "Gulnoza", authorImage: "https://i.pravatar.cc/100?u=2", date: "12.05.2024", image: "https://images.unsplash.com/photo-1473679408190-0693dd22fe6a?q=80&w=200", hashtags: "#lager #yoz" },
  ];

  const featureDetails = [
    { id: 1, name: "Mashqlar tizimi", feature: "Tezkor O'rganish", date: "14.05.2024", image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=200" },
    { id: 2, name: "Mentor yordami", feature: "Individual Yondashuv", date: "13.05.2024", image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=200" },
  ];

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { 
      id: 'home', 
      label: 'Bosh sahifa', 
      icon: Globe, 
      path: '/',
      subItems: [
        { id: 'ads', label: 'Reklama', icon: Star },
        { 
          id: 'features-group', 
          label: 'Xususiyatlar', 
          icon: Zap,
          subItems: [
            { id: 'features', label: 'Asosiy', icon: Zap },
            { id: 'feature-details', label: 'Detail sahifasi', icon: BookOpen },
          ]
        },
        { id: 'news', label: 'Yangiliklar', icon: Globe },
        { id: 'faq', label: 'Ko\'p beriladigan savollar', icon: MessageSquare },
      ]
    },
    { id: 'abacus', label: 'Abakus', icon: Shield },
    { id: 'feedback', label: 'Izoh yoki taklif', icon: MessageSquare },
    { id: 'applications', label: 'Kursga arizalar', icon: BookOpen },
    { id: 'admins', label: 'Adminlar', icon: Shield },
    { id: 'settings', label: 'Sozlamalar', icon: Settings },
  ];

  const handleLogout = () => {
    toast.success("Tizimdan chiqildi");
    navigate('/admin/login');
  };

  const handleMenuClick = (item: any) => {
    if (item.path) {
      navigate(item.path);
    } else {
      setActiveTab(item.id);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddAd = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Reklama muvaffaqiyatli qo'shildi");
    setIsAddAdModalOpen(false);
    setImagePreview(null);
  };

  const handleEditClick = (ad: any) => {
    setEditingAd(ad);
    setImagePreview(ad.image);
    setIsEditAdModalOpen(true);
  };

  const handleUpdateAd = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Reklama muvaffaqiyatli tahrirlandi");
    setIsEditAdModalOpen(false);
    setEditingAd(null);
    setImagePreview(null);
  };

  const handleAddFeature = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Xususiyat muvaffaqiyatli qo'shildi");
    setIsAddFeatureModalOpen(false);
    setFeatureName("");
  };

  const handleGenerateDescription = () => {
    toast.info("AI tavsif generatsiya qilmoqda...");
    // Mock AI generation
  };

  const handleEditFeature = (feature: any) => {
    setEditingFeature(feature);
    setFeatureName(feature.name);
    setIsEditFeatureModalOpen(true);
  };

  const handleUpdateFeature = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Xususiyat muvaffaqiyatli tahrirlandi");
    setIsEditFeatureModalOpen(false);
    setEditingFeature(null);
  };

  const handleEditFeatureDetail = (detail: any) => {
    setEditingFeatureDetail(detail);
    setImagePreview(detail.image);
    // In real app, we would load the steps for this detail
    setDetailSteps([{ name: "Ball to'plang", desc: "Mashqlarni aniq va tez bajaring" }, { name: "Reytingni kuzating", desc: "O'z o'rningizni real vaqtda ko'ring" }, { name: "Sovrin yuting", desc: "Haftalik yetakchilar uchun sovg'alar" }]);
    setIsEditFeatureDetailModalOpen(true);
  };

  const handleUpdateFeatureDetail = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Detail muvaffaqiyatli tahrirlandi");
    setIsEditFeatureDetailModalOpen(false);
    setEditingFeatureDetail(null);
    setImagePreview(null);
  };

  const handleStepChange = (index: number, field: string, value: string) => {
    const newSteps = [...detailSteps];
    (newSteps[index] as any)[field] = value;
    setDetailSteps(newSteps);
  };

  const handleAddFeatureDetail = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Xususiyat detali muvaffaqiyatli qo'shildi");
    setIsAddFeatureDetailModalOpen(false);
    setImagePreview(null);
    setDetailSteps([{ name: "", desc: "" }, { name: "", desc: "" }, { name: "", desc: "" }]);
  };

  const handleAddNews = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Yangilik muvaffaqiyatli qo'shildi");
    setIsAddNewsModalOpen(false);
    setImagePreview(null);
    setAuthorImagePreview(null);
  };

  const handleEditNews = (news: any) => {
    setEditingNews(news);
    setImagePreview(news.image);
    setAuthorImagePreview(news.authorImage);
    setIsEditNewsModalOpen(true);
  };

  const renderContent = () => {
    if (activeTab === 'ads') {
      return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Reklamalar Boshqaruvi</h2>
              <p className="text-zinc-500 font-medium mt-1">Asosiy sahifadagi slayder reklamalarini boshqarish.</p>
            </div>
            
            <Dialog open={isAddAdModalOpen} onOpenChange={setIsAddAdModalOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-2xl h-12 px-6 bg-emerald-500 hover:bg-emerald-600 font-black gap-2 shadow-xl shadow-emerald-500/20">
                  <Plus className="w-5 h-5" /> Reklama Qo'shish
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[440px] rounded-[32px] border-none shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
                <DialogHeader className="mb-2">
                  <DialogTitle className="text-xl font-black text-zinc-900">Yangi Reklama</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddAd} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Rasm Yuklash</Label>
                    <div 
                      className="relative h-32 w-full rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 flex flex-col items-center justify-center transition-all hover:border-emerald-500 hover:bg-emerald-50/50 group overflow-hidden cursor-pointer"
                      onClick={() => document.getElementById('ad-image-upload')?.click()}
                    >
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                            <Upload className="w-5 h-5 text-zinc-400 group-hover:text-emerald-500" />
                          </div>
                          <p className="text-[9px] font-bold text-zinc-400 mt-2 uppercase tracking-widest">Rasm tanlash</p>
                        </>
                      )}
                      <input 
                        id="ad-image-upload"
                        type="file" 
                        accept="image/*"
                        className="hidden" 
                        onChange={handleImageChange}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Sarlavha</Label>
                      <Input id="title" placeholder="Reklama nomi" className="h-10 rounded-xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all text-sm" required />
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="section" className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Bo'lim</Label>
                      <Input id="section" placeholder="Masalan: Uy sahifasi" className="h-10 rounded-xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all text-sm" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="desc" className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Tavsif</Label>
                    <Textarea id="desc" placeholder="Ma'lumot..." className="rounded-xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all min-h-[80px] text-sm resize-none" required />
                  </div>

                  <DialogFooter className="pt-2">
                    <Button type="submit" className="w-full h-12 rounded-2xl bg-zinc-900 hover:bg-emerald-600 text-white font-black text-base shadow-xl shadow-zinc-900/10 transition-all">
                      Saqlash
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* Edit Ad Modal */}
            <Dialog open={isEditAdModalOpen} onOpenChange={(open) => {
              setIsEditAdModalOpen(open);
              if (!open) {
                setEditingAd(null);
                setImagePreview(null);
              }
            }}>
              <DialogContent className="sm:max-w-[440px] rounded-[32px] border-none shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
                <DialogHeader className="mb-2">
                  <DialogTitle className="text-xl font-black text-zinc-900">Reklamani Tahrirlash</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleUpdateAd} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Rasm</Label>
                    <div 
                      className="relative h-32 w-full rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 flex flex-col items-center justify-center transition-all hover:border-emerald-500 hover:bg-emerald-50/50 group overflow-hidden cursor-pointer"
                      onClick={() => document.getElementById('edit-ad-image-upload')?.click()}
                    >
                      <img src={imagePreview || editingAd?.image} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Upload className="w-6 h-6 text-white" />
                      </div>
                      <input 
                        id="edit-ad-image-upload"
                        type="file" 
                        accept="image/*"
                        className="hidden" 
                        onChange={handleImageChange}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="edit-title" className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Sarlavha</Label>
                      <Input id="edit-title" defaultValue={editingAd?.title} placeholder="Reklama nomi" className="h-10 rounded-xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all text-sm" required />
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="edit-section" className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Bo'lim</Label>
                      <Input id="edit-section" defaultValue="Uy sahifasi" placeholder="Masalan: Uy sahifasi" className="h-10 rounded-xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all text-sm" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-desc" className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Tavsif</Label>
                    <Textarea id="edit-desc" defaultValue={editingAd?.desc} placeholder="Ma'lumot..." className="rounded-xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all min-h-[80px] text-sm resize-none" required />
                  </div>

                  <DialogFooter className="pt-2">
                    <Button type="submit" className="w-full h-12 rounded-2xl bg-zinc-900 hover:bg-emerald-600 text-white font-black text-base shadow-xl shadow-zinc-900/10 transition-all">
                      Saqlash
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[32px] overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-lg font-black text-zinc-900 flex items-center gap-2">
                <Star className="w-5 h-5 text-emerald-500" /> Mavjud Reklamalar
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-zinc-50/50 text-left">
                      <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Rasm</th>
                      <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Sarlavha</th>
                      <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Tavsif</th>
                      <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Qo'shilgan sana</th>
                      <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">Harakat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50">
                    {ads.map((ad) => (
                      <tr key={ad.id} className="hover:bg-zinc-50/30 transition-colors group">
                        <td className="px-8 py-4">
                          <div className="w-16 h-10 rounded-lg bg-zinc-100 overflow-hidden border border-zinc-200 shadow-sm">
                            <img src={ad.image} alt={ad.title} className="w-full h-full object-cover" />
                          </div>
                        </td>
                        <td className="px-8 py-4">
                          <p className="text-sm font-bold text-zinc-900">{ad.title}</p>
                        </td>
                        <td className="px-8 py-4">
                          <p className="text-xs text-zinc-500 line-clamp-1 max-w-[200px]">{ad.desc}</p>
                        </td>
                        <td className="px-8 py-4">
                          <span className="text-xs font-bold text-zinc-500 bg-zinc-100 px-3 py-1 rounded-full border border-zinc-200">
                            {ad.date}
                          </span>
                        </td>
                        <td className="px-8 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              onClick={() => handleEditClick(ad)}
                              variant="ghost" 
                              size="icon" 
                              className="w-8 h-8 rounded-lg hover:bg-zinc-100"
                            >
                              <Settings className="w-4 h-4 text-zinc-400" />
                            </Button>
                            <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg hover:bg-rose-50 hover:text-rose-500">
                              <LogOut className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (activeTab === 'features') {
      return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Platforma Xususiyatlari</h2>
              <p className="text-zinc-500 font-medium mt-1">Sitedagi afzalliklar va xususiyatlarni boshqarish.</p>
            </div>
            
            <Dialog open={isAddFeatureModalOpen} onOpenChange={setIsAddFeatureModalOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-2xl h-12 px-6 bg-emerald-500 hover:bg-emerald-600 font-black gap-2 shadow-xl shadow-emerald-500/20">
                  <Plus className="w-5 h-5" /> Yangi Xususiyat
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[440px] rounded-[32px] border-none shadow-2xl p-6">
                <DialogHeader className="mb-2">
                  <DialogTitle className="text-xl font-black text-zinc-900">Yangi Xususiyat</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddFeature} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="feature-name" className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Nomi</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="feature-name" 
                        value={featureName}
                        onChange={(e) => setFeatureName(e.target.value)}
                        placeholder="Xususiyat nomi..." 
                        className="h-10 rounded-xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all text-sm" 
                        required 
                      />
                      {featureName.length > 2 && (
                        <Button 
                          type="button"
                          onClick={handleGenerateDescription}
                          className="h-10 rounded-xl bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white px-3 transition-all animate-in zoom-in duration-300"
                        >
                          <Sparkles className="w-4 h-4 mr-1" /> Generatsiya
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="feature-desc" className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Tavsif</Label>
                    <Textarea id="feature-desc" placeholder="Xususiyat haqida qisqacha..." className="rounded-xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all min-h-[100px] text-sm resize-none" required />
                  </div>

                  <DialogFooter className="pt-2">
                    <Button type="submit" className="w-full h-12 rounded-2xl bg-zinc-900 hover:bg-emerald-600 text-white font-black text-base shadow-xl shadow-zinc-900/10 transition-all">
                      Yaratish
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* Edit Feature Modal */}
            <Dialog open={isEditFeatureModalOpen} onOpenChange={(open) => {
              setIsEditFeatureModalOpen(open);
              if (!open) setEditingFeature(null);
            }}>
              <DialogContent className="sm:max-w-[440px] rounded-[32px] border-none shadow-2xl p-6">
                <DialogHeader className="mb-2">
                  <DialogTitle className="text-xl font-black text-zinc-900">Xususiyatni Tahrirlash</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleUpdateFeature} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-feature-name" className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Nomi</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="edit-feature-name" 
                        defaultValue={editingFeature?.name}
                        placeholder="Xususiyat nomi..." 
                        className="h-10 rounded-xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all text-sm" 
                        required 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-feature-desc" className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Tavsif</Label>
                    <Textarea id="edit-feature-desc" defaultValue={editingFeature?.desc} placeholder="Xususiyat haqida qisqacha..." className="rounded-xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all min-h-[100px] text-sm resize-none" required />
                  </div>

                  <DialogFooter className="pt-2">
                    <Button type="submit" className="w-full h-12 rounded-2xl bg-zinc-900 hover:bg-emerald-600 text-white font-black text-base shadow-xl shadow-zinc-900/10 transition-all">
                      Saqlash
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[32px] overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-lg font-black text-zinc-900 flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-500" /> Mavjud Xususiyatlar
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-zinc-50/50 text-left">
                      <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest w-16 text-center">#</th>
                      <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest w-20">Icon</th>
                      <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Nomi</th>
                      <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Tavsif</th>
                      <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Yaratildi</th>
                      <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">Harakat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50">
                    {features.map((feature, index) => (
                      <tr key={feature.id} className="hover:bg-zinc-50/30 transition-colors group">
                        <td className="px-8 py-4 text-center">
                          <span className="text-xs font-black text-zinc-400">{index + 1}</span>
                        </td>
                        <td className="px-8 py-4">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                            <feature.icon className="w-5 h-5" />
                          </div>
                        </td>
                        <td className="px-8 py-4">
                          <p className="text-sm font-bold text-zinc-900">{feature.name}</p>
                        </td>
                        <td className="px-8 py-4">
                          <p className="text-xs text-zinc-500 line-clamp-1 max-w-[300px]">{feature.desc}</p>
                        </td>
                        <td className="px-8 py-4">
                          <span className="text-xs font-bold text-zinc-400">{feature.date}</span>
                        </td>
                        <td className="px-8 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              onClick={() => handleEditFeature(feature)}
                              variant="ghost" 
                              size="icon" 
                              className="w-8 h-8 rounded-lg hover:bg-zinc-100"
                            >
                              <Settings className="w-4 h-4 text-zinc-400" />
                            </Button>
                            <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg hover:bg-rose-50 hover:text-rose-500">
                              <LogOut className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (activeTab === 'feature-details') {
      return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Xususiyat Detallari</h2>
              <p className="text-zinc-500 font-medium mt-1">Xususiyatlar uchun batafsil ma'lumotlar va qadamlarni boshqarish.</p>
            </div>
            
            <Dialog open={isAddFeatureDetailModalOpen} onOpenChange={setIsAddFeatureDetailModalOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-2xl h-12 px-6 bg-emerald-500 hover:bg-emerald-600 font-black gap-2 shadow-xl shadow-emerald-500/20">
                  <Plus className="w-5 h-5" /> Detail Yaratish
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px] rounded-[32px] border-none shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
                <DialogHeader className="mb-2">
                  <DialogTitle className="text-xl font-black text-zinc-900">Yangi Detail</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddFeatureDetail} className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Rasm</Label>
                      <div 
                        className="relative h-32 w-full rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 flex flex-col items-center justify-center transition-all hover:border-emerald-500 hover:bg-emerald-50/50 group overflow-hidden cursor-pointer"
                        onClick={() => document.getElementById('detail-image-upload')?.click()}
                      >
                        {imagePreview ? (
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <>
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                              <Upload className="w-5 h-5 text-zinc-400 group-hover:text-emerald-500" />
                            </div>
                            <p className="text-[9px] font-bold text-zinc-400 mt-2 uppercase tracking-widest">Rasm tanlash</p>
                          </>
                        )}
                        <input id="detail-image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                      </div>
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Xususiyatni tanlang</Label>
                      <Select>
                        <SelectTrigger className="h-10 rounded-xl border-zinc-100 bg-zinc-50 focus:ring-emerald-500/10 transition-all text-sm">
                          <SelectValue placeholder="Asosiy xususiyatni tanlang" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-zinc-100 shadow-xl">
                          {features.map((feature) => (
                            <SelectItem key={feature.id} value={feature.id.toString()} className="text-sm font-medium py-2.5 rounded-xl">
                              {feature.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2 col-span-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Nomi</Label>
                      <Input placeholder="Detail nomi..." className="h-10 rounded-xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all text-sm" required />
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Tavsif</Label>
                      <Textarea placeholder="Asosiy tavsif..." className="rounded-xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all min-h-[80px] text-sm resize-none" required />
                    </div>
                  </div>

                  {/* Qanday ishlaydi section */}
                  <div className="space-y-4 pt-4 border-t border-zinc-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                      </div>
                      <h3 className="font-black text-sm text-zinc-900 uppercase tracking-widest">Qanday ishlaydi?</h3>
                    </div>
                    
                    <div className="space-y-4">
                      {detailSteps.map((step, i) => (
                        <div key={i} className="p-4 rounded-2xl bg-zinc-50 space-y-3 relative overflow-hidden group">
                          <div className="absolute top-0 right-0 w-12 h-12 bg-zinc-100 rounded-bl-3xl flex items-center justify-center">
                            <span className="text-lg font-black text-zinc-300">{i + 1}</span>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Qadam nomi</Label>
                            <Input 
                              value={step.name} 
                              onChange={(e) => handleStepChange(i, 'name', e.target.value)}
                              placeholder={`Masalan: ${i === 0 ? 'Ball to\'plang' : i === 1 ? 'Reytingni kuzating' : 'Sovrin yuting'}`} 
                              className="h-9 rounded-lg border-white bg-white focus:bg-white transition-all text-sm" 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Qadam tavsifi</Label>
                            <Input 
                              value={step.desc} 
                              onChange={(e) => handleStepChange(i, 'desc', e.target.value)}
                              placeholder="Qisqacha ma'lumot..." 
                              className="h-9 rounded-lg border-white bg-white focus:bg-white transition-all text-sm" 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <DialogFooter className="pt-2">
                    <Button type="submit" className="w-full h-12 rounded-2xl bg-zinc-900 hover:bg-emerald-600 text-white font-black text-base shadow-xl shadow-zinc-900/10 transition-all">
                      Yaratish
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* Edit Feature Detail Modal */}
            <Dialog open={isEditFeatureDetailModalOpen} onOpenChange={(open) => {
              setIsEditFeatureDetailModalOpen(open);
              if (!open) {
                setEditingFeatureDetail(null);
                setImagePreview(null);
              }
            }}>
              <DialogContent className="sm:max-w-[550px] rounded-[32px] border-none shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
                <DialogHeader className="mb-2">
                  <DialogTitle className="text-xl font-black text-zinc-900">Detailni Tahrirlash</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleUpdateFeatureDetail} className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Rasm</Label>
                      <div 
                        className="relative h-32 w-full rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 flex flex-col items-center justify-center transition-all hover:border-emerald-500 hover:bg-emerald-50/50 group overflow-hidden cursor-pointer"
                        onClick={() => document.getElementById('edit-detail-image-upload')?.click()}
                      >
                        <img src={imagePreview || editingFeatureDetail?.image} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Upload className="w-6 h-6 text-white" />
                        </div>
                        <input id="edit-detail-image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                      </div>
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Xususiyatni tanlang</Label>
                      <Select defaultValue={editingFeatureDetail ? "1" : undefined}>
                        <SelectTrigger className="h-10 rounded-xl border-zinc-100 bg-zinc-50 focus:ring-emerald-500/10 transition-all text-sm">
                          <SelectValue placeholder="Asosiy xususiyatni tanlang" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-zinc-100 shadow-xl">
                          {features.map((feature) => (
                            <SelectItem key={feature.id} value={feature.id.toString()} className="text-sm font-medium py-2.5 rounded-xl">
                              {feature.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2 col-span-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Nomi</Label>
                      <Input defaultValue={editingFeatureDetail?.name} placeholder="Detail nomi..." className="h-10 rounded-xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all text-sm" required />
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Tavsif</Label>
                      <Textarea defaultValue="Mashqlarni aniq va tez bajarish orqali natijalarga erishing." placeholder="Asosiy tavsif..." className="rounded-xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all min-h-[80px] text-sm resize-none" required />
                    </div>
                  </div>

                  {/* Qanday ishlaydi section */}
                  <div className="space-y-4 pt-4 border-t border-zinc-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                      </div>
                      <h3 className="font-black text-sm text-zinc-900 uppercase tracking-widest">Qanday ishlaydi?</h3>
                    </div>
                    
                    <div className="space-y-4">
                      {detailSteps.map((step, i) => (
                        <div key={i} className="p-4 rounded-2xl bg-zinc-50 space-y-3 relative overflow-hidden group">
                          <div className="absolute top-0 right-0 w-12 h-12 bg-zinc-100 rounded-bl-3xl flex items-center justify-center">
                            <span className="text-lg font-black text-zinc-300">{i + 1}</span>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Qadam nomi</Label>
                            <Input 
                              value={step.name} 
                              onChange={(e) => handleStepChange(i, 'name', e.target.value)}
                              placeholder="Qadam nomi..." 
                              className="h-9 rounded-lg border-white bg-white focus:bg-white transition-all text-sm" 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Qadam tavsifi</Label>
                            <Input 
                              value={step.desc} 
                              onChange={(e) => handleStepChange(i, 'desc', e.target.value)}
                              placeholder="Qisqacha ma'lumot..." 
                              className="h-9 rounded-lg border-white bg-white focus:bg-white transition-all text-sm" 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <DialogFooter className="pt-2">
                    <Button type="submit" className="w-full h-12 rounded-2xl bg-zinc-900 hover:bg-emerald-600 text-white font-black text-base shadow-xl shadow-zinc-900/10 transition-all">
                      Saqlash
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[32px] overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-lg font-black text-zinc-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-500" /> Mavjud Detallar
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-zinc-50/50 text-left">
                      <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest w-16 text-center">#</th>
                      <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Rasm</th>
                      <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Nomi</th>
                      <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Xususiyat</th>
                      <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Sana</th>
                      <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">Harakat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50">
                    {featureDetails.map((detail, index) => (
                      <tr key={detail.id} className="hover:bg-zinc-50/30 transition-colors group">
                        <td className="px-8 py-4 text-center">
                          <span className="text-xs font-black text-zinc-400">{index + 1}</span>
                        </td>
                        <td className="px-8 py-4">
                          <div className="w-12 h-8 rounded-lg bg-zinc-100 overflow-hidden border border-zinc-200">
                            <img src={detail.image} alt={detail.name} className="w-full h-full object-cover" />
                          </div>
                        </td>
                        <td className="px-8 py-4">
                          <p className="text-sm font-bold text-zinc-900">{detail.name}</p>
                        </td>
                        <td className="px-8 py-4">
                          <span className="text-[10px] font-black text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded-full uppercase tracking-widest">
                            {detail.feature}
                          </span>
                        </td>
                        <td className="px-8 py-4">
                          <span className="text-xs font-bold text-zinc-400">{detail.date}</span>
                        </td>
                        <td className="px-8 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              onClick={() => handleEditFeatureDetail(detail)}
                              variant="ghost" 
                              size="icon" 
                              className="w-8 h-8 rounded-lg hover:bg-zinc-100"
                            >
                              <Settings className="w-4 h-4 text-zinc-400" />
                            </Button>
                            <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg hover:bg-rose-50 hover:text-rose-500">
                              <LogOut className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (activeTab === 'news') {
      return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Yangiliklar Boshqaruvi</h2>
              <p className="text-zinc-500 font-medium mt-1">Platformadagi so'nggi yangilik va maqolalar.</p>
            </div>
            
            <Dialog open={isAddNewsModalOpen} onOpenChange={setIsAddNewsModalOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-2xl h-12 px-6 bg-emerald-500 hover:bg-emerald-600 font-black gap-2 shadow-xl shadow-emerald-500/20">
                  <Plus className="w-5 h-5" /> Yangilik Qo'shish
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] rounded-[32px] border-none shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
                <DialogHeader className="mb-2">
                  <DialogTitle className="text-xl font-black text-zinc-900">Yangi Yangilik</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddNews} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Main Image */}
                    <div className="space-y-2 col-span-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Asosiy Rasm</Label>
                      <div 
                        className="relative h-40 w-full rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 flex flex-col items-center justify-center transition-all hover:border-emerald-500 hover:bg-emerald-50/50 group overflow-hidden cursor-pointer"
                        onClick={() => document.getElementById('news-image-upload')?.click()}
                      >
                        {imagePreview ? (
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <>
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                              <Upload className="w-5 h-5 text-zinc-400 group-hover:text-emerald-500" />
                            </div>
                            <p className="text-[9px] font-bold text-zinc-400 mt-2 uppercase tracking-widest">Rasm tanlash</p>
                          </>
                        )}
                        <input id="news-image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                      </div>
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Sarlavha</Label>
                      <Input placeholder="Yangilik sarlavhasi..." className="h-10 rounded-xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all text-sm" required />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Yo'nalish</Label>
                      <Input placeholder="Masalan: Musobaqa" className="h-10 rounded-xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all text-sm" required />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Heshteglar</Label>
                      <Input placeholder="#yangilik #math" className="h-10 rounded-xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all text-sm" />
                    </div>

                    {/* Author Info */}
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Muallif Rasmi</Label>
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center overflow-hidden border border-zinc-200 cursor-pointer hover:border-emerald-500 transition-all"
                          onClick={() => document.getElementById('author-image-upload')?.click()}
                        >
                          {authorImagePreview ? (
                            <img src={authorImagePreview} className="w-full h-full object-cover" />
                          ) : <Users className="w-5 h-5 text-zinc-400" />}
                        </div>
                        <input id="author-image-upload" type="file" accept="image/*" className="hidden" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => setAuthorImagePreview(reader.result as string);
                            reader.readAsDataURL(file);
                          }
                        }} />
                        <p className="text-[10px] text-zinc-400 font-medium">Tanlash...</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Muallif Ismi</Label>
                      <Input placeholder="Ism sharif..." className="h-10 rounded-xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all text-sm" required />
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Tavsif</Label>
                      <Textarea placeholder="Batafsil ma'lumot..." className="rounded-xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all min-h-[120px] text-sm resize-none" required />
                    </div>
                  </div>

                  <DialogFooter className="pt-2">
                    <Button type="submit" className="w-full h-12 rounded-2xl bg-zinc-900 hover:bg-emerald-600 text-white font-black text-base shadow-xl shadow-zinc-900/10 transition-all">
                      Yaratish
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* Edit News Modal */}
            <Dialog open={isEditNewsModalOpen} onOpenChange={(open) => {
              setIsEditNewsModalOpen(open);
              if (!open) {
                setEditingNews(null);
                setImagePreview(null);
                setAuthorImagePreview(null);
              }
            }}>
              <DialogContent className="sm:max-w-[600px] rounded-[32px] border-none shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
                <DialogHeader className="mb-2">
                  <DialogTitle className="text-xl font-black text-zinc-900">Yangilikni Tahrirlash</DialogTitle>
                </DialogHeader>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  toast.success("Yangilik tahrirlandi");
                  setIsEditNewsModalOpen(false);
                }} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Main Image */}
                    <div className="space-y-2 col-span-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Asosiy Rasm</Label>
                      <div 
                        className="relative h-40 w-full rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 flex flex-col items-center justify-center transition-all hover:border-emerald-500 hover:bg-emerald-50/50 group overflow-hidden cursor-pointer"
                        onClick={() => document.getElementById('edit-news-image-upload')?.click()}
                      >
                        <img src={imagePreview || editingNews?.image} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Upload className="w-6 h-6 text-white" />
                        </div>
                        <input id="edit-news-image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                      </div>
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Sarlavha</Label>
                      <Input defaultValue={editingNews?.title} placeholder="Yangilik sarlavhasi..." className="h-10 rounded-xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all text-sm" required />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Yo'nalish</Label>
                      <Input defaultValue={editingNews?.category} placeholder="Masalan: Musobaqa" className="h-10 rounded-xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all text-sm" required />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Heshteglar</Label>
                      <Input defaultValue={editingNews?.hashtags} placeholder="#yangilik #math" className="h-10 rounded-xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all text-sm" />
                    </div>

                    {/* Author Info */}
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Muallif Rasmi</Label>
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center overflow-hidden border border-zinc-200 cursor-pointer hover:border-emerald-500 transition-all"
                          onClick={() => document.getElementById('edit-author-image-upload')?.click()}
                        >
                          <img src={authorImagePreview || editingNews?.authorImage} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Upload className="w-4 h-4 text-white" />
                          </div>
                        </div>
                        <input id="edit-author-image-upload" type="file" accept="image/*" className="hidden" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => setAuthorImagePreview(reader.result as string);
                            reader.readAsDataURL(file);
                          }
                        }} />
                        <p className="text-[10px] text-zinc-400 font-medium">O'zgartirish...</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Muallif Ismi</Label>
                      <Input defaultValue={editingNews?.author} placeholder="Ism sharif..." className="h-10 rounded-xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all text-sm" required />
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Tavsif</Label>
                      <Textarea defaultValue="Ushbu yangilik platformadagi muhim o'zgarishlar va yutuqlar haqida batafsil ma'lumot beradi." placeholder="Batafsil ma'lumot..." className="rounded-xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all min-h-[120px] text-sm resize-none" required />
                    </div>
                  </div>

                  <DialogFooter className="pt-2">
                    <Button type="submit" className="w-full h-12 rounded-2xl bg-zinc-900 hover:bg-emerald-600 text-white font-black text-base shadow-xl shadow-zinc-900/10 transition-all">
                      Saqlash
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[32px] overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-lg font-black text-zinc-900 flex items-center gap-2">
                <Globe className="w-5 h-5 text-emerald-500" /> Mavjud Yangiliklar
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-zinc-50/50 text-left">
                      <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest w-16 text-center">#</th>
                      <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Rasm</th>
                      <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Sarlavha</th>
                      <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Muallif</th>
                      <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Sana</th>
                      <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">Harakat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50">
                    {newsItems.map((news, index) => (
                      <tr key={news.id} className="hover:bg-zinc-50/30 transition-colors group">
                        <td className="px-8 py-4 text-center">
                          <span className="text-xs font-black text-zinc-400">{index + 1}</span>
                        </td>
                        <td className="px-8 py-4">
                          <div className="w-12 h-8 rounded-lg bg-zinc-100 overflow-hidden border border-zinc-200">
                            <img src={news.image} alt={news.title} className="w-full h-full object-cover" />
                          </div>
                        </td>
                        <td className="px-8 py-4">
                          <div>
                            <p className="text-sm font-bold text-zinc-900 line-clamp-1">{news.title}</p>
                            <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded uppercase tracking-widest">
                              {news.category}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-zinc-100 overflow-hidden border border-zinc-200">
                              <img src={news.authorImage} alt={news.author} className="w-full h-full object-cover" />
                            </div>
                            <span className="text-xs font-bold text-zinc-600">{news.author}</span>
                          </div>
                        </td>
                        <td className="px-8 py-4">
                          <span className="text-xs font-bold text-zinc-400">{news.date}</span>
                        </td>
                        <td className="px-8 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              onClick={() => handleEditNews(news)}
                              variant="ghost" 
                              size="icon" 
                              className="w-8 h-8 rounded-lg hover:bg-zinc-100"
                            >
                              <Settings className="w-4 h-4 text-zinc-400" />
                            </Button>
                            <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg hover:bg-rose-50 hover:text-rose-500">
                              <LogOut className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Default Dashboard view
    return (
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight">Xayrli kun, Admin! 👋</h2>
            <p className="text-zinc-500 font-medium mt-1">Platformada bugungi holat va yangiliklar.</p>
          </div>
          <Button className="rounded-2xl h-12 px-6 bg-zinc-900 hover:bg-emerald-600 font-black gap-2 shadow-xl shadow-zinc-900/10">
            <Plus className="w-5 h-5" /> Yangi Kurs Qo'shish
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <Card key={i} className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[32px] overflow-hidden group hover:shadow-xl transition-all duration-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">{stat.growth}</span>
                  </div>
                </div>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</p>
                <h3 className="text-2xl font-black text-zinc-900">{stat.value}</h3>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          <Card className="lg:col-span-8 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[32px] overflow-hidden">
            <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-black text-zinc-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-500" /> So'nggi Ro'yxatdan O'tganlar
              </CardTitle>
              <Button variant="ghost" className="text-xs font-bold text-zinc-400 hover:text-zinc-900">Barchasi <ChevronRight className="ml-1 w-4 h-4" /></Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-zinc-50/50 text-left">
                      <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Foydalanuvchi</th>
                      <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Sana</th>
                      <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Status</th>
                      <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Harakat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50">
                    {recentUsers.map((user, i) => (
                      <tr key={i} className="hover:bg-zinc-50/30 transition-colors group">
                        <td className="px-8 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center text-[10px] font-black text-zinc-500 border border-zinc-200">
                              {user.avatar}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-zinc-900">{user.name}</p>
                              <p className="text-[10px] text-zinc-400">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-4">
                          <span className="text-xs text-zinc-500 font-medium">{user.date}</span>
                        </td>
                        <td className="px-8 py-4">
                          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                            user.status === 'Faol' ? 'bg-emerald-500/10 text-emerald-600' : 
                            user.status === 'Yangi' ? 'bg-blue-500/10 text-blue-600' : 
                            'bg-zinc-200/50 text-zinc-500'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-8 py-4 text-right">
                          <Button variant="ghost" size="icon" className="rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-4 space-y-8">
            <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[32px] overflow-hidden bg-zinc-900 text-white p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-black text-lg leading-none">Tezkor Tahlil</h3>
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">Bugungi o'sish</p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-zinc-400">Kunlik Maqsad</span>
                    <span className="text-xs font-black text-emerald-400">85%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '85%' }}
                      className="h-full bg-emerald-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-zinc-400">Server Yuklamasi</span>
                    <span className="text-xs font-black text-blue-400">32%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '32%' }}
                      className="h-full bg-blue-500 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.5)]"
                    />
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-8 rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white hover:text-zinc-900 transition-all font-black py-6">
                Batafsil Hisobot <BarChart3 className="ml-2 w-4 h-4" />
              </Button>
            </Card>

            <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[32px] p-6 bg-emerald-500 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />
              <div className="relative z-10 flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4">
                  <Star className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black mb-2">Premium Yordam</h3>
                <p className="text-white/80 text-xs font-medium mb-6">Tizim bo'yicha savollaringiz bormi? Texnik ko'mak har doim tayyor.</p>
                <Button className="w-full rounded-xl bg-zinc-900 text-white font-black hover:bg-white hover:text-zinc-900 transition-all">Bog'lanish</Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen bg-[#F8FAFC] flex overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="bg-zinc-900 border-r border-zinc-800 flex flex-col relative z-20 h-full shrink-0"
      >
        {/* Sidebar Header */}
        <div className="h-20 flex items-center px-5 border-b border-zinc-800 shrink-0 gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
            <Zap className="w-6 h-6 text-white" />
          </div>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 overflow-hidden whitespace-nowrap"
            >
              <h1 className="text-white font-black text-lg tracking-tight">IQRO<span className="text-emerald-400">MAX</span></h1>
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest leading-none">Admin Portal</p>
            </motion.div>
          )}
        </div>

        {/* Sidebar Menu */}
        <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto overflow-x-hidden">
          {menuItems.map((item) => (
            <div 
              key={item.id}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              className="relative"
            >
              <button
                onClick={() => handleMenuClick(item)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 relative group ${
                  activeTab === item.id 
                    ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20' 
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${activeTab === item.id ? 'text-white' : ''}`} />
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-bold text-sm"
                  >
                    {item.label}
                  </motion.span>
                )}
                {activeTab === item.id && !sidebarOpen && (
                  <div className="absolute left-0 w-1.5 h-6 bg-white rounded-r-full" />
                )}
              </button>

              {/* Sub-menu on Hover */}
              <AnimatePresence>
                {hoveredItem === item.id && item.subItems && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                    animate={{ height: 'auto', opacity: 1, marginTop: 8 }}
                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                    className="pl-12 pr-4 space-y-1 overflow-hidden"
                  >
                    {item.subItems.map((sub) => (
                      <div 
                        key={sub.id} 
                        className="space-y-1"
                        onMouseEnter={() => setHoveredSubItem(sub.id)}
                        onMouseLeave={() => setHoveredSubItem(null)}
                      >
                        <button
                          onClick={() => sub.subItems ? null : setActiveTab(sub.id)}
                          className={`w-full flex items-center gap-3 py-2 text-xs font-bold transition-all rounded-xl px-3 ${
                            activeTab === sub.id 
                              ? 'text-emerald-400 bg-emerald-500/10' 
                              : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
                          }`}
                        >
                          <sub.icon className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{sub.label}</span>
                          {sub.subItems && (
                            <motion.div
                              animate={{ rotate: hoveredSubItem === sub.id ? 90 : 0 }}
                              className="ml-auto"
                            >
                              <ChevronRight className="w-3 h-3 opacity-50" />
                            </motion.div>
                          )}
                        </button>
                        
                        {/* Second Level Sub-menu - Only on Hover */}
                        <AnimatePresence>
                          {sub.subItems && hoveredSubItem === sub.id && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="pl-6 space-y-1 border-l border-zinc-800 ml-4 mt-1 overflow-hidden"
                            >
                              {sub.subItems.map((nested: any) => (
                                <button
                                  key={nested.id}
                                  onClick={() => setActiveTab(nested.id)}
                                  className={`w-full flex items-center gap-2 py-1.5 text-[10px] font-bold transition-all rounded-lg px-2 ${
                                    activeTab === nested.id 
                                      ? 'text-emerald-400' 
                                      : 'text-zinc-600 hover:text-zinc-400'
                                  }`}
                                >
                                  <nested.icon className="w-3 h-3" />
                                  <span>{nested.label}</span>
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Sidebar Footer - Logout Button at the bottom */}
        <div className="mt-auto p-4 border-t border-zinc-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all group"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            {sidebarOpen && <span className="font-bold text-sm">Chiqish</span>}
          </button>
        </div>
        
        {/* Toggle Button - floating at right edge */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-zinc-200 hover:bg-emerald-500 hover:border-emerald-500 flex items-center justify-center text-zinc-500 hover:text-white transition-all duration-300 shadow-lg z-30"
          title={sidebarOpen ? 'Yopish' : 'Ochish'}
        >
          <motion.div
            animate={{ rotate: sidebarOpen ? 0 : 180 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <ChevronLeft className="w-4 h-4" />
          </motion.div>
        </button>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-zinc-100 flex items-center justify-between px-8 shrink-0">
          <div className="flex-1 max-w-xl">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" />
              <Input 
                placeholder="Qidirish..." 
                className="h-11 pl-12 rounded-xl border-zinc-100 bg-zinc-50 focus:bg-white focus:ring-emerald-500/10 transition-all border-none outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative rounded-xl hover:bg-zinc-50">
              <Bell className="w-5 h-5 text-zinc-600" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
            </Button>
            
            <div className="h-8 w-px bg-zinc-100 mx-2" />
            
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-zinc-900 leading-none">Admin User</p>
                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-1">Super Admin</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 overflow-hidden shadow-sm">
                <img src="https://i.pravatar.cc/100?u=admin" alt="Admin" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
