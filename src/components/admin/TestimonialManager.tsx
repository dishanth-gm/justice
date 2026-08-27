"use client";

import { useState } from "react";
import { createTestimonial, updateTestimonial, deleteTestimonial } from "@/app/actions";
import { Plus, Edit2, Trash2 } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  designation: string | null;
  rating: number | null;
  testimonial: string;
}

export default function TestimonialManager({ initialTestimonials }: { initialTestimonials: Testimonial[] }) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState<Partial<Testimonial>>({});
  const [loading, setLoading] = useState(false);

  const handleEdit = (t: Testimonial) => {
    setCurrentTestimonial(t);
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      await deleteTestimonial(id);
      setTestimonials(testimonials.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete testimonial");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (currentTestimonial.id) {
        await updateTestimonial(currentTestimonial.id, currentTestimonial);
        setTestimonials(testimonials.map(t => t.id === currentTestimonial.id ? currentTestimonial as Testimonial : t));
      } else {
        await createTestimonial(currentTestimonial as { name: string; designation?: string; rating?: number; testimonial: string; });
        window.location.reload(); 
      }
      setIsEditing(false);
      setCurrentTestimonial({});
    } catch (err) {
      console.error(err);
      alert("Failed to save testimonial");
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
                setCurrentTestimonial({});
                setIsEditing(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-900 hover:bg-blue-800"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Testimonial
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Testimonial</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {testimonials.map((t) => (
                  <tr key={t.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {t.name} <br/>
                      <span className="text-gray-500 text-xs">{t.designation}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">
                      {t.testimonial}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleEdit(t)} className="text-blue-600 hover:text-blue-900 mr-4">
                        <Edit2 className="h-4 w-4 inline" />
                      </button>
                      <button onClick={() => handleDelete(t.id)} className="text-red-600 hover:text-red-900">
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
            <label className="block text-sm font-medium text-gray-700">Client Name</label>
            <input
              type="text"
              required
              value={currentTestimonial.name || ""}
              onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Designation (Optional)</label>
            <input
              type="text"
              value={currentTestimonial.designation || ""}
              onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, designation: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Rating (1-5)</label>
            <input
              type="number"
              min="1"
              max="5"
              value={currentTestimonial.rating || ""}
              onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, rating: parseInt(e.target.value) || undefined })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Testimonial</label>
            <textarea
              required
              rows={4}
              value={currentTestimonial.testimonial || ""}
              onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, testimonial: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
            />
          </div>
          
          <div className="flex justify-end space-x-3 mt-4">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setCurrentTestimonial({});
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
