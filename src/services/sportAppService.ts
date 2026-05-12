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

export const sportAppService = {
  async getTournaments(): Promise<SportAppTournament[]> {
    try {
      const response = await fetch(`${BASE_URL}/tournaments`);
      if (!response.ok) {
        const text = await response.text();
        console.error(`Tournaments fetch failed (${response.status}):`, text.substring(0, 200));
        throw new Error(`Failed to fetch tournaments: ${response.status}`);
      }
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Expected JSON but received:', text.substring(0, 200));
        throw new Error('API returned invalid non-JSON response. Check proxy configuration.');
      }
      const json = await response.json();
      return json.data || [];
    } catch (error: any) {
      console.error('Error fetching tournaments:', error);
      throw error; // Throw so component can show the error
    }
  },

  async getMatches(tournamentId: number): Promise<SportAppMatch[]> {
    try {
      const response = await fetch(`${BASE_URL}/matches?tournament=${tournamentId}`);
      if (!response.ok) {
        let errorDetails = `Server error: ${response.status} ${response.statusText}`;
        try {
          const errorJson = await response.json();
          errorDetails = errorJson.details || errorJson.error || errorDetails;
        } catch (e) {
          // Response is not JSON
        }
        console.error(errorDetails);
        throw new Error(errorDetails);
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
          const refereeName = match.referee_team?.name || 
                            match.referee?.name || 
                            match.official?.name || 
                            (match.officials && match.officials.length > 0 ? match.officials[0].name : undefined) ||
                            match.duty_team?.name;

          // Scores are nested in the result object in the provided JSON
          const homeScore = match.result?.home_score;
          const awayScore = match.result?.away_score;
          const hasScores = homeScore !== null && homeScore !== undefined && 
                           awayScore !== null && awayScore !== undefined;
          
          const statusName = match.status?.name?.toLowerCase() || '';
          const isPlayed = statusName.includes('finished') || hasScores;

          // Skip playoff matches that haven't been played yet to avoid placholders/future brackets in the list
          if (isPlayoffGroup && !isPlayed) {
            return;
          }

          flatMatches.push({
            id: match.id,
            home_team: match.home ? { name: match.home.name, id: match.home.id } : undefined,
            away_team: match.away ? { name: match.away.name, id: match.away.id } : undefined,
            referee: refereeName ? { name: refereeName } : undefined,
            home_score: homeScore ?? null,
            away_score: awayScore ?? null,
            start_time: match.date,
            end_time: match.end_date,
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
      throw error;
    }
  },

  async getStandings(tournamentId: number): Promise<SportAppStandingGroup[]> {
    try {
      const response = await fetch(`${BASE_URL}/standings?tournament=${tournamentId}`);
      if (!response.ok) throw new Error('Failed to fetch standings');
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Expected JSON standings but received:', text.substring(0, 200));
        throw new Error('API returned invalid non-JSON response for standings.');
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
      throw error;
    }
  }
};
