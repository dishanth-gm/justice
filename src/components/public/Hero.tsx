"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface HeroProps {
  settings: Record<string, any>;
}

export default function Hero({ settings }: HeroProps) {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1589994965851-a8f479c573a9?q=80&w=2000&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-navy-900/80 mix-blend-multiply" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white tracking-wide mb-6">
            {settings.site_title || "Law Chamber"}
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-gray-200 font-light max-w-3xl mx-auto mb-10">
            "Justice—social, economic, and political." Upholding the constitutional mandate of India with relentless advocacy and unwavering commitment.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link 
              href="/book"
              className="px-8 py-4 bg-gold-500 text-white uppercase tracking-widest font-medium hover:bg-gold-600 transition-colors duration-300 w-full sm:w-auto"
            >
              Free Consultation
            </Link>
            <Link 
              href="/#services"
              className="px-8 py-4 border border-white text-white uppercase tracking-widest font-medium hover:bg-white hover:text-navy-900 transition-colors duration-300 w-full sm:w-auto"
            >
              Our Practice Areas
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <span className="text-white/70 text-xs uppercase tracking-widest mb-2">Scroll</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-[1px] h-12 bg-gold-500"
        />
      </motion.div>
    </section>
  );
}
