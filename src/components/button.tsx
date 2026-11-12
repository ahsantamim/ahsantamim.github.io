import Link from "next/link";
import { ArrowRight, ArrowUpRight, Download } from "lucide-react";
import { Magnetic } from "@/components/motion/magnetic";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "outline";
  icon?: "right" | "diagonal" | "download" | "none";
  className?: string;
  magnetic?: boolean;
  download?: boolean;
};

const isInternal = (href: string) => href.startsWith("/") && !href.endsWith(".pdf");

/** The one button on the site. Renders a Next link for routes, an anchor otherwise. */
export function Button({
  href,
  children,
  variant = "outline",
  icon = "right",
  className = "",
  magnetic = true,
  download,
}: Props) {
  const classes = `btn btn-${variant} ${className}`;
  const content = (
    <>
      <span>{children}</span>
      {icon === "right" && <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" />}
      {icon === "diagonal" && (
        <ArrowUpRight className="icon-diagonal" size={16} strokeWidth={1.75} aria-hidden="true" />
      )}
      {icon === "download" && <Download size={15} strokeWidth={1.75} aria-hidden="true" />}
    </>
  );

  const element = isInternal(href) ? (
    <Link href={href} className={classes}>
      {content}
    </Link>
  ) : (
    <a
      href={href}
      className={classes}
      download={download}
      {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {content}
    </a>
  );

  return magnetic ? <Magnetic className={className.includes("w-full") ? "max-sm:w-full" : ""}>{element}</Magnetic> : element;
}
