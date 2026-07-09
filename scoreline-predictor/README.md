# Scoreline Predictor

Estimates the probability of every scoreline for a soccer match using a
Poisson goals model.

## How it works

Each team's goal-scoring is modeled as an independent Poisson process. Given
expected goals (λ) for the home and away side, the probability of any
scoreline `h-a` is:

```
P(h, a) = Poisson(h; λ_home) * Poisson(a; λ_away)
```

An optional [Dixon-Coles](https://en.wikipedia.org/wiki/Dixon%E2%80%93Coles_model)
correction can be applied to the low-scoring cells (0-0, 1-0, 0-1, 1-1),
since real matches show a small correlation there that the independent
Poisson model misses.

Expected goals can be entered two ways:

- **Expected goals** — type each team's expected goals directly.
- **Team form stats** — enter league-average goals and each team's recent
  goals for/against; an attack/defense-strength model derives expected goals
  from those.

From the resulting probability matrix the app derives: 1X2 (win/draw/loss),
both-teams-to-score, over/under goal lines, the full scoreline heatmap, and
a ranked list of the most likely exact scorelines.

## Development

```bash
npm install
npm run dev       # start the dev server
npm test          # run the probability-model unit tests
npm run build     # type-check and build for production
```

Core model and math live in `src/lib/poisson.ts` (covered by
`src/lib/poisson.test.ts`); everything else is presentation.
