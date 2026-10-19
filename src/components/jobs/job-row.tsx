import { ArrowUpRight } from "lucide-react";

import { EMPLOYMENT_LABEL, formatExperience, formatSalary } from "@/lib/format";
import { LINKS } from "@/lib/links";
import type { Job } from "@/lib/types";

/**
 * One vacancy. A wide table-like row on desktop (blue wipe on hover, detail
 * line fades in), a stacked card on phones. The title link stretches over the
 * whole row, so the row is one tap target with one accessible name.
 */
export function JobRow({ job }: { job: Job }) {
  const type = job.employmentType ? EMPLOYMENT_LABEL[job.employmentType] : "Full-time";
  const where = [job.propertyType, job.city].filter(Boolean).join(" · ");
  const positions = `${job.positions} ${job.positions === 1 ? "position" : "positions"}`;

  return (
    <article className="job-row group/job relative isolate overflow-clip has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-blue-hi rounded-[24px] border border-line-dark bg-ink-2 p-5 transition-colors duration-500 sm:p-6 lg:rounded-none lg:border-x-0 lg:border-t-0 lg:bg-transparent lg:px-6 lg:py-0">
      {/* the blue wipe (desktop hover) */}
      <span aria-hidden className="job-wipe absolute inset-0 -z-10 hidden origin-left scale-x-0 bg-blue lg:block" />

      <div className="flex flex-col gap-5 lg:grid lg:min-h-[112px] lg:grid-cols-[minmax(0,1fr)_12rem_7rem_8rem_7rem_3rem] lg:items-center lg:gap-6">
        {/* title */}
        <div className="min-w-0">
          <p className="eyebrow mb-2 flex items-center justify-between !text-[12px] text-on-dark-faint lg:hidden">
            <span>{job.department}</span>
            <span className="rounded-full border border-line-dark px-2.5 py-1 tracking-[0.08em] text-on-dark-muted">{type}</span>
          </p>
          <h3 className="display text-[clamp(22px,2vw,28px)] leading-[1.05] tracking-[-0.015em]">
            <a href={LINKS.apply(job.id)} className="after:absolute after:inset-0 after:z-10 after:content-[''] focus-visible:outline-none">
              {job.title}
            </a>
          </h3>
          <p className="mt-1.5 hidden text-[14px] text-on-dark-muted lg:block">
            {job.department} · {positions}
            <span className="job-detail"> · Verified profiles only, apply with your Staffkey ID</span>
          </p>
        </div>

        {/* facts */}
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-[14px] lg:contents">
          <div className="lg:block">
            <dt className="eyebrow mb-1 !text-[12px] text-on-dark-faint lg:sr-only">Where</dt>
            <dd className="text-ivory/90">{where}</dd>
          </div>
          <div>
            <dt className="eyebrow mb-1 !text-[12px] text-on-dark-faint lg:sr-only">Experience</dt>
            <dd className="font-mono text-[14px] text-ivory/90">{formatExperience(job.experience)}</dd>
          </div>
          <div>
            <dt className="eyebrow mb-1 !text-[12px] text-on-dark-faint lg:sr-only">Salary / month</dt>
            <dd className="font-mono text-[14px] text-ivory">{formatSalary(job.salary)}</dd>
          </div>
          <div>
            <dt className="eyebrow mb-1 !text-[12px] text-on-dark-faint lg:sr-only">
              <span className="lg:hidden">Openings</span>
              <span className="hidden lg:inline">Type</span>
            </dt>
            <dd className="text-ivory/90">
              <span className="lg:hidden">{positions}</span>
              <span className="hidden lg:inline">{type}</span>
            </dd>
          </div>
        </dl>

        {/* apply affordance */}
        <span
          aria-hidden
          className="job-arrow flex items-center justify-between rounded-full bg-blue px-5 py-3 text-[14px] font-medium text-white lg:size-12 lg:justify-center lg:bg-transparent lg:p-0 lg:ring-1 lg:ring-line-dark"
        >
          <span className="lg:hidden">Apply</span>
          <ArrowUpRight className="size-5" />
        </span>
      </div>
    </article>
  );
}
