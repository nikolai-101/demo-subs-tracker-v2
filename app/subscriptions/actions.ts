"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createSubscription,
  deleteSubscription,
  getSubscription,
  setNextChargeDate,
  setStatus,
  updateSubscription,
} from "@/lib/repos/subscriptions";
import { createPaymentEvent } from "@/lib/repos/events";
import { advanceChargeDate, todayISO } from "@/lib/domain/next-date";
import { subscriptionSchema } from "@/lib/validation";

function parseForm(formData: FormData) {
  const obj = Object.fromEntries(formData.entries());
  return subscriptionSchema.parse(obj);
}

function refreshAll() {
  revalidatePath("/");
  revalidatePath("/subscriptions");
}

export async function createSubscriptionAction(formData: FormData) {
  const data = parseForm(formData);
  createSubscription(data);
  refreshAll();
  redirect("/subscriptions");
}

export async function updateSubscriptionAction(id: number, formData: FormData) {
  const data = parseForm(formData);
  updateSubscription(id, data);
  refreshAll();
  redirect("/subscriptions");
}

export async function markChargedAction(id: number) {
  const sub = getSubscription(id);
  if (!sub) return;
  createPaymentEvent({
    subscription_id: id,
    amount: sub.amount,
    currency: sub.currency,
    charged_at: todayISO(),
  });
  setNextChargeDate(id, advanceChargeDate(sub.next_charge_date, sub.period));
  refreshAll();
}

export async function cancelSubscriptionAction(id: number) {
  setStatus(id, "cancelled");
  refreshAll();
}

export async function restoreSubscriptionAction(id: number) {
  setStatus(id, "active");
  refreshAll();
}

export async function deleteSubscriptionAction(id: number) {
  deleteSubscription(id);
  refreshAll();
}
