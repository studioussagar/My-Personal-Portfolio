import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  BrainCircuit,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  Code2,
  Database,
  Github,
  Globe2,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Network,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  X,
  Zap,
} from "lucide-react";
import OrbitalNav, { ORBIT_NAV_NODES, type OrbitNavId } from "../components/OrbitalNav";

type Project = {
  rank: string;
  eyebrow: string;
  badge: string;
  name: string;
  short: string;
  description: string;
  stack: string[];
  color: string;
  icon: typeof BrainCircuit;
  github: string;
  live?: string;
  metric: string;
  metricLabel: string;
  featured?: boolean;
};

const projects: Project[] = [
  { rank: "01", eyebrow: "FLAGSHIP / FULL-STACK + AI", badge: "Flagship", name: "Scribbly", short: "A social publishing platform with an auditable AI writer-verification workflow.", description: "A Django-based social blogging platform built around real product workflows: PostgreSQL data modelling, REST APIs, role-based access, personalised feeds, relationship graphs, nested conversations, real-time messaging, notifications, and an AI-assisted administrative Review Center.", stack: ["Django", "PostgreSQL", "REST APIs", "WebSockets", "AI Agents"], color: "violet", icon: BrainCircuit, github: "https://github.com/studioussagar/Scribbly", metric: "01", metricLabel: "flagship build", featured: true },
  { rank: "02", eyebrow: "APPLIED ML / DEPLOYED", badge: "Case study", name: "Digit Recognizer ML", short: "A trained CNN turned into an interactive browser experience for handwritten digits.", description: "An end-to-end MNIST application spanning model training, evaluation, a Python application layer, HTML templates, and a deployed Flask interface that lets users submit handwritten digits and receive predictions.", stack: ["Python", "TensorFlow", "Keras", "Flask", "CNN"], color: "cyan", icon: Sparkles, github: "https://github.com/studioussagar/Digit_Recognizer_ML", metric: "99%+", metricLabel: "MNIST accuracy", featured: true },
  { rank: "03", eyebrow: "SECURITY / SYSTEMS", badge: "Deployed", name: "Akatsuki NetworkGuard", short: "A hackathon-built network security and monitoring platform; I handled deployment.", description: "A hackathon-built network security and monitoring platform with a dedicated frontend, backend, API server, architecture documentation, and analytics field mapping. I handled deployment, including backend hosting on my AWS EC2 instance.", stack: ["Security", "API Design", "Analytics", "AWS EC2", "Deployment"], color: "amber", icon: ShieldCheck, github: "https://github.com/studioussagar/akatsuki-networkguard", live: "https://akatsuki-networkguard.vercel.app", metric: "03", metricLabel: "priority build" },
  { rank: "04", eyebrow: "HACKATHON / TEAM-BUILT SYSTEM", badge: "Hackathon", name: "Sentinel-KSP", short: "A team-built crime-intelligence and cyber-command platform prototype.", description: "A group hackathon system for statewide crime analytics: React command interface, Flask API core, JWT and RBAC session governance, geospatial hotspot clustering, and entity-link investigation. Architecture and system design were discussed and shaped collaboratively across the whole team.", stack: ["React 18", "Flask", "NetworkX", "Zoho Catalyst"], color: "red", icon: TerminalSquare, github: "https://github.com/studioussagar/Sentinel-KSP", metric: "04", metricLabel: "hackathon build" },
  { rank: "05", eyebrow: "HACKATHON / SMART INDIA HACKATHON", badge: "Hackathon", name: "Chitragupta", short: "An AI-powered criminal network analysis prototype with graph intelligence workflows.", description: "A collaborative Smart India Hackathon prototype for SIH problem statement SIH26189: FastAPI backend, Next.js 14 investigative console, NetworkX graph intelligence with entity resolution and analytics, explainable evidence trails, and PDF dossier generation. I handled backend development for the graph intelligence workflow and investigative system backend.", stack: ["FastAPI", "Next.js 14", "NetworkX", "Graph Analytics"], color: "teal", icon: Network, github: "https://github.com/studioussagar/SIH-Proto", metric: "05", metricLabel: "hackathon build" },
  { rank: "06", eyebrow: "INTERNSHIP / ML + NLP", badge: "Internship", name: "ShadowFox Projects", short: "A collection of regression, NLP, and exploratory-analysis projects.", description: "Four end-to-end internship projects covering house-price prediction, car-price prediction, next-word prediction, and supermarket-sales analysis.", stack: ["scikit-learn", "Pandas", "NLP", "EDA"], color: "pink", icon: Network, github: "https://github.com/studioussagar/ShadowFox", metric: "06", metricLabel: "priority build" },
  { rank: "07", eyebrow: "PRODUCT / WEB APP", badge: "Prototype", name: "JobSphere", short: "A job-focused web application exploring digital career workflows.", description: "A practical product concept focused on job discovery and user-oriented career platform flows, demonstrating web development in a familiar product domain.", stack: ["Flask", "SQLite", "HTML5", "CSS3"], color: "blue", icon: BriefcaseBusiness, github: "https://github.com/studioussagar/JobSphere", metric: "07", metricLabel: "priority build" },
  { rank: "08", eyebrow: "EXPERIMENTAL / AI", badge: "Prototype", name: "AutoAI", short: "An accessible browser interface for exploring AI-powered functionality.", description: "An AI-oriented web project that experiments with presenting artificial-intelligence functionality through a clear, approachable browser experience.", stack: ["AI UX", "Web UI", "JavaScript"], color: "orange", icon: Zap, github: "https://github.com/studioussagar/AutoAI", metric: "08", metricLabel: "priority build" },
  { rank: "09", eyebrow: "FRONTEND / WELLNESS", badge: "Prototype", name: "Aura Wellness App", short: "A JavaScript wellness experience designed around approachable interaction.", description: "A consumer-focused application reflecting frontend development, interface design, and a human-centred approach to digital wellness use cases.", stack: ["JavaScript", "Frontend", "Product UI"], color: "green", icon: Globe2, github: "https://github.com/studioussagar/Aura_Wellness_App", metric: "09", metricLabel: "priority build" },
];

