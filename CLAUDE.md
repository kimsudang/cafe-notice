# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`cafe-notice` is a web application for café POS (Chrome browser). Staff can play announcement audio with a single tap using the browser's Web Speech API (SpeechSynthesis).

## Stack

- **Language**: TypeScript
- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4
- **Voice**: Web Speech API (SpeechSynthesis) — no API key required
- **State**: useState / useReducer (no external store)
- **Deploy target**: Vercel or Netlify (free tier)

## Commands

- **Dev server**: `npm run dev`
- **Build**: `npm run build`
- **Preview build**: `npm run preview`
- **Lint**: `npm run lint`

## Structure

```
src/
  components/    # Tab UI components (InstantTab, ScheduleTab, SettingsTab)
  hooks/         # useTTS, useScheduler
  types/         # shared TypeScript types
  constants/     # preset messages, templates, day labels
  App.tsx        # root layout with tab navigation
  main.tsx       # entry point
```

## Key constraints

- Web Speech API only works reliably in Chrome. Auto-play schedules require the tab to stay open.
- Android Chrome may block TTS without a prior user interaction — test schedule auto-play on device.
- AudioFocus is not accessible from the browser; users must manually lower music volume before playing.
