import type { Period, SubscriptionWithCategory } from "@/lib/types";

export function monthlyEquivalent(amount: number, period: Period): number {
  return period === "monthly" ? amount : amount / 12;
}

export interface CurrencyTotal {
  currency: string;
  total: number;
}

export function monthlyTotalsByCurrency(
  subscriptions: SubscriptionWithCategory[],
): CurrencyTotal[] {
  const totals = new Map<string, number>();
  for (const s of subscriptions) {
    if (s.status !== "active") continue;
    const cur = totals.get(s.currency) ?? 0;
    totals.set(s.currency, cur + monthlyEquivalent(s.amount, s.period));
  }
  return Array.from(totals.entries())
    .map(([currency, total]) => ({ currency, total }))
    .sort((a, b) => b.total - a.total);
}
