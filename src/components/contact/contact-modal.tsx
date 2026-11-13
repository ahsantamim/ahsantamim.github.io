"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, Copy, Mail, X } from "lucide-react";
import { GitHubIcon, LinkedInIcon, WhatsAppIcon } from "@/components/contact/brand-icons";
import { CONTACT_EVENT, CONTACT_TRIGGER, openContact } from "@/components/contact/contact-trigger";
import { ContactOrb } from "@/components/contact/contact-orb";
import { MeetingPicker, formatMeeting, type Meeting } from "@/components/contact/meeting-picker";
import { mailto, projectTypes, site, whatsapp } from "@/data/site";

const CLOSE_MS = 260;

/**
 * Project enquiry modal, mounted once in the layout. Every link to `#contact`
 * opens it; without JavaScript those links still scroll to the contact section.
 */
export function ContactModal() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [everOpened, setEverOpened] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const onOpen = () => {
      setEverOpened(true);
      setOpen(true);
    };
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;
      const trigger = (event.target as Element | null)?.closest?.(CONTACT_TRIGGER);
      if (!trigger || dialog.current?.contains(trigger)) return;
      event.preventDefault();
      event.stopPropagation();
      openContact();
    };
    window.addEventListener(CONTACT_EVENT, onOpen);
    window.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener(CONTACT_EVENT, onOpen);
      window.removeEventListener("click", onClick, true);
    };
  }, []);

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  const close = () => {
    if (closing) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOpen(false);
      return;
    }
    setClosing(true);
    window.setTimeout(() => {
      setClosing(false);
      setOpen(false);
    }, CLOSE_MS);
  };

  return (
    <dialog
      ref={dialog}
      className="contact"
      data-closing={closing || undefined}
      aria-labelledby="contact-modal-title"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClose={() => setOpen(false)}
      onClick={(event) => {
        if (event.target === dialog.current) close();
      }}
    >
      {everOpened && (
        <>
        <div className="h-full overflow-y-auto overscroll-contain lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:overflow-hidden">
          <aside className="relative flex min-h-64 flex-col justify-between overflow-hidden border-b border-line bg-surface p-6 sm:min-h-72 sm:p-8 lg:min-h-0 lg:border-r lg:border-b-0 lg:p-10">
            {open && <ContactOrb className="absolute inset-0" />}
            <div className="contact-grid pointer-events-none absolute inset-0" aria-hidden="true" />

            <div className="contact-stagger relative">
              <p className="label text-faint">Start a project</p>
              <h2 id="contact-modal-title" className="mt-4 max-w-[12ch] text-[clamp(2rem,3.4vw,3rem)] leading-[1] font-medium tracking-[-0.04em]">
                Let&rsquo;s build something that ships.
              </h2>
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-80 bg-linear-to-t from-surface via-surface/85 to-transparent lg:block" aria-hidden="true" />
            <DirectLines className="relative hidden lg:block" />
          </aside>

          <div className="relative lg:overflow-y-auto lg:overscroll-contain">
            <ContactForm onDone={close} />
            <DirectLines className="border-t border-line px-6 py-8 sm:px-8 lg:hidden" />
          </div>
        </div>

          <button
            type="button"
            onClick={close}
            className="group absolute top-3 right-3 z-10 inline-flex min-h-11 items-center gap-2 bg-bg/70 px-3 text-sm text-muted backdrop-blur-sm hover:text-ink lg:top-5 lg:right-5"
          >
            Close
            <X
              size={18}
              strokeWidth={1.5}
              aria-hidden="true"
              className="transition-transform duration-300 ease-(--ease-out-expo) group-hover:rotate-90"
            />
          </button>
        </>
      )}
    </dialog>
  );
}

