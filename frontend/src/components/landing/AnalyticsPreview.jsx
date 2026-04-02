import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { MousePointerClick, Globe, Activity } from 'lucide-react';

const mockData = [
  { day: 'Mon', clicks: 120 },
  { day: 'Tue', clicks: 250 },
  { day: 'Wed', clicks: 180 },
  { day: 'Thu', clicks: 390 },
  { day: 'Fri', clicks: 310 },
  { day: 'Sat', clicks: 500 },
  { day: 'Sun', clicks: 650 },
];

const AnalyticsPreview = () => {
  return (
    <section id="analytics" className="py-24 relative overflow-hidden bg-gray-50 dark:bg-[#0B0F19]">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/10 dark:to-purple-900/10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight"
          >
            Insights that drive <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">growth</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Stop guessing. Know exactly who is clicking your links with real-time analytics, location data, and device tracking.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: "spring" }}
          className="glass-card shadow-2xl rounded-[3rem] p-4 md:p-8 bg-white/80 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800"
        >
          {/* Mock Dashboard Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-gray-100 dark:border-gray-800 space-y-4 md:space-y-0">
            <div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">Live Dashboard</h3>
              <p className="text-sm text-gray-400">Campaign: Spring Launch 2026</p>
            </div>
            <div className="flex gap-4">
              <span className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold rounded-xl text-sm border border-indigo-100 dark:border-indigo-800">
                Last 7 Days
              </span>
              <span className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-bold rounded-xl text-sm border border-emerald-100 dark:border-emerald-800 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Active</span>
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* KPI Cards */}
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-gray-50 dark:bg-[#0B0F19] border border-gray-100 dark:border-gray-800 shadow-inner group hover:border-indigo-500/50 transition-colors">
                <div className="flex justify-between items-center mb-4">
                  <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                    <MousePointerClick className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-emerald-500">+24%</span>
                </div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total Clicks</p>
                <h4 className="text-4xl font-black text-gray-900 dark:text-white">2,400</h4>
              </div>

              <div className="p-6 rounded-3xl bg-gray-50 dark:bg-[#0B0F19] border border-gray-100 dark:border-gray-800 shadow-inner group hover:border-purple-500/50 transition-colors">
                <div className="flex justify-between items-center mb-4">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/40 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                    <Globe className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-emerald-500">+12%</span>
                </div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Top Region</p>
                <h4 className="text-2xl font-black text-gray-900 dark:text-white">United States</h4>
              </div>

              <div className="p-6 rounded-3xl bg-gray-50 dark:bg-[#0B0F19] border border-gray-100 dark:border-gray-800 shadow-inner group hover:border-pink-500/50 transition-colors">
                <div className="flex justify-between items-center mb-4">
                  <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/40 rounded-xl flex items-center justify-center text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform">
                    <Activity className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-gray-400">-</span>
                </div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
                <h4 className="text-2xl font-black text-emerald-500">Routing OK</h4>
              </div>
            </div>

            {/* Main Chart */}
            <div className="md:col-span-2 p-6 rounded-3xl bg-gray-50 dark:bg-[#0B0F19] border border-gray-100 dark:border-gray-800 shadow-inner relative group">
              <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Traffic Overview</h4>
              <div className="w-full h-64 -ml-4 transition-all duration-300 group-hover:opacity-100">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorMock" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      cursor={{ stroke: 'rgba(99, 102, 241, 0.4)', strokeWidth: 2, strokeDasharray: '4 4' }}
                      contentStyle={{ borderRadius: '1rem', border: 'none', backgroundColor: 'rgba(15, 23, 42, 0.9)', color: '#fff', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)' }}
                      itemStyle={{ color: '#c4b5fd', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="clicks" stroke="#A855F7" strokeWidth={4} fill="url(#colorMock)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AnalyticsPreview;
