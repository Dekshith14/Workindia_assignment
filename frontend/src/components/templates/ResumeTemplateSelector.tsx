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

/* ── Mini SVG Previews for each template ── */

function ClassicPreview() {
  return (
    <svg viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="120" height="160" fill="#fff" />
      {/* Header bar */}
      <rect x="0" y="0" width="120" height="36" fill="#0f172a" />
      <rect x="10" y="8" width="60" height="6" rx="2" fill="#fff" opacity="0.9" />
      <rect x="10" y="19" width="45" height="3" rx="1" fill="#fff" opacity="0.5" />
      <rect x="10" y="26" width="35" height="3" rx="1" fill="#fff" opacity="0.4" />
      {/* Summary */}
      <rect x="10" y="42" width="100" height="2.5" rx="1" fill="#cbd5e1" />
      <rect x="10" y="47" width="80" height="2.5" rx="1" fill="#cbd5e1" />
      <rect x="10" y="52" width="90" height="2.5" rx="1" fill="#cbd5e1" />
      {/* 2-col grid */}
      {/* Left col - Experience */}
      <rect x="10" y="62" width="35" height="3" rx="1" fill="#0f172a" opacity="0.7" />
      <rect x="10" y="67" width="65" height="1.5" rx="1" fill="#e2e8f0" />
      <rect x="10" y="71" width="50" height="2" rx="1" fill="#94a3b8" />
      <rect x="10" y="75" width="65" height="2" rx="1" fill="#cbd5e1" />
      <rect x="10" y="79" width="60" height="2" rx="1" fill="#cbd5e1" />
      <rect x="10" y="85" width="50" height="2" rx="1" fill="#94a3b8" />
      <rect x="10" y="89" width="65" height="2" rx="1" fill="#cbd5e1" />
      <rect x="10" y="93" width="55" height="2" rx="1" fill="#cbd5e1" />
      {/* Right col - Skills */}
      <rect x="83" y="62" width="28" height="3" rx="1" fill="#0f172a" opacity="0.7" />
      <rect x="83" y="67" width="37" height="1.5" rx="1" fill="#e2e8f0" />
      <rect x="83" y="71" width="16" height="5" rx="2" fill="#f1f5f9" />
      <rect x="102" y="71" width="14" height="5" rx="2" fill="#f1f5f9" />
      <rect x="83" y="79" width="20" height="5" rx="2" fill="#f1f5f9" />
      <rect x="106" y="79" width="14" height="5" rx="2" fill="#f1f5f9" />
      <rect x="83" y="87" width="16" height="5" rx="2" fill="#f1f5f9" />
    </svg>
  );
}

function ModernPreview() {
  const c = '#2ba89e';
  return (
    <svg viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="120" height="160" fill="#fff" />
      {/* Name */}
      <rect x="10" y="10" width="70" height="7" rx="2" fill="#111827" />
      <rect x="10" y="21" width="90" height="2" rx="1" fill="#d1d5db" />
      <hr />
      {/* Section divider */}
      <rect x="10" y="27" width="100" height="1" fill="#e5e7eb" />
      {/* Summary text */}
      <rect x="10" y="31" width="100" height="2" rx="1" fill="#e5e7eb" />
      <rect x="10" y="35" width="85" height="2" rx="1" fill="#e5e7eb" />
      {/* Skills */}
      <rect x="10" y="42" width="20" height="2.5" rx="1" fill={c} />
      <rect x="10" y="47" width="18" height="6" rx="3" fill="none" stroke={c} strokeWidth="0.8" />
      <rect x="31" y="47" width="18" height="6" rx="3" fill="none" stroke={c} strokeWidth="0.8" />
      <rect x="52" y="47" width="18" height="6" rx="3" fill="none" stroke={c} strokeWidth="0.8" />
      <rect x="73" y="47" width="18" height="6" rx="3" fill="none" stroke={c} strokeWidth="0.8" />
      {/* Experience */}
      <rect x="10" y="58" width="30" height="2.5" rx="1" fill={c} />
      {/* Entry 1 */}
      <rect x="10" y="64" width="3" height="24" rx="1" fill={c} />
      <rect x="16" y="64" width="40" height="3" rx="1" fill="#374151" />
      <rect x="16" y="69" width="30" height="2" rx="1" fill="#9ca3af" />
      <rect x="16" y="73" width="70" height="2" rx="1" fill="#d1d5db" />
      <rect x="16" y="77" width="60" height="2" rx="1" fill="#d1d5db" />
      <rect x="16" y="81" width="65" height="2" rx="1" fill="#d1d5db" />
      {/* Entry 2 */}
      <rect x="10" y="92" width="3" height="22" rx="1" fill={c} />
      <rect x="16" y="92" width="38" height="3" rx="1" fill="#374151" />
      <rect x="16" y="97" width="28" height="2" rx="1" fill="#9ca3af" />
      <rect x="16" y="101" width="68" height="2" rx="1" fill="#d1d5db" />
      <rect x="16" y="105" width="55" height="2" rx="1" fill="#d1d5db" />
      {/* Education */}
      <rect x="10" y="120" width="28" height="2.5" rx="1" fill={c} />
      <rect x="10" y="125" width="50" height="3" rx="1" fill="#374151" />
      <rect x="10" y="130" width="35" height="2" rx="1" fill="#9ca3af" />
    </svg>
  );
}

