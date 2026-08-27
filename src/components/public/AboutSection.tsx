"use client";

import { motion } from "framer-motion";

interface AboutSectionProps {
  settings: Record<string, any>;
}

export default function AboutSection({ settings }: AboutSectionProps) {
  return (
    <section id="about" className="py-24 bg-ivory-50 text-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-sm uppercase tracking-widest text-gold-500 font-semibold mb-4">About The Firm</h2>
            <h3 className="text-4xl md:text-5xl font-serif font-bold mb-8 leading-tight">
              A legacy of excellence and unwavering dedication.
            </h3>
            <div className="space-y-6 text-gray-700 leading-relaxed text-lg font-light">
              <p>
                {settings.bio || "We are a premier law firm dedicated to providing exceptional legal representation to our clients. With a profound understanding of the law and a relentless pursuit of justice, we stand by you when it matters most."}
              </p>
              <p>
                Our philosophy is simple: every case deserves meticulous preparation, strategic thinking, and aggressive advocacy. We don't just handle cases; we solve complex problems and protect your rights.
              </p>
            </div>
            
            <div className="mt-10 grid grid-cols-2 gap-8 pt-8 border-t border-gray-200">
              <div>
                <p className="text-4xl font-serif text-gold-500 mb-2">15+</p>
                <p className="text-sm font-medium uppercase tracking-wider text-gray-500">Years of Experience</p>
              </div>
              <div>
                <p className="text-4xl font-serif text-gold-500 mb-2">1k+</p>
                <p className="text-sm font-medium uppercase tracking-wider text-gray-500">Cases Won</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative h-[600px] w-full bg-gray-200 shadow-2xl"
          >
            {/* Using a professional placeholder image */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1505664177922-2415170d306b?q=80&w=1200&auto=format&fit=crop')" }}
            />
            {/* Decorative element */}
            <div className="absolute -bottom-6 -left-6 w-48 h-48 border-l-4 border-b-4 border-gold-500 -z-10" />
            <div className="absolute -top-6 -right-6 w-48 h-48 border-r-4 border-t-4 border-navy-900 -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
