import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

import { CandidateLink } from "@/components/links/candidate-link";
import { Magnetic } from "@/components/ui/magnetic";
import { ScrollWords } from "@/components/ui/scroll-words";
import type { Job, LandingLinks } from "@/lib/types";

import { JobRow } from "./job-row";
import { JobsBoard } from "./jobs-board";
import { JOBS_PAGE } from "./page-size";

function JobsShell({ count, children }: { count: ReactNode; children: ReactNode }) {
  return (
    <section
      id="live-jobs"
      aria-labelledby="jobs-title"
      className="defer-render relative z-20 -mt-10 rounded-t-[32px] bg-ink [--defer-h:5200px] lg:[--defer-h:3000px] pt-24 pb-16 text-ivory sm:pt-28 lg:-mt-12 lg:rounded-t-[48px] lg:pt-36 lg:pb-24"
    >
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[380px] overflow-clip rounded-t-[inherit]">
        <div className="absolute -top-[420px] left-1/2 size-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(18_63_240/0.22),transparent)]" />
      </div>
      <div className="relative mx-auto max-w-[1440px] px-[var(--gutter)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow mb-6 flex items-center gap-3 text-on-dark-faint">
              <span aria-hidden className="h-px w-8 bg-ivory/30" />
              Live jobs
            </p>
            <ScrollWords id="jobs-title" className="display text-[clamp(40px,6vw,88px)]" parts={["Roles open", { em: "this week." }]} />
          </div>
          <p className="glass inline-flex min-h-10 items-center gap-2.5 self-start rounded-full py-2 pr-4 pl-3 text-[14px] lg:self-auto">
            <span className="pulse-dot" aria-hidden />
            {count}
          </p>
        </div>
        {children}
      </div>
    </section>
  );
}

/**
 * The sample job cards an admin publishes. Illustrative listings, labelled as
 * such; Apply leads into candidate onboarding. With none published the section
 * keeps its heading (so the Jobs link still lands somewhere) and says roles
 * are coming.
 */
export function JobsSection({ jobs, links }: { jobs: Job[]; links: LandingLinks }) {
  const positions = jobs.reduce((n, j) => n + j.positions, 0);
  return (
    <JobsShell
      count={
        jobs.length === 0 ? (
          <span>New roles soon</span>
        ) : (
          <span>
            <strong className="font-mono font-medium">{jobs.length}</strong> sample roles · <span className="font-mono">{positions}</span> positions
          </span>
        )
      }
    >
      {jobs.length === 0 ? (
        <div className="mt-12 rounded-[28px] border border-dashed border-line-dark px-6 py-16 text-center">
          <p className="display text-[28px]">New roles are posted here soon.</p>
          <p className="mt-2 text-on-dark-muted">Join Staffkey now and hotels can see you&rsquo;re ready the moment they hire.</p>
          <div className="mt-8 flex justify-center">
            <Magnetic>
              <CandidateLink links={links} className="btn btn-ghost">
                Find a job <ArrowUpRight className="btn-arrow size-4" aria-hidden />
              </CandidateLink>
            </Magnetic>
          </div>
        </div>
      ) : (
        <>
          <JobsBoard departments={jobs.map((j) => j.department)}>
            {jobs.map((job, index) => (
              // Rows past the first page start hidden on the server too, so nothing jumps when the board takes over.
              <li key={job.id} data-job data-dept={job.department} data-flip-id={job.id} hidden={index >= JOBS_PAGE}>
                <JobRow job={job} links={links} />
              </li>
            ))}
          </JobsBoard>
          <p className="mt-8 text-center font-mono text-[12px] text-on-dark-faint">
            Sample listings, shown to illustrate the roles hotels hire for on Staffkey. Apply to join and get your Staffkey ID.
          </p>
        </>
      )}

      {/* phones: a quiet sticky shortcut while the list is on screen */}
      <div className="pointer-events-none sticky bottom-[max(12px,env(safe-area-inset-bottom))] z-30 mt-8 flex justify-center lg:hidden">
        <CandidateLink
          links={links}
          className="glass pointer-events-auto inline-flex min-h-12 items-center gap-3 rounded-full py-1.5 pr-1.5 pl-5 text-[14px] shadow-[0_20px_40px_-12px_rgb(0_0_0/0.8)]"
        >
          Apply in two minutes
          <span className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-blue px-4 font-medium text-white">
            Find a job <ArrowUpRight className="size-4" aria-hidden />
          </span>
        </CandidateLink>
      </div>

      <CtaBand links={links} />
    </JobsShell>
  );
}

