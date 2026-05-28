import { db } from "@/lib/db";
import type { Category } from "@/lib/types";

export function listCategories(): Category[] {
  return db
    .prepare("SELECT id, name, color FROM categories ORDER BY name COLLATE NOCASE")
    .all() as Category[];
}

export function getCategory(id: number): Category | undefined {
  return db
    .prepare("SELECT id, name, color FROM categories WHERE id = ?")
    .get(id) as Category | undefined;
}

export function createCategory(input: { name: string; color: string | null }): Category {
  const info = db
    .prepare("INSERT INTO categories (name, color) VALUES (?, ?)")
    .run(input.name, input.color);
  return getCategory(Number(info.lastInsertRowid))!;
}

export function updateCategory(
  id: number,
  input: { name: string; color: string | null },
): Category {
  db.prepare("UPDATE categories SET name = ?, color = ? WHERE id = ?").run(
    input.name,
    input.color,
    id,
  );
  return getCategory(id)!;
}

export function deleteCategory(id: number): void {
  db.prepare("DELETE FROM categories WHERE id = ?").run(id);
}
