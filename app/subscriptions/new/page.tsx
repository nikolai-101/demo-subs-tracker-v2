import { listCategories } from "@/lib/repos/categories";
import { SubscriptionForm } from "@/components/SubscriptionForm";
import { createSubscriptionAction } from "../actions";

export const dynamic = "force-dynamic";

export default function NewSubscriptionPage() {
  const categories = listCategories();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Новая подписка</h1>
      <SubscriptionForm
        categories={categories}
        action={createSubscriptionAction}
        submitLabel="Создать"
      />
    </div>
  );
}
