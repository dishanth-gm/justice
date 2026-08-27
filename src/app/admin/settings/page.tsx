import { supabase } from "@/lib/supabase";
import SettingsForm from "@/components/admin/SettingsForm";

export const revalidate = 0;

export default async function SettingsPage() {
  const { data: settings } = await supabase.from("settings").select("*");
  
  const settingsMap = settings?.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, any>);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Website Settings</h1>
      <div className="bg-white shadow sm:rounded-lg p-6">
        <SettingsForm initialSettings={settingsMap || {}} />
      </div>
    </div>
  );
}
