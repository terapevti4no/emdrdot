export default function Icon({ name }: {
    name: 'sun' | 'moon' | 'expand' | 'arrow';
}) {
    return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{name === 'sun' ? <><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></> : name === 'moon' ? <path d="M20 14a8 8 0 0 1-10-10 8 8 0 1 0 10 10Z"/> : name === 'expand' ? <path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/> : <path d="M4 12h16m-6-6 6 6-6 6"/>}</svg>;
}
