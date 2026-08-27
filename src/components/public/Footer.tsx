"use client";

import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

interface FooterProps {
  settings: Record<string, any>;
}

export default function Footer({ settings }: FooterProps) {
  return (
    <footer className="bg-navy-900 text-gray-300 py-16 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-white tracking-wider">
              LAW CHAMBER<span className="text-gold-500">.</span>
            </h2>
            <p className="text-sm leading-relaxed max-w-sm">
              {settings.bio || "Providing dedicated, aggressive, and experienced legal representation."}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-serif font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/#about" className="hover:text-gold-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-gold-500 transition-colors">
                  Practice Areas
                </Link>
              </li>
              <li>
                <Link href="/#experience" className="hover:text-gold-500 transition-colors">
                  Experience
                </Link>
              </li>
              <li>
                <Link href="/book" className="hover:text-gold-500 transition-colors">
                  Book a Consultation
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-serif font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start">
                <MapPin className="mr-3 h-5 w-5 text-gold-500 flex-shrink-0" />
                <span>{settings.address || "123 Legal Avenue, Suite 100, City, State"}</span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-3 h-5 w-5 text-gold-500 flex-shrink-0" />
                <span>{settings.contact_phone || "+1 (555) 123-4567"}</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-3 h-5 w-5 text-gold-500 flex-shrink-0" />
                <span>{settings.contact_email || "contact@justice.com"}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Law Chamber. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
