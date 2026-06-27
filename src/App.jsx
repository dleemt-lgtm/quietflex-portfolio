import { useState, useEffect } from "react";

const COLORS = {
  bg: "#0A0A0F",
  card: "#14141C",
  cardBorder: "#22222E",
  accent: "#6366F1",
  accentDim: "#4345a8",
  text: "#E8E6E0",
  textMuted: "#B0AEC8",
  textFaint: "#3A3850",
  tagBg: "#1E1E2E",
};

const PROJECTS = [
  {
    id: 1,
    title: "quietflex.dev Portfolio",
    category: "General software projects",
    tags: ["React", "Vite", "Vercel", "Space Grotesk", "Claude"],
    summary: "This site. A single-page React portfolio with a terminal typewriter hero, filterable project grid, and a design brief that started with the words 'respectfully rowdy.'",
    detail: "Built in a single Claude session, handed off to a multi-model review loop for polish. Design decisions are documented in ORIGINSTORY.md — palette, typography, motion restraint, and the reasoning behind every choice. Hosted on Vercel, domain on Porkbun. The component is intentionally self-contained: one file, no CSS framework, inline token system.",
    link: "https://quietflex.dev",
    year: "2026",
  },
  {
    id: 2,
    title: "Multi-Model Agent Bus",
    category: "AI Tools",
    tags: ["Claude Code", "Grok Build", "Codex", "NDJSON"],
    summary: "A message bus architecture for running Claude Code, Grok Build, and Codex in a coordinated agent loop — with a rotating Bus Driver orchestrator and autonomous listener agents that don't need a human in the loop.",
    detail: "Built around a shared bus.ndjson file at the project root. The Bus Driver role rotates — Claude Code, Grok, or Codex can drive depending on the session. The Bus Driver initializes the session, assigns tasks, monitors check-in intervals, handles pushback rulings, and calls consensus votes. Listener agents tail the bus, execute coder or reviewer roles, and signal blocking conditions without asking the human for permission at every step. Two companion skills — start-the-bus and ride-the-bus — encode the full protocol.",
    link: "#",
    year: "2026",
  },
  {
    id: 3,
    title: "MCP Home Lab",
    category: "Automations",
    tags: ["MCP", "Proxmox", "Unifi", "Python", "LXC", "Claude Code", "SSH"],
    summary: "A dedicated MCP LXC giving AI models structured, permissioned access to homelab infrastructure — Proxmox cluster management and Unifi network control, both surfaced as MCP servers with hardened security models.",
    detail: "A single LXC container hosts two MCP servers that expose homelab infrastructure to AI agents. The Proxmox MCP server (~150 lines of Python, proxmoxer + MCP SDK) connects via SSH transport — no open ports — using a dedicated API user scoped to non-destructive privileges only: allocate, clone, config, power management, snapshots. No VM.Destroy, no Sys.Modify. Tools exposed: list nodes/VMs/LXCs/storage/templates, get status, start/stop/reboot, create LXC, clone, get task status. The Unifi MCP server provides structured access to network management. The result: Claude Code can reason about and act on the homelab — spinning up containers, inspecting the network — without being able to burn it down.",
    link: "#",
    year: "2026",
  },
  {
    id: 4,
    title: "The Stack",
    category: "General software projects",
    tags: ["Alpaca", "Kalshi", "Polymarket", "PostgreSQL", "Flask", "Docker"],
    summary: "Three autonomous trading bots — prediction markets, decentralized markets, and US equities — running against a shared PostgreSQL database on a home lab server. Paper trading only. Honest P&L: flat to declining.",
    detail: "Built on jarvis (home lab) and orchestrated via docker-compose. Three bots each scan their respective markets for opportunities, score them against a shared model, and execute simulated trades logged to PostgreSQL. A Flask dashboard surfaces P&L curves and trade history across all three markets. The goal is twofold: learn algorithmic trading hands-on, and eventually run something profitable. Currently in the 'learning what doesn't work' phase — no real money at risk, no illusions about where the curves are pointing.",
    link: "#",
    year: "2026",
  },
  {
    id: 5,
    title: "Teams Unlock Workflow",
    category: "Automations",
    tags: ["Azure Service Bus", "Microsoft Teams", "Graph API", "PowerShell", "Enterprise"],
    summary: "A production automation that routes Microsoft Teams account unlock requests through Azure Service Bus to a custom orchestrator service — no helpdesk ticket, no manual intervention.",
    detail: "Built to replace a manual IT process. A Teams-based request triggers an Azure Service Bus message, picked up by a custom orchestrator service running as a Windows service. The orchestrator calls Graph API and PowerShell to resolve the unlock, then confirms completion back to the requestor. The architecture was deliberately chosen over a simpler n8n/webhook approach for reliability and auditability in an enterprise environment. Running in production.",
    link: "#",
    year: "2026",
  },
  {
    id: 6,
    title: "Project Whisper",
    category: "Automations",
    tags: ["faster-whisper", "Python", "Exchange Online", "On-prem AI", "Ubuntu"],
    summary: "Fully on-premises voicemail transcription system — voicemails arrive as emails, get intercepted, transcribed locally, and delivered back to recipients. No audio ever touches a cloud AI.",
    detail: "Built for an organization with strict data isolation requirements. An Exchange Online transport rule intercepts incoming voicemail emails from the phone carrier and routes them to a dedicated transcription mailbox. Two Python systemd services (poller and worker) handle the queue — poller watches for new messages, worker runs faster-whisper with OpenAI's small model entirely on-prem. Transcribed text is formatted and resent to the original recipient. Azure app registration is scoped to Mail.Read, Mail.ReadWrite, and Mail.Send only, restricted via application access policy to the transcription mailbox exclusively. The deliberate choice to keep inference local — not a cost decision, a data governance decision.",
    link: "#",
    year: "2026",
  },
  {
    id: 7,
    title: "Executive Assistant Orchestrator",
    category: "AI Tools",
    tags: ["Gemma", "FastAPI", "MCP", "M365", "Graph API", "Local LLM"],
    summary: "A FastAPI orchestrator wired to a locally-running Gemma 4 26B model — giving an executive AI-assisted daily digests, meeting prep, email draft reviews, and action item extraction, with the orchestrator owning control flow and humans approving before anything sends.",
    detail: "The orchestrator sits between the local LLM (gemma-4-26b-q4_0 running on-prem) and M365 via Graph API. Enabled workflows: daily digest, meeting prep briefs, email draft preparation, action item extraction from notes and transcripts, and due outreach drafts. Hard architectural constraint: the orchestrator owns control flow, email sending requires explicit human approval, and drafts are always separate from sending. Nothing fires automatically. The model reasons; the human decides. Built to replace a cloud-dependent assistant stack with something that runs locally, respects data boundaries, and doesn't surprise the operator.",
    link: "#",
    year: "2026",
  },
  {
    id: 8,
    title: "Second Brain",
    category: "AI Tools",
    tags: ["Obsidian", "MCP", "Qwen", "Git", "Python", "Local LLM"],
    summary: "A self-hosted AI memory system — terminal sessions from Claude, Codex, and Grok are captured, synthesized by a local LLM, and surfaced via an MCP query server. ~130 sessions in, running on homelab infrastructure.",
    detail: "Three collectors (Claude, Codex, Grok) run via ingest scripts on a local machine and push raw session data to a git bare repo on a dedicated LXC container. A Python synthesis pipeline (synthesize_vault.py) runs via local Qwen to produce Wiki/Session summaries from raw captures. An MCP query server with 2-tier token auth makes the synthesized vault queryable by any connected AI client. GitHub mirror provides backup. A post-receive hook on the bare repo auto-pulls the live vault on every push, keeping the MCP server fresh without manual SSH. Active project — ingest automation, synthesis range tooling, and PTY capture improvements are in progress.",
    link: "#",
    year: "2026",
  },
];

