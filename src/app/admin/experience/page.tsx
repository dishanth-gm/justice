import { supabase } from "@/lib/supabase";
import ExperienceManager from "@/components/admin/ExperienceManager";

export const revalidate = 0;

export default async function ExperiencePage() {
  const { data: experience } = await supabase.from("experience").select("*").order("start_date", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Experience Management</h1>
      </div>
      <div className="bg-white shadow sm:rounded-lg p-6">
        <ExperienceManager initialExperience={experience || []} />
      </div>
    </div>
  );
}
