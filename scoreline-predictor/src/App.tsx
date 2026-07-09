import { useMemo, useState } from 'react';
import './App.css';
import { PredictionForm } from './components/PredictionForm';
import { ResultsSummary } from './components/ResultsSummary';
import { ScorelineHeatmap } from './components/ScorelineHeatmap';
import { TopScorelines } from './components/TopScorelines';
import {
  bttsProbability,
  buildScoreMatrix,
  displayedMass as computeDisplayedMass,
  expectedGoalsFromTeamStats,
  matchOutcomeProbabilities,
  overUnderProbability,
  topScorelines,
} from './lib/poisson';
import type { AdvancedSettings, InputMode, QuickInputs, TeamStatsInputs } from './lib/types';

const DEFAULT_QUICK: QuickInputs = {
  homeTeam: 'Home FC',
  awayTeam: 'Away United',
  homeXg: 1.6,
  awayXg: 1.1,
};

const DEFAULT_TEAM_STATS: TeamStatsInputs = {
  homeTeam: 'Home FC',
  awayTeam: 'Away United',
  leagueAvgHomeGoals: 1.5,
  leagueAvgAwayGoals: 1.15,
  homeTeamHomeGoalsFor: 1.9,
  homeTeamHomeGoalsAgainst: 1.0,
  awayTeamAwayGoalsFor: 1.0,
  awayTeamAwayGoalsAgainst: 1.5,
};

const DEFAULT_ADVANCED: AdvancedSettings = {
  useDixonColes: true,
  rho: -0.1,
  displayMaxGoals: 6,
};

const EXAMPLE_QUICK: QuickInputs = {
  homeTeam: 'Riverside City',
  awayTeam: 'Harbor Town',
  homeXg: 2.1,
  awayXg: 0.9,
};

const EXAMPLE_TEAM_STATS: TeamStatsInputs = {
  homeTeam: 'Riverside City',
  awayTeam: 'Harbor Town',
  leagueAvgHomeGoals: 1.5,
  leagueAvgAwayGoals: 1.15,
  homeTeamHomeGoalsFor: 2.3,
  homeTeamHomeGoalsAgainst: 0.8,
  awayTeamAwayGoalsFor: 0.9,
  awayTeamAwayGoalsAgainst: 1.9,
};

const INTERNAL_MAX_GOALS = 12;

export default function App() {
  const [mode, setMode] = useState<InputMode>('quick');
  const [quick, setQuick] = useState<QuickInputs>(DEFAULT_QUICK);
  const [teamStats, setTeamStats] = useState<TeamStatsInputs>(DEFAULT_TEAM_STATS);
  const [advanced, setAdvanced] = useState<AdvancedSettings>(DEFAULT_ADVANCED);

  const homeTeam = mode === 'quick' ? quick.homeTeam : teamStats.homeTeam;
  const awayTeam = mode === 'quick' ? quick.awayTeam : teamStats.awayTeam;

  const { lambdaHome, lambdaAway } = useMemo(() => {
    if (mode === 'quick') {
      return { lambdaHome: quick.homeXg, lambdaAway: quick.awayXg };
    }
    return expectedGoalsFromTeamStats({
      leagueAvgHomeGoals: teamStats.leagueAvgHomeGoals,
      leagueAvgAwayGoals: teamStats.leagueAvgAwayGoals,
      homeTeamHomeGoalsFor: teamStats.homeTeamHomeGoalsFor,
      homeTeamHomeGoalsAgainst: teamStats.homeTeamHomeGoalsAgainst,
      awayTeamAwayGoalsFor: teamStats.awayTeamAwayGoalsFor,
      awayTeamAwayGoalsAgainst: teamStats.awayTeamAwayGoalsAgainst,
    });
  }, [mode, quick, teamStats]);

  const safeLambdaHome = Number.isFinite(lambdaHome) && lambdaHome >= 0 ? lambdaHome : 0;
  const safeLambdaAway = Number.isFinite(lambdaAway) && lambdaAway >= 0 ? lambdaAway : 0;

  const matrix = useMemo(
    () =>
      buildScoreMatrix(safeLambdaHome, safeLambdaAway, {
        internalMaxGoals: INTERNAL_MAX_GOALS,
        useDixonColes: advanced.useDixonColes,
        rho: advanced.rho,
      }),
    [safeLambdaHome, safeLambdaAway, advanced.useDixonColes, advanced.rho]
  );

  const outcome = useMemo(() => matchOutcomeProbabilities(matrix), [matrix]);
  const btts = useMemo(() => bttsProbability(matrix), [matrix]);
  const overUnder15 = useMemo(() => overUnderProbability(matrix, 1.5), [matrix]);
  const overUnder25 = useMemo(() => overUnderProbability(matrix, 2.5), [matrix]);
  const overUnder35 = useMemo(() => overUnderProbability(matrix, 3.5), [matrix]);
  const top = useMemo(() => topScorelines(matrix, 8), [matrix]);
  const mass = useMemo(
    () => computeDisplayedMass(matrix, advanced.displayMaxGoals),
    [matrix, advanced.displayMaxGoals]
  );

  function handleLoadExample() {
    if (mode === 'quick') {
      setQuick(EXAMPLE_QUICK);
    } else {
      setTeamStats(EXAMPLE_TEAM_STATS);
    }
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Scoreline Predictor</h1>
        <p className="app-subtitle">
          Estimate the probability of every scoreline for a soccer match using a Poisson
          goals model.
        </p>
      </header>

      <main className="app-grid">
        <PredictionForm
          mode={mode}
          onModeChange={setMode}
          quick={quick}
          onQuickChange={setQuick}
          teamStats={teamStats}
          onTeamStatsChange={setTeamStats}
          advanced={advanced}
          onAdvancedChange={setAdvanced}
          onLoadExample={handleLoadExample}
        />

        <div className="results-column">
          <ResultsSummary
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            lambdaHome={safeLambdaHome}
            lambdaAway={safeLambdaAway}
            outcome={outcome}
            btts={btts}
            overUnder15={overUnder15}
            overUnder25={overUnder25}
            overUnder35={overUnder35}
          />
          <TopScorelines scorelines={top} homeTeam={homeTeam} awayTeam={awayTeam} />
          <ScorelineHeatmap
            matrix={matrix}
            displayMaxGoals={advanced.displayMaxGoals}
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            displayedMass={mass}
          />
        </div>
      </main>

      <footer className="app-footer">
        <p>
          Model: independent Poisson distributions from each team's expected goals, with an
          optional Dixon-Coles adjustment for low-scoring correlation. Predictions are
          statistical estimates, not guarantees.
        </p>
      </footer>
    </div>
  );
}
