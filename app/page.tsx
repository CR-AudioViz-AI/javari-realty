// app/page.tsx - Javari Realty — AI Real Estate Tools
// Built for Tony Harvey, Premiere Plus Realty Naples
// CR AudioViz AI · EIN 39-3646201 · May 2026
"use client";
import { useState } from "react";

const TOOLS = [
  { href: "/listing-writer",    icon: "✍️",  label: "Listing Writer",     desc: "AI-powered MLS listings in 30 seconds" },
  { href: "/market-report",     icon: "📊",  label: "Market Report",      desc: "Instant CMA and neighborhood analysis" },
  { href: "/client-emails",     icon: "📧",  label: "Client Emails",      desc: "Personalized drip campaigns and follow-ups" },
  { href: "/offer-analyzer",    icon: "🏠",  label: "Offer Analyzer",     desc: "Compare offers and highlight best terms" },
  { href: "/social-posts",      icon: "📱",  label: "Social Posts",       desc: "Instagram, Facebook, LinkedIn content" },
  { href: "/mortgage-calc",     icon: "💰",  label: "Mortgage Calculator", desc: "Payment estimates with current rates" },
  { href: "/neighborhood",      icon: "🗺️",  label: "Neighborhood Guide", desc: "AI-written area descriptions" },
  { href: "/open-house",        icon: "🚪",  label: "Open House Kit",     desc: "Scripts, flyers, and follow-up sequences" },
];

const STATS = [
  { n: "30s",    l: "Listing written" },
  { n: "100%",   l: "MLS compliant" },
  { n: "10×",    l: "More content" },
  { n: "$0",     l: "To get started" },
];

export default function RealtyHome() {
  const [address, setAddress] = useState("");

  return (
    <div style={{ minHeight: "100vh", background: "#040912", color: "#e2e8f0", fontFamily: "system-ui" }}>
      {/* Nav */}
      <nav style={{ background: "#1E3A5F", padding: "0 20px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>🏠</span>
          <span style={{ fontWeight: 800, color: "#00B4D8", fontSize: 15 }}>Javari Realty</span>
          <span style={{ color: "#374151", fontSize: 11 }}>· EIN 39-3646201</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <a href="https://craudiovizai.com/auth/signup" style={{ background: "#FF0800", color: "#fff", borderRadius: 7, padding: "5px 14px", fontSize: 12, fontWeight: 700, textDecoration: "none" }}>Sign Up Free</a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg,#1E3A5F 0%,#040912 100%)", padding: "72px 24px 60px", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#FF0800", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>
            Built for Real Estate Professionals
          </p>
          <h1 style={{ fontSize: "clamp(28px,5vw,52px)", fontWeight: 900, margin: "0 0 16px", lineHeight: 1.05, color: "#fff" }}>
            Close More Deals with<br /><span style={{ color: "#00B4D8" }}>AI-Powered Tools</span>
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", lineHeight: 1.65, margin: "0 0 36px", maxWidth: 520, marginLeft: "auto", marginRight: "auto" }}>
            Write MLS listings, generate market reports, and create client content in seconds.
            Built for agents who want to win more listings.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/listing-writer" style={{ background: "#FF0800", color: "#fff", borderRadius: 12, padding: "14px 28px", fontSize: 15, fontWeight: 800, textDecoration: "none" }}>
              Write a Listing Now →
            </a>
            <a href="/market-report" style={{ background: "rgba(0,180,216,0.15)", color: "#00B4D8", border: "1px solid rgba(0,180,216,0.3)", borderRadius: 12, padding: "14px 28px", fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
              Market Report
            </a>
          </div>
          <p style={{ marginTop: 16, fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
            Trusted by Tony Harvey · Premiere Plus Realty Naples
          </p>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: "#0F1F32", borderBottom: "1px solid rgba(0,180,216,0.08)", padding: "32px 24px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
          {STATS.map(s => (
            <div key={s.n} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#FF0800" }}>{s.n}</div>
              <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Tools grid */}
      <section style={{ maxWidth: 1060, margin: "0 auto", padding: "56px 20px 80px" }}>
        <h2 style={{ textAlign: "center", fontSize: "clamp(20px,3vw,32px)", fontWeight: 800, color: "#fff", margin: "0 0 40px" }}>
          Everything you need to win more listings
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 14 }}>
          {TOOLS.map(t => (
            <a key={t.href} href={t.href}
              style={{ background: "#0F1F32", border: "1px solid rgba(0,180,216,0.1)", borderRadius: 16, padding: "22px 20px", textDecoration: "none", display: "block" }}>
              <span style={{ fontSize: 32, display: "block", marginBottom: 10 }}>{t.icon}</span>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#e2e8f0", marginBottom: 6 }}>{t.label}</div>
              <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.5 }}>{t.desc}</div>
            </a>
          ))}
        </div>
      </section>

      <footer style={{ borderTop: "1px solid rgba(0,180,216,0.08)", padding: "16px 24px", textAlign: "center" }}>
        <p style={{ color: "#374151", fontSize: 11, margin: 0 }}>
          © 2026 CR AudioViz AI, LLC — EIN: 39-3646201 · <a href="https://craudiovizai.com" style={{ color: "#6B7280", textDecoration: "none" }}>craudiovizai.com</a> · <a href="https://craudiovizai.com/auth/signup" style={{ color: "#FF0800", textDecoration: "none", fontWeight: 600 }}>Sign Up Free</a>
        </p>
      </footer>
    </div>
  );
}