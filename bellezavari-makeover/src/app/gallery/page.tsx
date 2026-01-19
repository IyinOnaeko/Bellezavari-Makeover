'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { categoryNames } from '@/data/services';
import { Service } from '@/types';

type Category = Service['category'] | 'all';

// Placeholder gallery items (replace with real images)
const galleryItems = [
  { id: 1, category: 'braids', title: 'Small Knotless Braids' },
  { id: 2, category: 'braids', title: 'Medium Box Braids' },
  { id: 3, category: 'locs', title: 'Butterfly Locs' },
  { id: 4, category: 'locs', title: 'Soft Locs' },
  { id: 5, category: 'weaves', title: 'Frontal Install' },
  { id: 6, category: 'braids', title: 'Feed-in Cornrows' },
  { id: 7, category: 'natural', title: 'Silk Press' },
  { id: 8, category: 'locs', title: 'Medium Faux Locs' },
  { id: 9, category: 'braids', title: 'Stitch Braids' },
  { id: 10, category: 'weaves', title: 'Sew-in Weave' },
  { id: 11, category: 'natural', title: 'Twist Out' },
  { id: 12, category: 'braids', title: 'Large Knotless Braids' },
];

const categories: { value: Category; label: string }[] = [
  { value: 'all', label: 'All Work' },
  { value: 'braids', label: 'Braids' },
  { value: 'locs', label: 'Locs' },
  { value: 'weaves', label: 'Weaves' },
  { value: 'natural', label: 'Natural Hair' },
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const filteredItems = activeCategory === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeCategory);

  const currentIndex = selectedImage !== null 
    ? filteredItems.findIndex(item => item.id === selectedImage)
    : -1;

  const goToPrev = () => {
    if (currentIndex > 0) {
      setSelectedImage(filteredItems[currentIndex - 1].id);
    }
  };

  const goToNext = () => {
    if (currentIndex < filteredItems.length - 1) {
      setSelectedImage(filteredItems[currentIndex + 1].id);
    }
  };

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
            <span className="badge badge-primary mb-4">Our Work</span>
            <h1 className="font-display text-5xl md:text-6xl text-secondary mb-6">
              Style <span className="italic text-primary">Gallery</span>
            </h1>
            <p className="text-charcoal/70 text-lg">
              Explore our portfolio of transformations. Each style is crafted with 
              precision and care to bring out your unique beauty.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Section */}
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

          {/* Gallery Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedImage(item.id)}
                >
                  <div className="aspect-[3/4] bg-gradient-to-br from-cream to-cream-dark rounded overflow-hidden relative">
                    {/* Placeholder */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="w-12 h-12 text-primary/20" />
                    </div>
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/60 transition-all duration-300 flex items-end">
                      <div className="p-4 w-full translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <span className="text-xs text-primary-light uppercase tracking-wider">
                          {categoryNames[item.category as Service['category']]}
                        </span>
                        <h3 className="text-white font-display text-lg">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Placeholder Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-12 p-6 bg-cream/50 rounded-lg"
          >
            <Sparkles className="w-8 h-8 text-primary/40 mx-auto mb-3" />
            <p className="text-charcoal/60 text-sm">
              Gallery images coming soon. Follow us on Instagram to see our latest work.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-charcoal/95 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-white/70 hover:text-white p-2"
              onClick={() => setSelectedImage(null)}
            >
              <X size={24} />
            </button>

            {/* Navigation */}
            {currentIndex > 0 && (
              <button
                className="absolute left-4 text-white/70 hover:text-white p-2"
                onClick={(e) => { e.stopPropagation(); goToPrev(); }}
              >
                <ChevronLeft size={32} />
              </button>
            )}
            {currentIndex < filteredItems.length - 1 && (
              <button
                className="absolute right-4 text-white/70 hover:text-white p-2"
                onClick={(e) => { e.stopPropagation(); goToNext(); }}
              >
                <ChevronRight size={32} />
              </button>
            )}

            {/* Image */}
            <motion.div
              key={selectedImage}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-4xl w-full aspect-[3/4] md:aspect-video bg-gradient-to-br from-secondary to-secondary-dark rounded-lg flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Sparkles className="w-16 h-16 text-primary/30" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
              Ready for Your Transformation?
            </h2>
            <p className="text-charcoal/70 mb-8">
              Book your appointment and let us create your perfect style.
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
