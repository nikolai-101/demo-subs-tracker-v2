"use client";

import { useTransition } from "react";
import { markChargedAction } from "@/app/subscriptions/actions";

export function ChargedButton({ id }: { id: number }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      className="btn-primary"
      disabled={pending}
      onClick={() => startTransition(() => markChargedAction(id))}
    >
      {pending ? "..." : "Списалось"}
    </button>
  );
}
