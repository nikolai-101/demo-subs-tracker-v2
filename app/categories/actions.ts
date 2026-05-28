"use server";

import { revalidatePath } from "next/cache";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/lib/repos/categories";
import { categorySchema } from "@/lib/validation";

function parse(formData: FormData) {
  return categorySchema.parse(Object.fromEntries(formData.entries()));
}

function refresh() {
  revalidatePath("/categories");
  revalidatePath("/subscriptions");
  revalidatePath("/");
}

export async function createCategoryAction(formData: FormData) {
  const data = parse(formData);
  createCategory(data);
  refresh();
}

export async function updateCategoryAction(id: number, formData: FormData) {
  const data = parse(formData);
  updateCategory(id, data);
  refresh();
}

export async function deleteCategoryAction(id: number) {
  deleteCategory(id);
  refresh();
}
