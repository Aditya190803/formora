'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Noise } from '@/components/novel-ui/noise';
import { ShinyButton } from '@/components/novel-ui/shiny-button';

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
      <Noise />
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-chart-2/20 rounded-full blur-[120px] animate-pulse" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-8 backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold tracking-widest uppercase text-primary">Experience-first form builder</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[0.9]"
          >
            Forms that adapt to <br />
            <span className="gradient-text">your intent</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 font-medium leading-relaxed"
          >
            Build once. Choose how it feels. Create stunning forms with distinct styles 
            that fundamentally change how your form looks, feels, and behaves.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Link href="/handler/sign-up">
              <ShinyButton className="h-14 px-10 text-lg">
                Get Started Free
              </ShinyButton>
            </Link>
            <Button size="lg" variant="ghost" className="text-lg font-semibold group" asChild>
              <Link href="/#styles">
                Explore Styles
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>

          {/* Hero Visual / Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, type: "spring", bounce: 0.3 }}
            className="mt-20 w-full max-w-5xl relative"
          >
            <motion.div 
              animate={{ 
                y: [0, -20, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-chart-2 to-chart-3 rounded-[2.5rem] blur-xl opacity-20" />
              <div className="relative bg-card/80 backdrop-blur-2xl rounded-[2rem] border shadow-2xl overflow-hidden">
                <div className="bg-muted/30 px-6 py-4 border-b flex items-center justify-between">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  </div>
                  <div className="px-4 py-1 rounded-full bg-background/50 border text-[10px] font-mono text-muted-foreground">
                    formora.app/f/demo-survey
                  </div>
                  <div className="w-10" />
                </div>
                <div className="p-12 md:p-20">
                  <div className="max-w-md mx-auto space-y-10">
                    <div className="space-y-4">
                      <div className="h-12 w-3/4 bg-primary/10 rounded-2xl" />
                      <div className="h-4 w-full bg-muted/50 rounded-full" />
                      <div className="h-4 w-2/3 bg-muted/50 rounded-full" />
                    </div>
                    <div className="space-y-6">
                      <div className="h-16 w-full bg-card border-2 border-dashed border-primary/20 rounded-2xl flex items-center px-6">
                        <div className="h-2 w-24 bg-primary/20 rounded-full" />
                      </div>
                      <div className="h-16 w-full bg-primary rounded-2xl shadow-lg shadow-primary/20" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
