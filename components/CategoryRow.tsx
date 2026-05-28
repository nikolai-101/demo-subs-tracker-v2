"use client";

import { useState, useTransition } from "react";
import type { Category } from "@/lib/types";
import { CategoryForm } from "./CategoryForm";
import {
  deleteCategoryAction,
  updateCategoryAction,
} from "@/app/categories/actions";

export function CategoryRow({ category }: { category: Category }) {
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();

  if (editing) {
    return (
      <li className="card">
        <CategoryForm
          initial={category}
          submitLabel="Сохранить"
          action={updateCategoryAction.bind(null, category.id)}
          onDone={() => setEditing(false)}
        />
        <button
          className="btn-ghost mt-2"
          type="button"
          onClick={() => setEditing(false)}
        >
          Отмена
        </button>
      </li>
    );
  }

  return (
    <li className="card flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <span
          className="h-4 w-4 rounded-full border"
          style={{ backgroundColor: category.color ?? "transparent" }}
        />
        <div className="font-medium">{category.name}</div>
      </div>
      <div className="flex gap-1">
        <button className="btn-secondary" type="button" onClick={() => setEditing(true)}>
          Изменить
        </button>
        <button
          className="btn-danger"
          type="button"
          disabled={pending}
          onClick={() => {
            if (confirm(`Удалить категорию "${category.name}"?`)) {
              startTransition(() => deleteCategoryAction(category.id));
            }
          }}
        >
          Удалить
        </button>
      </div>
    </li>
  );
}
