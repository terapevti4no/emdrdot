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

Pushes and pull requests to `main` run timer tests and the production build with `/emdrdot/` as its base. GitHub Pages serves the `dist` artifact through GitHub Actions; only `main` deploys, with `PAGES_ENABLED=true` as the repository switch. The site is published at https://terapevti4no.github.io/emdrdot/.

## Shared React UI

`@terapevti4no/ui` supplies the layout, parent/tool logos, theme/language controls, text-only page intro, content container, information note, footer and icons. It is installed from a versioned npm archive in [GitHub Releases](https://github.com/terapevti4no/ui/releases); `package-lock.json` pins integrity. There is no vendor directory. Tool-specific fields, settings, timing and practice behavior remain in this project.

```sh
npm run ui:check
npm run ui:update -- --latest
npm run ui:update -- --version 0.2.1
```

The shared preference hook reads the existing `emdrdot:v1` record and preserves its settings. Missing theme/language fields can reuse the main site's `terapevti4no:v1` record. Timer settings are saved separately by merging the existing record. The shared blocking head script applies saved preferences before first paint.

### Automatic library updates

The Pages workflow checks for a new stable UI release four times an hour. It installs newer versions, runs timer tests and the production build, commits the verified package/lockfile update and deploys in the same run. GitHub may delay scheduled jobs. A failing update is not committed or deployed. Existing `PAGES_ENABLED=true` remains the deployment switch.

Run **Build and deploy** (`pages.yml`) manually to update/deploy immediately. Set `UI_AUTO_UPDATE=false` to stop scheduled updates. To hold a rollback, disable scheduled updates and install an earlier compatible package version. CSS-only UI versions before 0.2.0 are not compatible.
