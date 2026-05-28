"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import {
  subscriptionSchema,
  type SubscriptionFormValues,
} from "@/lib/validation";
import type { Category, SubscriptionWithCategory } from "@/lib/types";

type Action = (formData: FormData) => Promise<void>;

interface Props {
  categories: Category[];
  initial?: SubscriptionWithCategory;
  action: Action;
  submitLabel: string;
}

export function SubscriptionForm({ categories, initial, action, submitLabel }: Props) {
  const [pending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: initial
      ? {
          name: initial.name,
          amount: initial.amount,
          currency: initial.currency,
          period: initial.period,
          next_charge_date: initial.next_charge_date,
          category_id: initial.category_id ?? "",
          note: initial.note ?? "",
        }
      : {
          name: "",
          amount: undefined as unknown as number,
          currency: "RUB",
          period: "monthly",
          next_charge_date: new Date().toISOString().slice(0, 10),
          category_id: "",
          note: "",
        },
  });

  const onSubmit = handleSubmit((values) => {
    const fd = new FormData();
    fd.set("name", values.name);
    fd.set("amount", String(values.amount));
    fd.set("currency", values.currency);
    fd.set("period", values.period);
    fd.set("next_charge_date", values.next_charge_date);
    fd.set("category_id", values.category_id == null ? "" : String(values.category_id));
    fd.set("note", values.note ?? "");
    startTransition(() => action(fd));
  });

  return (
    <form onSubmit={onSubmit} className="card space-y-4">
      <div>
        <label className="label">Название</label>
        <input className="input" {...register("name")} placeholder="Netflix" />
        {errors.name && <div className="error">{errors.name.message}</div>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Сумма</label>
          <input
            className="input"
            type="number"
            step="0.01"
            min="0"
            {...register("amount")}
          />
          {errors.amount && <div className="error">{errors.amount.message}</div>}
        </div>
        <div>
          <label className="label">Валюта</label>
          <input className="input uppercase" maxLength={3} {...register("currency")} />
          {errors.currency && <div className="error">{errors.currency.message}</div>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Период</label>
          <select className="input" {...register("period")}>
            <option value="monthly">Ежемесячно</option>
            <option value="yearly">Ежегодно</option>
          </select>
        </div>
        <div>
          <label className="label">Дата следующего списания</label>
          <input className="input" type="date" {...register("next_charge_date")} />
          {errors.next_charge_date && (
            <div className="error">{errors.next_charge_date.message}</div>
          )}
        </div>
      </div>
      <div>
        <label className="label">Категория</label>
        <select className="input" {...register("category_id")}>
          <option value="">— без категории —</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="label">Заметка</label>
        <textarea className="input" rows={2} {...register("note")} />
      </div>
      <div className="flex justify-end">
        <button type="submit" className="btn-primary" disabled={pending}>
          {pending ? "Сохраняем..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
