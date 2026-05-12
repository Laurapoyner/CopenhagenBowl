import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { sportAppService, SportAppMatch } from '../services/sportAppService';
import { Youtube, Clock, MapPin, ExternalLink, Loader2, Search, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';

export const LivestreamSchedule: React.FC = () => {
  const [matches, setMatches] = useState<SportAppMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [fieldFilter, setFieldFilter] = useState('all');

  const [visibleCount, setVisibleCount] = useState(3);

  const LIVESTREAM_FIELDS = [
    'Main field (live stream)',
    'Field 2 (live stream)',
    'Field 12 (live stream)'
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const tournaments = await sportAppService.getTournaments();
        if (tournaments && tournaments.length > 0) {
          const allMatches = await sportAppService.getMatches(tournaments[0].id);
          const liveMatches = allMatches.filter(m => 
            LIVESTREAM_FIELDS.includes(m.venue_name)
          ).sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
          setMatches(liveMatches);
        } else {
          console.error('No tournaments found in LivestreamSchedule');
        }
      } catch (error) {
        console.error('Error in LivestreamSchedule fetchData:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // 1 minute
    return () => clearInterval(interval);
  }, []);

  const filteredMatches = matches.filter(m => {
    const matchesSearch = searchQuery === '' || 
      m.home_team?.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.away_team?.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesField = fieldFilter === 'all' || m.venue_name === fieldFilter;
    
    return matchesSearch && matchesField;
  });

  const upcomingMatches = filteredMatches.filter(m => m.status !== 'played');
  const currentlyPlaying = upcomingMatches.filter(m => m.status === 'playing');
  const upNext = upcomingMatches.filter(m => m.status === 'upcoming');
  const displayedUpNext = upNext.slice(0, visibleCount);

  if (loading && matches.length === 0) {
    return (
      <div className="flex items-center justify-center py-24 bg-slate-950">
        <Loader2 className="animate-spin text-blue-500" />
      </div>
    );
  }

  if (matches.length === 0) return null;

  return (
    <section id="livestream" className="py-20 px-4 md:px-6 bg-slate-950 border-t border-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/10 border border-red-600/30 rounded-full text-red-500 text-[10px] font-bold mb-4 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
              Livestream Schedule
            </div>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">
              Watch <span className="text-red-500">Live</span>
            </h2>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            {/* Search */}
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-red-500 transition-colors" size={16} />
              <input 
                type="text"
                placeholder="Search team..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-red-500/50 transition-all w-full sm:w-48"
              />
            </div>

            {/* Field Filter */}
            <div className="relative group">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-red-500 transition-colors" size={16} />
              <select 
                value={fieldFilter}
                onChange={(e) => setFieldFilter(e.target.value)}
                className="pl-10 pr-8 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-red-500/50 transition-all appearance-none w-full sm:w-48"
              >
                <option value="all">All Stream Fields</option>
                {LIVESTREAM_FIELDS.map(f => (
                  <option key={f} value={f}>{f.replace(' (live stream)', '')}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={14} />
            </div>

            <a
              href="https://www.youtube.com/channel/UCjFf93sjWu1zh_zGgBCVppw/featured"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl transition-all shadow-lg shadow-red-600/20 group text-sm"
            >
              <Youtube size={18} className="group-hover:scale-110 transition-transform" />
              YouTube
              <ExternalLink size={14} />
            </a>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Currently Playing */}
          <div>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-400 uppercase tracking-widest">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                Live Now
            </h3>
            <div className="space-y-4">
              {currentlyPlaying.length > 0 ? (
                currentlyPlaying.map(match => (
                  <MatchCard key={match.id} match={match} isLive />
                ))
              ) : (
                <div className="p-12 bg-slate-900/30 rounded-3xl border border-slate-800/50 text-center text-slate-500 italic text-sm">
                  {searchQuery || fieldFilter !== 'all' ? 'No matching live matches found.' : 'No matches currently live on stream.'}
                </div>
              )}
            </div>
          </div>

          {/* Up Next */}
          <div>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-400 uppercase tracking-widest">
                Up Next
            </h3>
            <div className="space-y-4">
              {displayedUpNext.length > 0 ? (
                <>
                  {displayedUpNext.map(match => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                  {visibleCount < upNext.length && (
                    <button
                      onClick={() => setVisibleCount(prev => prev + 3)}
                      className="w-full py-4 mt-4 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white font-bold rounded-2xl border border-slate-800 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2"
                    >
                      Load More Matches
                      <ChevronDown size={14} />
                    </button>
                  )}
                </>
              ) : (
                <div className="p-12 bg-slate-900/30 rounded-3xl border border-slate-800/50 text-center text-slate-500 italic text-sm">
                  {searchQuery || fieldFilter !== 'all' ? 'No matching upcoming matches found.' : 'No upcoming streams scheduled.'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

interface MatchCardProps {
  match: SportAppMatch;
  isLive?: boolean;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, isLive }) => {
  const startTime = new Date(match.start_time);
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const dayName = days[startTime.getDay()];

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "p-4 md:p-6 rounded-2xl border transition-all",
        isLive ? "bg-red-600/5 border-red-600/30 shadow-lg shadow-red-600/5" : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
      )}
    >
      <div className="flex flex-wrap justify-between items-start gap-2 mb-4">
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          <Clock size={12} className="text-blue-500" />
          <span className="text-slate-300">{dayName}</span>
          <span>{startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <span className="mx-1 opacity-30">|</span>
          <MapPin size={12} className="text-red-500 shrink-0" />
          <span className="truncate max-w-[120px] md:max-w-none">{match.venue_name.replace(' (live stream)', '')}</span>
        </div>
        <div className="text-[9px] font-black px-2 py-0.5 bg-slate-800 rounded text-slate-400 uppercase tracking-tighter shrink-0">
          {match.division_name}
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 md:gap-4">
        <div className="text-right font-black text-xs md:text-base uppercase truncate text-slate-200">
          {match.home_team?.name || 'TBD'}
        </div>
        <div className="flex flex-col items-center min-w-[60px] md:min-w-[100px]">
          {isLive ? (
            <div className="px-3 py-1 bg-red-600 rounded text-xs md:text-sm font-black tabular-nums shadow-lg shadow-red-600/20 text-white">
              {match.home_score ?? 0} : {match.away_score ?? 0}
            </div>
          ) : (
            <div className="text-[10px] font-bold text-slate-700 uppercase tracking-[0.2em]">
              VS
            </div>
          )}
        </div>
        <div className="text-left font-black text-xs md:text-base uppercase truncate text-slate-200">
          {match.away_team?.name || 'TBD'}
        </div>
      </div>
    </motion.div>
  );
};
