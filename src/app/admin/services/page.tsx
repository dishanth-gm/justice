import { supabase } from "@/lib/supabase";
import ServiceManager from "@/components/admin/ServiceManager";

export const revalidate = 0;

export default async function ServicesPage() {
  const { data: services } = await supabase.from("services").select("*").order("created_at", { ascending: true });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Services Management</h1>
      </div>
      <div className="bg-white shadow sm:rounded-lg p-6">
        <ServiceManager initialServices={services || []} />
      </div>
    </div>
  );
}