function DirectLines({ className = "" }: { className?: string }) {
  const lines = [
    { label: "Email", value: site.email, href: `mailto:${site.email}`, icon: <Mail size={16} strokeWidth={1.75} aria-hidden="true" /> },
    { label: "WhatsApp", value: site.whatsapp.display, href: whatsapp(), icon: <WhatsAppIcon size={16} /> },
    { label: "LinkedIn", value: "ahsanul-karim", href: site.linkedin, icon: <LinkedInIcon size={15} /> },
    { label: "GitHub", value: "ahsantamim", href: site.github, icon: <GitHubIcon size={16} /> },
  ];
  return (
    <div className={className}>
      <p className="label text-faint">Or reach me directly</p>
      <ul className="mt-4 border-t border-line">
        {lines.map((line) => (
          <li key={line.label} className="border-b border-line">
            <a
              href={line.href}
              {...(line.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group flex min-h-12 items-center gap-4 text-sm text-muted hover:text-ink"
            >
              <span className="flex w-5 justify-center text-ink">{line.icon}</span>
              <span className="w-20 flex-none text-faint">{line.label}</span>
              <span className="link-draw min-w-0 truncate">{line.value}</span>
              <ArrowUpRight
                size={14}
                strokeWidth={1.75}
                aria-hidden="true"
                className="ml-auto flex-none opacity-0 transition-[opacity,transform] duration-300 ease-(--ease-out-expo) group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
              />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

type Sent = { via: "email" | "whatsapp"; body: string; href: string };

function ContactForm({ onDone }: { onDone: () => void }) {
  const [meeting, setMeeting] = useState<Meeting>({ date: null, time: null });
  const [sent, setSent] = useState<Sent | null>(null);
  const [copied, setCopied] = useState(false);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const via = (event.nativeEvent as SubmitEvent).submitter?.getAttribute("value") === "whatsapp" ? "whatsapp" : "email";
    const name = String(data.get("name")).trim();
    const call = formatMeeting(meeting);
    const body = [
      `Hi Ahsanul,`,
      ``,
      `Name: ${name}`,
      `Email: ${String(data.get("email")).trim()}`,
      `Project type: ${data.get("type")}`,
      call ? `Preferred call: ${call.dhaka}${call.local ? ` / ${call.local}` : ""}` : `Preferred call: none picked`,
      ``,
      `About the project:`,
      String(data.get("brief") || "").trim() || "(to discuss)",
    ].join("\n");
    const href = via === "whatsapp" ? whatsapp(body) : mailto(`Project enquiry from ${name}`, body);
    setSent({ via, body, href });
    if (via === "whatsapp") window.open(href, "_blank", "noopener,noreferrer");
    else window.location.href = href;
  };

  if (sent) {
    return (
      <div className="contact-stagger flex min-h-full flex-col justify-center px-6 py-16 sm:px-8 lg:px-12">
        <span className="flex size-12 items-center justify-center border border-line">
          <Check size={20} strokeWidth={1.5} aria-hidden="true" />
        </span>
        <h3 className="mt-8 h3 max-w-[18ch]">
          {sent.via === "email" ? "Your email is ready to send." : "WhatsApp is ready with your message."}
        </h3>
        <p className="mt-4 max-w-[46ch] text-muted">
          Everything you filled in is already in the message. Hit send there and I&rsquo;ll get back to you soon.
          If nothing opened, copy the details and send them to {site.email}.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <a href={sent.href} {...(sent.via === "whatsapp" ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="btn btn-solid">
            <span>Open again</span>
            <ArrowUpRight className="icon-diagonal" size={16} strokeWidth={1.75} aria-hidden="true" />
          </a>
          <button
            type="button"
            className="btn btn-outline"
            onClick={async () => {
              await navigator.clipboard.writeText(sent.body);
              setCopied(true);
            }}
          >
            <span>{copied ? "Copied" : "Copy details"}</span>
            {copied ? <Check size={15} strokeWidth={1.75} aria-hidden="true" /> : <Copy size={15} strokeWidth={1.75} aria-hidden="true" />}
          </button>
        </div>
        <div className="mt-8 flex gap-6 text-sm">
          <button type="button" className="link-draw text-muted hover:text-ink" onClick={() => setSent(null)}>
            Edit details
          </button>
          <button type="button" className="link-draw text-muted hover:text-ink" onClick={onDone}>
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="contact-stagger px-6 pt-10 pb-10 sm:px-8 lg:px-12 lg:pt-16">
      <Step index={1} title="About you">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Name" name="name" autoComplete="name" placeholder="Your name" />
          <Field label="Email" name="email" type="email" autoComplete="email" placeholder="you@company.com" />
        </div>
      </Step>

      <Step index={2} title="Project type">
        <fieldset>
          <legend className="sr-only">Project type</legend>
          <div className="flex flex-wrap gap-2">
            {projectTypes.map((type, i) => (
              <label
                key={type}
                className="relative cursor-pointer border border-line px-4 py-2.5 text-sm text-muted transition-colors duration-200 hover:border-faint hover:text-ink has-checked:border-invert has-checked:bg-invert has-checked:text-invert-ink has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ink"
              >
                <input type="radio" name="type" value={type} required={i === 0} className="sr-only" />
                {type}
              </label>
            ))}
          </div>
        </fieldset>
      </Step>

      <Step index={3} title="The brief" hint="Optional">
        <label className="sr-only" htmlFor="contact-brief">
          About the project
        </label>
        <textarea
          id="contact-brief"
          name="brief"
          rows={3}
          placeholder="What are you building, and where are you stuck?"
          className="contact-input resize-none"
        />
      </Step>

      <Step index={4} title="Book a call" hint="Optional · 30 min">
        <MeetingPicker value={meeting} onChange={setMeeting} />
      </Step>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <button type="submit" value="email" className="btn btn-solid btn-glow">
          <span>Send request</span>
          <ArrowUpRight className="icon-diagonal" size={16} strokeWidth={1.75} aria-hidden="true" />
        </button>
        <button type="submit" value="whatsapp" className="btn btn-outline btn-glow">
          <span>Send on WhatsApp</span>
          <WhatsAppIcon size={16} />
        </button>
      </div>
      <p className="mt-4 text-xs text-faint">Opens your email app or WhatsApp with everything filled in. Nothing is stored on this site.</p>
    </form>
  );
}

function Step({ index, title, hint, children }: { index: number; title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line pt-5 pb-9 first:border-t-0 first:pt-0">
      <div className="mb-5 flex items-baseline gap-4">
        <span className="label text-faint">0{index}</span>
        <h3 className="text-[0.9375rem] font-medium tracking-tight">{title}</h3>
        {hint && <span className="ml-auto text-xs text-faint">{hint}</span>}
      </div>
      {children}
    </section>
  );
}

function Field({ label, ...input }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="label text-faint">{label}</span>
      <input required {...input} className="contact-input mt-1" />
    </label>
  );
}
