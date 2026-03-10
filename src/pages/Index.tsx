import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
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
  { name: 'Classic', color: 'from-primary/20 to-primary/5' },
  { name: 'Modern', color: 'from-accent/20 to-accent/5' },
  { name: 'Minimal', color: 'from-muted-foreground/20 to-muted-foreground/5' },
  { name: 'Creative', color: 'from-primary/30 to-accent/10' },
  { name: 'Tech', color: 'from-accent/25 to-primary/5' },
  { name: 'Executive', color: 'from-primary/15 to-muted/20' },
];

export default function Index() {
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
        <Button onClick={handleGetStarted} size="sm" className="glow-primary">
          {user ? 'Dashboard' : 'Get Started'}
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
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

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {templatePreviews.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="glass glass-border rounded-xl overflow-hidden group cursor-pointer hover:border-primary/30 transition-all"
            >
              <div className={`h-32 md:h-44 bg-gradient-to-b ${t.color} flex items-center justify-center`}>
                <div className="w-16 md:w-20 h-20 md:h-28 bg-card/80 rounded-sm shadow-md" />
              </div>
              <div className="px-4 py-3 flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{t.name}</span>
                <Star className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
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
