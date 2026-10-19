import { useEffect, useRef, useState } from 'react';
import { defaults, frameAt, limits, sanitize, setDuration, type Settings } from './session';

type Lang = 'ru' | 'en';
const messages = {
  ru: { eyebrow: 'В СВОЁМ РИТМЕ', title: 'Время для практики', intro: 'Настройте движение, найдите удобный ритм и начните.', setup: 'Настройки практики', mode: 'Длительность сета', byCycles: 'По циклам', byTime: 'По времени', cycleMs: 'Длительность цикла', cycleHelp: 'Полный путь шарика туда и обратно', cycles: 'Циклов в сете', duration: 'Время сета', countdown: 'Отсчёт перед стартом', sets: 'Количество сетов', rest: 'Пауза между сетами', ms: 'мс', sec: 'с', summarySet: 'Один сет', summaryTotal: 'Вся практика', summaryCycles: 'Циклов в сете', approx: '≈', hint: 'Для комфортной практики рекомендуем включить полноэкранный режим браузера.', fullscreen: 'На весь экран', exitFullscreen: 'Выйти из полного экрана', start: 'Начать практику', footer: 'Цикл — движение туда и обратно. Сет — серия циклов.', prepare: 'Приготовьтесь', restTitle: 'Пауза между сетами', next: 'Следующий сет', set: 'Сет', of: 'из', paused: 'Практика на паузе', resume: 'Продолжить', pause: 'Пауза', stop: 'Завершить', back: 'К настройкам', done: 'Практика завершена', doneText: 'Можно сделать паузу и вернуться к настройкам.', again: 'Повторить', dark: 'Тёмная тема', light: 'Светлая тема', controls: 'Пробел — пауза · Esc — к настройкам', fullscreenError: 'Полноэкранный режим недоступен. Его можно включить через меню браузера.', reset: 'Сбросить', timeModeHelp: 'Сет завершится по таймеру, даже если цикл ещё не закончен.' },
  en: { eyebrow: 'AT YOUR OWN PACE', title: 'A moment to practice', intro: 'Adjust the movement, find your rhythm, and begin.', setup: 'Practice settings', mode: 'Set length', byCycles: 'By cycles', byTime: 'By time', cycleMs: 'Cycle duration', cycleHelp: 'One complete movement there and back', cycles: 'Cycles per set', duration: 'Set duration', countdown: 'Countdown before start', sets: 'Number of sets', rest: 'Rest between sets', ms: 'ms', sec: 's', summarySet: 'One set', summaryTotal: 'Total practice', summaryCycles: 'Cycles per set', approx: '≈', hint: 'For a more comfortable session, we recommend using your browser’s fullscreen mode.', fullscreen: 'Go fullscreen', exitFullscreen: 'Exit fullscreen', start: 'Start practice', footer: 'A cycle is one round trip. A set is a series of cycles.', prepare: 'Get ready', restTitle: 'Rest between sets', next: 'Next set', set: 'Set', of: 'of', paused: 'Practice paused', resume: 'Resume', pause: 'Pause', stop: 'Finish', back: 'Back to settings', done: 'Practice complete', doneText: 'Take a moment, then return to your settings.', again: 'Repeat', dark: 'Dark theme', light: 'Light theme', controls: 'Space — pause · Esc — back to settings', fullscreenError: 'Fullscreen is unavailable. You can enable it from your browser menu.', reset: 'Reset', timeModeHelp: 'The set ends when the timer runs out, even during a cycle.' },
};
function preferredTheme(): 'light' | 'dark' {
  return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}
