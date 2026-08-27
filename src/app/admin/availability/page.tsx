import { supabase } from "@/lib/supabase";
import AvailabilityManager from "@/components/admin/AvailabilityManager";

export const revalidate = 0;

export default async function AvailabilityPage() {
  const { data: rules } = await supabase.from("availability_rules").select("*").order("day_of_week", { ascending: true });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Availability Management</h1>
      </div>
      <div className="bg-white shadow sm:rounded-lg p-6">
        <AvailabilityManager initialRules={rules || []} />
      </div>
    </div>
  );
}
