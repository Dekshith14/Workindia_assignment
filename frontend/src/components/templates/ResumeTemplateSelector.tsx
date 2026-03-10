import type { TemplateId } from '@/lib/resume-types';
import { Button } from '@/components/ui/button';
import { X, Lock, Check } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  current: TemplateId;
  isPaidUnlocked: boolean;
  onSelect: (t: TemplateId) => void;
  onUnlock: () => void;
  onClose: () => void;
}

const templates: { id: TemplateId; name: string; desc: string; paid: boolean; gradient: string }[] = [
  { id: 'classic', name: 'Classic', desc: 'Traditional centered layout with clear section dividers.', paid: false, gradient: 'from-primary/20 to-primary/5' },
  { id: 'modern', name: 'Modern', desc: 'Left-aligned with accent borders and skill tags.', paid: false, gradient: 'from-accent/20 to-accent/5' },
  { id: 'minimal', name: 'Minimal', desc: 'Clean, typographic design with maximum whitespace.', paid: false, gradient: 'from-muted-foreground/20 to-muted-foreground/5' },
  { id: 'creative', name: 'Creative', desc: 'Bold sidebar layout with color accents and icons.', paid: false, gradient: 'from-primary/30 to-accent/10' },
  { id: 'tech', name: 'Tech', desc: 'Developer-focused with monospace headings and code aesthetic.', paid: false, gradient: 'from-accent/25 to-primary/5' },
  { id: 'executive', name: 'Executive', desc: 'Premium two-column layout with header band.', paid: true, gradient: 'from-primary/15 to-muted/20' },
];

export function ResumeTemplateSelector({ current, isPaidUnlocked, onSelect, onUnlock, onClose }: Props) {
  const [showUpgrade, setShowUpgrade] = useState(false);

  const handleSelect = (t: typeof templates[0]) => {
    if (t.paid && !isPaidUnlocked) {
      setShowUpgrade(true);
      return;
    }
    onSelect(t.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="glass glass-border rounded-2xl w-full max-w-2xl mx-4"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-semibold text-foreground">Choose Template</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-3">
          {templates.map(t => (
            <button
              key={t.id}
              onClick={() => handleSelect(t)}
              className={`text-left rounded-xl overflow-hidden transition-all border ${
                current === t.id
                  ? 'border-primary glow-primary'
                  : 'border-border hover:border-muted-foreground'
              }`}
            >
              <div className={`h-20 bg-gradient-to-b ${t.gradient} flex items-center justify-center relative`}>
                <div className="w-10 h-14 bg-card/80 rounded-sm shadow-sm" />
                {current === t.id && (
                  <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </div>
                )}
                {t.paid && !isPaidUnlocked && (
                  <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-secondary flex items-center justify-center">
                    <Lock className="h-3 w-3 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="p-3">
                <span className="text-sm font-medium text-foreground">{t.name}</span>
                <p className="text-xs text-muted-foreground leading-snug mt-0.5">{t.desc}</p>
              </div>
            </button>
          ))}
        </div>

        <AnimatePresence>
          {showUpgrade && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-border px-6 py-4 flex items-center justify-between"
            >
              <p className="text-sm text-foreground">Unlock the Executive template</p>
              <Button size="sm" className="glow-primary" onClick={() => { onUnlock(); setShowUpgrade(false); onClose(); }}>
                Upgrade
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
