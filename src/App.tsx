import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  type MotionValue,
} from 'framer-motion';
import {
  Activity,
  ArrowUp,
  ArrowUpRight,
  Check,
  Code2,
  Cpu,
  Database,
  ExternalLink,
  GitBranch,
  Layers,
  Lock,
  Mail,
  Send,
  ShieldCheck,
  Sparkles,
  Terminal,
  X,
} from 'lucide-react';

// ============================================================================
// REUSABLE COMPONENTS
// ============================================================================

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  className = '',
  as = 'div',
}) => {
  const MotionComponent = motion.create(as as any);
  return (
    <MotionComponent
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </MotionComponent>
  );
};

interface MagnetProps {
  children: React.ReactNode;
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  className?: string;
}

const Magnet: React.FC<MagnetProps> = ({
  children,
  padding = 150,
  strength = 3,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.6s ease-in-out',
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distX = Math.abs(e.clientX - centerX);
      const distY = Math.abs(e.clientY - centerY);

      if (
        distX < rect.width / 2 + padding &&
        distY < rect.height / 2 + padding
      ) {
        setIsActive(true);
        const offsetX = (e.clientX - centerX) / strength;
        const offsetY = (e.clientY - centerY) / strength;
        setPosition({ x: offsetX, y: offsetY });
      } else {
        setIsActive(false);
        setPosition({ x: 0, y: 0 });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [padding, strength]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: isActive ? activeTransition : inactiveTransition,
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
};

interface ContactButtonProps {
  onClick?: () => void;
  label?: string;
  className?: string;
}

const ContactButton: React.FC<ContactButtonProps> = ({
  onClick,
  label = 'Contact Me',
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background:
          'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
        boxShadow:
          '0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset',
        outline: '2px solid #FFFFFF',
        outlineOffset: '-3px',
      }}
      className={`rounded-full text-white font-medium uppercase tracking-widest px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer ${className}`}
    >
      {label}
    </button>
  );
};

interface LiveProjectButtonProps {
  href?: string;
  onClick?: () => void;
  label?: string;
}

const LiveProjectButton: React.FC<LiveProjectButtonProps> = ({
  href,
  onClick,
  label = 'View on GitHub',
}) => {
  const sharedClasses =
    'inline-flex items-center gap-2 rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] font-medium uppercase tracking-widest px-6 py-2.5 sm:px-9 sm:py-3.5 text-xs sm:text-sm md:text-base hover:bg-[#D7E2EA]/10 transition-colors duration-200 cursor-pointer';

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={sharedClasses}
      >
        <span>{label}</span>
        <ArrowUpRight className="w-4 h-4" />
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={sharedClasses}>
      <span>{label}</span>
      <ArrowUpRight className="w-4 h-4" />
    </button>
  );
};

interface CharacterSpanProps {
  char: string;
  progress: MotionValue<number>;
  range: [number, number];
}

const CharacterSpan: React.FC<CharacterSpanProps> = ({
  char,
  progress,
  range,
}) => {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    <span className="relative inline-block">
      <span className="opacity-0">{char === ' ' ? '\u00A0' : char}</span>
      <motion.span
        style={{ opacity }}
        className="absolute inset-0 text-[#D7E2EA]"
      >
        {char === ' ' ? '\u00A0' : char}
      </motion.span>
    </span>
  );
};

interface AnimatedTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  className = '',
  style,
}) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.2'],
  });

  const words = text.split(' ');
  const totalChars = text.length;
  let charCounter = 0;

  return (
    <p ref={containerRef} className={className} style={style}>
      {words.map((word, wIdx) => {
        const wordChars = word.split('');
        const wordElement = (
          <span key={`word-${wIdx}`} className="inline-block whitespace-nowrap">
            {wordChars.map((char, cIdx) => {
              const start = charCounter / totalChars;
              const end = Math.min(1, (charCounter + 1) / totalChars);
              charCounter += 1;
              return (
                <CharacterSpan
                  key={`char-${wIdx}-${cIdx}`}
                  char={char}
                  progress={scrollYProgress}
                  range={[start, end]}
                />
              );
            })}
          </span>
        );
        if (wIdx < words.length - 1) {
          charCounter += 1;
        }
        return (
          <React.Fragment key={`frag-${wIdx}`}>
            {wordElement}
            {wIdx < words.length - 1 && ' '}
          </React.Fragment>
        );
      })}
    </p>
  );
};

// ============================================================================
// DATA
// ============================================================================

interface TelemetryTile {
  tag: string;
  title: string;
  metric: string;
  sublabel: string;
  accent: string;
}

const TELEMETRY_ROW_1: TelemetryTile[] = [
  {
    tag: 'VAULTRAG // QDRANT',
    title: 'Hybrid Dense + BM25 RRF',
    metric: '11.4 ms',
    sublabel: 'BGE-M3 1024-d • Recall@5 96.4%',
    accent: 'text-fuchsia-300 border-fuchsia-400/30 bg-fuchsia-500/10',
  },
  {
    tag: 'LOCAL INFERENCE // VLLM',
    title: 'Zero-Egress LLM Serving',
    metric: '86.4 tok/s',
    sublabel: 'Air-Gapped Docker • RBAC Isolated',
    accent: 'text-emerald-300 border-emerald-400/30 bg-emerald-500/10',
  },
  {
    tag: 'COMPUTER VISION // ONNX',
    title: 'ST-GCN Graph Compiler',
    metric: '8.4 ms',
    sublabel: 'FP16 Fused • 5.7x over PyTorch',
    accent: 'text-cyan-300 border-cyan-400/30 bg-cyan-500/10',
  },
  {
    tag: 'LANDMARKS // MEDIAPIPE',
    title: '3D Hand & Pose Topology',
    metric: '60 FPS',
    sublabel: '21-Point Wrist-Norm • 30-Frame Window',
    accent: 'text-sky-300 border-sky-400/30 bg-sky-500/10',
  },
  {
    tag: 'BACKEND // FASTAPI',
    title: 'PostgreSQL + asyncpg Pool',
    metric: '6.8 ms p95',
    sublabel: 'SQLAlchemy 2.0 Async • 4.9k req/s',
    accent: 'text-amber-300 border-amber-400/30 bg-amber-500/10',
  },
];

const TELEMETRY_ROW_2: TelemetryTile[] = [
  {
    tag: 'CACHE // REDIS 7',
    title: 'Cache-Aside Invalidation',
    metric: '94.8% HIT',
    sublabel: '0.4 ms Lookup • LRU Eviction',
    accent: 'text-rose-300 border-rose-400/30 bg-rose-500/10',
  },
  {
    tag: 'WORKERS // CELERY',
    title: 'Distributed Task Broker',
    metric: '3,420 / s',
    sublabel: 'Retry Backoff • Dead-Letter Queue',
    accent: 'text-purple-300 border-purple-400/30 bg-purple-500/10',
  },
  {
    tag: 'INGESTION // AIOHTTP',
    title: 'Non-Blocking Scraper Pool',
    metric: '14.8x',
    sublabel: 'Semaphore(250) • BS4 lxml',
    accent: 'text-amber-300 border-amber-400/30 bg-amber-500/10',
  },
  {
    tag: 'QUALITY // PYTEST CI',
    title: 'Automated Verification',
    metric: '18 / 18 PASS',
    sublabel: 'Tensor Parity & Latency Budgets',
    accent: 'text-emerald-300 border-emerald-400/30 bg-emerald-500/10',
  },
  {
    tag: 'SECURITY // RBAC',
    title: 'Multi-Tenant Isolation',
    metric: '0 EGRESS',
    sublabel: 'Prompt Guard • Payload Filtering',
    accent: 'text-sky-300 border-sky-400/30 bg-sky-500/10',
  },
];

