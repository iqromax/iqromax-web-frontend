import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { PageBackground } from '@/components/layout/PageBackground';
import { useSound } from '@/hooks/useSound';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Download, RefreshCw, FileText, Save, FolderOpen, Trash2, Loader2, Share2, Copy, Globe, Lock, Columns, Hash, Calculator, Layers, LayoutGrid, ClipboardList, Sparkles, ArrowRight, CheckCircle2, Printer, BookOpen } from 'lucide-react';
import { generateProblem, getLegacyFormulas, FORMULA_LABELS, validateProblemSequence } from '@/lib/sorobanEngine';
import { ProblemSheetTable } from '@/components/ProblemSheetTable';
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';


interface Problem {
  id: number;
  sequence: number[];
  answer: number;
}

interface GeneratedSheet {
  problems: Problem[];
  settings: {
    digitCount: number;
    operationCount: number;
    formulaType: string;
    problemCount: number;
  };
}

interface SavedSheet {
  id: string;
  title: string;
  digit_count: number;
  operation_count: number;
  formula_type: string;
  problem_count: number;
  columns_per_row: number;
  problems: Problem[];
  created_at: string;
  is_public: boolean;
  share_code: string | null;
}

const settingsConfig = [
  { id: 'digitCount', label: 'Xona soni', icon: Hash },
  { id: 'operationCount', label: 'Ustun soni', icon: Columns },
  { id: 'formulaType', label: 'Formula turi', icon: Calculator },
  { id: 'problemCount', label: 'Misollar soni', icon: Layers },
  { id: 'columnsPerRow', label: 'Qatorga ustun', icon: LayoutGrid },
];

