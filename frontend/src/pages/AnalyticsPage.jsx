import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar, Legend, CartesianGrid 
} from 'recharts';
import { 
  Link2, Calendar, MousePointer2, Globe, Globe2, 
  Smartphone, Monitor, Tablet, ArrowLeft, Sparkles, 
  Clock, Share2, Copy, ExternalLink, ChevronRight,
  TrendingUp, Search, AlertCircle, Info
} from 'lucide-react';
import { urlService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const COLORS = ['#8b5cf6', '#a855f7', '#d946ef', '#6366f1', '#ec4899'];

const AnalyticsPage = () => {
  const { shortCode: urlShortCode } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [searchCode, setSearchCode] = useState(urlShortCode || '');
  const [analytics, setAnalytics] = useState(null);
  const [insights, setInsights] = useState([]);
  const [userUrls, setUserUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (urlShortCode) {
      fetchAllData(urlShortCode);
    } else if (user) {
      fetchUserUrls();
    }
  }, [urlShortCode, user]);

  const fetchAllData = async (code) => {
    setLoading(true);
    setError('');
    try {
      const [analyticsData, insightsData] = await Promise.all([
        urlService.getAnalytics(code),
        urlService.getInsights(code)
      ]);
      setAnalytics(analyticsData);
      setInsights(insightsData.insights);
    } catch (err) {
      console.error(err);
      setError(err.response?.status === 404 ? 'Magic link not found.' : 'Failed to fetch analytics.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserUrls = async () => {
    setLoading(true);
    try {
      const data = await urlService.getUserUrls();
      setUserUrls(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUrls = useMemo(() => {
    if (!searchCode || urlShortCode) return userUrls;
    const query = searchCode.toLowerCase();
    return userUrls.filter(url => 
      url.shortCode.toLowerCase().includes(query) ||
      (url.customSlug && url.customSlug.toLowerCase().includes(query)) ||
      url.originalUrl.toLowerCase().includes(query)
    );
  }, [userUrls, searchCode, urlShortCode]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchCode) {
      navigate(`/analytics/${searchCode}`);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const Skeleton = ({ className }) => (
    <div className={`bg-slate-800/50 animate-pulse rounded-2xl ${className}`} />
  );

  // --- DETAIL VIEW ---
  if (urlShortCode && (loading || analytics)) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-12">
        {/* Navigation & Header */}
        <div className="pt-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4">
            <button 
              onClick={() => navigate('/analytics')}
              className="group flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-indigo-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Dashboard</span>
            </button>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shadow-inner">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-white tracking-tight">Performance <span className="text-gradient">Insights</span></h1>
                <p className="text-slate-400 font-medium text-sm truncate max-w-md italic mt-1">Analytics for: {urlShortCode}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <button onClick={() => handleCopy(`http://localhost:8080/api/v1/${urlShortCode}`)} className="p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all shadow-xl">
               <Copy className="w-5 h-5" />
             </button>
             <a href={`http://localhost:8080/api/v1/${urlShortCode}`} target="_blank" className="p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all shadow-xl">
               <ExternalLink className="w-5 h-5" />
             </a>
             <button className="btn-premium px-6 py-3 text-[10px] font-black uppercase tracking-widest flex items-center space-x-2">
                <Share2 className="w-4 h-4" />
                <span>Export CSV</span>
             </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
            <Skeleton className="h-96 md:col-span-3" />
            <Skeleton className="h-96" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Top Metrics */}
            <div className="md:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Clicks', value: analytics.totalClicks, icon: MousePointer2, color: 'indigo' },
                { label: 'Peak Traffic', value: analytics.peakHour ? `${analytics.peakHour}:00` : 'N/A', icon: Clock, color: 'purple' },
                { label: 'Top Region', value: analytics.topCountry, icon: Globe, color: 'emerald' },
                { label: 'Top Device', value: analytics.deviceDistribution?.[0]?.name || 'N/A', icon: Smartphone, color: 'rose' }
              ].map((m, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={i} 
                  className="glass-card p-6 border-white/5 hover:border-indigo-500/30 transition-all group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-${m.color}-500/10 text-${m.color}-400 group-hover:scale-110 transition-transform`}>
                      <m.icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Real-time</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-3xl font-black text-white">{m.value}</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{m.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* AI Insights Section */}
            <div className="md:col-span-12">
               <div className="glass-card p-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20">
                  <div className="bg-slate-900/90 backdrop-blur-3xl p-8 rounded-[1.4rem] space-y-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-white">Magic AI Insights</h3>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Automated Performance Summary</p>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <AnimatePresence>
                        {insights.map((insight, idx) => (
                          <motion.div 
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 + idx * 0.1 }}
                            className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all flex items-start space-x-3 group"
                          >
                            <div className="mt-1 w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] group-hover:scale-150 transition-transform" />
                            <p className="text-sm font-medium text-slate-300 leading-relaxed">{insight}</p>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
               </div>
            </div>

            {/* Click Trend Chart */}
            <div className="md:col-span-8 lg:col-span-9 glass-card p-8 min-h-[450px] flex flex-col">
               <div className="flex items-center justify-between mb-8">
                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-white">Click Velocity</h3>
                    <p className="text-xs text-slate-500 font-black uppercase tracking-widest italic">Temporal trend analysis (Last 7 Days)</p>
                  </div>
               </div>
               <div className="flex-grow w-full min-h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analytics.trendData}>
                      <defs>
                        <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                      <XAxis 
                        dataKey="date" 
                        stroke="#475569" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false} 
                        tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      />
                      <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '1rem', color: '#fff' }}
                        itemStyle={{ color: '#818cf8', fontWeight: 'bold' }}
                      />
                      <Area type="monotone" dataKey="clicks" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorClicks)" />
                    </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>

            {/* Device Distribution */}
            <div className="md:col-span-4 lg:col-span-3 glass-card p-8 flex flex-col">
               <div className="space-y-1 mb-8">
                  <h3 className="text-xl font-black text-white">Device Mix</h3>
                  <p className="text-xs text-slate-500 font-black uppercase tracking-widest italic">Platform distribution</p>
               </div>
               <div className="flex-grow w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={analytics.deviceDistribution}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={10}
                        dataKey="value"
                      >
                        {analytics.deviceDistribution?.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '1rem' }}
                        itemStyle={{ color: '#fff' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
               </div>
               <div className="mt-4 space-y-3">
                  {analytics.deviceDistribution?.map((d, i) => (
                    <div key={i} className="flex items-center justify-between text-xs font-black uppercase tracking-widest">
                      <div className="flex items-center space-x-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="text-slate-400">{d.name}</span>
                      </div>
                      <span className="text-white">{d.value} clicks</span>
                    </div>
                  ))}
               </div>
            </div>

            {/* Geos & Referrers */}
            <div className="md:col-span-6 glass-card p-8">
               <div className="flex items-center space-x-3 mb-8">
                  <Globe2 className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-xl font-black text-white">Global Reach</h3>
               </div>
               <div className="space-y-6">
                  {analytics.topCountry === 'N/A' ? (
                    <p className="text-slate-500 font-medium italic">No regional data yet.</p>
                  ) : (
                    <div className="space-y-4">
                       <ResponsiveContainer width="100%" height={200}>
                          <BarChart data={analytics.deviceDistribution?.length ? [{name: analytics.topCountry, value: analytics.totalClicks}] : []}>
                            <XAxis dataKey="name" stroke="#475569" fontSize={10} hide />
                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10' }} />
                            <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                          </BarChart>
                       </ResponsiveContainer>
                       {/* Simplified list check for actual top countries aggregation needed in service? I returning one top country string for now */}
                       <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                          <span className="text-sm font-black text-white uppercase tracking-widest">{analytics.topCountry}</span>
                          <span className="text-emerald-400 font-black">Primary Region</span>
                       </div>
                    </div>
                  )}
               </div>
            </div>

            <div className="md:col-span-6 glass-card p-8">
               <div className="flex items-center space-x-3 mb-8">
                  <Share2 className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-xl font-black text-white">Referral Sources</h3>
               </div>
               <div className="space-y-4">
                  {analytics.referrers?.map((r, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group hover:bg-indigo-500/5 transition-all">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 rounded-full bg-indigo-500" />
                        <span className="text-sm font-medium text-slate-300 truncate max-w-[200px]">{r.name}</span>
                      </div>
                      <span className="text-sm font-black text-white">{r.value} clicks</span>
                    </div>
                  ))}
                  {(!analytics.referrers || analytics.referrers.length === 0) && (
                     <p className="text-slate-500 font-medium italic">No referral data yet.</p>
                  )}
               </div>
            </div>

          </div>
        )}
      </div>
    );
  }

  // --- DASHBOARD VIEW ---
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
      <div className="pt-16 pb-12 space-y-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]"
        >
          <Sparkles className="w-3.5 h-3.5 mr-2" />
          Analytics Hub
        </motion.div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-white tracking-tighter">Magic <span className="text-gradient">Dashboard</span></h1>
            <p className="text-slate-400 font-medium text-lg italic">The command center for your digital influence.</p>
          </div>
          
          <form onSubmit={handleSearch} className="w-full max-w-md group">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center bg-slate-950/50 backdrop-blur-3xl border border-white/10 rounded-3xl p-2 focus-within:border-indigo-500/50 transition-all shadow-2xl">
                <Search className="w-5 h-5 ml-4 text-slate-500" />
                <input
                  type="text"
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  placeholder="Analyze any short code..."
                  className="w-full bg-transparent border-none focus:ring-0 text-white placeholder:text-slate-700 px-4 py-3 font-bold text-sm outline-none"
                />
                <button type="submit" className="btn-premium p-3 rounded-2xl">
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {loading && userUrls.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-64" />)}
        </div>
      ) : userUrls.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredUrls.map((link, idx) => (
              <motion.div
                key={link.shortCode}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-card p-8 border-white/5 hover:border-indigo-500/30 hover:-translate-y-2 transition-all flex flex-col h-full group"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-indigo-500/10 group-hover:text-indigo-400 transition-all shadow-inner">
                    <Link2 className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-2xl font-black text-white">{link.clickCount}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total Clicks</span>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-white line-clamp-1 group-hover:text-indigo-400 transition-colors">
                       {link.customSlug || link.shortCode}
                    </h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">ID: {link.shortCode}</p>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 italic font-medium leading-relaxed">
                    {link.originalUrl}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                   <div className="flex items-center text-slate-500 space-x-2">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {new Date(link.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                   </div>
                   <Link 
                     to={`/analytics/${link.shortCode}`}
                     className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 hover:text-white transition-colors group/link"
                   >
                     <span>Insights</span>
                     <ChevronRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                   </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="glass-card p-24 text-center space-y-8">
           <div className="w-24 h-24 rounded-[2.5rem] bg-indigo-500/10 flex items-center justify-center text-indigo-400 mx-auto shadow-inner">
              <Info className="w-10 h-10" />
           </div>
           <div className="space-y-2">
             <h3 className="text-2xl font-black text-white">No Link Magic Found</h3>
             <p className="text-slate-400 font-medium max-w-sm mx-auto">You haven't created any links yet. Start shortening and tracking your performance now.</p>
           </div>
           <Link to="/" className="btn-premium px-10 py-4 text-xs font-black uppercase tracking-widest inline-flex items-center space-x-2">
              <span>Create Magic Link</span>
              <Sparkles className="w-4 h-4" />
           </Link>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;
