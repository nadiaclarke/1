import {
  WORLD_CUP_2026_QUARTERFINALISTS,
  WORLD_CUP_2026_QUARTERFINALS,
  findTeamRecord,
} from '../lib/worldCup2026';
import type {
  AdvancedSettings,
  InputMode,
  QuickInputs,
  TeamStatsInputs,
  WorldCup2026Inputs,
} from '../lib/types';

interface Props {
  mode: InputMode;
  onModeChange: (mode: InputMode) => void;
  quick: QuickInputs;
  onQuickChange: (next: QuickInputs) => void;
  teamStats: TeamStatsInputs;
  onTeamStatsChange: (next: TeamStatsInputs) => void;
  worldCup: WorldCup2026Inputs;
  onWorldCupChange: (next: WorldCup2026Inputs) => void;
  advanced: AdvancedSettings;
  onAdvancedChange: (next: AdvancedSettings) => void;
  onLoadExample: () => void;
}

function NumberField({
  label,
  value,
  onChange,
  min = 0,
  max = 10,
  step = 0.1,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <input
        type="number"
        className="field-input"
        value={Number.isFinite(value) ? value : 0}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(e.target.valueAsNumber)}
      />
    </label>
  );
}

function TeamRecordCard({ teamName }: { teamName: string }) {
  const record = findTeamRecord(teamName);
  if (!record) return null;
  return (
    <p className="hint-inline">
      {record.name} this World Cup: {record.matchesPlayed} played, {record.goalsFor} GF,{' '}
      {record.goalsAgainst} GA ({(record.goalsFor / record.matchesPlayed).toFixed(2)} /{' '}
      {(record.goalsAgainst / record.matchesPlayed).toFixed(2)} per game)
    </p>
  );
}

