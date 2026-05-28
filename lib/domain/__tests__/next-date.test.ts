import { describe, it, expect } from "vitest";
import { advanceChargeDate } from "../next-date";

describe("advanceChargeDate", () => {
  it("сдвигает месячную подписку на 1 месяц", () => {
    expect(advanceChargeDate("2026-01-15", "monthly")).toBe("2026-02-15");
  });

  it("31 января + месяц → 28 февраля (не високосный)", () => {
    expect(advanceChargeDate("2026-01-31", "monthly")).toBe("2026-02-28");
  });

  it("31 января + месяц → 29 февраля (високосный)", () => {
    expect(advanceChargeDate("2024-01-31", "monthly")).toBe("2024-02-29");
  });

  it("31 декабря + месяц → 31 января следующего года", () => {
    expect(advanceChargeDate("2026-12-31", "monthly")).toBe("2027-01-31");
  });

  it("сдвигает годовую подписку на 1 год", () => {
    expect(advanceChargeDate("2026-05-28", "yearly")).toBe("2027-05-28");
  });

  it("29 февраля високосного + год → 28 февраля", () => {
    expect(advanceChargeDate("2024-02-29", "yearly")).toBe("2025-02-28");
  });
});
