import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "./supabase";

const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500&display=swap";
document.head.appendChild(fontLink);

const t = {
  bg: "#0A0A0F", surface: "#111118", elevated: "#1C1C28", border: "#222232",
  accent: "#6C63FF", accentDim: "rgba(108,99,255,0.15)", accentGlow: "rgba(108,99,255,0.3)",
  text: "#F0F0F5", muted: "#888899", success: "#22C55E",
};

const css = `
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: ${t.bg}; color: ${t.text}; font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }
h1,h2,h3,h4 { font-family: 'Space Grotesk', sans-serif; }
.app { max-width: 480px; margin: 0 auto; min-height: 100vh; position: relative; }
.nav { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 480px; background: ${t.surface}; border-top: 1px solid ${t.border}; display: flex; z-index: 100; padding: 0 8px 4px; }
.nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 10px 4px 6px; cursor: pointer; color: ${t.muted}; font-size: 10px; font-family: 'Inter', sans-serif; font-weight: 500; letter-spacing: 0.03em; transition: color 0.15s; }
.nav-item.active { color: ${t.accent}; }
.nav-item svg { width: 22px; height: 22px; }
.topbar { position: fixed; top: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 480px; background: ${t.bg}; border-bottom: 1px solid ${t.border}; padding: 14px 20px; display: flex; align-items: center; justify-content: space-between; z-index: 100; }
.topbar-logo { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 20px; color: ${t.text}; letter-spacing: -0.5px; }
.topbar-logo span { color: ${t.accent}; }
.content { padding: 72px 0 80px; }
.feed { padding: 0 16px; display: flex; flex-direction: column; gap: 12px; }
.post-card { background: ${t.surface}; border: 1px solid ${t.border}; border-radius: 14px; padding: 16px; cursor: pointer; transition: border-color 0.2s; }
.post-card:hover { border-color: ${t.accentGlow}; }
.post-card-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 10px; }
.post-type-badge { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; letter-spacing: 0.04em; font-family: 'Space Grotesk', sans-serif; text-transform: uppercase; }
.post-time { font-size: 11px; color: ${t.muted}; }
.post-title { font-family: 'Space Grotesk', sans-serif; font-size: 16px; font-weight: 600; color: ${t.text}; margin-bottom: 6px; line-height: 1.3; }
.post-desc { font-size: 13px; color: ${t.muted}; line-height: 1.55; margin-bottom: 12px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.post-author { display: flex; align-items: center; gap: 8px; }
.avatar { border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-family: 'Space Grotesk', sans-serif; flex-shrink: 0; }
.author-name { font-size: 12px; font-weight: 500; color: ${t.text}; }
.author-role { font-size: 11px; color: ${t.muted}; }
.looking-tags { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 10px; }
.looking-tag { font-size: 10px; padding: 3px 8px; border-radius: 4px; background: ${t.elevated}; color: ${t.muted}; font-weight: 500; font-family: 'Space Grotesk', sans-serif; border: 1px solid ${t.border}; }
.type-idea { background: rgba(251,191,36,0.12); color: #FBBF24; border: 1px solid rgba(251,191,36,0.25); }
.type-project { background: rgba(34,197,94,0.12); color: #22C55E; border: 1px solid rgba(34,197,94,0.25); }
.type-product { background: rgba(108,99,255,0.15); color: #A78BFA; border: 1px solid rgba(108,99,255,0.3); }
.type-startup { background: rgba(239,68,68,0.12); color: #F87171; border: 1px solid rgba(239,68,68,0.25); }
.section-header { padding: 8px 16px 4px; }
.section-label { font-size: 11px; font-weight: 600; color: ${t.muted}; letter-spacing: 0.08em; text-transform: uppercase; font-family: 'Space Grotesk', sans-serif; }
.auth-screen { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; padding: 32px 24px; }
.auth-logo { font-family: 'Space Grotesk', sans-serif; font-size: 36px; font-weight: 700; margin-bottom: 8px; }
.auth-logo span { color: ${t.accent}; }
.auth-tagline { font-size: 14px; color: ${t.muted}; margin-bottom: 48px; text-align: center; line-height: 1.6; }
.auth-card { width: 100%; background: ${t.surface}; border: 1px solid ${t.border}; border-radius: 20px; padding: 28px 24px; }
.auth-tabs { display: flex; background: ${t.elevated}; border-radius: 10px; padding: 3px; margin-bottom: 24px; }
.auth-tab { flex: 1; text-align: center; padding: 8px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: 'Space Grotesk', sans-serif; color: ${t.muted}; transition: all 0.15s; }
.auth-tab.active { background: ${t.accent}; color: white; }
.form-group { margin-bottom: 16px; }
.form-label { font-size: 12px; font-weight: 600; color: ${t.muted}; margin-bottom: 6px; display: block; font-family: 'Space Grotesk', sans-serif; letter-spacing: 0.04em; text-transform: uppercase; }
.form-input { width: 100%; background: ${t.elevated}; border: 1px solid ${t.border}; border-radius: 10px; padding: 12px 14px; font-size: 14px; color: ${t.text}; font-family: 'Inter', sans-serif; outline: none; transition: border-color 0.15s; }
.form-input:focus { border-color: ${t.accent}; }
.form-input::placeholder { color: ${t.muted}; }
.btn-primary { width: 100%; background: ${t.accent}; color: white; border: none; border-radius: 12px; padding: 14px; font-size: 15px; font-weight: 700; font-family: 'Space Grotesk', sans-serif; cursor: pointer; transition: opacity 0.15s; margin-top: 8px; }
.btn-primary:hover { opacity: 0.9; }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.error-msg { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); color: #F87171; border-radius: 10px; padding: 10px 14px; font-size: 13px; margin-bottom: 16px; }
.onboard-screen { padding: 24px 20px; min-height: 100vh; display: flex; flex-direction: column; }
.onboard-step { font-size: 11px; color: ${t.accent}; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; font-family: 'Space Grotesk', sans-serif; margin-bottom: 8px; }
.onboard-title { font-size: 26px; font-weight: 700; line-height: 1.2; margin-bottom: 8px; }
.onboard-sub { font-size: 14px; color: ${t.muted}; margin-bottom: 32px; line-height: 1.5; }
.role-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 24px; }
.role-card { background: ${t.surface}; border: 1.5px solid ${t.border}; border-radius: 12px; padding: 14px 12px; cursor: pointer; transition: all 0.15s; text-align: center; }
.role-card.selected { border-color: ${t.accent}; background: ${t.accentDim}; }
.role-emoji { font-size: 24px; margin-bottom: 6px; }
.role-name { font-size: 13px; font-weight: 600; font-family: 'Space Grotesk', sans-serif; }
.skills-input-wrap { display: flex; gap: 8px; margin-bottom: 12px; }
.skills-input-wrap .form-input { flex: 1; }
.skill-chips { display: flex; flex-wrap: wrap; gap: 6px; }
.skill-chip { background: ${t.accentDim}; border: 1px solid ${t.accentGlow}; color: ${t.accent}; font-size: 12px; padding: 4px 10px; border-radius: 20px; display: flex; align-items: center; gap: 6px; font-weight: 500; }
.skill-chip-remove { cursor: pointer; font-size: 14px; line-height: 1; }
.onboard-footer { margin-top: auto; padding-top: 24px; }
.create-screen { padding: 16px; }
.create-title { font-size: 22px; font-weight: 700; margin-bottom: 6px; }
.create-sub { font-size: 13px; color: ${t.muted}; margin-bottom: 24px; }
.type-selector { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 20px; }
.type-card { border: 1.5px solid ${t.border}; border-radius: 10px; padding: 12px; cursor: pointer; transition: all 0.15s; background: ${t.surface}; }
.type-card.selected { border-color: ${t.accent}; background: ${t.accentDim}; }
.type-card-emoji { font-size: 20px; margin-bottom: 4px; }
.type-card-name { font-size: 12px; font-weight: 700; font-family: 'Space Grotesk', sans-serif; text-transform: uppercase; letter-spacing: 0.05em; }
.type-card-desc { font-size: 11px; color: ${t.muted}; margin-top: 2px; }
.looking-for-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 4px; }
.looking-chip { padding: 7px 14px; border-radius: 8px; border: 1.5px solid ${t.border}; font-size: 12px; font-weight: 600; cursor: pointer; font-family: 'Space Grotesk', sans-serif; transition: all 0.15s; background: ${t.surface}; color: ${t.muted}; }
.looking-chip.selected { border-color: ${t.accent}; color: ${t.accent}; background: ${t.accentDim}; }
.mono-select { display: flex; flex-wrap: wrap; gap: 8px; }
.mono-chip { padding: 7px 14px; border-radius: 8px; border: 1.5px solid ${t.border}; font-size: 12px; font-weight: 600; cursor: pointer; font-family: 'Space Grotesk', sans-serif; transition: all 0.15s; background: ${t.surface}; color: ${t.muted}; }
.mono-chip.selected { border-color: ${t.accent}; color: ${t.accent}; background: ${t.accentDim}; }
.form-textarea { width: 100%; background: ${t.elevated}; border: 1px solid ${t.border}; border-radius: 10px; padding: 12px 14px; font-size: 14px; color: ${t.text}; font-family: 'Inter', sans-serif; outline: none; resize: none; min-height: 100px; transition: border-color 0.15s; }
.form-textarea:focus { border-color: ${t.accent}; }
.form-textarea::placeholder { color: ${t.muted}; }
.detail-screen { padding: 16px; }
.back-btn { display: inline-flex; align-items: center; gap: 6px; color: ${t.muted}; font-size: 13px; font-weight: 500; cursor: pointer; margin-bottom: 20px; font-family: 'Space Grotesk', sans-serif; }
.back-btn:hover { color: ${t.text}; }
.detail-title { font-size: 26px; font-weight: 700; line-height: 1.2; margin-bottom: 12px; }
.detail-desc { font-size: 14px; color: ${t.muted}; line-height: 1.65; margin-bottom: 24px; }
.detail-section-label { font-size: 11px; font-weight: 600; color: ${t.muted}; letter-spacing: 0.08em; text-transform: uppercase; font-family: 'Space Grotesk', sans-serif; margin-bottom: 10px; }
.detail-author-card { background: ${t.surface}; border: 1px solid ${t.border}; border-radius: 12px; padding: 14px; display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
.detail-author-name { font-size: 15px; font-weight: 600; }
.detail-author-role { font-size: 12px; color: ${t.muted}; }
.detail-author-bio { font-size: 12px; color: ${t.muted}; margin-top: 3px; line-height: 1.4; }
.action-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px; }
.action-btn { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; padding: 14px; border-radius: 14px; border: 1.5px solid ${t.border}; background: ${t.surface}; cursor: pointer; transition: all 0.2s; }
.action-btn:hover { border-color: ${t.accent}; background: ${t.accentDim}; }
.action-btn.sent { border-color: ${t.success}; background: rgba(34,197,94,0.08); pointer-events: none; }
.action-emoji { font-size: 20px; }
.action-label { font-size: 11px; font-weight: 700; font-family: 'Space Grotesk', sans-serif; text-transform: uppercase; letter-spacing: 0.05em; color: ${t.text}; }
.action-sublabel { font-size: 10px; color: ${t.muted}; }
.msg-input-wrap { display: flex; gap: 8px; margin-top: 8px; }
.msg-input-wrap .form-input { flex: 1; }
.msg-send-btn { background: ${t.accent}; border: none; border-radius: 10px; padding: 0 16px; color: white; font-weight: 700; cursor: pointer; font-family: 'Space Grotesk', sans-serif; font-size: 13px; }
.msg-send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.notif-screen { padding: 0 16px; }
.thread-card { background: ${t.surface}; border: 1px solid ${t.border}; border-left: 3px solid transparent; border-radius: 12px; padding: 14px; margin-bottom: 10px; cursor: pointer; transition: border-color 0.15s; }
.thread-card.unread { border-color: ${t.border}; }
.thread-header { display: flex; gap: 10px; align-items: flex-start; }
.thread-meta { flex: 1; min-width: 0; }
.thread-name-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.thread-name { font-size: 13px; font-weight: 600; color: ${t.text}; }
.thread-time { font-size: 11px; color: ${t.muted}; flex-shrink: 0; }
.thread-post-line { font-size: 11px; color: ${t.accent}; font-weight: 600; margin-top: 3px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.thread-preview { font-size: 12px; color: ${t.muted}; margin-top: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.thread-unread-dot { width: 8px; height: 8px; border-radius: 50%; margin-top: 5px; flex-shrink: 0; }
.notif-reply-box { margin-top: 12px; padding-top: 12px; border-top: 1px solid ${t.border}; }
.chat-thread { display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; }
.chat-bubble { max-width: 85%; padding: 10px 13px; border-radius: 14px; font-size: 13px; line-height: 1.5; }
.chat-bubble.theirs { align-self: flex-start; background: ${t.elevated}; border: 1px solid ${t.border}; border-bottom-left-radius: 4px; }
.chat-bubble.mine { align-self: flex-end; background: ${t.accentDim}; border: 1px solid ${t.accentGlow}; color: ${t.text}; border-bottom-right-radius: 4px; }
.chat-bubble-meta { font-size: 10px; color: ${t.muted}; margin-top: 4px; }
.profile-screen { padding: 0 16px 24px; }
.profile-hero { text-align: center; padding: 24px 0 20px; }
.profile-avatar-large { width: 72px; height: 72px; border-radius: 18px; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 700; margin: 0 auto 12px; font-family: 'Space Grotesk', sans-serif; }
.profile-name { font-size: 22px; font-weight: 700; }
.profile-role-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; font-family: 'Space Grotesk', sans-serif; letter-spacing: 0.06em; text-transform: uppercase; margin-top: 6px; }
.profile-bio { font-size: 13px; color: ${t.muted}; margin-top: 10px; line-height: 1.55; }
.profile-skills { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; margin-top: 12px; }
.profile-skill { background: ${t.elevated}; border: 1px solid ${t.border}; font-size: 11px; padding: 4px 10px; border-radius: 6px; color: ${t.muted}; font-weight: 500; }
.profile-stats { display: flex; border-top: 1px solid ${t.border}; border-bottom: 1px solid ${t.border}; margin: 16px 0; }
.profile-stat { flex: 1; text-align: center; padding: 14px 0; }
.profile-stat:not(:last-child) { border-right: 1px solid ${t.border}; }
.stat-num { font-size: 22px; font-weight: 700; font-family: 'Space Grotesk', sans-serif; }
.stat-label { font-size: 10px; color: ${t.muted}; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; margin-top: 2px; }
.posts-heading { font-size: 11px; font-weight: 700; font-family: 'Space Grotesk', sans-serif; margin: 16px 0 10px; color: ${t.muted}; text-transform: uppercase; letter-spacing: 0.07em; }
.empty-state { text-align: center; padding: 60px 24px; }
.empty-emoji { font-size: 40px; margin-bottom: 12px; }
.empty-title { font-size: 16px; font-weight: 700; font-family: 'Space Grotesk', sans-serif; margin-bottom: 6px; }
.empty-sub { font-size: 13px; color: ${t.muted}; }
.toast { position: fixed; bottom: 90px; left: 50%; transform: translateX(-50%); background: ${t.elevated}; border: 1px solid ${t.border}; border-radius: 12px; padding: 12px 20px; font-size: 13px; font-weight: 500; z-index: 200; animation: fadeInUp 0.2s ease; white-space: nowrap; }
@keyframes fadeInUp { from { opacity: 0; transform: translateX(-50%) translateY(8px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
.loading { display: flex; align-items: center; justify-content: center; padding: 60px 24px; }
.spinner { width: 28px; height: 28px; border: 2px solid ${t.border}; border-top-color: ${t.accent}; border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.logout-btn { font-size: 12px; color: ${t.muted}; cursor: pointer; font-family: 'Space Grotesk', sans-serif; font-weight: 600; }
.logout-btn:hover { color: #F87171; }
select.form-input { appearance: none; }
.gate-banner { background: ${t.elevated}; border-top: 1px solid ${t.border}; padding: 14px 20px; text-align: center; position: fixed; bottom: 60px; left: 50%; transform: translateX(-50%); width: 100%; max-width: 480px; z-index: 99; }
.gate-banner-text { font-size: 13px; color: ${t.muted}; margin-bottom: 8px; }
.gate-banner-btn { background: ${t.accent}; color: white; border: none; border-radius: 10px; padding: 10px 24px; font-size: 13px; font-weight: 700; font-family: 'Space Grotesk', sans-serif; cursor: pointer; }
`;

