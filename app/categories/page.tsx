import { listCategories } from "@/lib/repos/categories";
import { CategoryForm } from "@/components/CategoryForm";
import { CategoryRow } from "@/components/CategoryRow";
import { createCategoryAction } from "./actions";

export const dynamic = "force-dynamic";

export default function CategoriesPage() {
  const categories = listCategories();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Категории</h1>
      <div className="card">
        <CategoryForm submitLabel="Добавить" action={createCategoryAction} />
      </div>
      {categories.length === 0 ? (
        <div className="card text-neutral-500">Пока нет категорий.</div>
      ) : (
        <ul className="space-y-2">
          {categories.map((c) => (
            <CategoryRow key={c.id} category={c} />
          ))}
        </ul>
      )}
    </div>
  );
}
