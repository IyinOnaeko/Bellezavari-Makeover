'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Clock, Sparkles, Crown, Instagram } from 'lucide-react';
import { services, categoryNames } from '@/data/services';
import { settings } from '@/data/settings';
import { formatPrice, formatDuration } from '@/lib/utils';

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Featured services (hand-picked for homepage)
const featuredServices = services.filter(s => 
  ['knotless-braids-medium', 'butterfly-locs', 'frontal-install', 'silk-press'].includes(s.id)
).slice(0, 4);

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-pattern">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-radial from-primary/5 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-radial from-accent/5 to-transparent rounded-full blur-3xl" />
        </div>

        {/* Decorative frame */}
        <div className="absolute inset-8 md:inset-16 border border-primary/10 pointer-events-none" />

        <div className="container relative z-10">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Badge */}
            <motion.div variants={fadeInUp} className="mb-6">
              <span className="badge badge-accent">
                <Crown size={12} className="mr-1" />
                Premium Hair Styling
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              variants={fadeInUp}
              className="font-display text-5xl md:text-7xl lg:text-8xl font-medium text-secondary mb-6 leading-[0.95]"
            >
              Your Hair,{' '}
              <span className="italic text-primary">Elevated</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              variants={fadeInUp}
              className="font-body text-lg md:text-xl text-charcoal/70 max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Experience the artistry of premium hair styling in London. 
              From intricate braids to flawless locs, every style is crafted 
              with precision and care.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/book" className="btn btn-primary group">
                Book Your Appointment
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/services" className="btn btn-outline">
                Explore Services
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              variants={fadeInUp}
              className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-charcoal/60"
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="text-accent fill-accent" />
                  ))}
                </div>
                <span>5-Star Reviews</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-charcoal/20" />
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-primary" />
                <span>Premium Products</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-charcoal/20" />
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-primary" />
                <span>Expert Styling</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-6 h-10 border-2 border-charcoal/30 rounded-full flex items-start justify-center p-1"
          >
            <div className="w-1.5 h-2.5 bg-charcoal/40 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Services Section */}
      <section className="section bg-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="badge badge-primary mb-4">Our Services</span>
            <h2 className="font-display text-4xl md:text-5xl text-secondary mb-4">
              Signature Styles
            </h2>
            <p className="font-body text-charcoal/70 max-w-xl mx-auto">
              From classic braids to modern protective styles, discover the perfect 
              look for your next transformation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/book?service=${service.id}`} className="group block">
                  <div className="card h-full">
                    {/* Image Placeholder */}
                    <div className="aspect-[4/5] bg-gradient-to-br from-cream to-cream-dark relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="w-12 h-12 text-primary/20" />
                      </div>
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="badge badge-accent text-xs">
                          {categoryNames[service.category]}
                        </span>
                      </div>
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-secondary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="btn btn-primary">Book Now</span>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-5">
                      <h3 className="font-display text-xl text-secondary mb-2 group-hover:text-primary transition-colors">
                        {service.name}
                      </h3>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-primary font-semibold">
                          {formatPrice(service.price)}
                        </span>
                        <span className="text-charcoal/60 flex items-center gap-1">
                          <Clock size={14} />
                          {formatDuration(service.durationMinutes)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/services" className="btn btn-outline group">
              View All Services
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section bg-cream-dark bg-pattern">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="badge badge-primary mb-4">Why Bellezavari</span>
              <h2 className="font-display text-4xl md:text-5xl text-secondary mb-6">
                Where Artistry Meets{' '}
                <span className="italic text-primary">Excellence</span>
              </h2>
              <p className="text-charcoal/70 mb-8 leading-relaxed">
                At Bellezavari, we believe your hair is your crown. Our expert styling 
                combines traditional techniques with modern artistry to create looks 
                that are uniquely you. Every appointment is a personalized experience 
                designed to make you feel confident and beautiful.
              </p>

              <div className="space-y-6">
                {[
                  {
                    title: 'Expert Craftsmanship',
                    description: 'Years of experience perfecting every braid, loc, and style.',
                  },
                  {
                    title: 'Premium Products',
                    description: 'Only the highest quality hair and styling products.',
                  },
                  {
                    title: 'Seamless Booking',
                    description: 'Book online instantly with upfront pricing—no surprises.',
                  },
                ].map((feature, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Sparkles size={18} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg text-secondary mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-charcoal/60 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Image placeholder with decorative elements */}
              <div className="aspect-[4/5] bg-gradient-to-br from-primary/10 to-accent/10 rounded-sm relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Crown className="w-24 h-24 text-primary/20" />
                </div>
                {/* Decorative frame */}
                <div className="absolute -inset-4 border border-primary/20 rounded-sm -z-10" />
                {/* Accent corner */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent/10 rounded-sm -z-20" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section bg-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="badge badge-accent mb-4">Simple Process</span>
            <h2 className="font-display text-4xl md:text-5xl text-secondary mb-4">
              Book in Minutes
            </h2>
            <p className="font-body text-charcoal/70 max-w-xl mx-auto">
              Our streamlined booking process makes it easy to secure your appointment.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Choose Your Style',
                description: 'Browse our services and select the perfect style for you.',
              },
              {
                step: '02',
                title: 'Pick a Time',
                description: 'Select an available date and time that works for your schedule.',
              },
              {
                step: '03',
                title: 'Secure with Deposit',
                description: 'Pay a deposit to confirm your booking instantly.',
              },
              {
                step: '04',
                title: 'Get Styled',
                description: 'Arrive on time and enjoy your transformation.',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="relative mb-6">
                  <span className="font-display text-6xl text-primary/10">
                    {item.step}
                  </span>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-1/2 left-full w-full h-px bg-gradient-to-r from-primary/20 to-transparent" />
                  )}
                </div>
                <h3 className="font-display text-xl text-secondary mb-2">
                  {item.title}
                </h3>
                <p className="text-charcoal/60 text-sm">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram CTA Section */}
      <section className="section bg-secondary text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Instagram className="w-12 h-12 text-primary-light mx-auto mb-6" />
              <h2 className="font-display text-4xl md:text-5xl mb-4">
                Follow Our Journey
              </h2>
              <p className="text-white/70 mb-8 max-w-xl mx-auto">
                Get inspired by our latest styles and transformations. 
                Follow us on Instagram for daily hair inspiration.
              </p>
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn bg-white text-secondary hover:bg-cream group"
              >
                <Instagram size={18} />
                @bellezavari
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="section bg-cream bg-pattern relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-radial from-primary/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-radial from-accent/5 to-transparent rounded-full blur-3xl" />

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="font-display text-4xl md:text-6xl text-secondary mb-6">
              Ready for Your{' '}
              <span className="italic text-primary">Transformation?</span>
            </h2>
            <p className="text-charcoal/70 mb-10 text-lg">
              Book your appointment today and experience the Bellezavari difference.
            </p>
            <Link href="/book" className="btn btn-primary btn-lg group">
              Book Your Appointment
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
