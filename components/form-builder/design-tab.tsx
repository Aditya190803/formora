'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RotateCcw, ImagePlus, XCircle } from 'lucide-react';
import { FormStyle } from '@/lib/types';
import { cn } from '@/lib/utils';
import { styleIcons, fontFamilies } from './constants';

interface DesignTabProps {
  style: FormStyle;
  setStyle: (style: FormStyle) => void;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
  textColor: string;
  setTextColor: (color: string) => void;
  fontFamily: string;
  setFontFamily: (font: string) => void;
  buttonText: string;
  setButtonText: (text: string) => void;
  animationSpeed: number;
  setAnimationSpeed: (speed: number) => void;
  backgroundImage: string;
  setBackgroundImage: (url: string) => void;
  isUploadingImage: boolean;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetDesign: () => void;
}

const formStyles: FormStyle[] = ['classic', 'conversational', 'marketing', 'neo_brutalism', 'minimal'];

export function DesignTab({
  style,
  setStyle,
  primaryColor,
  setPrimaryColor,
  backgroundColor,
  setBackgroundColor,
  textColor,
  setTextColor,
  fontFamily,
  setFontFamily,
  buttonText,
  setButtonText,
  animationSpeed,
  setAnimationSpeed,
  backgroundImage,
  setBackgroundImage,
  isUploadingImage,
  onImageUpload,
  onResetDesign,
}: DesignTabProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-5xl space-y-24"
    >
      {/* Style Selection */}
      <section className="space-y-8">
        <div className="flex items-center justify-between pb-4 border-b border-muted">
          <h3 className="text-[10px] uppercase tracking-[0.5em] opacity-40">Presentation Mode</h3>
          <span className="text-[9px] font-mono opacity-20">5 archetypes</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {formStyles.map((s, idx) => {
            const Icon = styleIcons[s];
            const isSelected = style === s;
            return (
              <motion.button
                key={s}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setStyle(s)}
                className={cn(
                  'relative p-6 flex flex-col items-center gap-4 border transition-all group',
                  isSelected
                    ? 'border-ink bg-ink text-bg'
                    : 'border-muted/60 hover:border-muted bg-transparent hover:bg-muted/5'
                )}
              >
                {isSelected && <div className="absolute top-2 right-2 w-2 h-2 bg-bg rounded-full" />}
                <div
                  className={cn(
                    'w-10 h-10 border flex items-center justify-center transition-colors',
                    isSelected ? 'border-bg/30' : 'border-muted/40 group-hover:border-muted'
                  )}
                >
                  <Icon
                    className={cn(
                      'w-4 h-4 transition-opacity',
                      isSelected ? 'opacity-80' : 'opacity-30 group-hover:opacity-60'
                    )}
                  />
                </div>
                <span className="text-[9px] uppercase tracking-[0.2em] font-medium">
                  {s.replace('_', ' ')}
                </span>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* Visual Parameters */}
      <section className="space-y-8">
        <div className="flex items-center justify-between pb-4 border-b border-muted">
          <h3 className="text-[10px] uppercase tracking-[0.5em] opacity-40">Visual Parameters</h3>
          <button
            onClick={onResetDesign}
            className="text-[9px] uppercase tracking-[0.2em] opacity-30 hover:opacity-100 transition-opacity flex items-center gap-2 px-3 py-1.5 border border-transparent hover:border-muted"
          >
            <RotateCcw className="w-3 h-3" />
            Reset to Default
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          {/* Primary Color */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4 p-6 border border-muted/50 bg-muted/5"
          >
            <Label className="text-[10px] uppercase tracking-[0.3em] opacity-50 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
              Accent Color
            </Label>
            <div className="flex gap-3 items-center">
              <div className="w-14 h-14 border border-muted overflow-hidden">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-full h-full bg-transparent cursor-pointer scale-150"
                />
              </div>
              <Input
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="flex-1 h-10 font-mono text-sm !border-muted focus:!border-ink bg-transparent"
              />
            </div>
          </motion.div>

          {/* Background Color */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="space-y-4 p-6 border border-muted/50 bg-muted/5"
          >
            <Label className="text-[10px] uppercase tracking-[0.3em] opacity-50 flex items-center gap-2">
              <div className="w-2 h-2 border border-muted" style={{ backgroundColor }} />
              Canvas Color
            </Label>
            <div className="flex gap-3 items-center">
              <div className="w-14 h-14 border border-muted overflow-hidden">
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-full h-full bg-transparent cursor-pointer scale-150"
                />
              </div>
              <Input
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="flex-1 h-10 font-mono text-sm !border-muted focus:!border-ink bg-transparent"
              />
            </div>
          </motion.div>

          {/* Font Family */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4 p-6 border border-muted/50 bg-muted/5"
          >
            <Label className="text-[10px] uppercase tracking-[0.3em] opacity-50">Typography Set</Label>
            <Select value={fontFamily} onValueChange={setFontFamily}>
              <SelectTrigger className="h-12 rounded-none border border-muted bg-transparent focus:ring-0 focus:border-ink">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-none border-muted">
                <SelectItem value="sans" className="text-[11px] uppercase tracking-wider">
                  Sans — Standard
                </SelectItem>
                <SelectItem value="serif" className="text-[11px] uppercase tracking-wider">
                  Serif — Editorial
                </SelectItem>
                <SelectItem value="mono" className="text-[11px] uppercase tracking-wider">
                  Mono — Industrial
                </SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          {/* Button Text */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="space-y-4 p-6 border border-muted/50 bg-muted/5"
          >
            <Label className="text-[10px] uppercase tracking-[0.3em] opacity-50">Submit Button Text</Label>
            <Input
              value={buttonText}
              onChange={(e) => setButtonText(e.target.value)}
              placeholder="Submit"
              className="h-12 !border-muted focus:!border-ink bg-transparent font-heading italic text-lg"
            />
          </motion.div>
        </div>
      </section>

      {/* Background Image (for marketing style) */}
      {style === 'marketing' && (
        <section className="space-y-8">
          <div className="flex items-center justify-between pb-4 border-b border-muted">
            <h3 className="text-[10px] uppercase tracking-[0.5em] opacity-40">Background Image</h3>
          </div>
          <div className="flex items-center gap-6">
            {backgroundImage ? (
              <div className="relative w-48 h-32 border border-muted group overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={backgroundImage} alt="Background" className="w-full h-full object-cover" />
                <button
                  onClick={() => setBackgroundImage('')}
                  className="absolute top-2 right-2 bg-destructive text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border border-dashed border-muted bg-muted/5 hover:bg-muted/10 transition-colors cursor-pointer group">
                <div className="flex flex-col items-center justify-center">
                  <ImagePlus className="w-8 h-8 mb-3 opacity-40 group-hover:opacity-60 transition-opacity" />
                  <p className="text-[10px] uppercase tracking-[0.2em] opacity-60">
                    {isUploadingImage ? 'Uploading...' : 'Click to upload'}
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={onImageUpload}
                  disabled={isUploadingImage}
                />
              </label>
            )}
          </div>
        </section>
      )}

      {/* Animation Speed (for conversational style) */}
      {style === 'conversational' && (
        <section className="space-y-8">
          <div className="flex items-center justify-between pb-4 border-b border-muted">
            <h3 className="text-[10px] uppercase tracking-[0.5em] opacity-40">Animation Speed</h3>
            <span className="text-[9px] font-mono opacity-20">{animationSpeed}s</span>
          </div>
          <div className="p-6 border border-muted/50 bg-muted/5">
            <input
              type="range"
              min="0.1"
              max="1.5"
              step="0.1"
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
              className="w-full accent-ink"
            />
          </div>
        </section>
      )}
    </motion.div>
  );
}
