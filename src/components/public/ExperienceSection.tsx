"use client";

import { motion } from "framer-motion";

interface Experience {
  id: number;
  title: string;
  company: string;
  start_date: string;
  end_date: string | null;
  description: string | null;
}

interface ExperienceSectionProps {
  experience: Experience[];
}

export default function ExperienceSection({ experience }: ExperienceSectionProps) {
  return (
    <section id="experience" className="py-24 bg-white text-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm uppercase tracking-widest text-gold-500 font-semibold mb-4">Our Experience</h2>
            <h3 className="text-4xl font-serif font-bold mb-6">A History of Excellence</h3>
          </motion.div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative border-l border-gray-200 ml-3 md:ml-0 md:border-none">
            {experience.length > 0 ? (
              experience.map((exp, idx) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="mb-12 relative pl-8 md:pl-0 md:grid md:grid-cols-12 gap-8 items-start"
                >
                  {/* Timeline dot */}
                  <div className="md:hidden absolute left-[-5px] top-1 h-3 w-3 rounded-full bg-gold-500" />
                  
                  <div className="md:col-span-3 md:text-right pt-1">
                    <span className="text-gold-500 font-serif font-semibold text-lg block">
                      {exp.start_date} — {exp.end_date || "Present"}
                    </span>
                  </div>
                  
                  {/* Desktop Timeline dot */}
                  <div className="hidden md:flex md:col-span-1 justify-center relative h-full">
                    <div className="h-full w-px bg-gray-200 absolute top-0 bottom-0 z-0"></div>
                    <div className="h-4 w-4 rounded-full bg-gold-500 z-10 mt-2"></div>
                  </div>

                  <div className="md:col-span-8 bg-gray-50 p-6 shadow-sm border border-gray-100 mt-2 md:mt-0">
                    <h4 className="text-xl font-bold font-serif mb-1">{exp.title}</h4>
                    <h5 className="text-md text-gray-600 font-medium mb-4">{exp.company}</h5>
                    {exp.description && (
                      <p className="text-gray-500 font-light text-sm leading-relaxed whitespace-pre-line">
                        {exp.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-center text-gray-500">No experience records found.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
