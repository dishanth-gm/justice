"use client";

import { useState } from "react";
import { createAvailabilityRule, deleteAvailabilityRule } from "@/app/actions";
import { Trash2, Plus } from "lucide-react";

interface Rule {
  id: number;
  day_of_week: number | null;
  specific_date: string | null;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function AvailabilityManager({ initialRules }: { initialRules: Rule[] }) {
  const [rules, setRules] = useState<Rule[]>(initialRules);
  const [loading, setLoading] = useState(false);
  const [newRule, setNewRule] = useState<{ type: "weekly" | "specific", day_of_week?: number, specific_date?: string, start_time: string, end_time: string, is_available: boolean }>({
    type: "weekly",
    day_of_week: 1,
    start_time: "09:00",
    end_time: "17:00",
    is_available: true,
  });

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this rule?")) return;
    try {
      await deleteAvailabilityRule(id);
      setRules(rules.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete rule");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: any = {
        start_time: newRule.start_time,
        end_time: newRule.end_time,
        is_available: newRule.is_available,
      };

      if (newRule.type === "weekly") {
        payload.day_of_week = newRule.day_of_week;
      } else {
        if (!newRule.specific_date) {
          alert("Please select a date.");
          setLoading(false);
          return;
        }
        payload.specific_date = newRule.specific_date;
      }

      await createAvailabilityRule(payload);
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to create rule");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Rule</h3>
        <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-4 rounded-md border">
          <div>
            <label className="block text-sm font-medium text-gray-700">Rule Type</label>
            <select
              value={newRule.type}
              onChange={(e) => setNewRule({ ...newRule, type: e.target.value as "weekly" | "specific" })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
            >
              <option value="weekly">Weekly Recurring</option>
              <option value="specific">Specific Date Override</option>
            </select>
          </div>

          {newRule.type === "weekly" ? (
            <div>
              <label className="block text-sm font-medium text-gray-700">Day of Week</label>
              <select
                value={newRule.day_of_week}
                onChange={(e) => setNewRule({ ...newRule, day_of_week: parseInt(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
              >
                {daysOfWeek.map((day, idx) => (
                  <option key={idx} value={idx}>{day}</option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700">Specific Date</label>
              <input
                type="date"
                required
                value={newRule.specific_date || ""}
                onChange={(e) => setNewRule({ ...newRule, specific_date: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Time</label>
              <input
                type="time"
                required
                value={newRule.start_time}
                onChange={(e) => setNewRule({ ...newRule, start_time: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Time</label>
              <input
                type="time"
                required
                value={newRule.end_time}
                onChange={(e) => setNewRule({ ...newRule, end_time: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="is_available"
              type="checkbox"
              checked={newRule.is_available}
              onChange={(e) => setNewRule({ ...newRule, is_available: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="is_available" className="ml-2 block text-sm text-gray-900">
              Is Available (Uncheck to mark as unavailable/blocked)
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-900 hover:bg-blue-800 focus:outline-none disabled:opacity-50"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Rule
          </button>
        </form>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Current Rules</h3>
        <div className="overflow-hidden border border-gray-200 rounded-md">
          <ul className="divide-y divide-gray-200">
            {rules.map((rule) => (
              <li key={rule.id} className="p-4 bg-white hover:bg-gray-50 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {rule.day_of_week !== null 
                      ? `Every ${daysOfWeek[rule.day_of_week]}`
                      : `Date: ${rule.specific_date}`}
                  </p>
                  <p className="text-sm text-gray-500">
                    {rule.start_time.substring(0, 5)} - {rule.end_time.substring(0, 5)}
                    <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${rule.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {rule.is_available ? 'Available' : 'Blocked'}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(rule.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </li>
            ))}
            {rules.length === 0 && (
              <li className="p-4 text-center text-sm text-gray-500">No availability rules defined.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
