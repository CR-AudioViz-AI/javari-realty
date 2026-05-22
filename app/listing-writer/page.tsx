// app/listing-writer/page.tsx - AI MLS Listing Writer
// CR AudioViz AI · EIN 39-3646201 · May 2026
"use client";
import { useState } from "react";

const STYLES = ["Standard MLS","Luxury/High-End","Investment/ROI","Fixer-Upper Opportunity","New Construction","Vacation/Short-Term Rental"];
const FEATURES = ["Pool","Waterfront","Golf Community","Gated","New Roof","Updated Kitchen","Master on Main","3-Car Garage","Smart Home","Hurricane Impact Windows"];

export default function ListingWriter() {
  const [form, setForm] = useState({ address:"", beds:"", baths:"", sqft:"", price:"", style:"Standard MLS", highlights:"", features:[] as string[] });
  const [listing, setListing] = useState("");
  const [loading, setLoading] = useState(false);

  function toggle(f: string) {
    setForm(prev => ({
      ...prev,
      features: prev.features.includes(f) ? prev.features.filter(x=>x!==f) : [...prev.features, f]
    }));
  }

  async function generate() {
    if (!form.address) return;
    setLoading(true); setListing("");
    const prompt = `Write a compelling MLS listing in ${form.style} style for:

Address: ${form.address}
Bedrooms: ${form.beds} | Bathrooms: ${form.baths} | Square Footage: ${form.sqft} sq ft
List Price: $${form.price}
Features: ${[...form.features, form.highlights].filter(Boolean).join(", ")}

Requirements:
- Write a punchy headline (under 10 words)
- Write a 150-200 word MLS description
- Write 3 bullet-point highlights
- Write a compelling call-to-action sentence
- Use descriptive language that appeals to buyers in Southwest Florida
- Mention specific features naturally

Format clearly with sections: HEADLINE, DESCRIPTION, HIGHLIGHTS, CALL TO ACTION`;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: prompt }], stream: false,
          systemOverride: "You are an expert real estate copywriter specializing in Southwest Florida properties. You write MLS listings that generate more showings and faster sales. Be specific, evocative, and highlight what makes each property unique." }),
      });
      const data = await res.json();
      setListing(data?.choices?.[0]?.message?.content || data?.content || "Error generating listing.");
    } catch { setListing("Connection error. Please try again."); }
    setLoading(false);
  }

  return (
    <div style={{ minHeight:"100vh", background:"#040912", color:"#e2e8f0", fontFamily:"system-ui" }}>
      <nav style={{ background:"#1E3A5F", padding:"0 20px", height:52, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <a href="/" style={{ color:"#9CA3AF", textDecoration:"none", fontSize:13 }}>← Javari Realty</a>
          <span style={{ color:"#374151" }}>·</span>
          <span style={{ fontWeight:700, color:"#00B4D8" }}>Listing Writer</span>
        </div>
        <a href="https://craudiovizai.com/auth/signup" style={{ background:"#FF0800", color:"#fff", borderRadius:7, padding:"5px 14px", fontSize:12, fontWeight:700, textDecoration:"none" }}>Sign Up</a>
      </nav>

      <div style={{ maxWidth:1000, margin:"0 auto", padding:"32px 20px 80px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>

        {/* Form */}
        <div>
          <h1 style={{ fontSize:22, fontWeight:900, color:"#fff", margin:"0 0 24px" }}>AI Listing Writer</h1>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {[["address","Property Address","123 Palm Ave, Naples FL 34102"],["beds","Bedrooms","4"],["baths","Bathrooms","3"],["sqft","Square Footage","2,400"],["price","List Price","850,000"]].map(([key,label,ph]) => (
              <div key={key}>
                <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#6B7280", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:5 }}>{label}</label>
                <input value={(form as any)[key]} onChange={e => setForm(p=>({...p,[key]:e.target.value}))}
                  placeholder={ph}
                  style={{ width:"100%", background:"#0F1F32", border:"1px solid rgba(0,180,216,0.2)", borderRadius:8, padding:"10px 12px", color:"#e2e8f0", fontSize:14, outline:"none", fontFamily:"system-ui", boxSizing:"border-box" }} />
              </div>
            ))}

            <div>
              <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#6B7280", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:5 }}>Listing Style</label>
              <select value={form.style} onChange={e => setForm(p=>({...p,style:e.target.value}))}
                style={{ width:"100%", background:"#0F1F32", border:"1px solid rgba(0,180,216,0.2)", borderRadius:8, padding:"10px 12px", color:"#e2e8f0", fontSize:14, outline:"none", fontFamily:"system-ui" }}>
                {STYLES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#6B7280", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:8 }}>Key Features</label>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {FEATURES.map(f => (
                  <button key={f} onClick={() => toggle(f)}
                    style={{ background: form.features.includes(f) ? "rgba(0,180,216,0.2)" : "#0F1F32", color: form.features.includes(f) ? "#00B4D8" : "#6B7280", border: `1px solid ${form.features.includes(f) ? "rgba(0,180,216,0.4)" : "rgba(255,255,255,0.08)"}`, borderRadius:20, padding:"4px 12px", fontSize:12, cursor:"pointer", fontFamily:"system-ui" }}>
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#6B7280", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:5 }}>Additional Highlights</label>
              <textarea value={form.highlights} onChange={e => setForm(p=>({...p,highlights:e.target.value}))} rows={2}
                placeholder="Recently renovated, great school district, walk to beach..."
                style={{ width:"100%", background:"#0F1F32", border:"1px solid rgba(0,180,216,0.2)", borderRadius:8, padding:"10px 12px", color:"#e2e8f0", fontSize:14, outline:"none", fontFamily:"system-ui", boxSizing:"border-box", resize:"vertical" }} />
            </div>

            <button onClick={generate} disabled={loading||!form.address.trim()}
              style={{ background: loading||!form.address.trim() ? "#0F1F32" : "linear-gradient(135deg,#1E3A5F,#00B4D8)", color: loading||!form.address.trim() ? "#374151" : "#fff", border:"none", borderRadius:10, padding:"13px", fontSize:15, fontWeight:700, cursor: loading||!form.address.trim() ? "not-allowed":"pointer", fontFamily:"system-ui" }}>
              {loading ? "Writing listing..." : "✍️ Generate Listing"}
            </button>
          </div>
        </div>

        {/* Output */}
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <h2 style={{ margin:0, fontSize:18, fontWeight:800, color:"#fff" }}>Your Listing</h2>
            {listing && (
              <button onClick={() => navigator.clipboard?.writeText(listing)}
                style={{ background:"rgba(0,180,216,0.1)", color:"#00B4D8", border:"1px solid rgba(0,180,216,0.2)", borderRadius:7, padding:"5px 14px", fontSize:12, cursor:"pointer", fontFamily:"system-ui" }}>
                📋 Copy
              </button>
            )}
          </div>

          {loading && (
            <div style={{ textAlign:"center", padding:"80px 0", color:"#6B7280" }}>
              <div style={{ fontSize:40, marginBottom:16 }}>✍️</div>
              <p>Writing your listing...</p>
            </div>
          )}

          {listing && (
            <div style={{ background:"#0F1F32", border:"1px solid rgba(0,180,216,0.12)", borderRadius:14, padding:22 }}>
              <pre style={{ whiteSpace:"pre-wrap", wordBreak:"break-word", color:"#e2e8f0", fontSize:14, lineHeight:1.7, margin:0, fontFamily:"system-ui" }}>
                {listing}
              </pre>
            </div>
          )}

          {!listing && !loading && (
            <div style={{ background:"#0F1F32", border:"1px solid rgba(0,180,216,0.06)", borderRadius:14, padding:"48px 24px", textAlign:"center", color:"#374151" }}>
              <div style={{ fontSize:36, marginBottom:12 }}>🏠</div>
              <p style={{ fontSize:13 }}>Fill in the property details and click Generate</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}