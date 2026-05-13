/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    Trophy,
    Users,
    MapPin,
    Calendar,
    Clock,
    ExternalLink,
    Download,
    Menu,
    X,
    Info,
    HelpCircle,
    Shield,
    History,
    Youtube,
    Facebook,
    Instagram,
    Mail,
    Phone,
} from 'lucide-react';
import { t } from './translations';
import { cn } from './lib/utils';
import { TournamentLive } from './components/TournamentLive';
import { LivestreamSchedule } from './components/LivestreamSchedule';

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

    const partners = [
        { name: 'MVP Sports Gear', logo: '/mvplogo.png', href: 'https://mvpsportsgear.dk/', hours: "Sat: 09:00-18:00 / Sun: 09:00-17:00" },
        { name: 'meddethele', logo: '/meddethele.jpg', href: 'https://www.meddethele.dk/', hours: "All Weekend" },
        { name: 'NuOla', logo: '/nuola.png', href: 'https://www.nuola.co.uk/', hours: "09:00 - End of play" },
        { name: 'Big Popas', logo: '/big-popas-black-com.png', href: 'https://bigpopas.com/', hours: "Visit booth for times" },
        { name: 'UPGear', logo: '/UPGEAR_Logo.png', href: 'https://upgear.ch/', hours: "All Weekend" },
        { name: 'BreakAway Data', logo: '/breakawaylogo.png', href: 'https://www.breakawaydata.com/', hours: "Visit booth for info" },
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30 overflow-x-hidden">
            {/* Navigation */}
            <nav
                className={cn(
                    'fixed top-0 w-full z-50 transition-all duration-300 border-b',
                    scrolled
                        ? 'bg-slate-950/90 backdrop-blur-md border-slate-800 py-3'
                        : 'bg-transparent border-transparent py-6'
                )}
            >
                <div className="max-w-7xl mx-auto px-4 md:px-6 flex justify-between items-center">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollTo('home')}>
                        <img
                            src="/logo.png"
                            alt="Copenhagen Bowl logo"
                            className="w-10 h-10 object-contain shadow-lg shadow-black/20"
                        />
                        <span className="font-bold text-xl tracking-tighter hidden sm:block uppercase">
                            COPENHAGEN BOWL
                        </span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        {Object.entries(t.nav).map(([key, label]) => (
                            <button
                                key={key}
                                onClick={() => scrollTo(key)}
                                className={cn(
                                    "text-sm font-medium transition-colors uppercase tracking-widest",
                                    key === 'livestream' ? "text-red-500 hover:text-red-400" : "text-slate-400 hover:text-white"
                                )}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    <div className="md:hidden flex items-center gap-4">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2" aria-label="Open menu">
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
                                    className={cn(
                                        "text-2xl font-bold text-left border-b border-slate-800 pb-4",
                                        key === 'livestream' && "text-red-500"
                                    )}
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
                <div className="absolute inset-0 z-0">
                    <img
                        src="/Front.jpg"
                        alt="Flag Football Action"
                        className="w-full h-full object-cover opacity-40 scale-105"
                        referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
                </div>

                <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/10 border border-red-600/30 rounded-full text-red-500 text-[10px] sm:text-sm font-bold mb-8 uppercase tracking-widest max-w-full">
                            <Trophy size={14} className="shrink-0" />
                            <span className="truncate">{t.hero.subtitle}</span>
                        </div>

                        <h1 className="text-4xl sm:text-6xl md:text-8xl font-black mb-6 tracking-tighter leading-none uppercase">
                            COPENHAGEN <span className="text-blue-500">BOWL</span>
                        </h1>

                        <p className="text-lg md:text-2xl text-slate-400 mb-12 max-w-2xl mx-auto font-medium px-4">
                            110 Teams. 2 Days. Five Champions. Experience the pinnacle of European Flag Football.
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
                            <a href="https://cphbowl.nemtilmeld.dk/8" target="_blank" rel="noopener noreferrer">
                                <button className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-xl shadow-blue-600/20 text-sm md:text-base">
                                    {t.hero.cta}
                                </button>
                            </a>

                            <button
                                onClick={() => scrollTo('qa')}
                                className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all border border-slate-700 text-sm md:text-base"
                            >
                                {t.qa.title}
                            </button>
                        </div>

                        {/* Quick Actions moved inside flow with more air */}
                        <div className="mt-16 md:mt-24 flex flex-wrap justify-center gap-3 md:gap-6">
                            {[
                                { id: 'schedule', label: 'Schedule & Standings', icon: Trophy, color: 'text-blue-500' },
                                { id: 'livestream', label: 'Livestream', icon: Youtube, color: 'text-red-500' },
                                { id: 'partners', label: 'Shop Times', icon: Clock, color: 'text-sky-400' },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => scrollTo(item.id)}
                                    className="group flex items-center gap-3 px-5 md:px-7 py-3 md:py-4 bg-slate-900/40 backdrop-blur-md border border-slate-800/50 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest text-white hover:bg-slate-800/60 hover:border-slate-700 transition-all hover:-translate-y-1"
                                >
                                    <item.icon size={16} className={cn("transition-transform group-hover:scale-110", item.color)} />
                                    <span>{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </div>
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

            {/* Live Tournament Data */}
            <TournamentLive />
            <LivestreamSchedule />

            {/* Sponsors Section */}
            <section id="partners" className="py-32 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-4xl font-black mb-16 uppercase tracking-tighter">Our Partners</h2>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 md:gap-12 items-stretch">
                        {partners.map((partner) => (
                            <a
                                key={partner.name}
                                href={partner.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex flex-col items-center gap-4"
                            >
                                <div className="w-full h-24 bg-red-600/5 hover:bg-red-600/10 rounded-2xl border border-slate-800 flex items-center justify-center p-4 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:border-red-600/30">
                                    <img
                                        src={partner.logo}
                                        alt={partner.name}
                                        className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500"
                                    />
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-200 group-hover:text-white transition-colors">
                                        {partner.name}
                                    </span>
                                    {partner.hours && (
                                        <span className="text-[8px] font-medium text-slate-500 group-hover:text-slate-400 transition-colors uppercase tracking-tight">
                                            {partner.hours}
                                        </span>
                                    )}
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Image Gallery Section */}
            <section className="py-20 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
                    <motion.div whileHover={{ scale: 1.02 }} className="h-48 md:h-64 rounded-2xl overflow-hidden shadow-2xl">
                        <img src="/1CopenhagenBowl.jpg" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }} className="h-48 md:h-64 rounded-2xl overflow-hidden mt-8 md:mt-12 shadow-2xl">
                        <img src="/2CopenhagenBowl.jpg" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }} className="h-48 md:h-64 rounded-2xl overflow-hidden shadow-2xl">
                        <img src="/3CopenhagenBowl.jpg" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }} className="h-48 md:h-64 rounded-2xl overflow-hidden mt-8 md:mt-12 shadow-2xl">
                        <img src="/4CopenhagenBowl.jpg" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </motion.div>
                </div>
            </section>

            {/* Divisions Section */}
            <section id="divisions" className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tighter">
                            {t.divisions.title}
                        </h2>
                        <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full" />
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Men's Divisions */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 group shadow-xl"
                        >
                            <div className="h-64 relative">
                                <img
                                    src="/men.png"
                                    className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-500"
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
                                    <span className="text-xs font-bold bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full uppercase tracking-tighter">
                                        PRO LEVEL
                                    </span>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                                    <span className="font-bold text-slate-300">COMPETITIVE</span>
                                    <span className="text-xs font-bold bg-slate-700 text-slate-400 px-3 py-1 rounded-full uppercase tracking-tighter">
                                        HIGH LEVEL
                                    </span>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                                    <span className="font-bold text-slate-400">LEISURE</span>
                                    <span className="text-xs font-bold bg-slate-700 text-slate-500 px-3 py-1 rounded-full uppercase tracking-tighter">
                                        FUN LEVEL
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Women's Division */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 group shadow-xl"
                        >
                            <div className="h-64 relative">
                                <img
                                    src="/women.png"
                                    className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-500"
                                    referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                                <div className="absolute bottom-6 left-6">
                                    <h3 className="text-3xl font-black uppercase tracking-tighter">{t.divisions.womens}</h3>
                                </div>
                            </div>

                            <div className="p-8">
                                <p className="text-slate-400 mb-6 font-medium">
                                    One of the fastest growing divisions in Europe, featuring top national and club teams.
                                </p>
                                <div className="p-4 bg-blue-600/10 rounded-2xl border border-blue-600/20">
                                    <span className="font-bold text-blue-400 uppercase tracking-tighter">OPEN DIVISION</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Co-Ed Division */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 group shadow-xl"
                        >
                            <div className="h-64 relative">
                                <img
                                    src="/mix.png"
                                    className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-500"
                                    referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                                <div className="absolute bottom-6 left-6">
                                    <h3 className="text-3xl font-black uppercase tracking-tighter">{t.divisions.coed}</h3>
                                </div>
                            </div>

                            <div className="p-8">
                                <p className="text-slate-400 mb-6 font-medium">
                                    The most social and inclusive division of the tournament.
                                </p>
                                <div className="p-4 bg-blue-600/10 rounded-2xl border border-blue-600/20 flex items-center gap-3">
                                    <Info className="text-blue-500" size={20} />
                                    <span className="font-bold text-blue-400 uppercase tracking-tighter">{t.divisions.coed_rule}</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Officiating Clinic */}
            <section id="officiating" className="py-32 bg-blue-600 text-white relative overflow-hidden">
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
                        <h2 className="text-5xl font-black mb-6 uppercase tracking-tighter leading-none">
                            {t.officiating.title}
                        </h2>

                        <p className="text-xl text-blue-100 mb-8 font-medium">
                            Most of our instructor Crew is set consisting of some of the best IFAF officials all with
                            experience of supervising at IFAF tournaments! Recognized by IFAF to be delivered by IFAF
                            recognized technical officials.
                        </p>
                        <p className="text-blue-100/80 mb-8">
                            Participants can both compete in the tournament and attend the officiating clinic, as the game schedule is designed to make this possible.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                            <div className="flex items-center gap-3 bg-blue-700/50 p-4 rounded-2xl border border-white/10">
                                <Shield className="text-blue-300" />
                                <span className="font-bold">IFAF Certified</span>
                            </div>
                            <div className="flex items-center gap-3 bg-blue-700/50 p-4 rounded-2xl border border-white/10">
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
                        <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 shadow-2xl">
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
                        <h2 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tighter">
                            {t.rules.title}
                        </h2>
                        <p className="text-slate-400 font-medium italic">
                            Sportmonda Bowl X will use IFAF Rules with specific tournament adjustments
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="space-y-8">
                            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-lg">
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

                            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-lg">
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
                            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-lg">
                                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-yellow-500">
                                    <Trophy /> {t.rules.tiebreaker}
                                </h3>

                                <div className="space-y-3 text-sm">
                                    {[
                                        '1: Points (2 for win, 1 for draw)',
                                        '2: Largest Point differential',
                                        '3: Head to Head',
                                        '4: Most Points scored',
                                        '5: Views',
                                        '6: Best Result vs. strongest mutual opponent',
                                        '7: Shoot Out from 10-yard line',
                                    ].map((rule, i) => (
                                        <div
                                            key={i}
                                            className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 text-slate-300 font-medium"
                                        >
                                            {rule}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-blue-600/10 p-8 rounded-3xl border border-blue-600/30">
                                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-blue-400">
                                    <Shield /> {t.rules.cheat_sheet}
                                </h3>
                                <p className="text-slate-400 mb-6">
                                    Participating teams will officiate accompanied by non-playing officials.
                                </p>
                                <a
                                    href="/cheatsheet.jpg"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20"
                                >
                                    <Download size={20} />
                                    Download Cheat Sheet
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Questions / Contact Section */}
            <section className="py-32 px-6 bg-blue-600 relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/2CopenhagenBowl.jpg"
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
                    <p className="text-xl text-blue-100 mb-12 font-medium">{t.contact?.subtitle}</p>

                    <div className="flex flex-wrap justify-center gap-6">
                        <a
                            href="https://www.facebook.com/groups/1529865777274897/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-8 py-4 bg-white text-blue-600 font-black rounded-2xl hover:bg-blue-50 transition-all shadow-xl"
                        >
                            <Facebook size={24} />
                            {t.contact?.facebook}
                        </a>

                        <a
                            href="https://www.instagram.com/copenhagen_bowl/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all shadow-xl"
                        >
                            <Instagram size={24} />
                            {t.contact?.instagram}
                        </a>

                        <button
                            onClick={() => scrollTo('qa')}
                            className="flex items-center gap-3 px-8 py-4 bg-blue-700 text-white font-black rounded-2xl hover:bg-blue-800 transition-all shadow-xl border border-blue-500/30"
                        >
                            <HelpCircle size={24} />
                            {t.qa.title}
                        </button>
                    </div>
                </div>
            </section>

            {/* Personnel Section */}
            <section id="contact" className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tighter">
                            {t.personnel.title}
                        </h2>
                        <div className="w-20 h-1.5 bg-red-600 mx-auto rounded-full" />
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Martin */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 p-8 text-center shadow-xl"
                        >
                            <div className="w-32 h-32 bg-slate-800 rounded-full mx-auto mb-6 overflow-hidden border-2 border-red-600/30 flex items-center justify-center">
                                <img
                                    src="/martin.png"
                                    alt={t.personnel.martin.name}
                                    className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all"
                                    referrerPolicy="no-referrer"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            </div>

                            <h3 className="text-2xl font-black uppercase tracking-tighter mb-1">
                                {t.personnel.martin.name}
                            </h3>
                            <p className="text-red-500 font-bold text-sm uppercase tracking-widest mb-6">
                                {t.personnel.martin.role}
                            </p>

                            <div className="space-y-3 text-slate-400">
                                <a
                                    href={`mailto:${t.personnel.martin.email}`}
                                    className="flex items-center justify-center gap-2 hover:text-white transition-colors"
                                >
                                    <Mail size={16} />
                                    <span className="text-xs">{t.personnel.martin.email}</span>
                                </a>
                                <a
                                    href={`tel:${t.personnel.martin.phone.replace(/\s+/g, '')}`}
                                    className="flex items-center justify-center gap-2 hover:text-white transition-colors"
                                >
                                    <Phone size={16} />
                                    <span className="text-xs">{t.personnel.martin.phone}</span>
                                </a>
                            </div>
                        </motion.div>

                        {/* Claes */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 p-8 text-center shadow-xl"
                        >
                            <div className="w-32 h-32 bg-slate-800 rounded-full mx-auto mb-6 overflow-hidden border-2 border-blue-600/30 flex items-center justify-center">
                                <img
                                    src="/claes.jpg"
                                    alt={t.personnel.claes.name}
                                    className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all"
                                    referrerPolicy="no-referrer"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            </div>

                            <h3 className="text-2xl font-black uppercase tracking-tighter mb-1 leading-tight">
                                {t.personnel.claes.name}
                            </h3>
                            <p className="text-blue-500 font-bold text-[10px] uppercase tracking-widest mb-6 min-h-[40px] flex items-center justify-center">
                                {t.personnel.claes.role}
                            </p>

                            <div className="space-y-3 text-slate-400">
                                <a
                                    href={`mailto:${t.personnel.claes.email}`}
                                    className="flex items-center justify-center gap-2 hover:text-white transition-colors"
                                >
                                    <Mail size={16} />
                                    <span className="text-xs">{t.personnel.claes.email}</span>
                                </a>
                                <a
                                    href={`tel:${t.personnel.claes.phone.replace(/\s+/g, '')}`}
                                    className="flex items-center justify-center gap-2 hover:text-white transition-colors"
                                >
                                    <Phone size={16} />
                                    <span className="text-xs">{t.personnel.claes.phone}</span>
                                </a>
                            </div>
                        </motion.div>

                        {/* Laura */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 p-8 text-center shadow-xl"
                        >
                            <div className="w-32 h-32 bg-slate-800 rounded-full mx-auto mb-6 overflow-hidden border-2 border-slate-700/30 flex items-center justify-center">
                                <img
                                    src="/laura.png"
                                    alt={t.personnel.laura.name}
                                    className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all"
                                    referrerPolicy="no-referrer"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            </div>

                            <h3 className="text-2xl font-black uppercase tracking-tighter mb-1">
                                {t.personnel.laura.name}
                            </h3>
                            <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mb-6">
                                {t.personnel.laura.role}
                            </p>
                            <p className="text-slate-400 text-xs italic">{t.personnel.laura.note}</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section id="qa" className="py-32 px-6 bg-slate-900 border-t border-slate-800">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tighter">
                            {t.qa.title}
                        </h2>
                        <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full" />
                    </div>

                    <div className="space-y-6">
                        {/* Field View Topic */}
                        <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800 shadow-lg">
                            <h4 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                                <MapPin className="text-blue-500" />
                                Field View
                            </h4>
                            <p className="text-slate-400 mb-6 text-sm">
                                Get a detailed view of the match fields for Copenhagen Bowl.
                            </p>
                            <div className="overflow-hidden rounded-2xl border border-slate-800">
                                <img
                                    src="/fields.jpg"
                                    alt="Field Layout"
                                    className="w-full h-auto object-cover"
                                    referrerPolicy="no-referrer"
                                />
                            </div>
                        </div>

                        <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800 shadow-lg">
                            <h4 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                                <Info className="text-blue-500" />
                                {t.qa.toilets.q}
                            </h4>
                            <p className="text-slate-400 leading-relaxed text-sm mb-6">{t.qa.toilets.a}</p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Walk from Field to Toilets (Video 1)</p>
                                    <div className="aspect-video rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
                                        <video 
                                            src="/wcvideo1.mov" 
                                            controls 
                                            className="w-full h-full object-cover"
                                            playsInline
                                        >
                                            Your browser does not support the video tag.
                                        </video>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Walk from Field to Toilets (Video 2)</p>
                                    <div className="aspect-video rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
                                        <video 
                                            src="/wcvideo2.mov" 
                                            controls 
                                            className="w-full h-full object-cover"
                                            playsInline
                                        >
                                            Your browser does not support the video tag.
                                        </video>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800 shadow-lg">
                            <h4 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                                <ExternalLink className="text-red-500" />
                                {t.qa.photos.q}
                            </h4>
                            <p className="text-slate-400 leading-relaxed text-sm">{t.qa.photos.a}</p>
                        </div>

                        <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800 shadow-lg">
                            <h4 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                                <MapPin className="text-green-500" />
                                Map of General Facility
                            </h4>

                            <p className="text-slate-400 mb-6 text-sm">
                                Get an overview of the entire venue including fields, facilities and key areas.
                            </p>

                            <a
                                href="/facility-map.png"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block overflow-hidden rounded-2xl border border-slate-800 hover:border-slate-600 transition-all shadow-xl"
                            >
                                <img
                                    src="/facility-map.png"
                                    alt="Facility Map"
                                    className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                                />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-950 border-t border-slate-800 py-20 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <img
                                src="/logo.png"
                                alt="Copenhagen Bowl logo"
                                className="w-8 h-8 object-contain"
                            />
                            <span className="font-bold text-xl tracking-tighter uppercase">COPENHAGEN BOWL</span>
                        </div>

                        <p className="text-slate-500 max-w-sm mb-8 text-sm">
                            The biggest flag football event in Scandinavia. Bringing together athletes from across the globe
                            for a weekend of elite competition.
                        </p>

                        <div className="flex gap-4">
                            <a
                                href="https://www.facebook.com/groups/1529865777274897/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 bg-slate-900 rounded-xl hover:bg-blue-600 transition-colors shadow-lg"
                            >
                                <Facebook size={20} />
                            </a>
                            <a
                                href="https://www.instagram.com/copenhagen_bowl/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 bg-slate-900 rounded-xl hover:bg-pink-600 transition-colors shadow-lg"
                            >
                                <Instagram size={20} />
                            </a>
                            <a
                                href="https://www.youtube.com/channel/UCjFf93sjWu1zh_zGgBCVppw/featured"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 bg-slate-900 rounded-xl hover:bg-red-600 transition-colors shadow-lg"
                            >
                                <Youtube size={20} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h5 className="font-bold uppercase tracking-widest text-sm mb-6">Location</h5>
                        <div className="space-y-4 text-slate-400 text-sm leading-relaxed break-words">
                            <div className="flex gap-3">
                                <MapPin size={18} className="text-red-500 shrink-0" />
                                <p>
                                    Valby Idrætspark
                                    <br />
                                    Julius Andersensvej 1
                                    <br />
                                    2450 Copenhagen SV
                                </p>
                            </div>

                            <a href="https://share.google/q976mh8bmTGo4aIxO" target="_blank" rel="noopener noreferrer">
                                <button className="text-blue-500 font-bold text-sm hover:underline" >
                                    Open in Google Maps
                                </button>
                            </a>
                        </div>
                    </div>

                    <div>
                        <h5 className="font-bold uppercase tracking-widest text-sm mb-6">Contact</h5>
                        <div className="space-y-4 text-slate-400 text-sm leading-relaxed break-words">
                            <p className="break-all">martin_200186@hotmail.com</p>
                            <p>+45 51 54 99 52 (No WhatsApp)</p>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-slate-900 text-center text-slate-600 text-xs">
                    <p className="mb-4">
                        Special thanks to{' '}
                        <a
                            href="https://www.1stdownphoto.dk/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                        >
                            1stdownphoto.dk
                        </a>{' '}
                        for providing professional images for this website.
                    </p>
                    © 2026 Copenhagen Bowl. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
