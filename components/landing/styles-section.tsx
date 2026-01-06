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
    bg: "bg-blue-500/5",
    iconColor: 'text-blue-500',
  },
  {
    icon: MessageSquare,
    name: 'Conversational',
    badge: 'Engaging',
    description: 'One question at a time with smooth transitions. Keyboard-first navigation with progress indicator.',
    features: ['One question at a time', 'Smooth transitions', 'Progress indicator'],
    bg: "bg-primary/5",
    iconColor: 'text-primary',
  },
  {
    icon: Megaphone,
    name: 'Marketing',
    badge: 'Bold',
    description: 'Hero section with large typography and CTA-focused design. Great for landing pages.',
    features: ['Hero section', 'Large typography', 'CTA focused'],
    bg: "bg-orange-500/5",
    iconColor: 'text-orange-500',
  },
];

export function StylesSection() {
  return (
    <section id="styles" className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto mb-24"
        >
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[0.9] uppercase">
            Choose your <br />
            <span className="gradient-text">experience</span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground font-medium tracking-tight">
            Three distinct styles that fundamentally change how your form looks, feels, and behaves.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {styles.map((style, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bento-card flex flex-col group"
            >
              <div className="flex items-center justify-between mb-8">
                <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500", style.bg)}>
                  <style.icon className={cn("w-8 h-8", style.iconColor)} />
                </div>
                <span className="px-4 py-1 rounded-full bg-foreground text-background text-[10px] font-black uppercase tracking-widest">
                  {style.badge}
                </span>
              </div>
              
              <h3 className="text-3xl font-black tracking-tighter mb-4 uppercase">{style.name}</h3>
              <p className="text-lg text-muted-foreground font-medium leading-tight mb-8 flex-1">
                {style.description}
              </p>

              <div className="space-y-3">
                {style.features.map((feature, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <CheckCircle2 className={cn("w-4 h-4", style.iconColor)} />
                    <span className="text-sm font-bold tracking-tight">{feature}</span>
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
