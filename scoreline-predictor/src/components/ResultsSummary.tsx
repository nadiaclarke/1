import type { MatchOutcomeProbabilities } from '../lib/poisson';

interface Props {
  homeTeam: string;
  awayTeam: string;
  lambdaHome: number;
  lambdaAway: number;
  outcome: MatchOutcomeProbabilities;
  btts: { yes: number; no: number };
  overUnder15: { over: number; under: number };
  overUnder25: { over: number; under: number };
  overUnder35: { over: number; under: number };
}

function pct(v: number): string {
  return `${(v * 100).toFixed(1)}%`;
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat-tile">
      <span className="stat-tile-label">{label}</span>
      <span className="stat-tile-value">{value}</span>
    </div>
  );
}

export function ResultsSummary({
  homeTeam,
  awayTeam,
  lambdaHome,
  lambdaAway,
  outcome,
  btts,
  overUnder15,
  overUnder25,
  overUnder35,
}: Props) {
  const home = homeTeam || 'Home';
  const away = awayTeam || 'Away';

  return (
    <section className="panel">
      <h2 className="panel-title">Match outcome</h2>

      <div className="xg-row">
        <StatTile label={`${home} expected goals`} value={lambdaHome.toFixed(2)} />
        <StatTile label={`${away} expected goals`} value={lambdaAway.toFixed(2)} />
      </div>

      <div className="outcome-meter" role="group" aria-label="Win, draw, loss probability">
        <div
          className="outcome-meter-segment outcome-home"
          style={{ flexGrow: outcome.homeWin }}
          title={`${home} win: ${pct(outcome.homeWin)}`}
        >
          {outcome.homeWin >= 0.12 && <span>{pct(outcome.homeWin)}</span>}
        </div>
        <div
          className="outcome-meter-segment outcome-draw"
          style={{ flexGrow: outcome.draw }}
          title={`Draw: ${pct(outcome.draw)}`}
        >
          {outcome.draw >= 0.12 && <span>{pct(outcome.draw)}</span>}
        </div>
        <div
          className="outcome-meter-segment outcome-away"
          style={{ flexGrow: outcome.awayWin }}
          title={`${away} win: ${pct(outcome.awayWin)}`}
        >
          {outcome.awayWin >= 0.12 && <span>{pct(outcome.awayWin)}</span>}
        </div>
      </div>
      <div className="outcome-legend">
        <span className="legend-item">
          <span className="legend-swatch legend-home" /> {home} win {pct(outcome.homeWin)}
        </span>
        <span className="legend-item">
          <span className="legend-swatch legend-draw" /> Draw {pct(outcome.draw)}
        </span>
        <span className="legend-item">
          <span className="legend-swatch legend-away" /> {away} win {pct(outcome.awayWin)}
        </span>
      </div>

      <div className="stat-grid">
        <StatTile label="Both teams to score" value={pct(btts.yes)} />
        <StatTile label="Over 1.5 goals" value={pct(overUnder15.over)} />
        <StatTile label="Over 2.5 goals" value={pct(overUnder25.over)} />
        <StatTile label="Over 3.5 goals" value={pct(overUnder35.over)} />
      </div>
    </section>
  );
}