function MinimalPreview() {
  return (
    <svg viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="120" height="160" fill="#fff" />
      {/* Name */}
      <rect x="10" y="12" width="65" height="5" rx="1" fill="#111" />
      <rect x="10" y="21" width="90" height="1.5" rx="1" fill="#ddd" />
      {/* Thin divider */}
      <rect x="10" y="27" width="100" height="0.5" fill="#eee" />
      {/* Content lines */}
      <rect x="10" y="32" width="100" height="2" rx="1" fill="#e5e7eb" />
      <rect x="10" y="36" width="75" height="2" rx="1" fill="#e5e7eb" />
      <rect x="10" y="44" width="28" height="2" rx="1" fill="#aaa" />
      {/* Experience entries */}
      <rect x="10" y="50" width="55" height="2.5" rx="1" fill="#333" />
      <rect x="80" y="50" width="30" height="2.5" rx="1" fill="#bbb" />
      <rect x="10" y="55" width="35" height="2" rx="1" fill="#bbb" />
      <rect x="10" y="59" width="95" height="1.5" rx="1" fill="#e5e7eb" />
      <rect x="10" y="63" width="80" height="1.5" rx="1" fill="#e5e7eb" />
      <rect x="10" y="71" width="50" height="2.5" rx="1" fill="#333" />
      <rect x="80" y="71" width="30" height="2.5" rx="1" fill="#bbb" />
      <rect x="10" y="76" width="35" height="2" rx="1" fill="#bbb" />
      <rect x="10" y="80" width="95" height="1.5" rx="1" fill="#e5e7eb" />
      <rect x="10" y="84" width="75" height="1.5" rx="1" fill="#e5e7eb" />
      {/* Education */}
      <rect x="10" y="96" width="25" height="2" rx="1" fill="#aaa" />
      <rect x="10" y="102" width="50" height="2.5" rx="1" fill="#333" />
      <rect x="70" y="102" width="40" height="2.5" rx="1" fill="#bbb" />
      {/* Skills */}
      <rect x="10" y="114" width="20" height="2" rx="1" fill="#aaa" />
      <rect x="10" y="120" width="95" height="1.5" rx="1" fill="#e5e7eb" />
    </svg>
  );
}