const SERVICES = [
  {
    number: '01',
    name: 'Hybrid RAG & LLM Systems',
    description:
      'Production-grade Retrieval-Augmented Generation engines combining Qdrant dense-sparse vector search, BGE-M3 embeddings, local vLLM inference, and strict multi-tenant zero-data-egress isolation.',
  },
  {
    number: '02',
    name: 'Async Python Backends',
    description:
      'High-throughput FastAPI microservices built on non-blocking asyncio event loops, PostgreSQL with asyncpg & SQLAlchemy, Redis caching layers, and distributed Celery task queues.',
  },
  {
    number: '03',
    name: 'Computer Vision & ONNX',
    description:
      'Real-time spatio-temporal deep learning pipelines using MediaPipe skeletal landmark extraction and ST-GCN architectures compiled to ONNX Runtime for sub-15ms edge inference.',
  },
  {
    number: '04',
    name: 'MLOps & Containerization',
    description:
      'Reproducible Docker multi-container stacks, automated PyTest verification suites, CI/CD model validation workflows, and GPU-accelerated serving infrastructure.',
  },
  {
    number: '05',
    name: 'Async Data & Scraping Pipelines',
    description:
      'Resilient non-blocking web ingestion and structured data extraction pipelines engineered with aiohttp, BeautifulSoup, rate-limited semaphores, and automated schema validation.',
  },
];

interface ProjectItem {
  number: string;
  name: string;
  category: string;
  repoUrl: string;
  repoSlug: string;
  summary: string;
  stack: string[];
  highlights: string[];
}

const PROJECTS: ProjectItem[] = [
  {
    number: '01',
    name: 'PERSONALIZED-RAG (VaultRAG)',
    category: 'Flagship • AI Systems',
    repoUrl: 'https://github.com/mars8-27/PERSONALIZED-RAG',
    repoSlug: 'mars8-27/PERSONALIZED-RAG',
    summary:
      'A local, multi-tenant hybrid RAG platform engineered for zero-data-egress enterprise document intelligence with defense-in-depth RBAC security.',
    stack: [
      'FastAPI',
      'Qdrant',
      'vLLM',
      'BGE-M3',
      'SQLite / SQLAlchemy',
      'Docker',
      'Gradio',
    ],
    highlights: [
      'Hybrid dense + sparse vector retrieval in Qdrant with BGE-M3 1024-d embeddings',
      'Zero-data-egress local inference served via vLLM inside isolated Docker containers',
      'Tenant-scoped metadata filtering & prompt-injection defense via SQLAlchemy ORM',
    ],
  },
  {
    number: '02',
    name: 'Sign Language Detector',
    category: 'Computer Vision • ONNX',
    repoUrl: 'https://github.com/mars8-27/signlanguagedetector',
    repoSlug: 'mars8-27/signlanguagedetector',
    summary:
      'Real-time sign language recognition engine pairing MediaPipe 3D skeletal landmark extraction with a Spatial-Temporal Graph Convolutional Network (ST-GCN) compiled to ONNX.',
    stack: [
      'Python 3.14',
      'MediaPipe',
      'ST-GCN',
      'ONNX Runtime',
      'PyTest',
      'OpenCV',
    ],
    highlights: [
      '21-point hand + upper-body topological graph normalized across 30-frame windows',
      'ONNX FP16 graph optimization reducing inference latency from 48.2ms to 8.4ms',
      'Automated PyTest CI pipeline verifying landmark normalization & tensor shapes',
    ],
  },
  {
    number: '03',
    name: 'Async Python & MLOps Suite',
    category: 'Backend Architecture',
    repoUrl: 'https://github.com/mars8-27',
    repoSlug: 'mars8-27/async-mlops-stack',
    summary:
      'End-to-end asynchronous backend and distributed ingestion architecture built for high-concurrency Python services and automated ML data workflows.',
    stack: [
      'FastAPI',
      'PostgreSQL',
      'asyncpg',
      'Redis',
      'Celery',
      'aiohttp',
      'Docker',
    ],
    highlights: [
      'Non-blocking concurrent scraping workers using aiohttp + semaphore throttling',
      'Sub-7ms p95 RESTful CRUD endpoints backed by asyncpg connection pooling',
      'Redis cache-aside invalidation & Celery distributed worker orchestration',
    ],
  },
];

// ============================================================================
// CUSTOM TECHNICAL ENGINEERING VISUALS (ZERO STOCK / UNRELATED MEDIA)
// ============================================================================