const styleEl = document.createElement("style");
styleEl.textContent = css;
document.head.appendChild(styleEl);
const TYPE_CONFIG = {
  idea:    { emoji: "💡", label: "Idea",    desc: "Early concept", className: "type-idea" },
  project: { emoji: "🚀", label: "Project", desc: "In progress",   className: "type-project" },
  product: { emoji: "📦", label: "Product", desc: "Shipped",       className: "type-product" },
  startup: { emoji: "🏢", label: "Startup", desc: "Company",       className: "type-startup" },
};

const ROLES = [
  { id: "Founder",  emoji: "🏗️", label: "Founder" },
  { id: "Builder",  emoji: "⚙️", label: "Builder" },
  { id: "Investor", emoji: "💰", label: "Investor" },
  { id: "Designer", emoji: "🎨", label: "Designer" },
  { id: "Student",  emoji: "🎓", label: "Student" },
  { id: "Other",    emoji: "✨", label: "Other" },
];

const LOOKING_FOR_OPTIONS  = ["Co-founder","Builder","Investor","Buyer","Collaborator","Designer"];
const MONETIZATION_OPTIONS = ["Free collaboration","Equity","Royalty","Sale"];
const CATEGORIES = ["Fintech","HealthTech","Dev Tools","EdTech","Marketplace","Logistics","AgriTech","SaaS","Other"];

