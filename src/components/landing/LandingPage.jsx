import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUI } from '../../store/uiStore';
import {
  CheckCircle, ListTodo, TrendingUp, Sparkles, ArrowRight,
  Zap, Target, Heart, Shield, ChevronDown, ChevronUp,
  Play, BookOpen, MessageCircle, Mail, Twitter, Github,
  Instagram, RefreshCw,
} from 'lucide-react';
import UnionLogo from '../../Union.svg';
import MikoLogo from '../../miko.svg';

const ROASTS = [
  { emoji: '💀', title: "You're cooked.", message: "Zero streak. 12/100. You didn't just fail your habits — you abandoned them. Pick ONE habit. Just one. Do it today.", mood: 'dead' },
  { emoji: '🔥', title: 'This is embarrassing.', message: "You built these habits because you wanted to be better. But wanting isn't enough. Right now the answer is clearly no.", mood: 'savage' },
  { emoji: '⭐', title: 'Top tier consistency.', message: "87/100. 14 day streak. You're in the top percentile of people who actually follow through. Keep the standard high.", mood: 'elite' },
  { emoji: '🎯', title: 'Good. Not good enough.', message: "64/100 — you're doing okay but Morning Exercise is dragging you down. You don't get to call yourself disciplined while ignoring weak spots.", mood: 'real' },
  { emoji: '📉', title: "You're going backwards.", message: "You were better before. Now at 38/100 and DECLINING. You had it and you let it slip. Stop the bleeding. Today.", mood: 'tough' },
];

const getMoodColor = (mood) => ({ dead: '#dc2626', savage: '#ef4444', tough: '#f97316', real: '#eab308', hype: '#3b82f6', elite: '#22c55e' }[mood] || '#8b5cf6');
const getMoodGradient = (mood) => ({ dead: 'linear-gradient(135deg,#450a0a,#7f1d1d)', savage: 'linear-gradient(135deg,#7f1d1d,#991b1b)', tough: 'linear-gradient(135deg,#431407,#7c2d12)', real: 'linear-gradient(135deg,#422006,#713f12)', elite: 'linear-gradient(135deg,#052e16,#14532d)' }[mood] || 'linear-gradient(135deg,#1e1b4b,#312e81)');
const getMoodLabel = (mood) => ({ dead: '☠️ CRITICAL', savage: '🔥 SAVAGE MODE', tough: '⚠️ TOUGH LOVE', real: '🎯 REAL TALK', elite: '👑 ELITE' }[mood] || '💬 COACH');

