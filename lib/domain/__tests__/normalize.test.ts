import { describe, it, expect } from "vitest";
import { monthlyEquivalent, monthlyTotalsByCurrency } from "../normalize";
import type { SubscriptionWithCategory } from "@/lib/types";

function sub(
  partial: Partial<SubscriptionWithCategory> & Pick<SubscriptionWithCategory, "amount" | "currency" | "period">,
): SubscriptionWithCategory {
  return {
    id: 1,
    name: "x",
    next_charge_date: "2026-01-01",
    category_id: null,
    note: null,
    status: "active",
    created_at: "",
    updated_at: "",
    category_name: null,
    category_color: null,
    ...partial,
  };
}

describe("monthlyEquivalent", () => {
  it("месячная подписка остаётся как есть", () => {
    expect(monthlyEquivalent(500, "monthly")).toBe(500);
  });
  it("годовая подписка делится на 12", () => {
    expect(monthlyEquivalent(1200, "yearly")).toBe(100);
  });
});

describe("monthlyTotalsByCurrency", () => {
  it("суммирует по валютам и сортирует по убыванию", () => {
    const items = [
      sub({ amount: 500, currency: "RUB", period: "monthly" }),
      sub({ amount: 1200, currency: "RUB", period: "yearly" }),
      sub({ amount: 10, currency: "USD", period: "monthly" }),
    ];
    expect(monthlyTotalsByCurrency(items)).toEqual([
      { currency: "RUB", total: 600 },
      { currency: "USD", total: 10 },
    ]);
  });

  it("игнорирует отменённые подписки", () => {
    const items = [
      sub({ amount: 500, currency: "RUB", period: "monthly", status: "cancelled" }),
      sub({ amount: 200, currency: "RUB", period: "monthly" }),
    ];
    expect(monthlyTotalsByCurrency(items)).toEqual([{ currency: "RUB", total: 200 }]);
  });
});
