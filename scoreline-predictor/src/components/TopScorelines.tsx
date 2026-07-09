import type { ScoreCell } from '../lib/poisson';

interface Props {
  scorelines: ScoreCell[];
  homeTeam: string;
  awayTeam: string;
}

export function TopScorelines({ scorelines, homeTeam, awayTeam }: Props) {
  const maxProb = scorelines.length > 0 ? scorelines[0].probability : 1;

  return (
    <section className="panel">
      <h2 className="panel-title">Most likely scorelines</h2>
      <p className="hint">
        {homeTeam || 'Home'} vs {awayTeam || 'Away'}, ranked by probability.
      </p>
      <ol className="scoreline-bars">
        {scorelines.map((cell, i) => {
          const widthPct = maxProb > 0 ? (cell.probability / maxProb) * 100 : 0;
          return (
            <li className="scoreline-bar-row" key={`${cell.home}-${cell.away}`}>
              <span className="scoreline-rank">{i + 1}</span>
              <span className="scoreline-label">
                {cell.home}-{cell.away}
              </span>
              <span className="scoreline-track">
                <span className="scoreline-fill" style={{ width: `${widthPct}%` }} />
              </span>
              <span className="scoreline-value">{(cell.probability * 100).toFixed(1)}%</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