function CreativePreview() {
  const pri = '#e08a3a';
  return (
    <svg viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="120" height="160" fill="#fff" />
      {/* Sidebar */}
      <rect x="0" y="0" width="40" height="160" fill="#f5f0eb" />
      {/* Avatar circle */}
      <circle cx="20" cy="22" r="10" fill={pri} opacity="0.85" />
      <text x="20" y="26" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">D</text>
      {/* Sidebar contact label */}
      <rect x="5" y="38" width="18" height="2" rx="1" fill={pri} />
      <rect x="5" y="43" width="30" height="1.5" rx="1" fill="#bbb" />
      <rect x="5" y="47" width="28" height="1.5" rx="1" fill="#bbb" />
      <rect x="5" y="51" width="25" height="1.5" rx="1" fill="#bbb" />
      {/* Sidebar skills label */}
      <rect x="5" y="62" width="18" height="2" rx="1" fill={pri} />
      <rect x="5" y="67" width="12" height="4" rx="2" fill={`${pri}30`} />
      <rect x="19" y="67" width="12" height="4" rx="2" fill={`${pri}30`} />
      <rect x="5" y="74" width="14" height="4" rx="2" fill={`${pri}30`} />
      <rect x="21" y="74" width="10" height="4" rx="2" fill={`${pri}30`} />
      {/* Sidebar education label */}
      <rect x="5" y="86" width="22" height="2" rx="1" fill={pri} />
      <rect x="5" y="91" width="30" height="2.5" rx="1" fill="#555" />
      <rect x="5" y="96" width="25" height="1.5" rx="1" fill="#aaa" />
      {/* Main content */}
      <rect x="48" y="10" width="62" height="7" rx="2" fill="#111" />
      {/* Accent summary bar */}
      <rect x="45" y="21" width="3" height="18" rx="1" fill={pri} />
      <rect x="52" y="21" width="58" height="2" rx="1" fill="#ccc" />
      <rect x="52" y="25" width="52" height="2" rx="1" fill="#ccc" />
      <rect x="52" y="29" width="55" height="2" rx="1" fill="#ccc" />
      {/* Experience section */}
      <rect x="48" y="46" width="28" height="2" rx="1" fill={pri} />
      <rect x="48" y="51" width="50" height="2.5" rx="1" fill="#333" />
      <rect x="48" y="56" width="35" height="1.5" rx="1" fill={pri} />
      <rect x="48" y="60" width="62" height="1.5" rx="1" fill="#ddd" />
      <rect x="48" y="64" width="55" height="1.5" rx="1" fill="#ddd" />
      <rect x="48" y="72" width="45" height="2.5" rx="1" fill="#333" />
      <rect x="48" y="77" width="32" height="1.5" rx="1" fill={pri} />
      <rect x="48" y="81" width="60" height="1.5" rx="1" fill="#ddd" />
      <rect x="48" y="85" width="50" height="1.5" rx="1" fill="#ddd" />
      {/* Projects */}
      <rect x="48" y="96" width="25" height="2" rx="1" fill={pri} />
      <rect x="48" y="101" width="50" height="2.5" rx="1" fill="#333" />
      <rect x="48" y="106" width="62" height="1.5" rx="1" fill="#ddd" />
      <rect x="48" y="110" width="50" height="1.5" rx="1" fill="#ddd" />
    </svg>
  );
}

