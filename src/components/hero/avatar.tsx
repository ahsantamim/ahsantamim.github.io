import Image from "next/image";
import portrait from "../../../public/dp.png";

/**
 * Portrait badge, sized in em so it tracks the greeting's type. The photo is a
 * cut-out, so it sits on a yellow disc in both themes.
 */
export function Avatar({ className = "" }: { className?: string }) {
  return (
    <span
      className={`relative inline-block size-[2.9em] shrink-0 overflow-hidden rounded-full bg-yellow-400 ${className}`}
      aria-hidden="true"
    >
      <Image
        src={portrait}
        alt=""
        fill
        sizes="96px"
        priority
        className="origin-[40%_0%] scale-[1.15] object-cover object-top"
      />
    </span>
  );
}
