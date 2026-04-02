import React from 'react';
import { motion } from 'framer-motion';

// Bulletproof SVG Icons for Features
const ZapIcon = () => <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const ShieldIcon = () => <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
const AnalyticsIcon = () => <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2zm10-10V7a2 2 0 00-2-2h-2a2 2 0 00-2 2v12a2 2 0 002 2h2a2 2 0 002-2v-10z" /></svg>;
const LayersIcon = () => <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>;

const features = [
  {
    icon: <ZapIcon />,
    title: "Global Edge Network",
    description: "Redirect links in milliseconds via our globally distributed infrastructure.",
    color: "indigo"
  },
  {
    icon: <ShieldIcon />,
    title: "Enterprise Security",
    description: "Advanced bot detection and 256-bit encryption for every single link.",
    color: "purple"
  },
  {
    icon: <AnalyticsIcon />,
    title: "Deep Analytics",
    description: "Real-time insights into your audience, geographic data, and referrers.",
    color: "pink"
  },
  {
    icon: <LayersIcon />,
    title: "Custom Domain API",
    description: "Fully white-labeled link shortening for your own branded domains.",
    color: "cyan"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 30 },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const Features = () => {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500"
          >
            Capabilities
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white heading-premium tracking-tight"
          >
            Smarter infrastructure for <br />
            <span className="text-gradient">modern link management.</span>
          </motion.h2>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="glass-card p-10 relative group overflow-hidden flex flex-col items-center text-center"
            >
              {/* Card Glow */}
              <div className={`absolute -top-10 -right-10 w-32 h-32 bg-${feature.color}-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className={`w-14 h-14 bg-white/5 border border-white/5 rounded-[1.2rem] flex items-center justify-center mb-8 shadow-xl group-hover:bg-white/10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-black text-white mb-4 tracking-tight">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                {feature.description}
              </p>
              
              {/* Bottom Line Accent */}
              <div className={`absolute bottom-0 left-0 h-[2px] w-0 bg-${feature.color}-500 transition-all duration-500 group-hover:w-full`} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
