"use client";

import { useState, useEffect } from "react";
import { getAvailableSlots, bookAppointment } from "@/app/actions";
import { format } from "date-fns";
import { Calendar, Clock, CheckCircle2 } from "lucide-react";

interface Service {
  id: number;
  title: string;
  fee: number | null;
}

interface BookingFormProps {
  services: Service[];
}

export default function BookingForm({ services }: BookingFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service_id: "",
    date: "",
    time_slot: "",
    issue_description: "",
  });
  
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (formData.date) {
      const fetchSlots = async () => {
        setLoadingSlots(true);
        try {
          const slots = await getAvailableSlots(formData.date);
          setAvailableSlots(slots);
        } catch (err) {
          console.error("Error fetching slots:", err);
          setAvailableSlots([]);
        } finally {
          setLoadingSlots(false);
        }
      };
      fetchSlots();
    }
  }, [formData.date]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await bookAppointment({
        ...formData,
        service_id: formData.service_id ? parseInt(formData.service_id) : undefined,
      });
      setStep(4); // Success step
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (step === 4) {
    return (
      <div className="text-center py-12">
        <CheckCircle2 className="h-20 w-20 text-gold-500 mx-auto mb-6" />
        <h2 className="text-3xl font-serif font-bold text-navy-900 mb-4">Booking Confirmed!</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Thank you, {formData.name}. Your consultation is scheduled for {format(new Date(formData.date), "MMMM d, yyyy")} at {formData.time_slot}.
          We have sent a confirmation email with further details.
        </p>
        <button
          onClick={() => window.location.href = "/"}
          className="px-8 py-3 bg-navy-900 text-white text-sm uppercase tracking-widest font-medium hover:bg-navy-800 transition-colors"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 px-2">
          <span className={step >= 1 ? "text-navy-900 font-bold" : ""}>Service</span>
          <span className={step >= 2 ? "text-navy-900 font-bold" : ""}>Date & Time</span>
          <span className={step >= 3 ? "text-navy-900 font-bold" : ""}>Details</span>
        </div>
        <div className="h-2 bg-gray-200 w-full flex">
          <div className="h-full bg-gold-500 transition-all duration-300" style={{ width: `${(step / 3) * 100}%` }}></div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-sm text-sm border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
        
        {/* STEP 1: Service Selection */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-xl font-serif font-bold text-navy-900 mb-4">What do you need help with?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                className={`border p-6 cursor-pointer transition-all ${formData.service_id === "" ? "border-gold-500 bg-gold-50/30" : "border-gray-200 hover:border-gold-300"}`}
                onClick={() => setFormData({ ...formData, service_id: "" })}
              >
                <div className="font-bold text-navy-900 mb-1">General Consultation</div>
                <div className="text-sm text-gray-500">I'm not sure / Initial discussion</div>
              </div>
              {services.map((service) => (
                <div 
                  key={service.id}
                  className={`border p-6 cursor-pointer transition-all ${formData.service_id === service.id.toString() ? "border-gold-500 bg-gold-50/30 shadow-sm" : "border-gray-200 hover:border-gold-300"}`}
                  onClick={() => setFormData({ ...formData, service_id: service.id.toString() })}
                >
                  <div className="font-bold text-navy-900 mb-1">{service.title}</div>
                  {service.fee && <div className="text-sm text-gold-600 font-medium">${service.fee}</div>}
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-8">
              <button type="submit" className="px-8 py-3 bg-navy-900 text-white text-sm uppercase tracking-widest font-medium hover:bg-navy-800 transition-colors">
                Continue
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Date and Time */}
        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Calendar className="mr-2 h-4 w-4" /> Select Date
              </label>
              <input
                type="date"
                name="date"
                required
                min={today}
                value={formData.date}
                onChange={handleChange}
                className="block w-full max-w-sm rounded-none border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500 py-3 px-4 border"
              />
            </div>

            {formData.date && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4 flex items-center">
                  <Clock className="mr-2 h-4 w-4" /> Select Time Slot
                </label>
                {loadingSlots ? (
                  <div className="text-sm text-gray-500 animate-pulse">Checking availability...</div>
                ) : availableSlots.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setFormData({ ...formData, time_slot: slot })}
                        className={`py-2 px-1 text-center text-sm border transition-colors ${
                          formData.time_slot === slot
                            ? "bg-navy-900 text-white border-navy-900"
                            : "bg-white text-gray-700 border-gray-300 hover:border-navy-900"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 border border-gray-200 text-sm text-gray-600 text-center">
                    No available slots on this date. Please select another date.
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-between mt-8">
              <button type="button" onClick={prevStep} className="px-8 py-3 border border-gray-300 text-gray-700 text-sm uppercase tracking-widest font-medium hover:bg-gray-50 transition-colors">
                Back
              </button>
              <button 
                type="button" 
                onClick={nextStep}
                disabled={!formData.date || !formData.time_slot}
                className="px-8 py-3 bg-navy-900 text-white text-sm uppercase tracking-widest font-medium hover:bg-navy-800 transition-colors disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Client Details */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full rounded-none border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500 py-3 px-4 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full rounded-none border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500 py-3 px-4 border"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="block w-full rounded-none border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500 py-3 px-4 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brief Description of your legal issue</label>
              <textarea
                name="issue_description"
                rows={4}
                required
                value={formData.issue_description}
                onChange={handleChange}
                className="block w-full rounded-none border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500 py-3 px-4 border resize-none"
              ></textarea>
            </div>

            <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
              <button type="button" onClick={prevStep} className="px-8 py-3 border border-gray-300 text-gray-700 text-sm uppercase tracking-widest font-medium hover:bg-gray-50 transition-colors">
                Back
              </button>
              <button 
                type="submit" 
                disabled={submitting}
                className="px-8 py-3 bg-gold-500 text-white text-sm uppercase tracking-widest font-medium hover:bg-gold-600 transition-colors disabled:opacity-50"
              >
                {submitting ? "Processing..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
