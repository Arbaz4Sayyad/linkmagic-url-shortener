import React from 'react';
import { motion } from 'framer-motion';

// Bulletproof SVG Icons for the 4-step premium process
const PasteIcon = () => (
  <svg className="w-7 h-7 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

const ShortenIcon = () => (
  <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const ShareIcon = () => (
  <svg className="w-7 h-7 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
  </svg>
);

const AnalyticsIcon = () => (
  <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2zm10-10V7a2 2 0 00-2-2h-2a2 2 0 00-2 2v12a2 2 0 002 2h2a2 2 0 002-2v-10z" />
  </svg>
);

const steps = [
  {
    id: "01",
    icon: <PasteIcon />,
    title: "Paste Your URL",
    description: "Enter your long URL into our ultra-secure input field instantly.",
    color: "indigo"
  },
  {
    id: "02",
    icon: <ShortenIcon />,
    title: "Click Shorten",
    description: "Our edge network generates a unique short link in milliseconds.",
    color: "purple"
  },
  {
    id: "03",
    icon: <ShareIcon />,
    title: "Copy & Share",
    description: "One-click copy and distribute your magical link across the web.",
    color: "pink"
  },
  {
    id: "04",
    icon: <AnalyticsIcon />,
    title: "Track Performance",
    description: "Monitor real-time clicks, geographic data, and audience insights.",
    color: "cyan"
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-32 relative overflow-hidden bg-[#0B0F19]">
      {/* SaaS Styled Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-24 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 bg-indigo-400/10 px-4 py-1.5 rounded-full inline-block mb-2"
          >
            The Process
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white heading-premium tracking-tight"
          >
            How it <span className="text-gradient">works.</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 font-medium max-w-xl mx-auto text-sm md:text-base leading-relaxed"
          >
            We've distilled complex link management into a seamless, high-performance workflow optimized for impact and clarity.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1, 
                ease: [0.21, 0.45, 0.32, 0.9] 
              }}
              whileHover={{ scale: 1.02 }}
              className="glass-card group p-8 lg:p-10 relative flex flex-col items-center text-center overflow-hidden h-full cursor-default"
            >
              {/* Subtle Step Number Background */}
              <div className="absolute -top-4 -right-4 text-[120px] font-black text-white/5 select-none transition-all duration-500 group-hover:text-white/10 group-hover:scale-110">
                {step.id}
              </div>

              {/* Step Number Badge */}
              <div className={`absolute top-6 right-6 w-8 h-8 rounded-lg bg-slate-950 border border-white/5 flex items-center justify-center text-[10px] font-black text-slate-500 shadow-xl group-hover:border-indigo-500/30 group-hover:text-indigo-400 transition-colors`}>
                {step.id}
              </div>

              {/* Icon Container with Glow */}
              <div className="relative mb-8">
                <div className="w-16 h-16 rounded-[1.2rem] bg-white/5 border border-white/10 flex items-center justify-center relative z-10 transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 shadow-lg group-hover:bg-white/10 group-hover:border-white/20">
                  {step.icon}
                </div>
                <div className={`absolute inset-0 bg-${step.color}-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity scale-125`} />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-4 tracking-tight relative z-10 group-hover:text-indigo-400 transition-colors">
                {step.title}
              </h3>
              
              <p className="text-sm font-medium text-slate-500 leading-relaxed relative z-10 group-hover:text-slate-400 transition-colors">
                {step.description}
              </p>

              {/* Decorative Accent Line */}
              <div className={`absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-out group-hover:w-full`} />
              
              {/* Subtle Card Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
