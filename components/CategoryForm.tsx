"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { categorySchema, type CategoryFormValues } from "@/lib/validation";
import type { Category } from "@/lib/types";

interface Props {
  initial?: Category;
  action: (formData: FormData) => Promise<void>;
  onDone?: () => void;
  submitLabel: string;
}

export function CategoryForm({ initial, action, onDone, submitLabel }: Props) {
  const [pending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initial?.name ?? "",
      color: initial?.color ?? "",
    },
  });

  const onSubmit = handleSubmit((values) => {
    const fd = new FormData();
    fd.set("name", values.name);
    fd.set("color", values.color ?? "");
    startTransition(async () => {
      await action(fd);
      if (!initial) reset({ name: "", color: "" });
      onDone?.();
    });
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-wrap items-end gap-3">
      <div className="grow">
        <label className="label">Название</label>
        <input className="input" {...register("name")} placeholder="Развлечения" />
        {errors.name && <div className="error">{errors.name.message}</div>}
      </div>
      <div>
        <label className="label">Цвет</label>
        <input className="input" type="color" {...register("color")} />
        {errors.color && <div className="error">{errors.color.message}</div>}
      </div>
      <button type="submit" className="btn-primary" disabled={pending}>
        {pending ? "..." : submitLabel}
      </button>
    </form>
  );
}
