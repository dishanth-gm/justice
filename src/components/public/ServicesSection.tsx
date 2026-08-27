"use client";

import { motion } from "framer-motion";
import { Scale, Briefcase, FileText, Users, Shield, BookOpen } from "lucide-react";

interface Service {
  id: number;
  title: string;
  description: string;
  fee: number | null;
  icon: string | null;
}

interface ServicesSectionProps {
  services: Service[];
}

export default function ServicesSection({ services }: ServicesSectionProps) {
  // Mapping of string to lucide icons (if implemented dynamically later)
  // For now, we'll assign some generic icons based on index
  const icons = [Scale, Briefcase, FileText, Users, Shield, BookOpen];

  return (
    <section id="services" className="py-24 bg-navy-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm uppercase tracking-widest text-gold-500 font-semibold mb-4">Practice Areas</h2>
            <h3 className="text-4xl font-serif font-bold mb-6">How We Can Help You</h3>
            <p className="text-gray-300 font-light text-lg">
              Specialized legal expertise tailored to your unique situation. We provide comprehensive legal services across a range of practice areas.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.length > 0 ? (
            services.map((service, idx) => {
              const Icon = icons[idx % icons.length];
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-navy-800 p-8 border border-navy-700 hover:border-gold-500 transition-colors duration-300 group"
                >
                  <Icon className="h-10 w-10 text-gold-500 mb-6 group-hover:scale-110 transition-transform duration-300" />
                  <h4 className="text-xl font-serif font-semibold mb-3">{service.title}</h4>
                  <p className="text-gray-400 font-light text-sm leading-relaxed mb-6">
                    {service.description}
                  </p>
                  {service.fee && (
                    <p className="text-gold-500 font-medium text-sm">
                      Starting at ${service.fee}
                    </p>
                  )}
                </motion.div>
              );
            })
          ) : (
            <p className="text-center text-gray-400 col-span-full">No services listed at the moment.</p>
          )}
        </div>
      </div>
    </section>
  );
}
