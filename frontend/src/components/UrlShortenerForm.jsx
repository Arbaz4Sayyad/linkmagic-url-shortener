import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { urlService } from '../services/api';
import { Link2, Zap, Copy, ExternalLink, RefreshCw, CheckCircle2, Settings2, Calendar, Fingerprint, Download, Share2, ChevronDown } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import toast from 'react-hot-toast';

const UrlShortenerForm = () => {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customSlug, setCustomSlug] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const qrRef = useRef(null);

  const validateAlias = (alias) => {
    if (!alias) return true;
    return /^[a-zA-Z0-9-_]+$/.test(alias);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return;

    if (customSlug && !validateAlias(customSlug)) {
      toast.error("Invalid custom alias. Use only letters, numbers, hyphens, and underscores.");
      return;
    }

    setLoading(true);
    try {
      // Corrected API payload and method name
      const data = await urlService.createShortUrl(url, expiryDate || null, customSlug || null);
      setShortUrl(data.shortUrl);
      toast.success("Magic link created!");
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

  const handleDownloadQR = () => {
    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `qr-${customSlug || 'shortlink'}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    toast.success("QR Code downloaded!");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'LinkMagic Short Link',
          text: 'Check out this short link!',
          url: shortUrl,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative group">
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
        </div>

        {/* Advanced Options Toggle */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center space-x-2 px-6 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-400 transition-all group"
          >
            <Settings2 className={`w-3.5 h-3.5 transition-transform duration-500 ${showAdvanced ? 'rotate-90 text-indigo-400' : ''}`} />
            <span>{showAdvanced ? "Hide Advanced Options" : "Show Advanced Options"}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${showAdvanced ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Collapsible Advanced Section */}
        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-6 rounded-3xl bg-slate-950/30 border border-white/5 grid md:grid-cols-2 gap-6 mt-2">
                <div className="space-y-3">
                  <label className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <Fingerprint className="w-3.5 h-3.5" />
                    <span>Custom Alias</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={customSlug}
                      onChange={(e) => setCustomSlug(e.target.value)}
                      placeholder="my-custom-path"
                      className={`w-full bg-slate-900/50 border ${customSlug && !validateAlias(customSlug) ? 'border-red-500/50' : 'border-white/10'} rounded-2xl p-4 text-white placeholder:text-slate-700 outline-none focus:border-indigo-500/30 transition-all font-mono text-sm`}
                    />
                    {customSlug && (
                      <p className="mt-2 text-[10px] font-medium text-slate-500 truncate">
                        Preview: <span className="text-indigo-400">linkmg.com/{customSlug}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Expiry Date (Optional)</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-2xl p-4 text-white placeholder:text-slate-700 outline-none focus:border-indigo-500/30 transition-all font-mono text-sm"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      <AnimatePresence>
        {shortUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mt-12 group/success"
          >
            <div className="p-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[2.5rem] shadow-2xl shadow-indigo-500/20">
              <div className="bg-slate-900/95 backdrop-blur-3xl p-8 rounded-[2.4rem] flex flex-col md:flex-row items-center gap-8">
                {/* QR Code Section */}
                <div className="shrink-0 space-y-4 text-center">
                  <div 
                    ref={qrRef}
                    className="p-4 bg-white rounded-3xl shadow-inner transform -rotate-2 group-hover/success:rotate-0 transition-transform duration-500"
                  >
                    <QRCodeSVG value={shortUrl} size={140} level="H" includeMargin={false} />
                  </div>
                  <button
                    onClick={handleDownloadQR}
                    className="inline-flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-white transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>SVG Asset</span>
                  </button>
                </div>

                {/* Info & Actions */}
                <div className="flex-grow min-w-0 flex flex-col justify-between self-stretch py-2">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Optimization Success</p>
                        <h4 className="text-2xl font-black text-white truncate break-all selection:bg-indigo-500/40">{shortUrl}</h4>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3 mt-8 md:mt-0">
                    <button
                      onClick={handleCopy}
                      className="flex-1 md:flex-none flex items-center justify-center space-x-3 px-8 py-4 rounded-2xl bg-indigo-600 text-white font-black text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </button>
                    <button
                      onClick={handleShare}
                      className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all active:scale-95"
                      title="Share link"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                    <a
                      href={shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all active:scale-95"
                      title="Open in new tab"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 text-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-600"
            >
              Enterprise-grade link protection enabled
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UrlShortenerForm;