function CtaBand({ links }: { links: LandingLinks }) {
  const doors = [
    {
      eyebrow: "For employers",
      title: "I’m hiring",
      body: "Browse verified candidates by department and role. Profiles are released to you the moment you need them.",
      href: links.employerSignup,
      cta: "Start hiring",
      primary: true,
    },
    {
      eyebrow: "For candidates",
      title: "I’m looking for work",
      body: "Verify once and get a permanent Staffkey ID. Every hotel on Staffkey can see you’re ready.",
      href: null,
      cta: "Find a job",
      primary: false,
    },
  ];

  return (
    <div
      id="for-employers"
      className="grain relative isolate mt-24 scroll-mt-24 overflow-clip rounded-[32px] bg-ink-2 px-6 py-14 ring-1 ring-line-dark sm:px-10 lg:mt-36 lg:rounded-[48px] lg:px-16 lg:py-24"
    >
      <div aria-hidden className="absolute -bottom-[45%] left-1/2 -z-10 h-[620px] w-[1100px] max-w-[160%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(18_63_240/0.6),transparent)]" />
      <div aria-hidden className="absolute -top-24 -right-24 -z-10 size-[360px] rounded-full bg-[radial-gradient(closest-side,rgb(217_179_106/0.2),transparent)]" />

      <ScrollWords as="h2" className="display mx-auto max-w-[10ch] text-center text-[clamp(38px,5.6vw,80px)]" parts={["Two doors.", "One", { em: "key." }]} />
      <p className="mx-auto mt-5 max-w-[34rem] text-center text-[16px] leading-relaxed text-on-dark-muted lg:text-[18px]">
        Staffkey keeps a live bench of verified hospitality talent. Pick your side of the pass.
      </p>

      <div className="mt-12 grid gap-4 lg:mt-16 lg:grid-cols-2 lg:gap-5">
        {doors.map((d) => {
          const className = `group/door relative flex min-h-[260px] flex-col overflow-clip rounded-[28px] p-7 transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] hover:-translate-y-1 sm:p-9 ${
            d.primary ? "bg-blue text-white" : "bg-ivory text-ink"
          }`;
          const inner = (
          <>
            <span className={`eyebrow !text-[12px] ${d.primary ? "text-white/75" : "text-on-light-muted"}`}>{d.eyebrow}</span>
            <span className="display mt-4 text-[clamp(30px,3.2vw,44px)]">{d.title}</span>
            <span className={`mt-3 max-w-[30rem] text-[15px] leading-relaxed ${d.primary ? "text-white/85" : "text-on-light-muted"}`}>{d.body}</span>
            <span className="mt-auto flex items-center justify-between pt-8 text-[15px] font-medium">
              {d.cta}
              <span
                className={`inline-flex size-12 items-center justify-center rounded-full transition-transform duration-500 group-hover/door:rotate-45 ${
                  d.primary ? "bg-white text-blue" : "bg-ink text-ivory"
                }`}
              >
                <ArrowUpRight className="size-5" aria-hidden />
              </span>
            </span>
          </>
          );
          // The candidate door follows the device (store or download page on phones once set, candidate web otherwise).
          return d.href ? (
            <a key={d.title} href={d.href} className={className}>
              {inner}
            </a>
          ) : (
            <CandidateLink key={d.title} links={links} className={className}>
              {inner}
            </CandidateLink>
          );
        })}
      </div>
    </div>
  );
}
