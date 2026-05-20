const BASE_URL = '/api/sportapp';

export interface SportAppMatch {
  id: number;
  home_team?: { name: string; id: number };
  away_team?: { name: string; id: number };
  referee?: { name: string; id?: number };
  home_score: number | null;
  away_score: number | null;
  start_time: string;
  end_time: string;
  venue_name: string;
  status: 'upcoming' | 'played' | 'playing';
  group_name: string;
  division_name: string;
}

export interface SportAppRefereeMatch extends SportAppMatch {
  referee_team_name?: string;
}

export interface SportAppStanding {
  team_name: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  points_for: number;
  points_against: number;
  points_difference: number;
  points: number;
  position: number;
}

export interface SportAppStandingGroup {
  group_name: string;
  division_name: string;
  standings: SportAppStanding[];
}

export interface SportAppTournament {
  id: number;
  name: string;
}

const adjustTime = (dateStr: string) => {
  if (!dateStr) return dateStr;
  try {
    const date = new Date(dateStr);
    // API times are usually 1 hour earlier than they should be
    date.setHours(date.getHours() + 1);
    return date.toISOString();
  } catch (e) {
    return dateStr;
  }
};

export const sportAppService = {
  async getTournaments(): Promise<SportAppTournament[]> {
    try {
      const response = await fetch(`${BASE_URL}/tournaments`);
      if (!response.ok) {
        throw new Error(`Failed to fetch tournaments: ${response.status}`);
      }
      const json = await response.json();
      return json.data || [];
    } catch (error: any) {
      console.error('Error fetching tournaments:', error);
      throw new Error(`Connection error: ${error.message}`);
    }
  },

  async getMatches(tournamentId: number): Promise<SportAppMatch[]> {
    try {
      const response = await fetch(`${BASE_URL}/matches?tournament=${tournamentId}`);
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const json = await response.json();
      const data = json.data || [];
      
      const flatMatches: SportAppMatch[] = [];
      data.forEach((divisionEntry: any) => {
        const division_name = divisionEntry.division?.name || 'Unknown';
        divisionEntry.groups?.forEach((groupEntry: any) => {
          const group_name = groupEntry.group?.name || 'Unknown';
          const isPlayoffGroup = groupEntry.group?.is_playoff === true;
          
          groupEntry.matches?.forEach((match: any) => {
            const referees = match.referees || [];
            const refereeFromList = referees.length > 0 ? (referees[0].official?.name || referees[0].official_name) : undefined;
            
            const refereeName = match.referee_team?.name || 
                              match.referee?.name || 
                              match.official?.name || 
                              (match.officials && match.officials.length > 0 ? match.officials[0].name : undefined) ||
                              match.duty_team?.name ||
                              refereeFromList;

            const homeScore = match.result?.home_score;
            const awayScore = match.result?.away_score;
            const hasScores = homeScore !== null && homeScore !== undefined && 
                             awayScore !== null && awayScore !== undefined;
            
            const statusName = match.status?.name?.toLowerCase() || '';
            const isPlayed = statusName.includes('finished') || hasScores;

            if (isPlayoffGroup && !isPlayed && !match.home && !match.away) {
              return;
            }

            flatMatches.push({
              id: match.id,
              home_team: match.home ? { name: match.home.name, id: match.home.id } : undefined,
              away_team: match.away ? { name: match.away.name, id: match.away.id } : undefined,
              referee: refereeName ? { name: refereeName } : undefined,
              home_score: homeScore ?? null,
              away_score: awayScore ?? null,
              start_time: adjustTime(match.date),
              end_time: adjustTime(match.end_date),
              venue_name: match.venue?.name || 'TBD',
              status: (statusName.includes('playing') ? 'playing' : 
                       isPlayed ? 'played' : 'upcoming') as any,
              group_name: group_name,
              division_name: division_name
            });
          });
        });
      });
      
      return flatMatches;
    } catch (error: any) {
      console.error('Error fetching matches:', error);
      throw new Error(`Connection error: ${error.message}`);
    }
  },

  async getRefereeMatches(tournamentId: number): Promise<SportAppRefereeMatch[]> {
    try {
      const response = await fetch(`${BASE_URL}/referee-matches?tournament=${tournamentId}`);
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const json = await response.json();
      const data = json.data || [];
      
      const flatMatches: SportAppRefereeMatch[] = [];
      data.forEach((divisionEntry: any) => {
        const division_name = divisionEntry.division?.name || 'Unknown';
        divisionEntry.groups?.forEach((groupEntry: any) => {
          const group_name = groupEntry.group?.name || 'Unknown';
          groupEntry.matches?.forEach((match: any) => {
            const referees = match.referees || [];
            const refereeName = referees.length > 0 ? (referees[0].official?.name || referees[0].official_name) : undefined;

            const homeScore = match.result?.home_score;
            const awayScore = match.result?.away_score;
            const hasScores = homeScore !== null && homeScore !== undefined && 
                             awayScore !== null && awayScore !== undefined;
            
            const statusName = match.status?.name?.toLowerCase() || '';
            const isPlayed = statusName.includes('finished') || hasScores;

            flatMatches.push({
              id: match.id,
              home_team: match.home ? { name: match.home.name, id: match.home.id } : undefined,
              away_team: match.away ? { name: match.away.name, id: match.away.id } : undefined,
              referee: refereeName ? { name: refereeName } : undefined,
              referee_team_name: refereeName,
              home_score: homeScore ?? null,
              away_score: awayScore ?? null,
              start_time: adjustTime(match.date),
              end_time: adjustTime(match.end_date),
              venue_name: match.venue?.name || 'TBD',
              status: (statusName.includes('playing') ? 'playing' : 
                       isPlayed ? 'played' : 'upcoming') as any,
              group_name: group_name,
              division_name: division_name
            });
          });
        });
      });
      
      return flatMatches;
    } catch (error: any) {
      console.error('Error fetching referee matches:', error);
      throw new Error(`Connection error: ${error.message}`);
    }
  },

  async getStandings(tournamentId: number): Promise<SportAppStandingGroup[]> {
    try {
      const response = await fetch(`${BASE_URL}/standings?tournament=${tournamentId}`);
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      const json = await response.json();
      const data = json.data || [];
      
      const groups: SportAppStandingGroup[] = [];
      data.forEach((entry: any) => {
        if (entry.standings && entry.standings.length > 0) {
          groups.push({
            group_name: entry.group?.name || 'Unknown',
            division_name: entry.division?.name || 'Unknown',
            standings: entry.standings.map((s: any) => ({
              team_name: s.team?.name || 'Unknown',
              played: s.stats?.matches || 0,
              won: s.stats?.wins || 0,
              drawn: s.stats?.draws || 0,
              lost: s.stats?.losses || 0,
              points_for: s.stats?.score || 0,
              points_against: s.stats?.scoreAgainst || 0,
              points_difference: (s.stats?.score || 0) - (s.stats?.scoreAgainst || 0),
              points: s.stats?.points || 0,
              position: s.num || 0
            }))
          });
        }
      });
      
      return groups;
    } catch (error: any) {
      console.error('Error fetching standings:', error);
      throw new Error(`Connection error: ${error.message}`);
    }
  }
};
