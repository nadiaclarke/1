import { useMemo } from 'react';
import { readableTextOn, sequentialBlue } from '../lib/colorScale';
import { usePrefersDark } from '../lib/usePrefersDark';

interface Props {
  matrix: number[][];
  displayMaxGoals: number;
  homeTeam: string;
  awayTeam: string;
  displayedMass: number;
}

export function ScorelineHeatmap({
  matrix,
  displayMaxGoals,
  homeTeam,
  awayTeam,
  displayedMass,
}: Props) {
  const prefersDark = usePrefersDark();
  const home = homeTeam || 'Home';
  const away = awayTeam || 'Away';

  const { maxProb, maxCell } = useMemo(() => {
    let max = 0;
    let cell = { h: 0, a: 0 };
    for (let h = 0; h <= displayMaxGoals; h++) {
      for (let a = 0; a <= displayMaxGoals; a++) {
        if (matrix[h][a] > max) {
          max = matrix[h][a];
          cell = { h, a };
        }
      }
    }
    return { maxProb: max, maxCell: cell };
  }, [matrix, displayMaxGoals]);

  const cols = Array.from({ length: displayMaxGoals + 1 }, (_, i) => i);

  return (
    <section className="panel">
      <h2 className="panel-title">Scoreline probability grid</h2>
      <p className="hint">
        Rows are {home} goals, columns are {away} goals. Darker cells are more likely
        scorelines. Most likely: {maxCell.h}-{maxCell.a} ({(maxProb * 100).toFixed(1)}%).
      </p>
      <div className="heatmap-scroll">
        <table className="heatmap-table">
          <caption className="sr-only">
            Probability of each scoreline between {home} and {away}
          </caption>
          <thead>
            <tr>
              <th scope="col" className="heatmap-corner">
                {home} \ {away}
              </th>
              {cols.map((a) => (
                <th scope="col" key={a} className="heatmap-axis-label">
                  {a}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cols.map((h) => (
              <tr key={h}>
                <th scope="row" className="heatmap-axis-label">
                  {h}
                </th>
                {cols.map((a) => {
                  const p = matrix[h][a];
                  const t = maxProb > 0 ? p / maxProb : 0;
                  const bg = sequentialBlue(t, prefersDark ? 'dark' : 'light');
                  const isMax = h === maxCell.h && a === maxCell.a;
                  return (
                    <td
                      key={a}
                      className={isMax ? 'heatmap-cell heatmap-cell-max' : 'heatmap-cell'}
                      style={{ backgroundColor: bg, color: readableTextOn(bg) }}
                      title={`${home} ${h} - ${away} ${a}: ${(p * 100).toFixed(2)}%`}
                    >
                      {(p * 100).toFixed(1)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="hint-inline">
        Grid covers {(displayedMass * 100).toFixed(1)}% of total probability mass; higher
        scorelines exist but are individually small.
      </p>
    </section>
  );
}
