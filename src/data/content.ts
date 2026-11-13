export const hero = {
  /** Cycles after "I'm", following the name. */
  roles: ["AI-Native Engineer", "Product Engineer", "Full-Stack Engineer"],
  headline: "I build digital products.",
} as const;

export const capabilities = [
  {
    number: "01",
    title: "Full-Stack Development",
    items: [
      "Modern frontend applications",
      "Backend architecture",
      "REST APIs",
      "Database design",
      "Authentication and integrations",
    ],
  },
  {
    number: "02",
    title: "AI-Native Engineering",
    items: [
      "AI-powered applications",
      "LLM integrations",
      "AI development workflows",
      "Agent-assisted engineering",
      "Business process automation",
    ],
  },
  {
    number: "03",
    title: "Product Engineering",
    items: [
      "MVP development",
      "Product architecture",
      "Feature development",
      "Technical problem-solving",
      "End-to-end product delivery",
    ],
  },
  {
    number: "04",
    title: "Quality Engineering",
    items: [
      "Manual and exploratory testing",
      "API testing",
      "Playwright automation",
      "Regression and smoke testing",
      "Quality assurance workflows",
    ],
  },
  {
    number: "05",
    title: "Backend & Systems",
    items: ["Python and Django", "FastAPI", "Node.js", "PostgreSQL", "API architecture and integrations"],
  },
  {
    number: "06",
    title: "DevOps & Infrastructure",
    items: [
      "Docker",
      "AWS fundamentals",
      "Containerized deployment",
      "CI/CD concepts",
      "Application monitoring and reliability",
    ],
  },
] as const;

export const philosophy = {
  statement:
    "Good software is not just functional. It should solve the right problem, feel intuitive, and remain reliable as it grows.",
  principles: [
    "Understand the problem before writing code.",
    "Design systems, not isolated features.",
    "Quality is part of engineering, not the final step.",
    "Use AI to accelerate thinking and execution, not replace engineering judgment.",
  ],
} as const;

export type JourneyEntry = {
  position: string;
  company: string;
  /** Square mark in public/company-logos. Null shows the monogram instead. */
  logo: string | null;
  /** A one-colour mark that follows the ink, so it stays visible in both themes. */
  logoMono?: boolean;
  monogram: string;
  location: string;
  dates: string;
  summary: string;
  responsibilities: string[];
  technologies: string[];
};

/** Mirrors the Experience section of public/Ahsanul_Karim_Resume.pdf. */
export const journey: JourneyEntry[] = [
  {
    position: "AI Native Software Engineer",
    company: "NSBH",
    logo: "/company-logos/nsbh-mark.svg",
    logoMono: true,
    monogram: "NS",
    location: "Saudi Arabia",
    dates: "Jun 2026 — Present",
    summary:
      "B2B commerce platform giving buyers deferred payment terms while suppliers are paid upfront, with NSBH managing settlement and repayment.",
    responsibilities: [
      "Taking features end to end across Django REST APIs and the Next.js frontend in a team of 5 engineers.",
      "Building the partner and operations portals: supplier onboarding, order approval, supplier payouts, and buyer repayment tracking.",
      "Working with App Router server components, server actions, and a typed API layer (Zod + TanStack Query).",
      "Using Supabase for auth, document storage, and realtime order-status updates, alongside PostgreSQL and Celery.",
      "Running an MCP-based multi-agent workflow with Claude Code and Cursor for scaffolding, test generation, and code review.",
    ],
    technologies: [
      "Django",
      "DRF",
      "Next.js",
      "TypeScript",
      "Supabase",
      "PostgreSQL",
      "Celery",
      "MCP servers",
      "Claude Code",
      "Cursor",
    ],
  },
  {
    position: "Software Engineer",
    company: "Gestioniza",
    logo: "/company-logos/grupo-gestioniza-icon.png",
    monogram: "GZ",
    location: "Spain",
    dates: "Jun 2025 — Jun 2026",
    summary: "B2B telecommunication management SaaS platform serving enterprise clients across Europe.",
    responsibilities: [
      "Refactored the React frontend, reducing complexity by 40%.",
      "Built order, permission, coverage search, and ticket modules serving 50+ enterprise clients.",
      "Integrated AI-assisted testing, cutting manual test generation time by 30%.",
      "Delivered bi-weekly production releases with a cross-functional engineering team.",
    ],
    technologies: ["React.js", "Refine", "Ant Design", "FastAPI", "Python", "AI-assisted testing"],
  },
  {
    position: "Software Engineer",
    company: "Binary Quest",
    logo: "/company-logos/binary-quest-app-icon.png",
    monogram: "BQ",
    location: "Bangladesh",
    dates: "Sep 2024 — Jun 2025",
    summary: "Enterprise software development company with high-volume content platforms.",
    responsibilities: [
      "Optimized search for a 1M+ article database using PostgreSQL and Elasticsearch.",
      "Researched headless CMS architecture and content workflows using Strapi.",
      "Built a vehicle management system with Strapi and role-based content workflows.",
      "Integrated TinaCMS, reducing content update time by 50%.",
    ],
    technologies: ["PostgreSQL", "Elasticsearch", "Strapi", "TinaCMS", "Auth & RBAC"],
  },
  {
    position: "Founding Engineer",
    company: "Synchro Hire",
    logo: null,
    monogram: "SH",
    location: "Germany",
    dates: "Sep 2024 — Jan 2026",
    summary: "AI-powered recruitment automation startup streamlining hiring workflows for SMEs.",
    responsibilities: [
      "Built an AI hiring platform, reducing candidate screening time by 60%.",
      "Implemented RBAC, PayPal payments, and AWS CI/CD pipelines.",
      "Developed automated MCQ and AI interview workflows using OpenRouter and GPT.",
      "Optimized API response times by 40% using Redis caching.",
    ],
    technologies: ["OpenAI API", "OpenRouter", "Redis", "Caching", "AWS", "CI/CD", "Auth & RBAC", "PayPal"],
  },
];

