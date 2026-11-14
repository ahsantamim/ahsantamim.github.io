export const categories = [
  "Full-Stack",
  "AI & Automation",
  "Backend & Systems",
  "QA & Testing",
  "DevOps & Infrastructure",
] as const;

export type Category = (typeof categories)[number];

export type Diagram = "tenants" | "settlement" | "search" | "hiring" | "ledger" | "pipeline" | "stack";

export type Project = {
  slug: string;
  number: string;
  title: string;
  /** Short line used on the homepage and in the archive list. */
  summary: string;
  /** What kind of work this was. Shown as a label so nothing is overstated. */
  status: "Production work" | "Implemented workflow" | "Learning project";
  /** Employer and dates, for work listed from the resume. */
  company?: string;
  period?: string;
  categories: Category[];
  role: string;
  stack: string[];
  diagram: Diagram;
  overview: string;
  /** Optional: left out where the resume does not describe it, rather than written up from guesswork. */
  problem?: string;
  context: string;
  responsibilities: string[];
  workflow: string[];
  decisions: { title: string; body: string }[];
  challenges: { title: string; body: string }[];
  /** Leave null until there is a verified, publishable result. Never estimate. */
  outcomes: string | null;
  snippet?: { language: string; caption: string; code: string };
  links: { label: string; href: string }[];
  /** Why details are limited, shown at the end of the case study. */
  disclosure: string;
};

/**
 * The work page lists the four roles from public/Ahsanul_Karim_Resume.pdf in
 * the resume's order, then the two workflow and learning projects. Every line
 * of the resume entries comes from the resume; decisions and challenges stay
 * empty until they are written from what actually happened.
 */
