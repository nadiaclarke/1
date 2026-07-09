import { describe, expect, it } from 'vitest';
import {
  bttsProbability,
  buildScoreMatrix,
  expectedGoalsFromTeamStats,
  matchOutcomeProbabilities,
  overUnderProbability,
  poissonPmf,
  topScorelines,
} from './poisson';

describe('poissonPmf', () => {
  it('matches known values', () => {
    expect(poissonPmf(0, 1)).toBeCloseTo(Math.exp(-1), 10);
    expect(poissonPmf(2, 2)).toBeCloseTo(0.2706705664732254, 10);
  });

  it('handles zero expected goals', () => {
    expect(poissonPmf(0, 0)).toBe(1);
    expect(poissonPmf(1, 0)).toBe(0);
  });
});

describe('buildScoreMatrix', () => {
  it('sums to 1 without Dixon-Coles', () => {
    const matrix = buildScoreMatrix(1.4, 1.1, {
      internalMaxGoals: 12,
      useDixonColes: false,
      rho: 0,
    });
    const total = matrix.reduce((s, row) => s + row.reduce((a, b) => a + b, 0), 0);
    expect(total).toBeCloseTo(1, 8);
  });

  it('still sums to 1 with Dixon-Coles applied', () => {
    const matrix = buildScoreMatrix(1.4, 1.1, {
      internalMaxGoals: 12,
      useDixonColes: true,
      rho: -0.1,
    });
    const total = matrix.reduce((s, row) => s + row.reduce((a, b) => a + b, 0), 0);
    expect(total).toBeCloseTo(1, 8);
  });

  it('is symmetric for equal lambdas', () => {
    const matrix = buildScoreMatrix(1.3, 1.3, {
      internalMaxGoals: 10,
      useDixonColes: false,
      rho: 0,
    });
    expect(matrix[2][1]).toBeCloseTo(matrix[1][2], 10);
  });
});

describe('match outcome / btts / over-under', () => {
  const matrix = buildScoreMatrix(1.8, 1.1, {
    internalMaxGoals: 12,
    useDixonColes: true,
    rho: -0.1,
  });

  it('outcome probabilities sum to 1', () => {
    const { homeWin, draw, awayWin } = matchOutcomeProbabilities(matrix);
    expect(homeWin + draw + awayWin).toBeCloseTo(1, 8);
    // stronger home side should be favored
    expect(homeWin).toBeGreaterThan(awayWin);
  });

  it('btts yes/no sum to 1', () => {
    const { yes, no } = bttsProbability(matrix);
    expect(yes + no).toBeCloseTo(1, 8);
  });

  it('over/under a given line sum to 1', () => {
    const { over, under } = overUnderProbability(matrix, 2.5);
    expect(over + under).toBeCloseTo(1, 8);
  });
});

describe('topScorelines', () => {
  it('returns results sorted descending', () => {
    const matrix = buildScoreMatrix(1.5, 1.2, {
      internalMaxGoals: 10,
      useDixonColes: false,
      rho: 0,
    });
    const top = topScorelines(matrix, 5);
    expect(top).toHaveLength(5);
    for (let i = 1; i < top.length; i++) {
      expect(top[i - 1].probability).toBeGreaterThanOrEqual(top[i].probability);
    }
    // 1-0 or 1-1 type low scores should dominate for these lambdas
    expect(top[0].home + top[0].away).toBeLessThan(5);
  });
});

describe('expectedGoalsFromTeamStats', () => {
  it('reduces to league average when all inputs equal league average', () => {
    const { lambdaHome, lambdaAway } = expectedGoalsFromTeamStats({
      leagueAvgHomeGoals: 1.5,
      leagueAvgAwayGoals: 1.1,
      homeTeamHomeGoalsFor: 1.5,
      homeTeamHomeGoalsAgainst: 1.1,
      awayTeamAwayGoalsFor: 1.1,
      awayTeamAwayGoalsAgainst: 1.5,
    });
    expect(lambdaHome).toBeCloseTo(1.5, 10);
    expect(lambdaAway).toBeCloseTo(1.1, 10);
  });

  it('rewards a strong attack against a weak defense', () => {
    const { lambdaHome } = expectedGoalsFromTeamStats({
      leagueAvgHomeGoals: 1.5,
      leagueAvgAwayGoals: 1.1,
      homeTeamHomeGoalsFor: 2.5,
      homeTeamHomeGoalsAgainst: 1.0,
      awayTeamAwayGoalsFor: 0.8,
      awayTeamAwayGoalsAgainst: 2.0,
    });
    expect(lambdaHome).toBeGreaterThan(2.5);
  });
});
