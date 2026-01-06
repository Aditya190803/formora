'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function CtaSection() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="relative rounded-[4rem] bg-foreground text-background p-16 md:p-32 overflow-hidden group shadow-[30px_30px_0px_0px_var(--primary)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,var(--primary)/20%,transparent_70%)] opacity-50" />
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative z-10 text-center max-w-4xl mx-auto"
          >
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-10 leading-[0.8] uppercase">
              Ready to <br />
              <span className="text-primary">start building?</span>
            </h2>
            <p className="text-xl md:text-2xl text-background/60 mb-16 max-w-2xl mx-auto font-bold tracking-tight">
              Join thousands of creators building better forms with Formora. 
              Start for free, no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button size="lg" className="h-20 px-12 rounded-2xl text-2xl font-black bg-primary text-primary-foreground hover:bg-primary/90 group" asChild>
                <Link href="/handler/sign-up">
                  GET STARTED NOW
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-20 px-12 rounded-2xl text-2xl font-black border-4 border-background hover:bg-background hover:text-foreground" asChild>
                <Link href="/templates">
                  TEMPLATES
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
