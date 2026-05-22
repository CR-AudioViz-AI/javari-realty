// app/market-report/page.tsx - AI Market Report Generator
// CR AudioViz AI · EIN 39-3646201 · May 2026
"use client";
import { useState } from "react";

export default function MarketReport() {
  const [zip, setZip] = useState("");
  const [propType, setPropType] = useState("Single Family");
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate() {
    if (!zip) return;
    setLoading(true); setReport("");
    const prompt = `Generate a professional real estate market report for ZIP code ${zip}, property type: ${propType}.

Include:
1. MARKET OVERVIEW - Current conditions (buyer/seller market), inventory levels, days on market
2. PRICE TRENDS - Median price, price per sq ft, year-over-year change (use realistic Southwest Florida data)
3. ABSORPTION RATE - Months of supply and what it means for buyers/sellers
4. TOP SELLING NEIGHBORHOODS - 3 neighborhoods with avg prices
5. FORECAST - 90-day outlook
6. AGENT INSIGHTS - 2-3 talking points to use with clients

Make it specific, data-driven, and professional. Use realistic Southwest Florida market data for 2026.`;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role:"user", content: prompt }], stream: false,
          systemOverride: "You are a senior real estate market analyst specializing in Southwest Florida. Provide accurate, actionable market reports with specific data points that agents can use with clients." }),
      });
      const data = await res.json();
      setReport(data?.choices?.[0]?.message?.content || data?.content || "Error generating report.");
    } catch { setReport("Connection error."); }
    setLoading(false);
  }

  return (
    <div style={{ minHeight:"100vh", background:"#040912", color:"#e2e8f0", fontFamily:"system-ui" }}>
      <nav style={{ background:"#1E3A5F", padding:"0 20px", height:52, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <a href="/" style={{ color:"#9CA3AF", textDecoration:"none", fontSize:13 }}>← Javari Realty</a>
          <span style={{ color:"#374151" }}>·</span>
          <span style={{ fontWeight:700, color:"#00B4D8" }}>Market Report</span>
        </div>
        <a href="https://craudiovizai.com/auth/signup" style={{ background:"#FF0800", color:"#fff", borderRadius:7, padding:"5px 14px", fontSize:12, fontWeight:700, textDecoration:"none" }}>Sign Up</a>
      </nav>

      <div style={{ maxWidth:800, margin:"0 auto", padding:"40px 20px 80px" }}>
        <h1 style={{ fontSize:26, fontWeight:900, color:"#fff", margin:"0 0 8px" }}>Market Report Generator</h1>
        <p style={{ color:"#6B7280", fontSize:14, marginBottom:28 }}>Generate professional market reports for any Southwest Florida ZIP code in seconds.</p>

        <div style={{ display:"flex", gap:12, marginBottom:20, flexWrap:"wrap" }}>
          <input value={zip} onChange={e=>setZip(e.target.value)} placeholder="ZIP Code (e.g. 34102)"
            style={{ flex:1, minWidth:160, background:"#0F1F32", border:"1px solid rgba(0,180,216,0.2)", borderRadius:8, padding:"11px 14px", color:"#e2e8f0", fontSize:14, outline:"none", fontFamily:"system-ui" }} />
          <select value={propType} onChange={e=>setPropType(e.target.value)}
            style={{ flex:1, minWidth:180, background:"#0F1F32", border:"1px solid rgba(0,180,216,0.2)", borderRadius:8, padding:"11px 14px", color:"#e2e8f0", fontSize:14, outline:"none", fontFamily:"system-ui" }}>
            {["Single Family","Condo/Townhome","Luxury ($1M+)","Multi-Family","Land"].map(t=><option key={t}>{t}</option>)}
          </select>
          <button onClick={generate} disabled={loading||!zip.trim()}
            style={{ background: loading||!zip.trim() ? "#0F1F32" : "#1E3A5F", color: loading||!zip.trim() ? "#374151" : "#00B4D8", border:"1px solid rgba(0,180,216,0.2)", borderRadius:8, padding:"11px 22px", fontSize:14, fontWeight:700, cursor: loading||!zip.trim()?"not-allowed":"pointer", fontFamily:"system-ui", whiteSpace:"nowrap" }}>
            {loading ? "Analyzing..." : "📊 Generate Report"}
          </button>
        </div>

        {loading && (
          <div style={{ textAlign:"center", padding:"60px 0", color:"#6B7280" }}>
            <div style={{ fontSize:40, marginBottom:12 }}>📊</div>
            <p>Analyzing market data for {zip}...</p>
          </div>
        )}

        {report && (
          <div style={{ background:"#0F1F32", border:"1px solid rgba(0,180,216,0.12)", borderRadius:14, padding:24 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <h2 style={{ margin:0, fontSize:16, fontWeight:700, color:"#00B4D8" }}>Market Report — {zip} ({propType})</h2>
              <button onClick={()=>navigator.clipboard?.writeText(report)}
                style={{ background:"transparent", color:"#6B7280", border:"1px solid rgba(255,255,255,0.08)", borderRadius:6, padding:"4px 12px", fontSize:12, cursor:"pointer", fontFamily:"system-ui" }}>Copy</button>
            </div>
            <pre style={{ whiteSpace:"pre-wrap", wordBreak:"break-word", color:"#e2e8f0", fontSize:14, lineHeight:1.7, margin:0, fontFamily:"system-ui" }}>{report}</pre>
          </div>
        )}
      </div>
    </div>
  );
}