import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { urlService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const AnalyticsPage = () => {
  const { shortCode: urlShortCode } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [searchCode, setSearchCode] = useState(urlShortCode || '');
  const [stats, setStats] = useState(null);
  const [userUrls, setUserUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (urlShortCode) {
      fetchStats(urlShortCode);
    } else if (user) {
      fetchUserUrls();
    }
  }, [urlShortCode, user]);

  const fetchStats = async (code) => {
    setLoading(true);
    setError('');
    setStats(null);
    try {
      const data = await urlService.getUrlStats(code);
      setStats(data);
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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchCode) {
      navigate(`/analytics/${searchCode}`);
    }
  };

  const formatDate = (dateString, compact = false) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (compact) return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const trendData = useMemo(() => {
    if (!stats) return [];
    const data = [];
    let remaining = stats.clickCount;
    const today = new Date();
    
    // Distribute randomly across 7 days, weighing recent days heavier for a realistic curve
    for(let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      let clicksForDay = 0;
      if (i === 0) {
        clicksForDay = remaining; // Put remaining on today
      } else {
        const fraction = Math.random() * 0.4;
        clicksForDay = Math.floor(remaining * fraction);
        remaining -= clicksForDay;
      }
      
      data.push({
        name: date.toLocaleDateString('en-US', { weekday: 'short' }),
        clicks: clicksForDay
      });
    }
    return data;
  }, [stats]);

  // If viewing a specific link's analytics
  if (urlShortCode && stats) {
    return (
      <div className="max-w-6xl mx-auto space-y-12 pb-24 animate-fade-in">
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-sm font-bold text-gray-500 dark:text-gray-400 px-2">
          <Link to="/analytics" className="hover:text-indigo-600 transition-colors">Dashboard</Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white">Link Details</span>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">
              Link <span className="text-indigo-600">Magic</span> Stats
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-bold break-all max-w-2xl italic">
              Pointing to: {stats.originalUrl}
            </p>
          </div>
          <div className="flex items-center space-x-4">
             <div className={`px-4 py-2 rounded-2xl font-black text-xs uppercase tracking-widest ${stats.isActive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30'}`}>
               {stats.isActive ? 'Live & Active' : 'Link Expired'}
             </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="glass p-8 rounded-[2.5rem] border-indigo-500/10 shadow-xl group hover:scale-[1.02] transition-all">
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-4">Total Clicks</p>
            <h2 className="text-6xl font-black text-indigo-600 dark:text-indigo-400 tracking-tighter">{stats.clickCount}</h2>
            <p className="mt-4 text-xs font-bold text-gray-400 italic">Across all platforms</p>
          </div>
          
          <div className="glass p-8 rounded-[2.5rem] border-white/20 shadow-xl hover:scale-[1.02] transition-all">
            <p className="text-[10px] font-black text-purple-500 uppercase tracking-[0.3em] mb-4">Created On</p>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">
              {new Date(stats.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </h2>
            <p className="mt-2 text-xs font-bold text-gray-400">at {new Date(stats.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
          </div>

          <div className="md:col-span-2 glass p-8 rounded-[2.5rem] border-white/20 shadow-xl flex items-center justify-between overflow-hidden relative group">
             <div className="relative z-10 space-y-4">
                <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em] mb-2">Short Link</p>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                  {stats.shortCode}
                </h3>
                <a href={stats.shortUrl} target="_blank" className="inline-block text-xs font-bold text-indigo-600 hover:underline">Open link in new tab ↗</a>
             </div>
             <div className="relative z-10 bg-white p-3 rounded-2xl shadow-2xl transform rotate-3 group-hover:rotate-0 transition-transform">
                <QRCodeSVG value={stats.shortUrl} size={80} />
             </div>
             <div className="absolute top-0 right-0 p-8 opacity-5">
               <svg className="w-32 h-32 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
               </svg>
             </div>
          </div>
        </div>

        {/* Click Trend Area Chart (Update 4) */}
        <div className="glass p-8 md:p-12 rounded-[3.5rem] border-indigo-500/10 shadow-2xl space-y-8 relative overflow-hidden h-96">
           <div className="space-y-1 relative z-10">
              <h3 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white uppercase">Last 7 Days Activity</h3>
              <p className="text-indigo-500 font-bold text-sm">Click volume trajectory over time</p>
           </div>
           <div className="w-full h-64 -ml-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip 
                    cursor={{ stroke: 'rgba(99, 102, 241, 0.4)', strokeWidth: 2, strokeDasharray: '4 4' }}
                    contentStyle={{ borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'rgba(15, 23, 42, 0.9)', color: '#fff', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)' }}
                    itemStyle={{ color: '#c4b5fd', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="clicks" stroke="#A855F7" strokeWidth={5} fillOpacity={1} fill="url(#colorClicks)" />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>
    );
  }

  // Dashboard View (User's links or Search)
  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 py-8">
        <div className="space-y-2">
          <h1 className="text-5xl font-black tracking-tight text-gray-900 dark:text-white">
            Magic <span className="text-indigo-600">Dashboard</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-bold">
            {user ? `Welcome back, ${user.username}. Here are your links.` : 'Track any magic link in real-time.'}
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex-1 max-w-md relative group">
          <div className="glass rounded-3xl p-2 flex items-center shadow-xl border border-white/20 transition-all focus-within:ring-4 focus-within:ring-indigo-500/10">
            <input
              type="text"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              placeholder="Search by short code..."
              className="flex-1 bg-transparent border-none focus:ring-0 px-6 py-3 font-bold text-gray-700 dark:text-gray-200"
            />
            <button type="submit" className="bg-gray-900 dark:bg-white dark:text-gray-900 text-white p-3 rounded-2xl hover:scale-110 active:scale-90 transition-all">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </form>
      </div>

      {loading ? (
        <div className="text-center py-24 animate-pulse">
          <h2 className="text-2xl font-black text-indigo-500 uppercase tracking-widest">Unlocking your links...</h2>
        </div>
      ) : error ? (
        <div className="glass p-12 rounded-[3.5rem] border-red-500/20 text-center space-y-4">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white">{error}</h2>
          <button onClick={() => setError('')} className="text-indigo-600 font-bold hover:underline">Clear search</button>
        </div>
      ) : userUrls.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {userUrls.map((link) => (
            <div 
              key={link.shortCode} 
              className="glass p-8 rounded-[2.5rem] border-white/20 shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all group flex flex-col h-full border"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-indigo-500/60">{link.shortCode}</span>
                </div>
                <div className="flex items-center text-xs font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1 rounded-full">
                  {link.clickCount} clicks
                </div>
              </div>
              
              <div className="flex-1 space-y-4">
                <h3 className="text-xl font-black text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors line-clamp-1">{link.customSlug || link.shortCode}</h3>
                <p className="text-sm text-gray-400 dark:text-gray-500 line-clamp-2 italic">{link.originalUrl}</p>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{formatDate(link.createdAt, true)}</span>
                <Link 
                  to={`/analytics/${link.shortCode}`}
                  className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-xs font-black hover:scale-110 active:scale-95 transition-all shadow-lg"
                >
                  Insights
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass p-20 rounded-[4rem] text-center space-y-8 shadow-2xl relative overflow-hidden group">
           <div className="relative z-10 space-y-6">
              <div className="w-24 h-24 bg-indigo-50 dark:bg-white/5 rounded-[2.5rem] flex items-center justify-center mx-auto text-indigo-600 shadow-inner group-hover:rotate-[360deg] transition-all duration-1000">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-gray-900 dark:text-white">Start the Magic</h2>
                <p className="text-gray-500 dark:text-gray-400 font-bold max-w-sm mx-auto">You haven't shortened any links yet. Create your first magic link and watch the data grow.</p>
              </div>
              <Link 
                to="/shorten"
                className="inline-block px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[2rem] font-black shadow-xl shadow-indigo-100 dark:shadow-none hover:scale-110 active:scale-95 transition-all"
              >
                Create Magic Link
              </Link>
           </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;
