import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import UrlShortenerForm from '../components/UrlShortenerForm';
import { urlService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Zap, BarChart3, Shield, Globe, ArrowRight, Copy, CheckCircle2, Inbox } from 'lucide-react';
import toast from 'react-hot-toast';

import Features from '../components/landing/Features';
import HowItWorks from '../components/landing/HowItWorks';
import Pricing from '../components/landing/Pricing';

const HomePage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('single');
  const [bulkInput, setBulkInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [bulkResults, setBulkResults] = useState(null);

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    if (!bulkInput.trim()) return;

    const urls = bulkInput.split('\n')
      .map(u => u.trim())
      .filter(u => u.length > 0);

    if (urls.length > 50) {
      toast.error("Maximum 50 URLs allowed at once.");
      return;
    }

    const requests = urls.map(url => ({ originalUrl: url }));

    setIsProcessing(true);
    try {
      const response = await urlService.bulkShortenUrls(requests);
      setBulkResults(response.results);
      setBulkInput('');
      toast.success("Bulk processing complete!");
    } catch (err) {
      console.error("Bulk shorten failed:", err);
      toast.error("Failed to process bulk URLs.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyShortUrl = async (shortUrl) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      toast.success("Copied to clipboard!");
    } catch (err) {
      toast.error("Copy failed.");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="relative isolate">
      {/* Background blobs for depth */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] animate-blob" />
        <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-[20%] left-[30%] w-[600px] h-[600px] bg-cyan-600/5 rounded-full blur-[120px] animate-blob animation-delay-4000" />
      </div>

      <div className="pt-16 pb-20">
        {/* HERO SECTION */}
        <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[80vh]">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center space-y-8 mb-16"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-[0.2em] shadow-inner backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 mr-2" />
              Revolutionizing Link Management
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-5xl md:text-8xl font-black heading-premium tracking-tighter text-white max-w-4xl mx-auto leading-none">
              Shorten Your Links <br />
              <span className="text-gradient">With Precision.</span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              The modern link infrastructure for high-growth teams. <br className="hidden md:block" /> Secure, lightning-fast, and packed with deep analytics.
            </motion.p>
          </motion.div>

          {/* Insights Banner for Unauthenticated Users */}
          {!user && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mb-8 w-full max-w-2xl mx-auto"
            >
              <Link
                to="/login"
                className="group relative flex items-center justify-between p-4 rounded-2xl bg-indigo-500/5 backdrop-blur-xl border border-indigo-500/20 hover:border-indigo-500/40 hover:bg-indigo-500/10 transition-all duration-300 shadow-2xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center space-x-4 relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
                      Unlock click analytics, geo tracking & device insights
                    </p>
                    <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">
                      Login for 80% more insights
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-indigo-400 font-black text-xs uppercase tracking-widest relative z-10">
                  <span className="hidden sm:inline">Get Started</span>
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6, type: "spring", bounce: 0.3 }}
            className="w-full max-w-4xl mx-auto"
          >
            {/* Action Card Container */}
            <div className="glass-card p-1 shadow-2xl relative">
              {/* Inner Glow */}
              <div className="absolute inset-0 bg-indigo-500/5 rounded-[1.5rem] pointer-events-none" />

              <div className="bg-slate-900/50 backdrop-blur-2xl rounded-[1.4rem] p-4 md:p-8">
                {/* Form Wrapper */}
                <div className="mb-8 flex justify-center">
                  <div className="p-1 bg-slate-950/50 rounded-2xl border border-white/5 flex items-center space-x-1 shadow-inner">
                    <button
                      onClick={() => setActiveTab('single')}
                      className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'single' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-slate-200'
                        }`}
                    >
                      Single URL
                    </button>
                    <button
                      onClick={() => setActiveTab('bulk')}
                      className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'bulk' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-slate-200'
                        }`}
                    >
                      Bulk Shorten
                    </button>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {activeTab === 'single' ? (
                    <motion.div
                      key="single"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <UrlShortenerForm />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="bulk"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      {!bulkResults ? (
                        <form onSubmit={handleBulkSubmit} className="space-y-6">
                          <div className="relative group">
                            <textarea
                              value={bulkInput}
                              onChange={(e) => setBulkInput(e.target.value)}
                              rows={5}
                              className="w-full bg-slate-950/50 border border-white/10 rounded-2xl p-6 text-white placeholder:text-slate-600 outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all font-mono text-sm resize-none"
                              placeholder="https://example.com/url-1&#10;https://example.com/url-2"
                              required
                            />
                            <div className="absolute bottom-4 right-4 flex items-center space-x-4">
                              <label className="cursor-pointer group flex items-center space-x-2 text-[10px] font-black text-slate-500 hover:text-indigo-400 transition-colors uppercase tracking-widest">
                                <Inbox className="w-3.5 h-3.5" />
                                <span>Upload CSV</span>
                                <input
                                  type="file"
                                  accept=".csv,.txt"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onload = (event) => {
                                        const text = event.target.result;
                                        const parsedUrls = text.split(/[\n,]/)
                                          .map(u => u.trim())
                                          .filter(u => u.startsWith('http'))
                                          .slice(0, 50)
                                          .join('\n');
                                        setBulkInput(parsedUrls);
                                        toast.success("CSV Loaded!");
                                      };
                                      reader.readAsText(file);
                                    }
                                  }}
                                />
                              </label>
                              <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black rounded-full">
                                {bulkInput.split('\n').filter(u => u.trim().length > 0).length} / 50
                              </div>
                            </div>
                          </div>
                          <button
                            type="submit"
                            disabled={isProcessing}
                            className="btn-premium w-full py-4 text-sm uppercase tracking-widest flex items-center justify-center"
                          >
                            {isProcessing ? "Processing..." : "Commence Bulk Shortening"}
                            {!isProcessing && <Zap className="ml-2 w-4 h-4" />}
                          </button>
                        </form>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Results</h3>
                            <button onClick={() => setBulkResults(null)} className="text-xs font-bold text-indigo-400 hover:text-indigo-300">New Batch</button>
                          </div>
                          <div className="max-h-64 overflow-y-auto space-y-2 pr-2 scrollbar-premium">
                            {bulkResults.map((res, i) => (
                              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 group">
                                <div className="min-w-0 flex-1 mr-4">
                                  <p className="text-xs text-slate-500 truncate">{res.originalUrl}</p>
                                  <p className="text-sm font-bold text-white truncate">{res.shortUrl || "Error"}</p>
                                </div>
                                {res.shortUrl && (
                                  <button onClick={() => handleCopyShortUrl(res.shortUrl)} className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 opacity-0 group-hover:opacity-100 transition-all">
                                    <Copy className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Social Trust / Mini Features under Hero */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-500"
            >
              <div className="flex items-center space-x-2 text-white font-bold tracking-tighter text-xl">
                <Globe className="w-5 h-5 text-indigo-500" />
                <span>Global Infrastructure</span>
              </div>
              <div className="flex items-center space-x-2 text-white font-bold tracking-tighter text-xl">
                <Shield className="w-5 h-5 text-purple-500" />
                <span>Enterprise Security</span>
              </div>
              <div className="flex items-center space-x-2 text-white font-bold tracking-tighter text-xl">
                <BarChart3 className="w-5 h-5 text-pink-500" />
                <span>Real-time Insights</span>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Core Content */}
        <div className="space-y-40">
          <Features />
          <HowItWorks />
          <Pricing />
        </div>

        {/* FINAL CTA SECTION */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-indigo-600/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
          <div className="max-w-4xl mx-auto px-4 relative z-10 text-center space-y-10">
            <h2 className="text-4xl md:text-6xl font-black text-white heading-premium">
              Build better <br /> <span className="text-gradient">connections today.</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-xl mx-auto font-medium">
              Join the data-driven pioneers choosing LinkMagic for their link management infrastructure. No limits, just performance.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to={user ? "/analytics" : "/register"}
                className="btn-premium px-10 py-4 text-sm uppercase tracking-widest flex items-center"
              >
                {user ? "Enter Dashboard" : "Start For Free"}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              {!user && (
                <Link to="/login" className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold text-white hover:bg-white/10 transition-all">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
