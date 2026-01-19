'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ArrowRight, Sparkles, Info } from 'lucide-react';
import { services, categoryNames, getServicesByCategory } from '@/data/services';
import { Service } from '@/types';
import { formatPrice, formatDuration, getStartTimeDescription } from '@/lib/utils';

type Category = Service['category'] | 'all';

const categories: { value: Category; label: string }[] = [
  { value: 'all', label: 'All Services' },
  { value: 'braids', label: 'Braids' },
  { value: 'locs', label: 'Locs' },
  { value: 'weaves', label: 'Weaves & Wigs' },
  { value: 'natural', label: 'Natural Hair' },
];

export default function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('all');

  const filteredServices = activeCategory === 'all' 
    ? services.filter(s => s.isActive)
    : getServicesByCategory(activeCategory as Service['category']);

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
            <span className="badge badge-primary mb-4">Our Services</span>
            <h1 className="font-display text-5xl md:text-6xl text-secondary mb-6">
              Services & <span className="italic text-primary">Pricing</span>
            </h1>
            <p className="text-charcoal/70 text-lg">
              Explore our full range of hair styling services. Each service includes 
              consultation and expert care for your hair.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section bg-white">
        <div className="container">
          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap justify-center gap-2 mb-12"
          >
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setActiveCategory(category.value)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category.value
                    ? 'bg-primary text-white'
                    : 'bg-cream hover:bg-cream-dark text-charcoal'
                }`}
              >
                {category.label}
              </button>
            ))}
          </motion.div>

          {/* Services Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredServices.map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} />
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <p className="text-charcoal/60">No services found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="section-sm bg-cream-dark">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <InfoCard
                title="Deposit Required"
                description="A non-refundable deposit is required to secure your booking. The remaining balance is due on the day of your appointment."
              />
              <InfoCard
                title="Hair & Extras"
                description="Hair extensions are not included unless specified. Add-ons like home service and hair can be selected during booking."
              />
              <InfoCard
                title="Start Times"
                description="Longer services have specific start time requirements to ensure completion within working hours."
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-white">
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
              Select your service and secure your appointment with a deposit.
            </p>
            <Link href="/book" className="btn btn-primary group">
              Start Booking
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const startTimeInfo = getStartTimeDescription(service.allowedStartTimes);
  const isLongService = service.durationMinutes >= 420; // 7+ hours

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="card group h-full flex flex-col"
    >
      {/* Image Placeholder */}
      <div className="aspect-[16/10] bg-gradient-to-br from-cream to-cream-dark relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="w-10 h-10 text-primary/20" />
        </div>
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="badge badge-accent text-xs">
            {categoryNames[service.category]}
          </span>
        </div>
        {/* Long service indicator */}
        {isLongService && (
          <div className="absolute top-3 right-3">
            <span className="badge bg-secondary/90 text-white text-xs">
              Full Day
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-display text-xl text-secondary mb-2 group-hover:text-primary transition-colors">
          {service.name}
        </h3>
        
        <p className="text-charcoal/60 text-sm mb-4 line-clamp-2 flex-1">
          {service.description}
        </p>

        {/* Service Details */}
        <div className="space-y-3 mb-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-charcoal/60 flex items-center gap-1.5">
              <Clock size={14} />
              Duration
            </span>
            <span className="font-medium text-charcoal">
              {formatDuration(service.durationMinutes)}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-charcoal/60">Deposit</span>
            <span className="font-medium text-charcoal">
              {formatPrice(service.depositAmount)}
            </span>
          </div>

          {/* Start time info */}
          <div className="flex items-start gap-1.5 text-xs text-charcoal/50 bg-cream/50 px-3 py-2 rounded">
            <Info size={12} className="flex-shrink-0 mt-0.5" />
            <span>{startTimeInfo}</span>
          </div>
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-cream-dark">
          <div>
            <span className="text-xs text-charcoal/60 block">From</span>
            <span className="text-2xl font-display text-primary">
              {formatPrice(service.price)}
            </span>
          </div>
          <Link
            href={`/book?service=${service.id}`}
            className="btn btn-primary py-2 px-4 text-sm"
          >
            Book Now
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function InfoCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
        <Info size={20} className="text-primary" />
      </div>
      <h3 className="font-display text-lg text-secondary mb-2">{title}</h3>
      <p className="text-charcoal/60 text-sm">{description}</p>
    </div>
  );
}
