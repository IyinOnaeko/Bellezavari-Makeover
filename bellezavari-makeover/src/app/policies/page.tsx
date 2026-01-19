'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown, AlertCircle, Clock, Calendar, MapPin, Shield } from 'lucide-react';
import { policies, settings, dayNames, formatWorkingHours } from '@/data/settings';

const policyList = [
  { key: 'deposit', icon: Shield, ...policies.deposit },
  { key: 'cancellation', icon: Calendar, ...policies.cancellation },
  { key: 'lateness', icon: Clock, ...policies.lateness },
  { key: 'homeService', icon: MapPin, ...policies.homeService },
  { key: 'general', icon: AlertCircle, ...policies.general },
];

export default function PoliciesPage() {
  const [openPolicy, setOpenPolicy] = useState<string | null>('deposit');

  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-cream bg-pattern">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="badge badge-primary mb-4">Important Information</span>
            <h1 className="font-display text-5xl md:text-6xl text-secondary mb-6">
              Booking <span className="italic text-primary">Policies</span>
            </h1>
            <p className="text-charcoal/70 text-lg">
              Please read our policies carefully before booking. These help ensure a 
              smooth experience for everyone.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-8 bg-error/5 border-y border-error/20">
        <div className="container">
          <div className="max-w-3xl mx-auto flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-error flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="font-semibold text-secondary mb-1">
                Non-Refundable Deposits
              </h2>
              <p className="text-charcoal/70">
                All deposits are <strong>non-refundable</strong>. By making a booking, you 
                acknowledge and accept this policy. Please ensure you can make your 
                appointment before paying the deposit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Policies Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {policyList.map((policy, index) => {
                const Icon = policy.icon;
                const isOpen = openPolicy === policy.key;

                return (
                  <motion.div
                    key={policy.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border border-cream-dark rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenPolicy(isOpen ? null : policy.key)}
                      className="w-full flex items-center justify-between p-5 bg-cream/30 hover:bg-cream/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Icon size={20} className="text-primary" />
                        </div>
                        <h3 className="font-display text-xl text-secondary">
                          {policy.title}
                        </h3>
                      </div>
                      <ChevronDown 
                        size={20} 
                        className={`text-charcoal/50 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
                      />
                    </button>
                    
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="p-5 bg-white"
                      >
                        <div className="prose prose-sm max-w-none text-charcoal/70">
                          {policy.content.split('\n\n').map((paragraph, i) => (
                            <div key={i} className="mb-4 last:mb-0">
                              {paragraph.split('\n').map((line, j) => {
                                // Handle bold text
                                const parts = line.split(/(\*\*.*?\*\*)/);
                                return (
                                  <p key={j} className="mb-2 last:mb-0">
                                    {parts.map((part, k) => {
                                      if (part.startsWith('**') && part.endsWith('**')) {
                                        return (
                                          <strong key={k} className="text-secondary">
                                            {part.slice(2, -2)}
                                          </strong>
                                        );
                                      }
                                      // Handle bullet points
                                      if (part.startsWith('• ')) {
                                        return (
                                          <span key={k} className="block pl-4">
                                            • {part.slice(2)}
                                          </span>
                                        );
                                      }
                                      return part;
                                    })}
                                  </p>
                                );
                              })}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Opening Hours Section */}
      <section className="section bg-cream-dark">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <h2 className="font-display text-3xl text-secondary mb-2">
                Opening Hours
              </h2>
              <p className="text-charcoal/60">
                {settings.businessName} operates by appointment only.
              </p>
            </motion.div>

            <div className="bg-white rounded-lg p-6">
              <div className="grid grid-cols-2 gap-4">
                {settings.workingHours.map((day) => (
                  <div 
                    key={day.dayOfWeek} 
                    className="flex justify-between py-2 border-b border-cream-dark last:border-0"
                  >
                    <span className="text-charcoal/70">{dayNames[day.dayOfWeek]}</span>
                    <span className={`font-medium ${day.isOpen ? 'text-secondary' : 'text-charcoal/40'}`}>
                      {formatWorkingHours(day)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section bg-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="font-display text-3xl text-secondary mb-4">
              Have Questions?
            </h2>
            <p className="text-charcoal/70 mb-6">
              If you have any questions about our policies or need to discuss your booking, 
              please reach out to us.
            </p>
            {settings.contactEmail && (
              <a
                href={`mailto:${settings.contactEmail}`}
                className="btn btn-outline"
              >
                Contact Us
              </a>
            )}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-cream">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="font-display text-4xl text-secondary mb-4">
              Ready to Book?
            </h2>
            <p className="text-charcoal/70 mb-8">
              Now that you&apos;ve read our policies, you&apos;re ready to secure your appointment.
            </p>
            <Link href="/book" className="btn btn-primary group">
              Book Your Appointment
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
