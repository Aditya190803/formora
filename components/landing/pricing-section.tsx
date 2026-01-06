'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started',
    features: [
      'Up to 3 forms',
      'All 3 form styles',
      '100 responses per month',
      'Basic analytics',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$12',
    period: 'per month',
    description: 'For creators and small teams',
    features: [
      'Unlimited forms',
      'All 3 form styles',
      'Unlimited responses',
      'Advanced analytics',
      'Remove branding',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Team',
    price: '$39',
    period: 'per month',
    description: 'For growing teams',
    features: [
      'Everything in Pro',
      'Up to 5 team members',
      'Team collaboration',
      'Custom domains',
      'API access',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto mb-24"
        >
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[0.9] uppercase">
            Simple <br />
            <span className="gradient-text">pricing</span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground font-medium tracking-tight">
            Start for free. Upgrade when you need more power.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={cn(
                "relative flex flex-col p-10 rounded-[3rem] border-4 border-foreground bg-card transition-all duration-500",
                plan.popular ? "shadow-[15px_15px_0px_0px_var(--primary)] -translate-y-4" : "shadow-[15px_15px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[15px_15px_0px_0px_rgba(255,255,255,0.05)]"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest">
                  Most Popular
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-6xl font-black tracking-tighter">{plan.price}</span>
                  <span className="text-muted-foreground font-bold uppercase text-xs">{plan.period}</span>
                </div>
                <p className="mt-4 text-muted-foreground font-medium leading-tight">{plan.description}</p>
              </div>

              <div className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm font-bold tracking-tight">{feature}</span>
                  </div>
                ))}
              </div>

              <Button 
                size="lg" 
                variant={plan.popular ? "default" : "outline"} 
                className={cn(
                  "w-full h-16 text-lg font-black rounded-2xl uppercase",
                  plan.popular ? "bg-primary hover:bg-primary/90" : "border-4 border-foreground hover:bg-foreground hover:text-background"
                )}
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
