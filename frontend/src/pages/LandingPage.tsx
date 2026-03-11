import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { motion } from 'framer-motion';
import { FileText, Sparkles, Download, History, Layout, ArrowRight, Zap, Shield, Star } from 'lucide-react';

const features = [
  { icon: FileText, title: 'Smart Editor', desc: 'Split-screen editor with live preview that updates as you type.' },
  { icon: Layout, title: '6 Templates', desc: 'From minimal to creative — switch templates instantly, anytime.' },
  { icon: Sparkles, title: 'AI Powered', desc: 'Generate summaries, improve descriptions, and get skill suggestions.' },
  { icon: Download, title: 'PDF Export', desc: 'Download pixel-perfect PDFs that preserve your template styling.' },
  { icon: History, title: 'Version History', desc: 'Every save creates a snapshot you can browse and restore.' },
  { icon: Shield, title: 'Cloud Sync', desc: 'Your resumes are saved securely and accessible from anywhere.' },
];

const templatePreviews = [
  {
    name: 'Classic', desc: 'Traditional with dark header band',
    svg: (<svg viewBox="0 0 120 160" className="w-full h-full"><rect width="120" height="160" fill="#fff"/><rect x="0" y="0" width="120" height="36" fill="#0f172a"/><rect x="8" y="8" width="50" height="5" rx="1" fill="#fff" opacity="0.9"/><rect x="8" y="17" width="38" height="2.5" rx="1" fill="#fff" opacity="0.5"/><rect x="8" y="25" width="28" height="2" rx="1" fill="#fff" opacity="0.35"/><rect x="8" y="42" width="100" height="2" rx="1" fill="#e2e8f0"/><rect x="8" y="47" width="80" height="2" rx="1" fill="#e2e8f0"/><rect x="8" y="55" width="30" height="2.5" rx="1" fill="#0f172a" opacity="0.6"/><rect x="8" y="59" width="65" height="1" fill="#e2e8f0"/><rect x="8" y="62" width="55" height="2" rx="1" fill="#cbd5e1"/><rect x="8" y="66" width="65" height="2" rx="1" fill="#cbd5e1"/><rect x="8" y="70" width="50" height="2" rx="1" fill="#94a3b8"/><rect x="8" y="74" width="62" height="2" rx="1" fill="#cbd5e1"/><rect x="80" y="55" width="25" height="2.5" rx="1" fill="#0f172a" opacity="0.6"/><rect x="80" y="59" width="35" height="1" fill="#e2e8f0"/><rect x="80" y="63" width="16" height="5" rx="2" fill="#f1f5f9"/><rect x="99" y="63" width="14" height="5" rx="2" fill="#f1f5f9"/><rect x="80" y="71" width="20" height="5" rx="2" fill="#f1f5f9"/></svg>)
  },
  {
    name: 'Modern', desc: 'Left-aligned with teal accents',
    svg: (<svg viewBox="0 0 120 160" className="w-full h-full"><rect width="120" height="160" fill="#fff"/><rect x="8" y="8" width="62" height="7" rx="2" fill="#111"/><rect x="8" y="19" width="82" height="2" rx="1" fill="#d1d5db"/><rect x="8" y="25" width="100" height="1" fill="#e5e7eb"/><rect x="8" y="30" width="22" height="2" rx="1" fill="#2ba89e"/><rect x="8" y="35" width="18" height="5" rx="3" fill="none" stroke="#2ba89e" strokeWidth="1"/><rect x="29" y="35" width="18" height="5" rx="3" fill="none" stroke="#2ba89e" strokeWidth="1"/><rect x="50" y="35" width="18" height="5" rx="3" fill="none" stroke="#2ba89e" strokeWidth="1"/><rect x="8" y="47" width="28" height="2" rx="1" fill="#2ba89e"/><rect x="8" y="53" width="3" height="24" rx="1" fill="#2ba89e"/><rect x="14" y="53" width="42" height="2.5" rx="1" fill="#374151"/><rect x="14" y="58" width="72" height="2" rx="1" fill="#d1d5db"/><rect x="14" y="62" width="62" height="2" rx="1" fill="#d1d5db"/><rect x="14" y="66" width="70" height="2" rx="1" fill="#d1d5db"/><rect x="8" y="82" width="3" height="20" rx="1" fill="#2ba89e"/><rect x="14" y="82" width="38" height="2.5" rx="1" fill="#374151"/><rect x="14" y="87" width="62" height="2" rx="1" fill="#d1d5db"/><rect x="14" y="91" width="55" height="2" rx="1" fill="#d1d5db"/><rect x="8" y="106" width="26" height="2" rx="1" fill="#2ba89e"/><rect x="8" y="111" width="58" height="2.5" rx="1" fill="#374151"/><rect x="8" y="116" width="40" height="2" rx="1" fill="#9ca3af"/></svg>)
  },
  {
    name: 'Minimal', desc: 'Clean lines, maximum whitespace',
    svg: (<svg viewBox="0 0 120 160" className="w-full h-full"><rect width="120" height="160" fill="#fff"/><rect x="8" y="10" width="60" height="5" rx="1" fill="#111"/><rect x="8" y="19" width="92" height="1" rx="1" fill="#ddd"/><rect x="8" y="24" width="100" height="0.5" fill="#eee"/><rect x="8" y="29" width="100" height="2" rx="1" fill="#e5e7eb"/><rect x="8" y="33" width="76" height="2" rx="1" fill="#e5e7eb"/><rect x="8" y="42" width="26" height="2" rx="1" fill="#aaa"/><rect x="8" y="48" width="56" height="2.5" rx="1" fill="#333"/><rect x="80" y="48" width="30" height="2" rx="1" fill="#ccc"/><rect x="8" y="53" width="36" height="1.5" rx="1" fill="#bbb"/><rect x="8" y="57" width="95" height="1.5" rx="1" fill="#e5e7eb"/><rect x="8" y="61" width="82" height="1.5" rx="1" fill="#e5e7eb"/><rect x="8" y="65" width="90" height="1.5" rx="1" fill="#e5e7eb"/><rect x="8" y="74" width="50" height="2.5" rx="1" fill="#333"/><rect x="80" y="74" width="28" height="2" rx="1" fill="#ccc"/><rect x="8" y="79" width="95" height="1.5" rx="1" fill="#e5e7eb"/><rect x="8" y="83" width="76" height="1.5" rx="1" fill="#e5e7eb"/><rect x="8" y="95" width="26" height="2" rx="1" fill="#aaa"/><rect x="8" y="101" width="62" height="2.5" rx="1" fill="#333"/><rect x="8" y="106" width="44" height="1.5" rx="1" fill="#bbb"/><rect x="8" y="117" width="22" height="2" rx="1" fill="#aaa"/><rect x="8" y="122" width="95" height="1.5" rx="1" fill="#e5e7eb"/></svg>)
  },
  {
    name: 'Creative', desc: 'Bold sidebar with warm tones',
    svg: (<svg viewBox="0 0 120 160" className="w-full h-full"><rect width="120" height="160" fill="#fff"/><rect x="0" y="0" width="40" height="160" fill="#f5f0eb"/><circle cx="20" cy="22" r="12" fill="#e08a3a" opacity="0.9"/><text x="20" y="27" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="bold">D</text><rect x="4" y="40" width="22" height="2" rx="1" fill="#e08a3a"/><rect x="4" y="46" width="32" height="1.5" rx="1" fill="#bbb"/><rect x="4" y="50" width="29" height="1.5" rx="1" fill="#bbb"/><rect x="4" y="54" width="26" height="1.5" rx="1" fill="#bbb"/><rect x="4" y="64" width="22" height="2" rx="1" fill="#e08a3a"/><rect x="4" y="69" width="14" height="5" rx="2" fill="#e08a3a25"/><rect x="20" y="69" width="14" height="5" rx="2" fill="#e08a3a25"/><rect x="4" y="77" width="14" height="5" rx="2" fill="#e08a3a25"/><rect x="20" y="77" width="12" height="5" rx="2" fill="#e08a3a25"/><rect x="4" y="88" width="22" height="2" rx="1" fill="#e08a3a"/><rect x="4" y="93" width="32" height="2.5" rx="1" fill="#555"/><rect x="4" y="98" width="28" height="1.5" rx="1" fill="#aaa"/><rect x="4" y="102" width="22" height="1.5" rx="1" fill="#bbb"/><rect x="48" y="8" width="62" height="8" rx="2" fill="#111"/><rect x="45" y="21" width="3" height="18" rx="1" fill="#e08a3a"/><rect x="52" y="22" width="58" height="2" rx="1" fill="#ccc"/><rect x="52" y="26" width="52" height="2" rx="1" fill="#ccc"/><rect x="52" y="30" width="56" height="2" rx="1" fill="#ccc"/><rect x="48" y="46" width="28" height="2" rx="1" fill="#e08a3a"/><rect x="48" y="52" width="52" height="2.5" rx="1" fill="#333"/><rect x="48" y="57" width="36" height="1.5" rx="1" fill="#e08a3a"/><rect x="48" y="61" width="62" height="1.5" rx="1" fill="#ddd"/><rect x="48" y="65" width="56" height="1.5" rx="1" fill="#ddd"/><rect x="48" y="72" width="28" height="2" rx="1" fill="#e08a3a"/><rect x="48" y="78" width="48" height="2.5" rx="1" fill="#333"/><rect x="48" y="83" width="62" height="1.5" rx="1" fill="#ddd"/></svg>)
  },
  {
    name: 'Tech', desc: 'Developer-focused dark header',
    svg: (<svg viewBox="0 0 120 160" className="w-full h-full"><rect width="120" height="160" fill="#fff"/><rect x="0" y="0" width="120" height="40" fill="#0d1117"/><rect x="8" y="10" width="54" height="6" rx="1" fill="#e6edf3"/><rect x="8" y="20" width="80" height="2" rx="1" fill="#8b949e"/><rect x="8" y="26" width="46" height="2" rx="1" fill="#2ba89e"/><rect x="8" y="46" width="12" height="45" rx="1" fill="#f6f8fa" stroke="#e1e4e8" strokeWidth="0.5"/><rect x="8" y="46" width="3" height="20" rx="1" fill="#2ba89e"/><rect x="15" y="46" width="92" height="2" rx="1" fill="#e5e7eb"/><rect x="15" y="50" width="77" height="2" rx="1" fill="#e5e7eb"/><rect x="15" y="54" width="84" height="2" rx="1" fill="#e5e7eb"/><rect x="8" y="72" width="38" height="2" rx="1" fill="#2ba89e"/><rect x="8" y="78" width="22" height="5" rx="1" fill="#f6f8fa" stroke="#d0d7de" strokeWidth="0.5"/><rect x="33" y="78" width="18" height="5" rx="1" fill="#f6f8fa" stroke="#d0d7de" strokeWidth="0.5"/><rect x="54" y="78" width="24" height="5" rx="1" fill="#f6f8fa" stroke="#d0d7de" strokeWidth="0.5"/><rect x="8" y="90" width="42" height="2" rx="1" fill="#2ba89e"/><rect x="8" y="96" width="2" height="24" rx="1" fill="#d0d7de"/><rect x="13" y="96" width="44" height="2.5" rx="1" fill="#374151"/><rect x="13" y="101" width="30" height="1.5" rx="1" fill="#2ba89e"/><rect x="13" y="105" width="77" height="1.5" rx="1" fill="#d1d5db"/><rect x="13" y="109" width="66" height="1.5" rx="1" fill="#d1d5db"/><rect x="13" y="113" width="72" height="1.5" rx="1" fill="#d1d5db"/><rect x="8" y="128" width="38" height="2" rx="1" fill="#2ba89e"/><rect x="8" y="134" width="58" height="2.5" rx="1" fill="#374151"/><rect x="8" y="139" width="42" height="1.5" rx="1" fill="#9ca3af"/></svg>)
  },
  {
    name: 'Executive', desc: 'Premium navy header & gold accents',
    svg: (<svg viewBox="0 0 120 160" className="w-full h-full"><rect width="120" height="160" fill="#fff"/><rect x="0" y="0" width="120" height="38" fill="#1a1a2e"/><rect x="8" y="8" width="56" height="6" rx="2" fill="#e8e3db"/><rect x="8" y="18" width="74" height="2" rx="1" fill="#a0a0b0"/><rect x="8" y="24" width="46" height="2" rx="1" fill="#e08a3a"/><rect x="8" y="44" width="3" height="16" rx="1" fill="#e08a3a"/><rect x="15" y="44" width="95" height="2" rx="1" fill="#d1d5db"/><rect x="15" y="49" width="82" height="2" rx="1" fill="#d1d5db"/><rect x="15" y="54" width="90" height="2" rx="1" fill="#d1d5db"/><rect x="8" y="66" width="28" height="2" rx="1" fill="#999"/><rect x="8" y="72" width="50" height="3" rx="1" fill="#111"/><rect x="62" y="72.5" width="18" height="2" rx="1" fill="#aaa"/><rect x="8" y="77" width="35" height="2" rx="1" fill="#e08a3a"/><rect x="8" y="81" width="65" height="1.5" rx="1" fill="#e5e7eb"/><rect x="8" y="85" width="59" height="1.5" rx="1" fill="#e5e7eb"/><rect x="8" y="93" width="46" height="3" rx="1" fill="#111"/><rect x="8" y="98" width="33" height="2" rx="1" fill="#e08a3a"/><rect x="8" y="102" width="65" height="1.5" rx="1" fill="#e5e7eb"/><rect x="8" y="106" width="55" height="1.5" rx="1" fill="#e5e7eb"/><rect x="82" y="64" width="0.5" height="90" fill="#e5e7eb"/><rect x="87" y="66" width="25" height="2" rx="1" fill="#999"/><rect x="87" y="72" width="29" height="2.5" rx="1" fill="#111"/><rect x="87" y="77" width="25" height="1.5" rx="1" fill="#aaa"/><rect x="87" y="81" width="21" height="1.5" rx="1" fill="#bbb"/><rect x="87" y="92" width="21" height="2" rx="1" fill="#999"/><rect x="87" y="98" width="28" height="1.5" rx="1" fill="#e5e7eb"/><rect x="87" y="102" width="23" height="1.5" rx="1" fill="#e5e7eb"/><rect x="87" y="106" width="26" height="1.5" rx="1" fill="#e5e7eb"/><rect x="87" y="110" width="21" height="1.5" rx="1" fill="#e5e7eb"/><rect x="87" y="114" width="28" height="1.5" rx="1" fill="#e5e7eb"/></svg>)
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    navigate(user ? '/dashboard' : '/auth');
  };

  return (
    <div className="min-h-screen bg-background bg-grid relative overflow-hidden">
      {/* Radial glow */}
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <FileText className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground tracking-tight">ResumeForge</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button onClick={handleGetStarted} size="sm" className="glow-primary">
            {user ? 'Dashboard' : 'Get Started'}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-16 pb-24 md:pt-28 md:pb-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass glass-border text-xs font-medium text-muted-foreground mb-8">
            <Zap className="h-3 w-3 text-primary" />
            AI-powered resume builder
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] mb-6">
            Build resumes that
            <br />
            <span className="text-gradient">land interviews</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Craft professional resumes with AI assistance, beautiful templates, and real-time preview. Export pixel-perfect PDFs in seconds.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" onClick={handleGetStarted} className="glow-primary text-base px-8 h-12">
              Start building — it's free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </motion.div>

        {/* Floating mockup */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 relative"
        >
          <div className="glass glass-border rounded-xl p-1 max-w-3xl mx-auto glow-primary">
            <div className="bg-card rounded-lg overflow-hidden">
              {/* Mock toolbar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/50" />
                  <div className="w-3 h-3 rounded-full bg-primary/40" />
                  <div className="w-3 h-3 rounded-full bg-accent/40" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-xs text-muted-foreground font-mono">resume-editor.app</span>
                </div>
              </div>
              {/* Mock split view */}
              <div className="flex h-64 md:h-80">
                <div className="w-1/2 p-4 space-y-3 border-r border-border">
                  <div className="h-3 w-24 rounded bg-muted animate-pulse" />
                  <div className="h-8 w-full rounded bg-muted/50" />
                  <div className="h-3 w-20 rounded bg-muted animate-pulse" />
                  <div className="h-8 w-full rounded bg-muted/50" />
                  <div className="h-3 w-28 rounded bg-muted animate-pulse" />
                  <div className="h-16 w-full rounded bg-muted/50" />
                  <div className="h-3 w-16 rounded bg-muted animate-pulse" />
                  <div className="flex gap-1.5">
                    <div className="h-6 w-16 rounded bg-primary/20" />
                    <div className="h-6 w-14 rounded bg-accent/20" />
                    <div className="h-6 w-18 rounded bg-primary/15" />
                  </div>
                </div>
                <div className="w-1/2 p-6 flex justify-center">
                  <div className="w-40 md:w-48 bg-secondary rounded-sm p-4 space-y-2.5">
                    <div className="h-4 w-20 mx-auto rounded bg-foreground/20" />
                    <div className="h-1.5 w-28 mx-auto rounded bg-muted-foreground/20" />
                    <div className="h-px bg-border my-2" />
                    <div className="h-2 w-full rounded bg-muted-foreground/15" />
                    <div className="h-2 w-3/4 rounded bg-muted-foreground/15" />
                    <div className="h-2 w-full rounded bg-muted-foreground/15" />
                    <div className="h-px bg-border my-2" />
                    <div className="h-2 w-full rounded bg-muted-foreground/15" />
                    <div className="h-2 w-2/3 rounded bg-muted-foreground/15" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Everything you need</h2>
          <p className="text-muted-foreground text-lg">Professional tools to build standout resumes</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="glass glass-border rounded-xl p-5 hover:border-primary/30 transition-colors group"
            >
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1.5">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Templates showcase */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Beautiful templates</h2>
          <p className="text-muted-foreground text-lg">Pick a style. Switch anytime.</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {templatePreviews.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              onClick={handleGetStarted}
              className="glass glass-border rounded-xl overflow-hidden group cursor-pointer hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 transition-all"
            >
              {/* SVG mini preview */}
              <div className="bg-gray-50 dark:bg-zinc-900 relative overflow-hidden aspect-[3/4] w-full">
                {t.svg}
                {/* hover overlay */}
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/6 transition-colors flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
                  <span className="text-[11px] font-semibold bg-primary text-primary-foreground px-3 py-1.5 rounded-full shadow-lg">
                    Use this template
                  </span>
                </div>
              </div>
              <div className="px-4 py-3 flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-foreground">{t.name}</span>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.desc}</p>
                </div>
                <Star className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 ml-2" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 pb-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass glass-border rounded-2xl p-10 md:p-14 glow-primary"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Ready to build your resume?</h2>
          <p className="text-muted-foreground text-lg mb-8">Join thousands of professionals crafting better resumes.</p>
          <Button size="lg" onClick={handleGetStarted} className="text-base px-10 h-12 glow-primary">
            Get started free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border px-6 py-8 text-center">
        <p className="text-xs text-muted-foreground">© 2026 ResumeForge. Built with care.</p>
      </footer>
    </div>
  );
}
