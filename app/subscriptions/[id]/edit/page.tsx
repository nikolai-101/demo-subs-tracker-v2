import { notFound } from "next/navigation";
import { listCategories } from "@/lib/repos/categories";
import { getSubscription } from "@/lib/repos/subscriptions";
import { SubscriptionForm } from "@/components/SubscriptionForm";
import { updateSubscriptionAction } from "../../actions";

export const dynamic = "force-dynamic";

export default function EditSubscriptionPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) notFound();
  const sub = getSubscription(id);
  if (!sub) notFound();
  const categories = listCategories();
  const boundAction = updateSubscriptionAction.bind(null, id);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Редактировать подписку</h1>
      <SubscriptionForm
        categories={categories}
        initial={sub}
        action={boundAction}
        submitLabel="Сохранить"
      />
    </div>
  );
}
