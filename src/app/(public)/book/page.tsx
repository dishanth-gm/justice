import { supabase } from "@/lib/supabase";
import BookingForm from "@/components/public/BookingForm";

export const revalidate = 0;

export default async function BookAppointmentPage() {
  const { data: services } = await supabase.from("services").select("id, title, fee");

  return (
    <div className="pt-32 pb-24 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-navy-900 mb-4">Book a Consultation</h1>
          <p className="text-gray-600 font-light">
            Schedule a time to discuss your legal matter with our experienced team.
          </p>
        </div>

        <div className="bg-white shadow-xl p-8 md:p-12">
          <BookingForm services={services || []} />
        </div>
      </div>
    </div>
  );
}
