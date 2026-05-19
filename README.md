# Rival

USDC-settled social betting app. React PWA, no backend yet (all state in-browser).

## Deploy in 10 minutes

### Prereqs
- Node.js 18+ — check with `node -v`. Install from https://nodejs.org if missing.
- A Vercel account (free) — sign up at https://vercel.com with GitHub/Google. Takes 30 seconds.

### Steps

**1. Unzip this folder somewhere on your Mac.** Open Terminal and `cd` into it:

```bash
cd path/to/rival-deploy
```

**2. Install dependencies:**

```bash
npm install
```

This downloads React + Vite. Takes about 60 seconds. Creates a `node_modules` folder (don't worry about it, gitignored).

**3. Test locally first** (catch any errors before deploying):

```bash
npm run dev
```

Opens at `http://localhost:5173` in your browser. Should see Rival. Hit Ctrl+C in terminal to stop.

**4. Deploy to Vercel:**

```bash
npx vercel
```

First run: it'll prompt you to log in (use GitHub). Then asks:
- "Set up and deploy?" → Y
- "Which scope?" → pick your account
- "Link to existing project?" → N
- "Project name?" → rival (or whatever)
- "In which directory is your code?" → just press Enter (current dir)
- "Want to modify settings?" → N

After ~45 seconds it prints a URL like `https://rival-xyz.vercel.app`. **That's your live app.**

For production (a stable URL that doesn't change on each deploy):

```bash
npx vercel --prod
```

### Share with friends

Send them the URL. On their iPhone:

1. Open the link in **Safari** (must be Safari for "Add to Home Screen")
2. Tap the Share button (square with up-arrow)
3. Scroll down, tap **Add to Home Screen**
4. Tap **Add**

Rival icon appears on their home screen. Tap to launch as a fullscreen app.

### Updates

After you edit any file:

```bash
npx vercel --prod
```

URL stays the same. Friends just refresh.

## Local network testing (optional)

To test on your phone over Wi-Fi without deploying:

```bash
npm run dev
```

Terminal prints something like `Network: http://192.168.1.50:5173`. Open that URL on your phone (same Wi-Fi). Hot reload still works.

## Project structure

```
rival-deploy/
├── index.html             ← entry HTML, PWA meta tags
├── package.json           ← dependencies
├── vite.config.js         ← build config
├── vercel.json            ← SPA routing + service worker headers
├── public/
│   ├── manifest.json      ← PWA manifest (makes app installable)
│   ├── sw.js              ← service worker (push notifications, offline)
│   ├── icon.svg           ← vector source for icons
│   ├── icon-192.png       ← required for PWA install
│   └── icon-512.png       ← required for PWA install
└── src/
    ├── main.jsx           ← React entry, mounts <App />, registers SW
    └── App.jsx            ← all Rival code (3,275 lines)
```

## What works right now

- All bet flows: create, accept, vote on settlement
- Settlement state machine: matched → pending → settled OR disputed
- Notification bell + browser push (if user grants permission)
- Multi-user simulation via the user switcher (top right)
- Theme toggle (light/dark, auto-detect)
- Account management, spending limit, deposit flow
- PWA install on iOS and Android

## What's still client-only (needs backend later)

- **All state lives in browser memory.** Refresh = everything resets to seed data.
- **No real auth.** Anyone with the URL can use any test account.
- **No real-time sync between devices.** User A on iPhone won't see User B's accept on a different phone.
- **Deposits are simulated.** No real money moves.
- **Settlement votes are local.** Multi-device voting needs a backend.

For testing the UI/UX with friends, this is fine. For real money or actual multi-device play, your friend's Django backend needs to wire up:
- `POST /api/bets/` (create bet)
- `POST /api/bets/:id/accept/` (accept)
- `POST /api/bets/:id/vote/` (settlement vote)
- WebSocket channel `ws://api/bets/:id/` (real-time updates to all participants)
- Web Push (VAPID protocol) → fires the `push` event in sw.js

The reducer in `App.jsx` is the spec — every action type (`CREATE_BET`, `ACCEPT_BET`, `VOTE_SETTLEMENT`, `ENTER_SETTLEMENT`, etc.) is a server endpoint waiting to be built.

## Issues

If `npx vercel` errors with "command not found": `npm install -g vercel` first, then retry.

If the deploy succeeds but the app shows a blank screen: open browser devtools (Cmd+Opt+I), check the Console tab for errors, share the error message.

If PWA install doesn't work on iPhone: must be Safari (not Chrome), iOS 16.4 or newer for full notification support.