const VaultRagVisuals: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'console' | 'code'>('console');

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 mt-4 sm:mt-6">
      <div className="md:col-span-5 flex flex-col gap-3 sm:gap-4">
        <div
          className="rounded-[28px] sm:rounded-[36px] border border-[#D7E2EA]/20 bg-[#111318] p-4 sm:p-5 flex flex-col justify-between overflow-hidden relative"
          style={{ height: 'clamp(155px, 17vw, 235px)' }}
        >
          <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-[#BBCCD7]/80">
            <span className="flex items-center gap-1.5 font-medium">
              <Database className="w-3.5 h-3.5 text-fuchsia-400" />
              Qdrant Hybrid Space
            </span>
            <span className="px-2 py-0.5 rounded-full bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-400/30 text-[10px]">
              BGE-M3 • 1024d
            </span>
          </div>

          <svg
            viewBox="0 0 320 110"
            className="w-full h-24 my-auto overflow-visible"
            aria-label="Hybrid vector search embedding clusters"
          >
            <defs>
              <radialGradient id="qdrantGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#d946ef" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#d946ef" stopOpacity="0" />
              </radialGradient>
            </defs>
            <g stroke="#D7E2EA" strokeOpacity="0.08" strokeWidth="1">
              <line x1="0" y1="25" x2="320" y2="25" />
              <line x1="0" y1="55" x2="320" y2="55" />
              <line x1="0" y1="85" x2="320" y2="85" />
              <line x1="80" y1="0" x2="80" y2="110" />
              <line x1="160" y1="0" x2="160" y2="110" />
              <line x1="240" y1="0" x2="240" y2="110" />
            </g>
            <circle cx="215" cy="48" r="44" fill="url(#qdrantGlow)" />
            <circle
              cx="215"
              cy="48"
              r="30"
              fill="none"
              stroke="#e879f9"
              strokeDasharray="3 3"
              strokeOpacity="0.55"
            />
            <line
              x1="78"
              y1="68"
              x2="215"
              y2="48"
              stroke="#38bdf8"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
            <line
              x1="215"
              y1="48"
              x2="236"
              y2="34"
              stroke="#e879f9"
              strokeWidth="1.5"
            />
            <line
              x1="215"
              y1="48"
              x2="201"
              y2="65"
              stroke="#e879f9"
              strokeWidth="1.5"
            />
            <circle cx="62" cy="40" r="3" fill="#64748b" />
            <circle cx="94" cy="84" r="3" fill="#64748b" />
            <circle cx="132" cy="28" r="3" fill="#64748b" />
            <circle cx="272" cy="76" r="3" fill="#64748b" />
            <circle cx="78" cy="68" r="5" fill="#38bdf8" />
            <text
              x="44"
              y="84"
              fill="#7dd3fc"
              fontSize="9"
              fontFamily="monospace"
            >
              query_vec
            </text>
            <circle cx="215" cy="48" r="5.5" fill="#e879f9" />
            <circle cx="236" cy="34" r="4" fill="#c084fc" />
            <circle cx="201" cy="65" r="4" fill="#c084fc" />
            <text
              x="225"
              y="24"
              fill="#f0abfc"
              fontSize="9"
              fontFamily="monospace"
            >
              cos: 0.942
            </text>
          </svg>

          <div className="flex items-center justify-between text-[11px] font-mono text-[#D7E2EA]/75">
            <span>RRF Dense + BM25</span>
            <span className="text-emerald-400">11.4 ms • Recall@5 96.4%</span>
          </div>
        </div>

        <div
          className="rounded-[28px] sm:rounded-[36px] border border-[#D7E2EA]/20 bg-[#111318] p-4 sm:p-5 flex flex-col justify-between"
          style={{ height: 'clamp(175px, 22vw, 330px)' }}
        >
          <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-[#BBCCD7]/80">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Zero-Egress Isolation
            </span>
            <span className="text-[10px] font-mono text-emerald-300">
              AIR-GAPPED
            </span>
          </div>

          <div className="space-y-2 my-auto">
            {[
              {
                step: '01',
                label: 'Prompt Guard & Sanitizer',
                meta: 'Regex + Classifier',
                color: 'border-sky-400/30 bg-sky-500/10 text-sky-300',
              },
              {
                step: '02',
                label: 'SQLAlchemy RBAC Audit',
                meta: 'tenant_id ACL',
                color: 'border-purple-400/30 bg-purple-500/10 text-purple-300',
              },
              {
                step: '03',
                label: 'Qdrant Payload Filter',
                meta: 'Strict Namespace',
                color: 'border-fuchsia-400/30 bg-fuchsia-500/10 text-fuchsia-300',
              },
              {
                step: '04',
                label: 'Local vLLM Inference',
                meta: '0 External Calls',
                color: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300',
              },
            ].map((stage) => (
              <div
                key={stage.step}
                className="flex items-center justify-between px-3 py-2 rounded-2xl bg-white/[0.03] border border-white/[0.07]"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-[10px] font-mono text-[#D7E2EA]/40">
                    {stage.step}
                  </span>
                  <span className="text-xs sm:text-[13px] font-medium text-[#D7E2EA] truncate">
                    {stage.label}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full border shrink-0 ${stage.color}`}
                >
                  {stage.meta}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-[#D7E2EA]/60 pt-1 border-t border-white/10">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-400" />
              SOC2-Ready Local Vault
            </span>
            <span>Docker Compose</span>
          </div>
        </div>
      </div>

      <div className="md:col-span-7 rounded-[28px] sm:rounded-[36px] border border-[#D7E2EA]/20 bg-[#111318] p-4 sm:p-6 flex flex-col justify-between min-h-[340px]">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
            <span className="ml-2 text-xs font-mono text-[#BBCCD7]">
              vaultrag-api • localhost:8000/v1/query
            </span>
          </div>
          <div className="flex items-center gap-1 bg-black/50 p-1 rounded-full border border-white/10">
            <button
              type="button"
              onClick={() => setActiveTab('console')}
              className={`px-3 py-1 rounded-full text-[11px] font-medium uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'console'
                  ? 'bg-[#D7E2EA] text-[#0C0C0C]'
                  : 'text-[#D7E2EA]/70 hover:text-white'
              }`}
            >
              Live RAG Console
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('code')}
              className={`px-3 py-1 rounded-full text-[11px] font-medium uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'code'
                  ? 'bg-[#D7E2EA] text-[#0C0C0C]'
                  : 'text-[#D7E2EA]/70 hover:text-white'
              }`}
            >
              FastAPI Pipeline
            </button>
          </div>
        </div>

        {activeTab === 'console' ? (
          <div className="my-auto py-3 space-y-3 font-mono text-xs">
            <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10">
              <div className="text-[10px] uppercase tracking-wider text-sky-400 mb-1">
                POST /api/v1/rag/query • tenant: &quot;fin_ops_uae&quot;
              </div>
              <div className="text-[#D7E2EA]">
                &quot;Summarize Q4 liquidity covenants across uploaded credit
                agreements with exact clause citations.&quot;
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-2xl bg-fuchsia-500/[0.07] border border-fuchsia-400/25">
                <div className="flex items-center justify-between text-[10px] text-fuchsia-300 mb-1">
                  <span>CHUNK #01 • credit_facility_v3.pdf</span>
                  <span>score 0.942</span>
                </div>
                <p className="text-[11px] text-[#D7E2EA]/80 leading-relaxed">
                  &quot;Section 7.2(b): Borrower shall maintain minimum
                  unrestricted cash reserves of AED 12.5M tested
                  quarterly...&quot;
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-purple-500/[0.07] border border-purple-400/25">
                <div className="flex items-center justify-between text-[10px] text-purple-300 mb-1">
                  <span>CHUNK #02 • risk_addendum_2026.md</span>
                  <span>score 0.918</span>
                </div>
                <p className="text-[11px] text-[#D7E2EA]/80 leading-relaxed">
                  &quot;Leverage Ratio ceiling fixed at 2.75x EBITDA with
                  15-business-day cure period upon notice...&quot;
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-500/[0.07] border border-emerald-400/25">
              <div className="flex items-center justify-between text-[10px] text-emerald-300 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  vLLM Synthesized Response (Qwen-2.5-14B-Instruct-AWQ)
                </span>
                <span>86.4 tok/s</span>
              </div>
              <p className="text-xs text-[#D7E2EA] leading-relaxed font-sans">
                Two binding covenants govern Q4 liquidity: (1) minimum
                unrestricted cash of{' '}
                <span className="text-emerald-300 font-medium">AED 12.5M</span>{' '}
                [credit_facility_v3.pdf §7.2], and (2) maximum Net Debt/EBITDA
                of <span className="text-emerald-300 font-medium">2.75x</span>{' '}
                [risk_addendum_2026.md]. Zero external API packets emitted.
              </p>
            </div>
          </div>
        ) : (
          <pre className="my-auto py-3 px-4 rounded-2xl bg-black/60 border border-white/10 text-[11px] sm:text-xs font-mono text-[#D7E2EA]/90 overflow-x-auto leading-relaxed">
            {`@router.post("/v1/rag/query", response_model=GroundedResponse)
async def execute_hybrid_rag(
    payload: QueryRequest,
    tenant: TenantContext = Depends(verify_rbac_tenant),
    qdrant: AsyncQdrantClient = Depends(get_qdrant),
):
    dense_vec, sparse_vec = await bge_m3.encode_hybrid(payload.query)
    hits = await qdrant.query_points(
        collection_name="vault_chunks",
        prefetch=[
            Prefetch(query=dense_vec, using="dense", limit=20),
            Prefetch(query=sparse_vec, using="sparse", limit=20),
        ],
        query=FusionQuery(fusion=Fusion.RRF),
        query_filter=Filter(must=[FieldCondition(key="tenant_id", match=MatchValue(value=tenant.id))]),
        limit=5,
    )
    return await vllm_local.generate_cited_answer(payload.query, hits)`}
          </pre>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/10 text-[11px] font-mono text-[#D7E2EA]/65">
          <span>Qdrant v1.12 • SQLAlchemy 2.0 • Gradio UI</span>
          <span className="text-emerald-400">● 100% Local Data Sovereignty</span>
        </div>
      </div>
    </div>
  );
};

const SignLanguageVisuals: React.FC = () => {
  const [viewMode, setViewMode] = useState<'inference' | 'pytest'>('inference');

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 mt-4 sm:mt-6">
      <div className="md:col-span-5 flex flex-col gap-3 sm:gap-4">
        <div
          className="rounded-[28px] sm:rounded-[36px] border border-[#D7E2EA]/20 bg-[#111318] p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden"
          style={{ height: 'clamp(155px, 17vw, 235px)' }}
        >
          <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-[#BBCCD7]/80">
            <span className="flex items-center gap-1.5 font-medium">
              <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
              MediaPipe 21-Pt Graph
            </span>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 text-[10px]">
              3D (x,y,z)
            </span>
          </div>

          <svg
            viewBox="0 0 300 115"
            className="w-full h-24 my-auto"
            aria-label="MediaPipe 21-point hand skeletal topology"
          >
            <g stroke="#22d3ee" strokeWidth="1.8" strokeOpacity="0.75">
              <line x1="150" y1="98" x2="105" y2="76" />
              <line x1="105" y1="76" x2="84" y2="56" />
              <line x1="84" y1="56" x2="72" y2="40" />
              <line x1="150" y1="98" x2="126" y2="58" />
              <line x1="126" y1="58" x2="120" y2="34" />
              <line x1="120" y1="34" x2="117" y2="16" />
              <line x1="150" y1="98" x2="150" y2="54" />
              <line x1="150" y1="54" x2="150" y2="28" />
              <line x1="150" y1="28" x2="150" y2="10" />
              <line x1="150" y1="98" x2="174" y2="58" />
              <line x1="174" y1="58" x2="179" y2="34" />
              <line x1="179" y1="34" x2="182" y2="16" />
              <line x1="150" y1="98" x2="196" y2="66" />
              <line x1="196" y1="66" x2="206" y2="46" />
              <line x1="206" y1="46" x2="213" y2="30" />
              <line
                x1="126"
                y1="58"
                x2="150"
                y2="54"
                stroke="#a855f7"
                strokeDasharray="2 2"
              />
              <line
                x1="150"
                y1="54"
                x2="174"
                y2="58"
                stroke="#a855f7"
                strokeDasharray="2 2"
              />
              <line
                x1="174"
                y1="58"
                x2="196"
                y2="66"
                stroke="#a855f7"
                strokeDasharray="2 2"
              />
            </g>
            {[
              [150, 98],
              [105, 76],
              [84, 56],
              [72, 40],
              [126, 58],
              [120, 34],
              [117, 16],
              [150, 54],
              [150, 28],
              [150, 10],
              [174, 58],
              [179, 34],
              [182, 16],
              [196, 66],
              [206, 46],
              [213, 30],
            ].map(([cx, cy], idx) => (
              <circle
                key={idx}
                cx={cx}
                cy={cy}
                r={idx === 0 ? 5 : 3.5}
                fill={idx === 0 ? '#f43f5e' : '#67e8f9'}
              />
            ))}
            <text
              x="14"
              y="26"
              fill="#94a3b8"
              fontSize="9"
              fontFamily="monospace"
            >
              V = 21 joints
            </text>
            <text
              x="14"
              y="40"
              fill="#67e8f9"
              fontSize="9"
              fontFamily="monospace"
            >
              A_norm: [3, 21, 21]
            </text>
            <text
              x="218"
              y="92"
              fill="#c084fc"
              fontSize="9"
              fontFamily="monospace"
            >
              T = 30 frames
            </text>
          </svg>

          <div className="flex items-center justify-between text-[11px] font-mono text-[#D7E2EA]/75">
            <span>Wrist-Centered Scale Norm</span>
            <span className="text-cyan-400">60 FPS Capture</span>
          </div>
        </div>

        <div
          className="rounded-[28px] sm:rounded-[36px] border border-[#D7E2EA]/20 bg-[#111318] p-4 sm:p-5 flex flex-col justify-between"
          style={{ height: 'clamp(175px, 22vw, 330px)' }}
        >
          <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-[#BBCCD7]/80">
            <span className="flex items-center gap-1.5 font-medium">
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              ST-GCN → ONNX Runtime
            </span>
            <span className="text-[10px] font-mono text-amber-300">
              5.7x SPEEDUP
            </span>
          </div>

          <div className="space-y-3 my-auto">
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-[#D7E2EA]/70">PyTorch Eager (FP32)</span>
                <span className="font-mono text-rose-300">48.2 ms</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full w-[88%] bg-rose-400/80 rounded-full" />
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.03] border border-cyan-400/25">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-[#D7E2EA] font-medium">
                  ONNX Graph Fused (FP16)
                </span>
                <span className="font-mono text-emerald-400">8.4 ms</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full w-[18%] bg-emerald-400 rounded-full" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center font-mono">
              <div className="p-2 rounded-xl bg-white/[0.03] border border-white/10">
                <div className="text-[10px] text-[#D7E2EA]/50">INPUT</div>
                <div className="text-[11px] text-cyan-300">[1,3,30,54]</div>
              </div>
              <div className="p-2 rounded-xl bg-white/[0.03] border border-white/10">
                <div className="text-[10px] text-[#D7E2EA]/50">PARAMS</div>
                <div className="text-[11px] text-purple-300">1.42M</div>
              </div>
              <div className="p-2 rounded-xl bg-white/[0.03] border border-white/10">
                <div className="text-[10px] text-[#D7E2EA]/50">TOP-1 ACC</div>
                <div className="text-[11px] text-emerald-300">94.8%</div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-[#D7E2EA]/60 pt-1 border-t border-white/10">
            <span>Opset 17 • Constant Folding</span>
            <span>CPU / CUDA EP</span>
          </div>
        </div>
      </div>

      <div className="md:col-span-7 rounded-[28px] sm:rounded-[36px] border border-[#D7E2EA]/20 bg-[#111318] p-4 sm:p-6 flex flex-col justify-between min-h-[340px]">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-[#BBCCD7]">
              signlanguagedetector • stream_inference.py
            </span>
          </div>
          <div className="flex items-center gap-1 bg-black/50 p-1 rounded-full border border-white/10">
            <button
              type="button"
              onClick={() => setViewMode('inference')}
              className={`px-3 py-1 rounded-full text-[11px] font-medium uppercase tracking-wider transition-colors cursor-pointer ${
                viewMode === 'inference'
                  ? 'bg-[#D7E2EA] text-[#0C0C0C]'
                  : 'text-[#D7E2EA]/70 hover:text-white'
              }`}
            >
              Live Telemetry
            </button>
            <button
              type="button"
              onClick={() => setViewMode('pytest')}
              className={`px-3 py-1 rounded-full text-[11px] font-medium uppercase tracking-wider transition-colors cursor-pointer ${
                viewMode === 'pytest'
                  ? 'bg-[#D7E2EA] text-[#0C0C0C]'
                  : 'text-[#D7E2EA]/70 hover:text-white'
              }`}
            >
              PyTest Suite
            </button>
          </div>
        </div>

        {viewMode === 'inference' ? (
          <div className="my-auto py-3 space-y-3">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-transparent border border-cyan-400/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-cyan-300">
                  DECODED GLOSS SEQUENCE
                </div>
                <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-0.5">
                  &quot;HELLO • THANK YOU&quot;
                </div>
              </div>
              <div className="px-3.5 py-2 rounded-2xl bg-black/50 border border-emerald-400/30 text-right font-mono">
                <div className="text-[10px] text-[#D7E2EA]/60">CONFIDENCE</div>
                <div className="text-lg font-bold text-emerald-400">98.4%</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="flex justify-between text-[11px] font-mono text-[#D7E2EA]/75 mb-2">
                <span>TEMPORAL RING BUFFER (30 / 30 FRAMES)</span>
                <span className="text-cyan-300">STRIDE = 5</span>
              </div>
              <div className="grid grid-cols-[repeat(15,minmax(0,1fr))] gap-1">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-3 rounded-sm ${
                      i >= 24
                        ? 'bg-emerald-400'
                        : i >= 12
                        ? 'bg-cyan-400/80'
                        : 'bg-purple-400/50'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2 font-mono text-xs">
              {[
                { label: 'THANK_YOU', prob: '0.984', width: 'w-[98%]', active: true },
                { label: 'PLEASE', prob: '0.011', width: 'w-[9%]', active: false },
                { label: 'HELLO', prob: '0.004', width: 'w-[4%]', active: false },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10"
                >
                  <span className="w-24 text-[#D7E2EA]">{item.label}</span>
                  <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        item.active ? 'bg-cyan-400' : 'bg-white/30'
                      } ${item.width}`}
                    />
                  </div>
                  <span className="w-12 text-right text-[#D7E2EA]/80">
                    {item.prob}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <pre className="my-auto py-3 px-4 rounded-2xl bg-black/60 border border-white/10 text-[11px] sm:text-xs font-mono text-[#D7E2EA]/90 overflow-x-auto leading-relaxed">
            {`$ pytest tests/ -v --tb=short
========================= test session starts =========================
platform win32 -- Python 3.14.0, pytest-8.3.4, onnxruntime-1.20.1
collected 18 items

tests/test_landmarks.py::test_wrist_origin_normalization     PASSED [ 16%]
tests/test_landmarks.py::test_missing_hand_zero_padding      PASSED [ 33%]
tests/test_stgcn_graph.py::test_spatial_adjacency_symmetry   PASSED [ 50%]
tests/test_onnx_export.py::test_fp16_parity_tolerance_1e3    PASSED [ 66%]
tests/test_onnx_export.py::test_latency_under_15ms_budget    PASSED [ 83%]
tests/test_pipeline.py::test_sliding_window_ring_buffer      PASSED [100%]

========================= 18 passed in 1.42s ==========================`}
          </pre>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/10 text-[11px] font-mono text-[#D7E2EA]/65">
          <span>MediaPipe Tasks • ST-GCN • ONNX Runtime</span>
          <span className="text-cyan-400">● End-to-End Latency: 14.1 ms</span>
        </div>
      </div>
    </div>
  );
};

const AsyncMlopsVisuals: React.FC = () => {
  const [tab, setTab] = useState<'metrics' | 'orm'>('metrics');

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 mt-4 sm:mt-6">
      <div className="md:col-span-5 flex flex-col gap-3 sm:gap-4">
        <div
          className="rounded-[28px] sm:rounded-[36px] border border-[#D7E2EA]/20 bg-[#111318] p-4 sm:p-5 flex flex-col justify-between"
          style={{ height: 'clamp(155px, 17vw, 235px)' }}
        >
          <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-[#BBCCD7]/80">
            <span className="flex items-center gap-1.5 font-medium">
              <Activity className="w-3.5 h-3.5 text-amber-400" />
              aiohttp Event Loop Pool
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-400/30 text-[10px]">
              14.8x FASTER
            </span>
          </div>

          <div className="my-auto space-y-2 font-mono text-[11px]">
            {[
              { worker: 'coro_batch_01', reqs: '64/64', bar: 'w-full' },
              { worker: 'coro_batch_02', reqs: '62/64', bar: 'w-[96%]' },
              { worker: 'coro_batch_03', reqs: '58/64', bar: 'w-[90%]' },
              { worker: 'coro_batch_04', reqs: '64/64', bar: 'w-full' },
            ].map((row) => (
              <div key={row.worker} className="flex items-center gap-2">
                <span className="text-[#D7E2EA]/70 w-24 shrink-0">
                  {row.worker}
                </span>
                <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full ${row.bar}`}
                  />
                </div>
                <span className="text-amber-300 w-11 text-right">
                  {row.reqs}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-[#D7E2EA]/75">
            <span>Semaphore(250) • BS4 lxml</span>
            <span className="text-emerald-400">0 Blocking Calls</span>
          </div>
        </div>

        <div
          className="rounded-[28px] sm:rounded-[36px] border border-[#D7E2EA]/20 bg-[#111318] p-4 sm:p-5 flex flex-col justify-between"
          style={{ height: 'clamp(175px, 22vw, 330px)' }}
        >
          <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-[#BBCCD7]/80">
            <span className="flex items-center gap-1.5 font-medium">
              <Layers className="w-3.5 h-3.5 text-rose-400" />
              Redis 7 + Celery Broker
            </span>
            <span className="text-[10px] font-mono text-rose-300">
              94.8% HIT RATE
            </span>
          </div>

          <div className="my-auto space-y-2.5 font-mono text-xs">
            <div className="p-3 rounded-2xl bg-rose-500/[0.08] border border-rose-400/25 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-rose-300">REDIS CACHE-ASIDE</div>
                <div className="text-[#D7E2EA] font-medium">
                  TTL 300s • LRU Eviction
                </div>
              </div>
              <span className="text-emerald-400 font-bold">0.4 ms</span>
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-sky-300">
                  CELERY WORKER CLUSTER
                </div>
                <div className="text-[#D7E2EA] font-medium">
                  8 Prefork Workers • Retry Backoff
                </div>
              </div>
              <span className="text-sky-300 font-bold">3,420/s</span>
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-purple-300">
                  POSTGRESQL 16 + ASYNCPG
                </div>
                <div className="text-[#D7E2EA] font-medium">
                  Pool Size 32 • Prepared Stmts
                </div>
              </div>
              <span className="text-purple-300 font-bold">6.8 ms</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-[#D7E2EA]/60 pt-1 border-t border-white/10">
            <span>Flower Monitoring • Dead-Letter Queue</span>
            <span>Healthy</span>
          </div>
        </div>
      </div>

      <div className="md:col-span-7 rounded-[28px] sm:rounded-[36px] border border-[#D7E2EA]/20 bg-[#111318] p-4 sm:p-6 flex flex-col justify-between min-h-[340px]">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono text-[#BBCCD7]">
              fastapi-async-core • production metrics
            </span>
          </div>
          <div className="flex items-center gap-1 bg-black/50 p-1 rounded-full border border-white/10">
            <button
              type="button"
              onClick={() => setTab('metrics')}
              className={`px-3 py-1 rounded-full text-[11px] font-medium uppercase tracking-wider transition-colors cursor-pointer ${
                tab === 'metrics'
                  ? 'bg-[#D7E2EA] text-[#0C0C0C]'
                  : 'text-[#D7E2EA]/70 hover:text-white'
              }`}
            >
              API Telemetry
            </button>
            <button
              type="button"
              onClick={() => setTab('orm')}
              className={`px-3 py-1 rounded-full text-[11px] font-medium uppercase tracking-wider transition-colors cursor-pointer ${
                tab === 'orm'
                  ? 'bg-[#D7E2EA] text-[#0C0C0C]'
                  : 'text-[#D7E2EA]/70 hover:text-white'
              }`}
            >
              Async ORM Code
            </button>
          </div>
        </div>

        {tab === 'metrics' ? (
          <div className="my-auto py-3 space-y-3">
            <div className="grid grid-cols-3 gap-2.5 font-mono">
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
                <div className="text-[10px] text-[#D7E2EA]/60">P95 LATENCY</div>
                <div className="text-xl sm:text-2xl font-bold text-emerald-400 mt-1">
                  6.8 ms
                </div>
                <div className="text-[10px] text-emerald-300/80 mt-0.5">
                  asyncpg binary
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
                <div className="text-[10px] text-[#D7E2EA]/60">THROUGHPUT</div>
                <div className="text-xl sm:text-2xl font-bold text-amber-400 mt-1">
                  4.9k/s
                </div>
                <div className="text-[10px] text-amber-300/80 mt-0.5">
                  uvloop + httptools
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
                <div className="text-[10px] text-[#D7E2EA]/60">UPTIME</div>
                <div className="text-xl sm:text-2xl font-bold text-sky-400 mt-1">
                  99.98%
                </div>
                <div className="text-[10px] text-sky-300/80 mt-0.5">
                  Docker healthcheck
                </div>
              </div>
            </div>

            <div className="space-y-2 font-mono text-xs">
              {[
                {
                  method: 'GET',
                  path: '/api/v1/pipelines/jobs/{id}',
                  status: '200 OK',
                  ms: '2.1 ms',
                  badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30',
                },
                {
                  method: 'POST',
                  path: '/api/v1/ingest/batch-scrape',
                  status: '202 QUEUED',
                  ms: '4.6 ms',
                  badge: 'bg-amber-500/15 text-amber-300 border-amber-400/30',
                },
                {
                  method: 'GET',
                  path: '/api/v1/analytics/embeddings',
                  status: '200 HIT',
                  ms: '0.8 ms',
                  badge: 'bg-sky-500/15 text-sky-300 border-sky-400/30',
                },
              ].map((route) => (
                <div
                  key={route.path}
                  className="flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-2xl bg-white/[0.03] border border-white/10"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`px-2 py-0.5 rounded-md border text-[10px] font-bold ${route.badge}`}
                    >
                      {route.method}
                    </span>
                    <span className="text-[#D7E2EA] truncate">{route.path}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 text-[11px]">
                    <span className="text-emerald-400">{route.status}</span>
                    <span className="text-[#D7E2EA]/60">{route.ms}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <pre className="my-auto py-3 px-4 rounded-2xl bg-black/60 border border-white/10 text-[11px] sm:text-xs font-mono text-[#D7E2EA]/90 overflow-x-auto leading-relaxed">
            {`async def fetch_or_cache_entity(
    entity_id: UUID,
    session: AsyncSession,
    redis: Redis,
) -> EntitySchema:
    cache_key = f"entity:{entity_id}"
    if cached := await redis.get(cache_key):
        return EntitySchema.model_validate_json(cached)

    stmt = select(EntityModel).where(EntityModel.id == entity_id)
    result = (await session.execute(stmt)).scalar_one_or_none()
    payload = EntitySchema.model_validate(result)
    await redis.setex(cache_key, 300, payload.model_dump_json())
    return payload`}
          </pre>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/10 text-[11px] font-mono text-[#D7E2EA]/65">
          <span>FastAPI • SQLAlchemy Async • Redis • Celery</span>
          <span className="text-amber-400">● Zero-Downtime Container Stack</span>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SECTIONS
// ============================================================================

interface HeroSectionProps {
  onOpenContact: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onOpenContact }) => {
  return (
    <section
      id="top"
      className="relative h-screen w-full flex flex-col justify-between bg-[#0C0C0C]"
      style={{ overflowX: 'clip' }}
    >
      {/* Subtle Architectural Engineering Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #D7E2EA 1px, transparent 1px), linear-gradient(to bottom, #D7E2EA 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage:
            'radial-gradient(ellipse 75% 65% at 50% 45%, black 20%, transparent 100%)',
        }}
      />

      {/* Top Bar */}
      <div className="relative z-20">
        <FadeIn delay={0} y={-20}>
          <nav className="w-full flex items-center justify-between px-6 md:px-10 pt-6 md:pt-8">
            {[
              { label: 'About', href: '#about' },
              { label: 'Expertise', href: '#services' },
              { label: 'Projects', href: '#projects' },
              { label: 'Contact', href: '#contact', isContact: true },
            ].map((item) =>
              item.isContact ? (
                <button
                  key={item.label}
                  type="button"
                  onClick={onOpenContact}
                  className="text-[#D7E2EA] font-medium uppercase tracking-wider text-sm md:text-lg lg:text-[1.4rem] hover:opacity-70 transition-opacity duration-200 cursor-pointer bg-transparent border-0"
                >
                  {item.label}
                </button>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-[#D7E2EA] font-medium uppercase tracking-wider text-sm md:text-lg lg:text-[1.4rem] hover:opacity-70 transition-opacity duration-200"
                >
                  {item.label}
                </a>
              )
            )}
          </nav>
        </FadeIn>

        {/* Massive Gradient Heading */}
        <div className="overflow-hidden px-4 sm:px-8 md:px-10">
          <FadeIn delay={0.15} y={40}>
            <h1 className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-full text-center text-[9.5vw] sm:text-[10.2vw] md:text-[10.8vw] lg:text-[11.2vw] mt-6 sm:mt-4 md:-mt-2 select-none">
              Hi, i&apos;m abhiram
            </h1>
          </FadeIn>
        </div>
      </div>

      {/* Centered Magnetic GitHub Portrait */}
      <div className="absolute left-1/2 -translate-x-1/2 z-10 top-1/2 -translate-y-1/2 sm:top-auto sm:translate-y-0 sm:bottom-6 md:bottom-8">
        <FadeIn delay={0.6} y={30}>
          <Magnet
            padding={150}
            strength={3}
            activeTransition="transform 0.3s ease-out"
            inactiveTransition="transform 0.6s ease-in-out"
          >
            <div className="relative w-[260px] sm:w-[320px] md:w-[380px] lg:w-[420px]">
              <div className="relative rounded-[36px] sm:rounded-[44px] p-2 bg-gradient-to-b from-[#D7E2EA]/30 via-[#646973]/20 to-[#0C0C0C] border border-[#D7E2EA]/30 shadow-[0_25px_70px_rgba(0,0,0,0.85)] backdrop-blur-md">
                <div className="relative overflow-hidden rounded-[30px] sm:rounded-[38px] aspect-square bg-[#14161B]">
                  <img
                    src="https://github.com/mars8-27.png"
                    alt="Abhiramsai Mamidala (@mars8-27)"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-[#0C0C0C] via-[#0C0C0C]/85 to-transparent flex items-center justify-between">
                    <div>
                      <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
                        Abhiramsai Mamidala
                      </div>
                      <a
                        href="https://github.com/mars8-27"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] sm:text-xs font-mono text-[#BBCCD7] hover:text-white transition-colors"
                      >
                        @mars8-27 • AI &amp; Backend
                      </a>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[10px] font-mono text-emerald-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      AVAILABLE
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Magnet>
        </FadeIn>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-20 w-full flex justify-between items-end px-6 md:px-10 pb-7 sm:pb-8 md:pb-10">
        <FadeIn delay={0.35} y={20}>
          <p
            className="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug max-w-[180px] sm:max-w-[240px] md:max-w-[290px]"
            style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.4rem)' }}
          >
            an ai &amp; backend engineer building local rag, async apis &amp;
            edge vision systems
          </p>
        </FadeIn>

        <FadeIn delay={0.5} y={20}>
          <ContactButton onClick={onOpenContact} />
        </FadeIn>
      </div>
    </section>
  );
};

const TelemetryMarqueeSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionTop = rect.top + window.scrollY;
      const calculatedOffset =
        (window.scrollY - sectionTop + window.innerHeight) * 0.28;
      setOffset(calculatedOffset);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const row1Tripled = [
    ...TELEMETRY_ROW_1,
    ...TELEMETRY_ROW_1,
    ...TELEMETRY_ROW_1,
  ];
  const row2Tripled = [
    ...TELEMETRY_ROW_2,
    ...TELEMETRY_ROW_2,
    ...TELEMETRY_ROW_2,
  ];

  const renderTile = (tile: TelemetryTile, key: string) => (
    <div
      key={key}
      className="w-[340px] sm:w-[390px] h-[180px] rounded-3xl border border-[#D7E2EA]/15 bg-[#111318] p-5 sm:p-6 flex flex-col justify-between shrink-0"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#BBCCD7]/70">
          {tile.tag}
        </span>
        <span
          className={`px-2.5 py-0.5 rounded-full border text-[10px] font-mono font-semibold ${tile.accent}`}
        >
          VERIFIED
        </span>
      </div>
      <div>
        <div className="text-2xl sm:text-3xl font-black tracking-tight text-white">
          {tile.metric}
        </div>
        <div className="text-sm font-medium uppercase tracking-wide text-[#D7E2EA] mt-0.5">
          {tile.title}
        </div>
      </div>
      <div className="text-[11px] font-mono text-[#D7E2EA]/60 border-t border-white/10 pt-2.5">
        {tile.sublabel}
      </div>
    </div>
  );

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#0C0C0C] pt-24 sm:pt-32 md:pt-36 pb-10 overflow-hidden"
    >
      <div className="flex flex-col gap-3">
        <div
          className="flex items-center gap-3 w-max"
          style={{
            transform: `translate3d(${offset - 360}px, 0, 0)`,
            willChange: 'transform',
          }}
        >
          {row1Tripled.map((tile, idx) => renderTile(tile, `t1-${idx}`))}
        </div>

        <div
          className="flex items-center gap-3 w-max"
          style={{
            transform: `translate3d(${-(offset - 360)}px, 0, 0)`,
            willChange: 'transform',
          }}
        >
          {row2Tripled.map((tile, idx) => renderTile(tile, `t2-${idx}`))}
        </div>
      </div>
    </section>
  );
};

interface AboutSectionProps {
  onOpenContact: () => void;
}

const AboutSection: React.FC<AboutSectionProps> = ({ onOpenContact }) => {
  const techPills = [
    'Python 3.14',
    'FastAPI',
    'Qdrant',
    'vLLM',
    'BGE-M3',
    'PostgreSQL / asyncpg',
    'Redis',
    'Celery',
    'ONNX Runtime',
    'Docker',
  ];

  return (
    <section
      id="about"
      className="relative min-h-screen w-full bg-[#0C0C0C] flex flex-col items-center justify-center px-5 sm:px-8 md:px-10 py-24 overflow-hidden"
    >
      {/* Subtle Radial Ambient Center Glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(187, 204, 215, 0.08) 0%, rgba(12, 12, 12, 0) 60%)',
        }}
      />

      {/* Crisp Monospace Corner Coordinates */}
      <span className="pointer-events-none hidden sm:block absolute top-10 left-8 md:left-12 text-[11px] font-mono uppercase tracking-[0.22em] text-[#D7E2EA]/35">
        SYS // PROFILE.01
      </span>
      <span className="pointer-events-none hidden sm:block absolute top-10 right-8 md:right-12 text-[11px] font-mono uppercase tracking-[0.22em] text-[#D7E2EA]/35">
        PYTHON • AI SYSTEMS
      </span>
      <span className="pointer-events-none hidden sm:block absolute bottom-10 left-8 md:left-12 text-[11px] font-mono uppercase tracking-[0.22em] text-[#D7E2EA]/35">
        ZERO-EGRESS RAG &amp; ONNX
      </span>
      <span className="pointer-events-none hidden sm:block absolute bottom-10 right-8 md:right-12 text-[11px] font-mono uppercase tracking-[0.22em] text-[#D7E2EA]/35">
        GITHUB.COM/MARS8-27
      </span>

      {/* Center Content */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="flex flex-col items-center gap-10 sm:gap-14 md:gap-16">
          <FadeIn delay={0} y={40}>
            <h2
              className="hero-heading font-black uppercase leading-none tracking-tight text-center"
              style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
            >
              About me
            </h2>
          </FadeIn>

          <AnimatedText
            text="I'm Abhiramsai Mamidala, a Python Backend & AI Systems Engineer building local hybrid RAG engines, asynchronous FastAPI architectures, and real-time ONNX computer vision pipelines. Let's build resilient, production-grade intelligence together!"
            className="text-[#D7E2EA] font-medium text-center leading-relaxed max-w-[600px]"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
          />

          <div className="flex flex-wrap items-center justify-center gap-2 max-w-[620px]">
            {techPills.map((tech) => (
              <span
                key={tech}
                className="px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-[#D7E2EA]/20 text-[#D7E2EA]/90 text-xs sm:text-sm font-mono tracking-wide"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-14 sm:mt-16 md:mt-20 flex flex-wrap items-center justify-center gap-4">
          <ContactButton onClick={onOpenContact} />
          <a
            href="https://github.com/mars8-27"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border-2 border-[#D7E2EA]/40 hover:border-[#D7E2EA] text-[#D7E2EA] font-medium uppercase tracking-widest px-7 py-3 sm:py-3.5 text-xs sm:text-sm transition-colors"
          >
            <span>GitHub @mars8-27</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

const ServicesSection: React.FC = () => {
  return (
    <section
      id="services"
      className="w-full bg-[#FFFFFF] text-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32"
    >
      <FadeIn delay={0} y={40}>
        <h2
          className="text-[#0C0C0C] font-black uppercase text-center leading-none tracking-tight mb-16 sm:mb-20 md:mb-28"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          Expertise
        </h2>
      </FadeIn>

      <div className="max-w-5xl mx-auto">
        {SERVICES.map((service, index) => (
          <FadeIn key={service.number} delay={index * 0.1} y={30}>
            <div
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-10 py-8 sm:py-10 md:py-12"
              style={{
                borderTop:
                  index === 0
                    ? '1px solid rgba(12, 12, 12, 0.15)'
                    : 'none',
                borderBottom: '1px solid rgba(12, 12, 12, 0.15)',
              }}
            >
              <span
                className="font-black text-[#0C0C0C] leading-none shrink-0"
                style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}
              >
                {service.number}
              </span>

              <div className="flex flex-col gap-2 sm:max-w-2xl w-full">
                <h3
                  className="font-medium uppercase text-[#0C0C0C] tracking-tight"
                  style={{ fontSize: 'clamp(1.1rem, 2.2vw, 2.1rem)' }}
                >
                  {service.name}
                </h3>
                <p
                  className="font-light leading-relaxed text-[#0C0C0C]/60"
                  style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)' }}
                >
                  {service.description}
                </p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
};

interface ProjectCardProps {
  project: ProjectItem;
  index: number;
  totalCards: number;
  onInspect: (project: ProjectItem) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  index,
  totalCards,
  onInspect,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const targetScale = 1 - (totalCards - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0.4, 1], [1, targetScale]);

  return (
    <div
      ref={containerRef}
      className="min-h-[85vh] flex items-start justify-center mb-10 sm:mb-14"
    >
      <motion.div
        style={{
          scale,
          top: `calc(5rem + ${index * 28}px)`,
        }}
        className="sticky w-full max-w-6xl rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border-2 border-[#D7E2EA] bg-[#0C0C0C] p-5 sm:p-7 md:p-9 shadow-[0_30px_90px_rgba(0,0,0,0.9)]"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#D7E2EA]/15">
          <div className="flex items-center gap-4 sm:gap-6">
            <span
              className="hero-heading font-black leading-none shrink-0"
              style={{ fontSize: 'clamp(2.8rem, 7vw, 96px)' }}
            >
              {project.number}
            </span>
            <div>
              <span className="inline-block text-xs sm:text-sm uppercase tracking-widest text-[#BBCCD7]/70 font-medium">
                {project.category} • {project.repoSlug}
              </span>
              <h3
                className="font-bold uppercase text-white tracking-tight leading-tight"
                style={{ fontSize: 'clamp(1.25rem, 2.6vw, 2.3rem)' }}
              >
                {project.name}
              </h3>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={() => onInspect(project)}
              className="inline-flex items-center gap-2 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-[#D7E2EA]/30 text-[#D7E2EA] font-medium uppercase tracking-widest px-5 py-2.5 sm:px-7 sm:py-3.5 text-xs sm:text-sm transition-colors cursor-pointer"
            >
              <Code2 className="w-4 h-4" />
              <span>Architecture</span>
            </button>
            <LiveProjectButton href={project.repoUrl} label="View on GitHub" />
          </div>
        </div>

        {index === 0 && <VaultRagVisuals />}
        {index === 1 && <SignLanguageVisuals />}
        {index === 2 && <AsyncMlopsVisuals />}
      </motion.div>
    </div>
  );
};

interface ProjectsSectionProps {
  onInspectProject: (project: ProjectItem) => void;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  onInspectProject,
}) => {
  return (
    <section
      id="projects"
      className="relative z-10 w-full bg-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 px-5 sm:px-8 md:px-10 pt-20 sm:pt-24 md:pt-32 pb-20"
    >
      <FadeIn delay={0} y={40}>
        <h2
          className="hero-heading font-black uppercase text-center leading-none tracking-tight mb-14 sm:mb-20"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          Project
        </h2>
      </FadeIn>

      <div className="w-full">
        {PROJECTS.map((project, index) => (
          <ProjectCard
            key={project.number}
            project={project}
            index={index}
            totalCards={PROJECTS.length}
            onInspect={onInspectProject}
          />
        ))}
      </div>
    </section>
  );
};

const FooterSection: React.FC<{ onOpenContact: () => void }> = ({
  onOpenContact,
}) => {
  return (
    <footer className="w-full bg-[#0C0C0C] border-t border-[#D7E2EA]/15 px-6 md:px-10 py-10">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#D7E2EA]/65">
        <div className="uppercase tracking-wider">
          © {new Date().getFullYear()} Abhiramsai Mamidala • @mars8-27
        </div>
        <div className="flex items-center gap-6 uppercase tracking-wider">
          <a
            href="https://github.com/mars8-27"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            GitHub
          </a>
          <button
            type="button"
            onClick={onOpenContact}
            className="hover:text-white transition-colors cursor-pointer bg-transparent border-0 uppercase"
          >
            Contact
          </button>
          <a
            href="#top"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#D7E2EA]/25 hover:border-[#D7E2EA] text-[#D7E2EA] transition-colors"
          >
            <span>Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
};

// ============================================================================
// MODALS
// ============================================================================

interface ArchitectureModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

const ArchitectureModal: React.FC<ArchitectureModalProps> = ({
  project,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl rounded-[32px] border-2 border-[#D7E2EA]/40 bg-[#111318] p-6 sm:p-8 text-[#D7E2EA] shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#BBCCD7]">
                  {project.number} • {project.repoSlug}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black uppercase text-white mt-1">
                  {project.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="mt-4 text-sm sm:text-base text-[#D7E2EA]/85 leading-relaxed">
              {project.summary}
            </p>

            <div className="mt-5">
              <div className="text-xs font-mono uppercase tracking-wider text-[#BBCCD7] mb-2">
                Core Implementation Highlights
              </div>
              <ul className="space-y-2">
                {project.highlights.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-[#D7E2EA]/90"
                  >
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5">
              <div className="text-xs font-mono uppercase tracking-wider text-[#BBCCD7] mb-2">
                Technology Stack
              </div>
              <div className="flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded-full bg-white/[0.06] border border-white/15 text-xs font-mono text-white"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-7 pt-4 border-t border-white/10 flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full border border-white/20 text-xs uppercase tracking-widest hover:bg-white/10 transition-colors cursor-pointer"
              >
                Close
              </button>
              <LiveProjectButton href={project.repoUrl} label="Open Repository" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setEmail('');
      setMessage('');
      onClose();
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-[32px] border-2 border-[#D7E2EA]/40 bg-[#111318] p-6 sm:p-8 text-[#D7E2EA] shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#BBCCD7]">
                  @mars8-27 • Direct Inquiry
                </span>
                <h3 className="text-2xl sm:text-3xl font-black uppercase text-white mt-1">
                  Let&apos;s Collaborate
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Close contact modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitted ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <div className="text-lg font-bold uppercase text-white">
                  Message Prepared
                </div>
                <p className="text-sm text-[#D7E2EA]/75">
                  Thank you for reaching out to Abhiramsai Mamidala.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#BBCCD7] mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Recruiter / Founder / Team Lead"
                    className="w-full rounded-2xl bg-black/50 border border-white/15 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D7E2EA]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#BBCCD7] mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full rounded-2xl bg-black/50 border border-white/15 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D7E2EA]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#BBCCD7] mb-1.5">
                    Project or Role Details
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="AI Systems / Python Backend / RAG Architecture..."
                    className="w-full rounded-2xl bg-black/50 border border-white/15 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D7E2EA]"
                  />
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <a
                    href="https://github.com/mars8-27"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-[#BBCCD7] hover:text-white"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    github.com/mars8-27
                  </a>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-full bg-[#D7E2EA] text-[#0C0C0C] font-semibold uppercase tracking-widest px-6 py-3 text-xs hover:bg-white transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message</span>
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ============================================================================
// MAIN APP
// ============================================================================

export function App() {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(
    null
  );
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <div
      className="min-h-screen w-full bg-[#0C0C0C] text-[#D7E2EA]"
      style={{ overflowX: 'clip' }}
    >
      <HeroSection onOpenContact={() => setContactOpen(true)} />
      <TelemetryMarqueeSection />
      <AboutSection onOpenContact={() => setContactOpen(true)} />
      <ServicesSection />
      <ProjectsSection
        onInspectProject={(proj) => setSelectedProject(proj)}
      />
      <FooterSection onOpenContact={() => setContactOpen(true)} />

      <ArchitectureModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
      <ContactModal
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
      />
    </div>
  );
}

export default App;
