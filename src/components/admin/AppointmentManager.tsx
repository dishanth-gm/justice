"use client";

import { useState } from "react";
import { updateAppointmentStatus } from "@/app/actions";
import { Check, X } from "lucide-react";

interface Appointment {
  id: number;
  name: string;
  email: string;
  phone: string;
  service_id: number | null;
  date: string;
  time_slot: string;
  issue_description: string | null;
  additional_info: string | null;
  status: string;
  services?: { title: string }; // joined from supabase
}

export default function AppointmentManager({ initialAppointments }: { initialAppointments: Appointment[] }) {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const handleStatusChange = async (id: number, status: string) => {
    setLoadingId(id);
    try {
      await updateAppointmentStatus(id, status);
      setAppointments(appointments.map(a => a.id === id ? { ...a, status } : a));
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    } finally {
      setLoadingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
      case "confirmed":
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Confirmed</span>;
      case "cancelled":
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Cancelled</span>;
      default:
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client Details</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Requested</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {appointments.map((appt) => (
            <tr key={appt.id} className={appt.status === "cancelled" ? "bg-gray-50 opacity-60" : ""}>
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">{appt.name}</div>
                <div className="text-sm text-gray-500">{appt.email}</div>
                <div className="text-sm text-gray-500">{appt.phone}</div>
                {(appt.issue_description || appt.additional_info) && (
                  <div className="mt-2 text-xs text-gray-500 max-w-xs truncate" title={appt.issue_description || appt.additional_info || ""}>
                    <strong>Issue:</strong> {appt.issue_description || appt.additional_info}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{appt.date}</div>
                <div className="text-sm text-gray-500">{appt.time_slot}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {appt.services?.title || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(appt.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {loadingId === appt.id ? (
                  <span className="text-gray-400">Loading...</span>
                ) : (
                  <div className="space-x-3">
                    {appt.status !== "confirmed" && (
                      <button
                        onClick={() => handleStatusChange(appt.id, "confirmed")}
                        className="text-green-600 hover:text-green-900"
                        title="Confirm Appointment"
                      >
                        <Check className="h-5 w-5 inline" />
                      </button>
                    )}
                    {appt.status !== "cancelled" && (
                      <button
                        onClick={() => handleStatusChange(appt.id, "cancelled")}
                        className="text-red-600 hover:text-red-900"
                        title="Cancel Appointment"
                      >
                        <X className="h-5 w-5 inline" />
                      </button>
                    )}
                  </div>
                )}
              </td>
            </tr>
          ))}
          {appointments.length === 0 && (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                No appointments found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
