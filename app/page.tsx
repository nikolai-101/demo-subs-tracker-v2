import Link from "next/link";
import { listSubscriptions } from "@/lib/repos/subscriptions";
import { monthlyTotalsByCurrency } from "@/lib/domain/normalize";
import { upcomingWithin, overdue, formatRelativeDay } from "@/lib/domain/dashboard";
import { formatMoney, formatDate } from "@/lib/format";
import { ChargedButton } from "@/components/ChargedButton";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const subs = listSubscriptions({ status: "active" });
  const totals = monthlyTotalsByCurrency(subs);
  const today = new Date();
  const upcoming = upcomingWithin(subs, today, 7);
  const overdueItems = overdue(subs, today);

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-neutral-500">
          В месяц
        </h2>
        <div className="card">
          {totals.length === 0 ? (
            <div className="text-neutral-500">
              Активных подписок нет.{" "}
              <Link className="underline" href="/subscriptions/new">
                Добавить подписку
              </Link>
              .
            </div>
          ) : (
            <div className="space-y-2">
              {totals.map((t) => (
                <div key={t.currency} className="flex items-baseline gap-3">
                  <span className="text-4xl font-semibold tabular-nums">
                    {formatMoney(t.total, t.currency)}
                  </span>
                  <span className="text-sm text-neutral-500">/ месяц</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {overdueItems.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-red-600">
            Просрочено
          </h2>
          <div className="card space-y-2">
            {overdueItems.map(({ subscription: s, daysFromToday }) => (
              <div
                key={s.id}
                className="flex items-center justify-between gap-3 rounded-lg bg-red-50 px-3 py-2 dark:bg-red-950/30"
              >
                <div>
                  <div className="font-medium">{s.name}</div>
                  <div className="text-xs text-neutral-500">
                    {formatDate(s.next_charge_date)} · {formatRelativeDay(daysFromToday)}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="tabular-nums">{formatMoney(s.amount, s.currency)}</div>
                  <ChargedButton id={s.id} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-neutral-500">
          Ближайшие 7 дней
        </h2>
        <div className="card">
          {upcoming.length === 0 ? (
            <div className="text-neutral-500">На ближайшую неделю списаний нет.</div>
          ) : (
            <ul className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {upcoming.map(({ subscription: s, daysFromToday }) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div>
                    <div className="font-medium">{s.name}</div>
                    <div className="text-xs text-neutral-500">
                      {formatDate(s.next_charge_date)} · {formatRelativeDay(daysFromToday)}
                      {s.category_name ? ` · ${s.category_name}` : ""}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="tabular-nums">{formatMoney(s.amount, s.currency)}</div>
                    <ChargedButton id={s.id} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