const CATEGORIES = ["All", "AI Tools", "Automations", "Written work / Prompts", "General software projects"];

const TERMINAL_LINES = [
  { text: "> initializing quietflex...", delay: 0 },
  { text: "> wiring models. loading work.", delay: 700 },
  { text: "> dan lee. ready.", delay: 1500 },
];

function useTypewriter(lines) {
  const [displayed, setDisplayed] = useState([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let timeouts = [];
    lines.forEach((line, i) => {
      const t = setTimeout(() => {
        setDisplayed((prev) => [...prev, line.text]);
        if (i === lines.length - 1) setDone(true);
      }, line.delay);
      timeouts.push(t);
    });
    return () => timeouts.forEach(clearTimeout);
  }, []);

  return { displayed, done };
}

function TerminalHero({ name, tagline }) {
  const { displayed, done } = useTypewriter(TERMINAL_LINES);
  const [showMain, setShowMain] = useState(false);

  useEffect(() => {
    if (done) {
      const t = setTimeout(() => setShowMain(true), 400);
      return () => clearTimeout(t);
    }
  }, [done]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 2rem", maxWidth: 760, margin: "0 auto" }}>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.8rem", color: COLORS.accent, marginBottom: "2rem", lineHeight: 2 }}>
        {displayed.map((line, i) => (
          <div key={i} style={{ opacity: 0.85 }}>{line}</div>
        ))}
        {!done && <span style={{ animation: "blink 1s step-end infinite", color: COLORS.accent }}>█</span>}
      </div>

      <div style={{ transition: "opacity 0.8s ease, transform 0.8s ease", opacity: showMain ? 1 : 0, transform: showMain ? "translateY(0)" : "translateY(12px)" }}>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 700, color: COLORS.text, margin: 0, lineHeight: 1.05, letterSpacing: "-0.02em" }}>
          {name}
        </h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "clamp(1rem, 2.5vw, 1.25rem)", color: COLORS.textMuted, marginTop: "1rem", maxWidth: 520, lineHeight: 1.6 }}>
          {tagline}
        </p>
        <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", flexWrap: "wrap" }}>
          <a href="#work" style={{ background: COLORS.accent, color: "#fff", padding: "0.65rem 1.5rem", borderRadius: 6, fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "0.9rem", textDecoration: "none", letterSpacing: "0.01em" }}>
            See the work
          </a>
          <a href="https://github.com/dleemt-lgtm" target="_blank" rel="noopener noreferrer" style={{ border: `1px solid ${COLORS.cardBorder}`, color: COLORS.textMuted, padding: "0.65rem 1.5rem", borderRadius: 6, fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: "0.9rem", textDecoration: "none" }}>
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
}

