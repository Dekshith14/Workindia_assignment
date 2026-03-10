import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { lovable } from '@/integrations/lovable/index';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

export default function AuthPage() {
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  if (user) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (isSignUp) {
      const { error } = await signUp(email, password);
      if (error) setError(error.message);
      else setMessage('Check your email for the confirmation link.');
    } else {
      const { error } = await signIn(email, password);
      if (error) setError(error.message);
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (error) setError(error.message);
  };

  return (
    <div className="flex min-h-screen bg-background bg-grid relative overflow-hidden">
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />

      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-md text-center px-12"
        >
          <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-8 glow-primary">
            <FileText className="h-8 w-8 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-4">ResumeForge</h2>
          <p className="text-muted-foreground leading-relaxed">
            Craft professional resumes with AI assistance, beautiful templates, and real-time preview.
          </p>
        </motion.div>
      </div>

      {/* Auth form */}
      <div className="flex-1 flex items-center justify-center relative z-10 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-full max-w-sm"
        >
          <div className="glass glass-border rounded-2xl p-8">
            <div className="text-center mb-8">
              <div className="lg:hidden h-10 w-10 rounded-xl bg-primary flex items-center justify-center mx-auto mb-4">
                <FileText className="h-5 w-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                {isSignUp ? 'Create account' : 'Welcome back'}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {isSignUp ? 'Start building your resume.' : 'Sign in to continue.'}
              </p>
            </div>

            {/* Google sign-in */}
            <Button
              variant="outline"
              className="w-full mb-6 h-11 glass-border"
              onClick={handleGoogleSignIn}
            >
              <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </Button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-3 text-muted-foreground">or</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-medium">Email</Label>
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="h-11 bg-secondary/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-medium">Password</Label>
                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} className="h-11 bg-secondary/50" />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}
              {message && <p className="text-sm text-accent">{message}</p>}

              <Button type="submit" className="w-full h-11 glow-primary" disabled={loading}>
                {loading ? 'Please wait...' : isSignUp ? 'Create account' : 'Sign in'}
              </Button>
            </form>

            <button
              onClick={() => { setIsSignUp(!isSignUp); setError(''); setMessage(''); }}
              className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors mt-6"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