const ProblemSheetGenerator = () => {
  const { soundEnabled, toggleSound, playSound } = useSound();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  
  // Settings
  const [digitCount, setDigitCount] = useState(1);
  const [operationCount, setOperationCount] = useState(8);
  const [formulaType, setFormulaType] = useState('formulasiz');
  const [problemCount, setProblemCount] = useState(50);
  const [columnsPerRow, setColumnsPerRow] = useState(10);
  
  // Generated sheet
  const [sheet, setSheet] = useState<GeneratedSheet | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Saved sheets
  const [savedSheets, setSavedSheets] = useState<SavedSheet[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [savingSheet, setSavingSheet] = useState(false);
  const [sheetTitle, setSheetTitle] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [currentShareSheet, setCurrentShareSheet] = useState<SavedSheet | null>(null);
  const [updatingShare, setUpdatingShare] = useState(false);
  
  const playClick = () => playSound('tick');
  
  // Load shared sheet from URL
  useEffect(() => {
    const shareCode = searchParams.get('code');
    if (shareCode) {
      loadSharedSheet(shareCode);
    }
  }, [searchParams]);
  
  const loadSharedSheet = async (code: string) => {
    setLoadingSaved(true);
    const { data, error } = await supabase
      .from('problem_sheets')
      .select('*')
      .eq('share_code', code)
      .eq('is_public', true)
      .single();
    
    if (error || !data) {
      toast.error("Varaq topilmadi yoki yopiq");
    } else {
      const savedSheet = { ...data, problems: data.problems as unknown as Problem[] };
      setDigitCount(savedSheet.digit_count);
      setOperationCount(savedSheet.operation_count);
      setFormulaType(savedSheet.formula_type);
      setProblemCount(savedSheet.problem_count);
      setColumnsPerRow(savedSheet.columns_per_row);
      setSheet({
        problems: savedSheet.problems,
        settings: {
          digitCount: savedSheet.digit_count,
          operationCount: savedSheet.operation_count,
          formulaType: savedSheet.formula_type,
          problemCount: savedSheet.problem_count,
        },
      });
      toast.success(`"${savedSheet.title}" yuklandi`);
    }
    setLoadingSaved(false);
  };
  
  const fetchSavedSheets = useCallback(async () => {
    if (!user) return;
    setLoadingSaved(true);
    const { data, error } = await supabase
      .from('problem_sheets')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching sheets:', error);
    } else {
      setSavedSheets((data || []).map(d => ({ ...d, problems: d.problems as unknown as Problem[] })));
    }
    setLoadingSaved(false);
  }, [user]);
  
  useEffect(() => {
    if (showLoadDialog) fetchSavedSheets();
  }, [showLoadDialog, fetchSavedSheets]);
  
  const saveSheet = async () => {
    if (!user || !sheet) return;
    if (!sheetTitle.trim()) { toast.error("Iltimos, varaq nomini kiriting"); return; }
    setSavingSheet(true);
    const { error } = await supabase
      .from('problem_sheets')
      .insert([{
        user_id: user.id, title: sheetTitle.trim(),
        digit_count: digitCount, operation_count: operationCount,
        formula_type: formulaType, problem_count: problemCount,
        columns_per_row: columnsPerRow,
        problems: JSON.parse(JSON.stringify(sheet.problems)),
      }]);
    if (error) { toast.error("Saqlashda xatolik yuz berdi"); }
    else { toast.success("Varaq muvaffaqiyatli saqlandi!"); setShowSaveDialog(false); setSheetTitle(''); }
    setSavingSheet(false);
  };
  
  const loadSheet = (savedSheet: SavedSheet) => {
    setDigitCount(savedSheet.digit_count);
    setOperationCount(savedSheet.operation_count);
    setFormulaType(savedSheet.formula_type);
    setProblemCount(savedSheet.problem_count);
    setColumnsPerRow(savedSheet.columns_per_row);
    setSheet({
      problems: savedSheet.problems,
      settings: {
        digitCount: savedSheet.digit_count, operationCount: savedSheet.operation_count,
        formulaType: savedSheet.formula_type, problemCount: savedSheet.problem_count,
      },
    });
    setShowLoadDialog(false);
    toast.success(`"${savedSheet.title}" yuklandi`);
  };
  
  const deleteSheet = async (id: string) => {
    const { error } = await supabase.from('problem_sheets').delete().eq('id', id);
    if (error) { toast.error("O'chirishda xatolik"); }
    else { setSavedSheets(prev => prev.filter(s => s.id !== id)); toast.success("Varaq o'chirildi"); }
  };
  
  const generateShareCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    return code;
  };
  
  const toggleSheetPublic = async (sheet: SavedSheet, makePublic: boolean) => {
    setUpdatingShare(true);
    const shareCode = makePublic && !sheet.share_code ? generateShareCode() : sheet.share_code;
    const { error } = await supabase
      .from('problem_sheets')
      .update({ is_public: makePublic, share_code: makePublic ? shareCode : sheet.share_code })
      .eq('id', sheet.id);
    if (error) { toast.error("Xatolik yuz berdi"); }
    else {
      setSavedSheets(prev => prev.map(s => s.id === sheet.id ? { ...s, is_public: makePublic, share_code: shareCode } : s));
      setCurrentShareSheet(prev => prev ? { ...prev, is_public: makePublic, share_code: shareCode } : null);
      toast.success(makePublic ? "Varaq ommaviy qilindi" : "Varaq yopiq qilindi");
    }
    setUpdatingShare(false);
  };
  
  const copyShareLink = (shareCode: string) => {
    const url = `${window.location.origin}/problem-sheet?code=${shareCode}`;
    navigator.clipboard.writeText(url);
    toast.success("Havola nusxalandi!");
  };
  
  const openShareDialog = (sheet: SavedSheet) => {
    setCurrentShareSheet(sheet);
    setShowShareDialog(true);
  };
  
  const generateSheet = useCallback(() => {
    playClick();
    setIsGenerating(true);
    setTimeout(() => {
      const problems: GeneratedSheet['problems'] = [];
      const allowedFormulas = getLegacyFormulas(formulaType);
      for (let i = 0; i < problemCount; i++) {
        const problem = generateProblem({ digitCount, operationCount, allowedFormulas, ensurePositiveResult: true });
        const fullSequence = [problem.startValue, ...problem.sequence];
        const isLengthOk = fullSequence.length === operationCount;
        const hasEmpty = fullSequence.some(n => n === undefined || n === null || Number.isNaN(n));
        const validation = validateProblemSequence(fullSequence, allowedFormulas);
        if (isLengthOk && !hasEmpty && validation.isValid) {
          problems.push({ id: i + 1, sequence: fullSequence, answer: problem.finalAnswer });
        } else { i--; }
      }
      setSheet({ problems, settings: { digitCount, operationCount, formulaType, problemCount } });
      setIsGenerating(false);
    }, 100);
  }, [digitCount, operationCount, formulaType, problemCount, playClick]);
  
  const downloadPDF = useCallback(() => {
    if (!sheet) return;
    playClick();
    const formulaLabel = FORMULA_LABELS[formulaType]?.label || formulaType;
    const title = `${sheet.settings.operationCount} ustun ${formulaLabel} ${sheet.settings.digitCount} xona`;
    const fileName = `IqroMax_${title.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`;
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;
    let yPos = margin;
    
    doc.setFontSize(16); doc.setTextColor(33, 150, 243);
    doc.text('IqroMax', pageWidth / 2, yPos + 5, { align: 'center' });
    doc.setFontSize(12); doc.setTextColor(100);
    doc.text(title, pageWidth / 2, yPos + 12, { align: 'center' });
    doc.setFontSize(9);
    doc.text(`${sheet.settings.problemCount} ta misol • ${new Date().toLocaleDateString('uz-UZ')}`, pageWidth / 2, yPos + 18, { align: 'center' });
    yPos += 25;
    doc.setDrawColor(33, 150, 243); doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 8;
    
    const totalRows = Math.ceil(sheet.problems.length / columnsPerRow);
    const cellWidth = (pageWidth - 2 * margin) / columnsPerRow;
    const cellHeight = 6;
    
    for (let row = 0; row < totalRows; row++) {
      const startIdx = row * columnsPerRow;
      const rowProblems = sheet.problems.slice(startIdx, startIdx + columnsPerRow);
      if (rowProblems.length === 0) continue;
      const maxOps = Math.max(...rowProblems.map(p => p.sequence.length));
      const tableHeight = (maxOps + 2) * cellHeight;
      if (yPos + tableHeight > pageHeight - margin) { doc.addPage(); yPos = margin; }
      
      doc.setFillColor(99, 102, 241); doc.setTextColor(255, 255, 255); doc.setFontSize(9);
      rowProblems.forEach((p, idx) => {
        const x = margin + idx * cellWidth;
        doc.rect(x, yPos, cellWidth, cellHeight, 'F');
        doc.text(String(p.id), x + cellWidth / 2, yPos + cellHeight - 1.5, { align: 'center' });
      });
      yPos += cellHeight;
      
      doc.setTextColor(33, 33, 33); doc.setFontSize(10);
      for (let opIdx = 0; opIdx < maxOps; opIdx++) {
        const isEven = opIdx % 2 === 0;
        rowProblems.forEach((p, idx) => {
          const x = margin + idx * cellWidth;
          if (isEven) { doc.setFillColor(248, 250, 252); doc.rect(x, yPos, cellWidth, cellHeight, 'F'); }
          doc.setDrawColor(200, 200, 200); doc.rect(x, yPos, cellWidth, cellHeight);
          const value = p.sequence[opIdx];
          if (value !== undefined) doc.text(String(value), x + cellWidth / 2, yPos + cellHeight - 1.5, { align: 'center' });
        });
        yPos += cellHeight;
      }
      
      doc.setFillColor(255, 249, 196);
      rowProblems.forEach((_, idx) => {
        const x = margin + idx * cellWidth;
        doc.rect(x, yPos, cellWidth, cellHeight, 'F');
        doc.setDrawColor(251, 192, 45); doc.rect(x, yPos, cellWidth, cellHeight);
      });
      yPos += cellHeight + 8;
    }
    
    doc.setFontSize(8); doc.setTextColor(150);
    doc.text("IqroMax - Mental Arifmetika O'quv Platformasi", pageWidth / 2, pageHeight - 5, { align: 'center' });
    
    // Answers page
    doc.addPage(); yPos = margin;
    doc.setFontSize(16); doc.setTextColor(76, 175, 80);
    doc.text('Javoblar', pageWidth / 2, yPos + 5, { align: 'center' });
    doc.setFontSize(10); doc.setTextColor(100);
    doc.text(title, pageWidth / 2, yPos + 12, { align: 'center' });
    yPos += 20;
    doc.setDrawColor(76, 175, 80); doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 8;
    
    const answersPerRow = 10;
    const answerCellWidth = (pageWidth - 2 * margin) / answersPerRow;
    const answerRows = Math.ceil(sheet.problems.length / answersPerRow);
    
    for (let row = 0; row < answerRows; row++) {
      const startIdx = row * answersPerRow;
      const rowProblems = sheet.problems.slice(startIdx, startIdx + answersPerRow);
      if (yPos + 14 > pageHeight - margin) { doc.addPage(); yPos = margin; }
      
      doc.setFillColor(76, 175, 80); doc.setTextColor(255, 255, 255); doc.setFontSize(8);
      rowProblems.forEach((p, idx) => {
        const x = margin + idx * answerCellWidth;
        doc.rect(x, yPos, answerCellWidth, cellHeight, 'F');
        doc.text(String(p.id), x + answerCellWidth / 2, yPos + cellHeight - 1.5, { align: 'center' });
      });
      yPos += cellHeight;
      
      doc.setFillColor(232, 245, 233); doc.setTextColor(33, 33, 33); doc.setFontSize(10);
      rowProblems.forEach((p, idx) => {
        const x = margin + idx * answerCellWidth;
        doc.rect(x, yPos, answerCellWidth, cellHeight, 'F');
        doc.setDrawColor(200, 200, 200); doc.rect(x, yPos, answerCellWidth, cellHeight);
        doc.text(String(p.answer), x + answerCellWidth / 2, yPos + cellHeight - 1.5, { align: 'center' });
      });
      yPos += cellHeight + 4;
    }
    
    doc.setFontSize(8); doc.setTextColor(150);
    doc.text("IqroMax - Mental Arifmetika O'quv Platformasi", pageWidth / 2, pageHeight - 5, { align: 'center' });
    doc.save(fileName);
    toast.success("PDF muvaffaqiyatli yuklab olindi!");
  }, [sheet, formulaType, columnsPerRow, playClick]);
  
  return (
    <PageBackground className="min-h-screen pb-20 sm:pb-24 bg-gradient-to-br from-orange-50/40 via-background to-amber-50/30 dark:from-orange-950/20 dark:via-background dark:to-amber-950/20">
      <Navbar soundEnabled={soundEnabled} onToggleSound={toggleSound} />

      <main className="container mx-auto px-3 sm:px-6 py-5 sm:py-8">
        <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
          {/* HERO */}
          <section className="rounded-3xl bg-gradient-to-br from-orange-50/80 via-amber-50/40 to-white dark:from-orange-950/30 dark:via-amber-950/20 dark:to-card border border-orange-200/60 dark:border-orange-800/40 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 px-5 sm:px-7 py-6 sm:py-8">
              <div className="min-w-0">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-orange-500 text-white shadow-sm mb-3">
                  <ClipboardList className="h-3 w-3" />
                  MASALA VARAQLARI
                </span>
                <h1 className="font-display font-black text-2xl sm:text-3xl md:text-4xl leading-tight">
                  Misol <span className="text-orange-500">varaqi</span> generatori
                </h1>
                <p className="text-sm text-muted-foreground mt-2 max-w-xl">
                  Soroban metodikasi asosida tayyor misollar varag'ini generatsiya qiling, saqlang va
                  bosib chiqarish uchun PDF formatida yuklab oling.
                </p>

                {/* Inline quick badges */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40">
                    <CheckCircle2 className="h-3 w-3" /> Avtomatik tekshiruv
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 border border-orange-200/60 dark:border-orange-800/40">
                    <Printer className="h-3 w-3" /> A4 PDF eksport
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/40">
                    <Share2 className="h-3 w-3" /> Ulashish mumkin
                  </span>
                </div>
              </div>

              {/* Right summary */}
              <div className="hidden lg:flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/25">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                {sheet ? (
                  <div>
                    <div className="font-display font-black text-xl text-orange-600">{sheet.problems.length}</div>
                    <div className="text-[11px] text-muted-foreground">misol tayyor</div>
                    <div className="text-[10px] text-emerald-600 font-bold mt-0.5 inline-flex items-center gap-1">
                      <CheckCircle2 className="h-2.5 w-2.5" /> Generatsiya qilindi
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="font-display font-bold text-base">Tayyor</div>
                    <div className="text-[11px] text-muted-foreground">Sozlamalarni tanlang</div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* QUICK STATS PREVIEW */}
          <section className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { ic: Hash, value: `${digitCount}`, label: 'Xona soni', sub: 'masala', bg: 'bg-emerald-100 dark:bg-emerald-900/40', fg: 'text-emerald-600' },
              { ic: Columns, value: operationCount, label: 'Ustun soni', sub: 'misolda', bg: 'bg-orange-100 dark:bg-orange-900/40', fg: 'text-orange-600' },
              { ic: Calculator, value: FORMULA_LABELS[formulaType]?.label?.split(' ')[0] || formulaType, label: 'Formula', sub: 'turi', bg: 'bg-purple-100 dark:bg-purple-900/40', fg: 'text-purple-600' },
              { ic: Layers, value: problemCount, label: 'Jami misollar', sub: 'varaqda', bg: 'bg-amber-100 dark:bg-amber-900/40', fg: 'text-amber-600' },
              { ic: LayoutGrid, value: columnsPerRow, label: 'Qatorga', sub: 'ustun', bg: 'bg-blue-100 dark:bg-blue-900/40', fg: 'text-blue-600' },
            ].map((s, i) => (
              <div key={i} className="rounded-2xl bg-card border border-border/40 p-3 sm:p-4 shadow-sm">
                <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-2`}>
                  <s.ic className={`h-4 w-4 ${s.fg}`} />
                </div>
                <div className={`text-base sm:text-lg font-display font-black ${s.fg} leading-tight truncate`}>
                  {s.value}
                </div>
                <div className="text-[10px] font-semibold mt-0.5">{s.label}</div>
                <div className="text-[9px] text-muted-foreground">{s.sub}</div>
              </div>
            ))}
          </section>

          {/* SETTINGS CARD */}
          <Card className="border-border/40 shadow-sm rounded-2xl">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center">
                    <RefreshCw className="w-4 h-4 text-orange-600" />
                  </div>
                  <span>Generatsiya sozlamalari</span>
                </CardTitle>
                <span className="text-[11px] text-muted-foreground hidden sm:inline">
                  Variantni tanlab "Generatsiya" tugmasini bosing
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {/* Digit Count */}
                <div className="space-y-2">
                  <Label htmlFor="digitCount" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5" /> Xona soni
                  </Label>
                  <Select value={String(digitCount)} onValueChange={(v) => setDigitCount(Number(v))}>
                    <SelectTrigger id="digitCount" className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 xonali</SelectItem>
                      <SelectItem value="2">2 xonali</SelectItem>
                      <SelectItem value="3">3 xonali</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Operation Count */}
                <div className="space-y-2">
                  <Label htmlFor="operationCount" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Columns className="w-3.5 h-3.5" /> Ustun soni
                  </Label>
                  <Select value={String(operationCount)} onValueChange={(v) => setOperationCount(Number(v))}>
                    <SelectTrigger id="operationCount" className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[5, 6, 7, 8, 9, 10, 12, 15].map((n) => (
                        <SelectItem key={n} value={String(n)}>{n} ta</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Formula Type */}
                <div className="space-y-2">
                  <Label htmlFor="formulaType" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Calculator className="w-3.5 h-3.5" /> Formula turi
                  </Label>
                  <Select value={formulaType} onValueChange={setFormulaType}>
                    <SelectTrigger id="formulaType" className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="formulasiz">📘 Formulasiz</SelectItem>
                      <SelectItem value="kichik_dost">🔢 Kichik do'st (5)</SelectItem>
                      <SelectItem value="katta_dost">🔟 Katta do'st (10)</SelectItem>
                      <SelectItem value="mix">🎯 Aralash</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Problem Count */}
                <div className="space-y-2">
                  <Label htmlFor="problemCount" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" /> Misollar soni
                  </Label>
                  <Select value={String(problemCount)} onValueChange={(v) => setProblemCount(Number(v))}>
                    <SelectTrigger id="problemCount" className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[20, 30, 40, 50, 60, 80, 100].map((n) => (
                        <SelectItem key={n} value={String(n)}>{n} ta</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Columns Per Row */}
                <div className="space-y-2">
                  <Label htmlFor="columnsPerRow" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <LayoutGrid className="w-3.5 h-3.5" /> Qatorga ustun
                  </Label>
                  <Select value={String(columnsPerRow)} onValueChange={(v) => setColumnsPerRow(Number(v))}>
                    <SelectTrigger id="columnsPerRow" className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[5, 8, 10, 12].map((n) => (
                        <SelectItem key={n} value={String(n)}>{n} ta</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-4 border-t border-border/40">
                <Button
                  onClick={generateSheet}
                  disabled={isGenerating}
                  size="lg"
                  className="gap-2 h-11 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-md shadow-orange-500/25"
                >
                  <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                  {isGenerating ? 'Generatsiya...' : 'Generatsiya qilish'}
                  {!isGenerating && <ArrowRight className="w-4 h-4" />}
                </Button>

                <Dialog open={showLoadDialog} onOpenChange={setShowLoadDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="lg" className="gap-2 h-11 rounded-xl">
                      <FolderOpen className="w-4 h-4" />
                      Saqlangan varaqlar
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <FolderOpen className="w-5 h-5 text-orange-500" />
                        Saqlangan varaqlar
                      </DialogTitle>
                    </DialogHeader>
                    {loadingSaved ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                      </div>
                    ) : savedSheets.length === 0 ? (
                      <div className="text-center py-12">
                        <FolderOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                        <p className="text-muted-foreground text-sm">Saqlangan varaqlar yo'q</p>
                        <p className="text-xs text-muted-foreground/60 mt-1">Birinchi varaqni generatsiya qiling va saqlang</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {savedSheets.map((s) => (
                          <div
                            key={s.id}
                            className="group flex items-center justify-between p-4 rounded-xl border border-border/50 bg-card hover:bg-orange-50 dark:hover:bg-orange-900/10 hover:border-orange-200 dark:hover:border-orange-800/40 transition-all cursor-pointer"
                            onClick={() => loadSheet(s)}
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="h-10 w-10 rounded-xl bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center flex-shrink-0">
                                <FileText className="w-4 h-4 text-orange-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <h4 className="font-bold text-sm truncate">{s.title}</h4>
                                  {s.is_public ? (
                                    <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 text-[10px] px-1.5 shrink-0 border-emerald-500/20">
                                      <Globe className="w-2.5 h-2.5 mr-0.5" /> Ommaviy
                                    </Badge>
                                  ) : (
                                    <Badge variant="secondary" className="text-[10px] px-1.5 shrink-0">
                                      <Lock className="w-2.5 h-2.5 mr-0.5" /> Yopiq
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-[11px] text-muted-foreground">
                                  {s.digit_count} xona · {s.operation_count} ustun · {s.problem_count} misol · {FORMULA_LABELS[s.formula_type]?.label || s.formula_type}
                                </p>
                                <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                                  {new Date(s.created_at).toLocaleDateString('uz-UZ')}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-orange-600"
                                onClick={(e) => { e.stopPropagation(); openShareDialog(s); }}>
                                <Share2 className="w-3.5 h-3.5" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"
                                onClick={(e) => { e.stopPropagation(); deleteSheet(s.id); }}>
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </DialogContent>
                </Dialog>

                {sheet && (
                  <>
                    <div className="w-px h-8 bg-border/50 hidden sm:block mx-1" />
                    <Button variant="outline" size="lg" onClick={downloadPDF} className="gap-2 h-11 rounded-xl border-orange-200 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20">
                      <Download className="w-4 h-4" />
                      PDF yuklab olish
                    </Button>

                    <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="lg" className="gap-2 h-11 rounded-xl border-emerald-200 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
                          <Save className="w-4 h-4" />
                          Saqlash
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-sm">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Save className="w-5 h-5 text-emerald-500" />
                            Varaqni saqlash
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-2">
                          <div className="space-y-2">
                            <Label htmlFor="sheetTitle">Varaq nomi</Label>
                            <Input
                              id="sheetTitle"
                              placeholder="Masalan: 8 ustun oddiy 1-xona"
                              value={sheetTitle}
                              onChange={(e) => setSheetTitle(e.target.value)}
                              className="h-11"
                            />
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            <Badge variant="secondary" className="bg-orange-100 text-orange-700">{digitCount} xona</Badge>
                            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">{operationCount} ustun</Badge>
                            <Badge variant="secondary" className="bg-amber-100 text-amber-700">{problemCount} misol</Badge>
                            <Badge variant="secondary" className="bg-purple-100 text-purple-700">{FORMULA_LABELS[formulaType]?.label || formulaType}</Badge>
                          </div>
                          <Button onClick={saveSheet} disabled={savingSheet || !sheetTitle.trim()} className="w-full h-11 bg-emerald-500 hover:bg-emerald-600 text-white">
                            {savingSheet ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            {savingSheet ? 'Saqlanmoqda...' : 'Saqlash'}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Share Dialog */}
          <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-primary" />
                  Varaqni ulashish
                </DialogTitle>
              </DialogHeader>
              {currentShareSheet && (
                <div className="space-y-4 pt-2">
                  <div className="p-3 rounded-xl bg-muted/50 border border-border/50">
                    <h4 className="font-semibold text-sm">{currentShareSheet.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {currentShareSheet.digit_count} xona • {currentShareSheet.operation_count} ustun • {currentShareSheet.problem_count} misol
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                    <div className="flex items-center gap-2">
                      {currentShareSheet.is_public ? (
                        <Globe className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Lock className="w-4 h-4 text-muted-foreground" />
                      )}
                      <span className="text-sm">
                        {currentShareSheet.is_public ? "Ommaviy" : "Yopiq"}
                      </span>
                    </div>
                    <Switch
                      checked={currentShareSheet.is_public}
                      onCheckedChange={(checked) => toggleSheetPublic(currentShareSheet, checked)}
                      disabled={updatingShare}
                    />
                  </div>
                  
                  {currentShareSheet.is_public && currentShareSheet.share_code && (
                    <div className="space-y-2">
                      <Label className="text-xs">Ulashish havolasi</Label>
                      <div className="flex gap-2">
                        <Input
                          readOnly
                          value={`${window.location.origin}/problem-sheet?code=${currentShareSheet.share_code}`}
                          className="text-xs h-10"
                        />
                        <Button variant="outline" size="icon" className="h-10 w-10 shrink-0"
                          onClick={() => copyShareLink(currentShareSheet.share_code!)}>
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>
          
          {/* Generated Sheet Preview */}
          {sheet && (
            <Card className="border-border/40 shadow-sm rounded-2xl animate-fade-in">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span>Generatsiya natijasi</span>
                  </CardTitle>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge variant="outline" className="font-mono text-[10px] bg-orange-50 dark:bg-orange-900/20 text-orange-700 border-orange-200">
                      {sheet.problems.length} misol
                    </Badge>
                    <Badge variant="outline" className="font-mono text-[10px] bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 border-emerald-200">
                      {sheet.settings.digitCount} xona
                    </Badge>
                    <Badge variant="outline" className="font-mono text-[10px] bg-purple-50 dark:bg-purple-900/20 text-purple-700 border-purple-200">
                      {sheet.settings.operationCount} ustun
                    </Badge>
                    <Badge variant="outline" className="font-mono text-[10px] bg-amber-50 dark:bg-amber-900/20 text-amber-700 border-amber-200">
                      {FORMULA_LABELS[sheet.settings.formulaType]?.label || sheet.settings.formulaType}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <ProblemSheetTable
                  problems={sheet.problems}
                  columnsPerRow={columnsPerRow}
                />
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {!sheet && (
            <div className="rounded-2xl bg-card border border-dashed border-border/60 p-10 sm:p-16 text-center animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-7 h-7 text-orange-500" />
              </div>
              <h3 className="font-display font-bold text-base sm:text-lg mb-1">
                Hali misol generatsiya qilinmagan
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto mb-5">
                Yuqoridagi sozlamalarni tanlab "Generatsiya qilish" tugmasini bosing.
                Tayyor varaqni PDF qilib yuklab olish va saqlashingiz mumkin.
              </p>
              <Button
                onClick={generateSheet}
                disabled={isGenerating}
                size="lg"
                className="gap-2 h-11 px-6 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-md shadow-orange-500/25"
              >
                <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                Hoziroq generatsiya qilish
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* CTA banner */}
          {sheet && (
            <section className="rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
                    <BookOpen className="h-6 w-6 text-amber-200" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-lg sm:text-xl mb-1">
                      Varaq tayyor — endi nima qilamiz?
                    </h3>
                    <p className="text-sm text-white/85">
                      PDF qilib yuklab oling, saqlang yoki o'quvchilaringizga ulashing.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 flex-shrink-0">
                  <Button
                    onClick={downloadPDF}
                    className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-white text-orange-600 hover:bg-white/95 text-sm font-bold shadow-sm"
                  >
                    <Download className="h-4 w-4" />
                    PDF
                  </Button>
                  <Button
                    onClick={() => setShowSaveDialog(true)}
                    className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white text-sm font-bold backdrop-blur-sm"
                  >
                    <Save className="h-4 w-4" />
                    Saqlash
                  </Button>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </PageBackground>
  );
};

export default ProblemSheetGenerator;
