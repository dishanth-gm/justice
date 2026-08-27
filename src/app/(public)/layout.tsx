import { supabase } from "@/lib/supabase";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";

export const revalidate = 60; // Revalidate every minute

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: settingsData } = await supabase.from("settings").select("*");
  const settings = settingsData?.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, any>) || {};

  return (
    <>
      <Navbar />
      <main className="flex-grow min-h-screen">
        {children}
      </main>
      <Footer settings={settings} />
    </>
  );
}
