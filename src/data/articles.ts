export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "list"; items: string[] }
  | { type: "code"; language: string; code: string };

export type Article = {
  slug: string;
  title: string;
  category: string;
  /**
   * "draft" shows a visible Draft label and no date.
   * Switch to "published" and set `date` (YYYY-MM-DD) once you have reviewed the text.
   */
  status: "draft" | "published";
  date: string | null;
  readingMinutes: number;
  description: string;
  body: ArticleBlock[];
};

/**
 * EDIT ME: these are drafts written for you to review, rewrite in your own
 * voice, and correct against your own experience before marking as published.
 */
export const articles: Article[] = [
  {
    slug: "playwright-qa-workflows",
    title: "Building reliable QA workflows with Playwright",
    category: "Testing",
    status: "draft",
    date: null,
    readingMinutes: 4,
    description:
      "Most flaky end-to-end tests are flaky for three reasons. Fixing them is mostly a matter of what you select, what you wait for, and what state you start from.",
    body: [
      {
        type: "p",
        text: "A test suite that fails at random teaches a team to ignore it. After that it does not matter how much it covers. Reliability comes first, and in Playwright most unreliability traces back to three habits.",
      },
      { type: "h", text: "Select what the user sees" },
      {
        type: "p",
        text: "A selector tied to a CSS class or a position in the DOM breaks when the markup changes, even though nothing a user would notice has changed. Role and label locators describe the element the way a person would, and they double as a basic accessibility check: if the test cannot find the button by its name, neither can a screen reader.",
      },
      {
        type: "code",
        language: "ts",
        code: `// Breaks when the layout changes
await page.locator("div.actions > button:nth-child(2)").click();

// Survives it
await page.getByRole("button", { name: "Approve request" }).click();`,
      },
      { type: "h", text: "Wait for a condition, never for time" },
      {
        type: "p",
        text: "A fixed timeout is a guess about how fast the system is today. Playwright's assertions retry until the condition holds, so the test should state the condition: the row is visible, the status reads Approved, the request returned 200. If a test needs a sleep to pass, it is hiding a missing condition.",
      },
      { type: "h", text: "Start from a known state" },
      {
        type: "p",
        text: "Tests that depend on data left by other tests pass alone and fail together. Create what the test needs through the API before it starts, and sign in once with a stored session rather than through the login form in every test. The interface is then only used for the behaviour under test.",
      },
      { type: "h", text: "Keep two suites" },
      {
        type: "list",
        items: [
          "Smoke: a few minutes, critical paths only, runs on every build.",
          "Regression: the full set, runs before a release.",
          "Anything that fails intermittently is fixed or removed within the week. A quarantined test nobody owns is a deleted test with extra steps.",
        ],
      },
      {
        type: "p",
        text: "When a failure does happen, the trace viewer shows the DOM, network, and console at each step. Turn traces on for retries and most failures can be diagnosed without running the test again.",
      },
    ],
  },
  {
    slug: "multi-tenant-saas-lessons",
    title: "What I learned from working on multi-tenant SaaS systems",
    category: "Architecture",
    status: "draft",
    date: null,
    readingMinutes: 4,
    description:
      "Tenant isolation is a rule that has to hold on every request. The practical question is where in the code you put it so that nobody can forget it.",
    body: [
      {
        type: "p",
        text: "In a single-customer application, a missing filter shows too many rows. In a multi-tenant one, it shows another company's rows. The same small mistake has a very different cost, and that changes how the code should be organised.",
      },
      { type: "h", text: "Put the tenant rule where it cannot be skipped" },
      {
        type: "p",
        text: "If every endpoint is responsible for adding its own tenant filter, the system is one forgotten line away from a leak. Resolving the tenant once per request, and handing the endpoint a data access layer that is already scoped, moves the rule out of reach of everyday feature work.",
      },
      { type: "h", text: "Configuration is data, not branches" },
      {
        type: "p",
        text: "Tenants always want differences. The first one arrives as an if-statement on a customer name. By the fifth, nobody can say what the product does. Expressing differences as settings or feature flags stored per tenant keeps one code path, and makes each difference visible and testable.",
      },
      { type: "h", text: "Shared screens need shared building blocks" },
      {
        type: "p",
        text: "Admin frontends are mostly lists, filters, and forms. A framework such as Refine gives those a common shape. The discipline is to extend the shared pieces when a screen needs something new, not to fork the screen. Forked screens drift, and a fix made in one never reaches the other.",
      },
      { type: "h", text: "Test with two tenants, always" },
      {
        type: "list",
        items: [
          "Create the record as tenant A, then try to read it as tenant B.",
          "Try to update and delete it by ID as tenant B.",
          "Check list endpoints, exports, and search, not only detail pages.",
        ],
      },
      {
        type: "p",
        text: "Isolation bugs do not show up when you test with one account. Making a second tenant part of every test plan is the cheapest protection there is.",
      },
    ],
  },
  {
    slug: "ai-and-engineering-judgment",
    title: "How AI is changing modern software development",
    category: "AI Engineering",
    status: "draft",
    date: null,
    readingMinutes: 3,
    description:
      "Coding agents have made writing code cheap. They have not made knowing what to build, or knowing whether it is right, any cheaper.",
    body: [
      {
        type: "p",
        text: "An AI coding agent can produce a working endpoint, a set of tests, or a refactor in minutes. That is a real change. It moves the bottleneck from typing to two things that were always the hard part: deciding what should exist, and verifying that what was produced is correct.",
      },
      { type: "h", text: "What speeds up" },
      {
        type: "list",
        items: [
          "First drafts of code in a pattern the codebase already uses.",
          "Reading unfamiliar code and summarising how it fits together.",
          "Test cases from a written requirement.",
          "Repetitive changes across many files.",
        ],
      },
      { type: "h", text: "What does not" },
      {
        type: "p",
        text: "An agent works from the context it is given. It does not know that a field is legally sensitive, that a customer depends on an undocumented behaviour, or that the simple fix was tried last year. It will also report success with confidence when it has not succeeded. None of this is a reason to avoid the tool. It is a reason to keep an engineer responsible for the result.",
      },
      { type: "h", text: "How I work with it" },
      {
        type: "p",
        text: "I write down what done means before asking for anything. I keep tasks small enough that I can read the whole change. I ask for evidence, such as test output or a screenshot, and I check it. In QA work, an agent drafts and executes test cases, and I approve the cases before the run and confirm every failure after it.",
      },
      {
        type: "p",
        text: "The skill that grows in value is review: reading code and results critically, quickly, and knowing where mistakes tend to hide. AI speeds up thinking and execution. The judgment stays with the engineer.",
      },
    ],
  },
];

export function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}
