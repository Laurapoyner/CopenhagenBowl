/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Users, 
  MapPin, 
  Calendar, 
  ChevronDown, 
  ExternalLink, 
  Download, 
  Menu, 
  X, 
  Info,
  Shield,
  History,
  Youtube,
  Facebook,
  Instagram
} from 'lucide-react';
import { t } from './translations';
import { cn } from './lib/utils';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 border-b",
        scrolled ? "bg-slate-950/90 backdrop-blur-md border-slate-800 py-3" : "bg-transparent border-transparent py-6"
      )}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollTo('home')}>
                       <img 
  src="/logo.png" 
  alt="Copenhagen Bowl logo"
  className="w-10 h-10 object-contain"
/>
            <span className="font-bold text-xl tracking-tighter hidden sm:block">COPENHAGEN BOWL</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {Object.entries(t.nav).map(([key, label]) => (
              <button 
                key={key} 
                onClick={() => scrollTo(key)}
                className="text-sm font-medium text-slate-400 hover:text-white transition-colors uppercase tracking-widest"
              >
                {label}
              </button>
            ))}
            <a 
              href="https://www.youtube.com/channel/UCjFf93sjWu1zh_zGgBCVppw/featured" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors text-sm font-bold uppercase tracking-widest"
            >
              <Youtube size={16} />
              Live
            </a>
          </div>

          <div className="md:hidden flex items-center gap-4">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-slate-950 pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6">
              {Object.entries(t.nav).map(([key, label]) => (
                <button 
                  key={key} 
                  onClick={() => scrollTo(key)}
                  className="text-2xl font-bold text-left border-b border-slate-800 pb-4"
                >
                  {label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image Placeholder */}
        <div className="absolute inset-0 z-0">
          <img 
                      src="\Front.jpg" 
            alt="Flag Football Action" 
            className="w-full h-full object-cover opacity-40 scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/10 border border-red-600/30 rounded-full text-red-500 text-[10px] sm:text-sm font-bold mb-8 uppercase tracking-widest max-w-full">
              <Trophy size={14} className="shrink-0" />
              <span className="truncate">{t.hero.subtitle}</span>
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black mb-6 tracking-tighter leading-none">
              COPENHAGEN <span className="text-blue-500">BOWL</span>
            </h1>
            <p className="text-lg md:text-2xl text-slate-400 mb-12 max-w-2xl mx-auto font-medium px-4">
              110 Teams. 2 Days. One Champion. Experience the pinnacle of European Flag Football.
            </p>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12">
              <div className="flex items-center gap-3 text-slate-300">
                <Calendar className="text-blue-500" />
                <span className="font-semibold">{t.hero.date}</span>
              </div>
              <div className="w-1 h-1 bg-slate-700 rounded-full hidden md:block" />
              <div className="flex items-center gap-3 text-slate-300">
                <MapPin className="text-red-500" />
                <span className="font-semibold">{t.hero.location}</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-xl shadow-blue-600/20">
                {t.hero.cta}
              </button>
              <button 
                onClick={() => scrollTo('rules')}
                className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all border border-slate-700"
              >
                {t.nav.rules}
              </button>
            </div>
          </motion.div>
        </div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-500 cursor-pointer"
          onClick={() => scrollTo('divisions')}
        >
          <ChevronDown size={32} />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <div>
            <div className="text-4xl md:text-5xl font-black text-white mb-2">110</div>
            <div className="text-slate-500 uppercase tracking-widest text-xs font-bold">Teams</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-black text-white mb-2">12</div>
            <div className="text-slate-500 uppercase tracking-widest text-xs font-bold">Editions</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-black text-white mb-2">15+</div>
            <div className="text-slate-500 uppercase tracking-widest text-xs font-bold">Nations</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-black text-white mb-2">500+</div>
            <div className="text-slate-500 uppercase tracking-widest text-xs font-bold">Matches</div>
          </div>
        </div>
      </section>

      {/* Image Gallery Section */}
      <section className="py-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div whileHover={{ scale: 1.02 }} className="h-48 md:h-64 rounded-2xl overflow-hidden">
                      <img src="\1CopenhagenBowl.jpg"  className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} className="h-48 md:h-64 rounded-2xl overflow-hidden mt-8 md:mt-12">
                      <img src="\2CopenhagenBowl.jpg"  className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} className="h-48 md:h-64 rounded-2xl overflow-hidden">
                      <img src="\3CopenhagenBowl.jpg" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} className="h-48 md:h-64 rounded-2xl overflow-hidden mt-8 md:mt-12">
                      <img src="\4CopenhagenBowl.jpg" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </motion.div>
        </div>
      </section>

      {/* Divisions Section */}
      <section id="divisions" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tighter">{t.divisions.title}</h2>
            <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Men's Divisions */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 group"
            >
              <div className="h-64 relative">
                              <img
                                  src="/men.png"
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                              />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-3xl font-black uppercase tracking-tighter">{t.divisions.mens}</h3>
                </div>
              </div>
              <div className="p-8 space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                  <span className="font-bold text-blue-400">ELITE</span>
                  <span className="text-xs font-bold bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full">PRO LEVEL</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                  <span className="font-bold text-slate-300">COMPETITIVE</span>
                  <span className="text-xs font-bold bg-slate-700 text-slate-400 px-3 py-1 rounded-full">HIGH LEVEL</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                  <span className="font-bold text-slate-400">LEISURE</span>
                  <span className="text-xs font-bold bg-slate-700 text-slate-500 px-3 py-1 rounded-full">FUN LEVEL</span>
                </div>
              </div>
            </motion.div>

            {/* Women's Division */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 group"
            >
              <div className="h-64 relative">
                              <img
                                  src="/women.png"
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                              />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-3xl font-black uppercase tracking-tighter">{t.divisions.womens}</h3>
                </div>
              </div>
              <div className="p-8">
                <p className="text-slate-400 mb-6 font-medium">One of the fastest growing divisions in Europe, featuring top national and club teams.</p>
                <div className="p-4 bg-blue-600/10 rounded-2xl border border-blue-600/20">
                  <span className="font-bold text-blue-400">OPEN DIVISION</span>
                </div>
              </div>
            </motion.div>

            {/* Co-Ed Division */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 group"
            >
              <div className="h-64 relative">
                              <img
                                  src="/mix.png"
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                              />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-3xl font-black uppercase tracking-tighter">{t.divisions.coed}</h3>
                </div>
              </div>
              <div className="p-8">
                <p className="text-slate-400 mb-6 font-medium">The most social and inclusive division of the tournament.</p>
                <div className="p-4 bg-blue-600/10 rounded-2xl border border-blue-600/20 flex items-center gap-3">
                  <Info className="text-blue-500" size={20} />
                  <span className="font-bold text-blue-400">{t.divisions.coed_rule}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Officiating Clinic */}
      <section id="officiating" className="py-32 bg-blue-600 text-white relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/Dommer.jpg" 
            alt="Officiating" 
            className="w-full h-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-600/50 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <h2 className="text-5xl font-black mb-6 uppercase tracking-tighter leading-none">{t.officiating.title}</h2>
            <p className="text-xl text-blue-100 mb-8 font-medium">
              Most of our instructor Crew is set consisting of some of the best IFAF officials all with experience of supervising at IFAF tournaments!
              Recognized by IFAF to be delivered by IFAF recognized technical officials.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              <div className="flex items-center gap-3 bg-blue-700/50 p-4 rounded-2xl">
                <Shield className="text-blue-300" />
                <span className="font-bold">IFAF Certified</span>
              </div>
              <div className="flex items-center gap-3 bg-blue-700/50 p-4 rounded-2xl">
                <Users className="text-blue-300" />
                <span className="font-bold">8 Expert Instructors</span>
              </div>
            </div>
            <a 
              href="https://www.holdsport.dk/public_ticket_events/copenhagen-bowl-flag-football-officiating-clinic--2" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 font-black rounded-2xl hover:bg-blue-50 transition-all shadow-xl"
            >
              {t.officiating.signup}
              <ExternalLink size={20} />
            </a>
          </div>
          <div className="flex-1 relative">
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20">
              <h4 className="font-bold text-xl mb-6 border-b border-white/20 pb-4">Instructors include:</h4>
              <ul className="space-y-4">
                <li className="flex justify-between items-center">
                  <span className="font-bold">Mara Steiner</span>
                  <span className="text-sm text-blue-200">Supervisor at Euros 25</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="font-bold">Daniel Madsen</span>
                  <span className="text-sm text-blue-200">3x WC Finals Official</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="font-bold">Cedric Castaing</span>
                  <span className="text-sm text-blue-200">World Games 22 Supervisor</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="font-bold">Omer Sela</span>
                  <span className="text-sm text-blue-200">Head of Video Review</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Rules Section */}
      <section id="rules" className="py-32 px-6 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tighter">{t.rules.title}</h2>
            <p className="text-slate-400 font-medium italic">Sportmonda Bowl X will use IFAF Rules with specific tournament adjustments</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-blue-500">
                  <Info /> {t.rules.general}
                </h3>
                <ul className="space-y-4 text-slate-300">
                  <li className="flex gap-3">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>Home team starts with the football.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>Match length: 2x15 minutes running time.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>Ties allowed in group matches.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>Playoff ties: "2-point Shoot Out". First to score wins.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>All offensive penalties result in Loss of Down.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-red-500">
                  <Users /> {t.rules.coed}
                </h3>
                <ul className="space-y-4 text-slate-300">
                  <li className="flex gap-3">
                    <span className="text-red-500 font-bold">•</span>
                    <span>At least 2 female players on field at all times.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-red-500 font-bold">•</span>
                    <span>Female scoring (run/rec/pass): +1 additional point.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-red-500 font-bold">•</span>
                    <span>Touchdown: 7 points | XP (5yd): 2 pts | XP (10yd): 3 pts.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-yellow-500">
                  <Trophy /> {t.rules.tiebreaker}
                </h3>
                <div className="space-y-3 text-sm">
                  {[
                    "1: Points (2 for win, 1 for draw)",
                    "2: Largest Point differential",
                    "3: Head to Head",
                    "4: Most Points scored",
                    "5: Wins",
                    "6: Best Result vs. strongest mutual opponent",
                    "7: Shoot Out from 10-yard line"
                  ].map((rule, i) => (
                    <div key={i} className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 text-slate-300 font-medium">
                      {rule}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-600/10 p-8 rounded-3xl border border-blue-600/30">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-blue-400">
                  <Shield /> {t.rules.cheat_sheet}
                </h3>
                <p className="text-slate-400 mb-6">Participating teams will officiate accompanied by non-playing officials.</p>
                <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-3">
                  <Download size={20} />
                  Download Cheat Sheet PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* History & Results */}
      <section id="history" className="py-32 px-6 bg-slate-900 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=1920&auto=format&fit=crop" 
            alt="History" 
            className="w-full h-full object-cover opacity-10"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-transparent to-slate-900" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tighter">{t.history.title}</h2>
              <p className="text-slate-400 font-medium max-w-xl">{t.history.subtitle}</p>
            </div>
            <button className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700 flex items-center gap-3">
              <Download size={18} />
              {t.history.download_pdf}
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1 px-4 sm:px-0">
              <div className="prose prose-invert prose-slate max-w-none">
                <h3 className="text-2xl font-bold text-white mb-4">The Story</h3>
                <p className="text-slate-400 leading-relaxed">
                  Back in 2014 the Swedish national team came to Copenhagen to play some practice matches against some local teams. It turned out to be a great success.
                </p>
                <p className="text-slate-400 leading-relaxed mt-4">
                  Martin Andersen decided to invite them back a year later for a full tournament. Sportmonda joined as naming sponsor, and the tournament has since grown to the largest in Scandinavia.
                </p>
                <div className="mt-8 p-6 bg-blue-600/10 rounded-2xl border border-blue-600/20">
                  <History className="text-blue-500 mb-4" size={32} />
                  <p className="text-sm font-bold text-blue-300 uppercase tracking-widest">First Winner (2015)</p>
                  <p className="text-xl font-black text-white">Copenhagen Fusion</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-12 overflow-hidden">
              <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden">
                <div className="p-6 bg-slate-800/50 border-b border-slate-800 flex justify-between items-center">
                  <h4 className="font-bold uppercase tracking-widest text-sm text-slate-400">{t.history.results} - 2024 Winners</h4>
                  <Trophy size={18} className="text-yellow-500" />
                </div>
                <div className="overflow-x-auto scrollbar-hide relative">
                  <div className="md:hidden absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-950 to-transparent pointer-events-none z-10" />
                  <table className="w-full text-left min-w-[500px]">
                    <thead>
                      <tr className="text-xs uppercase tracking-widest text-slate-500 border-b border-slate-800">
                        <th className="px-6 py-4 font-bold">Division</th>
                        <th className="px-6 py-4 font-bold">Winner</th>
                        <th className="px-6 py-4 font-bold">Runner-up</th>
                        <th className="px-6 py-4 font-bold">MVP</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {[
                        { division: "Elite", winner: "Red Roosters (FR)", runner: "Wanderers (DE)", mvp: "Damien Sabatino" },
                        { division: "Leisure", winner: "Honey Badgers (US)", runner: "Templaris (ES)", mvp: "Luke Johnson" },
                        { division: "Women", winner: "Alpine Blitz (AT)", runner: "Panthers (UK)", mvp: "Saskia Stribrny" },
                        { division: "Co-Ed", winner: "TC United (US)", runner: "Mooses (SE)", mvp: "Fallon Dickens" },
                      ].map((row, i) => (
                        <tr key={i} className="border-b border-slate-900/50 hover:bg-slate-900/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-400">{row.division}</td>
                          <td className="px-6 py-4 font-black text-white">{row.winner}</td>
                          <td className="px-6 py-4 text-slate-400">{row.runner}</td>
                          <td className="px-6 py-4 text-blue-400 font-medium">{row.mvp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-slate-950 rounded-3xl border border-slate-800 p-8">
                <h4 className="font-bold uppercase tracking-widest text-sm text-slate-400 mb-6 flex items-center gap-2">
                  <Download size={16} />
                  Archive: Results PDF (2016 - 2024)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {[2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016].map((year) => (
                    <button 
                      key={year}
                      className="flex items-center justify-between p-3 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 transition-colors group"
                    >
                      <span className="font-bold text-slate-300">{year}</span>
                      <Download size={14} className="text-slate-600 group-hover:text-blue-500 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      <section id="sponsors" className="py-32 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-16 uppercase tracking-tighter">Our Partners</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 items-center opacity-50 grayscale hover:grayscale-0 transition-all">
            <div className="h-12 bg-slate-800 rounded-lg flex items-center justify-center font-black text-slate-500">SPORTMONDA</div>
            <div className="h-12 bg-slate-800 rounded-lg flex items-center justify-center font-black text-slate-500">IFAF</div>
            <div className="h-12 bg-slate-800 rounded-lg flex items-center justify-center font-black text-slate-500">DAFF</div>
            <div className="h-12 bg-slate-800 rounded-lg flex items-center justify-center font-black text-slate-500">KØBENHAVN</div>
          </div>
        </div>
      </section>

      {/* Questions/Contact Section */}
      <section className="py-32 px-6 bg-blue-600 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/Front.jpg" 
            alt="Contact" 
            className="w-full h-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-600 via-blue-600/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6 uppercase tracking-tighter text-white">
            {t.contact?.title}
          </h2>
          <p className="text-xl text-blue-100 mb-12 font-medium">
            {t.contact?.subtitle}
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <a 
              href="https://www.facebook.com/groups/1529865777274897/" 
              target="_blank" 
              className="flex items-center gap-3 px-8 py-4 bg-white text-blue-600 font-black rounded-2xl hover:bg-blue-50 transition-all shadow-xl"
            >
              <Facebook size={24} />
              {t.contact?.facebook}
            </a>
            <a 
              href="https://www.instagram.com/copenhagen_bowl/" 
              target="_blank" 
              className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all shadow-xl"
            >
              <Instagram size={24} />
              {t.contact?.instagram}
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                <span className="font-bold text-white italic">CB</span>
              </div>
              <span className="font-bold text-xl tracking-tighter">COPENHAGEN BOWL</span>
            </div>
            <p className="text-slate-500 max-w-sm mb-8">
              The biggest flag football event in Scandinavia. Bringing together athletes from across the globe for a weekend of elite competition.
            </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/groups/1529865777274897/" target="_blank" className="p-3 bg-slate-900 rounded-xl hover:bg-blue-600 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://www.instagram.com/copenhagen_bowl/" target="_blank" className="p-3 bg-slate-900 rounded-xl hover:bg-pink-600 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://www.youtube.com/channel/UCjFf93sjWu1zh_zGgBCVppw/featured" target="_blank" className="p-3 bg-slate-900 rounded-xl hover:bg-red-600 transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          <div>
            <h5 className="font-bold uppercase tracking-widest text-sm mb-6">Location</h5>
            <div className="space-y-4 text-slate-500">
              <p className="flex gap-3">
                <MapPin size={18} className="text-red-500 shrink-0" />
                Valby Idrætspark<br />Julius Andersen Vej 1<br />2450 Copenhagen SV
              </p>
              <button className="text-blue-500 font-bold text-sm hover:underline">Open in Google Maps</button>
            </div>
          </div>

          <div>
            <h5 className="font-bold uppercase tracking-widest text-sm mb-6">Contact</h5>
            <div className="space-y-4 text-slate-500">
              <p>results@sportmondabowl.dk</p>
              <p>+45 25 72 18 24</p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-slate-900 text-center text-slate-600 text-sm">
          © 2026 Copenhagen Bowl. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
