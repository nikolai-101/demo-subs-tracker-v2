"use client";

import Link from "next/link";
import { useTransition } from "react";
import {
  cancelSubscriptionAction,
  deleteSubscriptionAction,
  markChargedAction,
  restoreSubscriptionAction,
} from "@/app/subscriptions/actions";

export function RowActions({ id, status }: { id: number; status: "active" | "cancelled" }) {
  const [pending, startTransition] = useTransition();
  const run = (fn: () => Promise<void>) => startTransition(fn);

  return (
    <div className="flex flex-wrap items-center gap-1">
      {status === "active" && (
        <button
          className="btn-primary"
          disabled={pending}
          onClick={() => run(() => markChargedAction(id))}
        >
          Списалось
        </button>
      )}
      <Link href={`/subscriptions/${id}/edit`} className="btn-secondary">
        Редактировать
      </Link>
      {status === "active" ? (
        <button
          className="btn-ghost"
          disabled={pending}
          onClick={() => run(() => cancelSubscriptionAction(id))}
        >
          Отменить
        </button>
      ) : (
        <button
          className="btn-ghost"
          disabled={pending}
          onClick={() => run(() => restoreSubscriptionAction(id))}
        >
          Восстановить
        </button>
      )}
      <button
        className="btn-danger"
        disabled={pending}
        onClick={() => {
          if (confirm("Удалить подписку и всю историю списаний?")) {
            run(() => deleteSubscriptionAction(id));
          }
        }}
      >
        Удалить
      </button>
    </div>
  );
}
