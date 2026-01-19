'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, Clock, ArrowRight, Instagram, Download } from 'lucide-react';
import { settings } from '@/data/settings';

function SuccessContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference') || searchParams.get('trxref');

  return (
    <section className="min-h-screen bg-cream bg-pattern flex items-center justify-center py-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-8"
          >
            <CheckCircle className="w-14 h-14 text-success" />
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-display text-4xl md:text-5xl text-secondary mb-4"
          >
            Booking <span className="italic text-primary">Confirmed!</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-charcoal/70 text-lg mb-8"
          >
            Thank you for booking with Bellezavari. Your appointment has been secured 
            and a confirmation email has been sent to you.
          </motion.p>

          {/* Reference */}
          {reference && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-lg p-6 mb-8 shadow-sm"
            >
              <p className="text-sm text-charcoal/60 mb-1">Booking Reference</p>
              <p className="text-2xl font-mono font-semibold text-secondary">{reference}</p>
              <p className="text-xs text-charcoal/50 mt-2">
                Please save this reference for your records
              </p>
            </motion.div>
          )}

          {/* What's Next */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-lg p-6 mb-8 text-left"
          >
            <h2 className="font-display text-xl text-secondary mb-4">What&apos;s Next?</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle size={16} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-secondary">Check Your Email</h3>
                  <p className="text-sm text-charcoal/60">
                    You&apos;ll receive a confirmation email with all your appointment details.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Calendar size={16} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-secondary">Add to Calendar</h3>
                  <p className="text-sm text-charcoal/60">
                    Don&apos;t forget to add your appointment to your calendar.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock size={16} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-secondary">Arrive On Time</h3>
                  <p className="text-sm text-charcoal/60">
                    Please arrive on time for your appointment. Late arrivals may result in 
                    shortened service or cancellation.
                  </p>
                </div>
              </li>
            </ul>
          </motion.div>

          {/* Preparation Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-cream-dark rounded-lg p-6 mb-8 text-left"
          >
            <h2 className="font-display text-xl text-secondary mb-3">Before Your Appointment</h2>
            <ul className="space-y-2 text-sm text-charcoal/70">
              <li>• Come with clean, detangled hair (unless your service includes washing)</li>
              <li>• Bring your hair extensions if required (or select &quot;Hair Provided&quot; add-on)</li>
              <li>• Wear comfortable clothing</li>
              <li>• Have the remaining balance ready (cash or card accepted)</li>
            </ul>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/" className="btn btn-primary group">
              Return Home
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              <Instagram size={18} />
              Follow Us
            </a>
          </motion.div>

          {/* Contact Note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-sm text-charcoal/50 mt-8"
          >
            Questions about your booking?{' '}
            <a href={`mailto:${settings.contactEmail}`} className="text-primary hover:underline">
              Contact us
            </a>
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
