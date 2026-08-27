"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  designation: string | null;
  rating: number | null;
  testimonial: string;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  return (
    <section id="testimonials" className="py-24 bg-ivory-50 text-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm uppercase tracking-widest text-gold-500 font-semibold mb-4">Testimonials</h2>
            <h3 className="text-4xl font-serif font-bold mb-6">What Our Clients Say</h3>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.length > 0 ? (
            testimonials.map((t, idx) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white p-8 shadow-lg relative overflow-hidden"
              >
                <Quote className="absolute top-4 right-4 h-16 w-16 text-gray-100 -z-0" />
                <div className="relative z-10">
                  <div className="flex mb-4">
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-gold-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 font-light text-sm italic mb-6 leading-relaxed">
                    "{t.testimonial}"
                  </p>
                  <div className="border-t border-gray-100 pt-4">
                    <p className="font-serif font-bold text-navy-900">{t.name}</p>
                    {t.designation && <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">{t.designation}</p>}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">No testimonials yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}