function Tag({ label }) {
  return (
    <span style={{ background: COLORS.tagBg, color: COLORS.textMuted, fontSize: "0.7rem", fontFamily: "'Inter', sans-serif", fontWeight: 500, padding: "0.2rem 0.55rem", borderRadius: 4, border: `1px solid ${COLORS.cardBorder}`, letterSpacing: "0.03em", whiteSpace: "nowrap" }}>
      {label}
    </span>
  );
}

const MAX_TAGS_COLLAPSED = 5;

function ProjectCard({ project }) {
  const [expanded, setExpanded] = useState(false);
  const toggle = () => setExpanded((v) => !v);
  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  };
  const visibleTags = expanded || project.tags.length <= MAX_TAGS_COLLAPSED
    ? project.tags
    : project.tags.slice(0, MAX_TAGS_COLLAPSED);
  const hiddenTagCount = project.tags.length - visibleTags.length;

  return (
    <div
      role="button"
      tabIndex={0}
      className="project-card"
      aria-expanded={expanded}
      aria-label={`${project.title} — ${expanded ? "collapse" : "expand"} details`}
      onClick={toggle}
      onKeyDown={onKeyDown}
      style={{
        background: COLORS.card,
        border: `1px solid ${expanded ? COLORS.accent : COLORS.cardBorder}`,
        borderRadius: 10,
        padding: "1.5rem 1.6rem",
        cursor: "pointer",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        boxShadow: expanded ? `0 0 0 1px ${COLORS.accent}22, 0 8px 32px #00000044` : "none",
        position: "relative",
        outline: "none",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", color: COLORS.accent, background: `${COLORS.accent}18`, padding: "0.15rem 0.5rem", borderRadius: 4, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              {project.category}
            </span>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", color: COLORS.textFaint }}>
              {project.year}
            </span>
          </div>
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.1rem", fontWeight: 600, color: COLORS.text, margin: 0, lineHeight: 1.3 }}>
            {project.title}
          </h3>
        </div>
        <span style={{ color: COLORS.textFaint, fontSize: "1.1rem", flexShrink: 0, marginTop: 2, transition: "transform 0.2s ease", transform: expanded ? "rotate(45deg)" : "rotate(0deg)" }}>
          +
        </span>
      </div>

      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.88rem", color: COLORS.textMuted, margin: "0.85rem 0 0", lineHeight: 1.65 }}>
        {project.summary}
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem 0.4rem", marginTop: "1.1rem", rowGap: "0.45rem" }}>
        {visibleTags.map((t) => <Tag key={t} label={t} />)}
        {hiddenTagCount > 0 && (
          <span style={{ background: COLORS.tagBg, color: COLORS.textFaint, fontSize: "0.7rem", fontFamily: "'Inter', sans-serif", fontWeight: 500, padding: "0.2rem 0.55rem", borderRadius: 4, border: `1px solid ${COLORS.cardBorder}`, letterSpacing: "0.03em", whiteSpace: "nowrap" }}>
            +{hiddenTagCount} more
          </span>
        )}
      </div>

      {expanded && (
        <div style={{ marginTop: "1.25rem", paddingTop: "1.25rem", borderTop: `1px solid ${COLORS.cardBorder}` }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: COLORS.text, lineHeight: 1.75, margin: 0 }}>
            {project.detail}
          </p>
          {project.link !== "#" && (
            <a
              href={project.link}
              onClick={(e) => e.stopPropagation()}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-block", marginTop: "1rem", color: COLORS.accent, fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", fontWeight: 600, textDecoration: "none", letterSpacing: "0.02em" }}
            >
              View project →
            </a>
          )}
        </div>
      )}
    </div>
  );
}

