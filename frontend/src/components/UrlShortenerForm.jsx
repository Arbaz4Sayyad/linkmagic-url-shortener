import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { urlService } from '../services/api';
import { Link2, Zap, Copy, ExternalLink, RefreshCw, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const UrlShortenerForm = () => {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    try {
      const data = await urlService.shortenUrl(url);
      setShortUrl(data.shortUrl);
      toast.success("Link shortened successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to shorten URL.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="flex flex-col md:flex-row items-stretch gap-3 p-2 bg-slate-950/50 backdrop-blur-xl border border-white/5 rounded-3xl shadow-2xl transition-all duration-300 focus-within:border-indigo-500/30 focus-within:ring-4 focus-within:ring-indigo-500/10">
          <div className="flex-grow flex items-center pl-4 bg-transparent">
            <Link2 className="w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://your-long-link.com/very-long-path"
              className="w-full bg-transparent border-none focus:ring-0 text-white placeholder:text-slate-600 px-4 py-4 md:py-3 text-lg font-medium outline-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-premium px-8 py-4 md:py-3 flex items-center justify-center space-x-2 min-w-[160px] disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span className="text-sm font-black uppercase tracking-widest">Shorten</span>
                <Zap className="w-4 h-4 fill-current" />
              </>
            )}
          </button>
        </div>
      </form>

      <AnimatePresence>
        {shortUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-8 overflow-hidden"
          >
            <div className="p-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl">
              <div className="bg-slate-900/80 backdrop-blur-2xl p-6 rounded-[1.4rem] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center space-x-4 min-w-0 flex-1">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Your Magic Link</p>
                    <p className="text-xl font-bold text-white truncate selection:bg-indigo-500/40">{shortUrl}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 w-full md:w-auto">
                  <button
                    onClick={handleCopy}
                    className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-6 py-3 rounded-2xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-400 font-bold transition-all active:scale-95"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </button>
                  <a
                    href={shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="md:w-12 md:h-12 flex-1 md:flex-none flex items-center justify-center rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all active:scale-95"
                  >
                    <ExternalLink className="w-5 h-5 md:w-4 md:h-4" />
                    <span className="md:hidden ml-2 font-bold">Open</span>
                  </a>
                </div>
              </div>
            </div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 text-center text-xs font-medium text-slate-500"
            >
              Link successfully optimized for the modern web.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UrlShortenerForm;
