# EMDR Dot

A browser-only visual stimulation timer built with React, TypeScript and Vite.

## Development

```sh
npm install
npm run dev
```

Open the Local URL printed by Vite. Production: `npm run build`; preview: `npm run preview`. Timing checks: `npm test` (Node 22.18+).

Settings, language and theme live in `localStorage` between visits. The initial language follows the browser locale: Russian for `ru`, English otherwise. Nothing is sent to a server. Russian and English; light and dark themes. A cycle is a full left-to-right-to-left movement. A set can be defined by cycle count or time. Time mode stops at the exact deadline, including mid-cycle. There is no rest after the final set.

During practice controls fade out; move the pointer, tap, or focus a control to show them. Space pauses/resumes, Escape returns to settings. Switching tabs pauses practice. Fullscreen is optional and browser support varies.

The default timing is an interface preset, not a clinical protocol. This tool provides visual stimulation and does not constitute EMDR therapy.

## GitHub Actions and Pages

The `Build and deploy` workflow installs dependencies, runs tests and builds the site on pushes and pull requests to `main`. The Pages artifact uses `/emdrdot/` as its base URL; local development keeps the default `/` base.

Deployment is disabled until the repository variable `PAGES_ENABLED` is set to `true`. To enable publication while keeping this repository private:

1. Use a GitHub plan that supports Pages for private repositories (GitHub Pro for a personal account).
2. In Settings → Pages, select **GitHub Actions** as the source.
3. In Settings → Secrets and variables → Actions → Variables, create `PAGES_ENABLED` with value `true`.
4. Run `Build and deploy` from the Actions tab, or push to `main`.

The published site will be at https://goelmarina.github.io/emdrdot/. The site itself will be publicly accessible; the repository remains private. No personal access token or deployment secret is needed by the workflow.

## Shared UI styles

Shared typography, theme tokens, layout and components are released in [terapevti4no/ui](https://github.com/terapevti4no/ui). The checked-in `vendor/terapevti4no-ui/ui.css` is loaded before project-specific styles. Do not edit vendor files directly.

From this project's root, with Node 22 or newer:

```sh
node scripts/update-ui.mjs --version 0.1.0
node scripts/update-ui.mjs --check --version 0.1.0
```

The updater downloads the exact GitHub release tag and records its commit and CSS SHA-256 in `vendor/terapevti4no-ui/version.json`. No local UI checkout or extra dependencies are required. Commit the vendor update after review. To roll back, use an earlier published version. Normal development, builds and site visits use the local copy and do not contact GitHub.
