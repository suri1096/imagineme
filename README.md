# ImagineMe

ImagineMe is a sensory-friendly digital storytelling app designed to help neurodivergent children create personalized illustrated stories through guided choices, drawing, AI-generated story text/images, and narration.

## Stack

- React + Vite + TypeScript
- Tailwind CSS
- Express API server
- OpenAI for story/image generation
- pnpm workspaces

## Project structure

- `artifacts/mindpalette/` — main frontend
- `artifacts/api-server/` — API server
- `lib/` — shared workspace libraries
- `scripts/` — Replit/workspace helper scripts

## Setup

Requires Node.js and pnpm.

```bash
pnpm install --frozen-lockfile
```

For local frontend development, provide `PORT` and `BASE_PATH`:

```bash
PORT=8081 BASE_PATH=/ pnpm --filter @workspace/mindpalette dev
```

For the API server, set `OPENAI_API_KEY` and a server port:

```bash
OPENAI_API_KEY=your_key PORT=8080 pnpm --filter @workspace/api-server dev
```

The ElevenLabs text-to-speech route uses Replit Connectors, so that feature expects the corresponding Replit connector/authentication when deployed on Replit.

## Build

```bash
pnpm run build
```

Secrets should stay in environment variables and should never be committed to GitHub. See `.env.example` for the expected variables.
