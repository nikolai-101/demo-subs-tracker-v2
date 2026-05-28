import { differenceInCalendarDays, parseISO } from "date-fns";
import type { SubscriptionWithCategory } from "@/lib/types";

export interface UpcomingItem {
  subscription: SubscriptionWithCategory;
  daysFromToday: number;
}

export function upcomingWithin(
  subscriptions: SubscriptionWithCategory[],
  today: Date,
  days = 7,
): UpcomingItem[] {
  return subscriptions
    .filter((s) => s.status === "active")
    .map((s) => ({
      subscription: s,
      daysFromToday: differenceInCalendarDays(parseISO(s.next_charge_date), today),
    }))
    .filter((it) => it.daysFromToday >= 0 && it.daysFromToday <= days)
    .sort((a, b) => a.daysFromToday - b.daysFromToday);
}

export function overdue(
  subscriptions: SubscriptionWithCategory[],
  today: Date,
): UpcomingItem[] {
  return subscriptions
    .filter((s) => s.status === "active")
    .map((s) => ({
      subscription: s,
      daysFromToday: differenceInCalendarDays(parseISO(s.next_charge_date), today),
    }))
    .filter((it) => it.daysFromToday < 0)
    .sort((a, b) => a.daysFromToday - b.daysFromToday);
}

export function formatRelativeDay(days: number): string {
  if (days === 0) return "сегодня";
  if (days === 1) return "завтра";
  if (days === -1) return "вчера";
  if (days < 0) {
    const n = Math.abs(days);
    return `${n} ${plural(n, "день", "дня", "дней")} назад`;
  }
  return `через ${days} ${plural(days, "день", "дня", "дней")}`;
}

function plural(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}
