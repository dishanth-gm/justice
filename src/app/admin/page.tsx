import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { PlusCircle, Users, CalendarCheck, Settings } from "lucide-react";

export const revalidate = 0; // Disable caching for dashboard

export default async function AdminDashboard() {
  const { count: appointmentsCount } = await supabase
    .from("appointments")
    .select("*", { count: "exact", head: true });

  const { count: enquiriesCount } = await supabase
    .from("enquiries")
    .select("*", { count: "exact", head: true });

  const { data: recentAppointments } = await supabase
    .from("appointments")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome to your Command Center</h1>
        <p className="mt-2 text-gray-600">Here you can easily manage your law firm's website. Everything is designed to be simple and straightforward.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Quick Stats */}
        <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-50 text-blue-600">
              <CalendarCheck size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Appointments</p>
              <p className="text-2xl font-bold text-gray-900">{appointmentsCount || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-50 text-green-600">
              <Users size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Enquiries</p>
              <p className="text-2xl font-bold text-gray-900">{enquiriesCount || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link href="/admin/services" className="flex items-center p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition">
            <PlusCircle className="text-blue-500 mr-3" size={20} />
            <span className="font-medium text-gray-700">Add a New Service</span>
          </Link>
          <Link href="/admin/testimonials" className="flex items-center p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition">
            <Users className="text-blue-500 mr-3" size={20} />
            <span className="font-medium text-gray-700">Manage Testimonials</span>
          </Link>
          <Link href="/admin/settings" className="flex items-center p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition">
            <Settings className="text-blue-500 mr-3" size={20} />
            <span className="font-medium text-gray-700">Update Contact Info</span>
          </Link>
        </div>
      </div>

      <div className="bg-white shadow-sm sm:rounded-xl border border-gray-100 overflow-hidden mt-8">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Appointments</h3>
          <p className="text-sm text-gray-500 mt-1">The most recent people who booked a consultation with you.</p>
        </div>
        <div className="divide-y divide-gray-100">
          {recentAppointments && recentAppointments.length > 0 ? (
            <ul className="divide-y divide-gray-100">
              {recentAppointments.map((app) => (
                <li key={app.id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-base font-semibold text-gray-900">{app.name}</p>
                      <p className="text-sm text-gray-500 mt-1">{app.email} • {app.phone}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full inline-block">{app.date}</p>
                      <p className="text-sm text-gray-500 mt-2">{app.time_slot}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-12 text-center">
              <CalendarCheck className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <p className="text-base text-gray-500 font-medium">No appointments yet.</p>
              <p className="text-sm text-gray-400 mt-1">When someone books, it will show up here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
