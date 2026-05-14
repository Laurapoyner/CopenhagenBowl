import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sportAppService, SportAppMatch, SportAppStandingGroup, SportAppTournament } from '../services/sportAppService';
import { Trophy, Calendar, MapPin, Loader2, RefreshCw, Search, Filter, ChevronDown, ExternalLink } from 'lucide-react';
import { cn } from '../lib/utils';

export const TournamentLive: React.FC = () => {
  const [tournaments, setTournaments] = useState<SportAppTournament[]>([]);
  const [matches, setMatches] = useState<SportAppMatch[]>([]);
  const [standings, setStandings] = useState<SportAppStandingGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<'matches' | 'standings'>('matches');
  
  // Filters
  const [selectedTournamentId, setSelectedTournamentId] = useState<number | null>(null);
  const [selectedDivision, setSelectedDivision] = useState<string>('all');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'played'>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleMatches, setVisibleMatches] = useState(6);
  const [visibleGroups, setVisibleGroups] = useState(3);

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      const data = await sportAppService.getTournaments();
      setTournaments(data);
      if (data.length > 0) {
        if (!selectedTournamentId) {
          setSelectedTournamentId(data[0].id);
        }
      } else {
        setError('No tournaments found. Please check your API configuration.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Failed to fetch tournaments', err);
      setError('Failed to connect to the tournament server.');
      setLoading(false);
    }
  };

  const fetchData = async (tournamentId: number) => {
    setLoading(true);
    try {
      const [matchesData, standingsData] = await Promise.all([
        sportAppService.getMatches(tournamentId),
        sportAppService.getStandings(tournamentId)
      ]);
      
      if (matchesData.length === 0 && standingsData.length === 0) {
         // Maybe the API returned empty, but we shouldn't necessarily error if it's just an empty tournament
         // However, if we expected data, this might be a sign of a proxy issue
         console.warn('Fetched data is empty for tournament:', tournamentId);
      }

      setMatches(matchesData);
      setStandings(standingsData);
      
      // Default to first division if not set
      if (selectedDivision === 'all' && matchesData.length > 0) {
        setSelectedDivision(matchesData[0].division_name);
      } else if (selectedDivision === 'all' && standingsData.length > 0) {
        setSelectedDivision(standingsData[0].division_name);
      }
      
      setError(null);
    } catch (err: any) {
      console.error('Failed to load live data', err);
      let details = '';
      try {
        const errorData = JSON.parse(err.message);
        details = errorData.details || errorData.error || '';
      } catch (e) {
        details = err.message || 'Unknown error';
      }
      setError(`Failed to load live data: ${details}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  useEffect(() => {
    if (selectedTournamentId) {
      fetchData(selectedTournamentId);
      // Reset filters when switching tournaments
      setSelectedDivision('all');
      setSelectedGroup('all');
      
      const interval = setInterval(() => fetchData(selectedTournamentId), 300000);
      return () => clearInterval(interval);
    }
  }, [selectedTournamentId]);

  // Derived data
  // Custom group order logic
  const getGroupSortWeight = (division: string, group: string) => {
    const div = division.toLowerCase();
    const grp = group.toLowerCase();
    
    if (div.includes('competitive')) {
      if (grp.includes('ca')) return 1;
      if (grp.includes('cb')) return 2;
      if (grp.includes('cc')) return 3;
      if (grp.includes('cd')) return 4;
      return 10;
    }
    
    if (div.includes('elite')) {
      if (grp.includes('play-in')) return 50; // Ensure play-ins come after regular groups
      if (grp.includes('a1')) return 1;
      if (grp.includes('a2')) return 2;
      if (grp.includes('b1')) return 3;
      if (grp.includes('b2')) return 4;
      return 10;
    }
    
    return 100;
  };

  const divisions = Array.from(new Set([
    ...matches.map(m => m.division_name),
    ...standings.map(s => s.division_name)
  ])).sort((a, b) => {
    const getDivWeight = (name: string) => {
      const n = name.toLowerCase();
      if (n.includes('elite')) return 1;
      if (n.includes('competitive')) return 2;
      return 100;
    };
    const wA = getDivWeight(a);
    const wB = getDivWeight(b);
    if (wA !== wB) return wA - wB;
    return a.localeCompare(b);
  });

  const groups = Array.from(new Set([
    ...matches
      .filter(m => selectedDivision === 'all' || m.division_name === selectedDivision)
      .map(m => m.group_name),
    ...standings
      .filter(s => selectedDivision === 'all' || s.division_name === selectedDivision)
      .map(s => s.group_name)
  ])).sort((a, b) => {
    if (selectedDivision !== 'all') {
      const weightA = getGroupSortWeight(selectedDivision, a);
      const weightB = getGroupSortWeight(selectedDivision, b);
      if (weightA !== weightB) return weightA - weightB;
    }
    return a.localeCompare(b);
  });

  const filteredMatches = matches
    .filter(match => {
      const matchesDivision = selectedDivision === 'all' || match.division_name === selectedDivision;
      const matchesGroup = selectedGroup === 'all' || match.group_name === selectedGroup;
      const matchesStatus = statusFilter === 'all' || match.status === statusFilter;
      const matchesSearch = searchQuery === '' || 
        match.home_team?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.away_team?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.referee?.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDivision && matchesGroup && matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      // Primary sort: status (upcoming first)
      if (a.status === 'upcoming' && b.status !== 'upcoming') return -1;
      if (a.status !== 'upcoming' && b.status === 'upcoming') return 1;
      
      // Secondary sort: time
      const dateA = new Date(a.start_time).getTime();
      const dateB = new Date(b.start_time).getTime();
      
      // If upcoming, show nearest first
      if (a.status === 'upcoming') return dateA - dateB;
      // If played, show most recent first
      return dateB - dateA;
    });


  const filteredStandings = standings.filter(group => {
    const matchesDivision = selectedDivision === 'all' || group.division_name === selectedDivision;
    const matchesGroup = selectedGroup === 'all' || group.group_name === selectedGroup;
    const matchesSearch = searchQuery === '' || 
      group.standings.some(s => s.team_name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesDivision && matchesGroup && matchesSearch;
  }).map(group => {
    // If searching, only filter the standings rows
    if (searchQuery === '') return group;
    return {
      ...group,
      standings: group.standings.filter(s => s.team_name.toLowerCase().includes(searchQuery.toLowerCase()))
    };
  }).sort((a, b) => {
    // Keep divisions together, then apply custom group weight
    if (a.division_name !== b.division_name) {
      const divWeightA = divisions.indexOf(a.division_name);
      const divWeightB = divisions.indexOf(b.division_name);
      if (divWeightA !== -1 && divWeightB !== -1) return divWeightA - divWeightB;
      return a.division_name.localeCompare(b.division_name);
    }
    
    const weightA = getGroupSortWeight(a.division_name, a.group_name);
    const weightB = getGroupSortWeight(b.division_name, b.group_name);
    
    if (weightA !== weightB) return weightA - weightB;
    return a.group_name.localeCompare(b.group_name);
  });

  if (loading && matches.length === 0 && !error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p className="animate-pulse">Fetching live tournament data...</p>
      </div>
    );
  }

  return (
    <section id="schedule" className="py-8 md:py-24 px-3 md:px-6 bg-slate-900/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col mb-6 md:mb-12 gap-6 md:gap-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-500 text-[10px] font-bold mb-2 md:mb-4 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                Tournament Center
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white">
                    Schedule & Results
                  </h2>
                  <a 
                    href="https://app.sportapp.io/tournament/copenhagen-bowl" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/10 border border-blue-500/30 rounded-lg text-blue-400 text-[10px] font-bold hover:bg-blue-600/20 transition-colors uppercase tracking-widest whitespace-nowrap self-start sm:self-auto"
                  >
                    See More Info <ExternalLink size={10} />
                  </a>
                </div>
                
                <div className="flex items-center gap-2 px-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse shrink-0" />
                  <p className="text-[9px] md:text-[10px] font-bold text-white uppercase tracking-widest leading-none">
                    Please check referee duties in the app
                  </p>
                </div>
              </div>
                {tournaments.length > 1 && (
                  <div className="relative">
                    <select 
                      value={selectedTournamentId || ''} 
                      onChange={(e) => setSelectedTournamentId(Number(e.target.value))}
                      className="bg-slate-800/50 border border-slate-700 rounded-lg px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-400 appearance-none focus:outline-none focus:border-blue-500 pr-6"
                    >
                      {tournaments.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                    <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  </div>
                )}
              </div>
            
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 self-start md:self-auto">
              <button 
                onClick={() => setTab('matches')}
                className={cn(
                  "px-4 md:px-6 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-bold uppercase tracking-wider transition-all",
                  tab === 'matches' ? "bg-blue-600 text-white" : "text-slate-500 hover:text-slate-300"
                )}
              >
                Matches
              </button>
              <button 
                onClick={() => setTab('standings')}
                className={cn(
                  "px-4 md:px-6 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-bold uppercase tracking-wider transition-all",
                  tab === 'standings' ? "bg-blue-600 text-white" : "text-slate-500 hover:text-slate-300"
                )}
              >
                Standings
              </button>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-3 md:p-4 bg-slate-950/50 border border-slate-800 rounded-2xl">
            {/* Division Selector */}
            <div className="relative">
              <label className="text-[9px] uppercase font-bold text-slate-500 mb-1 block ml-1">Division</label>
              <div className="relative">
                <select 
                  value={selectedDivision} 
                  onChange={(e) => {
                    setSelectedDivision(e.target.value);
                    setSelectedGroup('all');
                    setVisibleMatches(6);
                    setVisibleGroups(3);
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-8 py-2 text-white/90 text-[11px] md:text-sm font-medium appearance-none focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="all">All Divisions</option>
                  {divisions.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <Trophy size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              </div>
            </div>

            {/* Group Selector */}
            <div className="relative">
              <label className="text-[9px] uppercase font-bold text-slate-500 mb-1 block ml-1">Group</label>
              <div className="relative">
                <select 
                  value={selectedGroup} 
                  onChange={(e) => {
                    setSelectedGroup(e.target.value);
                    setVisibleMatches(6);
                    setVisibleGroups(3);
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-8 py-2 text-white/90 text-[11px] md:text-sm font-medium appearance-none focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="all">All Groups</option>
                  {groups.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
                <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              </div>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <label className="text-[9px] uppercase font-bold text-slate-500 mb-1 block ml-1">View</label>
              <div className="relative">
                <select 
                  value={statusFilter} 
                  onChange={(e) => {
                    setStatusFilter(e.target.value as any);
                    setVisibleMatches(6);
                    setVisibleGroups(3);
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-8 py-2 text-white/90 text-[11px] md:text-sm font-medium appearance-none focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="upcoming">Upcoming Matches</option>
                  <option value="played">Played Matches</option>
                  <option value="all">All Matches</option>
                </select>
                <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              </div>
            </div>

            {/* Team Search */}
            <div className="relative">
              <label className="text-[9px] uppercase font-bold text-slate-500 mb-1 block ml-1">Search Team</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setVisibleMatches(6);
                    setVisibleGroups(3);
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-8 py-2 text-white/90 text-[11px] md:text-sm font-medium focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-700"
                />
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 p-8 rounded-3xl text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <button onClick={() => selectedTournamentId && fetchData(selectedTournamentId)} className="px-6 py-2 bg-red-500 text-white rounded-xl font-bold flex items-center gap-2 mx-auto">
              <RefreshCw size={18} /> Retry
            </button>
          </div>
        )}

        <div className="min-h-[400px]">
          <AnimatePresence mode="wait" initial={false}>
            {tab === 'matches' ? (
              <motion.div
                key="matches"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col gap-6"
              >
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredMatches.length > 0 ? (
                  filteredMatches.slice(0, visibleMatches).map((match) => (
                    <div key={match.id} className="bg-slate-950/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-4 md:p-5 group hover:border-blue-500/50 transition-colors">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                            {match.division_name} • {match.group_name}
                          </span>
                        </div>
                        <div className={cn(
                          "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter",
                          match.status === 'playing' ? "bg-red-500 text-white animate-pulse" : 
                          match.status === 'played' ? "bg-slate-800 text-slate-400" : "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                        )}>
                          {match.status === 'playing' ? 'Live' : match.status === 'played' ? 'Finished' : 'Upcoming'}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 min-w-0 pr-4">
                            <span className={cn(
                              "font-bold text-sm truncate transition-colors",
                              searchQuery && match.home_team?.name.toLowerCase().includes(searchQuery.toLowerCase()) ? "text-blue-400" : "text-slate-200"
                            )}>
                              {match.home_team?.name || 'TBD'}
                            </span>
                            {match.status === 'played' && match.home_score !== null && match.away_score !== null && match.home_score > match.away_score && (
                              <Trophy size={12} className="text-yellow-500 shrink-0" />
                            )}
                          </div>
                          <span className={cn(
                            "text-xl font-black w-6 text-center",
                            match.home_score !== null ? "text-white" : "text-slate-800"
                          )}>
                            {match.home_score ?? '-'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 min-w-0 pr-4">
                            <span className={cn(
                              "font-bold text-sm truncate transition-colors",
                              searchQuery && match.away_team?.name.toLowerCase().includes(searchQuery.toLowerCase()) ? "text-blue-400" : "text-slate-200"
                            )}>
                              {match.away_team?.name || 'TBD'}
                            </span>
                            {match.status === 'played' && match.home_score !== null && match.away_score !== null && match.away_score > match.home_score && (
                              <Trophy size={12} className="text-yellow-500 shrink-0" />
                            )}
                          </div>
                          <span className={cn(
                            "text-xl font-black w-6 text-center",
                            match.away_score !== null ? "text-white" : "text-slate-800"
                          )}>
                            {match.away_score ?? '-'}
                          </span>
                        </div>
                      </div>

                      {match.referee && (
                        <div className="mt-3 px-2 py-1.5 bg-blue-600/10 border border-blue-500/20 rounded-lg flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                            <span className="text-[7px] font-black text-white">R</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[8px] font-bold uppercase text-blue-500/70 leading-none">Referee</span>
                            <span className={cn(
                              "text-[10px] font-black truncate transition-colors",
                              searchQuery && match.referee.name.toLowerCase().includes(searchQuery.toLowerCase()) ? "text-blue-400" : "text-white"
                            )}>
                              {match.referee.name}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="mt-4 pt-4 border-t border-slate-900 flex justify-between items-center">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Calendar size={12} />
                          <span className="text-[10px] font-black uppercase">
                            {new Date(match.start_time).toLocaleTimeString('da-DK', { timeZone: 'Europe/Copenhagen', hour: '2-digit', minute: '2-digit' })} • {new Date(match.start_time).toLocaleDateString('en-US', { timeZone: 'Europe/Copenhagen', weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <MapPin size={12} />
                          <span className="text-[10px] font-bold truncate max-w-[100px]">{match.venue_name}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-16 text-center bg-slate-950/50 rounded-3xl border border-dashed border-slate-800 text-slate-600 px-6">
                    <p className="text-sm font-medium">
                      {searchQuery || selectedGroup !== 'all' || selectedDivision !== 'all' || statusFilter !== 'all' ? 'No matches match your search.' : 'No matches found yet.'}
                    </p>
                  </div>
                )}
              </div>
              
              {filteredMatches.length > visibleMatches && (
                <button 
                  onClick={() => setVisibleMatches(prev => prev + 6)}
                  className="mx-auto mt-4 px-8 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 text-xs font-bold uppercase tracking-widest hover:border-slate-600 hover:text-slate-200 transition-all flex items-center gap-2"
                >
                  Load more matches
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="standings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="space-y-8 flex flex-col"
            >
              {filteredStandings.length > 0 ? (
                filteredStandings.map((group, groupIdx) => (
                  <div key={`${group.group_name}-${groupIdx}`} className="bg-slate-950/80 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden">
                    <div className="p-4 md:p-5 bg-slate-900 border-b border-slate-800">
                      <h4 className="font-black uppercase tracking-tighter text-white flex items-center gap-2 text-sm md:text-base">
                        <Trophy size={16} className="text-yellow-500" />
                        {group.division_name} - {group.group_name}
                      </h4>
                    </div>
                    <div className="overflow-x-auto overflow-y-hidden max-w-full">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-950/50 text-[8px] md:text-[9px] uppercase font-bold tracking-widest text-slate-500">
                            <th className="px-2 py-2 w-8 text-center">#</th>
                            <th className="px-2 py-2">Team</th>
                            <th className="px-1 py-2 text-center w-8">P</th>
                            <th className="px-1 py-2 text-center w-8">W</th>
                            <th className="px-1 py-2 text-center w-8">D</th>
                            <th className="px-1 py-2 text-center w-8">L</th>
                            <th className="px-1 py-2 text-center w-10">+/-</th>
                            <th className="px-2 py-2 text-right w-10">PTS</th>
                          </tr>
                        </thead>
                        <tbody className="text-[10px] md:text-xs">
                          {group.standings.map((team) => (
                            <tr key={team.team_name} className="border-b border-slate-900/50 hover:bg-slate-900/30 transition-colors">
                              <td className="px-2 py-1.5 text-center font-bold text-slate-600">{team.position}</td>
                              <td className={cn(
                                "px-2 py-1.5 font-bold truncate transition-colors",
                                team.team_name.length > 20 ? "text-[9px] md:text-[10px]" : "",
                                searchQuery && team.team_name.toLowerCase().includes(searchQuery.toLowerCase()) ? "text-blue-400" : "text-slate-200"
                              )}>
                                {team.team_name}
                              </td>
                              <td className="px-1 py-1.5 text-center text-slate-400">{team.played}</td>
                              <td className="px-1 py-1.5 text-center text-slate-400 font-medium">{team.won}</td>
                              <td className="px-1 py-1.5 text-center text-slate-400">{team.drawn}</td>
                              <td className="px-1 py-1.5 text-center text-slate-400">{team.lost}</td>
                              <td className={cn(
                                "px-1 py-1.5 text-center font-mono text-[9px] md:text-[10px]",
                                team.points_difference > 0 ? "text-emerald-500" : team.points_difference < 0 ? "text-red-500" : "text-slate-600"
                              )}>
                                {team.points_difference > 0 ? '+' : ''}{team.points_difference}
                              </td>
                              <td className="px-2 py-1.5 text-right font-black text-blue-500">{team.points}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-16 text-center bg-slate-950/50 rounded-3xl border border-dashed border-slate-800 text-slate-600 px-6">
                  <p className="text-sm font-medium">
                    {searchQuery || selectedGroup !== 'all' || selectedDivision !== 'all' ? 'No teams match your search.' : 'No standings available yet.'}
                  </p>
                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  </section>
  );
};
