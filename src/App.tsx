import { useEffect, useState } from 'react';
import { messages, type Lang } from './i18n';
import { readSaved, savePreferences } from './preferences';
import Practice from './Practice';
import SettingsScreen from './SettingsScreen';
const saved = readSaved();
document.documentElement.dataset.theme = saved.theme;
export default function App() {
    const [settings, setSettings] = useState(saved.settings);
    const [lang, setLang] = useState<Lang>(saved.lang);
    const [theme, setTheme] = useState(saved.theme);
    const [running, setRunning] = useState(false);
    const t = messages[lang];
    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        document.documentElement.lang = lang;
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#171d1a' : '#f6f5f0');
        savePreferences({ settings, lang, theme });
    }, [settings, lang, theme]);
    if (running)
        return <Practice settings={settings} t={t} onExit={() => setRunning(false)}/>;
    return <SettingsScreen settings={settings} setSettings={setSettings} lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} onStart={() => setRunning(true)}/>;
}
