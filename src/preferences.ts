import { defaults, sanitize, type Settings } from './session';
import type { Lang } from './i18n';
export type Theme = 'light' | 'dark';
type Preferences = {
    settings: Settings;
    lang: Lang;
    theme: Theme;
};
function preferredTheme(): Theme {
    return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}
export function readSaved(): {
    settings: Settings;
    lang: Lang;
    theme: Theme;
} {
    try {
        const s = JSON.parse(sessionStorage.getItem('emdrdot:v1') || '{}');
        const theme = s.theme;
        return { settings: sanitize(s.settings), lang: s.lang === 'en' ? 'en' : 'ru', theme: theme === 'light' || theme === 'dark' ? theme : preferredTheme() };
    }
    catch {
        return { settings: defaults, lang: 'ru', theme: preferredTheme() };
    }
}
export function savePreferences(preferences: Preferences) {
    try {
        sessionStorage.setItem('emdrdot:v1', JSON.stringify(preferences));
    }
    catch {
        // Storage can be disabled by browser privacy settings.
    }
}
