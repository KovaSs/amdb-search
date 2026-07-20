# AGENTS.md

## Project identity
- **package.json name**: `as-check` v3.1.0 — repo `amdb-search`, title "AMDb — поиск фильмов"
- Internal tool for Russian business verification (company search, stop-lists, risk factors, bank guarantees)

## Quick start
```bash
npm install
npm start          # CRA dev server
npm test           # react-scripts test (Jest)
npm run build      # GENERATE_SOURCEMAP=false react-scripts build
npm run publish    # npm publish ./build
```

## Mock mode
- **MSW v2** — in-browser request interception (service worker)
- Enable: `localStorage.debugMocks = true` or `REACT_APP_USE_MOCKS=true`
- All 14+ CGI endpoints mocked with realistic data
- Stateful EBG queue (status changes persist until page reload)
- Stop-list search returns generated FL/UL entries across multiple databases
- HTML viewer pages for stop-list detail links and iframes
- Adding mocks: add handler in `src/api/mocks/handlers/`, register in `index.ts`

## Architecture
- **Stack**: React 17 + Redux + Redux-Saga + reselect + Immutable.js 4 RC + Ant Design 3.22 + React Router 4 + connected-react-router + SCSS (dart-sass) + MSW 2.15
- **TypeScript 4.9** with `strict: false` and `isolatedModules: true` — JSX/JS files coexist freely
- **Ducks pattern** in `src/store/ducks/` — each module has `{actions,constants,index,reducer,saga,selectors}.ts`
- **5 modules**: `creditConveyor`, `openBill`, `EBG` (electronic bank guarantees), `earlyWarningSystem`, `stopListSearch`
- **EBG note**: `EBG.js` migrated to `EBG.ts` — monolithic file (constants+actions+reducer+saga+selectors). Duck directory `EBG/` removed.
- **Routing** in `src/components/ContentContainer/index.tsx`
- **State**: Immutable.js Maps throughout reducers; `window.store` exposed for debugging
- **Mocks**: `src/api/mocks/` — MSW handlers, generators, data
- **Styling**: SCSS with dart-sass (no CSS modules)
- **Console logs** suppressed in production (`process.env.NODE_ENV === "production" && config.production`)

## API & config
- `src/config.ts` — toggle `production: false/true` to switch between `devServer` / `prodServer` URLs
- API calls target internal CGI endpoints (`/cgi-bin/serg/...`) with `fetch`, `mode: 'cors'`, `credentials: 'include'`
- **Optional Firebase backend** — enable via `REACT_APP_USE_FIREBASE_API` env var, configure with `REACT_APP_FIREBASE_*` env vars (defined in `src/base.ts`)
- `.htaccess` serves under `/AS_CHECK` subdirectory with `RewriteBase /AS_CHECK`

## CI (GitLab)
- `.gitlab-ci.yml` — only `test` stage active, triggers on `develop` branch

## Notable quirks
- **Single test file** exists: `src/components/ContentContainer/CreditConveyor/SearchCompanyInput/MainCompanyInfo/index.test.js`
- `parser.js` is a standalone utility (dumps project tree + file contents to `result.md`) — not part of the app
- `tsconfig.json` excludes `src/**/*.spec.ts` but no such files exist
- App is in Russian (antd ru_RU locale, moment locale `ru`, Russian UI copy)
- **antd 3.x types** are incompatible with TS 4.x: `src/antd-override.d.ts` loosens all antd component types to `any`
- `build` script uses cross-platform `GENERATE_SOURCEMAP=false` (not Windows `set` syntax)
