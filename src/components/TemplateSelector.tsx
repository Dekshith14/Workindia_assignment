import type { TemplateId } from '@/lib/resume-types';
import { Button } from '@/components/ui/button';
import { X, Lock } from 'lucide-react';
import { useState } from 'react';

interface Props {
  current: TemplateId;
  isPaidUnlocked: boolean;
  onSelect: (t: TemplateId) => void;
  onUnlock: () => void;
  onClose: () => void;
}

const templates: { id: TemplateId; name: string; desc: string; paid: boolean }[] = [
  { id: 'classic', name: 'Classic', desc: 'Traditional, centered layout with clear section dividers.', paid: false },
  { id: 'modern', name: 'Modern', desc: 'Left-aligned with accent color borders and skill tags.', paid: false },
  { id: 'executive', name: 'Executive', desc: 'Two-column layout with header band. Premium template.', paid: true },
];

export function TemplateSelector({ current, isPaidUnlocked, onSelect, onUnlock, onClose }: Props) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20">
      <div className="bg-background border border-border rounded-md w-full max-w-lg">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Choose Template</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-4 grid grid-cols-3 gap-3">
          {templates.map(t => (
            <button
              key={t.id}
              onClick={() => handleSelect(t)}
              className={`text-left border rounded-md p-3 transition-colors ${current === t.id ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground'}`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-sm font-medium text-foreground">{t.name}</span>
                {t.paid && !isPaidUnlocked && <Lock className="h-3 w-3 text-muted-foreground" />}
              </div>
              <p className="text-xs text-muted-foreground leading-snug">{t.desc}</p>
              {current === t.id && <span className="text-xs text-primary mt-1 inline-block">Active</span>}
            </button>
          ))}
        </div>

        {showUpgrade && (
          <div className="border-t border-border px-4 py-3 flex items-center justify-between">
            <p className="text-sm text-foreground">Upgrade to unlock the Executive template</p>
            <Button size="sm" onClick={() => { onUnlock(); setShowUpgrade(false); onClose(); }}>
              Upgrade
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
