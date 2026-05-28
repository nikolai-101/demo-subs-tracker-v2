import { z } from "zod";

export const subscriptionSchema = z.object({
  name: z.string().trim().min(1, "Укажите название"),
  amount: z.coerce.number().positive("Сумма должна быть положительной"),
  currency: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{3}$/, "Валюта — 3 буквы (ISO 4217)"),
  period: z.enum(["monthly", "yearly"]),
  next_charge_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Дата в формате YYYY-MM-DD"),
  category_id: z
    .union([z.coerce.number().int().positive(), z.literal(""), z.null()])
    .transform((v) => (v === "" || v === null ? null : Number(v)))
    .nullable(),
  note: z
    .string()
    .trim()
    .max(500)
    .optional()
    .transform((v) => (v && v.length ? v : null))
    .nullable(),
});

export type SubscriptionFormValues = z.input<typeof subscriptionSchema>;
export type SubscriptionParsed = z.output<typeof subscriptionSchema>;

export const categorySchema = z.object({
  name: z.string().trim().min(1, "Укажите название"),
  color: z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/, "Цвет в формате #RRGGBB")
    .optional()
    .or(z.literal(""))
    .transform((v) => (v && v.length ? v : null))
    .nullable(),
});

export type CategoryFormValues = z.input<typeof categorySchema>;
export type CategoryParsed = z.output<typeof categorySchema>;
