export type InputMode = 'quick' | 'teamStats';

export interface QuickInputs {
  homeTeam: string;
  awayTeam: string;
  homeXg: number;
  awayXg: number;
}

export interface TeamStatsInputs {
  homeTeam: string;
  awayTeam: string;
  leagueAvgHomeGoals: number;
  leagueAvgAwayGoals: number;
  homeTeamHomeGoalsFor: number;
  homeTeamHomeGoalsAgainst: number;
  awayTeamAwayGoalsFor: number;
  awayTeamAwayGoalsAgainst: number;
}

export interface AdvancedSettings {
  useDixonColes: boolean;
  rho: number;
  displayMaxGoals: number;
}
