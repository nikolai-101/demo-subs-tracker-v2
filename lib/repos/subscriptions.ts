import { db } from "@/lib/db";
import type { Period, Status, Subscription, SubscriptionWithCategory } from "@/lib/types";

const SELECT_WITH_CATEGORY = `
  SELECT
    s.id, s.name, s.amount, s.currency, s.period, s.next_charge_date,
    s.category_id, s.note, s.status, s.created_at, s.updated_at,
    c.name AS category_name, c.color AS category_color
  FROM subscriptions s
  LEFT JOIN categories c ON c.id = s.category_id
`;

export interface SubscriptionInput {
  name: string;
  amount: number;
  currency: string;
  period: Period;
  next_charge_date: string;
  category_id: number | null;
  note: string | null;
}

export interface ListOptions {
  status?: Status | "all";
  categoryId?: number | null | "all";
  sort?: "next_charge_date" | "amount" | "name";
  order?: "asc" | "desc";
}

export function listSubscriptions(opts: ListOptions = {}): SubscriptionWithCategory[] {
  const conditions: string[] = [];
  const params: unknown[] = [];

  const status = opts.status ?? "active";
  if (status !== "all") {
    conditions.push("s.status = ?");
    params.push(status);
  }
  if (opts.categoryId !== undefined && opts.categoryId !== "all") {
    if (opts.categoryId === null) {
      conditions.push("s.category_id IS NULL");
    } else {
      conditions.push("s.category_id = ?");
      params.push(opts.categoryId);
    }
  }

  const sortCol = opts.sort ?? "next_charge_date";
  const order = (opts.order ?? "asc").toUpperCase() === "DESC" ? "DESC" : "ASC";
  const orderClause = ` ORDER BY s.${sortCol} ${order}`;

  const sql =
    SELECT_WITH_CATEGORY +
    (conditions.length ? " WHERE " + conditions.join(" AND ") : "") +
    orderClause;
  return db.prepare(sql).all(...params) as SubscriptionWithCategory[];
}

export function getSubscription(id: number): SubscriptionWithCategory | undefined {
  return db
    .prepare(SELECT_WITH_CATEGORY + " WHERE s.id = ?")
    .get(id) as SubscriptionWithCategory | undefined;
}

export function createSubscription(input: SubscriptionInput): Subscription {
  const info = db
    .prepare(
      `INSERT INTO subscriptions
       (name, amount, currency, period, next_charge_date, category_id, note)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      input.name,
      input.amount,
      input.currency,
      input.period,
      input.next_charge_date,
      input.category_id,
      input.note,
    );
  return db
    .prepare("SELECT * FROM subscriptions WHERE id = ?")
    .get(Number(info.lastInsertRowid)) as Subscription;
}

export function updateSubscription(id: number, input: SubscriptionInput): Subscription {
  db.prepare(
    `UPDATE subscriptions SET
      name = ?, amount = ?, currency = ?, period = ?,
      next_charge_date = ?, category_id = ?, note = ?,
      updated_at = datetime('now')
     WHERE id = ?`,
  ).run(
    input.name,
    input.amount,
    input.currency,
    input.period,
    input.next_charge_date,
    input.category_id,
    input.note,
    id,
  );
  return db.prepare("SELECT * FROM subscriptions WHERE id = ?").get(id) as Subscription;
}

export function setStatus(id: number, status: Status): void {
  db.prepare(
    "UPDATE subscriptions SET status = ?, updated_at = datetime('now') WHERE id = ?",
  ).run(status, id);
}

export function setNextChargeDate(id: number, date: string): void {
  db.prepare(
    "UPDATE subscriptions SET next_charge_date = ?, updated_at = datetime('now') WHERE id = ?",
  ).run(date, id);
}

export function deleteSubscription(id: number): void {
  db.prepare("DELETE FROM subscriptions WHERE id = ?").run(id);
}
