'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function CtaSection() {
  return (
    <section className="py-40 relative overflow-hidden font-body">
      <div className="container mx-auto px-6 relative z-10">
        <div className="relative bg-ink text-bg p-16 md:p-24 overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 49px, currentColor 49px, currentColor 50px), repeating-linear-gradient(90deg, transparent, transparent 49px, currentColor 49px, currentColor 50px)' }} />
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative z-10 text-center max-w-4xl mx-auto"
          >
            <p className="text-[10px] uppercase tracking-[0.5em] opacity-40 mb-8">Begin</p>
            <h2 className="text-5xl md:text-8xl font-heading tracking-tighter leading-[0.85] italic mb-10">
              Ready to <br />
              <span className="opacity-60">Start Building?</span>
            </h2>
            <p className="text-lg md:text-xl opacity-40 mb-16 max-w-2xl mx-auto">
              Join thousands of creators building better forms with Formora. 
              Start for free, no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="h-14 px-10 bg-bg text-ink hover:bg-bg/90 text-[11px] uppercase tracking-[0.3em]" asChild>
                <Link href="/handler/sign-up">
                  Get Started Now
                  <ArrowRight className="ml-3 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-10 border-bg/30 text-bg hover:bg-bg/10 text-[11px] uppercase tracking-[0.3em]" asChild>
                <Link href="/templates">
                  View Templates
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
