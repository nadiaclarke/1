// Core math: independent-Poisson scoreline model with an optional
// Dixon-Coles low-score correlation adjustment.

export interface MatrixOptions {
  /** Highest goal count computed internally (accuracy tail). */
  internalMaxGoals: number;
  /** Apply the Dixon-Coles tau adjustment to the 0-0/1-0/0-1/1-1 cells. */
  useDixonColes: boolean;
  /** Dixon-Coles correlation parameter (typically -0.2 .. 0.2). */
  rho: number;
}

export interface ScoreCell {
  home: number;
  away: number;
  probability: number;
}

const factorialCache: number[] = [1];
function factorial(n: number): number {
  for (let i = factorialCache.length; i <= n; i++) {
    factorialCache[i] = factorialCache[i - 1] * i;
  }
  return factorialCache[n];
}

export function poissonPmf(k: number, lambda: number): number {
  if (lambda <= 0) return k === 0 ? 1 : 0;
  return (Math.exp(-lambda) * Math.pow(lambda, k)) / factorial(k);
}

/** Dixon-Coles (1997) tau adjustment for the four low-score cells. */
export function dixonColesTau(
  x: number,
  y: number,
  lambdaHome: number,
  lambdaAway: number,
  rho: number
): number {
  if (x === 0 && y === 0) return 1 - lambdaHome * lambdaAway * rho;
  if (x === 0 && y === 1) return 1 + lambdaHome * rho;
  if (x === 1 && y === 0) return 1 + lambdaAway * rho;
  if (x === 1 && y === 1) return 1 - rho;
  return 1;
}

export interface TeamStatsInput {
  leagueAvgHomeGoals: number;
  leagueAvgAwayGoals: number;
  homeTeamHomeGoalsFor: number;
  homeTeamHomeGoalsAgainst: number;
  awayTeamAwayGoalsFor: number;
  awayTeamAwayGoalsAgainst: number;
}

export interface ExpectedGoals {
  lambdaHome: number;
  lambdaAway: number;
}

/** Classic attack/defense-strength Poisson model. */
export function expectedGoalsFromTeamStats(input: TeamStatsInput): ExpectedGoals {
  const {
    leagueAvgHomeGoals,
    leagueAvgAwayGoals,
    homeTeamHomeGoalsFor,
    homeTeamHomeGoalsAgainst,
    awayTeamAwayGoalsFor,
    awayTeamAwayGoalsAgainst,
  } = input;

  const homeAttack = homeTeamHomeGoalsFor / leagueAvgHomeGoals;
  const homeDefense = homeTeamHomeGoalsAgainst / leagueAvgAwayGoals;
  const awayAttack = awayTeamAwayGoalsFor / leagueAvgAwayGoals;
  const awayDefense = awayTeamAwayGoalsAgainst / leagueAvgHomeGoals;

  return {
    lambdaHome: homeAttack * awayDefense * leagueAvgHomeGoals,
    lambdaAway: awayAttack * homeDefense * leagueAvgAwayGoals,
  };
}

/**
 * Builds a (internalMaxGoals+1) x (internalMaxGoals+1) probability matrix,
 * matrix[home][away], normalized to sum to 1.
 */
export function buildScoreMatrix(
  lambdaHome: number,
  lambdaAway: number,
  options: MatrixOptions
): number[][] {
  const { internalMaxGoals, useDixonColes, rho } = options;
  const matrix: number[][] = [];

  for (let h = 0; h <= internalMaxGoals; h++) {
    const row: number[] = [];
    for (let a = 0; a <= internalMaxGoals; a++) {
      let p = poissonPmf(h, lambdaHome) * poissonPmf(a, lambdaAway);
      if (useDixonColes) {
        p *= dixonColesTau(h, a, lambdaHome, lambdaAway, rho);
      }
      row.push(Math.max(p, 0));
    }
    matrix.push(row);
  }

  const total = matrix.reduce((sum, row) => sum + row.reduce((s, v) => s + v, 0), 0);
  if (total > 0) {
    for (let h = 0; h <= internalMaxGoals; h++) {
      for (let a = 0; a <= internalMaxGoals; a++) {
        matrix[h][a] /= total;
      }
    }
  }
  return matrix;
}

export interface MatchOutcomeProbabilities {
  homeWin: number;
  draw: number;
  awayWin: number;
}

export function matchOutcomeProbabilities(matrix: number[][]): MatchOutcomeProbabilities {
  let homeWin = 0;
  let draw = 0;
  let awayWin = 0;
  for (let h = 0; h < matrix.length; h++) {
    for (let a = 0; a < matrix[h].length; a++) {
      if (h > a) homeWin += matrix[h][a];
      else if (h === a) draw += matrix[h][a];
      else awayWin += matrix[h][a];
    }
  }
  return { homeWin, draw, awayWin };
}

export function bttsProbability(matrix: number[][]): { yes: number; no: number } {
  let yes = 0;
  for (let h = 1; h < matrix.length; h++) {
    for (let a = 1; a < matrix[h].length; a++) {
      yes += matrix[h][a];
    }
  }
  return { yes, no: 1 - yes };
}

export function overUnderProbability(
  matrix: number[][],
  line: number
): { over: number; under: number } {
  let over = 0;
  for (let h = 0; h < matrix.length; h++) {
    for (let a = 0; a < matrix[h].length; a++) {
      if (h + a > line) over += matrix[h][a];
    }
  }
  return { over, under: 1 - over };
}

export function topScorelines(matrix: number[][], count: number): ScoreCell[] {
  const cells: ScoreCell[] = [];
  for (let h = 0; h < matrix.length; h++) {
    for (let a = 0; a < matrix[h].length; a++) {
      cells.push({ home: h, away: a, probability: matrix[h][a] });
    }
  }
  return cells.sort((a, b) => b.probability - a.probability).slice(0, count);
}

export function displayedMass(matrix: number[][], displayMaxGoals: number): number {
  let sum = 0;
  for (let h = 0; h <= displayMaxGoals && h < matrix.length; h++) {
    for (let a = 0; a <= displayMaxGoals && a < matrix[h].length; a++) {
      sum += matrix[h][a];
    }
  }
  return sum;
}
