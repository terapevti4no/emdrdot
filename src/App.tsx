import { useEffect, useState } from 'react';
import { applyDocumentPreferences, usePreferences } from '@terapevti4no/ui';
import { messages } from './i18n';
import { readSaved, saveSettings } from './preferences';
import Practice from './Practice';
import SettingsScreen from './SettingsScreen';
const saved = readSaved();
applyDocumentPreferences(saved);
export default function App() {
    const [settings, setSettings] = useState(saved.settings);
    const { lang, setLang, theme, setTheme } = usePreferences({ storageKey: 'emdrdot:v1', fallbackKeys: ['terapevti4no:v1'] });
    const [running, setRunning] = useState(false);
    const t = messages[lang];
    useEffect(() => { saveSettings(settings); }, [settings]);
    if (running)
        return <Practice settings={settings} t={t} onExit={() => setRunning(false)}/>;
    return <SettingsScreen settings={settings} setSettings={setSettings} lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} onStart={() => setRunning(true)}/>;
}