function TechPreview() {
  const c = '#2ba89e';
  return (
    <svg viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="120" height="160" fill="#fff" />
      {/* Dark terminal header */}
      <rect x="0" y="0" width="120" height="40" fill="#0d1117" rx="0" />
      <rect x="10" y="10" width="55" height="6" rx="1" fill="#e6edf3" />
      <rect x="10" y="20" width="80" height="2" rx="1" fill="#8b949e" />
      <rect x="10" y="26" width="50" height="2" rx="1" fill={c} />
      {/* Code comment style summary */}
      <rect x="10" y="46" width="3" height="20" rx="1" fill={c} />
      <rect x="16" y="46" width="90" height="2" rx="1" fill="#e5e7eb" />
      <rect x="16" y="50" width="75" height="2" rx="1" fill="#e5e7eb" />
      <rect x="16" y="54" width="80" height="2" rx="1" fill="#e5e7eb" />
      {/* // TECH_STACK */}
      <rect x="10" y="72" width="38" height="2.5" rx="1" fill={c} />
      <rect x="10" y="78" width="20" height="5" rx="1" fill="#f6f8fa" stroke="#d0d7de" strokeWidth="0.5" />
      <rect x="33" y="78" width="16" height="5" rx="1" fill="#f6f8fa" stroke="#d0d7de" strokeWidth="0.5" />
      <rect x="52" y="78" width="22" height="5" rx="1" fill="#f6f8fa" stroke="#d0d7de" strokeWidth="0.5" />
      <rect x="77" y="78" width="18" height="5" rx="1" fill="#f6f8fa" stroke="#d0d7de" strokeWidth="0.5" />
      {/* // EXPERIENCE */}
      <rect x="10" y="90" width="40" height="2.5" rx="1" fill={c} />
      <rect x="10" y="96" width="2" height="22" rx="1" fill="#d0d7de" />
      <rect x="15" y="96" width="40" height="2.5" rx="1" fill="#374151" />
      <rect x="15" y="101" width="28" height="1.5" rx="1" fill={c} />
      <rect x="15" y="105" width="80" height="1.5" rx="1" fill="#d1d5db" />
      <rect x="15" y="109" width="70" height="1.5" rx="1" fill="#d1d5db" />
      <rect x="15" y="113" width="75" height="1.5" rx="1" fill="#d1d5db" />
      {/* // EDUCATION */}
      <rect x="10" y="124" width="36" height="2.5" rx="1" fill={c} />
      <rect x="10" y="130" width="50" height="2.5" rx="1" fill="#374151" />
      <rect x="10" y="135" width="38" height="1.5" rx="1" fill="#9ca3af" />
    </svg>
  );
}

function ExecutivePreview() {
  const gold = '#e08a3a';
  return (
    <svg viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="120" height="160" fill="#fff" />
      {/* Dark navy header */}
      <rect x="0" y="0" width="120" height="38" fill="#1a1a2e" />
      <rect x="10" y="9" width="55" height="6" rx="2" fill="#e8e3db" />
      <rect x="10" y="19" width="75" height="2" rx="1" fill="#a0a0b0" />
      <rect x="10" y="25" width="45" height="2" rx="1" fill={gold} />
      {/* Gold accent left border summary */}
      <rect x="10" y="44" width="3" height="16" rx="1" fill={gold} />
      <rect x="17" y="44" width="93" height="2" rx="1" fill="#d1d5db" />
      <rect x="17" y="49" width="80" height="2" rx="1" fill="#d1d5db" />
      <rect x="17" y="54" width="90" height="2" rx="1" fill="#d1d5db" />
      {/* 2-col layout */}
      {/* Left col Experience */}
      <rect x="10" y="66" width="28" height="2.5" rx="1" fill="#999" />
      <rect x="10" y="71" width="48" height="3" rx="1" fill="#111" />
      <rect x="60" y="71.5" width="20" height="2" rx="1" fill="#aaa" />
      <rect x="10" y="76" width="32" height="2" rx="1" fill={gold} />
      <rect x="10" y="80" width="65" height="1.5" rx="1" fill="#e5e7eb" />
      <rect x="10" y="84" width="60" height="1.5" rx="1" fill="#e5e7eb" />
      <rect x="10" y="93" width="44" height="3" rx="1" fill="#111" />
      <rect x="10" y="98" width="30" height="2" rx="1" fill={gold} />
      <rect x="10" y="102" width="65" height="1.5" rx="1" fill="#e5e7eb" />
      <rect x="10" y="106" width="55" height="1.5" rx="1" fill="#e5e7eb" />
      {/* Vertical divider */}
      <rect x="82" y="64" width="0.5" height="88" fill="#e5e7eb" />
      {/* Right col Education */}
      <rect x="87" y="66" width="24" height="2.5" rx="1" fill="#999" />
      <rect x="87" y="71" width="28" height="2.5" rx="1" fill="#111" />
      <rect x="87" y="76" width="24" height="1.5" rx="1" fill="#aaa" />
      <rect x="87" y="80" width="18" height="1.5" rx="1" fill="#bbb" />
      {/* Right col Skills */}
      <rect x="87" y="92" width="20" height="2.5" rx="1" fill="#999" />
      <rect x="87" y="97" width="28" height="1.5" rx="1" fill="#e5e7eb" />
      <rect x="87" y="101" width="24" height="1.5" rx="1" fill="#e5e7eb" />
      <rect x="87" y="105" width="26" height="1.5" rx="1" fill="#e5e7eb" />
      <rect x="87" y="109" width="22" height="1.5" rx="1" fill="#e5e7eb" />
      <rect x="87" y="113" width="28" height="1.5" rx="1" fill="#e5e7eb" />
    </svg>
  );
}