const projectProof: Record<string, { snapshot: string; outcomes: string[] }> = {
  Scribbly: { snapshot: "Django + PostgreSQL + REST/WebSockets + Review Center", outcomes: ["Role-based publishing and social workflows", "AI-assisted writer verification with human review", "Persistent, auditable administrative decisions"] },
  "Digit Recognizer ML": { snapshot: "MNIST CNN + Python application layer + Flask UI", outcomes: ["99%+ recognition accuracy", "Interactive handwritten-digit submission", "Model training and serving in one end-to-end build"] },
  "Akatsuki NetworkGuard": { snapshot: "Frontend + backend + API server + AWS EC2 deployment", outcomes: ["Network analysis and monitoring workflows", "I handled deployment — backend hosted on my AWS EC2 instance", "Security-oriented analytics field mapping"] },
  "Sentinel-KSP": { snapshot: "React 18 SPA + Flask API + RBAC + analytics engines", outcomes: ["Architecture and system design shaped collaboratively", "Role-based command workspaces with session governance", "Geospatial and link-analysis engines in one team build"] },
  Chitragupta: { snapshot: "FastAPI + Next.js 14 + NetworkX graph intelligence", outcomes: ["I handled backend development for graph intelligence workflows", "Entity resolution, analytics, evidence trails, PDF dossiers", "Investigative console built for SIH26189"] },
  "ShadowFox Projects": { snapshot: "Regression + NLP + exploratory analysis notebooks", outcomes: ["Four applied ML project tracks", "Supervised learning and sales analysis", "Practical model evaluation and data work"] },
  JobSphere: { snapshot: "Job discovery product flow + user-oriented web UI", outcomes: ["Career-focused product workflow exploration", "Practical web application structure", "User-facing interface implementation"] },
  AutoAI: { snapshot: "JavaScript browser interface for AI-oriented functionality", outcomes: ["Accessible AI product presentation", "Browser-first interaction design", "Experimentation with AI UX"] },
  "Aura Wellness App": { snapshot: "JavaScript frontend + consumer wellness experience", outcomes: ["Approachable wellness-oriented interaction", "Frontend composition and styling", "Consumer-focused product thinking"] },
};

const skillGroups = [
  { label: "Languages", items: ["Python", "Java", "C", "C++", "JavaScript", "PHP"], icon: TerminalSquare },
  { label: "Web & backend", items: ["Django", "Flask", "Spring Boot", "Node.js", "REST APIs", "WebSockets", "Angular v20"], icon: Code2 },
  { label: "Data & ML", items: ["TensorFlow", "Keras", "CNN", "scikit-learn", "NumPy", "Pandas", "Matplotlib"], icon: BrainCircuit },
  { label: "Cloud & systems", items: ["AWS EC2", "IAM", "Git", "GitHub", "Linux", "PostgreSQL", "MySQL"], icon: Database },
];

const experiences = [
  { period: "FEB — MAR 2026", role: "Computer Science Intern", company: "Tracksoft Solutions Pvt. Ltd.", detail: "Built Java full-stack features with Spring Boot, Angular v20, and PostgreSQL inside a professional agile delivery team.", outcomes: ["Implemented backend and frontend product flows", "Worked against PostgreSQL-backed application data", "Delivered inside an agile engineering team"] },
  { period: "JAN — MAR 2026", role: "AI/ML Virtual Intern", company: "AICTE · EduSkills · Google for Developers", detail: "Applied supervised and unsupervised ML techniques across a structured virtual internship and earned the highest programme tier.", outcomes: ["Completed applied ML assignments across core techniques", "Earned Grade O: Outstanding (90–100)", "Translated model concepts into practical implementations"] },
  { period: "FEB 2026", role: "AI/ML Intern", company: "ShadowFox", detail: "Delivered four structured ML and NLP proof-of-concept projects and was recognised for exceptional performance.", outcomes: ["Built house-price and car-price prediction models", "Explored next-word prediction and supermarket-sales analysis", "Delivered a complete internship project collection"] },
];

// Systems graph: projects <-> engineering domains (Profile panel).
// Fixed % coordinates in a shared 100x100 space: nodes (HTML) and edges (SVG)
// use the same space, so they stay glued at any size. No physics, no randomness.
type FocusHubId = "full" | "aiml" | "sec" | "cloud";

const focusHubs: { id: FocusHubId; label: string; short: string; shortMobile: string; color: string; x: number; y: number }[] = [
  { id: "full", label: "Full-stack engineering", short: "Full-stack", shortMobile: "FULL", color: "#6de7f8", x: 14, y: 50 },
  { id: "aiml", label: "AI / ML systems", short: "AI / ML", shortMobile: "AI/ML", color: "#c28dff", x: 85, y: 50 },
  { id: "sec", label: "Security & systems", short: "Security", shortMobile: "SEC", color: "#ffcb69", x: 50, y: 90 },
  { id: "cloud", label: "Cloud foundations", short: "Cloud", shortMobile: "CLOUD", color: "#73f4af", x: 50, y: 12 },
];

