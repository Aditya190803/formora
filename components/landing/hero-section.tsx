'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-bg px-6">
      <div className="container mx-auto relative z-10 pt-20">
        <div className="flex flex-col items-start text-left max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 0.4, x: 0 }}
            transition={{ duration: 1 }}
            className="font-body text-[10px] uppercase tracking-[0.5em] mb-12"
          >
            Experience-First Form UI System
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-7xl md:text-[10rem] font-display font-medium tracking-tighter mb-16 leading-[0.85] text-ink"
          >
            Forms are not <br />
            <span className="italic font-normal opacity-40">containers.</span><br />
            Forms are <br />
            <span className="italic font-normal">narratives.</span>
          </motion.h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 w-full items-end">
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6, y: 0 }}
              transition={{ duration: 1.2, delay: 0.4 }}
              className="text-xl md:text-3xl text-foreground font-body leading-tight max-w-xl"
            >
              Formora treats every form as a guided experience rather than a static data-collection surface. 
              The UI adapts its visual language to intent—without changing the data.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="flex flex-col gap-6 items-start"
            >
              <Link href="/handler/sign-up" className="group">
                <span className="text-3xl md:text-5xl font-display border-b-2 border-ink py-2 group-hover:pr-10 transition-all duration-500">
                  Begin Authored Journey
                </span>
                <ArrowRight className="inline-block ml-4 w-10 h-10 group-hover:translate-x-4 transition-transform duration-500" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Industrial Restraint Visual */}
      <div className="absolute right-0 bottom-0 w-1/3 h-1/2 border-l border-t border-muted hidden lg:block opacity-20">
        <div className="absolute top-10 left-10 font-mono text-[10px] uppercase tracking-widest">System Perspective 01</div>
        <div className="absolute bottom-10 right-10 flex gap-4">
          <div className="w-10 h-[1px] bg-ink" />
          <div className="w-4 h-[1px] bg-ink opacity-30" />
        </div>
      </div>
    </section>
  );
}