const TEMPLATE_PREVIEWS: Record<TemplateId, React.FC> = {
  classic:   ClassicPreview,
  modern:    ModernPreview,
  minimal:   MinimalPreview,
  creative:  CreativePreview,
  tech:      TechPreview,
  executive: ExecutivePreview,
};

const templates: { id: TemplateId; name: string; desc: string; paid: boolean }[] = [
  { id: 'classic',   name: 'Classic',   desc: 'Traditional layout with header band.',            paid: false },
  { id: 'modern',    name: 'Modern',    desc: 'Left-aligned with accent borders & skill tags.',  paid: false },
  { id: 'minimal',   name: 'Minimal',   desc: 'Clean typography with maximum whitespace.',       paid: false },
  { id: 'creative',  name: 'Creative',  desc: 'Bold sidebar with color accents.',                paid: false },
  { id: 'tech',      name: 'Tech',      desc: 'Developer-focused with dark terminal header.',    paid: false },
  { id: 'executive', name: 'Executive', desc: 'Premium two-column with navy header.',            paid: true  },
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
        className="glass glass-border rounded-2xl w-full max-w-3xl mx-4 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-border shrink-0">
          <div className="min-w-0">
            <h2 className="font-semibold text-foreground text-lg truncate">Beautiful templates</h2>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">Pick a style. Switch anytime.</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Template grid */}
        <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto">
          {templates.map(t => {
            const Preview = TEMPLATE_PREVIEWS[t.id];
            const isActive = current === t.id;
            return (
              <button
                key={t.id}
                onClick={() => handleSelect(t)}
                className={`text-left rounded-xl overflow-hidden transition-all border-2 group ${
                  isActive
                    ? 'border-primary shadow-lg shadow-primary/20'
                    : 'border-border hover:border-primary/40'
                }`}
              >
                {/* Preview thumbnail */}
                <div className="bg-gray-50 dark:bg-zinc-900 relative overflow-hidden aspect-[3/4]">
                  <Preview />

                  {/* Active checkmark */}
                  {isActive && (
                    <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-primary flex items-center justify-center shadow">
                      <Check className="h-3.5 w-3.5 text-primary-foreground" />
                    </div>
                  )}

                  {/* Lock overlay for paid */}
                  {t.paid && !isPaidUnlocked && (
                    <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2">
                      <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="text-xs text-muted-foreground font-medium">Premium</span>
                    </div>
                  )}

                  {/* Hover overlay */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors pointer-events-none" />
                  )}
                </div>

                {/* Label */}
                <div className="p-3 bg-card min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-foreground truncate">{t.name}</span>
                    <div className="flex gap-1 shrink-0">
                      {t.paid && !isPaidUnlocked && (
                        <span className="text-[10px] font-medium bg-primary/10 text-primary px-1.5 py-0.5 rounded whitespace-nowrap">PRO</span>
                      )}
                      {isActive && (
                        <span className="text-[10px] font-medium bg-primary/10 text-primary px-1.5 py-0.5 rounded whitespace-nowrap">Active</span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-snug mt-0.5 line-clamp-2">{t.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Upgrade banner */}
        <AnimatePresence>
          {showUpgrade && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-border px-6 py-4 flex items-center justify-between bg-primary/5 shrink-0"
            >
              <div>
                <p className="text-sm font-medium text-foreground">Unlock the Executive template</p>
                <p className="text-xs text-muted-foreground mt-0.5">One-time unlock, yours forever.</p>
              </div>
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