/** Mirrors the Skills section of the resume. */
export const arsenal = [
  { category: "Languages", items: ["JavaScript", "TypeScript", "Python"] },
  { category: "Frontend", items: ["React.js", "Next.js (App Router)", "Tailwind CSS"] },
  {
    category: "Backend",
    items: ["Django", "DRF", "Node.js", "Express.js", "FastAPI", "GraphQL"],
  },
  { category: "Databases & ORM", items: ["PostgreSQL", "Supabase", "MongoDB", "Prisma ORM"] },
  {
    category: "AI Workflow",
    items: ["MCP servers", "Claude Code", "Cursor", "Multi-agent dev pipelines", "OpenAI API"],
  },
  {
    category: "Tools",
    items: ["Git", "GitHub", "GitLab", "Docker", "Celery", "Redis", "AWS", "Linux"],
  },
  {
    category: "Concepts",
    items: ["REST APIs", "Auth & RBAC", "Transactions", "Caching", "CI/CD"],
  },
] as const;

/**
 * Real logos for arsenal items, files in public/icons fetched by the taste
 * skill's icons.mjs. `ink` marks are black and flip white on the dark theme.
 * Items without an entry are concepts and show a line glyph instead.
 */
export const arsenalIcons: Record<string, { icon: string; ink?: boolean }> = {
  JavaScript: { icon: "javascript" },
  TypeScript: { icon: "typescript" },
  Python: { icon: "python" },
  "React.js": { icon: "react" },
  "Next.js (App Router)": { icon: "nextjs" },
  "Tailwind CSS": { icon: "tailwindcss" },
  Django: { icon: "django" },
  DRF: { icon: "django" },
  "Node.js": { icon: "nodejs" },
  "Express.js": { icon: "si-express", ink: true },
  FastAPI: { icon: "fastapi" },
  GraphQL: { icon: "graphql" },
  PostgreSQL: { icon: "postgres" },
  Supabase: { icon: "supabase" },
  MongoDB: { icon: "mongodb" },
  "Prisma ORM": { icon: "prisma", ink: true },
  "MCP servers": { icon: "mcp", ink: true },
  "Claude Code": { icon: "claude-code" },
  Cursor: { icon: "cursor", ink: true },
  "OpenAI API": { icon: "openai", ink: true },
  Git: { icon: "git" },
  GitHub: { icon: "github", ink: true },
  GitLab: { icon: "gitlab" },
  Docker: { icon: "docker" },
  Celery: { icon: "celery" },
  Redis: { icon: "redis" },
  AWS: { icon: "aws", ink: true },
  Linux: { icon: "linux-tux" },
};
