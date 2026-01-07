'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
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
    <section id="pricing" className="py-40 relative overflow-hidden font-body">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto mb-24"
        >
          <p className="text-[10px] uppercase tracking-[0.5em] text-muted-foreground mb-8">Pricing</p>
          <h2 className="text-5xl md:text-7xl font-heading tracking-tighter leading-[0.85] italic mb-8">
            Simple, <br />
            <span className="opacity-40">transparent pricing</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground opacity-60">
            Start for free. Upgrade when you need more power.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 max-w-6xl mx-auto border border-muted">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={cn(
                "relative flex flex-col p-10 transition-all duration-500",
                i !== plans.length - 1 && "lg:border-r border-muted",
                i !== 0 && "border-t lg:border-t-0 border-muted",
                plan.popular && "bg-muted/30"
              )}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 bg-ink text-bg text-[9px] uppercase tracking-[0.3em]">
                  Popular
                </div>
              )}
              
              <div className="mb-10">
                <p className="text-[10px] uppercase tracking-[0.5em] text-muted-foreground mb-4">{plan.name}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-heading italic tracking-tighter">{plan.price}</span>
                  <span className="text-muted-foreground text-[10px] uppercase tracking-[0.3em] opacity-60">{plan.period}</span>
                </div>
                <p className="mt-4 text-muted-foreground text-sm opacity-60">{plan.description}</p>
              </div>

              <div className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <div className="w-1 h-1 bg-foreground opacity-40 flex-shrink-0" />
                    <span className="text-sm opacity-80">{feature}</span>
                  </div>
                ))}
              </div>

              <Button 
                size="lg" 
                variant={plan.popular ? "default" : "outline"} 
                className={cn(
                  "w-full h-12 text-[11px] uppercase tracking-[0.2em]",
                  plan.popular ? "bg-ink text-bg hover:bg-ink/90" : "border-muted hover:bg-muted"
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
