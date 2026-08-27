import { supabase } from "@/lib/supabase";
import TestimonialManager from "@/components/admin/TestimonialManager";

export const revalidate = 0;

export default async function TestimonialsPage() {
  const { data: testimonials } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Testimonials Management</h1>
      </div>
      <div className="bg-white shadow sm:rounded-lg p-6">
        <TestimonialManager initialTestimonials={testimonials || []} />
      </div>
    </div>
  );
}
