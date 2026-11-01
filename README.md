# Creator Agent AI

An open-source creator workspace for turning a topic into a short-form video plan.

## Current status
This repository contains a working frontend MVP: project brief, platform and duration selection, template-based script/storyboard generation, editable scene text, and Markdown export.

**Demo-only today:** the script is template-generated, not AI-generated. Live LLM calls, image/video generation, text-to-speech, music, captions rendering, FFmpeg, MP4 export, social OAuth, scheduling and publishing are not connected yet. The app must never claim a video was rendered when no MP4 exists.

## Requirements
- Node.js 20.19+ or 22+
- npm

## Run locally
```bash
npm install
npm run dev
```
Open the local URL printed by Vite.

## Roadmap
1. Brief + storyboard MVP
2. Secure server API and provider adapters (Gemini / OpenAI-compatible / Anthropic)
3. Asset generation and storage
4. TTS, captions, licensed audio and FFmpeg render worker
5. MP4 artifact validation and download
6. Official YouTube / Instagram / Facebook OAuth and scheduling

## Security
- Never put provider API keys in frontend code or commit them.
- Use server-side environment variables and secret storage.
- Social publishing must use official OAuth; never collect social passwords.
- Mark a job complete only after a valid MP4 exists.

## License
MIT. See [LICENSE](./LICENSE).