const work: Project[] = [
  {
    slug: "nsbh-b2b-commerce",
    number: "01",
    title: "B2B Commerce & Deferred Payments Platform",
    summary:
      "B2B commerce platform giving buyers deferred payment terms while suppliers are paid upfront, with NSBH managing settlement and repayment.",
    status: "Production work",
    company: "NSBH",
    period: "Jun 2026 — Present",
    categories: ["Full-Stack", "Backend & Systems", "AI & Automation"],
    role: "AI Native Software Engineer",
    stack: ["Django", "DRF", "Next.js", "TypeScript", "Supabase", "PostgreSQL", "Celery"],
    diagram: "settlement",
    overview:
      "NSBH runs a B2B commerce platform where buyers order on deferred payment terms while suppliers are paid upfront, and NSBH manages settlement and repayment. I take features end to end across Django REST APIs and the Next.js frontend, in a team of five engineers.",
    context: "NSBH, Saudi Arabia. B2B commerce with deferred payment terms for buyers and upfront payment for suppliers.",
    responsibilities: [
      "Taking features end to end across Django REST APIs and the Next.js frontend in a team of 5 engineers.",
      "Working on the partner portal and operations portal: supplier onboarding, order approval, supplier payouts, and buyer repayment tracking.",
      "Working with App Router server components, server actions, and a typed API layer (Zod + TanStack Query).",
      "Using Supabase for auth, document storage, and realtime order-status updates, alongside PostgreSQL and Celery on the Django side.",
      "Using an MCP-based multi-agent workflow with Claude Code and Cursor for scaffolding, test generation, and code review.",
    ],
    workflow: [
      "A buyer places an order on deferred payment terms.",
      "Operations approve the order in the operations portal.",
      "The supplier is paid upfront.",
      "The buyer repays on a schedule, tracked in the portal.",
      "NSBH settles the record.",
    ],
    decisions: [],
    challenges: [],
    outcomes: null,
    links: [],
    disclosure: "Described from my resume. Internal screens, data, and figures are not published.",
  },
  {
    slug: "gestioniza-telecom-saas",
    number: "02",
    title: "Multi-Tenant B2B Telecom SaaS",
    summary:
      "B2B telecommunication management SaaS serving enterprise clients across Europe: order, permission, coverage search, and ticket modules.",
    status: "Production work",
    company: "Gestioniza",
    period: "Jun 2025 — Jun 2026",
    categories: ["Full-Stack", "Backend & Systems"],
    role: "Software Engineer",
    stack: ["React", "Refine", "Ant Design", "FastAPI", "Python"],
    diagram: "tenants",
    overview:
      "Gestioniza's B2B telecommunication management platform serves enterprise clients across Europe from one codebase. I worked on both sides of it: the React admin frontend built on Refine and Ant Design, and the FastAPI services behind it.",
    problem:
      "A multi-tenant product grows in two directions at once: more tenants and more features. Screens and endpoints written for one case get copied for the next, and each copy makes later changes slower and riskier.",
    context:
      "Gestioniza, Spain. Each enterprise client sees its own data and configuration through the same application, so isolation between tenants is a correctness requirement, not a feature.",
    responsibilities: [
      "Refactored the React frontend for the B2B telecom SaaS, reducing complexity by 40%.",
      "Built order, permission, coverage search, and ticket modules serving 50+ enterprise clients.",
      "Integrated AI-assisted testing, cutting manual test generation time by 30%.",
      "Delivered bi-weekly production releases with a cross-functional engineering team.",
    ],
    workflow: [
      "Tenant user signs in to the React admin application.",
      "Refine data provider turns list, filter, and form actions into API calls.",
      "FastAPI resolves the tenant from the request and scopes every query to it.",
      "Typed response models return only that tenant's records.",
    ],
    decisions: [
      {
        title: "Let the framework own the CRUD plumbing",
        body: "Refine already models resources, data providers, and access control. Leaning on those conventions instead of hand-written fetch logic keeps each new screen small and makes screens behave the same way.",
      },
      {
        title: "Scope tenancy in one place on the backend",
        body: "Resolving the tenant once, as a request dependency, means individual endpoints cannot forget to filter. The rule lives in one module and is tested once.",
      },
      {
        title: "Refactor along module boundaries",
        body: "Shared logic was pulled out feature by feature rather than in one large rewrite, so every step could ship and be checked on its own.",
      },
    ],
    challenges: [
      {
        title: "Refactoring code that is in use",
        body: "Behaviour had to stay the same while structure changed. Small, reviewable changes and checking each screen against its previous behaviour kept regressions out.",
      },
      {
        title: "Two layers, one contract",
        body: "A change to a response model affects forms, tables, and filters. Treating the API schema as the source of truth made mismatches show up early.",
      },
    ],
    outcomes:
      "The frontend refactor reduced complexity by 40%. The order, permission, coverage search, and ticket modules serve 50+ enterprise clients. AI-assisted testing cut manual test generation time by 30%.",
    links: [],
    disclosure: "Screens and internal details are confidential, so this case study describes the engineering in general terms.",
  },
  {
    slug: "binary-quest-content-search",
    number: "03",
    title: "High-Volume Content & Search Platform",
    summary:
      "Search across a 1M+ article database with PostgreSQL and Elasticsearch, and headless CMS workflows with Strapi and TinaCMS.",
    status: "Production work",
    company: "Binary Quest",
    period: "Sep 2024 — Jun 2025",
    categories: ["Backend & Systems", "Full-Stack"],
    role: "Software Engineer",
    stack: ["PostgreSQL", "Elasticsearch", "Strapi", "TinaCMS"],
    diagram: "search",
    overview:
      "Binary Quest is an enterprise software company with high-volume content platforms. I optimized search over a 1M+ article database with PostgreSQL and Elasticsearch, and worked on headless CMS architecture and content workflows.",
    context: "Binary Quest, Bangladesh. Enterprise software development company with high-volume content platforms.",
    responsibilities: [
      "Optimized search for a 1M+ article database using PostgreSQL and Elasticsearch.",
      "Researched headless CMS architecture and content workflows using Strapi.",
      "Built a vehicle management system with Strapi and role-based content workflows.",
      "Integrated TinaCMS, reducing content update time by 50%.",
    ],
    workflow: [
      "Editors publish through the headless CMS (Strapi, TinaCMS).",
      "Articles are stored in PostgreSQL.",
      "Content is indexed in Elasticsearch.",
      "Reader searches run against the index across the full archive.",
    ],
    decisions: [],
    challenges: [],
    outcomes: "Integrating TinaCMS reduced content update time by 50%.",
    links: [],
    disclosure: "Described from my resume. Client names and internal details are not published.",
  },
  {
    slug: "synchro-hire-ai-hiring",
    number: "04",
    title: "AI Hiring Platform",
    summary:
      "Founding engineer on an AI recruitment platform for SMEs: AI screening, automated MCQ and AI interviews, RBAC, payments, and CI/CD.",
    status: "Production work",
    company: "Synchro Hire",
    period: "Sep 2024 — Jan 2026",
    categories: ["AI & Automation", "Full-Stack", "DevOps & Infrastructure"],
    role: "Founding Engineer",
    stack: ["OpenAI API", "OpenRouter", "Redis", "AWS", "CI/CD", "PayPal"],
    diagram: "hiring",
    overview:
      "Synchro Hire is an AI-powered recruitment automation startup that streamlines hiring workflows for SMEs. As founding engineer I built the AI hiring platform, from candidate screening to automated MCQ and AI interview workflows.",
    context: "Synchro Hire, Germany. AI-powered recruitment automation startup streamlining hiring workflows for SMEs.",
    responsibilities: [
      "Built the AI hiring platform, reducing candidate screening time by 60%.",
      "Implemented RBAC, PayPal payments, and AWS CI/CD pipelines.",
      "Developed automated MCQ and AI interview workflows using OpenRouter and GPT.",
      "Optimized API response times by 40% using Redis caching.",
    ],
    workflow: [
      "A candidate applies.",
      "AI screening reviews the profile (OpenRouter, GPT).",
      "The candidate takes an automated MCQ test.",
      "An AI interview follows.",
      "Candidates who pass reach the shortlist.",
    ],
    decisions: [],
    challenges: [],
    outcomes: "Candidate screening time fell by 60%, and Redis caching cut API response times by 40%.",
    links: [],
    disclosure: "Described from my resume. Internal screens and data are not published.",
  },
];