const NOTIF_TYPE = {
  "co-build": { label: "Co-build request", color: "#6C63FF", bg: "rgba(108,99,255,0.12)" },
  invest:     { label: "Invest interest",  color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
  buy:        { label: "Buy offer",        color: "#22C55E", bg: "rgba(34,197,94,0.1)" },
  message:    { label: "Message",          color: "#F87171", bg: "rgba(248,113,113,0.1)" },
};

function timeAgo(ts) {
  const diff = (Date.now() - new Date(ts)) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  return `${Math.floor(diff/86400)}d ago`;
}

function initials(name="") {
  return name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
}

function avatarColor(id="") {
  const colors = ["#6C63FF","#22C55E","#F59E0B","#F87171","#38BDF8","#A78BFA"];
  let n = 0; for (const c of id) n += c.charCodeAt(0);
  return colors[n % colors.length];
}

function Avatar({ name, userId, avatarUrl, size=28 }) {
  const color = avatarColor(userId||name||"");
  if (avatarUrl) {
    return (
      <img src={avatarUrl} alt={name} className="avatar" style={{
        width: size, height: size, borderRadius: size*0.28, objectFit: "cover"
      }}/>
    );
  }
  return (
    <div className="avatar" style={{
      width: size, height: size, background: color+"22", color,
      borderRadius: size*0.28, fontSize: size*0.38
    }}>{initials(name)}</div>
  );
}

function PostCard({ post, onClick }) {
  const tc = TYPE_CONFIG[post.type] || TYPE_CONFIG.idea;
  const lf = Array.isArray(post.looking_for) ? post.looking_for : [];
  return (
    <div className="post-card" onClick={onClick}>
      <div className="post-card-header">
        <span className={`post-type-badge ${tc.className}`}>{tc.emoji} {tc.label}</span>
        <span className="post-time">{timeAgo(post.created_at)}</span>
      </div>
      <div className="post-title">{post.title}</div>
      <div className="post-desc">{post.description}</div>
      <div className="looking-tags">{lf.map(l=><span key={l} className="looking-tag">+ {l}</span>)}</div>
      <div style={{borderTop:`1px solid ${t.border}`,marginTop:12,paddingTop:10}}>
        <div className="post-author">
          <Avatar name={post.profiles?.name||"?"} userId={post.user_id} avatarUrl={post.profiles?.avatar_url} size={28}/>
          <div>
            <div className="author-name">{post.profiles?.name||"Builder"}</div>
            <div className="author-role">{post.profiles?.role||""}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GateBanner({ onLogin }) {
  return (
    <div className="gate-banner">
      <div className="gate-banner-text">Join Genxix to post, co-build, invest and connect</div>
      <button className="gate-banner-btn" onClick={onLogin}>Sign up free →</button>
    </div>
  );
}

function AuthScreen({ onAuth }) {
  const [tab, setTab] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setErr(""); setLoading(true);
    try {
      if (tab === "signup") {
        const { data, error } = await supabase.auth.signUp({ email, password: pass });
        if (error) throw error;
        await supabase.from("profiles").insert({ id: data.user.id, name, email });
        onAuth(data.user, { name, needsOnboard: true });
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
        if (error) throw error;
        onAuth(data.user, { needsOnboard: false });
      }
    } catch(e) { setErr(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-screen">
      <div className="auth-logo">Gen<span>xix</span></div>
      <div className="auth-tagline">The builder network.<br/>Share what you're building. Find who you need.</div>
      <div className="auth-card">
        <div className="auth-tabs">
          <div className={`auth-tab ${tab==="login"?"active":""}`} onClick={()=>{setTab("login");setErr("");}}>Log in</div>
          <div className={`auth-tab ${tab==="signup"?"active":""}`} onClick={()=>{setTab("signup");setErr("");}}>Sign up</div>
        </div>
        {err && <div className="error-msg">{err}</div>}
        {tab==="signup" && (
          <div className="form-group">
            <label className="form-label">Full name</label>
            <input className="form-input" placeholder="Your name" value={name} onChange={e=>setName(e.target.value)}/>
          </div>
        )}
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)}/>
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" placeholder="••••••••" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()}/>
        </div>
        <button className="btn-primary" onClick={handle} disabled={loading||!email||!pass}>
          {loading ? "..." : tab==="login" ? "Log in →" : "Create account →"}
        </button>
      </div>
    </div>
  );
}

function OnboardScreen({ user, onComplete }) {
  const [step, setStep]       = useState(1);
  const [role, setRole]       = useState("");
  const [bio, setBio]         = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) { setSkills([...skills, s]); setSkillInput(""); }
  };

  const handlePhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (!error) {
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      setAvatarUrl(data.publicUrl + "?t=" + Date.now());
    }
    setUploading(false);
  };

  const finish = async () => {
    setLoading(true);
    await supabase.from("profiles").upsert({ id: user.id, role, bio, skills, avatar_url: avatarUrl });
    onComplete({ role, bio, skills, avatar_url: avatarUrl });
    setLoading(false);
  };

  return (
    <div className="onboard-screen">
      <div className="onboard-step">Setup · Step {step} of 2</div>
      {step===1 ? (
        <>
          <div className="onboard-title">What's your role?</div>
          <div className="onboard-sub">This helps builders know who they're talking to.</div>
          <div className="role-grid">
            {ROLES.map(r=>(
              <div key={r.id} className={`role-card ${role===r.id?"selected":""}`} onClick={()=>setRole(r.id)}>
                <div className="role-emoji">{r.emoji}</div>
                <div className="role-name">{r.label}</div>
              </div>
            ))}
          </div>
          <div className="onboard-footer">
            <button className="btn-primary" onClick={()=>setStep(2)} disabled={!role}>Continue →</button>
          </div>
        </>
      ) : (
        <>
          <div className="onboard-title">What are you building?</div>
          <div className="onboard-sub">Quick bio and skills. You can update this anytime.</div>
          <div className="form-group" style={{textAlign:"center"}}>
            <label htmlFor="avatar-upload-onboard" style={{cursor:"pointer", display:"inline-block"}}>
              {avatarUrl ? (
                <img src={avatarUrl} alt="avatar" style={{width:80,height:80,borderRadius:20,objectFit:"cover",border:`2px solid ${t.border}`}}/>
              ) : (
                <div style={{width:80,height:80,borderRadius:20,background:t.elevated,border:`1.5px dashed ${t.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,color:t.muted}}>
                  {uploading ? "..." : "+"}
                </div>
              )}
              <div style={{fontSize:11,color:t.accent,marginTop:6,fontWeight:600}}>{avatarUrl?"Change photo":"Add photo"}</div>
            </label>
            <input id="avatar-upload-onboard" type="file" accept="image/*" style={{display:"none"}} onChange={handlePhoto}/>
          </div>
          <div className="form-group">
            <label className="form-label">Bio</label>
            <textarea className="form-textarea" placeholder="I'm building ___. Looking for ___." value={bio} onChange={e=>setBio(e.target.value)} style={{minHeight:70}}/>
          </div>
          <div className="form-group">
            <label className="form-label">Skills / Interests</label>
            <div className="skills-input-wrap">
              <input className="form-input" placeholder="e.g. React, Fundraising" value={skillInput}
                onChange={e=>setSkillInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addSkill()}/>
              <button className="msg-send-btn" onClick={addSkill} style={{borderRadius:10,padding:"0 14px"}}>Add</button>
            </div>
            <div className="skill-chips">
              {skills.map(s=>(
                <span key={s} className="skill-chip">{s}
                  <span className="skill-chip-remove" onClick={()=>setSkills(skills.filter(x=>x!==s))}>×</span>
                </span>
              ))}
            </div>
          </div>
          <div className="onboard-footer">
            <button className="btn-primary" onClick={finish} disabled={loading}>
              {loading?"Saving...":"Enter Genxix →"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function FeedScreen({ posts, loading, onPostClick, onCreateClick, onBuildClick, isGuest }) {
  return (
    <>
      <div className="topbar">
        <div className="topbar-logo">Gen<span>xix</span></div>
        <div style={{display:"flex",gap:8}}>
          {!isGuest && (
            <button onClick={onBuildClick} style={{background:"transparent",border:`1px solid ${t.accentGlow}`,borderRadius:10,padding:"8px 14px",color:t.accent,fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:13,cursor:"pointer"}}>✨ Build with AI</button>
          )}
          {!isGuest && <button onClick={onCreateClick} style={{background:t.accent,border:"none",borderRadius:10,padding:"8px 16px",color:"white",fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:13,cursor:"pointer"}}>+ Post</button>}
          {isGuest && <button onClick={onCreateClick} style={{background:"transparent",border:`1px solid ${t.border}`,borderRadius:10,padding:"8px 16px",color:t.text,fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:13,cursor:"pointer"}}>Log in</button>}
        </div>
      </div>
      <div className="content" style={{paddingBottom: isGuest ? "140px" : "80px"}}>
        <div className="feed">
          <div className="section-header"><div className="section-label">Latest from builders</div></div>
          {loading ? <div className="loading"><div className="spinner"/></div>
            : posts.length===0 ? (
              <div className="empty-state">
                <div className="empty-emoji">🔭</div>
                <div className="empty-title">No posts yet</div>
                <div className="empty-sub">Be the first builder. Tap + Post.</div>
              </div>
            ) : posts.map(p=><PostCard key={p.id} post={p} onClick={()=>onPostClick(p)}/>)
          }
        </div>
      </div>
    </>
  );
}

function PostDetailScreen({ post, currentUser, onBack, showToast, onLoginRequired }) {
  const [sent, setSent] = useState({});
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const tc = TYPE_CONFIG[post.type]||TYPE_CONFIG.idea;
  const lf = Array.isArray(post.looking_for)?post.looking_for:[];
  const isOwn = currentUser && post.user_id === currentUser.id;
  const isGuest = !currentUser;
  const profile = post.profiles || {};

  const interact = async (type, message="") => {
    if (!currentUser) { onLoginRequired(); return; }
    if (sent[type]) return;
    setLoading(true);
    const { error } = await supabase.from("interactions").insert({
      user_id: currentUser.id, post_id: post.id, recipient_id: post.user_id, type, message
    });
    if (!error) {
      setSent(prev=>({...prev,[type]:true}));
      const labels = {"co-build":"Co-build request sent!",invest:"Investment interest sent!",buy:"Offer sent!",message:"Message sent!"};
      showToast(labels[type]||"Sent!");
    }
    setLoading(false);
  };

  const actions = [
    {type:"co-build", emoji:"🤝", label:"Co-build", sub:"Build together"},
    {type:"invest",   emoji:"💰", label:"Invest",   sub:"Express interest"},
    {type:"buy",      emoji:"🧠", label:"Buy",      sub:"Make an offer"},
  ];

  return (
    <>
      <div className="topbar">
        <div className="back-btn" onClick={onBack}>← Back</div>
        <div style={{width:40}}/>
      </div>
      <div className="content">
        <div className="detail-screen">
          <div style={{marginBottom:12}}>
            <span className={`post-type-badge ${tc.className}`}>{tc.emoji} {tc.label}</span>
            <span style={{marginLeft:8,fontSize:12,color:t.muted}}>{post.category} · {timeAgo(post.created_at)}</span>
          </div>
          <div className="detail-title">{post.title}</div>
          <div className="detail-desc">{post.description}</div>
          <div className="detail-section-label">Builder</div>
          <div className="detail-author-card">
            <Avatar name={profile.name||"?"} userId={post.user_id} avatarUrl={profile.avatar_url} size={44}/>
            <div>
              <div className="detail-author-name">{profile.name||"Builder"}</div>
              <div className="detail-author-role">{profile.role||""}</div>
              {profile.bio && <div className="detail-author-bio">{profile.bio}</div>}
            </div>
          </div>
          <div className="detail-section-label">Looking for</div>
          <div className="looking-tags" style={{marginBottom:24}}>{lf.map(l=><span key={l} className="looking-tag">+ {l}</span>)}</div>
          {post.monetization_type && (
            <>
              <div className="detail-section-label">Collaboration type</div>
              <div style={{fontSize:14,color:t.text,marginBottom:24,fontWeight:600}}>{post.monetization_type}</div>
            </>
          )}
          {!isOwn && (
            <>
              <div className="detail-section-label">Connect</div>
              <div className="action-grid">
                {actions.map(a=>(
                  <div key={a.type} className={`action-btn ${sent[a.type]?"sent":""}`} onClick={()=>!loading&&interact(a.type)}>
                    <div className="action-emoji">{sent[a.type]?"✅":a.emoji}</div>
                    <div className="action-label">{sent[a.type]?"Sent":a.label}</div>
                    <div className="action-sublabel">{isGuest?"Sign up to connect":sent[a.type]?"Request delivered":a.sub}</div>
                  </div>
                ))}
                <div className="action-btn" onClick={()=>interact("message")}>
                  <div className="action-emoji">💬</div>
                  <div className="action-label">Message</div>
                  <div className="action-sublabel">{isGuest?"Sign up to message":"Direct message"}</div>
                </div>
              </div>
              {!isGuest && (
                <div className="msg-input-wrap">
                  <input className="form-input" placeholder="Send a message..." value={msg} onChange={e=>setMsg(e.target.value)}/>
                  <button className="msg-send-btn" onClick={()=>{if(msg.trim()){interact("message",msg);setMsg("");}}} disabled={loading}>Send</button>
                </div>
              )}
              {isGuest && (
                <button className="btn-primary" onClick={onLoginRequired} style={{marginTop:8}}>Sign up to connect →</button>
              )}
            </>
          )}
          {isOwn && (
            <div style={{background:t.elevated,border:`1px solid ${t.border}`,borderRadius:12,padding:16,textAlign:"center"}}>
              <div style={{fontSize:13,color:t.muted}}>This is your post. Share Genxix to get collaborators.</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function CreatePostScreen({ currentUser, onBack, onPublished }) {
  const [type, setType] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("");
  const [lookingFor, setLookingFor] = useState([]);
  const [mono, setMono] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const toggleLF = v => setLookingFor(prev=>prev.includes(v)?prev.filter(x=>x!==v):[...prev,v]);
  const canPublish = type&&title&&desc&&lookingFor.length>0;

  const publish = async () => {
    if (!canPublish) return;
    setLoading(true); setErr("");
    const { error } = await supabase.from("posts").insert({
      user_id: currentUser.id, title, description: desc, type, category,
      looking_for: lookingFor, monetization_type: mono
    });
    if (error) { setErr(error.message); setLoading(false); return; }
    onPublished();
  };

  return (
    <>
      <div className="topbar">
        <div className="back-btn" onClick={onBack}>← Back</div>
        <button className="btn-primary" style={{width:"auto",padding:"8px 18px",marginTop:0,fontSize:13}}
          onClick={publish} disabled={!canPublish||loading}>{loading?"Publishing...":"Publish"}</button>
      </div>
      <div className="content">
        <div className="create-screen">
          <div className="create-title">New post</div>
          <div className="create-sub">What are you building?</div>
          {err && <div className="error-msg">{err}</div>}
          <div className="form-group">
            <label className="form-label">Type</label>
            <div className="type-selector">
              {Object.entries(TYPE_CONFIG).map(([k,v])=>(
                <div key={k} className={`type-card ${type===k?"selected":""}`} onClick={()=>setType(k)}>
                  <div className="type-card-emoji">{v.emoji}</div>
                  <div className="type-card-name">{v.label}</div>
                  <div className="type-card-desc">{v.desc}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input className="form-input" placeholder="One-line summary" value={title} onChange={e=>setTitle(e.target.value)}/>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" placeholder="What's the problem? What's your solution? What stage?" value={desc} onChange={e=>setDesc(e.target.value)}/>
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-input" value={category} onChange={e=>setCategory(e.target.value)}>
              <option value="">Select category</option>
              {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Looking for</label>
            <div className="looking-for-grid">
              {LOOKING_FOR_OPTIONS.map(o=>(
                <div key={o} className={`looking-chip ${lookingFor.includes(o)?"selected":""}`} onClick={()=>toggleLF(o)}>{o}</div>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Collaboration type</label>
            <div className="mono-select">
              {MONETIZATION_OPTIONS.map(o=>(
                <div key={o} className={`mono-chip ${mono===o?"selected":""}`} onClick={()=>setMono(o)}>{o}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function groupThreads(rows, myId) {
  const map = {};
  rows.forEach(r => {
    const otherId = r.user_id === myId ? r.recipient_id : r.user_id;
    if (!otherId) return;
    const key = `${r.post_id}-${otherId}`;
    if (!map[key]) {
      map[key] = { key, postId: r.post_id, post: r.posts, otherUser: null, messages: [], askType: null };
    }
    map[key].messages.push(r);
    if (r.user_id !== myId) {
      if (!map[key].askType) map[key].askType = r.type;
      if (r.profiles) map[key].otherUser = { id: r.user_id, ...r.profiles };
    }
  });
  const threads = Object.values(map).filter(th => th.otherUser).map(th => {
    th.messages.sort((a,b)=> new Date(a.created_at) - new Date(b.created_at));
    th.latest = th.messages[th.messages.length-1];
    th.unread = th.messages.some(m => m.recipient_id===myId && !m.read);
    if (!th.askType) th.askType = "message";
    return th;
  });
  threads.sort((a,b)=> new Date(b.latest.created_at) - new Date(a.latest.created_at));
  return threads;
}

function NotificationsScreen({ currentUser, showToast, onOpenPost }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openKey, setOpenKey] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(()=>{
    const load = async () => {
      const { data: myPosts } = await supabase.from("posts").select("id").eq("user_id", currentUser.id);
      if (!myPosts||myPosts.length===0) { setLoading(false); return; }
      const postIds = myPosts.map(p=>p.id);
      const { data } = await supabase.from("interactions")
        .select("*, profiles(name,role,avatar_url), posts(*)")
        .in("post_id", postIds)
        .order("created_at",{ascending:true});
      setRows(data||[]);
      setLoading(false);
    };
    load();
  },[currentUser.id]);

  const threads = groupThreads(rows, currentUser.id);

  const toggleOpen = (th) => {
    const opening = openKey !== th.key;
    setOpenKey(opening ? th.key : null);
    setReplyText("");
    if (opening) {
      const unreadIds = th.messages.filter(m=>m.recipient_id===currentUser.id && !m.read).map(m=>m.id);
      if (unreadIds.length>0) {
        supabase.from("interactions").update({ read: true }).in("id", unreadIds).then(()=>{});
        setRows(prev => prev.map(r => unreadIds.includes(r.id) ? {...r, read:true} : r));
      }
    }
  };

  const sendReply = async (th) => {
    const text = replyText.trim();
    if (!text || sending) return;
    setSending(true);
    const { data, error } = await supabase.from("interactions")
      .insert({ user_id: currentUser.id, post_id: th.postId, recipient_id: th.otherUser.id, type: "message", message: text })
      .select("*, profiles(name,role,avatar_url), posts(*)")
      .single();
    setSending(false);
    if (!error && data) {
      setRows(prev=>[...prev, data]);
      setReplyText("");
      showToast && showToast("Reply sent!");
    }
  };

  return (
    <>
      <div className="topbar">
        <div className="topbar-logo">Gen<span>xix</span></div>
        <div style={{fontSize:12,color:t.muted}}>{threads.filter(th=>th.unread).length>0?`${threads.filter(th=>th.unread).length} new`:""}</div>
      </div>
      <div className="content">
        <div className="notif-screen">
          <div className="section-header" style={{marginBottom:10}}><div className="section-label">Requests</div></div>
          {loading ? <div className="loading"><div className="spinner"/></div>
            : threads.length===0 ? (
              <div className="empty-state">
                <div className="empty-emoji">🔔</div>
                <div className="empty-title">No requests yet</div>
                <div className="empty-sub">When someone co-builds, invests, or messages about your posts, it shows here.</div>
              </div>
            ) : threads.map(th=>{
              const typeInfo = NOTIF_TYPE[th.askType]||NOTIF_TYPE.message;
              const postTc = TYPE_CONFIG[th.post?.type]||TYPE_CONFIG.idea;
              const isOpen = openKey === th.key;
              const lastMine = th.latest.user_id === currentUser.id;
              return (
                <div key={th.key} className={`thread-card ${th.unread?"unread":""}`}
                  style={{borderLeftColor: th.unread ? typeInfo.color : "transparent"}}
                  onClick={()=>toggleOpen(th)}>
                  <div className="thread-header">
                    <Avatar name={th.otherUser?.name||"?"} userId={th.otherUser?.id} avatarUrl={th.otherUser?.avatar_url} size={36}/>
                    <div className="thread-meta">
                      <div className="thread-name-row">
                        <span className="thread-name">{th.otherUser?.name||"A builder"}</span>
                        <span className="thread-time">{timeAgo(th.latest.created_at)}</span>
                      </div>
                      <div className="thread-post-line">{postTc.emoji} {th.post?.title||"your post"}</div>
                      <div className="thread-preview">{lastMine?"You: ":""}{th.latest.message || typeInfo.label}</div>
                    </div>
                    {th.unread && <div className="thread-unread-dot" style={{background:typeInfo.color}}/>}
                  </div>

                  {isOpen && (
                    <div className="notif-reply-box" onClick={e=>e.stopPropagation()}>
                      {th.post && (
                        <div
                          onClick={()=>onOpenPost && onOpenPost(th.post)}
                          style={{background:t.elevated,border:`1px solid ${t.border}`,borderRadius:10,padding:12,marginBottom:12,cursor:"pointer"}}
                        >
                          <span className={`post-type-badge ${postTc.className}`}>{postTc.emoji} {postTc.label}</span>
                          <div style={{fontSize:13,fontWeight:600,marginTop:6}}>{th.post.title}</div>
                          {th.post.description && (
                            <div style={{fontSize:12,color:t.muted,marginTop:4,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>
                              {th.post.description}
                            </div>
                          )}
                          <div style={{fontSize:11,color:t.accent,fontWeight:600,marginTop:8}}>View full post →</div>
                        </div>
                      )}
                      <div className="chat-thread">
                        {th.messages.map(m=>{
                          const mine = m.user_id === currentUser.id;
                          const label = m.message || (NOTIF_TYPE[m.type]||NOTIF_TYPE.message).label;
                          return (
                            <div key={m.id} style={mine?{alignSelf:"flex-end",display:"flex",flexDirection:"column",alignItems:"flex-end"}:undefined}>
                              <div className={`chat-bubble ${mine?"mine":"theirs"}`}>{label}</div>
                              <div className="chat-bubble-meta">{mine?"You":(th.otherUser?.name||"Them")} · {timeAgo(m.created_at)}</div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="msg-input-wrap" style={{marginTop:0}}>
                        <input
                          className="form-input"
                          placeholder={`Reply to ${th.otherUser?.name||"them"}...`}
                          value={replyText}
                          onChange={e=>setReplyText(e.target.value)}
                          onKeyDown={e=>e.key==="Enter"&&sendReply(th)}
                        />
                        <button className="msg-send-btn" onClick={()=>sendReply(th)} disabled={sending||!replyText.trim()}>
                          {sending?"...":"Send"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          }
        </div>
      </div>
    </>
  );
}

function ProfileScreen({ currentUser, profile, onLogout, onAvatarUpdated }) {
  const [posts, setPosts]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [connects, setConnects] = useState(0);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  useEffect(()=>{
    const load = async () => {
      const { data: p } = await supabase.from("posts").select("*").eq("user_id",currentUser.id).order("created_at",{ascending:false});
      setPosts(p||[]);
      if (p&&p.length>0) {
        const { count } = await supabase.from("interactions").select("*",{count:"exact",head:true}).in("post_id",p.map(x=>x.id));
        setConnects(count||0);
      }
      setLoading(false);
    };
    load();
  },[currentUser.id]);

  const handlePhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${currentUser.id}/avatar.${ext}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (error) {
      alert("Upload failed: " + error.message);
    } else {
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      const url = data.publicUrl + "?t=" + Date.now();
      await supabase.from("profiles").update({ avatar_url: url }).eq("id", currentUser.id);
      onAvatarUpdated(url);
    }
    setUploading(false);
  };

  const skills = Array.isArray(profile?.skills) ? profile.skills : [];

  return (
    <>
      <div className="topbar">
        <div className="topbar-logo">Gen<span>xix</span></div>
        <div className="logout-btn" onClick={onLogout}>Log out</div>
      </div>
      <div className="content">
        <div className="profile-screen">
          <div className="profile-hero">
            <div onClick={()=>fileRef.current?.click()} style={{cursor:"pointer"}}>
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="avatar" style={{width:72,height:72,borderRadius:18,objectFit:"cover",margin:"0 auto 4px",display:"block"}}/>
              ) : (
                <div className="profile-avatar-large" style={{background:t.accentDim,color:t.accent}}>
                  {uploading ? "..." : initials(profile?.name||currentUser.email||"?")}
                </div>
              )}
              <div style={{fontSize:10,color:t.accent,marginBottom:8,fontWeight:600,textAlign:"center"}}>{uploading?"Uploading...":"Change photo"}</div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handlePhoto}/>
            <div className="profile-name">{profile?.name||currentUser.email}</div>
            {profile?.role && <div className="profile-role-badge" style={{background:t.accentDim,color:t.accent}}>{profile.role}</div>}
            {profile?.bio && <div className="profile-bio">{profile.bio}</div>}
            {skills.length>0 && (
              <div className="profile-skills">{skills.map(s=><span key={s} className="profile-skill">{s}</span>)}</div>
            )}
          </div>
          <div className="profile-stats">
            <div className="profile-stat"><div className="stat-num">{posts.length}</div><div className="stat-label">Posts</div></div>
            <div className="profile-stat"><div className="stat-num">{connects}</div><div className="stat-label">Connects</div></div>
            <div className="profile-stat"><div className="stat-num">{profile?.role?1:0}</div><div className="stat-label">Profile</div></div>
          </div>
          <div className="posts-heading">Your posts</div>
          {loading ? <div className="loading"><div className="spinner"/></div>
            : posts.length===0 ? (
              <div className="empty-state">
                <div className="empty-emoji">📭</div>
                <div className="empty-title">No posts yet</div>
                <div className="empty-sub">Share what you're building. Tap + Post.</div>
              </div>
            ) : (
              <div className="feed" style={{padding:0}}>
                {posts.map(p=><PostCard key={p.id} post={{...p,profiles:profile}} onClick={()=>{}}/>)}
              </div>
            )
          }
        </div>
      </div>
    </>
  );
}

function FounderAgentScreen({ onBack }) {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    whatBuilding: "", whoFor: "", problem: "", stage: "", goal: ""
  });
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");

  const STAGE_OPTIONS = ["Just an idea", "Prototype", "MVP", "Live product"];
  const GOAL_OPTIONS = ["Find co-founder", "Validate idea", "Build MVP", "Get users", "Raise funding"];

  const update = (key, val) => setAnswers(prev => ({ ...prev, [key]: val }));

  const canContinue = () => {
    if (step === 1) return answers.whatBuilding.trim().length > 0;
    if (step === 2) return answers.whoFor.trim().length > 0;
    if (step === 3) return answers.problem.trim().length > 0;
    if (step === 4) return answers.stage.length > 0;
    if (step === 5) return answers.goal.length > 0;
    return false;
  };

  const generate = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate report");
      setReport(data.report);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (report) {
    return (
      <>
        <div className="topbar">
          <div className="back-btn" onClick={onBack}>← Back</div>
          <div style={{ width: 40 }} />
        </div>
        <div className="content">
          <div className="detail-screen">
            <div className="detail-title">Your Startup Report</div>
            <pre style={{
              whiteSpace: "pre-wrap", fontSize: 12, color: t.text,
              background: t.surface, border: `1px solid ${t.border}`,
              borderRadius: 12, padding: 16, lineHeight: 1.6
            }}>
              {JSON.stringify(report, null, 2)}
            </pre>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="topbar">
        <div className="back-btn" onClick={onBack}>← Back</div>
        <div style={{ width: 40 }} />
      </div>
      <div className="content">
        <div className="onboard-screen" style={{ paddingTop: 0, minHeight: "auto" }}>
          <div className="onboard-step">Build with AI · Step {step} of 5</div>

          {loading ? (
            <div className="loading"><div className="spinner" /></div>
          ) : error ? (
            <>
              <div className="error-msg">{error}</div>
              <button className="btn-primary" onClick={generate}>Try again →</button>
            </>
          ) : step === 1 ? (
            <>
              <div className="onboard-title">What are you building?</div>
              <div className="form-group" style={{ marginTop: 24 }}>
                <textarea className="form-textarea" placeholder="e.g. A tool that helps freelancers track invoices"
                  value={answers.whatBuilding} onChange={e => update("whatBuilding", e.target.value)} />
              </div>
              <div className="onboard-footer">
                <button className="btn-primary" onClick={() => setStep(2)} disabled={!canContinue()}>Continue →</button>
              </div>
            </>
          ) : step === 2 ? (
            <>
              <div className="onboard-title">Who is it for?</div>
              <div className="form-group" style={{ marginTop: 24 }}>
                <input className="form-input" placeholder="e.g. Freelance designers and consultants"
                  value={answers.whoFor} onChange={e => update("whoFor", e.target.value)} />
              </div>
              <div className="onboard-footer">
                <button className="btn-primary" onClick={() => setStep(3)} disabled={!canContinue()}>Continue →</button>
              </div>
            </>
          ) : step === 3 ? (
            <>
              <div className="onboard-title">What problem are you solving?</div>
              <div className="form-group" style={{ marginTop: 24 }}>
                <textarea className="form-textarea" placeholder="What's broken or missing today?"
                  value={answers.problem} onChange={e => update("problem", e.target.value)} />
              </div>
              <div className="onboard-footer">
                <button className="btn-primary" onClick={() => setStep(4)} disabled={!canContinue()}>Continue →</button>
              </div>
            </>
          ) : step === 4 ? (
            <>
              <div className="onboard-title">Have you started building?</div>
              <div className="mono-select" style={{ marginTop: 24 }}>
                {STAGE_OPTIONS.map(s => (
                  <div key={s} className={`mono-chip ${answers.stage === s ? "selected" : ""}`}
                    onClick={() => update("stage", s)}>{s}</div>
                ))}
              </div>
              <div className="onboard-footer">
                <button className="btn-primary" onClick={() => setStep(5)} disabled={!canContinue()}>Continue →</button>
              </div>
            </>
          ) : (
            <>
              <div className="onboard-title">What's your goal?</div>
              <div className="mono-select" style={{ marginTop: 24 }}>
                {GOAL_OPTIONS.map(g => (
                  <div key={g} className={`mono-chip ${answers.goal === g ? "selected" : ""}`}
                    onClick={() => update("goal", g)}>{g}</div>
                ))}
              </div>
              <div className="onboard-footer">
                <button className="btn-primary" onClick={generate} disabled={!canContinue()}>Generate my report →</button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

const Icons = {
  feed:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  create:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>,
  notifs:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  profile: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
};

export default function App() {
  const [screen, setScreen] = useState("loading");
  const [tab, setTab] = useState("feed");
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showFounderAgent, setShowFounderAgent] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = msg => { setToast(msg); setTimeout(()=>setToast(null), 2500); };

  const loadProfile = useCallback(async (userId) => {
    const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
    setProfile(data);
    return data;
  }, []);

  const loadPosts = useCallback(async () => {
    setPostsLoading(true);
    const { data } = await supabase.from("posts")
      .select("*, profiles(name,role,bio,avatar_url)")
      .order("created_at", { ascending: false });
    setPosts(data||[]);
    setPostsLoading(false);
  }, []);

  useEffect(()=>{
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setCurrentUser(session.user);
        const p = await loadProfile(session.user.id);
        setScreen(p?.role ? "app" : "onboard");
      } else {
        setScreen("guest");
      }
      loadPosts();
    };
    init();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) { setCurrentUser(null); setProfile(null); setScreen("guest"); }
    });
    return () => subscription.unsubscribe();
  }, [loadProfile, loadPosts]);

  const handleAuth = async (user, meta) => {
    setCurrentUser(user);
    if (meta.needsOnboard) {
      setScreen("onboard");
    } else {
      const p = await loadProfile(user.id);
      setScreen(p?.role ? "app" : "onboard");
    }
  };

  const handleOnboard = (data) => {
    setProfile(prev=>({...prev,...data}));
    setScreen("app");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null); setProfile(null);
    setScreen("guest");
  };

  const handlePublished = () => {
    showToast("🚀 Post published!");
    setTab("feed");
    loadPosts();
  };

  const goToAuth = () => setScreen("auth");

  const openPostFromNotif = (post) => {
    setSelectedPost(post);
  };

  if (screen==="loading") return (
    <div className="app" style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh"}}>
      <div>
        <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:28,fontWeight:700,textAlign:"center",marginBottom:24}}>
          Gen<span style={{color:t.accent}}>xix</span>
        </div>
        <div className="loading"><div className="spinner"/></div>
      </div>
    </div>
  );

  if (screen==="auth") return <div className="app"><AuthScreen onAuth={handleAuth}/></div>;
  if (screen==="onboard") return <div className="app"><OnboardScreen user={currentUser} onComplete={handleOnboard}/></div>;

  const isGuest = screen === "guest";

  return (
    <div className="app">
      {selectedPost ? (
        <PostDetailScreen post={selectedPost} currentUser={currentUser} onBack={()=>setSelectedPost(null)} showToast={showToast} onLoginRequired={goToAuth}/>
      ) : showFounderAgent ? (
        <FounderAgentScreen onBack={()=>setShowFounderAgent(false)}/>
      ) : tab==="feed" || isGuest ? (
        <FeedScreen posts={posts} loading={postsLoading} onPostClick={setSelectedPost} onCreateClick={isGuest ? goToAuth : ()=>setTab("create")} onBuildClick={()=>setShowFounderAgent(true)} isGuest={isGuest}/>
      ) : tab==="create" ? (
        <CreatePostScreen currentUser={currentUser} onBack={()=>setTab("feed")} onPublished={handlePublished}/>
      ) : tab==="notifs" ? (
        <NotificationsScreen currentUser={currentUser} showToast={showToast} onOpenPost={openPostFromNotif}/>
      ) : (
        <ProfileScreen currentUser={currentUser} profile={profile} onLogout={handleLogout} onAvatarUpdated={(url)=>setProfile(prev=>({...prev, avatar_url:url}))}/>
      )}

      {isGuest ? (
        <>
          <GateBanner onLogin={goToAuth}/>
          <nav className="nav">
            <div className="nav-item active">{Icons.feed}Discover</div>
            <div className="nav-item" onClick={goToAuth}>{Icons.create}Post</div>
            <div className="nav-item" onClick={goToAuth}>{Icons.notifs}Inbox</div>
            <div className="nav-item" onClick={goToAuth}>{Icons.profile}Profile</div>
          </nav>
        </>
      ) : !selectedPost && !showFounderAgent && (
        <nav className="nav">
          {[
            {id:"feed",   icon:Icons.feed,    label:"Discover"},
            {id:"create", icon:Icons.create,  label:"Post"},
            {id:"notifs", icon:Icons.notifs,  label:"Inbox"},
            {id:"profile",icon:Icons.profile, label:"Profile"},
          ].map(n=>(
            <div key={n.id} className={`nav-item ${tab===n.id?"active":""}`} onClick={()=>setTab(n.id)}>
              {n.icon}{n.label}
            </div>
          ))}
        </nav>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
