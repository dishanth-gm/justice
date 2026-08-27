import { supabase } from "@/lib/supabase";

import Hero from "@/components/public/Hero";
import AboutSection from "@/components/public/AboutSection";
import ServicesSection from "@/components/public/ServicesSection";
import ExperienceSection from "@/components/public/ExperienceSection";
import TestimonialsSection from "@/components/public/TestimonialsSection";
import FAQSection from "@/components/public/FAQSection";
import ContactSection from "@/components/public/ContactSection";

export const revalidate = 60; // Revalidate every minute

export default async function PublicPage() {
  // Fetch data in parallel
  const [
    { data: settingsData },
    { data: services },
    { data: experience },
    { data: testimonials },
    { data: faqs }
  ] = await Promise.all([
    supabase.from("settings").select("*"),
    supabase.from("services").select("*").order("created_at", { ascending: true }),
    supabase.from("experience").select("*").order("start_date", { ascending: false }),
    supabase.from("testimonials").select("*").order("created_at", { ascending: false }),
    supabase.from("faqs").select("*").order("created_at", { ascending: false })
  ]);

  const settings = settingsData?.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, any>) || {};

  return (
    <>
      <Hero settings={settings} />
      <AboutSection settings={settings} />
      <ServicesSection services={services || []} />
      <ExperienceSection experience={experience || []} />
      <TestimonialsSection testimonials={testimonials || []} />
      <FAQSection faqs={faqs || []} />
      <ContactSection settings={settings} />
    </>
  );
}