/** The original case studies. The homepage still features some of them; the last two also close the work page. */
const legacy: Project[] = [
  {
    slug: "multi-tenant-saas",
    number: "01",
    title: "Multi-Tenant B2B SaaS Platform",
    summary:
      "Frontend and backend engineering on a European B2B telecom SaaS platform, with a focus on modular architecture and refactoring.",
    status: "Production work",
    categories: ["Full-Stack", "Backend & Systems"],
    role: "Full-stack software engineer",
    stack: ["React", "Refine", "Ant Design", "TypeScript", "FastAPI", "Python"],
    diagram: "tenants",
    overview:
      "A B2B telecom SaaS platform serving several business customers from one codebase. I worked on both sides of it: the React admin frontend built on Refine and Ant Design, and the FastAPI services behind it.",
    problem:
      "A multi-tenant product grows in two directions at once: more tenants and more features. Screens and endpoints written for one case get copied for the next, and each copy makes later changes slower and riskier.",
    context:
      "The platform is used by European telecom businesses. Each tenant sees its own data and configuration through the same application, so isolation between tenants is a correctness requirement, not a feature.",
    responsibilities: [
      "Built and maintained React screens with Refine resources and Ant Design components.",
      "Worked on FastAPI endpoints and the data access behind them.",
      "Refactored repeated screen and endpoint logic into shared modules.",
      "Kept frontend data contracts and backend response models in step.",
    ],
    workflow: [
      "Tenant user signs in to the React admin application.",
      "Refine data provider turns list, filter, and form actions into API calls.",
      "FastAPI resolves the tenant from the request and scopes every query to it.",
      "Typed response models return only that tenant's records.",
    ],
    decisions: [
      {
        title: "Let the framework own the CRUD plumbing",
        body: "Refine already models resources, data providers, and access control. Leaning on those conventions instead of hand-written fetch logic keeps each new screen small and makes screens behave the same way.",
      },
      {
        title: "Scope tenancy in one place on the backend",
        body: "Resolving the tenant once, as a request dependency, means individual endpoints cannot forget to filter. The rule lives in one module and is tested once.",
      },
      {
        title: "Refactor along module boundaries",
        body: "Shared logic was pulled out feature by feature rather than in one large rewrite, so every step could ship and be checked on its own.",
      },
    ],
    challenges: [
      {
        title: "Refactoring code that is in use",
        body: "Behaviour had to stay the same while structure changed. Small, reviewable changes and checking each screen against its previous behaviour kept regressions out.",
      },
      {
        title: "Two layers, one contract",
        body: "A change to a response model affects forms, tables, and filters. Treating the API schema as the source of truth made mismatches show up early.",
      },
    ],
    outcomes: null,
    snippet: {
      language: "python",
      caption: "Illustrative pattern, not project code: tenant scoping as a FastAPI dependency.",
      code: `async def current_tenant(request: Request) -> Tenant:
    tenant = await resolve_tenant(request)
    if tenant is None:
        raise HTTPException(status_code=404)
    return tenant


@router.get("/subscriptions")
async def list_subscriptions(
    tenant: Tenant = Depends(current_tenant),
    session: AsyncSession = Depends(get_session),
):
    query = select(Subscription).where(Subscription.tenant_id == tenant.id)
    return (await session.scalars(query)).all()`,
    },
    links: [],
    disclosure:
      "Client name, screens, and internal details are confidential, so this case study describes the engineering in general terms.",
  },
  {
    slug: "fintech-operations",
    number: "02",
    title: "Fintech Operations & Financing Platform",
    summary:
      "Quality engineering on a fintech platform covering merchant operations, buyer management, transactions, financing, and installments.",
    status: "Production work",
    categories: ["QA & Testing", "Backend & Systems"],
    role: "QA engineer",
    stack: ["Playwright", "API testing", "Exploratory testing", "Regression testing"],
    diagram: "ledger",
    overview:
      "A fintech platform where merchants, buyers, and an operations team work on the same financial records. My work was quality engineering across those workflows: manual and exploratory testing, API testing, and regression coverage.",
    problem:
      "In financial software a defect is rarely cosmetic. A wrong installment amount or a transaction in the wrong state is a money problem, and the workflows depend on each other, so a change in one place can break another.",
    context:
      "The platform covers merchant operations, buyer management, transaction workflows, financing, and installment plans. Different roles see and change different parts of the same record.",
    responsibilities: [
      "Wrote test cases from requirements for each workflow and role.",
      "Tested APIs directly, not only through the interface.",
      "Ran exploratory sessions on new features before release.",
      "Maintained smoke and regression suites and retested fixed defects.",
      "Reported defects with exact steps, data, and expected behaviour.",
    ],
    workflow: [
      "Merchant creates a transaction for a buyer.",
      "Financing is requested and reviewed.",
      "An installment schedule is generated.",
      "Payments are recorded against the schedule.",
      "Operations reconciles and closes the record.",
    ],
    decisions: [
      {
        title: "Test the state transitions, not only the screens",
        body: "Each record moves through defined states. Listing which transitions are allowed, and by which role, gives a test map that does not depend on how the interface looks this week.",
      },
      {
        title: "Check money at the API",
        body: "Amounts, rounding, and schedule totals are verified against API responses, where the numbers are exact, and then confirmed in the interface.",
      },
      {
        title: "Keep a small smoke suite that always runs",
        body: "A short set of checks on the critical paths runs on every build. The full regression pass is kept for releases.",
      },
    ],
    challenges: [
      {
        title: "Test data with history",
        body: "Installment and repayment cases need records in specific states. Building those states deliberately, instead of reusing whatever data exists, makes failures reproducible.",
      },
      {
        title: "Role-dependent behaviour",
        body: "The same action behaves differently for a merchant, a buyer, and an operator. Each case is written per role, so a permission gap is caught as a failure and not missed as an untested path.",
      },
    ],
    outcomes: null,
    links: [],
    disclosure:
      "Company name, URLs, customer data, and implementation details are confidential and are left out on purpose.",
  },
  {
    slug: "ai-qa-automation",
    number: "05",
    title: "AI-Powered QA & Testing Automation",
    summary:
      "A working QA workflow that combines AI coding agents, test case generation, browser automation, exploratory testing, and automated validation.",
    status: "Implemented workflow",
    categories: ["AI & Automation", "QA & Testing"],
    role: "Designer and operator of the workflow",
    stack: ["AI coding agents", "LLMs", "Playwright", "Prompt engineering", "Agentic workflows"],
    diagram: "pipeline",
    overview:
      "A QA workflow I use in day-to-day testing. An AI agent reads a requirement, drafts test cases, drives a real browser to run them, and reports what it found. I review the cases before the run and every finding after it.",
    problem:
      "Writing test cases, running them by hand, and writing up results takes most of a tester's time and leaves little for the testing that needs judgment. The repetitive part is well suited to an agent. The judgment is not.",
    context:
      "The workflow runs against staging environments of web applications. It sits beside manual exploratory testing and does not replace it.",
    responsibilities: [
      "Designed the steps of the workflow and the instructions each step gives the agent.",
      "Defined the format for test cases so they can be reviewed quickly and executed exactly.",
      "Connected the agent to browser automation for execution and evidence.",
      "Review generated cases and verify every reported defect by hand.",
    ],
    workflow: [
      "Requirement or ticket is read by the agent.",
      "Agent drafts test cases in a fixed format.",
      "A person reviews and corrects the cases.",
      "Agent executes the cases in a browser and collects evidence.",
      "Results are reported; a person confirms each failure.",
      "Fixed defects go back through the same cases as a retest.",
    ],
    decisions: [
      {
        title: "A person approves before and after",
        body: "The agent proposes cases and reports results. It does not decide what counts as a defect. That keeps the speed and keeps the accountability with an engineer.",
      },
      {
        title: "Fixed structure for every test case",
        body: "Preconditions, steps, data, and expected result are always in the same place. A structured case is faster to review and leaves the agent less room to improvise during execution.",
      },
      {
        title: "Evidence with every result",
        body: "A pass or fail without a screenshot or response body cannot be checked. Each result carries what the agent saw.",
      },
    ],
    challenges: [
      {
        title: "Confident wrong answers",
        body: "An agent can report a pass for a step it did not really complete. Requiring evidence per step, and spot-checking passes as well as failures, catches this.",
      },
      {
        title: "Tests that pass by accident",
        body: "Generated cases tend to check that something appeared, not that it is correct. Review focuses on the expected result of each case for that reason.",
      },
    ],
    outcomes: null,
    links: [],
    disclosure:
      "The workflow is described without the applications it is used on, which are confidential.",
  },
  {
    slug: "cloud-deployment",
    number: "06",
    title: "Cloud & Deployment Engineering",
    summary:
      "Self-directed deployment practice: a Django and PostgreSQL application containerised with Docker and deployed on AWS.",
    status: "Learning project",
    categories: ["DevOps & Infrastructure", "Backend & Systems"],
    role: "Sole developer",
    stack: ["Docker", "Django", "PostgreSQL", "AWS", "Git"],
    diagram: "stack",
    overview:
      "A learning project, not client work. I took a Django application with a PostgreSQL database from a laptop to a running deployment on AWS, using containers the whole way, to understand what production readiness involves.",
    problem:
      "An application that runs locally is not yet a deployed application. Configuration, secrets, the database, static files, and restarts all behave differently on a server, and the only way to learn that is to do it.",
    context:
      "Self-directed study. There is no client, no traffic to speak of, and no uptime commitment. The goal was to understand each step well enough to repeat it on a real project.",
    responsibilities: [
      "Wrote the Dockerfile and Compose setup for the application and database.",
      "Separated configuration from code using environment variables.",
      "Deployed the containers on AWS and connected the database.",
      "Documented the steps so the deployment can be repeated.",
    ],
    workflow: [
      "Code is pushed to Git.",
      "A Docker image is built for the Django application.",
      "The image runs on AWS with configuration from the environment.",
      "The application talks to PostgreSQL and serves requests.",
    ],
    decisions: [
      {
        title: "Same container locally and on the server",
        body: "Running the application in Docker during development removes most \"works on my machine\" problems before deployment day.",
      },
      {
        title: "Configuration from the environment",
        body: "Secrets and settings are passed in at run time. The image holds no credentials and the same image can run anywhere.",
      },
    ],
    challenges: [
      {
        title: "State outside the container",
        body: "Containers are disposable and the database is not. Working out where data lives and how it survives a redeploy was the main lesson.",
      },
      {
        title: "Debugging without a local terminal",
        body: "When a container fails on a server, logs are the only view in. Getting useful logs out of the application early saved time later.",
      },
    ],
    outcomes: null,
    snippet: {
      language: "dockerfile",
      caption: "Illustrative Dockerfile for a Django application.",
      code: `FROM python:3.12-slim
ENV PYTHONUNBUFFERED=1
WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
RUN python manage.py collectstatic --noinput

CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]`,
    },
    links: [],
    disclosure: "This is a learning project and is labelled as one. It is not production client work.",
  },
];

const bySlug = (slug: string) => legacy.find((project) => project.slug === slug)!;

/** The work page, in order. */
export const projects: Project[] = [...work, bySlug("ai-qa-automation"), bySlug("cloud-deployment")];

/** The homepage bento, unchanged until it is curated again. */
export const featured: Project[] = ["multi-tenant-saas", "fintech-operations", "ai-qa-automation", "cloud-deployment"].map(bySlug);

export function getProject(slug: string) {
  return [...work, ...legacy].find((project) => project.slug === slug);
}