function FilterBar({ active, onChange }) {
  return (
    <div role="group" aria-label="Filter projects by category" style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "2.5rem" }}>
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          type="button"
          className="filter-btn"
          aria-pressed={active === cat}
          onClick={() => onChange(cat)}
          style={{
            background: active === cat ? COLORS.accent : "transparent",
            color: active === cat ? "#fff" : COLORS.textMuted,
            border: `1px solid ${active === cat ? COLORS.accent : COLORS.cardBorder}`,
            padding: "0.4rem 0.9rem",
            borderRadius: 6,
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.8rem",
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.15s ease",
            letterSpacing: "0.01em",
          }}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

export default function App() {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono&family=Inter:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: ${COLORS.bg}; color: ${COLORS.text}; }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .project-card:focus-visible { outline: 2px solid ${COLORS.accent}; outline-offset: 3px; }
        .filter-btn:focus-visible { outline: 2px solid ${COLORS.accent}; outline-offset: 2px; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${COLORS.bg}; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.cardBorder}; border-radius: 3px; }
        .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: start; }
        @media (max-width: 768px) { .about-grid { grid-template-columns: 1fr; gap: 2rem; } }
      `}</style>

      <div style={{ background: COLORS.bg, minHeight: "100vh" }}>
        <section>
          <TerminalHero
            name="Dan Lee"
            tagline="AI builder & automation architect. I wire models together, build the infrastructure around them, and ship things that actually run."
          />
        </section>

        <section id="work" style={{ padding: "6rem 2rem", maxWidth: 900, margin: "0 auto" }}>
          <div style={{ marginBottom: "3rem" }}>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", color: COLORS.accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
              Selected work
            </p>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, color: COLORS.text, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
              Things I've built
            </h2>
          </div>

          <FilterBar active={filter} onChange={setFilter} />

          <div style={{ display: "grid", gap: "1.25rem", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 400px), 1fr))" }}>
            {filtered.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </section>

        <section style={{ borderTop: `1px solid ${COLORS.cardBorder}`, padding: "5rem 2rem", maxWidth: 900, margin: "0 auto" }}>
          <div className="about-grid">
            <div>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", color: COLORS.accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                About
              </p>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.75rem", fontWeight: 700, color: COLORS.text, lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: "1rem" }}>
                Builder. Tinkerer. Kalispell, MT.
              </h2>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", color: COLORS.textMuted, lineHeight: 1.75 }}>
                I build multi-model AI systems, wire up home lab infrastructure, and figure out what these tools can actually do when you push them past the demos. Most of this work happens quietly — agents running, models talking to each other, things shipping without much fanfare.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {[
                { label: "Stack", value: "Claude API, MCP, DropKit, React, Python, n8n" },
                { label: "Approach", value: "Wire it up. See what breaks. Fix it. Ship it." },
                { label: "Status", value: "Building in public. Not looking. Just showing work." },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", color: COLORS.accent, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.3rem" }}>{label}</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.88rem", color: COLORS.text }}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ textAlign: "center", padding: "5rem 2rem", borderTop: `1px solid ${COLORS.cardBorder}` }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.5rem, 4vw, 2.25rem)", fontWeight: 700, color: COLORS.text, marginBottom: "1rem", letterSpacing: "-0.02em" }}>
            More coming.
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", color: COLORS.textMuted, fontSize: "0.95rem", marginBottom: "2rem" }}>
            This is a live document. Projects get added when they're worth showing.
          </p>
          <a href="https://github.com/dleemt-lgtm" target="_blank" rel="noopener noreferrer" style={{ background: COLORS.accent, color: "#fff", padding: "0.75rem 2rem", borderRadius: 6, fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "0.95rem", textDecoration: "none", display: "inline-block" }}>
            GitHub
          </a>
          <div style={{ marginTop: "4rem", fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", color: COLORS.textFaint, letterSpacing: "0.05em" }}>
            © 2026 Dan Lee · Built with Claude · quietflex.dev
          </div>
        </section>
      </div>
    </>
  );
}
