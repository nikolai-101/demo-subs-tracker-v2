import Link from "next/link";
import { listCategories } from "@/lib/repos/categories";
import { listSubscriptions, type ListOptions } from "@/lib/repos/subscriptions";
import { formatDate, formatMoney } from "@/lib/format";
import { monthlyEquivalent } from "@/lib/domain/normalize";
import { RowActions } from "@/components/RowActions";

export const dynamic = "force-dynamic";

type Search = {
  status?: string;
  category?: string;
  sort?: string;
  order?: string;
};

export default function SubscriptionsPage({ searchParams }: { searchParams: Search }) {
  const status =
    searchParams.status === "all" || searchParams.status === "cancelled"
      ? (searchParams.status as ListOptions["status"])
      : "active";

  const categoryParam = searchParams.category;
  let category: ListOptions["categoryId"] = "all";
  if (categoryParam === "none") category = null;
  else if (categoryParam && !Number.isNaN(Number(categoryParam)))
    category = Number(categoryParam);

  const sort = (["next_charge_date", "amount", "name"].includes(searchParams.sort ?? "")
    ? searchParams.sort
    : "next_charge_date") as ListOptions["sort"];
  const order = searchParams.order === "desc" ? "desc" : "asc";

  const subs = listSubscriptions({ status, categoryId: category, sort, order });
  const categories = listCategories();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Подписки</h1>
        <Link href="/subscriptions/new" className="btn-primary">
          + Добавить
        </Link>
      </div>

      <form className="card flex flex-wrap items-end gap-3" method="get">
        <div>
          <label className="label">Статус</label>
          <select name="status" defaultValue={status} className="input">
            <option value="active">Активные</option>
            <option value="cancelled">Отменённые</option>
            <option value="all">Все</option>
          </select>
        </div>
        <div>
          <label className="label">Категория</label>
          <select name="category" defaultValue={categoryParam ?? "all"} className="input">
            <option value="all">Все</option>
            <option value="none">Без категории</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Сортировка</label>
          <select name="sort" defaultValue={sort} className="input">
            <option value="next_charge_date">По дате</option>
            <option value="amount">По сумме</option>
            <option value="name">По названию</option>
          </select>
        </div>
        <div>
          <label className="label">Порядок</label>
          <select name="order" defaultValue={order} className="input">
            <option value="asc">↑</option>
            <option value="desc">↓</option>
          </select>
        </div>
        <button type="submit" className="btn-secondary">
          Применить
        </button>
      </form>

      {subs.length === 0 ? (
        <div className="card text-neutral-500">
          Пока ничего нет.{" "}
          <Link href="/subscriptions/new" className="underline">
            Добавьте первую подписку
          </Link>
          .
        </div>
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="subs">
            <thead>
              <tr>
                <th>Название</th>
                <th>Категория</th>
                <th>Сумма</th>
                <th>Период</th>
                <th>В месяц</th>
                <th>След. списание</th>
                <th>Статус</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {subs.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div className="font-medium">{s.name}</div>
                    {s.note && (
                      <div className="text-xs text-neutral-500">{s.note}</div>
                    )}
                  </td>
                  <td>
                    {s.category_name ? (
                      <span
                        className="inline-flex items-center gap-2 rounded-full px-2 py-0.5 text-xs"
                        style={{
                          backgroundColor: (s.category_color ?? "#999") + "22",
                          color: s.category_color ?? undefined,
                        }}
                      >
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: s.category_color ?? "#999" }}
                        />
                        {s.category_name}
                      </span>
                    ) : (
                      <span className="text-neutral-400">—</span>
                    )}
                  </td>
                  <td className="tabular-nums">{formatMoney(s.amount, s.currency)}</td>
                  <td>{s.period === "monthly" ? "месяц" : "год"}</td>
                  <td className="tabular-nums text-neutral-500">
                    {formatMoney(monthlyEquivalent(s.amount, s.period), s.currency)}
                  </td>
                  <td>{formatDate(s.next_charge_date)}</td>
                  <td>
                    {s.status === "active" ? (
                      <span className="text-green-600">активна</span>
                    ) : (
                      <span className="text-neutral-500">отменена</span>
                    )}
                  </td>
                  <td>
                    <RowActions id={s.id} status={s.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
