import { describe, expect, it } from 'vitest';
import {
  WORLD_CUP_2026_QUARTERFINALISTS,
  WORLD_CUP_2026_QUARTERFINALS,
  expectedGoalsForFixture,
} from './worldCup2026';

describe('WORLD_CUP_2026_QUARTERFINALISTS', () => {
  it('has one record per quarterfinalist with 5 matches played', () => {
    expect(WORLD_CUP_2026_QUARTERFINALISTS).toHaveLength(8);
    for (const team of WORLD_CUP_2026_QUARTERFINALISTS) {
      expect(team.matchesPlayed).toBe(5);
      expect(team.goalsFor).toBeGreaterThan(0);
      expect(team.goalsAgainst).toBeGreaterThanOrEqual(0);
    }
  });
});

describe('WORLD_CUP_2026_QUARTERFINALS', () => {
  it('lists all four fixtures using teams from the quarterfinalist list', () => {
    expect(WORLD_CUP_2026_QUARTERFINALS).toHaveLength(4);
    const names = new Set(WORLD_CUP_2026_QUARTERFINALISTS.map((t) => t.name));
    for (const fixture of WORLD_CUP_2026_QUARTERFINALS) {
      expect(names.has(fixture.teamA)).toBe(true);
      expect(names.has(fixture.teamB)).toBe(true);
    }
  });
});

describe('expectedGoalsForFixture', () => {
  it('favors the team with the better attack/defense record', () => {
    // Spain: 9 GF / 0 GA in 5 games vs Norway: 12 GF / 9 GA in 5 games
    const { lambdaA, lambdaB } = expectedGoalsForFixture('Spain', 'Norway');
    expect(lambdaA).toBeGreaterThan(0);
    expect(lambdaB).toBeGreaterThan(0);
    // Spain's defense (0 conceded) should suppress Norway's expected goals
    // well below Norway's own scoring rate (12/5 = 2.4).
    expect(lambdaB).toBeLessThan(12 / 5);
  });

  it('falls back to the tournament average for unknown teams', () => {
    const { lambdaA, lambdaB } = expectedGoalsForFixture('Nowhere', 'Nowhere Else');
    expect(lambdaA).toBe(lambdaB);
  });
});
