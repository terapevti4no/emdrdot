# EMDR Dot

A browser-only visual stimulation timer built with React, TypeScript and Vite.

## Development

```sh
npm install
npm run dev
```

Open the Local URL printed by Vite. Production: `npm run build`; preview: `npm run preview`. Timing checks: `npm test` (Node 22.18+).

Settings, language and theme live in `sessionStorage` for the current browser tab. Nothing is sent to a server. Russian and English; light and dark themes. A cycle is a full left-to-right-to-left movement. A set can be defined by cycle count or time. Time mode stops at the exact deadline, including mid-cycle. There is no rest after the final set.

During practice controls fade out; move the pointer, tap, or focus a control to show them. Space pauses/resumes, Escape returns to settings. Switching tabs pauses practice. Fullscreen is optional and browser support varies.

The default timing is an interface preset, not a clinical protocol. This tool provides visual stimulation and does not constitute EMDR therapy.