const focusProjects: { id: string; name: string; short: string; color: string; hubs: FocusHubId[]; blurb: string; x: number; y: number }[] = [
  { id: "scribbly", name: "Scribbly", short: "Scribbly", color: "#c28dff", hubs: ["full", "aiml", "sec", "cloud"], blurb: "Flagship platform + auditable AI review", x: 33, y: 70 },
  { id: "autoai", name: "AutoAI", short: "AutoAI", color: "#ff9c6b", hubs: ["aiml", "full"], blurb: "Browser-first AI product surface", x: 64, y: 34 },
  { id: "jobsphere", name: "JobSphere", short: "JobSphere", color: "#73adff", hubs: ["full"], blurb: "Job-discovery web flows", x: 28, y: 25 },
  { id: "shadowfox", name: "ShadowFox Projects", short: "ShadowFox", color: "#ff88bc", hubs: ["aiml"], blurb: "Regression, NLP + exploratory analysis", x: 85, y: 68 },
  { id: "digit", name: "Digit Recognizer ML", short: "Digit ML", color: "#6de7f8", hubs: ["aiml", "cloud"], blurb: "MNIST CNN + deployed Flask serving", x: 76, y: 22 },
  { id: "networkguard", name: "Akatsuki NetworkGuard", short: "NetworkGuard", color: "#ffcb69", hubs: ["sec", "cloud", "full"], blurb: "Monitoring workflows + AWS EC2 deployment", x: 64, y: 78 },
  { id: "aura", name: "Aura Wellness App", short: "Aura", color: "#73f4af", hubs: ["full"], blurb: "Consumer wellness frontend", x: 14, y: 82 },
  { id: "sentinel", name: "Sentinel-KSP", short: "Sentinel", color: "#ff7a7a", hubs: ["sec", "full"], blurb: "Team-built crime-intel + cyber-command platform", x: 87, y: 34 },
  { id: "chitragupta", name: "Chitragupta", short: "Chitragupta", color: "#5eead4", hubs: ["aiml", "full", "sec"], blurb: "Criminal-network graph intelligence backend", x: 82, y: 90 },
];

const verificationSteps = [
  { label: "Writer application", title: "A writer submits an application", detail: "Submitted writing is treated as user-controlled content. It is stored as data and never treated as instructions for the workflow." },
  { label: "Application analysis", title: "Signals are extracted for review", detail: "The application is analysed into structured evidence. The analysis layer stays separate from the final administrative decision." },
  { label: "LLM risk assessment", title: "The model returns a risk signal", detail: "LLM output is untrusted data. Malformed, unavailable, or prompt-injected output must fail safely instead of triggering an action." },
  { label: "Decisioning", title: "A recommendation is composed", detail: "Risk signals inform a recommendation, but they do not approve, reject, or modify writer status on their own." },
  { label: "Recommendation", title: "The Review Center shows the rationale", detail: "Administrators see the model recommendation and supporting evidence as distinct from their own decision." },
  { label: "Administrative review", title: "A human reviews the case", detail: "The administrator remains the decision-maker. The interface should make the human authority boundary explicit." },
  { label: "Final decision", title: "The administrative decision is persisted", detail: "The final decision is recorded separately from the model output, with actor and timestamp context." },
  { label: "Audit record", title: "The trail remains auditable", detail: "A durable audit record captures the application, recommendation, decision, and review action without allowing model output to rewrite history." },
];

