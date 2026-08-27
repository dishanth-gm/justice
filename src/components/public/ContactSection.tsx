"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { submitEnquiry } from "@/app/actions";
import { MapPin, Phone, Mail } from "lucide-react";

interface ContactSectionProps {
  settings: Record<string, any>;
}

export default function ContactSection({ settings }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await submitEnquiry(formData);
      setStatus("success");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="py-24 bg-navy-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%23ffffff\\' fill-opacity=\\'1\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-sm uppercase tracking-widest text-gold-500 font-semibold mb-4">Contact Us</h2>
            <h3 className="text-4xl font-serif font-bold mb-6">Request A Free Consultation</h3>
            <p className="text-gray-300 font-light mb-10 leading-relaxed">
              We are here to provide the robust legal representation you deserve. Fill out the form or contact us directly to discuss your case.
            </p>

            <div className="space-y-6">
              <div className="flex items-start">
                <MapPin className="h-6 w-6 text-gold-500 mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h4 className="font-serif font-bold text-lg mb-1">Office Location</h4>
                  <p className="text-gray-400 font-light">{settings.address || "123 Legal Avenue, Suite 100\nCity, State 12345"}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="h-6 w-6 text-gold-500 mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h4 className="font-serif font-bold text-lg mb-1">Phone Number</h4>
                  <p className="text-gray-400 font-light">{settings.contact_phone || "+1 (555) 123-4567"}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="h-6 w-6 text-gold-500 mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h4 className="font-serif font-bold text-lg mb-1">Email Address</h4>
                  <p className="text-gray-400 font-light">{settings.contact_email || "contact@justice.com"}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white p-8 md:p-10 shadow-2xl"
          >
            {status === "success" ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-2xl font-serif font-bold text-navy-900">Message Sent!</h4>
                <p className="text-gray-600">Thank you for reaching out. We will get back to you shortly.</p>
                <button 
                  onClick={() => setStatus("idle")}
                  className="mt-6 px-6 py-2 bg-navy-900 text-white text-sm uppercase tracking-widest font-medium hover:bg-navy-800"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="sr-only">Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-navy-900 placeholder-gray-400 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="sr-only">Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-navy-900 placeholder-gray-400 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="sr-only">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-navy-900 placeholder-gray-400 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="sr-only">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      placeholder="Subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-navy-900 placeholder-gray-400 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="sr-only">Message</label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    placeholder="Briefly describe your legal issue..."
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-navy-900 placeholder-gray-400 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors resize-none"
                  ></textarea>
                </div>
                
                {status === "error" && (
                  <p className="text-red-500 text-sm">There was an error sending your message. Please try again.</p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full bg-gold-500 text-white font-medium uppercase tracking-widest py-4 hover:bg-gold-600 transition-colors disabled:opacity-50"
                >
                  {status === "loading" ? "Sending..." : "Submit Message"}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
