import { useMemo, useState } from "react";
import { Clapperboard, WandSparkles, Youtube, Instagram, Facebook, Download, Film, Mic2, Captions, Music2, CheckCircle2, Sparkles, Clock3, Layers3 } from "lucide-react";

type Platform = "YouTube Shorts" | "Instagram Reels" | "Facebook Reels";
type Scene = { title: string; visual: string; narration: string; duration: number };
const platforms = [
  { name: "YouTube Shorts" as Platform, icon: Youtube },
  { name: "Instagram Reels" as Platform, icon: Instagram },
  { name: "Facebook Reels" as Platform, icon: Facebook },
];

function makeScenes(topic: string, audience: string, duration: number): Scene[] {
  const count = duration <= 30 ? 4 : duration <= 60 ? 5 : 7;
  const beats = [
    ["The hook", "Open with a striking close-up, bold title and quick camera movement.", `What if everything you knew about ${topic} was only the beginning?`],
    ["Set the context", `Show the key problem or surprising fact about ${topic}.`, `Let's break down ${topic} in a simple way for ${audience}.`],
    ["The core idea", "Use a clean animated diagram with one idea appearing at a time.", `The main idea is to understand the parts of ${topic} and how they connect.`],
    ["A real example", "Cut to a relatable real-world example; highlight the important detail.", `Imagine seeing ${topic} in everyday life. This is where the concept becomes useful.`],
    ["Key takeaway", "Show three short keywords on screen with subtle motion.", `Remember these points for a strong starting understanding of ${topic}.`],
    ["Recap", "Quick montage of the strongest visuals from earlier scenes.", `That is the big picture: simple, practical and worth exploring further.`],
    ["Call to action", "End card with creator handle and a clear follow prompt.", "Follow for more clear explanations, and share this with someone who needs it."],
  ];
  return beats.slice(0, count).map((b) => ({ title: b[0], visual: b[1], narration: b[2], duration: Math.max(3, Math.round(duration / count)) }));
}

