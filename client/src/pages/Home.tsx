import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  BrainCircuit,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  CircleDot,
  Code2,
  Database,
  ExternalLink,
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
  { rank: "03", eyebrow: "SECURITY / SYSTEMS", badge: "Deployed", name: "Akatsuki NetworkGuard", short: "A network security and monitoring platform designed for analysis workflows.", description: "A full-stack system with a dedicated frontend, backend, API server, architecture documentation, analytics field mapping, dependency configuration, and a deployed interface.", stack: ["Security", "API Design", "Analytics", "Deployment"], color: "amber", icon: ShieldCheck, github: "https://github.com/studioussagar/akatsuki-networkguard", live: "https://akatsuki-networkguard.vercel.app", metric: "03", metricLabel: "priority build" },
  { rank: "04", eyebrow: "INTERNSHIP / ML + NLP", badge: "Internship", name: "ShadowFox Projects", short: "A collection of regression, NLP, and exploratory-analysis projects.", description: "Four end-to-end internship projects covering house-price prediction, car-price prediction, next-word prediction, and supermarket-sales analysis.", stack: ["scikit-learn", "Pandas", "NLP", "EDA"], color: "pink", icon: Network, github: "https://github.com/studioussagar/ShadowFox", metric: "04", metricLabel: "priority build" },
  { rank: "05", eyebrow: "PRODUCT / WEB APP", badge: "Prototype", name: "JobSphere", short: "A job-focused web application exploring digital career workflows.", description: "A practical product concept focused on job discovery and user-oriented career platform flows, demonstrating web development in a familiar product domain.", stack: ["Flask", "SQLite", "HTML5", "CSS3"], color: "blue", icon: BriefcaseBusiness, github: "https://github.com/studioussagar/JobSphere", metric: "05", metricLabel: "priority build" },
  { rank: "06", eyebrow: "EXPERIMENTAL / AI", badge: "Prototype", name: "AutoAI", short: "An accessible browser interface for exploring AI-powered functionality.", description: "An AI-oriented web project that experiments with presenting artificial-intelligence functionality through a clear, approachable browser experience.", stack: ["AI UX", "Web UI", "JavaScript"], color: "orange", icon: Zap, github: "https://github.com/studioussagar/AutoAI", metric: "06", metricLabel: "priority build" },
  { rank: "07", eyebrow: "FRONTEND / WELLNESS", badge: "Prototype", name: "Aura Wellness App", short: "A JavaScript wellness experience designed around approachable interaction.", description: "A consumer-focused application reflecting frontend development, interface design, and a human-centred approach to digital wellness use cases.", stack: ["JavaScript", "Frontend", "Product UI"], color: "green", icon: Globe2, github: "https://github.com/studioussagar/Aura_Wellness_App", metric: "07", metricLabel: "priority build" },
];

