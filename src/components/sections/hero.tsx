import { Button } from "@/components/button";
import { Avatar } from "@/components/hero/avatar";
import { HeroParallax } from "@/components/hero/hero-parallax";
import { HeroStages } from "@/components/hero/hero-stages";
import { TextCycle } from "@/components/hero/text-cycle";
import { hero } from "@/data/content";
import { site } from "@/data/site";

const delay = (i: number) => ({ "--i": i }) as React.CSSProperties;

/**
 * One centred column on one screen: who, what, the design, build, ship loop,
 * then the two actions. Sticky: the next sections must sit above it with an
 * opaque background.
 */
export function Hero() {
  return (
    <section className="sticky top-0 z-0 flex h-svh min-h-[42rem] flex-col overflow-hidden" aria-labelledby="hero-title">
      <HeroParallax className="wrap flex flex-1 flex-col items-center justify-center pt-(--nav-h) pb-6 text-center">
        <p
          className="enter-blur font-mono text-xs tracking-[0.18em] text-muted uppercase sm:text-sm"
          style={delay(0)}
        >
          <TextCycle phrases={hero.roles} />
        </p>

        <p
          className="enter-blur mt-3 flex flex-wrap items-center justify-center gap-x-[0.35em] gap-y-1 text-[clamp(1.125rem,1.7vw,1.5rem)] leading-tight font-medium tracking-[-0.015em] text-muted"
          style={delay(0)}
        >
          <span>Hey,</span>
          <Avatar />
          <span>
            I&rsquo;m <span className="text-ink">{site.name}</span>
          </span>
        </p>

        <h1
          id="hero-title"
          className="mt-4 text-[clamp(3.25rem,7.8vw,7.75rem)] leading-[0.98] font-medium tracking-[-0.045em] sm:mt-5"
        >
          <span className="line-mask">
            <span style={delay(1)}>{hero.headline}</span>
          </span>
        </h1>

        <div className="enter-fade mt-6 w-full" style={delay(3)}>
          <HeroStages />
        </div>

        <div
          className="enter-fade mt-10 flex w-full flex-col items-center justify-center gap-3 lg:mt-7 sm:w-auto sm:flex-row"
          style={delay(4)}
        >
          <Button href="/work" variant="solid" className="btn-glow w-full sm:w-auto">
            Explore My Work
          </Button>
          <Button href="/#contact" icon="diagonal" className="btn-glow w-full sm:w-auto">
            Let&rsquo;s Talk
          </Button>
        </div>
      </HeroParallax>
    </section>
  );
}
