'use client';

import { motion } from 'framer-motion';
import { FileText, MessageSquare, Megaphone, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const styles = [
  {
    icon: FileText,
    name: 'Classic',
    badge: 'Utility',
    description: 'All questions on one page. Minimal styling, fast scrolling, no animations. Perfect for internal tools.',
    features: ['All questions visible', 'Fast scrolling', 'Minimal design'],
  },
  {
    icon: MessageSquare,
    name: 'Conversational',
    badge: 'Engaging',
    description: 'One question at a time with smooth transitions. Keyboard-first navigation with progress indicator.',
    features: ['One question at a time', 'Smooth transitions', 'Progress indicator'],
  },
  {
    icon: Megaphone,
    name: 'Marketing',
    badge: 'Bold',
    description: 'Hero section with large typography and CTA-focused design. Great for landing pages.',
    features: ['Hero section', 'Large typography', 'CTA focused'],
  },
];

export function StylesSection() {
  return (
    <section id="styles" className="py-40 relative overflow-hidden font-body">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto mb-24"
        >
          <p className="text-[10px] uppercase tracking-[0.5em] opacity-40 mb-6">Presentation Modes</p>
          <h2 className="text-5xl md:text-7xl font-heading tracking-tighter leading-[0.9] italic mb-8">
            Choose Your <br />
            <span className="opacity-40">Experience</span>
          </h2>
          <p className="text-lg opacity-60 max-w-2xl mx-auto">
            Three distinct styles that fundamentally change how your form looks, feels, and behaves.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-px bg-muted max-w-6xl mx-auto border border-muted">
          {styles.map((style, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-bg p-10 flex flex-col group"
            >
              <div className="flex items-center justify-between mb-10">
                <div className="w-12 h-12 border border-muted flex items-center justify-center group-hover:border-ink transition-colors">
                  <style.icon className="w-5 h-5 opacity-40 group-hover:opacity-80 transition-opacity" />
                </div>
                <span className="text-[9px] uppercase tracking-[0.3em] opacity-40 border border-muted px-3 py-1">
                  {style.badge}
                </span>
              </div>
              
              <h3 className="text-2xl font-heading italic tracking-tight mb-4">{style.name}</h3>
              <p className="text-sm opacity-50 leading-relaxed mb-10 flex-1">
                {style.description}
              </p>

              <div className="space-y-3 pt-6 border-t border-muted">
                {style.features.map((feature, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <div className="w-1 h-1 bg-ink opacity-20" />
                    <span className="text-[11px] uppercase tracking-[0.2em] opacity-60">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
