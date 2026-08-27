"use client";

import { useState } from "react";
import { createExperience, updateExperience, deleteExperience } from "@/app/actions";
import { Plus, Edit2, Trash2 } from "lucide-react";

interface Experience {
  id: number;
  title: string;
  company: string;
  start_date: string;
  end_date: string | null;
  description: string | null;
}

export default function ExperienceManager({ initialExperience }: { initialExperience: Experience[] }) {
  const [experience, setExperience] = useState<Experience[]>(initialExperience);
  const [isEditing, setIsEditing] = useState(false);
  const [currentExp, setCurrentExp] = useState<Partial<Experience>>({});
  const [loading, setLoading] = useState(false);

  const handleEdit = (exp: Experience) => {
    setCurrentExp(exp);
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this experience?")) return;
    try {
      await deleteExperience(id);
      setExperience(experience.filter((e) => e.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete experience");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (currentExp.id) {
        await updateExperience(currentExp.id, currentExp);
        setExperience(experience.map(e => e.id === currentExp.id ? currentExp as Experience : e));
      } else {
        await createExperience(currentExp as { title: string; company: string; start_date: string; end_date?: string; description?: string; });
        window.location.reload(); 
      }
      setIsEditing(false);
      setCurrentExp({});
    } catch (err) {
      console.error(err);
      alert("Failed to save experience");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {!isEditing ? (
        <div>
          <div className="mb-4 flex justify-end">
            <button
              onClick={() => {
                setCurrentExp({});
                setIsEditing(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-900 hover:bg-blue-800"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Experience
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role & Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {experience.map((exp) => (
                  <tr key={exp.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {exp.title} <span className="font-normal text-gray-500">at {exp.company}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {exp.start_date} - {exp.end_date || "Present"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleEdit(exp)} className="text-blue-600 hover:text-blue-900 mr-4">
                        <Edit2 className="h-4 w-4 inline" />
                      </button>
                      <button onClick={() => handleDelete(exp.id)} className="text-red-600 hover:text-red-900">
                        <Trash2 className="h-4 w-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700">Role/Title</label>
            <input
              type="text"
              required
              value={currentExp.title || ""}
              onChange={(e) => setCurrentExp({ ...currentExp, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Company/Institution</label>
            <input
              type="text"
              required
              value={currentExp.company || ""}
              onChange={(e) => setCurrentExp({ ...currentExp, company: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="text"
                placeholder="YYYY-MM or YYYY"
                required
                value={currentExp.start_date || ""}
                onChange={(e) => setCurrentExp({ ...currentExp, start_date: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="text"
                placeholder="Leave blank if present"
                value={currentExp.end_date || ""}
                onChange={(e) => setCurrentExp({ ...currentExp, end_date: e.target.value || null })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              rows={4}
              value={currentExp.description || ""}
              onChange={(e) => setCurrentExp({ ...currentExp, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
            />
          </div>
          
          <div className="flex justify-end space-x-3 mt-4">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setCurrentExp({});
              }}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-900 hover:bg-blue-800 focus:outline-none disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
