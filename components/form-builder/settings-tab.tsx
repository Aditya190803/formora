'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Globe, Shield, BarChart3, Zap, Eye, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface SettingsTabProps {
  formId: string;
  slug: string;
  setSlug: (slug: string) => void;
  limitOneResponse: boolean;
  setLimitOneResponse: (limit: boolean) => void;
}

export function SettingsTab({
  formId,
  slug,
  setSlug,
  limitOneResponse,
  setLimitOneResponse,
}: SettingsTabProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24"
    >
      <div className="lg:col-span-8 space-y-16">
        <section className="space-y-8">
          <div className="flex items-center justify-between pb-4 border-b border-muted">
            <h3 className="text-[10px] uppercase tracking-[0.5em] opacity-40">Access & Distribution</h3>
            <span className="text-[9px] font-mono opacity-20">PUBLIC</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-8 border border-muted/60 bg-muted/5 space-y-6"
          >
            <div className="flex items-center gap-3 text-[9px] uppercase tracking-[0.3em] opacity-40">
              <Globe className="w-3 h-3" />
              <span>Public URL</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm opacity-30 font-mono">formora.com/f/</span>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                placeholder="your-form-slug"
                className="flex-1 h-12 !border-muted focus:!border-ink font-heading italic text-lg bg-transparent"
              />
            </div>
            {slug && (
              <p className="text-[10px] font-mono opacity-30">
                → formora.com/f/{slug}
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex items-center justify-between p-6 border border-muted/60 bg-muted/5 group hover:border-muted transition-colors"
          >
            <div className="space-y-1">
              <div className="text-[11px] uppercase tracking-[0.2em] font-medium flex items-center gap-2">
                <Shield className="w-3 h-3 opacity-40" />
                Single Response Mode
              </div>
              <div className="text-[10px] opacity-40">Limit each user to one submission</div>
            </div>
            <Switch checked={limitOneResponse} onCheckedChange={setLimitOneResponse} />
          </motion.div>
        </section>

        <section className="space-y-8">
          <div className="flex items-center justify-between pb-4 border-b border-muted">
            <h3 className="text-[10px] uppercase tracking-[0.5em] opacity-40">Extensions</h3>
            <span className="text-[9px] font-mono opacity-20">3 AVAILABLE</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                href: `/dashboard/forms/${formId}/analytics`,
                icon: BarChart3,
                label: 'Analytics',
                desc: 'Response metrics & insights',
              },
              {
                href: `/dashboard/forms/${formId}/conditional-logic`,
                icon: Zap,
                label: 'Logic Flows',
                desc: 'Conditional branching rules',
              },
              {
                href: `/dashboard/forms/${formId}/integrations`,
                icon: Globe,
                label: 'Integrations',
                desc: 'Webhooks & notifications',
              },
            ].map((item, idx) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.05 }}
              >
                <Link
                  href={item.href}
                  className="group flex flex-col p-6 border border-muted/60 hover:border-ink bg-transparent hover:bg-muted/5 transition-all h-full"
                >
                  <div className="w-10 h-10 border border-muted/40 flex items-center justify-center mb-6 group-hover:border-ink/30 transition-colors">
                    <item.icon className="w-4 h-4 opacity-30 group-hover:opacity-80 transition-opacity" />
                  </div>
                  <h4 className="text-[11px] uppercase tracking-[0.2em] font-medium mb-2">{item.label}</h4>
                  <p className="text-[10px] opacity-30 group-hover:opacity-50 transition-opacity">{item.desc}</p>
                  <div className="mt-auto pt-6">
                    <span className="text-[9px] uppercase tracking-[0.2em] opacity-0 group-hover:opacity-40 transition-opacity">
                      Configure →
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      <div className="lg:col-span-4">
        <div className="sticky top-32 p-6 border border-dashed border-muted/40 bg-muted/5">
          <div className="text-[9px] uppercase tracking-[0.3em] opacity-30 mb-4">Quick Actions</div>
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start text-[10px] uppercase tracking-[0.2em]"
              asChild
            >
              <Link href={`/f/${slug || formId}`} target="_blank">
                <Eye className="w-3 h-3 mr-2" />
                Preview Form
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start text-[10px] uppercase tracking-[0.2em]"
              onClick={() => {
                const url = `${window.location.origin}/f/${slug || formId}`;
                navigator.clipboard.writeText(url);
                toast.success('Form link copied!');
              }}
            >
              <Copy className="w-3 h-3 mr-2" />
              Copy Link
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
