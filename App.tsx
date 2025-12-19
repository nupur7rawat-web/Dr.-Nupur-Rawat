
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { INGREDIENT_DATABASE } from './constants';
import { RiskLevel, AnalysisResult, IngredientInfo, FilterType } from './types';
import { analyzeIngredientsWithAI, extractIngredientsFromImage } from './services/geminiService';
import IngredientCard from './components/IngredientCard';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<FilterType[]>([]);
  const [view, setView] = useState<'home' | 'wiki'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [wikiCategory, setWikiCategory] = useState<string>('All');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert("Installation is automatic on Android. If you are on iOS, tap 'Share' then 'Add to Home Screen'.");
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setDeferredPrompt(null);
  };

  const categories = useMemo(() => {
    const cats = new Set(Object.values(INGREDIENT_DATABASE).map(i => i.category));
    return ['All', ...Array.from(cats)].sort();
  }, []);

  const toggleFilter = (filter: FilterType) => {
    setActiveFilters(prev => 
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result?.toString().split(',')[1];
        if (base64) {
          const extractedText = await extractIngredientsFromImage(base64, file.type);
          setInputText(extractedText);
          const aiResult = await analyzeIngredientsWithAI(extractedText);
          setResults(aiResult);
          setIsAnalyzing(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError("Label scanning failed. Please try again with a clear photo.");
      setIsAnalyzing(false);
    }
  };

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const aiResult = await analyzeIngredientsWithAI(inputText);
      setResults(aiResult);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError("Analysis timeout. Please check your internet connection.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const filteredWiki = useMemo(() => {
    return Object.values(INGREDIENT_DATABASE).filter(ing => {
      const matchesSearch = ing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            ing.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = wikiCategory === 'All' || ing.category === wikiCategory;
      return matchesSearch && matchesCat;
    });
  }, [searchQuery, wikiCategory]);

  const filteredIngredients = results?.ingredients.filter(ing => {
    if (activeFilters.length === 0) return true;
    let matches = true;
    if (activeFilters.includes('pregnancy') && ing.pregnancySafe === 'AVOID') matches = false;
    if (activeFilters.includes('acne') && !ing.tags.some(t => /acne|pore|clog/i.test(t))) matches = false;
    if (activeFilters.includes('pcos') && !ing.tags.some(t => /endocrine|hormone|pcos/i.test(t))) matches = false;
    if (activeFilters.includes('sensitive') && ing.riskLevel === RiskLevel.HIGH) matches = false;
    return matches;
  }) || [];

  return (
    <div className="min-h-screen pb-32">
      {/* Premium Header */}
      <nav className="sticky top-0 z-50 glass border-b border-white/40 px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <button onClick={() => { setView('home'); setResults(null); }} className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-200/50 transition-all active:scale-95">
              <i className="fas fa-microscope text-2xl"></i>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-slate-900 leading-none">PureCheck</h1>
              <div className="flex items-center gap-1">
                <span className="text-[10px] uppercase tracking-[0.2em] font-black text-emerald-600">Official Mobile App</span>
                <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse"></div>
              </div>
            </div>
          </button>
          
          <div className="hidden md:flex gap-8 items-center">
            <button onClick={() => { setView('home'); setResults(null); }} className={`text-sm font-black uppercase tracking-widest transition-all ${view === 'home' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}>Scan</button>
            <button onClick={() => setView('wiki')} className={`text-sm font-black uppercase tracking-widest transition-all ${view === 'wiki' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}>Wiki</button>
            <button onClick={handleInstallClick} className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg active:scale-95">
              <i className="fab fa-google-play mr-2"></i> Get App
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 pt-12">
        {view === 'wiki' ? (
          <section className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <header className="mb-10">
              <h2 className="text-4xl font-black text-slate-900 mb-2">Scientific Wiki</h2>
              <p className="text-slate-500 font-medium">Explore toxicology data for 200+ cosmetic chemicals.</p>
            </header>

            <div className="flex flex-col md:flex-row gap-4 mb-10">
              <div className="flex-[2] relative group">
                <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500"></i>
                <input 
                  type="text"
                  placeholder="Search ingredient or risk..."
                  className="w-full pl-14 pr-6 py-5 rounded-3xl bg-white border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <select 
                  className="w-full h-full px-6 py-5 rounded-3xl bg-white border border-slate-200 focus:border-emerald-500 outline-none font-bold text-slate-600"
                  value={wikiCategory}
                  onChange={(e) => setWikiCategory(e.target.value)}
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWiki.map(ing => (
                <div className="card-reveal" key={ing.name}>
                   <IngredientCard ingredient={ing} />
                </div>
              ))}
            </div>
          </section>
        ) : (
          <>
            {!results ? (
              <section className="animate-in fade-in duration-1000">
                {/* Hero Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
                  <div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                      <i className="fas fa-check-circle"></i> Google Play Optimized
                    </div>
                    <h2 className="text-7xl font-black text-slate-900 mb-8 leading-[1.0] tracking-tight">
                      Toxic? <br/><span className="text-gradient">Scan it.</span>
                    </h2>
                    <p className="text-slate-500 text-xl font-medium leading-relaxed mb-10 max-w-lg">
                      PureCheck brings high-fidelity ingredient analysis to your pocket. Identify endocrine disruptors and irritants in a single snap.
                    </p>
                    
                    <div className="flex flex-wrap gap-4 mb-12">
                       <button onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })} className="px-10 py-6 bg-slate-900 text-white rounded-[24px] font-black shadow-2xl hover:bg-slate-800 transition-all flex items-center gap-4 active:scale-95 text-lg">
                          Analyze Now <i className="fas fa-bolt text-emerald-400"></i>
                       </button>
                       <button onClick={handleInstallClick} className="px-8 py-6 bg-white text-slate-900 rounded-[24px] border-2 border-slate-100 font-black hover:bg-slate-50 transition-all flex items-center gap-3 active:scale-95">
                          <i className="fab fa-google-play text-emerald-600"></i> Install Mobile App
                       </button>
                    </div>

                    <div className="flex items-center gap-8">
                       <div>
                          <p className="text-2xl font-black text-slate-800">200+</p>
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Chemical Database</p>
                       </div>
                       <div className="w-px h-8 bg-slate-200"></div>
                       <div>
                          <p className="text-2xl font-black text-slate-800">4.9/5</p>
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">User Satisfaction</p>
                       </div>
                    </div>
                  </div>
                  
                  <div className="relative group">
                    <div className="absolute -top-16 -left-16 w-64 h-64 bg-emerald-400/20 rounded-full blur-[100px] animate-pulse"></div>
                    <div className="relative z-10 bg-white p-6 rounded-[50px] shadow-3xl border border-slate-100 transform rotate-2 group-hover:rotate-0 transition-transform duration-700 overflow-hidden">
                       <img src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=1200&auto=format&fit=crop" className="w-full aspect-[4/5] object-cover rounded-[40px] mb-6 shadow-inner" alt="Pure Health" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-10 text-white">
                          <span className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">Live Analysis Preview</span>
                          <h4 className="text-2xl font-black">Zero Toxic Preservatives</h4>
                       </div>
                    </div>
                  </div>
                </div>

                {/* Android / iOS Download Section */}
                <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[60px] p-12 lg:p-20 mb-32 text-center text-white relative overflow-hidden">
                   <div className="absolute inset-0 opacity-10 pointer-events-none">
                      <div className="h-full w-full bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:32px_32px]"></div>
                   </div>
                   <div className="relative z-10">
                      <h3 className="text-5xl font-black mb-6">Available Everywhere</h3>
                      <p className="text-emerald-400/80 font-bold mb-12 max-w-xl mx-auto text-lg leading-relaxed">
                        PureCheck is a Progressive Web App (PWA) that installs directly from your browser. Get the Google Play experience instantly.
                      </p>
                      
                      <div className="flex flex-col md:flex-row justify-center items-center gap-8">
                         <div className="flex flex-col items-center gap-4">
                            <div className="w-48 h-16 bg-black border border-white/20 rounded-2xl flex items-center px-4 gap-4 cursor-pointer hover:border-emerald-500 transition-all active:scale-95 group" onClick={handleInstallClick}>
                               <i className="fab fa-google-play text-3xl"></i>
                               <div className="text-left">
                                  <p className="text-[8px] uppercase tracking-widest opacity-60">Get it on</p>
                                  <p className="text-xl font-bold leading-none">Google Play</p>
                               </div>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Android 10+ Optimized</span>
                         </div>

                         <div className="flex flex-col items-center gap-4">
                            <div className="w-48 h-16 bg-black border border-white/20 rounded-2xl flex items-center px-4 gap-4 cursor-pointer hover:border-emerald-500 transition-all active:scale-95 group" onClick={handleInstallClick}>
                               <i className="fab fa-apple text-3xl"></i>
                               <div className="text-left">
                                  <p className="text-[8px] uppercase tracking-widest opacity-60">Download on the</p>
                                  <p className="text-xl font-bold leading-none">App Store</p>
                               </div>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">iOS 14+ Ready</span>
                         </div>
                      </div>
                   </div>
                </section>

                {/* Clinical Scan Section */}
                <section id="scan-portal" className="bg-white rounded-[60px] shadow-3xl p-12 lg:p-20 mb-32 border border-slate-50">
                  <div className="text-center mb-16">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center text-2xl mx-auto mb-6">
                       <i className="fas fa-qrcode"></i>
                    </div>
                    <h3 className="text-4xl font-black text-slate-900 mb-4">Start Analysis</h3>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">AI-Powered Toxicological Reporting</p>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
                    <div className="flex flex-col gap-6">
                      <div className="bg-slate-50 rounded-[40px] p-8 border border-slate-100 focus-within:ring-4 focus-within:ring-emerald-50 transition-all">
                         <div className="flex justify-between items-center mb-6">
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Manual Entry</span>
                            <button onClick={() => setInputText('')} className="text-emerald-600 font-black text-[10px] uppercase hover:underline">Clear</button>
                         </div>
                         <textarea
                           className="w-full h-72 bg-transparent text-slate-800 text-xl font-medium outline-none resize-none placeholder-slate-300 leading-relaxed"
                           placeholder="Paste ingredient list here..."
                           value={inputText}
                           onChange={(e) => setInputText(e.target.value)}
                         />
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-8">
                       <div className="flex-1 bg-emerald-600 hover:bg-emerald-700 rounded-[40px] p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all active:scale-95 shadow-xl shadow-emerald-500/20 group" onClick={() => fileInputRef.current?.click()}>
                          <div className="w-24 h-24 bg-white/20 rounded-[32px] flex items-center justify-center text-4xl text-white mb-6 group-hover:scale-110 transition-transform">
                             <i className="fas fa-camera"></i>
                          </div>
                          <h4 className="text-3xl font-black text-white mb-3">Snap Label</h4>
                          <p className="text-white/70 font-bold max-w-xs">Extract ingredients from any product photo instantly.</p>
                          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                       </div>
                       
                       <button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing || !inputText.trim()}
                        className={`w-full py-8 rounded-[40px] font-black text-3xl flex items-center justify-center gap-6 transition-all shadow-2xl relative overflow-hidden ${
                          isAnalyzing || !inputText.trim()
                            ? 'bg-slate-100 text-slate-300'
                            : 'bg-slate-900 text-white hover:bg-emerald-600 active:scale-95'
                        }`}
                      >
                        {isAnalyzing ? (
                          <>
                            <div className="scanning-beam"></div>
                            <i className="fas fa-spinner fa-spin"></i> Analyzing...
                          </>
                        ) : (
                          <><i className="fas fa-flask text-emerald-400"></i> Run Deep Scan</>
                        )}
                      </button>
                    </div>
                  </div>
                </section>
              </section>
            ) : (
              <section className="animate-in fade-in duration-700">
                {/* Result Hero */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
                   <div className="lg:col-span-8 bg-white p-10 rounded-[50px] shadow-2xl border border-slate-50 relative overflow-hidden">
                      <div className="flex items-center gap-10 mb-10">
                        <div className={`w-32 h-32 rounded-[40px] flex flex-col items-center justify-center font-black shadow-2xl animate-pulse ${
                          (results.overallScore as number) > 75 ? 'bg-emerald-500 text-white shadow-emerald-200' :
                          (results.overallScore as number) > 50 ? 'bg-amber-500 text-white shadow-amber-200' :
                          'bg-rose-500 text-white shadow-rose-200'
                        }`}>
                          <span className="text-5xl">{results.overallScore}</span>
                          <span className="text-[10px] uppercase tracking-widest opacity-70">Health Score</span>
                        </div>
                        <div>
                          <h3 className="text-4xl font-black text-slate-900 mb-2 leading-tight tracking-tighter">Analysis Complete</h3>
                          <div className="flex flex-wrap gap-3">
                             <span className="text-[10px] font-black px-4 py-2 bg-slate-900 text-white rounded-full uppercase tracking-widest flex items-center gap-2">
                                <i className="fas fa-shield-check text-emerald-400"></i> Certified Data
                             </span>
                             <span className="text-[10px] font-black px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full uppercase tracking-widest">AI Intelligence</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-slate-50 p-8 rounded-[32px] border-l-[12px] border-emerald-500 text-xl italic text-slate-800 leading-relaxed font-semibold shadow-inner">
                        "{results.summary}"
                      </div>
                   </div>

                   <div className="lg:col-span-4 bg-slate-900 text-white p-10 rounded-[50px] shadow-3xl flex flex-col justify-center relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-10 text-8xl">
                         <i className="fas fa-dna"></i>
                      </div>
                      <h4 className="text-xl font-black mb-10 flex items-center gap-4">
                         <i className="fas fa-microchip text-emerald-400"></i> Impact Profiling
                      </h4>
                      <div className="space-y-10">
                        {Object.entries(results.concerns).map(([key, val]) => (
                          <div key={key} className="group cursor-default">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] mb-3 opacity-60 group-hover:opacity-100 transition-opacity">
                              <span className="flex items-center gap-2">
                                {/* Fix: Added explicit cast to 'number' for the comparison operator */}
                                <div className={`w-2 h-2 rounded-full ${(val as number) > 50 ? 'bg-rose-500' : 'bg-emerald-400'}`}></div>
                                {key} System
                              </span>
                              <span>{val as number}%</span>
                            </div>
                            <div className="h-3 bg-white/10 rounded-full overflow-hidden p-[1px]">
                              {/* Fix: Added explicit cast to 'number' for the comparison operator and width style */}
                              <div className={`h-full rounded-full transition-all duration-1000 ${(val as number) > 60 ? 'bg-rose-500 shadow-[0_0_15px_#f43f5e]' : 'bg-emerald-400 shadow-[0_0_15px_#34d399]'}`} style={{ width: `${val as number}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                   </div>
                </div>

                {/* Filter & Results */}
                <div className="space-y-8">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <h4 className="text-2xl font-black text-slate-900 flex items-center gap-4">
                       <i className="fas fa-vial-circle-check text-emerald-500"></i> Detected Chemicals
                    </h4>
                    <div className="flex gap-2 overflow-x-auto no-scrollbar max-w-full pb-2">
                       {[
                         {id: 'pregnancy', icon: 'fa-baby'},
                         {id: 'pcos', icon: 'fa-venus-double'},
                         {id: 'acne', icon: 'fa-face-rolling-eyes'}
                       ].map(f => (
                         <button key={f.id} onClick={() => toggleFilter(f.id as FilterType)} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${activeFilters.includes(f.id as FilterType) ? 'bg-emerald-600 text-white shadow-xl' : 'bg-white border border-slate-200 text-slate-400 hover:border-emerald-300 hover:text-emerald-600'}`}>
                           <i className={`fas ${f.icon}`}></i> {f.id}
                         </button>
                       ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {filteredIngredients.map((ing, idx) => (
                      <div key={idx} className="card-reveal" style={{animationDelay: `${idx * 0.1}s`}}>
                        <IngredientCard ingredient={ing} />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-24 text-center">
                   <button onClick={() => setResults(null)} className="px-14 py-7 bg-slate-900 text-white font-black text-2xl rounded-full hover:bg-emerald-600 transition-all shadow-3xl active:scale-95">
                      New Analysis
                   </button>
                </div>
              </section>
            )}
          </>
        )}
      </main>

      {/* Persistent Mobile Tab Bar */}
      <div className="md:hidden fixed bottom-10 left-1/2 -translate-x-1/2 w-[calc(100%-4rem)] max-w-sm z-50">
         <div className="bg-slate-900/95 backdrop-blur-3xl rounded-[32px] p-2 flex justify-between items-center shadow-3xl border border-white/10 ring-1 ring-white/5">
            <button onClick={() => { setView('home'); setResults(null); }} className={`flex-1 py-4 font-black flex flex-col items-center gap-1 transition-all ${view === 'home' ? 'text-emerald-400' : 'text-slate-500'}`}>
              <i className="fas fa-home text-lg"></i>
              <span className="text-[8px] uppercase tracking-widest">Scanner</span>
            </button>
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-[24px] flex items-center justify-center shadow-xl -mt-12 border-4 border-slate-900 active:scale-90 transition-transform" onClick={() => { setView('home'); fileInputRef.current?.click(); }}>
               <i className="fas fa-camera text-2xl"></i>
            </div>
            <button onClick={() => setView('wiki')} className={`flex-1 py-4 font-black flex flex-col items-center gap-1 transition-all ${view === 'wiki' ? 'text-emerald-400' : 'text-slate-500'}`}>
              <i className="fas fa-book-open text-lg"></i>
              <span className="text-[8px] uppercase tracking-widest">Wiki</span>
            </button>
         </div>
      </div>

      {error && (
        <div className="fixed bottom-32 left-6 right-6 md:left-auto md:w-96 bg-rose-600 text-white p-6 rounded-[32px] shadow-3xl flex items-center gap-5 z-[100] animate-bounce border-2 border-white/20">
           <i className="fas fa-triangle-exclamation text-2xl"></i>
           <p className="font-extrabold text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default App;