const LandingPage = () => {
  const navigate = useNavigate();
  const { theme } = useUI();
  const isDark = theme === 'dark';

  const [openFaq, setOpenFaq] = useState(null);
  const [roastIndex, setRoastIndex] = useState(0);
  const [roastVisible, setRoastVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setRoastVisible(false);
      setTimeout(() => { setRoastIndex(i => (i + 1) % ROASTS.length); setRoastVisible(true); }, 350);
    }, 3800);
    return () => clearInterval(id);
  }, []);

  const cycleRoast = () => { setRoastVisible(false); setTimeout(() => { setRoastIndex(i => (i + 1) % ROASTS.length); setRoastVisible(true); }, 200); };
  const jumpToRoast = (i) => { setRoastVisible(false); setTimeout(() => { setRoastIndex(i); setRoastVisible(true); }, 200); };

  const currentRoast = ROASTS[roastIndex];

  const bg     = isDark ? '#000000' : '#fafafa';
  const cardBg = isDark ? '#0a0a0a' : '#ffffff';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  const altBg  = isDark ? '#050505' : '#f5f5f5';
  const tp     = isDark ? '#ffffff' : '#171717';
  const ts     = isDark ? '#a3a3a3' : '#737373';
  const tm     = isDark ? '#666666' : '#a3a3a3';

  const features = [
    { icon: Sparkles,    color: '#8b5cf6', tag: 'Unique', title: 'Ruthless AI Coach',      desc: '12 coach personalities from savage roasts to elite hype. Adapts to your real score and streak — tells you the truth, not what you want to hear.' },
    { icon: TrendingUp,  color: '#ef4444', tag: 'Unique', title: 'ML Failure Prediction',  desc: "Random Forest model analyzes your patterns and predicts which habits you'll skip tomorrow — before it happens. No other tracker does this." },
    { icon: CheckCircle, color: '#f97316', tag: 'Unique', title: 'Failure Risk Score',      desc: 'A 0–100 risk score that shows how close you are to quitting. Protective factors and identified risks — all in one view.' },
    { icon: ListTodo,    color: '#3b82f6', tag: 'Core',   title: 'Habit & Task Tracking',  desc: 'Build consistent routines with streak tracking, completion charts, and smart insights that keep you accountable every day.' },
  ];

  const steps = [
    { number: '01', title: 'Create Your Profile',  desc: 'Sign up in seconds and set your productivity goals. No credit card required.' },
    { number: '02', title: 'Add Habits & Tasks',   desc: 'Create daily habits that align with your goals. The more you track, the smarter the AI gets.' },
    { number: '03', title: 'Get Roasted or Hyped', desc: 'Your AI coach reads your real data and delivers a personalized message. Savage when slipping. Elite when crushing.' },
    { number: '04', title: 'Predict & Prevent',    desc: "See which habits you're likely to skip tomorrow and WHY — so you can fix it before it happens." },
  ];

  const faqs = [
    { q: 'What is FocusForge?', a: "FocusForge is an AI-powered habit tracker that combines machine learning predictions, failure risk scoring, and a ruthless AI coach to help you actually follow through on your goals. It doesn't cheer you on blindly — it tells you the truth." },
    { q: 'Is FocusForge free to use?', a: 'Yes! FocusForge is completely free. Sign up, start tracking habits, and get AI coaching with no credit card required.' },
    { q: 'How does the AI Coach work?', a: 'The AI coach analyzes your productivity score, streak, trend direction, and struggling habits — then generates a personalized message from one of 12 coach personalities. Dead zone gets savage roasts. Elite zone gets hype.' },
    { q: 'What is the Failure Prediction feature?', a: 'A Random Forest ML model trained on your personal habit patterns predicts your success probability for each habit tomorrow. It also gives you a risk score so you can see failure coming before it happens.' },
    { q: 'Can I use FocusForge on mobile?', a: 'FocusForge is a responsive web app that works on any device. Dedicated iOS and Android apps are planned.' },
    { q: 'Is my data secure?', a: 'Absolutely. Your data is encrypted and never shared with third parties. You can export or delete your data at any time.' },
  ];

  return (
    <div style={{ backgroundColor: bg, minHeight: '100vh', fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", color: tp, overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .syne { font-family: 'Syne', sans-serif !important; }
        .lnav { font-size:.875rem; text-decoration:none; transition:color .15s; }
        .lnav:hover { color:#8b5cf6 !important; }
        .lbtn-p { background:linear-gradient(135deg,#8b5cf6,#6366f1); color:#fff; border:none; border-radius:12px; font-weight:600; cursor:pointer; font-family:inherit; transition:transform .2s,box-shadow .2s; box-shadow:0 4px 20px rgba(139,92,246,.35); display:inline-flex; align-items:center; gap:8px; }
        .lbtn-p:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(139,92,246,.5); }
        .lbtn-g { background:transparent; border-radius:12px; font-weight:500; cursor:pointer; font-family:inherit; transition:all .2s; display:inline-flex; align-items:center; gap:8px; }
        .lbtn-g:hover { background:rgba(255,255,255,.05); }
        .feat-card { transition:transform .25s,box-shadow .25s; }
        .feat-card:hover { transform:translateY(-3px); }
        .roast-wrap { transition:opacity .35s ease,transform .35s ease; }
        .roast-wrap.hidden { opacity:0; transform:translateY(10px); }
        .roast-wrap.visible { opacity:1; transform:translateY(0); }
        .dot { height:6px; border-radius:3px; transition:all .3s; cursor:pointer; }
        .social-a { width:44px;height:44px;border-radius:10px;display:flex;align-items:center;justify-content:center;transition:transform .2s;text-decoration:none; }
        .social-a:hover { transform:scale(1.1); }
        .footer-l { font-size:.875rem;text-decoration:none;transition:color .15s; }
        .footer-l:hover { color:#8b5cf6 !important; }
        .hamburger { display:none; flex-direction:column; gap:5px; cursor:pointer; background:none; border:none; padding:8px; }
        .hamburger span { display:block; width:22px; height:2px; border-radius:2px; transition:all .25s; }
        .mobile-menu { display:none; position:fixed; top:0; left:0; right:0; bottom:0; z-index:200; flex-direction:column; }
        .mobile-menu.open { display:flex; }

        /* ── layout helpers (class-based so media queries can override) ── */
        .l-nav-inner    { max-width:1200px; margin:0 auto; padding:16px 40px; display:flex; align-items:center; justify-content:space-between; }
        .l-hero         { padding:120px 40px 72px; position:relative; overflow:hidden; }
        .l-hero-grid    { max-width:1200px; margin:0 auto; display:grid; grid-template-columns:1fr 1fr; gap:56px; align-items:center; position:relative; }
        .l-hero-btns    { display:flex; gap:12px; flex-wrap:wrap; margin-bottom:28px; }
        .l-hero-badges  { display:flex; gap:24px; flex-wrap:wrap; }
        .l-stats        { max-width:1200px; margin:0 auto; padding:48px 40px; display:grid; grid-template-columns:repeat(4,1fr); gap:32px; text-align:center; }
        .l-section      { padding:100px 40px; }
        .l-section-alt  { padding:100px 40px; }
        .l-feat-grid    { display:grid; grid-template-columns:repeat(2,1fr); gap:20px; }
        .l-step-grid    { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; position:relative; }
        .l-about-grid   { max-width:1200px; margin:0 auto; display:grid; grid-template-columns:1fr 1fr; gap:80px; align-items:center; }
        .l-about-vals   { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
        .l-cta-inner    { border-radius:28px; padding:72px 48px; text-align:center; position:relative; overflow:hidden; background:linear-gradient(135deg,#8b5cf6 0%,#6366f1 50%,#4f46e5 100%); }
        .l-cta-btn      { background:#fff; color:#7c3aed; border:none; border-radius:12px; padding:15px 40px; font-weight:700; font-size:0.95rem; cursor:pointer; font-family:inherit; display:inline-flex; align-items:center; gap:8px; transition:transform .2s,box-shadow .2s; box-shadow:0 4px 20px rgba(0,0,0,0.2); }
        .l-cta-btn:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(0,0,0,0.25); }
        .l-footer-inner { max-width:1200px; margin:0 auto; }
        .l-footer-grid  { display:grid; grid-template-columns:2fr 1fr 1fr; gap:48px; margin-bottom:48px; }
        .l-footer-pad   { padding:64px 40px 40px; }
        .l-footer-bot   { padding-top:24px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; }
        .l-h2           { font-weight:800; font-size:2.4rem; letter-spacing:-0.02em; line-height:1.15; }
        .l-h1           { font-weight:700; font-size:2.75rem; line-height:1.15; letter-spacing:-0.02em; }
        .l-step-arrow   { position:absolute; top:50%; right:-12px; transform:translateY(-50%); z-index:10; }
        .nav-dtop       { display:flex; gap:10px; }
        .lnav-hide      { display:flex; align-items:center; gap:32px; }

        /* ── GLOBAL overflow guard ── */
        .l-hero { overflow:hidden; }
        /* CTA blobs must clip inside the card */
        .l-cta-inner { overflow:hidden; }

        @media(max-width:768px){
          /* root overflow guard — nothing escapes the viewport */
          html, body { overflow-x:hidden; max-width:100vw; }

          .l-nav-inner   { padding:12px 16px; }
          .lnav-hide     { display:none !important; }
          .nav-dtop      { display:none !important; }
          .hamburger     { display:flex !important; }

          /* push hero content well below the fixed nav (~56px) */
          .l-hero        { padding:80px 16px 48px; overflow:hidden; }
          .l-hero-grid   { grid-template-columns:1fr; gap:32px; }
          .l-h1          { font-size:1.9rem; }
          .l-hero-btns   { flex-direction:column; gap:10px; margin-bottom:20px; width:100%; }
          .l-hero-btns .lbtn-p,
          .l-hero-btns .lbtn-g { width:100%; justify-content:center; padding:14px 16px; font-size:0.9rem; box-sizing:border-box; }
          .l-hero-badges { gap:12px; flex-wrap:wrap; }

          /* hero background blobs — pull them in so they don't cause scroll */
          .l-hero-blob-1 { width:280px !important; height:280px !important; top:-60px !important; left:-60px !important; }
          .l-hero-blob-2 { width:200px !important; height:200px !important; right:0 !important; }

          /* stats — 2-col, clipped */
          .l-stats       { padding:32px 16px; grid-template-columns:1fr 1fr; gap:20px; overflow:hidden; }
          /* stat numbers shrink on small screens */
          .l-stat-num    { font-size:1.9rem !important; }

          .l-section     { padding:52px 16px; }
          .l-section-alt { padding:52px 16px; }
          .l-h2          { font-size:1.75rem; }

          .l-feat-grid   { grid-template-columns:1fr; }
          .l-step-grid   { grid-template-columns:1fr; }
          .l-step-arrow  { display:none; }

          /* about */
          .l-about-grid  { grid-template-columns:1fr; gap:28px; max-width:100%; padding:0 16px; }
          .l-about-vals  { grid-template-columns:1fr; }
          .l-about-img   { order:-1; width:100% !important; max-width:220px !important; margin:0 auto; display:block; height:auto !important; }

          /* CTA — clip blobs, full-width button */
          .l-cta-inner   { padding:40px 20px; border-radius:20px; overflow:hidden; }
          .l-cta-btn     { width:100%; justify-content:center; padding:14px 16px; font-size:0.9rem; box-sizing:border-box; }

          /* footer */
          .l-footer-grid { grid-template-columns:1fr; gap:28px; }
          .l-footer-pad  { padding:44px 16px 28px; }
          .l-footer-bot  { flex-direction:column; align-items:flex-start; }

          /* roast card — prevent overflow */
          .roast-wrap    { width:100%; box-sizing:border-box; overflow:hidden; max-width:100%; }

          /* feature cards */
          .feat-card     { padding:24px !important; }

          /* section inner max-width on mobile — prevent bleed */
          .l-section > div,
          .l-section-alt > div { max-width:100%; box-sizing:border-box; overflow:hidden; }
        }

        @media(max-width:480px){
          .l-h1  { font-size:1.6rem; line-height:1.25; }
          .l-h2  { font-size:1.45rem; }
          .l-hero { padding:72px 14px 40px; }
          .l-section, .l-section-alt { padding:44px 14px; }
          .l-stats { padding:24px 14px; gap:16px; }
          .l-cta-inner { padding:32px 14px; }
          .l-footer-pad { padding:36px 14px 24px; }
          .l-stat-num   { font-size:1.6rem !important; }
          .l-about-grid { padding:0; }
        }
      `}</style>

      {/* ══ MOBILE MENU ═══════════════════════════════════════════════════ */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`} style={{ backgroundColor: isDark ? 'rgba(0,0,0,0.97)' : 'rgba(250,250,250,0.97)', backdropFilter:'blur(20px)', padding:'20px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:40 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <img src={UnionLogo} alt="FocusForge" style={{ width:28, height:'auto' }} />
            <span className="syne" style={{ color:tp, fontWeight:800, fontSize:'1.15rem', letterSpacing:'-0.02em' }}>Focus<span style={{ color:'#8b5cf6' }}>Forge</span></span>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} style={{ background:'none', border:'none', cursor:'pointer', color:ts, fontSize:'1.5rem', lineHeight:1, padding:'4px 8px' }}>✕</button>
        </div>
        <nav style={{ display:'flex', flexDirection:'column', gap:4, marginBottom:40 }}>
          {[['features','Features'],['how-it-works','How It Works'],['faq','FAQ']].map(([id, label]) => (
            <a key={id} href={`#${id}`} onClick={() => setMobileMenuOpen(false)} style={{ color:tp, fontSize:'1.4rem', fontWeight:600, padding:'14px 0', borderBottom:`1px solid ${border}`, textDecoration:'none', fontFamily:"'Syne', sans-serif", letterSpacing:'-0.01em' }}>
              {label}
            </a>
          ))}
        </nav>
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <button className="lbtn-p" style={{ padding:'15px 24px', fontSize:'1rem', justifyContent:'center' }} onClick={() => { setMobileMenuOpen(false); navigate('/register'); }}>Get Started <ArrowRight size={17} /></button>
          <button className="lbtn-g" style={{ padding:'15px 24px', fontSize:'1rem', color:ts, border:`1px solid ${border}`, justifyContent:'center' }} onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}>Login</button>
        </div>
      </div>

      {/* ══ NAV ══════════════════════════════════════════════════════════ */}
      <header style={{ borderBottom:`0.5px solid ${border}`, backgroundColor: isDark ? 'rgba(0,0,0,0.85)' : 'rgba(250,250,250,0.85)', backdropFilter:'blur(20px)', position:'fixed', top:0, left:0, right:0, zIndex:100 }}>
        <div className="l-nav-inner">
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <img src={UnionLogo} alt="FocusForge" style={{ width:28, height:'auto' }} />
            <span className="syne" style={{ color:tp, fontWeight:800, fontSize:'1.15rem', letterSpacing:'-0.02em' }}>Focus<span style={{ color:'#8b5cf6' }}>Forge</span></span>
          </div>
          <nav className="lnav-hide">
            <a href="#features"    className="lnav" style={{ color:ts }}>Features</a>
            <a href="#how-it-works" className="lnav" style={{ color:ts }}>How It Works</a>
            <a href="#faq"         className="lnav" style={{ color:ts }}>FAQ</a>
          </nav>
          <div className="nav-dtop">
            <button className="lbtn-g" style={{ color:ts, border:`1px solid ${border}`, padding:'9px 20px', fontSize:'0.85rem' }} onClick={() => navigate('/login')}>Login</button>
            <button className="lbtn-p" style={{ padding:'9px 20px', fontSize:'0.85rem' }} onClick={() => navigate('/register')}>Get Started <ArrowRight size={15} /></button>
          </div>
          <button className="hamburger" onClick={() => setMobileMenuOpen(true)} aria-label="Open menu">
            <span style={{ background: tp }} />
            <span style={{ background: tp }} />
            <span style={{ background: tp }} />
          </button>
        </div>
      </header>

      {/* ══ HERO ═════════════════════════════════════════════════════════ */}
      <section className="l-hero" style={{ position:'relative' }}>
        <div style={{ position:'absolute', inset:0, pointerEvents:'none', overflow:'hidden' }}>
          <div className="l-hero-blob-1" style={{ position:'absolute', width:600, height:600, borderRadius:'50%', background:'radial-gradient(circle,#8b5cf6,transparent 70%)', opacity:0.07, top:-100, left:-100, filter:'blur(60px)' }} />
          <div className="l-hero-blob-2" style={{ position:'absolute', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle,#ef4444,transparent 70%)', opacity:0.05, bottom:0, right:200, filter:'blur(60px)' }} />
        </div>

        <div className="l-hero-grid">
          {/* Left */}
          <div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:6, background: isDark ? 'rgba(139,92,246,0.15)' : 'rgba(139,92,246,0.1)', border:'1px solid rgba(139,92,246,0.3)', borderRadius:100, padding:'6px 14px', marginBottom:24 }}>
              <Zap size={13} color="#8b5cf6" />
              <span style={{ color:'#a78bfa', fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.07em', textTransform:'uppercase' }}>AI-Powered Habit Tracking</span>
            </div>

            <h1 className="l-h1" style={{ color:tp, marginBottom:20, fontFamily:"'DM Sans', sans-serif" }}>
              The habit tracker that{' '}
              <span style={{ background:'linear-gradient(135deg,#8b5cf6,#a78bfa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>roasts you</span>{' '}
              when you slack.
            </h1>

            <p style={{ color:ts, fontSize:'1rem', lineHeight:1.8, marginBottom:36, maxWidth:440 }}>
              FocusForge uses machine learning to predict your failures before they happen — then tells you what you need to hear, not what you want to hear.
            </p>

            <div className="l-hero-btns">
              <button className="lbtn-p" style={{ padding:'14px 32px', fontSize:'0.95rem' }} onClick={() => navigate('/register')}>Start Building Habits <ArrowRight size={17} /></button>
              <button className="lbtn-g" style={{ padding:'14px 28px', fontSize:'0.95rem', color:ts, border:`1px solid ${border}` }} onClick={() => navigate('/login')}><Play size={15} style={{ color:'#8b5cf6' }} /> I have an account</button>
            </div>

            <div className="l-hero-badges">
              {[{ Icon:Shield, c:'#22c55e', l:'Secure & Private' }, { Icon:Zap, c:'#f59e0b', l:'AI-Powered' }, { Icon:Heart, c:'#ef4444', l:'Free Forever' }].map(({ Icon, c, l }) => (
                <div key={l} style={{ display:'flex', alignItems:'center', gap:6, opacity:0.6 }}>
                  <Icon size={14} color={c} /><span style={{ color:ts, fontSize:'0.8rem' }}>{l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Live Roast Card */}
          <div>
            <div style={{ marginBottom:10, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <span style={{ color: isDark ? '#444' : '#bbb', fontSize:'0.7rem', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase' }}>Live AI Coach Preview</span>
              <button onClick={cycleRoast} style={{ background:'none', border:'none', cursor:'pointer', color: isDark ? '#555' : '#bbb', display:'flex', alignItems:'center', gap:4, fontSize:'0.72rem', fontFamily:'inherit' }}>
                <RefreshCw size={11} /> Next
              </button>
            </div>

            <div className={`roast-wrap ${roastVisible ? 'visible' : 'hidden'}`} style={{ borderRadius:16, overflow:'hidden', border:`2px solid ${getMoodColor(currentRoast.mood)}`, boxShadow:`0 0 36px ${getMoodColor(currentRoast.mood)}2e` }}>
              <div style={{ background:getMoodColor(currentRoast.mood), padding:'5px 16px' }}>
                <span style={{ color:'#fff', fontSize:'0.68rem', fontWeight:700, letterSpacing:'0.1em' }}>{getMoodLabel(currentRoast.mood)}</span>
              </div>
              <div style={{ background:getMoodGradient(currentRoast.mood), padding:'24px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
                  <span style={{ fontSize:'2rem' }}>{currentRoast.emoji}</span>
                  <h3 className="syne" style={{ fontWeight:800, fontSize:'1.05rem', color:'#fff' }}>{currentRoast.title}</h3>
                </div>
                <p style={{ color:'rgba(255,255,255,0.72)', fontSize:'0.875rem', lineHeight:1.7 }}>{currentRoast.message}</p>
                <div style={{ marginTop:14, paddingTop:12, borderTop:`1px solid ${getMoodColor(currentRoast.mood)}44`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ color:'rgba(255,255,255,0.3)', fontSize:'0.68rem' }}>Based on your real data</span>
                  <span style={{ color:getMoodColor(currentRoast.mood), fontSize:'0.72rem', fontWeight:700 }}>⚡ Take action now</span>
                </div>
              </div>
            </div>

            <div style={{ display:'flex', gap:6, justifyContent:'center', marginTop:12 }}>
              {ROASTS.map((_, i) => (
                <div key={i} className="dot" style={{ width: i === roastIndex ? 22 : 6, background: i === roastIndex ? getMoodColor(currentRoast.mood) : (isDark ? '#2a2a2a' : '#ddd') }} onClick={() => jumpToRoast(i)} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ STATS BAR ════════════════════════════════════════════════════ */}
      <div style={{ borderTop:`0.5px solid ${border}`, borderBottom:`0.5px solid ${border}` }}>
        <div className="l-stats">
          {[{ n:'87%', l:'Prediction accuracy' }, { n:'12+', l:'Coach personalities' }, { n:'5', l:'AI insights daily' }, { n:'0', l:'Empty encouragements' }].map(({ n, l }) => (
            <div key={l}>
              <div className="syne l-stat-num" style={{ fontSize:'2.5rem', fontWeight:800, background:'linear-gradient(135deg,#8b5cf6,#a78bfa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', lineHeight:1, marginBottom:6 }}>{n}</div>
              <div style={{ color:tm, fontSize:'0.8rem' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ FEATURES ═════════════════════════════════════════════════════ */}
      <section id="features" className="l-section">
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:64 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:6, background: isDark ? 'rgba(139,92,246,0.12)' : 'rgba(139,92,246,0.08)', border:'1px solid rgba(139,92,246,0.25)', borderRadius:100, padding:'5px 14px', marginBottom:18 }}>
              <span style={{ color:'#a78bfa', fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.07em', textTransform:'uppercase' }}>What makes us different</span>
            </div>
            <h2 className="syne l-h2" style={{ color:tp, marginBottom:14 }}>Everything you need to stay productive</h2>
            <p style={{ color:ts, fontSize:'1rem', maxWidth:480, margin:'0 auto' }}>Other habit trackers cheer you on. FocusForge tells you the truth.</p>
          </div>

          <div className="l-feat-grid">
            {features.map((f, i) => (
              <div key={i} className="feat-card" style={{ padding:'32px', borderRadius:18, backgroundColor:cardBg, border:`0.5px solid ${border}`, boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.05)' }}>
                <div style={{ width:52, height:52, borderRadius:14, background:`${f.color}20`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:18 }}>
                  <f.icon size={26} color={f.color} />
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                  <h3 className="syne" style={{ fontWeight:700, fontSize:'1.05rem', color:tp }}>{f.title}</h3>
                  <span style={{ background:`${f.color}22`, color:f.color, padding:'2px 8px', borderRadius:4, fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.05em' }}>{f.tag}</span>
                </div>
                <p style={{ color:ts, fontSize:'0.875rem', lineHeight:1.75 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ═════════════════════════════════════════════════ */}
      <section id="how-it-works" className="l-section-alt" style={{ backgroundColor:altBg }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:64 }}>
            <h2 className="syne l-h2" style={{ color:tp, marginBottom:14 }}>How FocusForge works</h2>
            <p style={{ color:ts, fontSize:'1rem', maxWidth:420, margin:'0 auto' }}>Get started in minutes and start building better habits today.</p>
          </div>

          <div className="l-step-grid">
            {steps.map((s, i) => (
              <div key={i} style={{ position:'relative' }}>
                <div style={{ padding:'28px', borderRadius:18, backgroundColor:cardBg, border:`0.5px solid ${border}`, height:'100%', position:'relative', overflow:'hidden' }}>
                  <span className="syne" style={{ fontSize:'4.5rem', fontWeight:800, color:'#8b5cf6', opacity:0.08, position:'absolute', top:8, right:12, lineHeight:1 }}>{s.number}</span>
                  <div style={{ width:36, height:36, borderRadius:'50%', background:'rgba(139,92,246,0.15)', border:'1px solid rgba(139,92,246,0.3)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16 }}>
                    <span className="syne" style={{ color:'#8b5cf6', fontWeight:800, fontSize:'0.75rem', letterSpacing:'0.06em' }}>{s.number}</span>
                  </div>
                  <h3 style={{ fontWeight:600, fontSize:'1rem', color:tp, marginBottom:8 }}>{s.title}</h3>
                  <p style={{ color:ts, fontSize:'0.85rem', lineHeight:1.7 }}>{s.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="l-step-arrow">
                    <ArrowRight size={20} color="#8b5cf6" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FAQ ══════════════════════════════════════════════════════════ */}
      <section id="faq" className="l-section">
        <div style={{ maxWidth:720, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:56 }}>
            <h2 className="syne l-h2" style={{ color:tp, marginBottom:14 }}>Frequently Asked Questions</h2>
            <p style={{ color:ts, fontSize:'1rem' }}>Everything you need to know about FocusForge.</p>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ borderRadius:14, overflow:'hidden', backgroundColor:cardBg, border:`0.5px solid ${openFaq === i ? 'rgba(139,92,246,0.4)' : border}`, transition:'border-color .2s' }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width:'100%', padding:'20px 24px', display:'flex', alignItems:'center', justifyContent:'space-between', background:'none', border:'none', cursor:'pointer', textAlign:'left', fontFamily:'inherit' }}>
                  <span style={{ color:tp, fontWeight:500, fontSize:'0.95rem', paddingRight:16 }}>{faq.q}</span>
                  {openFaq === i ? <ChevronUp size={18} color="#8b5cf6" style={{ flexShrink:0 }} /> : <ChevronDown size={18} color="#8b5cf6" style={{ flexShrink:0 }} />}
                </button>
                {openFaq === i && (
                  <div style={{ padding:'0 24px 20px' }}>
                    <p style={{ color:ts, fontSize:'0.875rem', lineHeight:1.75 }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ ABOUT ════════════════════════════════════════════════════════ */}
      <section className="l-section-alt" style={{ backgroundColor:altBg }}>
        <div className="l-about-grid">
          <div>
            <h2 className="syne l-h2" style={{ color:tp, marginBottom:20 }}>About FocusForge</h2>
            <p style={{ color:ts, fontSize:'1rem', lineHeight:1.8, marginBottom:20 }}>
              FocusForge was born from a simple idea: everyone deserves a tool that helps them become the best version of themselves. We believe that productivity shouldn't be complicated or overwhelming.
            </p>
            <p style={{ color:ts, fontSize:'1rem', lineHeight:1.8, marginBottom:36 }}>
              Our mission is to empower individuals to build lasting habits, accomplish their goals, and live more fulfilling lives through the power of consistent daily action — with an AI that's honest enough to tell you when you're falling short.
            </p>
            <div className="l-about-vals">
              {[{ Icon:Target, c:'#8b5cf6', t:'Our Mission', s:'Empowering growth through brutal honesty' }, { Icon:Heart, c:'#3b82f6', t:'Our Values', s:'Simplicity, accountability, real results' }].map(({ Icon, c, t, s }) => (
                <div key={t} style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
                  <div style={{ width:40, height:40, borderRadius:10, background:`${c}18`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <Icon size={18} color={c} />
                  </div>
                  <div>
                    <h4 style={{ color:tp, fontWeight:600, fontSize:'0.9rem', marginBottom:4 }}>{t}</h4>
                    <p style={{ color:ts, fontSize:'0.8rem', lineHeight:1.6 }}>{s}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
            <img src={MikoLogo} alt="FocusForge illustration" className="l-about-img" style={{ width:'100%', maxWidth:420, height:'auto' }} />
          </div>
        </div>
      </section>

      {/* ══ CTA ══════════════════════════════════════════════════════════ */}
      <section className="l-section">
        <div style={{ maxWidth:900, margin:'0 auto' }}>
          <div className="l-cta-inner">
            <div style={{ position:'absolute', top:-80, left:-80, width:280, height:280, borderRadius:'50%', background:'rgba(255,255,255,0.08)', filter:'blur(40px)' }} />
            <div style={{ position:'absolute', bottom:-80, right:-80, width:280, height:280, borderRadius:'50%', background:'rgba(255,255,255,0.08)', filter:'blur(40px)' }} />
            <div style={{ position:'relative', zIndex:1 }}>
              <h2 className="syne l-h2" style={{ color:'#fff', marginBottom:16 }}>Ready to transform your productivity?</h2>
              <p style={{ color:'rgba(255,255,255,0.85)', fontSize:'1rem', marginBottom:36, maxWidth:480, margin:'0 auto 36px', lineHeight:1.7 }}>
                Join users who have already improved their lives with FocusForge. Start building better habits today.
              </p>
              <button className="l-cta-btn" onClick={() => navigate('/login')}>
                Get Started for Free <ArrowRight size={18} />
              </button>
              <p style={{ color:'rgba(255,255,255,0.6)', fontSize:'0.8rem', marginTop:14 }}>No credit card required • Free forever plan available</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ═══════════════════════════════════════════════════════ */}
      <footer className="l-footer-pad" style={{ borderTop:`0.5px solid ${border}`, backgroundColor: isDark ? '#000' : '#fff' }}>
        <div className="l-footer-inner">
          <div className="l-footer-grid">
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
                <img src={UnionLogo} alt="FocusForge" style={{ width:28, height:'auto' }} />
                <span className="syne" style={{ fontWeight:800, fontSize:'1.1rem', color:tp, letterSpacing:'-0.02em' }}>Focus<span style={{ color:'#8b5cf6' }}>Forge</span></span>
              </div>
              <p style={{ color:ts, fontSize:'0.85rem', lineHeight:1.75, maxWidth:280, marginBottom:20 }}>
                Building better habits, one day at a time. AI-powered predictions, ruthless coaching, real accountability.
              </p>
              <div style={{ display:'flex', gap:10 }}>
                {[Twitter, Instagram, Github].map((Icon, i) => (
                  <a key={i} href="#" className="social-a" style={{ backgroundColor: isDark ? '#0a0a0a' : '#f5f5f5' }}>
                    <Icon size={16} color={ts} />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{ color:tp, fontWeight:600, fontSize:'0.875rem', marginBottom:16 }}>Product</h4>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {['Features', 'How It Works', 'Pricing', 'FAQ'].map(l => (
                  <a key={l} href={`#${l.toLowerCase().replace(/ /g, '-')}`} className="footer-l" style={{ color:ts }}>{l}</a>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{ color:tp, fontWeight:600, fontSize:'0.875rem', marginBottom:16 }}>Contact</h4>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                <a href="#" className="footer-l" style={{ color:ts, display:'flex', alignItems:'center', gap:6 }}><Mail size={13} /> hello@focusforge.app</a>
                <a href="#" className="footer-l" style={{ color:ts, display:'flex', alignItems:'center', gap:6 }}><MessageCircle size={13} /> Support</a>
                <a href="#" className="footer-l" style={{ color:ts, display:'flex', alignItems:'center', gap:6 }}><BookOpen size={13} /> Documentation</a>
              </div>
            </div>
          </div>

          <div className="l-footer-bot" style={{ borderTop:`0.5px solid ${border}` }}>
            <p style={{ color:tm, fontSize:'0.8rem' }}>© 2026 FocusForge. All rights reserved.</p>
            <div style={{ display:'flex', gap:24 }}>
              <a href="#" className="footer-l" style={{ color:tm, fontSize:'0.8rem' }}>Privacy Policy</a>
              <a href="#" className="footer-l" style={{ color:tm, fontSize:'0.8rem' }}>Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
