export const hero = {
  /** Cycles after "I'm", following the name. */
  roles: ["AI-Native Engineer", "Product Engineer", "Full-Stack Engineer"],
  headline: "I build digital products.",
} as const;

export const identityLabels = [
  "Full-Stack Engineering",
  "AI-Native Development",
  "Product Thinking",
  "Software Quality",
  "System Integration",
] as const;

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
  organisation: string;
  /** Null means not confirmed yet; the site then shows a visible placeholder. */
  kind: "Employment" | "Contract" | "Independent" | null;
  /** PLACEHOLDER until real dates are added, e.g. "2024 — Present". */
  dates: string | null;
  responsibilities: string[];
  technologies: string[];
};

/**
 * EDIT ME: add real dates, confirm whether each role was employment or
 * contract, and name the organisation only if you are allowed to.
 */
export const journey: JourneyEntry[] = [
  {
    position: "Full-Stack Software Engineering",
    organisation: "European B2B SaaS project",
    kind: null,
    dates: null,
    responsibilities: [
      "React frontend development with Refine and Ant Design.",
      "FastAPI backend development.",
      "Modular architecture and refactoring.",
    ],
    technologies: ["React", "Refine", "Ant Design", "FastAPI", "Python"],
  },
  {
    position: "QA Engineering",
    organisation: "Fintech and financial operations platform",
    kind: null,
    dates: null,
    responsibilities: [
      "Manual, exploratory, and API testing of financial workflows.",
      "Smoke and regression testing.",
      "Test automation with Playwright and AI coding agents.",
    ],
    technologies: ["Playwright", "API testing", "AI coding agents"],
  },
  {
    position: "Independent Development",
    organisation: "Web applications, APIs, and engineering projects",
    kind: "Independent",
    dates: null,
    responsibilities: [
      "Websites and web applications.",
      "APIs and backend services.",
      "Deployment practice with Docker and AWS.",
    ],
    technologies: ["Next.js", "Django", "PostgreSQL", "Docker", "AWS"],
  },
];

export const arsenal = [
  {
    category: "Frontend",
    items: ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "Ant Design"],
  },
  { category: "Backend", items: ["Python", "Django", "FastAPI", "Node.js", "REST APIs"] },
  { category: "Database", items: ["PostgreSQL", "SQLite"] },
  {
    category: "AI & Automation",
    items: ["LLMs", "AI coding agents", "Prompt engineering", "Agentic workflows"],
  },
  {
    category: "Testing",
    items: ["Playwright", "API testing", "Exploratory testing", "Regression testing"],
  },
  { category: "Infrastructure", items: ["Docker", "AWS", "Git", "CI/CD fundamentals"] },
] as const;