export default function App() {
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("Beginners");
  const [platform, setPlatform] = useState<Platform>("YouTube Shorts");
  const [duration, setDuration] = useState(30);
  const [scenes, setScenes] = useState<Scene[] | null>(null);
  const [active, setActive] = useState(0);
  const [notice, setNotice] = useState("");
  const total = useMemo(() => scenes?.reduce((n, s) => n + s.duration, 0) ?? 0, [scenes]);
  const current = scenes?.[active];

  function generate() {
    if (!topic.trim()) { setNotice("Enter a topic first."); return; }
    setScenes(makeScenes(topic.trim(), audience, duration));
    setActive(0);
    setNotice("Demo storyboard created. This is a template preview, not AI-generated media.");
  }
  function edit(key: "visual" | "narration", value: string) {
    setScenes(old => old?.map((s, i) => i === active ? { ...s, [key]: value } : s) ?? null);
  }
  function exportBrief() {
    if (!scenes) return;
    const content = ["# Creator Agent AI — Production Brief", "", `Topic: ${topic}`, `Audience: ${audience}`, `Platform: ${platform}`, `Target duration: ${duration}s`, "", ...scenes.flatMap((s, i) => [`## Scene ${i + 1}: ${s.title} (${s.duration}s)`, `Visual: ${s.visual}`, `Narration: ${s.narration}`, ""]), "> Demo template only. No audio, images, video or MP4 has been generated."].join("\\n");
    const url = URL.createObjectURL(new Blob([content], { type: "text/markdown" }));
    const a = document.createElement("a"); a.href = url; a.download = "creator-agent-production-brief.md"; a.click(); URL.revokeObjectURL(url);
  }

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><Clapperboard size={21}/></div><div><strong>Creator Agent</strong><span>AI STUDIO</span></div></div>
      <div className="side-label">WORKSPACE</div>
      <button className="side-link active"><Layers3 size={17}/>Studio<span className="dot"/></button>
      <button className="side-link" onClick={() => setNotice("Saved projects will be available in a later version.")}><Film size={17}/>Projects</button>
      <div className="sidebar-bottom"><i/><div><b>Open-source preview</b><small>Local demo · v0.1.0</small></div></div>
    </aside>
    <main className="main">
      <header className="topbar"><div><span>Workspace</span><b> / New video</b></div><div className="top-right"><span className="demo-tag">● DEMO MODE</span><div className="avatar">CA</div></div></header>
      <section className="welcome"><div className="eyebrow"><Sparkles size={14}/> YOUR CREATIVE WORKFLOW, SIMPLIFIED</div><h1>Make something<br/><em>worth watching.</em></h1><p>Start with an idea. Shape the story. Build your next video, one scene at a time.</p></section>
      <div className="workspace-grid">
        <section className="panel">
          <div className="panel-heading"><div><span className="step">01</span><div><h2>Project brief</h2><p>Tell us what you want to create.</p></div></div><span className="required">REQUIRED</span></div>
          <label>VIDEO TOPIC</label><textarea rows={4} value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. How artificial intelligence is changing everyday life..."/>
          <div className="field-row"><div><label>TARGET AUDIENCE</label><select value={audience} onChange={e => setAudience(e.target.value)}><option>Beginners</option><option>Students</option><option>Tech enthusiasts</option><option>Creators</option><option>Business owners</option></select></div><div><label>VIDEO LENGTH</label><select value={duration} onChange={e => setDuration(Number(e.target.value))}><option value={30}>30 seconds</option><option value={60}>60 seconds</option><option value={90}>90 seconds</option></select></div></div>
          <label>DESTINATION PLATFORM</label><div className="platforms">{platforms.map(({ name, icon: Icon }) => <button key={name} className={platform === name ? "platform selected" : "platform"} onClick={() => setPlatform(name)}><Icon size={17}/>{name}{platform === name && <CheckCircle2 size={15}/>}</button>)}</div>
          <button className="primary-btn" onClick={generate}><WandSparkles size={17}/>Generate storyboard <span>→</span></button>
          {notice && <p className="notice" role="status">{notice}</p>}<p className="privacy-note">✦ Brief stays in this browser session. No provider API is connected yet.</p>
        </section>
        <section className="panel output-panel">
          <div className="panel-heading"><div><span className="step">02</span><div><h2>Storyboard</h2><p>{scenes ? `${scenes.length} scenes · ${total}s estimated` : "Your story will take shape here."}</p></div></div>{scenes && <button className="export-btn" onClick={exportBrief}><Download size={15}/>Export brief</button>}</div>
          {!scenes ? <div className="empty-state"><div className="empty-art"><div className="art-card back"/><div className="art-card front"><Clapperboard size={30}/><span>YOUR STORY</span></div><b>✳</b></div><h3>Your next idea starts here.</h3><p>Fill in your project brief and generate a scene-by-scene outline.</p><div className="empty-steps">01 Brief　—　02 Story　—　03 Produce</div></div> :
            <div className="story-layout"><div className="scene-list">{scenes.map((s, i) => <button key={s.title} onClick={() => setActive(i)} className={active === i ? "scene-item chosen" : "scene-item"}><span>{String(i + 1).padStart(2, "0")}</span><div>{s.title}<small><Clock3 size={11}/> {s.duration}s</small></div>›</button>)}</div>
              {current && <div className="scene-editor"><div className="scene-preview"><span>SCENE {String(active + 1).padStart(2, "0")} · {current.duration} SEC</span><Film size={27}/><strong>{current.title}</strong><small>VISUAL DIRECTION · TEXT ONLY</small></div><label><Film size={13}/> VISUAL DIRECTION</label><textarea rows={3} value={current.visual} onChange={e => edit("visual", e.target.value)}/><label><Mic2 size={13}/> VOICEOVER SCRIPT</label><textarea rows={4} value={current.narration} onChange={e => edit("narration", e.target.value)}/><div className="editor-footer"><span><Captions size={13}/> Captions not rendered</span><span><Music2 size={13}/> Audio not generated</span></div></div>}
            </div>}
          <div className="pipeline"><div className="pipeline-title">PRODUCTION PIPELINE <span>PLANNED</span></div><div className="pipeline-items">{[{icon:WandSparkles,name:"Script",state:"Template demo"},{icon:Film,name:"Visuals",state:"Not connected"},{icon:Mic2,name:"Voice",state:"Not connected"},{icon:Captions,name:"Captions",state:"Not connected"},{icon:Clapperboard,name:"Render",state:"No MP4 yet"}].map(({icon:Icon,name,state}) => <div key={name}><span><Icon size={15}/></span><b>{name}</b><small>{state}</small></div>)}</div></div>
        </section>
      </div>
      <footer className="footer"><span>CREATOR AGENT AI · OPEN SOURCE PROJECT</span><span>Built for creators, one idea at a time.</span></footer>
    </main>
  </div>;
}
