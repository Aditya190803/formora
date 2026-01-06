'use client';

import { motion } from 'framer-motion';
import { 
  Paintbrush, 
  Zap, 
  BarChart3, 
  Sparkles,
  Keyboard
} from 'lucide-react';
import { BentoGrid, BentoGridItem } from '@/components/novel-ui/bento-grid';

const features = [
  {
    title: "Experience-First Design",
    description: "Forms that adapt to your intent. Choose from distinct styles that change everything.",
    header: <div className="flex flex-1 w-full h-full min-h-[8rem] rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 items-center justify-center shadow-inner"><Sparkles className="w-16 h-16 text-primary" /></div>,
    icon: <Paintbrush className="h-5 w-5 text-primary" />,
    className: "md:col-span-2",
  },
  {
    title: "Lightning Fast",
    description: "Build and publish in under 5 minutes.",
    header: <div className="flex flex-1 w-full h-full min-h-[8rem] rounded-3xl bg-gradient-to-br from-chart-2/20 to-chart-2/5 items-center justify-center shadow-inner"><Zap className="w-16 h-16 text-chart-2" /></div>,
    icon: <Zap className="h-5 w-5 text-chart-2" />,
    className: "md:col-span-1",
  },
  {
    title: "Keyboard First",
    description: "Conversational forms optimized for speed and accessibility.",
    header: <div className="flex flex-1 w-full h-full min-h-[8rem] rounded-3xl bg-gradient-to-br from-chart-3/20 to-chart-3/5 items-center justify-center shadow-inner"><Keyboard className="w-16 h-16 text-chart-3" /></div>,
    icon: <Keyboard className="h-5 w-5 text-chart-3" />,
    className: "md:col-span-1",
  },
  {
    title: "Deep Analytics",
    description: "Understand where users drop off and optimize for completion.",
    header: <div className="flex flex-1 w-full h-full min-h-[8rem] rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 items-center justify-center shadow-inner"><BarChart3 className="w-16 h-16 text-primary" /></div>,
    icon: <BarChart3 className="h-5 w-5 text-primary" />,
    className: "md:col-span-2",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-24"
        >
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 leading-[0.9]">
            Everything you need to <br />
            <span className="gradient-text">collect better data</span>
          </h2>
          <p className="text-xl text-muted-foreground font-medium">
            Formora isn&apos;t just another form builder. It&apos;s a tool designed to make 
            your data collection as engaging as your brand.
          </p>
        </motion.div>

        <BentoGrid>
          {features.map((feature, i) => (
            <BentoGridItem
              key={i}
              title={feature.title}
              description={feature.description}
              header={feature.header}
              icon={feature.icon}
              className={feature.className}
            />
          ))}
        </BentoGrid>
      </div>
    </section>
  );
}
