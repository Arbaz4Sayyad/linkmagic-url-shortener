import React from 'react';
import { Link } from 'react-router-dom';

// Custom SVG Icons for Brands and Actions
const GithubIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.372.79 1.103.79 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>;
const TwitterIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.25H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
const LinkedinIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>;
const MailIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>;
const ArrowRightIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>;

const Footer = () => {
  const socialLinks = [
    { label: "GitHub", href: "https://github.com/Arbaz4Sayyad", icon: <GithubIcon /> },
    { label: "Twitter", href: "https://x.com/arbaz4sayyad", icon: <TwitterIcon /> },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/arbaz-sayyad/", icon: <LinkedinIcon /> },
    { label: "Email", href: "mailto:arbaz4sayyad@gmail.com", icon: <MailIcon /> }
  ];

  return (
    <footer className="relative pt-24 pb-12 overflow-hidden bg-slate-950">
      {/* Decorative Top Border */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
      
      {/* Background Glows */}
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-24">
          
          {/* Logo and About Section */}
          <div className="lg:col-span-4 space-y-8">
            <Link to="/" className="flex items-center space-x-3 group w-fit">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Link<span className="text-indigo-400">Magic</span>
              </span>
            </Link>
            
            <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-[320px]">
              The premium destination for high-performance link management. Optimized for creators, businesses, and enterprise teams.
            </p>
            
            <div className="flex space-x-3">
              {socialLinks.map(({ icon, href, label }) => (
                <a 
                  key={label}
                  href={href} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-all active:scale-95"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
          
          {/* Quick Links Sections */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Ecosystem</h4>
              <ul className="space-y-4">
                {[
                  { name: "Global Edge", path: "/#features" },
                  { name: "Pricing Architecture", path: "/#pricing" },
                  { name: "Live Analytics", path: "/analytics" },
                  { name: "API Developer Gate", path: "/api-keys" }
                ].map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className="text-sm font-bold text-slate-400 hover:text-indigo-400 transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Network</h4>
              <ul className="space-y-4">
                {["Knowledge Base", "System Status", "Developer Docs", "Contact"].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm font-bold text-slate-400 hover:text-indigo-400 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Newsletter Section */}
          <div className="lg:col-span-4">
            <div className="glass-card p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
                <MailIcon />
              </div>
              
              <h4 className="text-lg font-black text-white mb-2">Internal Insights</h4>
              <p className="text-xs font-medium text-slate-500 mb-6">Receive high-level optimization strategies weekly.</p>
              
              <form className="relative" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="name@company.com" 
                  className="w-full pl-5 pr-14 py-3.5 bg-slate-950/50 border border-white/5 rounded-xl text-white outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all font-bold text-sm placeholder:text-slate-700"
                />
                <button className="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all active:scale-95">
                  <ArrowRightIcon />
                </button>
              </form>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col lg:flex-row justify-between items-center gap-12">
          <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
              &copy; {new Date().getFullYear()} LINKMAGIC. ALL RIGHTS RESERVED.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-[10px] font-black text-slate-600 hover:text-white transition-colors uppercase tracking-[0.2em]">Legal</a>
              <a href="#" className="text-[10px] font-black text-slate-600 hover:text-white transition-colors uppercase tracking-[0.2em]">Privacy</a>
              <a href="#" className="text-[10px] font-black text-slate-600 hover:text-white transition-colors uppercase tracking-[0.2em]">Cookies</a>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center lg:justify-end items-center gap-4">
            {/* Compliance Badges */}
            <div className="flex items-center space-x-3 px-4 py-1.5 rounded-full bg-slate-900 border border-white/5 text-slate-500 text-[9px] font-black uppercase tracking-widest">
              <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500/40 mr-1.5" />GDPR COMPLIANT</span>
            </div>
            <div className="flex items-center space-x-3 px-4 py-1.5 rounded-full bg-slate-900 border border-white/5 text-slate-500 text-[9px] font-black uppercase tracking-widest">
              <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500/40 mr-1.5" />CCPA COMPLIANT</span>
            </div>
            <div className="flex items-center space-x-3 px-4 py-1.5 rounded-full bg-slate-900 border border-white/5 text-slate-500 text-[9px] font-black uppercase tracking-widest">
              <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500/40 mr-1.5" />SOC 2 TYPE 2</span>
            </div>

            {/* Operational Status */}
            <div className="flex items-center space-x-3 px-5 py-2.5 bg-emerald-500/5 rounded-full border border-emerald-500/20 backdrop-blur-sm">
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-500 animate-ping opacity-30" />
              </div>
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">
                Operational Excellence Verified
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