const projectProof: Record<string, { snapshot: string; outcomes: string[] }> = {
  Scribbly: { snapshot: "Django + PostgreSQL + REST/WebSockets + Review Center", outcomes: ["Role-based publishing and social workflows", "AI-assisted writer verification with human review", "Persistent, auditable administrative decisions"] },
  "Digit Recognizer ML": { snapshot: "MNIST CNN + Python application layer + Flask UI", outcomes: ["99%+ recognition accuracy", "Interactive handwritten-digit submission", "Model training and serving in one end-to-end build"] },
  "Akatsuki NetworkGuard": { snapshot: "Frontend + backend + API server + deployed dashboard", outcomes: ["Network analysis and monitoring workflows", "Security-oriented analytics field mapping", "Architecture documentation and deployment practice"] },
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

const workflowSteps = [
  { label: "Code", detail: "Build the product surface and API contracts.", project: "Scribbly", anchor: "#work" },
  { label: "Model", detail: "Train, evaluate, and expose a useful model.", project: "Digit Recognizer ML", anchor: "#work" },
  { label: "Deploy", detail: "Turn the build into a usable web experience.", project: "Akatsuki NetworkGuard", anchor: "#work" },
  { label: "Improve", detail: "Observe, review, and iterate with evidence.", project: "Scribbly Review Center", anchor: "#work" },
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
  const [activeWorkflow, setActiveWorkflow] = useState(0);
  const [activeVerification, setActiveVerification] = useState(0);
  const filters = ["All", "Full-Stack", "AI/ML", "Security", "Frontend"];
  const visibleProjects = useMemo(() => {
    if (activeFilter === "All") return projects;
    const map: Record<string, string[]> = { "Full-Stack": ["Scribbly", "Akatsuki NetworkGuard", "JobSphere"], "AI/ML": ["Scribbly", "Digit Recognizer ML", "ShadowFox Projects", "AutoAI"], Security: ["Akatsuki NetworkGuard"], Frontend: ["JobSphere", "AutoAI", "Aura Wellness App"] };
    return projects.filter((project) => map[activeFilter]?.includes(project.name));
  }, [activeFilter]);

  return <div className="site-shell">
    <a className="skip-link" href="#main-content">Skip to content</a>
    <header className="topbar">
      <a className="brand" href="#top" aria-label="Sagar Samadder home"><span className="brand-mark"><CircleDot size={16} /></span><span>SS<span className="brand-dot">.</span></span></a>
      <nav className={mobileOpen ? "nav-links nav-open" : "nav-links"} aria-label="Primary navigation"><a href="#work" onClick={() => setMobileOpen(false)}>Work</a><a href="#about" onClick={() => setMobileOpen(false)}>Profile</a><a href="#experience" onClick={() => setMobileOpen(false)}>Journey</a><a href="#contact" onClick={() => setMobileOpen(false)}>Contact</a></nav>
      <a className="top-contact" href="mailto:sagarssn2005@gmail.com">Let's talk <ArrowUpRight size={15} /></a>
      <button className="mobile-toggle" onClick={() => setMobileOpen((open) => !open)} aria-label={mobileOpen ? "Close menu" : "Open menu"} aria-expanded={mobileOpen}>{mobileOpen ? <X size={20} /> : <Menu size={20} />}</button>
    </header>

    <main id="main-content">
      <section id="top" className="hero-section"><div className="hero-grid" aria-hidden="true" /><div className="hero-orb orb-one" aria-hidden="true" /><div className="hero-orb orb-two" aria-hidden="true" /><div className="hero-content container"><div className="hero-copy"><p className="eyebrow"><span className="eyebrow-line" /> COMPUTER ENGINEERING · PUNE, INDIA</p><h1>I build systems<br /><span>with a point of view.</span></h1><p className="hero-lead">Full-stack engineering, applied ML, and practical digital products — shaped into work that is useful, explainable, and built to ship.</p><div className="hero-actions"><button className="button button-primary" onClick={() => scrollToId("work")}>Explore the work <ArrowDownRight size={17} /></button><a className="button button-quiet" href="/manus-storage/Sagar_Samadder_Master_Resume(2)_58a78d40.pdf" target="_blank" rel="noreferrer">View resume PDF <ArrowUpRight size={16} /></a></div><div className="hero-meta"><span><span className="pulse-dot" /> Available for opportunities</span><span className="meta-divider" /><span>Final year · 2027 batch</span><span className="meta-divider" /><span className="hero-seeking">Seeking software engineering · full-stack · AI/ML roles</span></div></div><div className="hero-stage" aria-label="Abstract 3D orbit representing connected engineering disciplines"><div className="stage-label stage-label-top">/ SYSTEMS IN MOTION</div><div className="orbit orbit-a"><span className="orbit-node node-a" /><span className="orbit-node node-b" /></div><div className="orbit orbit-b"><span className="orbit-node node-c" /><span className="orbit-node node-d" /></div><div className="workflow-core"><div className="core-orbit-label">ENGINEERING LOOP</div><div className="core"><div className="core-inner"><Network size={32} strokeWidth={1.25} /><span>BUILD<br />LOOP</span></div></div><div className="workflow-steps" role="tablist" aria-label="Engineering workflow">{workflowSteps.map((step, index) => <button key={step.label} className={activeWorkflow === index ? "workflow-step active" : "workflow-step"} onClick={() => setActiveWorkflow(index)} role="tab" aria-selected={activeWorkflow === index}>{index + 1}<span>{step.label}</span></button>)}</div><div className="workflow-detail" role="status"><strong>{workflowSteps[activeWorkflow].project}</strong><span>{workflowSteps[activeWorkflow].detail}</span><button onClick={() => scrollToId("work")}>See related work <ArrowUpRight size={13} /></button></div></div><div className="stage-caption"><span className="caption-index">0{activeWorkflow + 1}</span><span>{workflowSteps[activeWorkflow].label} / {workflowSteps[(activeWorkflow + 1) % workflowSteps.length].label}</span></div></div></div><div className="scroll-cue"><span>Scroll to explore</span><span className="scroll-line" /></div></section>

      <section className="signal-strip" aria-label="Portfolio summary"><div className="container signal-inner"><div><span className="signal-value">07</span><span className="signal-label">featured builds</span></div><div><span className="signal-value">03</span><span className="signal-label">internship tracks</span></div><div><span className="signal-value">99%+</span><span className="signal-label">MNIST accuracy</span></div><div><span className="signal-value">∞</span><span className="signal-label">curiosity in practice</span></div></div></section>

      <section id="work" className="work-section section-pad"><div className="container"><div className="section-heading work-heading"><div><p className="eyebrow"><span className="eyebrow-line" /> SELECTED WORK</p><h2>The work I keep<br /><em>coming back to.</em></h2></div><p className="heading-note">A ranked field guide to the systems, models, and product ideas I have built. Scribbly is the flagship — the rest follow by priority.</p></div><div className="filter-row" role="group" aria-label="Filter projects">{filters.map((filter) => <button key={filter} className={activeFilter === filter ? "filter-chip active" : "filter-chip"} onClick={() => setActiveFilter(filter)}>{filter}</button>)}<span className="filter-count">{visibleProjects.length.toString().padStart(2, "0")} / 07 visible</span></div><div className="project-list">{visibleProjects.map((project) => { const Icon = project.icon; const isActive = activeProject === project.name; const proof = projectProof[project.name]; return <article key={project.name} className={`project-row ${project.featured ? "is-featured" : ""} ${isActive ? "is-expanded" : ""}`}><div className={`project-index ${project.color}`}><span>{project.rank}</span><Icon size={19} /></div><div className="project-main"><div className="project-topline"><p className="project-eyebrow">{project.eyebrow}</p><span className={`featured-tag badge-${project.badge.toLowerCase().replace(" ", "-")}`}><Sparkles size={12} /> {project.badge}</span></div><h3>{project.name}</h3><p className="project-short">{project.short}</p><div className="stack-list">{project.stack.map((tech) => <span key={tech}>{tech}</span>)}</div><div className="project-proof"><span>{proof.snapshot}</span><ul>{proof.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}</ul></div><div className="project-quick-links"><a href={project.github} target="_blank" rel="noreferrer"><Github size={13} /> GitHub</a>{project.live && <a href={project.live} target="_blank" rel="noreferrer"><Globe2 size={13} /> Live demo</a>}</div>{isActive && <div className="project-detail"><p>{project.description}</p><div className="project-links"><a href={project.github} target="_blank" rel="noreferrer"><Github size={15} /> GitHub <ExternalLink size={13} /></a>{project.live && <a href={project.live} target="_blank" rel="noreferrer"><Globe2 size={15} /> Live demo <ExternalLink size={13} /></a>}</div>{project.name === "Scribbly" && <button className="project-flow-link" onClick={() => scrollToId("scribbly-flow")}>View verification flow <ArrowUpRight size={13} /></button>}</div>}</div><div className="project-side"><div className="project-metric"><strong>{project.metric}</strong><span>{project.metricLabel}</span></div><button className="project-expand" onClick={() => setActiveProject(isActive ? null : project.name)} aria-expanded={isActive} aria-label={`${isActive ? "Collapse" : "Expand"} ${project.name} details`}>{isActive ? <X size={17} /> : <ChevronRight size={18} />}</button></div></article>; })}</div></div></section>

      <section id="scribbly-flow" className="verification-section section-pad"><div className="container"><div className="section-heading"><div><p className="eyebrow"><span className="eyebrow-line" /> SCRIBBLY / AI SAFETY LENS</p><h2>Recommendation is not<br /><em>the decision.</em></h2></div><p className="heading-note">A product architecture lens on the flagship project’s writer-verification workflow. The model can assist analysis; an administrator remains the final authority.</p></div><div className="verification-callout"><ShieldCheck size={18} /><div><strong>Human decision boundary</strong><span>Submitted writing and model output are untrusted inputs. Only an authenticated administrative action can create the final decision and audit record.</span></div></div><div className="verification-layout"><div className="verification-rail" role="tablist" aria-label="Scribbly verification flow">{verificationSteps.map((step, index) => <button key={step.label} className={activeVerification === index ? "verification-step active" : "verification-step"} onClick={() => setActiveVerification(index)} role="tab" aria-selected={activeVerification === index}><span className="verification-number">0{index + 1}</span><span>{step.label}</span><ChevronRight size={14} /></button>)}</div><div className="verification-detail" role="status"><span className="detail-kicker">STAGE 0{activeVerification + 1} / 08</span><h3>{verificationSteps[activeVerification].title}</h3><p>{verificationSteps[activeVerification].detail}</p><div className="verification-tags"><span><Check size={13} /> Human-in-the-loop</span><span><Check size={13} /> Audit-aware</span><span><Check size={13} /> Fail-safe</span></div></div></div><div className="verification-chain"><span>writer input</span><i>→</i><span>analysis</span><i>→</i><span>model signal</span><i>→</i><span>recommendation</span><i>→</i><strong>admin decision</strong><i>→</i><span>audit record</span></div></div></section>

      <section id="about" className="about-section section-pad"><div className="container about-grid"><div className="about-statement"><p className="eyebrow"><span className="eyebrow-line" /> PROFILE / 01</p><h2>Curious by default.<br /><em>Useful by design.</em></h2><p className="about-copy">I’m Sagar — a final-year Computer Engineering student building across the stack. My work moves between shipping product features, training models, and understanding the systems that make software dependable.</p><p className="about-copy">I learn quickly, onboard into unfamiliar codebases, and like the space where engineering decisions meet a real user need.</p><a className="text-link" href="https://github.com/studioussagar" target="_blank" rel="noreferrer">Open my GitHub <ArrowUpRight size={16} /></a></div><div className="focus-panel"><div className="focus-panel-head"><span>ENGINEERING FOCUS</span><span className="focus-live"><span className="pulse-dot" /> LIVE MAP</span></div><div className="focus-map"><div className="focus-axis axis-h" /><div className="focus-axis axis-v" /><div className="focus-center"><Code2 size={18} /><span>BUILD</span></div><div className="focus-node focus-node-a"><span className="node-dot cyan-dot" /><span>Full-stack<br />engineering</span></div><div className="focus-node focus-node-b"><span className="node-dot violet-dot" /><span>AI / ML<br />systems</span></div><div className="focus-node focus-node-c"><span className="node-dot amber-dot" /><span>Security &<br />systems</span></div><div className="focus-node focus-node-d"><span className="node-dot green-dot" /><span>Cloud<br />foundations</span></div></div></div></div></section>

      <section className="skills-section section-pad"><div className="container"><div className="section-heading"><div><p className="eyebrow"><span className="eyebrow-line" /> THE TOOLKIT</p><h2>Many tools.<br /><em>One approach.</em></h2></div><p className="heading-note">A practical stack assembled through projects, internships, formal learning, and a habit of going one layer deeper.</p></div><div className="skill-grid">{skillGroups.map((group) => { const Icon = group.icon; return <div className="skill-card" key={group.label}><Icon size={20} /><h3>{group.label}</h3><div>{group.items.map((item) => <span key={item}>{item}</span>)}</div></div>; })}</div></div></section>

      <section id="experience" className="experience-section section-pad"><div className="container"><div className="section-heading"><div><p className="eyebrow"><span className="eyebrow-line" /> JOURNEY / 02</p><h2>Learning by<br /><em>shipping.</em></h2></div><p className="heading-note">Three internship tracks in one semester — a fast, focused stretch across software engineering and applied AI/ML.</p></div><div className="timeline">{experiences.map((experience, index) => <div className="timeline-item" key={experience.company}><div className="timeline-marker"><span>0{index + 1}</span></div><div className="timeline-content"><p className="timeline-period">{experience.period}</p><h3>{experience.role}</h3><p className="timeline-company">{experience.company}</p><p>{experience.detail}</p><ul className="experience-outcomes">{experience.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}</ul></div></div>)}</div><div className="achievement-row"><div><Check size={17} /> Grade O: Outstanding</div><div><Check size={17} /> Google for Developers programme</div><div><Check size={17} /> Hackathon advancement</div><div><Check size={17} /> 101 LeetCode problems solved</div></div></div></section>

      <section id="contact" className="contact-section section-pad"><div className="container contact-card"><div className="contact-glow" aria-hidden="true" /><div className="contact-content"><p className="eyebrow"><span className="eyebrow-line" /> OPEN CHANNEL</p><h2>Have a hard problem<br />worth <em>building?</em></h2><p>Let’s talk about software, AI/ML, or the next product that needs a careful first version.</p><a className="button button-primary" href="mailto:sagarssn2005@gmail.com">sagarssn2005@gmail.com <ArrowUpRight size={17} /></a></div><div className="contact-orbit" aria-hidden="true"><div className="contact-orbit-ring ring-one" /><div className="contact-orbit-ring ring-two" /><div className="contact-orbit-core"><Mail size={24} /></div></div></div></section>
    </main>

    <footer className="footer"><div className="container footer-inner"><div className="footer-brand"><span className="brand-mark"><CircleDot size={14} /></span><span>Sagar Sujit Samadder</span></div><div className="footer-location"><MapPin size={14} /> Pune, India · 2027 batch</div><div className="footer-links"><a href="https://github.com/studioussagar" target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={17} /></a><a href="https://linkedin.com/in/sagar-samadder" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={17} /></a><a href="mailto:sagarssn2005@gmail.com" aria-label="Email"><Mail size={17} /></a></div></div></footer>
  </div>;
}
