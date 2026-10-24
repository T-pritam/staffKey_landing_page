import type { Job } from "@/lib/types";

const inr = new Intl.NumberFormat("en-IN");

export function formatNumber(n: number) {
  return inr.format(n);
}

/** 32000 → "32k" */
function k(n: number) {
  return `${Math.round(n / 1000)}k`;
}

export function formatSalary(salary: Job["salary"]) {
  if (!salary) return "Salary on request";
  return `₹${k(salary.min)}–${k(salary.max)}`;
}

/** Months → "3–8 yrs", "5+ yrs", "0–3 yrs", "6 mo–4 yrs" */
export function formatExperience({ minMonths, maxMonths }: Job["experience"]) {
  const years = (m: number) => {
    const y = m / 12;
    return Number.isInteger(y) ? `${y}` : y.toFixed(1).replace(/\.0$/, "");
  };
  const min = minMonths < 12 && minMonths > 0 ? `${minMonths} mo` : years(minMonths);
  if (maxMonths === null) return `${min}+ yrs`;
  return `${min}–${years(maxMonths)} yrs`;
}

export const EMPLOYMENT_LABEL: Record<Job["employmentType"], string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  SEASONAL: "Seasonal",
  APPRENTICESHIP: "Apprenticeship",
};
