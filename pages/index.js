import { useEffect, useMemo, useState } from "react";
export default function Home() {
  const [data, setData] = useState(null);
  const [scenario, setScenario] = useState("base");
  const [deckReady, setDeckReady] = useState(false);
  const [loadingDeck, setLoadingDeck] = useState(false);
  useEffect(() => { fetch("./mock/data.json").then(r => r.json()).then(setData); }, []);
  const view = useMemo(() => {
    if (!data) return null;
    const c = structuredClone(data);
    if (scenario === "eur_up_5") { c.varFx = "$14.1M"; c.signals = ["EUR +5% scenario applied", ...c.signals]; }
    if (scenario === "rates_up_50bps") { c.hedgeEff = "90%"; c.signals = ["Rates +50bps stress", ...c.signals]; }
    if (scenario === "berlin_pause_72h") { c.signals = ["Berlin cell line 72h pause (simulated)", ...c.signals]; }
    return c;
  }, [data, scenario]);
  const generateBoardDeck = async () => { setLoadingDeck(true); setTimeout(() => { setDeckReady(true); setLoadingDeck(false); }, 1200); };
  if (!view) return <main style={{padding:24, fontFamily:'-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif'}}><h1>Harb Ventures — CFO Command Center (ItsEco Demo)</h1><p>Loading demo data…</p></main>;
  const Card = ({title, children}) => (<div style={{flex:1,padding:16,borderRadius:12,boxShadow:'0 3px 10px rgba(0,0,0,0.08)',background:'linear-gradient(180deg,#ffffff,#f6f8fb)'}}><h3>{title}</h3><div>{children}</div></div>);
  const Pill = ({children}) => (<span style={{display:'inline-block',padding:'6px 10px',border:'1px solid rgba(0,0,0,.12)',borderRadius:20,marginRight:6}}>{children}</span>);
  return (<main style={{fontFamily:'-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif', padding:24}}>
    <h1>Harb Ventures — CFO Command Center (ItsEco Web Demo)</h1>
    <section style={{margin:'12px 0 18px'}}>
      <label><strong>Scenario:</strong> </label>
      <select value={scenario} onChange={e=>setScenario(e.target.value)} style={{marginLeft:8, padding:6}}>
        <option value="base">Base (no stress)</option>
        <option value="eur_up_5">EUR +5%</option>
        <option value="rates_up_50bps">Rates +50 bps</option>
        <option value="berlin_pause_72h">Berlin cell line pause (72h)</option>
      </select>
      <button onClick={generateBoardDeck} disabled={loadingDeck} style={{marginLeft:12, padding:'6px 10px', borderRadius:8, border:'1px solid rgba(0,0,0,.15)'}}>
        {loadingDeck ? "Generating Board Deck…" : "Generate Board Deck (Demo)"}
      </button>
      {deckReady && <span style={{marginLeft:12}}>✅ Deck ready (simulated). Check docs in your repo.</span>}
    </section>
    <section style={{display:'grid', gap:12, gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))'}}>
      <Card title="Company Cash">
        <div style={{fontSize:28, fontWeight:700}}>{view.cashTotal}</div>
        <div>Runway: {view.runwayWeeks} weeks</div>
        <div style={{marginTop:8}}><strong>Hotspots:</strong>{" "}{view.hotspots.map(h => <Pill key={h}>{h}</Pill>)}</div>
      </Card>
      <Card title="Risk Stack">
        <div style={{fontSize:20, fontWeight:600}}>VaR (FX): {view.varFx}</div>
        <div style={{marginTop:8}}><strong>Hedge Effectiveness:</strong> {view.hedgeEff}</div>
      </Card>
      <Card title="Signals">
        <ul>{view.signals.map((s,i) => <li key={i}>{s}</li>)}</ul>
      </Card>
      <Card title="Scenario Lab">
        <div>Apply a scenario from the menu to see live changes in VaR/Signals.</div>
        <div>In production this models P&L, FCF, and balance sheet.</div>
      </Card>
      <Card title="Board Pack">
        <div>Click “Generate Board Deck (Demo)” to simulate creating a board summary.</div>
        <div>Your real build would export a PDF or send to a secure data room.</div>
      </Card>
    </section>
  </main>); }
