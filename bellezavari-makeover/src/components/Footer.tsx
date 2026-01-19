import Link from 'next/link';
import { Instagram, Mail, MapPin, Clock } from 'lucide-react';
import { settings, dayNames, formatWorkingHours } from '@/data/settings';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-white/90">
      {/* Main Footer */}
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <h2 className="font-display text-3xl font-semibold text-white mb-4">
              Bellezavari
            </h2>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Premium hair styling and transformations in Toronto. 
              Specializing in braids, locs, weaves, and natural hair care.
            </p>
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary-light hover:text-white transition-colors"
            >
              <Instagram size={20} />
              <span className="text-sm">@bellezavari</span>
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-lg text-white mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { href: '/services', label: 'Our Services' },
                { href: '/book', label: 'Book Appointment' },
                { href: '/gallery', label: 'Portfolio' },
                { href: '/about', label: 'About Us' },
                { href: '/policies', label: 'Policies' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-primary-light transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="font-display text-lg text-white mb-4">Opening Hours</h3>
            <ul className="space-y-2">
              {settings.workingHours.map((day) => (
                <li key={day.dayOfWeek} className="flex justify-between text-sm">
                  <span className="text-white/70">{dayNames[day.dayOfWeek]}</span>
                  <span className={day.isOpen ? 'text-white' : 'text-white/50'}>
                    {formatWorkingHours(day)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-lg text-white mb-4">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-primary-light flex-shrink-0 mt-0.5" />
                <span className="text-white/70 text-sm">
                  {settings.location.city}
                </span>
              </li>
              {settings.contactEmail && (
                <li className="flex items-start gap-3">
                  <Mail size={18} className="text-primary-light flex-shrink-0 mt-0.5" />
                  <a 
                    href={`mailto:${settings.contactEmail}`}
                    className="text-white/70 hover:text-primary-light transition-colors text-sm"
                  >
                    {settings.contactEmail}
                  </a>
                </li>
              )}
              <li className="flex items-start gap-3">
                <Clock size={18} className="text-primary-light flex-shrink-0 mt-0.5" />
                <span className="text-white/70 text-sm">
                  By appointment only
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/50">
            <p>© {currentYear} Bellezavari. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="/policies" className="hover:text-white/70 transition-colors">
                Terms & Policies
              </Link>
              <span className="text-white/30">•</span>
              <span>Toronto, Canada</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
