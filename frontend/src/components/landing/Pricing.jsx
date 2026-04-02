import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Custom SVG Icons for Pricing
const CheckIcon = () => <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>;
const ArrowRightIcon = () => <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>;
const ZapIcon = () => <svg className="w-6 h-6 text-indigo-400" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const StarIcon = () => <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.783.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>;

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "Ideal for individual creators and testing the waters.",
    features: [
      "Up to 50 links per month",
      "Standard click data",
      "SSL encryption",
      "Community support",
    ],
    buttonText: "Get Started Free",
    popular: false,
    color: "slate"
  },
  {
    name: "Business Pro",
    price: "$19",
    period: "/mo",
    description: "Scalable link management for growing companies.",
    features: [
      "Unlimited magic links",
      "Advanced geographic data",
      "Custom branded domains",
      "Deep API access",
      "Priority 24/7 support",
      "Bulk link creation"
    ],
    buttonText: "Upgrade to Pro",
    popular: true,
    color: "indigo"
  }
];

const Pricing = () => {
  const { user } = useAuth();
  return (
    <section id="pricing" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500"
          >
            Pricing Architecture
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white heading-premium tracking-tight"
          >
            Scale your reach with <br />
            <span className="text-gradient">transparent investments.</span>
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative glass-card p-10 md:p-12 overflow-hidden flex flex-col ${plan.popular ? 'border-indigo-500/30' : ''}`}
            >
              {plan.popular && (
                <>
                  <div className="absolute top-0 right-0 py-1.5 px-6 bg-gradient-to-l from-indigo-600 to-purple-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-bl-2xl shadow-xl z-20">
                    Recommended
                  </div>
                  <div className="absolute top-[-100px] right-[-100px] w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px]" />
                </>
              )}

              <div className="mb-10 relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-black text-white tracking-tight">{plan.name}</h3>
                  {plan.popular ? <ZapIcon /> : <StarIcon />}
                </div>
                <p className="text-sm font-medium text-slate-500 mb-8 max-w-[280px]">
                  {plan.description}
                </p>
                <div className="flex items-baseline">
                  <span className="text-5xl md:text-6xl font-black text-white tracking-tighter">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-lg font-black text-slate-500 uppercase tracking-widest ml-2">
                      {plan.period}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-4 mb-10 flex-1 relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-6">Included Capabilities</p>
                {plan.features.map((feature, fIndex) => (
                  <div key={fIndex} className="flex items-center space-x-3 group">
                    <div className={`w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${plan.popular ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-white/5 text-slate-500 border border-white/5'}`}>
                      <CheckIcon />
                    </div>
                    <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <Link
                to={user ? "/dashboard" : "/register"}
                className={`btn-premium w-full py-4 uppercase tracking-[0.2em] text-xs flex items-center justify-center transition-all ${!plan.popular ? '!from-slate-800 !to-slate-900 border-white/5 hover:!from-slate-700 hover:!to-slate-800' : ''}`}
              >
                {plan.buttonText}
                <ArrowRightIcon />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
