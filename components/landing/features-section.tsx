'use client';

import { motion } from 'framer-motion';
import { 
  Paintbrush, 
  Zap, 
  BarChart3, 
  Sparkles,
  Keyboard
} from 'lucide-react';

const features = [
  {
    title: "Experience-First Design",
    description: "Forms that adapt to your intent. Choose from distinct styles that change everything.",
    icon: Sparkles,
    className: "md:col-span-2",
  },
  {
    title: "Lightning Fast",
    description: "Build and publish in under 5 minutes.",
    icon: Zap,
    className: "md:col-span-1",
  },
  {
    title: "Keyboard First",
    description: "Conversational forms optimized for speed and accessibility.",
    icon: Keyboard,
    className: "md:col-span-1",
  },
  {
    title: "Deep Analytics",
    description: "Understand where users drop off and optimize for completion.",
    icon: BarChart3,
    className: "md:col-span-2",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-40 relative overflow-hidden font-body">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-24"
        >
          <p className="text-[10px] uppercase tracking-[0.5em] opacity-40 mb-6">Capabilities</p>
          <h2 className="text-5xl md:text-7xl font-heading tracking-tighter leading-[0.9] italic mb-8">
            Everything You Need to <br />
            <span className="opacity-40">Collect Better Data</span>
          </h2>
          <p className="text-lg opacity-60 max-w-2xl mx-auto">
            Formora isn&apos;t just another form builder. It&apos;s a tool designed to make 
            your data collection as engaging as your brand.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-px bg-muted max-w-5xl mx-auto border border-muted">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`bg-bg p-10 group ${feature.className}`}
            >
              <div className="w-12 h-12 border border-muted flex items-center justify-center mb-8 group-hover:border-ink transition-colors">
                <feature.icon className="w-5 h-5 opacity-40 group-hover:opacity-80 transition-opacity" />
              </div>
              <h3 className="text-xl font-heading italic tracking-tight mb-3">{feature.title}</h3>
              <p className="text-sm opacity-50">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
