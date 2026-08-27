"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

// --- Settings ---
export async function updateSetting(key: string, value: any) {
  const { error } = await supabase
    .from("settings")
    .upsert({ key, value }, { onConflict: "key" });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/settings");
  revalidatePath("/");
}

// --- Services ---
export async function createService(data: { title: string, description: string, fee?: number, icon?: string }) {
  const { error } = await supabase.from("services").insert([data]);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/services");
  revalidatePath("/");
}

export async function updateService(id: number, data: { title?: string, description?: string, fee?: number, icon?: string }) {
  const { error } = await supabase.from("services").update(data).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/services");
  revalidatePath("/");
}

export async function deleteService(id: number) {
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/services");
  revalidatePath("/");
}

// --- Experience ---
export async function createExperience(data: { title: string, company: string, start_date: string, end_date?: string, description?: string }) {
  const { error } = await supabase.from("experience").insert([data]);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/experience");
  revalidatePath("/");
}

export async function updateExperience(id: number, data: any) {
  const { error } = await supabase.from("experience").update(data).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/experience");
  revalidatePath("/");
}

export async function deleteExperience(id: number) {
  const { error } = await supabase.from("experience").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/experience");
  revalidatePath("/");
}

// --- Testimonials ---
export async function createTestimonial(data: { name: string, designation?: string, rating?: number, testimonial: string }) {
  const { error } = await supabase.from("testimonials").insert([data]);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

export async function updateTestimonial(id: number, data: any) {
  const { error } = await supabase.from("testimonials").update(data).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

export async function deleteTestimonial(id: number) {
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

// --- FAQs ---
export async function createFAQ(data: { question: string, answer: string }) {
  const { error } = await supabase.from("faqs").insert([data]);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/faqs");
  revalidatePath("/");
}

export async function updateFAQ(id: number, data: any) {
  const { error } = await supabase.from("faqs").update(data).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/faqs");
  revalidatePath("/");
}

export async function deleteFAQ(id: number) {
  const { error } = await supabase.from("faqs").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/faqs");
  revalidatePath("/");
}

// --- Enquiries ---
export async function submitEnquiry(data: { name: string, email: string, phone?: string, subject?: string, message: string }) {
  const { error } = await supabase.from("enquiries").insert([data]);
  if (error) throw new Error(error.message);
}

// --- Appointments ---
export async function getAvailableSlots(dateString: string) {
  // Parse date to get day of week (0-6, where 0 is Sunday)
  const date = new Date(dateString);
  const dayOfWeek = date.getDay();

  // 1. Get availability rules for this specific date OR this day of the week
  const { data: rules } = await supabase
    .from("availability_rules")
    .select("*")
    .or(`specific_date.eq.${dateString},and(type.eq.weekly,day_of_week.eq.${dayOfWeek})`);

  // We should fetch all rules that match the criteria. But wait, our schema doesn't have a "type" column, 
  // it uses "day_of_week IS NULL" vs "specific_date IS NOT NULL". Let me fix the query.
  // Actually, I'll just fetch all rules and filter in memory since it's a small dataset.
  const { data: allRules } = await supabase.from("availability_rules").select("*");
  
  if (!allRules) return [];

  // Find specific rule first, then fallback to weekly rule
  let applicableRule = allRules.find(r => r.specific_date === dateString);
  if (!applicableRule) {
    applicableRule = allRules.find(r => r.day_of_week === dayOfWeek);
  }

  // If no rule or marked unavailable, return empty slots
  if (!applicableRule || !applicableRule.is_available) {
    return [];
  }

  // Generate 1-hour slots from start_time to end_time
  const slots: string[] = [];
  let currentHour = parseInt(applicableRule.start_time.split(":")[0]);
  let endHour = parseInt(applicableRule.end_time.split(":")[0]);

  if (endHour <= currentHour) {
    // If end time is before start time (crosses midnight) or equal,
    // just generate slots up to 23:00 for the current day.
    endHour = 24;
  }

  while (currentHour < endHour) {
    const timeSlot = `${currentHour.toString().padStart(2, "0")}:00`;
    slots.push(timeSlot);
    currentHour++;
  }

  // 2. Get existing bookings for this date
  const { data: booked } = await supabase
    .from("appointments")
    .select("time_slot")
    .eq("date", dateString)
    .neq("status", "cancelled");

  const bookedSlots = booked?.map(b => b.time_slot.substring(0, 5)) || [];

  // 3. Filter out booked slots
  return slots.filter(slot => !bookedSlots.includes(slot));
}

export async function bookAppointment(data: { name: string, email: string, phone: string, service_id?: number, date: string, time_slot: string, issue_description?: string, additional_info?: string }) {
  // Simple check to ensure double booking is avoided (a robust implementation might use transactions)
  const { data: existing } = await supabase
    .from("appointments")
    .select("id")
    .eq("date", data.date)
    .eq("time_slot", data.time_slot)
    .neq("status", "cancelled");

  if (existing && existing.length > 0) {
    throw new Error("This slot has already been booked.");
  }

  const { error } = await supabase.from("appointments").insert([data]);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/appointments");
}

export async function updateAppointmentStatus(id: number, status: string) {
  const { error } = await supabase.from("appointments").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/appointments");
}

// --- Availability Rules ---
export async function createAvailabilityRule(data: { day_of_week?: number, specific_date?: string, start_time: string, end_time: string, is_available: boolean }) {
  const { error } = await supabase.from("availability_rules").insert([data]);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/availability");
  revalidatePath("/book");
}

export async function deleteAvailabilityRule(id: number) {
  const { error } = await supabase.from("availability_rules").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/availability");
  revalidatePath("/book");
}