function scrollToId(id: string) { document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }); }

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [sheetProject, setSheetProject] = useState<string | null>(null);
  const [sheetClosing, setSheetClosing] = useState(false);
  const [isNarrow, setIsNarrow] = useState(false);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const sheetCloseRef = useRef<HTMLButtonElement | null>(null);
  const closeTimer = useRef(0);
  const [activeVerification, setActiveVerification] = useState(0);
  const [activeGraph, setActiveGraph] = useState<string | null>(null);
  const canHoverGraph = useMemo(() => typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches, []);
  const graphHi = useMemo(() => {
    const hubs = new Set<FocusHubId>();
    const projects = new Set<string>();
    const edges = new Set<string>();
    if (activeGraph) {
      const [kind, id] = activeGraph.split(":");
      if (kind === "p") {
        projects.add(id);
        focusProjects.find((x) => x.id === id)?.hubs.forEach((h) => {
          hubs.add(h);
          edges.add(`${id}:${h}`);
        });
      } else {
        hubs.add(id as FocusHubId);
        for (const p of focusProjects) {
          if (p.hubs.includes(id as FocusHubId)) {
            projects.add(p.id);
            edges.add(`${p.id}:${id}`);
          }
        }
      }
    }
    return { hubs, projects, edges };
  }, [activeGraph]);
  const graphMeta = useMemo(() => {
    if (!activeGraph) return null;
    const [kind, id] = activeGraph.split(":");
    if (kind === "p") {
      const p = focusProjects.find((x) => x.id === id);
      if (!p) return null;
      return { title: p.name, detail: p.hubs.map((h) => focusHubs.find((x) => x.id === h)!.short).join("  ·  ") };
    }
    const h = focusHubs.find((x) => x.id === id);
    if (!h) return null;
    const members = focusProjects.filter((p) => p.hubs.includes(h.id));
    return { title: h.label, detail: `${members.length} builds — ${members.map((p) => p.short).join("  ·  ")}` };
  }, [activeGraph]);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [activeNav, setActiveNav] = useState<OrbitNavId>("home");
  // Ambient telemetry field: fixed decorative layer (see .telemetry CSS).
  // Hand-placed and deterministic — identical on every load. CSS motion only.
  const TELEMETRY_DOTS = [
    { x: 4, y: 12, tone: "tm-c", size: "tm-s2", drift: "tm-drift-a", delay: "0s", dur: "34s" },
    { x: 11, y: 68, tone: "tm-v", size: "tm-s2", drift: "tm-pulse", delay: "1.2s", dur: "5.5s" },
    { x: 18, y: 32, tone: "tm-c", size: "tm-s3", drift: "tm-drift-b", delay: "3s", dur: "27s" },
    { x: 26, y: 84, tone: "tm-a", size: "tm-s2", drift: "tm-drift-a", delay: "6s", dur: "38s" },
    { x: 33, y: 8, tone: "tm-v", size: "tm-s2", drift: "tm-drift-b", delay: "2s", dur: "30s" },
    { x: 41, y: 55, tone: "tm-c", size: "tm-s2", drift: "tm-pulse", delay: "2.4s", dur: "6.5s" },
    { x: 47, y: 22, tone: "tm-g", size: "tm-s2", drift: "tm-drift-a", delay: "9s", dur: "31s" },
    { x: 55, y: 76, tone: "tm-v", size: "tm-s3", drift: "tm-drift-b", delay: "1s", dur: "36s" },
    { x: 60, y: 40, tone: "tm-c", size: "tm-s2", drift: "tm-drift-a", delay: "12s", dur: "29s" },
    { x: 66, y: 90, tone: "tm-a", size: "tm-s2", drift: "tm-pulse", delay: "0.6s", dur: "7.5s" },
    { x: 72, y: 15, tone: "tm-v", size: "tm-s2", drift: "tm-drift-b", delay: "7s", dur: "33s" },
    { x: 78, y: 58, tone: "tm-c", size: "tm-s3", drift: "tm-drift-a", delay: "4s", dur: "37s" },
    { x: 85, y: 30, tone: "tm-g", size: "tm-s2", drift: "tm-pulse", delay: "3.1s", dur: "6s" },
    { x: 90, y: 72, tone: "tm-v", size: "tm-s2", drift: "tm-drift-a", delay: "10s", dur: "26s" },
    { x: 94, y: 48, tone: "tm-c", size: "tm-s2", drift: "tm-drift-b", delay: "5s", dur: "39s" },
    { x: 8, y: 45, tone: "tm-a", size: "tm-s2", drift: "tm-pulse", delay: "4.4s", dur: "8s" },
  ];
  const TELEMETRY_TRACES = [
    { x: 22, y: 40, w: 150, r: 24, delay: "0s" },
    { x: 63, y: 64, w: 180, r: -18, delay: "4s" },
    { x: 80, y: 22, w: 130, r: 40, delay: "8s" },
  ];
  const filters = ["All", "Full-Stack", "AI/ML", "Security", "Frontend"];
  const visibleProjects = useMemo(() => {
    if (activeFilter === "All") return projects;
    const map: Record<string, string[]> = { "Full-Stack": ["Scribbly", "Akatsuki NetworkGuard", "JobSphere", "Sentinel-KSP", "Chitragupta"], "AI/ML": ["Scribbly", "Digit Recognizer ML", "ShadowFox Projects", "AutoAI", "Chitragupta"], Security: ["Akatsuki NetworkGuard", "Sentinel-KSP", "Chitragupta"], Frontend: ["JobSphere", "AutoAI", "Aura Wellness App", "Chitragupta"] };
    return projects.filter((project) => map[activeFilter]?.includes(project.name));
  }, [activeFilter]);

  // Orbital navigation refs: the hero spacer anchors orbit geometry, the header
  // holds invisible slot spans that the fixed Saturn + nodes morph into.
  const stageRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const slotRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const saturnSlotRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setPrefersReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Active section tracking: single source for orbital nodes + navbar state.
  useEffect(() => {
    const targetToId: Record<string, OrbitNavId> = {
      top: "home",
      work: "work",
      about: "profile",
      experience: "journey",
      contact: "contact",
    };
    const ratios = new Map<string, number>();
    const pick = () => {
      let best: OrbitNavId = "home";
      let bestRatio = 0;
      ratios.forEach((ratio, id) => {
        if (ratio > bestRatio) {
          bestRatio = ratio;
          best = targetToId[id] ?? "home";
        }
      });
      setActiveNav((prev) => (prev === best ? prev : best));
    };
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          ratios.set((en.target as HTMLElement).id, en.isIntersecting ? en.intersectionRatio : 0);
        }
        pick();
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
    );
    ["top", "work", "about", "experience", "contact"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        ratios.set(id, 0);
        io.observe(el);
      }
    });
    return () => io.disconnect();
  }, []);

  const openProject = (name: string, ev: React.MouseEvent<HTMLButtonElement>) => {
    if (isNarrow) {
      openerRef.current = ev.currentTarget;
      setSheetClosing(false);
      setSheetProject(name);
    } else {
      setActiveProject((cur) => (cur === name ? null : name));
    }
  };
  const closeSheet = () => {
    if (sheetClosing) return;
    const done = () => {
      setSheetProject(null);
      setSheetClosing(false);
      openerRef.current?.focus({ preventScroll: true });
    };
    if (prefersReducedMotion) {
      done();
      return;
    }
    setSheetClosing(true);
    closeTimer.current = window.setTimeout(done, 300);
  };
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 650px)");
    const sync = () => setIsNarrow(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  useEffect(() => {
    if (!sheetProject) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sheetProject]);
  useEffect(() => {
    if (sheetProject && !sheetClosing) sheetCloseRef.current?.focus({ preventScroll: true });
  }, [sheetProject, sheetClosing]);
  useEffect(() => () => window.clearTimeout(closeTimer.current), []);
  const onSheetKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      closeSheet();
      return;
    }
    if (e.key !== "Tab") return;
    const root = e.currentTarget as HTMLElement;
    const items = Array.from(root.querySelectorAll<HTMLElement>("button:not([disabled]), a[href]")).filter((el) => el.offsetParent !== null);
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };
  const sheetData = useMemo(() => {
    if (!sheetProject) return null;
    const project = projects.find((p) => p.name === sheetProject);
    if (!project) return null;
    return { project, proof: projectProof[project.name] };
  }, [sheetProject]);

  return <div className="site-shell">
    <a className="skip-link" href="#main-content">Skip to content</a>
    <div className="telemetry" aria-hidden="true">
      {TELEMETRY_DOTS.map((d, i) => <span key={i} className={`tm-dot ${d.tone} ${d.size} ${d.drift}`} style={{ left: `${d.x}%`, top: `${d.y}%`, animationDelay: d.delay, animationDuration: d.dur }} />)}
      {TELEMETRY_TRACES.map((t, i) => <span key={`t${i}`} className="tm-trace" style={{ left: `${t.x}%`, top: `${t.y}%`, width: t.w, transform: `rotate(${t.r}deg)`, animationDelay: t.delay }} />)}
    </div>
    <header ref={headerRef} className="topbar">
      <a className="brand" href="#top" aria-label="Sagar Samadder home"><img className="brand-logo" src={`${import.meta.env.BASE_URL}logo.png`} alt="" width={32} height={32} decoding="async" /><span>Sagar<span className="brand-dot">.</span></span></a>
      <nav className="nav-cluster" aria-label="Primary navigation">
        <span ref={(el) => { slotRefs.current[0] = el; }} className="nav-slot">Work</span>
        <span ref={(el) => { slotRefs.current[1] = el; }} className="nav-slot">Profile</span>
        <span ref={(el) => { saturnSlotRef.current = el; }} className="nav-slot nav-slot-saturn" aria-hidden="true" />
        <span ref={(el) => { slotRefs.current[2] = el; }} className="nav-slot">Journey</span>
        <span ref={(el) => { slotRefs.current[3] = el; }} className="nav-slot">Contact</span>
      </nav>
      <a className="top-contact" href="mailto:sagarssn2005@gmail.com">Let's talk <ArrowUpRight size={15} /></a>
      <button ref={toggleRef} className="mobile-toggle" onClick={() => setMobileOpen((open) => !open)} aria-label={mobileOpen ? "Close menu" : "Open menu"} aria-expanded={mobileOpen}>{mobileOpen ? <X size={20} /> : <Menu size={20} />}</button>
      <nav className={mobileOpen ? "nav-links nav-open" : "nav-links"} aria-label="Mobile navigation">{ORBIT_NAV_NODES.map((n) => <a key={n.id} href={`#${n.target}`} onClick={() => setMobileOpen(false)}>{n.label}</a>)}</nav>
    </header>
    <OrbitalNav refs={{ stage: stageRef, slots: slotRefs, saturnSlot: saturnSlotRef, header: headerRef, toggle: toggleRef }} activeId={activeNav} reduced={prefersReducedMotion} onNavigate={scrollToId} />

    <main id="main-content">
      <section id="top" className="hero-section"><div className="hero-grid" aria-hidden="true" /><div className="hero-orb orb-one" aria-hidden="true" /><div className="hero-orb orb-two" aria-hidden="true" /><div className="hero-content container"><div className="hero-copy"><p className="eyebrow"><span className="eyebrow-line" /> SAGAR SAMADDER · COMPUTER ENGINEERING · PUNE, INDIA</p><h1>I build systems<br /><span>with a point of view.</span></h1><p className="hero-lead">Full-stack engineering, applied ML, and practical digital products — shaped into work that is useful, explainable, and built to ship.</p><div className="hero-actions"><button className="button button-primary" onClick={() => scrollToId("work")}>Explore the work <ArrowDownRight size={17} /></button><a className="button button-quiet" href="/resume.pdf" target="_blank" rel="noreferrer">View resume PDF <ArrowUpRight size={16} /></a></div><div className="hero-meta"><span><span className="pulse-dot" /> Available for opportunities</span><span className="meta-divider" /><span>Final year · 2027 batch</span><span className="meta-divider" /><span className="hero-seeking">Seeking software engineering · full-stack · AI/ML roles</span></div></div><div ref={stageRef} className="hero-stage" aria-hidden="true" /></div><div className="scroll-cue"><span>Scroll to explore</span><span className="scroll-line" /></div></section>

      <section className="signal-strip" aria-label="Portfolio summary"><div className="container signal-inner"><div><span className="signal-value">09</span><span className="signal-label">featured builds</span></div><div><span className="signal-value">03</span><span className="signal-label">internship tracks</span></div><div><span className="signal-value">99%+</span><span className="signal-label">MNIST accuracy</span></div><div><span className="signal-value">∞</span><span className="signal-label">curiosity in practice</span></div></div></section>

      <section id="work" className="work-section section-pad"><div className="container"><div className="section-heading work-heading"><div><p className="eyebrow"><span className="eyebrow-line" /> SELECTED WORK</p><h2>The work I keep<br /><em>coming back to.</em></h2></div><p className="heading-note">A ranked field guide to the systems, models, and product ideas I have built. Scribbly is the flagship — the rest follow by priority.</p></div><div className="filter-row" role="group" aria-label="Filter projects">{filters.map((filter) => <button key={filter} className={activeFilter === filter ? "filter-chip active" : "filter-chip"} onClick={() => setActiveFilter(filter)}>{filter}</button>)}<span className="filter-count">{visibleProjects.length.toString().padStart(2, "0")} / 09 visible</span></div><div className="project-list">{visibleProjects.map((project) => { const Icon = project.icon; const isActive = activeProject === project.name; const proof = projectProof[project.name]; return <article key={project.name} className={`project-row ${project.featured ? "is-featured" : ""} ${isActive ? "is-expanded" : ""}`}><div className={`project-index ${project.color}`}><span>{project.rank}</span><Icon size={19} /></div><div className="project-main"><div className="project-topline"><p className="project-eyebrow">{project.eyebrow}</p><span className={`featured-tag badge-${project.badge.toLowerCase().replace(" ", "-")}`}><Sparkles size={12} /> {project.badge}</span></div><h3>{project.name}</h3><p className="project-short">{project.short}</p><div className="stack-list">{project.stack.map((tech) => <span key={tech}>{tech}</span>)}</div><div className="project-proof"><span>{proof.snapshot}</span><ul>{proof.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}</ul></div><div className="project-quick-links"><a href={project.github} target="_blank" rel="noreferrer"><Github size={13} /> GitHub</a>{project.live && <a href={project.live} target="_blank" rel="noreferrer"><Globe2 size={13} /> Live demo</a>}</div><div className="project-detail" inert={!isActive}><div className="project-detail-inner"><p>{project.description}</p>{project.name === "Scribbly" && <button className="project-flow-link" onClick={() => scrollToId("scribbly-flow")}>View verification flow <ArrowUpRight size={13} /></button>}</div></div></div><div className="project-side"><div className="project-metric">{project.metric !== project.rank && <strong>{project.metric}</strong>}<span>{project.metricLabel}</span></div><button className="project-expand" onClick={(e) => openProject(project.name, e)} aria-expanded={isActive} aria-label={`${isActive ? "Collapse" : "Expand"} ${project.name} details`}>{isActive ? <X size={17} /> : <ChevronRight size={18} />}</button></div></article>; })}</div>{sheetData && (
      <div className={`sheet-backdrop${sheetClosing ? " is-closing" : ""}`} onClick={closeSheet} onKeyDown={onSheetKeyDown}>
        <div className="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title">
          <div className="sheet-head">
            <span className="sheet-index">{sheetData.project.rank}</span>
            <span className="sheet-eyebrow">{sheetData.project.eyebrow}</span>
            <button ref={sheetCloseRef} type="button" className="sheet-close" onClick={closeSheet} aria-label={`Close ${sheetData.project.name} details`}><X size={17} /></button>
          </div>
          <div className="sheet-body">
            <span className={`featured-tag badge-${sheetData.project.badge.toLowerCase().replace(" ", "-")}`}><Sparkles size={12} /> {sheetData.project.badge}</span>
            <h3 id="sheet-title">{sheetData.project.name}</h3>
            <p className="project-short sheet-short">{sheetData.project.short}</p>
            <div className="stack-list">{sheetData.project.stack.map((tech) => <span key={tech}>{tech}</span>)}</div>
            <div className="project-proof"><span>{sheetData.proof.snapshot}</span><ul>{sheetData.proof.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}</ul></div>
            <p className="sheet-desc">{sheetData.project.description}</p>
            <div className="project-quick-links"><a href={sheetData.project.github} target="_blank" rel="noreferrer"><Github size={13} /> GitHub</a>{sheetData.project.live && <a href={sheetData.project.live} target="_blank" rel="noreferrer"><Globe2 size={13} /> Live demo</a>}</div>
            {sheetData.project.name === "Scribbly" && <button className="project-flow-link" onClick={() => { closeSheet(); window.setTimeout(() => scrollToId("scribbly-flow"), prefersReducedMotion ? 0 : 300); }}>View verification flow <ArrowUpRight size={13} /></button>}
          </div>
        </div>
      </div>
      )}</div></section>

      <section id="scribbly-flow" className="verification-section section-pad"><div className="container"><div className="section-heading"><div><p className="eyebrow"><span className="eyebrow-line" /> SCRIBBLY / AI SAFETY LENS</p><h2>Recommendation is not<br /><em>the decision.</em></h2></div><p className="heading-note">A product architecture lens on the flagship project’s writer-verification workflow. The model can assist analysis; an administrator remains the final authority.</p></div><div className="verification-callout"><ShieldCheck size={18} /><div><strong>Human decision boundary</strong><span>Submitted writing and model output are untrusted inputs. Only an authenticated administrative action can create the final decision and audit record.</span></div></div><div className="verification-layout"><div className="verification-rail" role="tablist" aria-label="Scribbly verification flow">{verificationSteps.map((step, index) => <button key={step.label} className={activeVerification === index ? "verification-step active" : "verification-step"} onClick={() => setActiveVerification(index)} role="tab" aria-selected={activeVerification === index}><span className="verification-number">0{index + 1}</span><span>{step.label}</span><ChevronRight size={14} /></button>)}</div><div className="verification-detail" role="status"><span className="detail-kicker">STAGE 0{activeVerification + 1} / 08</span><h3>{verificationSteps[activeVerification].title}</h3><p>{verificationSteps[activeVerification].detail}</p><div className="verification-tags"><span><Check size={13} /> Human-in-the-loop</span><span><Check size={13} /> Audit-aware</span><span><Check size={13} /> Fail-safe</span></div></div></div><div className="verification-chain"><span>writer input</span><i>→</i><span>analysis</span><i>→</i><span>model signal</span><i>→</i><span>recommendation</span><i>→</i><strong>admin decision</strong><i>→</i><span>audit record</span></div></div></section>

      <section id="about" className="about-section section-pad"><div className="container about-grid"><div className="about-statement"><p className="eyebrow"><span className="eyebrow-line" /> PROFILE / 01</p><h2>Curious by default.<br /><em>Useful by design.</em></h2><p className="about-copy">I’m Sagar Samadder — a final-year Computer Engineering student building across the stack. My work moves between shipping product features, training models, and understanding the systems that make software dependable.</p><p className="about-copy">I learn quickly, onboard into unfamiliar codebases, and like the space where engineering decisions meet a real user need.</p><a className="text-link" href="https://github.com/studioussagar" target="_blank" rel="noreferrer">Open my GitHub <ArrowUpRight size={16} /></a></div><div className="focus-panel"><div className="focus-panel-head"><span>ENGINEERING FOCUS</span><span className="focus-tag"><span className="pulse-dot" /> SYSTEMS MATRIX</span></div><div className="focus-map"><div className="matrix" role="group" aria-label="Projects versus engineering domains" onKeyDown={(e) => { if (e.key === "Escape") setActiveGraph(null); }}><div className="matrix-head"><span className="matrix-corner">PROJECT / DOMAIN</span>{focusHubs.map((h) => {
  const key = `h:${h.id}`;
  const on = graphHi.hubs.has(h.id);
  const dim = activeGraph !== null && !on;
  const members = focusProjects.filter((p) => p.hubs.includes(h.id)).map((p) => p.name).join(", ");
  return <button key={h.id} type="button" className={on ? "matrix-hub is-active" : dim ? "matrix-hub is-dim" : "matrix-hub"} style={{ ["--hub-accent" as string]: h.color }} onMouseEnter={() => { if (canHoverGraph) setActiveGraph(key); }} onMouseLeave={() => { if (canHoverGraph) setActiveGraph(null); }} onFocus={() => setActiveGraph(key)} onBlur={() => setActiveGraph(null)} onClick={() => setActiveGraph((cur) => (cur === key ? null : key))} aria-pressed={activeGraph === key} aria-label={`${h.label}. Connected projects: ${members}`}><i style={{ background: h.color, boxShadow: `0 0 10px ${h.color}` }} aria-hidden="true" /><span className="hub-short-full">{h.short}</span><span className="hub-short-mobile" aria-hidden="true">{h.shortMobile}</span></button>;
})}</div>{focusProjects.map((p) => {
  const key = `p:${p.id}`;
  const rowOn = graphHi.projects.has(p.id);
  const rowDim = activeGraph !== null && !rowOn;
  const domains = p.hubs.map((h) => focusHubs.find((x) => x.id === h)!.label).join(", ");
  return <div key={p.id} className={rowOn ? "matrix-row is-active" : rowDim ? "matrix-row is-dim" : "matrix-row"}><button type="button" className="matrix-proj" onMouseEnter={() => { if (canHoverGraph) setActiveGraph(key); }} onMouseLeave={() => { if (canHoverGraph) setActiveGraph(null); }} onFocus={() => setActiveGraph(key)} onBlur={() => setActiveGraph(null)} onClick={() => setActiveGraph((cur) => (cur === key ? null : key))} aria-pressed={activeGraph === key} aria-label={`${p.name}, ${p.blurb}. Connected to ${domains}`}><span className="matrix-proj-dot" style={{ background: p.color, boxShadow: `0 0 10px ${p.color}` }} aria-hidden="true" />{p.short}</button>{focusHubs.map((h) => {
    const covers = p.hubs.includes(h.id);
    const lit = graphHi.edges.has(`${p.id}:${h.id}`);
    const colOn = graphHi.hubs.has(h.id);
    const cdim = activeGraph !== null && !lit && !rowOn && !colOn;
    const cls = lit ? "matrix-cell is-active" : `${colOn ? "matrix-cell in-col" : "matrix-cell"}${covers ? " is-on" : ""}${cdim ? " is-dim" : ""}`;
    return <button key={h.id} type="button" className={cls} style={lit ? { borderColor: h.color, boxShadow: `0 0 16px ${h.color}44` } : undefined} onMouseEnter={() => { if (canHoverGraph) setActiveGraph(key); }} onMouseLeave={() => { if (canHoverGraph) setActiveGraph(null); }} onFocus={() => setActiveGraph(key)} onBlur={() => setActiveGraph(null)} onClick={() => setActiveGraph((cur) => (cur === key ? null : key))} aria-pressed={activeGraph === key} aria-label={`${p.name} ${covers ? "covers" : "does not cover"} ${h.label}`}>{covers && <i style={{ background: h.color, boxShadow: `0 0 10px ${h.color}` }} aria-hidden="true" />}</button>;
  })}</div>;
})}
<div className="focus-graph-meta" role="status">{graphMeta ? <><strong>{graphMeta.title}</strong><span>{graphMeta.detail}</span></> : <><strong>9 projects across 4 focus areas</strong><span>Hover a project, domain, or cell to trace coverage</span></>}</div></div></div></div></div></section>

      <section className="skills-section section-pad"><div className="container"><div className="section-heading"><div><p className="eyebrow"><span className="eyebrow-line" /> THE TOOLKIT</p><h2>Many tools.<br /><em>One approach.</em></h2></div><p className="heading-note">A practical stack assembled through projects, internships, formal learning, and a habit of going one layer deeper.</p></div><div className="skill-grid">{skillGroups.map((group) => { const Icon = group.icon; return <div className="skill-card" key={group.label}><Icon size={20} /><h3>{group.label}</h3><div>{group.items.map((item) => <span key={item}>{item}</span>)}</div></div>; })}</div></div></section>

      <section id="experience" className="experience-section section-pad"><div className="container"><div className="section-heading"><div><p className="eyebrow"><span className="eyebrow-line" /> JOURNEY / 02</p><h2>Learning by<br /><em>shipping.</em></h2></div><p className="heading-note">Three internship tracks in one semester — a fast, focused stretch across software engineering and applied AI/ML.</p></div><div className="timeline">{experiences.map((experience, index) => <div className="timeline-item" key={experience.company}><div className="timeline-marker"><span>0{index + 1}</span></div><div className="timeline-content"><p className="timeline-period">{experience.period}</p><h3>{experience.role}</h3><p className="timeline-company">{experience.company}</p><p>{experience.detail}</p><ul className="experience-outcomes">{experience.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}</ul></div></div>)}</div><div className="achievement-row"><div><Check size={17} /> Grade O: Outstanding</div><div><Check size={17} /> Google for Developers programme</div><div><Check size={17} /> Hackathon advancement</div><div><Check size={17} /> 101 LeetCode problems solved</div></div></div></section>

      <section id="contact" className="contact-section section-pad"><div className="container contact-card"><div className="contact-glow" aria-hidden="true" /><div className="contact-ring" aria-hidden="true" /><div className="contact-grid"><div className="contact-content"><p className="eyebrow"><span className="eyebrow-line" /> CONTACT / 03</p><h2>Let’s build<br />what comes <em>next.</em></h2><p>Let’s talk about software, AI/ML, or the next product that needs a careful first version.</p><a className="button button-primary" href="mailto:sagarssn2005@gmail.com">Send me a message <ArrowUpRight size={17} /></a></div><div className="contact-channels" aria-label="Contact channels"><a className="channel-row" href="mailto:sagarssn2005@gmail.com" aria-label="Email: sagarssn2005@gmail.com"><span className="channel-icon"><Mail size={16} /></span><span className="channel-text"><span className="channel-label">Email</span><span className="channel-value">sagarssn2005@gmail.com</span></span><ArrowUpRight size={15} className="channel-arrow" /></a><a className="channel-row" href="https://github.com/studioussagar" target="_blank" rel="noreferrer" aria-label="GitHub: github.com/studioussagar"><span className="channel-icon"><Github size={16} /></span><span className="channel-text"><span className="channel-label">GitHub</span><span className="channel-value">github.com/studioussagar</span></span><ArrowUpRight size={15} className="channel-arrow" /></a><a className="channel-row" href="https://linkedin.com/in/sagar-samadder-913760292" target="_blank" rel="noreferrer" aria-label="LinkedIn: linkedin.com/in/sagar-samadder-913760292"><span className="channel-icon"><Linkedin size={16} /></span><span className="channel-text"><span className="channel-label">LinkedIn</span><span className="channel-value">linkedin.com/in/sagar-samadder-913760292</span></span><ArrowUpRight size={15} className="channel-arrow" /></a><a className="channel-row" href="https://leetcode.com/u/SSSKILLER" target="_blank" rel="noreferrer" aria-label="Practice log: leetcode.com/u/SSSKILLER"><span className="channel-icon"><Code2 size={16} /></span><span className="channel-text"><span className="channel-label">Practice log</span><span className="channel-value">leetcode.com/u/SSSKILLER</span></span><ArrowUpRight size={15} className="channel-arrow" /></a></div></div></div></section>
    </main>

    <footer className="footer"><div className="container footer-inner"><div className="footer-brand"><img className="brand-logo footer-logo" src={`${import.meta.env.BASE_URL}logo.png`} alt="" width={25} height={25} decoding="async" /><span>Sagar Sujit Samadder</span></div><div className="footer-location"><MapPin size={14} /> Pune, India · 2027 batch</div><div className="footer-links"><a href="https://github.com/studioussagar" target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={17} /></a><a href="https://linkedin.com/in/sagar-samadder-913760292" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={17} /></a><a href="mailto:sagarssn2005@gmail.com" aria-label="Email"><Mail size={17} /></a></div></div></footer>
  </div>;
}
