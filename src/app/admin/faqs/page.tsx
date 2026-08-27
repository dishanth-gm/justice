import { supabase } from "@/lib/supabase";
import FAQManager from "@/components/admin/FAQManager";

export const revalidate = 0;

export default async function FAQsPage() {
  const { data: faqs } = await supabase.from("faqs").select("*").order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">FAQ Management</h1>
      </div>
      <div className="bg-white shadow sm:rounded-lg p-6">
        <FAQManager initialFAQs={faqs || []} />
      </div>
    </div>
  );
}
