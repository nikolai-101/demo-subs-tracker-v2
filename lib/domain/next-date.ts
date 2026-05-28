import { addMonths, addYears, parseISO, format } from "date-fns";
import type { Period } from "@/lib/types";

export function advanceChargeDate(isoDate: string, period: Period): string {
  const d = parseISO(isoDate);
  const next = period === "monthly" ? addMonths(d, 1) : addYears(d, 1);
  return format(next, "yyyy-MM-dd");
}

export function todayISO(): string {
  return format(new Date(), "yyyy-MM-dd");
}
