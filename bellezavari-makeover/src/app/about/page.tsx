'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Crown, Heart, Sparkles, Star, Instagram } from 'lucide-react';
import { settings } from '@/data/settings';

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-cream bg-pattern relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-gradient-radial from-primary/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-radial from-accent/5 to-transparent rounded-full blur-3xl" />

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="badge badge-primary mb-4">Our Story</span>
            <h1 className="font-display text-5xl md:text-6xl text-secondary mb-6">
              About <span className="italic text-primary">Bellezavari</span>
            </h1>
            <p className="text-charcoal/70 text-lg">
              Where passion meets artistry, and every client leaves feeling like royalty.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <h2 className="font-display text-4xl text-secondary mb-6">
                The Art of{' '}
                <span className="italic text-primary">Transformation</span>
              </h2>
              <div className="space-y-4 text-charcoal/70 leading-relaxed">
                <p>
                  Bellezavari was born from a deep love for hair artistry and a commitment to 
                  making every client feel extraordinary. What started as a passion has grown 
                  into a trusted destination for premium hair styling in London.
                </p>
                <p>
                  We believe that your hair is more than just an accessory—it&apos;s an expression 
                  of who you are. That&apos;s why we take the time to understand your style, your 
                  lifestyle, and your vision before crafting the perfect look for you.
                </p>
                <p>
                  From intricate braids that take a full day to create, to sleek protective 
                  styles that last for weeks, every service at Bellezavari is delivered with 
                  the same dedication to excellence.
                </p>
              </div>

              <div className="flex items-center gap-4 mt-8">
                <div className="flex -space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} className="text-accent fill-accent" />
                  ))}
                </div>
                <span className="text-charcoal/60 text-sm">Trusted by clients across London</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              {/* Image placeholder with decorative elements */}
              <div className="relative">
                <div className="aspect-[4/5] bg-gradient-to-br from-primary/10 to-accent/10 rounded-sm relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Crown className="w-24 h-24 text-primary/20" />
                  </div>
                </div>
                {/* Decorative frame */}
                <div className="absolute -inset-4 border border-primary/20 rounded-sm -z-10" />
                {/* Accent square */}
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-accent/10 rounded-sm -z-20" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section bg-cream-dark bg-pattern">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="badge badge-accent mb-4">Our Values</span>
            <h2 className="font-display text-4xl text-secondary mb-4">
              What Sets Us Apart
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Crown,
                title: 'Excellence',
                description: 'We never compromise on quality. Every braid, every loc, every style is executed with precision and care.',
              },
              {
                icon: Heart,
                title: 'Care',
                description: 'Your hair health is our priority. We use premium products and gentle techniques to protect your natural hair.',
              },
              {
                icon: Sparkles,
                title: 'Artistry',
                description: 'Hair styling is our art form. We stay current with trends while mastering timeless techniques.',
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <value.icon size={28} className="text-primary" />
                </div>
                <h3 className="font-display text-2xl text-secondary mb-3">
                  {value.title}
                </h3>
                <p className="text-charcoal/60">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-display text-4xl text-secondary mb-4">
                The Bellezavari Experience
              </h2>
              <p className="text-charcoal/70">
                What to expect when you book with us
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Consultation',
                  description: 'Every appointment begins with understanding your vision and assessing your hair needs.',
                },
                {
                  title: 'Premium Products',
                  description: 'We use only the highest quality hair and styling products for lasting results.',
                },
                {
                  title: 'Comfortable Environment',
                  description: 'Relax in a welcoming space designed for your comfort during longer appointments.',
                },
                {
                  title: 'Expert Technique',
                  description: 'Years of experience ensure your style is executed perfectly, every time.',
                },
                {
                  title: 'Aftercare Guidance',
                  description: 'Leave with tips and recommendations to maintain your style at home.',
                },
                {
                  title: 'Transparent Pricing',
                  description: 'No surprises—you\'ll know exactly what to expect before your appointment.',
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex gap-4 p-5 bg-cream/50 rounded-lg"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold text-sm">{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-display text-lg text-secondary mb-1">
                      {item.title}
                    </h3>
                    <p className="text-charcoal/60 text-sm">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Instagram CTA */}
      <section className="section bg-secondary text-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <Instagram className="w-12 h-12 text-primary-light mx-auto mb-6" />
            <h2 className="font-display text-4xl mb-4">
              Follow Our Journey
            </h2>
            <p className="text-white/70 mb-8">
              Get daily hair inspiration and see our latest work on Instagram.
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
      </section>

      {/* Final CTA */}
      <section className="section bg-cream">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="font-display text-4xl text-secondary mb-4">
              Ready to Experience Bellezavari?
            </h2>
            <p className="text-charcoal/70 mb-8">
              Book your appointment today and discover the difference.
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
