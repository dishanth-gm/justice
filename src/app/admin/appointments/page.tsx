import { supabase } from "@/lib/supabase";
import AppointmentManager from "@/components/admin/AppointmentManager";

export const revalidate = 0;

export default async function AppointmentsPage() {
  // Fetch appointments and join with services (if foreign key allows)
  // Our schema is `service_id INTEGER REFERENCES services(id)`
  const { data: appointments } = await supabase
    .from("appointments")
    .select(`
      *,
      services ( title )
    `)
    .order("date", { ascending: false })
    .order("time_slot", { ascending: true });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Appointments Management</h1>
      </div>
      <div className="bg-white shadow sm:rounded-lg p-6">
        <AppointmentManager initialAppointments={appointments || []} />
      </div>
    </div>
  );
}
