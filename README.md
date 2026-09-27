# steapps-mobile

React Native (Expo) aplikace ve stylu Instagram + Tinder: **Feed**, **Swipe** (deck s gesty) a **Profil**.

## Development

```bash
npm install
npm start        # expo dev server (QR kód)
npm run android  # android emulator
npm run ios      # ios simulator (jen macOS)
npm run web      # browser
```

## Připojení na backend (steapps-server)

Aplikace čte API URL z env proměnné `EXPO_PUBLIC_API_URL` (default `http://localhost:8080`):

```bash
EXPO_PUBLIC_API_URL=https://api.steapps.me npm start
```

## Struktura

- `src/app/index.tsx` — Instagram-style feed
- `src/app/swipe.tsx` — Tinder-style swipe deck (gesta přes `react-native-gesture-handler` + `reanimated`)
- `src/app/profile.tsx` — profil se staty a gridem
- `src/lib/api.ts` — typovaný API klient na Rust server

## Související repa

- `steapps` — web steapps.me (Next.js)
- `steapps-server` — Rust API server