function readSaved(): { settings: Settings; lang: Lang; theme: 'light' | 'dark' } {
  try { const s = JSON.parse(sessionStorage.getItem('emdrdot:v1') || '{}'); const theme = s.theme; return { settings: sanitize(s.settings), lang: s.lang === 'en' ? 'en' : 'ru', theme: theme === 'light' || theme === 'dark' ? theme : preferredTheme() }; }
  catch { return { settings: defaults, lang: 'ru', theme: preferredTheme() }; }
}
const saved = readSaved();
document.documentElement.dataset.theme = saved.theme;
function Icon({ name }: { name: 'sun' | 'moon' | 'expand' | 'arrow' }) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{name === 'sun' ? <><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></> : name === 'moon' ? <path d="M20 14a8 8 0 0 1-10-10 8 8 0 1 0 10 10Z"/> : name === 'expand' ? <path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/> : <path d="M4 12h16m-6-6 6 6-6 6"/>}</svg>;
}
export default function App() {
  const [settings, setSettings] = useState(saved.settings);
  const [lang, setLang] = useState<Lang>(saved.lang);
  const [theme, setTheme] = useState(saved.theme);
  const [running, setRunning] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [error, setError] = useState('');
  const t = messages[lang];
  useEffect(() => { document.documentElement.dataset.theme = theme; document.documentElement.lang = lang; document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#171d1a' : '#f6f5f0'); try { sessionStorage.setItem('emdrdot:v1', JSON.stringify({ settings, lang, theme })); } catch { /* Storage can be disabled by browser privacy settings. */ } }, [settings, lang, theme]);
  useEffect(() => { const update = () => setFullscreen(!!document.fullscreenElement); document.addEventListener('fullscreenchange', update); return () => document.removeEventListener('fullscreenchange', update); }, []);
  async function toggleFullscreen() { try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); setError(''); } catch { setError(t.fullscreenError); } }
  const seconds = (ms: number) => new Intl.NumberFormat(lang, { maximumFractionDigits: 1 }).format(ms / 1000);
  const total = settings.countdown * 1000 + setDuration(settings) * settings.sets + settings.rest * 1000 * (settings.sets - 1);
  function field(key: keyof typeof limits, label: string, unit?: string, help?: string) {
    return <label className="field" htmlFor={key}><span>{label}</span><div className="number-wrap"><input id={key} type="number" required min={limits[key][0]} max={limits[key][1]} step="1" value={settings[key]} onChange={e => { const n = e.target.valueAsNumber; setSettings(s => ({ ...s, [key]: Number.isNaN(n) ? 0 : n })); }} onBlur={() => setSettings(s => sanitize(s))}/>{unit && <span className="unit">{unit}</span>}</div>{help && <small>{help}</small>}</label>;
  }
  if (running) return <Practice settings={settings} t={t} onExit={() => setRunning(false)}/>;
  return <div className="app-shell"><header className="header"><a className="brand" href="./" aria-label="EMDR Dot"><span className="brand-mark"><i/><i/><i/></span>emdr<span className="brand-dot">dot</span></a><div className="preferences"><div className="languages" role="group" aria-label={lang === 'ru' ? 'Язык' : 'Language'}><button type="button" aria-pressed={lang === 'ru'} onClick={() => setLang('ru')}>RU</button><button type="button" aria-pressed={lang === 'en'} onClick={() => setLang('en')}>EN</button></div><span className="divider"/><button className="theme-button" type="button" onClick={() => setTheme(value => value === 'light' ? 'dark' : 'light')} aria-label={theme === 'light' ? t.dark : t.light} title={theme === 'light' ? t.dark : t.light}><Icon name={theme === 'light' ? 'moon' : 'sun'}/></button></div></header><main className="settings-main"><section className="intro"><p className="eyebrow">{t.eyebrow}</p><h1>{t.title}</h1><p>{t.intro}</p><div className="path-preview" aria-hidden="true"><span/><span/><span/><i/><span/><span/><span/></div></section><form className="settings-card" onSubmit={e => { e.preventDefault(); setSettings(s => sanitize(s)); setRunning(true); }}><div className="card-heading"><h2>{t.setup}</h2><button type="button" className="text-button" onClick={() => setSettings({ ...defaults })}>{t.reset}</button></div><fieldset className="mode-field"><legend>{t.mode}</legend><div className="mode-toggle"><button type="button" aria-pressed={settings.mode === 'cycles'} onClick={() => setSettings(s => ({ ...s, mode: 'cycles' }))}>{t.byCycles}</button><button type="button" aria-pressed={settings.mode === 'time'} onClick={() => setSettings(s => ({ ...s, mode: 'time' }))}>{t.byTime}</button></div></fieldset><div className="field-grid">{field('cycleMs', t.cycleMs, t.ms, t.cycleHelp)}{settings.mode === 'cycles' ? field('cycles', t.cycles) : field('duration', t.duration, t.sec)}{field('sets', t.sets)}{field('rest', t.rest, t.sec)}{field('countdown', t.countdown, t.sec)}</div>{settings.mode === 'time' && <p className="mode-note">{t.timeModeHelp}</p>}<div className="summary"><div><span>{t.summarySet}</span><strong>{seconds(setDuration(settings))} <small>{t.sec}</small></strong></div><div><span>{t.summaryTotal}</span><strong>{seconds(total)} <small>{t.sec}</small></strong></div>{settings.mode === 'time' && <div><span>{t.summaryCycles}</span><strong>≈ {new Intl.NumberFormat(lang, { maximumFractionDigits: 1 }).format(settings.duration * 1000 / settings.cycleMs)}</strong></div>}</div><div className="fullscreen-hint"><Icon name="expand"/><div><p>{t.hint} <button type="button" className="text-button" onClick={toggleFullscreen}>{fullscreen ? t.exitFullscreen : t.fullscreen}</button></p></div></div>{error && <p className="error" role="status">{error}</p>}<button type="submit" className="primary start-button">{t.start}<Icon name="arrow"/></button></form><p className="footer-note">{t.footer}</p></main><footer className="page-footer">EMDR DOT <span>·</span> {lang === 'ru' ? 'Простой инструмент визуальной стимуляции' : 'A simple visual stimulation tool'}</footer></div>;
}
function Practice({ settings, t, onExit }: { settings: Settings; t: typeof messages.ru; onExit: () => void }) {
  const [frame, setFrame] = useState(() => frameAt(0, settings));
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const ball = useRef<HTMLDivElement>(null);
  const elapsed = useRef(0); const pausedRef = useRef(false); const lastInteraction = useRef(performance.now());
  const togglePause = () => { pausedRef.current = !pausedRef.current; setPaused(pausedRef.current); lastInteraction.current = performance.now(); setVisible(true); };
  useEffect(() => {
    let raf = 0; let previous = performance.now(); let lastPaint = 0;
    const tick = (now: number) => {
      if (!pausedRef.current) elapsed.current += now - previous;
      previous = now;
      const current = frameAt(elapsed.current, settings);
      if (ball.current) { const pad = Math.min(60, window.innerWidth * 0.08); ball.current.style.transform = `translate3d(${pad + current.progress * (window.innerWidth - pad * 2)}px, -50%, 0) translateX(-50%)`; ball.current.style.visibility = current.phase === 'active' && !pausedRef.current ? 'visible' : 'hidden'; }
      if (now - lastPaint > 80 || current.phase === 'done') { setFrame(current); setVisible(now - lastInteraction.current < 2200); lastPaint = now; }
      if (current.phase !== 'done') raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const hidden = () => { if (document.hidden) { pausedRef.current = true; setPaused(true); } previous = performance.now(); };
    const key = (e: KeyboardEvent) => { if (e.code === 'Space' && !(e.target instanceof HTMLButtonElement)) { e.preventDefault(); togglePause(); } if (e.key === 'Escape') onExit(); };
    document.addEventListener('visibilitychange', hidden); window.addEventListener('keydown', key);
    return () => { cancelAnimationFrame(raf); document.removeEventListener('visibilitychange', hidden); window.removeEventListener('keydown', key); };
  }, [settings, onExit]);
  const reveal = () => { lastInteraction.current = performance.now(); setVisible(true); };
  return <main className="practice" onPointerMove={reveal} onPointerDown={reveal} style={{ cursor: visible || paused || frame.phase !== 'active' ? 'auto' : 'none' }}><div className="moving-ball" ref={ball}/>{frame.phase === 'done' ? <section className="practice-message"><span className="complete-symbol" aria-hidden="true">✓</span><h1>{t.done}</h1><p>{t.doneText}</p><button className="primary" onClick={onExit}>{t.back}</button></section> : (paused || frame.phase !== 'active') && <section className="practice-message" aria-live="polite"><p className="eyebrow">{t.set} {frame.set} {t.of} {settings.sets}</p><h1>{paused ? t.paused : frame.phase === 'countdown' ? t.prepare : t.restTitle}</h1>{!paused && <div className="count-number">{Math.ceil(frame.remaining / 1000)}</div>}{paused && <button className="primary" onClick={togglePause}>{t.resume}</button>}</section>}{frame.phase !== 'done' && <div className={`practice-controls ${visible || paused || frame.phase !== 'active' ? 'is-visible' : ''}`} onFocus={reveal}><span>{t.set} {frame.set} {t.of} {settings.sets}</span><div><button onClick={togglePause}>{paused ? t.resume : t.pause}</button><button onClick={onExit}>{t.stop}</button></div><small>{t.controls}</small></div>}</main>;
}
