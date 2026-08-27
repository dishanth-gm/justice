"use client";

import { useState } from "react";
import { createFAQ, updateFAQ, deleteFAQ } from "@/app/actions";
import { Plus, Edit2, Trash2 } from "lucide-react";

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

export default function FAQManager({ initialFAQs }: { initialFAQs: FAQ[] }) {
  const [faqs, setFAQs] = useState<FAQ[]>(initialFAQs);
  const [isEditing, setIsEditing] = useState(false);
  const [currentFAQ, setCurrentFAQ] = useState<Partial<FAQ>>({});
  const [loading, setLoading] = useState(false);

  const handleEdit = (f: FAQ) => {
    setCurrentFAQ(f);
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;
    try {
      await deleteFAQ(id);
      setFAQs(faqs.filter((f) => f.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete FAQ");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (currentFAQ.id) {
        await updateFAQ(currentFAQ.id, currentFAQ);
        setFAQs(faqs.map(f => f.id === currentFAQ.id ? currentFAQ as FAQ : f));
      } else {
        await createFAQ(currentFAQ as { question: string; answer: string; });
        window.location.reload(); 
      }
      setIsEditing(false);
      setCurrentFAQ({});
    } catch (err) {
      console.error(err);
      alert("Failed to save FAQ");
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
                setCurrentFAQ({});
                setIsEditing(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-900 hover:bg-blue-800"
            >
              <Plus className="mr-2 h-4 w-4" /> Add FAQ
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Answer</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {faqs.map((f) => (
                  <tr key={f.id}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs truncate">
                      {f.question}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">
                      {f.answer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleEdit(f)} className="text-blue-600 hover:text-blue-900 mr-4">
                        <Edit2 className="h-4 w-4 inline" />
                      </button>
                      <button onClick={() => handleDelete(f.id)} className="text-red-600 hover:text-red-900">
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
            <label className="block text-sm font-medium text-gray-700">Question</label>
            <input
              type="text"
              required
              value={currentFAQ.question || ""}
              onChange={(e) => setCurrentFAQ({ ...currentFAQ, question: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Answer</label>
            <textarea
              required
              rows={4}
              value={currentFAQ.answer || ""}
              onChange={(e) => setCurrentFAQ({ ...currentFAQ, answer: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
            />
          </div>
          
          <div className="flex justify-end space-x-3 mt-4">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setCurrentFAQ({});
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