export function PredictionForm({
  mode,
  onModeChange,
  quick,
  onQuickChange,
  teamStats,
  onTeamStatsChange,
  worldCup,
  onWorldCupChange,
  advanced,
  onAdvancedChange,
  onLoadExample,
}: Props) {
  const teamNames = mode === 'quick' ? quick : teamStats;

  return (
    <section className="panel">
      <div className="panel-header-row">
        <h2 className="panel-title">Match setup</h2>
        {mode !== 'worldCup2026' && (
          <button type="button" className="ghost-button" onClick={onLoadExample}>
            Load example
          </button>
        )}
      </div>

      <div className="segmented" role="tablist" aria-label="Input mode">
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'quick'}
          className={mode === 'quick' ? 'segmented-option active' : 'segmented-option'}
          onClick={() => onModeChange('quick')}
        >
          Expected goals
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'teamStats'}
          className={mode === 'teamStats' ? 'segmented-option active' : 'segmented-option'}
          onClick={() => onModeChange('teamStats')}
        >
          Team form stats
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'worldCup2026'}
          className={mode === 'worldCup2026' ? 'segmented-option active' : 'segmented-option'}
          onClick={() => onModeChange('worldCup2026')}
        >
          2026 World Cup
        </button>
      </div>

      {mode === 'worldCup2026' ? (
        <>
          <p className="hint">
            Real quarterfinalist data through the round of 16 (as of July 9, 2026). Expected
            goals are derived from each team's goals-for/against per game this tournament,
            with no home advantage since these are neutral-venue knockout matches.
          </p>

          <div className="fixture-picks">
            {WORLD_CUP_2026_QUARTERFINALS.map((fixture) => (
              <button
                key={`${fixture.teamA}-${fixture.teamB}`}
                type="button"
                className="fixture-pick-button"
                onClick={() => onWorldCupChange({ teamA: fixture.teamA, teamB: fixture.teamB })}
              >
                <span className="fixture-pick-teams">
                  {fixture.teamA} vs {fixture.teamB}
                </span>
                <span className="fixture-pick-meta">
                  {fixture.date} - {fixture.venue}
                </span>
              </button>
            ))}
          </div>

          <div className="team-name-row">
            <label className="field">
              <span className="field-label">Team A</span>
              <select
                className="field-input"
                value={worldCup.teamA}
                onChange={(e) => onWorldCupChange({ ...worldCup, teamA: e.target.value })}
              >
                {WORLD_CUP_2026_QUARTERFINALISTS.map((t) => (
                  <option key={t.name} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>
              <TeamRecordCard teamName={worldCup.teamA} />
            </label>
            <label className="field">
              <span className="field-label">Team B</span>
              <select
                className="field-input"
                value={worldCup.teamB}
                onChange={(e) => onWorldCupChange({ ...worldCup, teamB: e.target.value })}
              >
                {WORLD_CUP_2026_QUARTERFINALISTS.map((t) => (
                  <option key={t.name} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>
              <TeamRecordCard teamName={worldCup.teamB} />
            </label>
          </div>
        </>
      ) : (
        <div className="team-name-row">
          <label className="field">
            <span className="field-label">Home team</span>
            <input
              type="text"
              className="field-input"
              value={teamNames.homeTeam}
              onChange={(e) =>
                mode === 'quick'
                  ? onQuickChange({ ...quick, homeTeam: e.target.value })
                  : onTeamStatsChange({ ...teamStats, homeTeam: e.target.value })
              }
            />
          </label>
          <label className="field">
            <span className="field-label">Away team</span>
            <input
              type="text"
              className="field-input"
              value={teamNames.awayTeam}
              onChange={(e) =>
                mode === 'quick'
                  ? onQuickChange({ ...quick, awayTeam: e.target.value })
                  : onTeamStatsChange({ ...teamStats, awayTeam: e.target.value })
              }
            />
          </label>
        </div>
      )}

      {mode === 'quick' && (
        <div className="field-grid">
          <NumberField
            label={`${quick.homeTeam || 'Home'} expected goals`}
            value={quick.homeXg}
            onChange={(v) => onQuickChange({ ...quick, homeXg: v })}
            max={6}
          />
          <NumberField
            label={`${quick.awayTeam || 'Away'} expected goals`}
            value={quick.awayXg}
            onChange={(v) => onQuickChange({ ...quick, awayXg: v })}
            max={6}
          />
        </div>
      )}

      {mode === 'teamStats' && (
        <>
          <p className="hint">
            Attack/defense strength model: each team's goal rates are compared to the
            league average to estimate expected goals for this matchup.
          </p>
          <div className="field-grid">
            <NumberField
              label="League avg. home goals/game"
              value={teamStats.leagueAvgHomeGoals}
              onChange={(v) => onTeamStatsChange({ ...teamStats, leagueAvgHomeGoals: v })}
              min={0.1}
              max={4}
            />
            <NumberField
              label="League avg. away goals/game"
              value={teamStats.leagueAvgAwayGoals}
              onChange={(v) => onTeamStatsChange({ ...teamStats, leagueAvgAwayGoals: v })}
              min={0.1}
              max={4}
            />
          </div>
          <div className="field-grid">
            <NumberField
              label={`${teamStats.homeTeam || 'Home'} goals for (home)`}
              value={teamStats.homeTeamHomeGoalsFor}
              onChange={(v) => onTeamStatsChange({ ...teamStats, homeTeamHomeGoalsFor: v })}
              max={6}
            />
            <NumberField
              label={`${teamStats.homeTeam || 'Home'} goals against (home)`}
              value={teamStats.homeTeamHomeGoalsAgainst}
              onChange={(v) => onTeamStatsChange({ ...teamStats, homeTeamHomeGoalsAgainst: v })}
              max={6}
            />
          </div>
          <div className="field-grid">
            <NumberField
              label={`${teamStats.awayTeam || 'Away'} goals for (away)`}
              value={teamStats.awayTeamAwayGoalsFor}
              onChange={(v) => onTeamStatsChange({ ...teamStats, awayTeamAwayGoalsFor: v })}
              max={6}
            />
            <NumberField
              label={`${teamStats.awayTeam || 'Away'} goals against (away)`}
              value={teamStats.awayTeamAwayGoalsAgainst}
              onChange={(v) => onTeamStatsChange({ ...teamStats, awayTeamAwayGoalsAgainst: v })}
              max={6}
            />
          </div>
        </>
      )}

      <details className="advanced-details">
        <summary>Advanced: model settings</summary>
        <div className="advanced-body">
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={advanced.useDixonColes}
              onChange={(e) => onAdvancedChange({ ...advanced, useDixonColes: e.target.checked })}
            />
            <span>
              Apply Dixon-Coles low-score correction
              <span className="hint-inline">
                {' '}
                (adjusts 0-0, 1-0, 0-1, 1-1 for observed correlation between low scores)
              </span>
            </span>
          </label>
          {advanced.useDixonColes && (
            <label className="field">
              <span className="field-label">Rho (correlation strength): {advanced.rho.toFixed(2)}</span>
              <input
                type="range"
                min={-0.2}
                max={0.2}
                step={0.01}
                value={advanced.rho}
                onChange={(e) => onAdvancedChange({ ...advanced, rho: Number(e.target.value) })}
              />
            </label>
          )}
          <label className="field">
            <span className="field-label">Heatmap goal range (0 to N)</span>
            <input
              type="range"
              min={4}
              max={8}
              step={1}
              value={advanced.displayMaxGoals}
              onChange={(e) =>
                onAdvancedChange({ ...advanced, displayMaxGoals: Number(e.target.value) })
              }
            />
            <span className="hint-inline">Showing 0-{advanced.displayMaxGoals} goals per side</span>
          </label>
        </div>
      </details>
    </section>
  );
}
