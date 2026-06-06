'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Phone, ArrowRight, Bot, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [loginTab, setLoginTab] = useState<'client' | 'agent'>('client');
  const [status, setStatus] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Magic Link Fields
  const [clientPhone, setClientPhone] = useState('');
  const [magicLinkLabel, setMagicLinkLabel] = useState('');

  // Agent Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        const role = user.role?.toUpperCase();
        if (role === 'SUPERADMIN') router.push('/superadmin');
        else if (role === 'ADMIN') router.push('/admin');
        else router.push('/dashboard');
      } catch (e) {
        router.push('/dashboard');
      }
    }
  }, [router]);

  // Handle Client SMS Magic Link Request
  const handleRequestMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientPhone) return;
    setLoading(true);
    setErrorMsg('');
    setStatus('Generating Magic Link...');

    setTimeout(() => {
      setLoading(false);
      setStatus('SMS Magic Link generated successfully! (Demo Mode)');
      setMagicLinkLabel('👉 Click here to login as Client instantly');
    }, 1200);
  };

  // Handle Magic Link Login Redirect
  const handleMagicLinkLogin = () => {
    // Write demo client auth state
    localStorage.setItem('token', 'mock-magic-client-token-' + Math.random().toString(36).substring(7));
    localStorage.setItem('user', JSON.stringify({
      id: 'client-default-user',
      name: 'Septic & Drain Operators',
      email: 'operations@septic-drain.com',
      role: 'CLIENT',
      clientId: 'client-default'
    }));
    router.push('/dashboard');
  };

  // Handle Agent Email/Password login
  const handleAgentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    setErrorMsg('');

    try {
      setStatus('Signing in to Agent Cockpit...');
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid email or password');
      }

      if (data.token) localStorage.setItem('token', data.token);
      if (data.user) localStorage.setItem('user', JSON.stringify(data.user));

      setStatus('Access Granted! Redirecting...');
      const role = data.user?.role?.toUpperCase();
      setTimeout(() => {
        if (role === 'SUPERADMIN') router.push('/superadmin');
        else if (role === 'ADMIN') router.push('/admin');
        else router.push('/dashboard');
      }, 800);
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected connection error occurred.');
      setStatus('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center px-4 pb-16 pt-28 md:px-6">
      {/* Decorative premium background blur */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center overflow-hidden">
        <div className="h-[400px] w-[600px] rounded-full bg-gold/10 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-[460px] rounded-[32px] border border-white/10 bg-glass p-8 shadow-glow text-white"
      >
        {/* Header Icon / Logo */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10 text-gold shadow-sm">
          <Bot size={28} className="animate-pulse" />
        </div>

        {/* Title */}
        <div className="mt-5 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            AI Growth Systems
          </h1>
          <p className="mt-1.5 text-xs text-white/50">
            Secure portal access for clients and agents
          </p>
        </div>

        {/* Tab Selection */}
        <div className="mt-6 flex rounded-xl bg-white/5 p-1 border border-white/5">
          <button
            type="button"
            onClick={() => {
              setLoginTab('client');
              setStatus('');
              setErrorMsg('');
              setMagicLinkLabel('');
            }}
            className={`flex-1 rounded-lg py-2.5 text-xs font-semibold tracking-wide transition ${
              loginTab === 'client' 
                ? 'bg-gold text-background shadow-md' 
                : 'text-white/60 hover:text-white'
            }`}
          >
            Client Command Center
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginTab('agent');
              setStatus('');
              setErrorMsg('');
              setMagicLinkLabel('');
            }}
            className={`flex-1 rounded-lg py-2.5 text-xs font-semibold tracking-wide transition ${
              loginTab === 'agent' 
                ? 'bg-gold text-background shadow-md' 
                : 'text-white/60 hover:text-white'
            }`}
          >
            Agent Dashboard
          </button>
        </div>

        {/* Status / Error Alerts */}
        <AnimatePresence mode="wait">
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-5 rounded-xl border border-red-500/20 bg-red-950/20 p-4 text-xs text-red-300 font-medium"
            >
              {errorMsg}
            </motion.div>
          )}
          {status && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-5 rounded-xl border border-gold/20 bg-gold/5 p-4 text-xs text-gold font-semibold"
            >
              {status}
            </motion.div>
          )}
        </AnimatePresence>

        {/* CLIENT SMS MAGIC LINK LOGIN FORM */}
        {loginTab === 'client' && (
          <div className="mt-6 space-y-4">
            {magicLinkLabel ? (
              <button
                type="button"
                onClick={handleMagicLinkLogin}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 py-4 text-xs font-bold text-emerald-300 transition-all duration-300 hover:scale-[1.01]"
              >
                <Sparkles className="h-4 w-4 text-emerald-400" />
                {magicLinkLabel}
              </button>
            ) : (
              <form onSubmit={handleRequestMagicLink} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-white/50 tracking-wider uppercase">SMS Phone Number</label>
                  <div className="relative mt-2 rounded-xl bg-white/5 border border-white/10 focus-within:border-gold/50 transition">
                    <span className="absolute inset-y-0 left-4 flex items-center text-white/40">
                      <Phone size={16} />
                    </span>
                    <input
                      required
                      type="tel"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-transparent py-3.5 pl-11 pr-4 text-xs text-white outline-none"
                    />
                  </div>
                  <p className="mt-2 text-[10px] text-white/40 leading-relaxed">
                    No password required. Enter your number to receive a temporary magic link to your portal.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gold py-3.5 text-xs font-semibold text-background transition hover:brightness-105"
                >
                  <span>Request SMS Magic Link</span>
                  <ArrowRight size={14} />
                </button>
              </form>
            )}
          </div>
        )}

        {/* AGENT PASSWORD LOGIN FORM */}
        {loginTab === 'agent' && (
          <form onSubmit={handleAgentSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-[10px] font-bold text-white/50 tracking-wider uppercase">Agent Email</label>
              <div className="relative mt-2 rounded-xl bg-white/5 border border-white/10 focus-within:border-gold/50 transition">
                <span className="absolute inset-y-0 left-4 flex items-center text-white/40">
                  <Mail size={16} />
                </span>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="agent@aigrowthsystems.com"
                  className="w-full bg-transparent py-3.5 pl-11 pr-4 text-xs text-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-white/50 tracking-wider uppercase">Password</label>
              <div className="relative mt-2 rounded-xl bg-white/5 border border-white/10 focus-within:border-gold/50 transition">
                <span className="absolute inset-y-0 left-4 flex items-center text-white/40">
                  <Lock size={16} />
                </span>
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent py-3.5 pl-11 pr-4 text-xs text-white outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gold py-3.5 text-xs font-semibold text-background transition hover:brightness-105"
            >
              <span>Verify Credentials</span>
              <ArrowRight size={14} />
            </button>

            <div className="mt-4 rounded-xl bg-white/5 border border-white/5 p-3 text-[10px] text-white/50 leading-relaxed">
              <span className="font-bold text-gold uppercase block mb-1">Demo Credentials:</span>
              <span>Email: <strong className="text-white">superadmin@gmail.com</strong><br />Password: <strong className="text-white">AdminPass123!</strong></span>
            </div>
          </form>
        )}
      </motion.div>
    </main>
  );
}
