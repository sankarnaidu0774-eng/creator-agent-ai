# Creator Agent AI

An open-source workspace for planning short-form videos.

## What works now
- Responsive React + TypeScript studio UI
- Project brief: topic, audience, platform, duration and creative tone
- Demo storyboard generator when no AI provider is configured
- Server-side AI script/storyboard endpoint for Gemini or OpenAI
- Editable scenes, visual directions and narration
- Browser-session autosave for the current draft
- Browser text-to-speech preview (not an audio-file export)
- Markdown production brief, JSON storyboard and SRT caption exports

## What is not connected yet
- Image/video generation and media asset storage
- Downloadable TTS audio, background music and sound effects
- FFmpeg rendering and validated MP4 output
- User accounts, cloud project sync and team workspaces
- Official YouTube / Instagram / Facebook OAuth, scheduling and publishing

The interface must not claim that a video is rendered unless a real MP4 artifact has been produced and validated.

## Run locally
Requires Node.js 20.19+ or 22+.

```bash
npm install
npm run dev
```

## Configure AI generation
Copy `.env.example` to `.env.local` for local serverless development, or set environment variables in Vercel Project Settings. Add **one** provider key:
- `GEMINI_API_KEY` (recommended default model: `gemini-2.5-flash`), or
- `OPENAI_API_KEY` (default model: `gpt-4o-mini`).

Keys are read only by `/api/generate` on the server. Never put secrets in frontend code or commit real keys. The AI provider may charge for usage; the application itself does not implement subscriptions or payments.

For local API testing, use `vercel dev` after installing the Vercel CLI. `npm run dev` starts the Vite frontend only, so AI calls require a deployed Vercel function or local Vercel dev server.

## Deploy
Import this repository into Vercel. Framework: Vite; build command: `npm run build`; output directory: `dist`. Add provider environment variables before testing AI generation.

## Security
- Never commit API keys or expose them in browser bundles.
- Social publishing must use official OAuth; never collect social passwords.
- Validate and store real media artifacts before marking a render complete.

## License
MIT.
