/**
 * Copy for /about. Every fact here mirrors public/Ahsanul_Karim_Resume.pdf;
 * the rest is voice, not claims.
 */
export const about = {
  title: "About Me: AI-Native Full-Stack Engineer in Dhaka",
  description:
    "Ahsanul Karim is an AI-native full-stack software engineer in Dhaka, Bangladesh, with 3+ years shipping SaaS, B2B fintech, and AI products for teams in four countries.",

  intro: {
    /** Each entry is one masked line of the h1. */
    lines: ["Hi, I\u2019m Ahsanul.", "I turn ideas into", "software that"],
    /** Set in the serif accent, closing the last line. */
    accent: "ships.",
    lead: "An AI-native full-stack engineer in Dhaka, Bangladesh. For 3+ years I\u2019ve shipped SaaS, B2B fintech, and AI products for teams in Saudi Arabia, Spain, Germany, and Bangladesh, owning the interface, the API, the tests, and the deploy.",
    facts: [
      { label: "Based in", value: "Dhaka, Bangladesh" },
      { label: "Experience", value: "3+ years, 4 countries" },
      { label: "Currently", value: "AI Native Software Engineer at NSBH" },
      { label: "Status", value: "Available for selected projects" },
    ],
  },

  story: {
    title: "From signals to software.",
    paragraphs: [
      "I trained as an electronics and telecommunication engineer, where the work is making systems talk to each other reliably. Software turned out to be the same problem with a much faster feedback loop, so that is where I stayed.",
      "Since then I\u2019ve been the founding engineer of an AI recruitment platform, rebuilt the frontend of a telecom SaaS used by 50+ enterprise clients across Europe, made a million-article news archive searchable in about 200ms, and today build the partner and operations portals of a B2B commerce platform.",
      "I work end to end: product thinking, interface, API, data model, tests, and deployment. AI agents sit inside that workflow for scaffolding, test generation, and review, which leaves my own attention for the decisions that need judgment.",
    ],
  },

  motive: {
    title: "Why I build.",
    statement:
      "Most good ideas never die in the pitch. They die somewhere between the first sketch and the first deploy. I like being the person who closes that gap.",
    reasons: [
      {
        title: "Ideas deserve to ship.",
        text: "A product only starts teaching you something once real people use it. I optimise for getting there, then for getting it right.",
      },
      {
        title: "Quality is a form of respect.",
        text: "Tests, accessibility, and performance are how you respect the people who will depend on the thing you built.",
      },
      {
        title: "Leverage, not shortcuts.",
        text: "AI makes me faster at the work. It does not make the decisions, and it never signs off on the result.",
      },
    ],
  },

  education: {
    title: "Education",
    entries: [
      {
        degree: "BSc in Electronics & Telecommunication Engineering",
        school: "East West University",
        schoolUrl: "https://www.ewubd.edu",
        location: "Dhaka, Bangladesh",
        start: { label: "Jan 2019", iso: "2019-01" },
        end: { label: "Jul 2023", iso: "2023-07" },
      },
    ],
    note: "Signals, systems, and networks: the habit of asking what goes in, what comes out, and what happens when it fails. I still learn the same way, lately through cloud deployment, CI/CD, and multi-agent development workflows.",
  },

  closing: {
    title: "Now you know the person. Let\u2019s talk about the product.",
  },
} as const;
