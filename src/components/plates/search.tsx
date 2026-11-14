"use client";

import { Label, S } from "@/components/plates/parts";
import { Captions, Chip, Cursor, Highlight, Packet, StoryLayer, Wire, role, useStory } from "@/components/plates/story";

const PUBLISH = "M230 100 H330";
const INDEX = "M470 100 H570";
const QUERY = "M400 251 H470";
const LOOKUP = "M630 251 H660 V130";
const CYLINDER = "M330 80 a70 14 0 0 0 140 0 a70 14 0 0 0 -140 0 V122 a70 14 0 0 0 140 0 V80";
const GRID = Array.from({ length: 32 }, (_, i) => ({ x: 492 + (i % 8) * 31, y: 320 + Math.floor(i / 8) * 30 }));
const NEW_DOC = 5;
const MATCHES = [2, 9, 12, 19, 22, 28];
const RESULTS = [220, 180, 240, 200];

const STEPS = [
  { label: "Publish", note: "Editor in TinaCMS" },
  { label: "Index", note: "Sync to Elasticsearch" },
  { label: "Query", note: "Reader searches" },
  { label: "Match", note: "Across 1M+ articles" },
  { label: "Results", note: "Shown to the reader" },
];
const CAPTION_AT = [0, 1.8, 3, 4.8, 5.9];
const OUT = 8.4;

/**
 * Binary Quest's content platform: editors publish through the headless CMS,
 * articles land in PostgreSQL and sync to Elasticsearch, and a reader's search
 * runs against the index across the full archive.
 */
export function Search() {
  return (
    <>
      <rect {...S} x={50} y={70} width={180} height={60} />
      <Label x={140} y={97}>CMS</Label>
      <Label x={140} y={117} dim>Strapi · TinaCMS</Label>
      <path {...S} d={PUBLISH} strokeOpacity="0.55" />
      <path {...S} d={CYLINDER} />
      <Label x={400} y={118}>PostgreSQL</Label>
      <path {...S} d={INDEX} strokeOpacity="0.55" />
      <rect {...S} x={570} y={70} width={180} height={60} />
      <Label x={660} y={97}>Elasticsearch</Label>
      <Label x={660} y={117} dim>Search index</Label>

      <rect {...S} x={50} y={230} width={350} height={42} />
      <circle {...S} cx={74} cy={249} r={7} strokeOpacity="0.6" />
      <path {...S} d="M79 254 l6 6" strokeOpacity="0.6" />
      <Label x={96} y={256} anchor="start" dim>Search articles</Label>
      <path {...S} d={QUERY} strokeOpacity="0.55" />
      <rect {...S} x={470} y={230} width={160} height={42} />
      <Label x={550} y={256}>Search API</Label>
      <path {...S} d={LOOKUP} strokeOpacity="0.55" />

      <rect {...S} x={50} y={300} width={350} height={150} strokeOpacity="0.6" />
      <Label x={50} y={476} anchor="start" dim>Results</Label>
      <rect {...S} x={470} y={300} width={280} height={150} strokeOpacity="0.6" />
      {GRID.map(({ x, y }) => (
        <rect key={`${x}-${y}`} {...S} x={x} y={y} width={22} height={16} strokeOpacity="0.4" />
      ))}
      <Label x={750} y={476} anchor="end" dim>1M+ articles indexed</Label>

      <SearchStory />
    </>
  );
}

function SearchStory() {
  const root = useStory(({ pick, q, show, hide, pop, draw, fill, travel, click, caption, end }) => {
    CAPTION_AT.forEach((at, i) => caption(i, at, i < CAPTION_AT.length - 1 ? CAPTION_AT[i + 1] - 0.2 : OUT));

    /* Publish: an editor saves an article; it lands in PostgreSQL. */
    show(pick("cms"), click(152, 104, 0.1), 0.3);
    draw(pick("publish"), 0.9, 0.6);
    travel(PUBLISH, 0.9, 0.6);
    pop(pick("new"), 1.45);
    hide(pick("new"), 2.6);

    /* Index: the same article reaches the search index. */
    draw(pick("index"), CAPTION_AT[1], 0.6);
    travel(INDEX, CAPTION_AT[1], 0.6);
    show(pick("es"), 2.35, 0.3);
    pop(pick("doc"), 2.35);

    /* Query: a reader types a search; it goes through the API to the index. */
    show(pick("bar"), CAPTION_AT[2], 0.3);
    show(pick("mask"), CAPTION_AT[2], 0.2);
    fill(pick("typed"), CAPTION_AT[2] + 0.1, "x");
    draw(pick("query"), 3.8, 0.4);
    travel(QUERY, 3.8, 0.4);
    draw(pick("lookup"), 4.2, 0.6);
    travel(LOOKUP, 4.2, 0.6);

    /* Match: hits light up across the index. */
    fill(pick("match"), CAPTION_AT[3] + 0.05, "y", 0.5);

    /* Results: the hits come back and the list fills as they land. */
    travel("M660 130 V251 H630", CAPTION_AT[4], 0.5);
    travel("M470 251 H435 V330 H400", 6.45, 0.5);
    fill(pick("result"), 6.9, "x", 0.24);

    hide(q("[data-s]:not([data-s-cap]):not([data-s-packet]):not([data-s-cursor])"), OUT);
    end(OUT + 0.6);
  });

  return (
    <StoryLayer root={root}>
      <Captions steps={STEPS} />
      <Highlight name="cms" x={50} y={70} width={180} height={60} on />
      <Highlight name="es" x={570} y={70} width={180} height={60} on />
      <Highlight name="bar" x={50} y={230} width={350} height={42} on />
      <Wire name="publish" d={PUBLISH} on />
      <Wire name="index" d={INDEX} on />
      <Wire name="query" d={QUERY} on />
      <Wire name="lookup" d={LOOKUP} on />
      <Chip name="new" x={330} y={150} width={140} text="New article" />
      <rect {...role("doc")} x={GRID[NEW_DOC].x} y={GRID[NEW_DOC].y} width={22} height={16} className="fill-motion" stroke="none" />
      {MATCHES.map((i) => (
        <rect key={i} {...role("match")} x={GRID[i].x} y={GRID[i].y} width={22} height={16} className="fill-motion" fillOpacity="0.55" stroke="none" />
      ))}
      <rect {...role("mask")} x={90} y={238} width={300} height={26} className="fill-bg" stroke="none" />
      <rect {...role("typed")} x={96} y={248} width={150} height={5} fill="currentColor" stroke="none" />
      {RESULTS.map((width, i) => (
        <g key={i}>
          <rect {...role("result")} x={70} y={322 + i * 32} width={width} height={6} fill="currentColor" fillOpacity="0.85" stroke="none" />
          <rect {...role("result")} x={70} y={334 + i * 32} width={110} height={4} className="fill-faint" stroke="none" />
        </g>
      ))}
      <Packet />
      <Cursor />
    </StoryLayer>
  );
}
