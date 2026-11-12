import { Intersection } from "@/components/intersection";
import { identityLabels } from "@/data/content";

/**
 * Desktop: the diagram holds the left seven columns; the paragraph sits at its
 * top edge and the label list at its bottom edge, so the right column spans
 * exactly the drawing's height. Small screens stack paragraph, diagram, labels.
 */
export function Identity() {
  return (
    <section id="about" className="section-y" aria-labelledby="about-title">
      <div className="wrap">
        <h2 id="about-title" className="display max-w-[16ch]" data-split>
          More than writing code. <span className="text-faint">Building complete solutions.</span>
        </h2>

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-12 lg:gap-y-10">
          <p
            className="lead max-w-[52ch] text-muted lg:col-span-5 lg:col-start-8 lg:row-start-1"
            data-split
          >
            My work sits at the intersection of software engineering, product thinking, and emerging AI
            technologies. I enjoy understanding complex problems, designing practical solutions, and
            turning them into reliable products.
          </p>

          <Intersection className="w-full lg:col-span-7 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:self-start" />

          <ul
            className="grid border-t border-line sm:grid-cols-2 sm:gap-x-8 lg:col-span-5 lg:col-start-8 lg:row-start-2 lg:grid-cols-1 lg:self-end"
            data-rise
          >
            {identityLabels.map((label, index) => (
              <li key={label} className="flex items-baseline justify-between gap-4 border-b border-line py-5">
                <span className="label text-faint">0{index + 1}</span>
                <span className="label text-ink">{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
