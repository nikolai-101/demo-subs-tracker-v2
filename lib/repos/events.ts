import { db } from "@/lib/db";
import type { PaymentEvent } from "@/lib/types";

export function createPaymentEvent(input: {
  subscription_id: number;
  amount: number;
  currency: string;
  charged_at: string;
}): PaymentEvent {
  const info = db
    .prepare(
      `INSERT INTO payment_events (subscription_id, amount, currency, charged_at)
       VALUES (?, ?, ?, ?)`,
    )
    .run(input.subscription_id, input.amount, input.currency, input.charged_at);
  return db
    .prepare("SELECT * FROM payment_events WHERE id = ?")
    .get(Number(info.lastInsertRowid)) as PaymentEvent;
}

export function listEventsForSubscription(subscriptionId: number): PaymentEvent[] {
  return db
    .prepare(
      "SELECT * FROM payment_events WHERE subscription_id = ? ORDER BY charged_at DESC",
    )
    .all(subscriptionId) as PaymentEvent[];
}
