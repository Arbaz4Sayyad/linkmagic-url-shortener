import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "Marketing Director at Loom",
    content: "LinkMagic completely transformed how we share assets. The custom aliases keep our brand consistent, and the analytics tracking is second to none.",
    avatar: "https://i.pravatar.cc/150?u=sarah"
  },
  {
    name: "Marcus Chen",
    role: "Indie Hacker",
    content: "Fastest URL shortener I've ever used. The API was a breeze to integrate into my SaaS, and the dashboard provides exactly what I need at a glance.",
    avatar: "https://i.pravatar.cc/150?u=marcus"
  },
  {
    name: "Elena Rodriguez",
    role: "Content Creator",
    content: "I share dozens of links daily across my socials. With LinkMagic, I finally know which platforms are actually driving traffic. An absolute game changer.",
    avatar: "https://i.pravatar.cc/150?u=elena"
  }
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-24 relative bg-gray-50/50 dark:bg-[#0B0F19]/50 border-t border-gray-200/50 dark:border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight"
          >
            Loved by <span className="text-indigo-600">creators</span> & teams
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Don't just take our word for it. See what our community is building with LinkMagic.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, type: "spring", stiffness: 100 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="glass p-8 rounded-3xl shadow-lg border border-gray-200 dark:border-white/5 flex flex-col justify-between bg-white/60 dark:bg-gray-900/60"
            >
              <div className="absolute top-8 right-8 text-indigo-500/20 dark:text-indigo-400/10">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed relative z-10 italic mb-8">
                "{testimonial.content}"
              </p>

              <div className="flex items-center space-x-4 mt-auto">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full border-2 border-indigo-200 dark:border-indigo-900 object-cover"
                />
                <div>
                  <h4 className="text-sm font-black text-gray-900 dark:text-white leading-tight">
                    {testimonial.name}
                  </h4>
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                    {testimonial.role}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
