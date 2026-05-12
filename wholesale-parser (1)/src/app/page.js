"use client";
import { useState } from "react";

const s = {
  wrap: { maxWidth: 780, margin: "0 auto", padding: "2rem 1rem" },
  header: { marginBottom: "2rem" },
  h1: { fontSize: 22, fontWeight: 600, color: "#111", margin: 0 },
  sub: { fontSize: 14, color: "#666", marginTop: 4 },
  label: { fontSize: 13, fontWeight: 500, color: "#444", display: "block", marginBottom: 6 },
  textarea: { width: "100%", height: 220, fontSize: 13, padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd", background: "#fff", color: "#111", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" },
  btnRow: { display: "flex", gap: 10, marginTop: 12, alignItems: "center" },
  btnPrimary: { padding: "9px 18px", fontSize: 13, fontWeight: 500, borderRadius: 8, border: "none", background: "#111", color: "#fff", cursor: "pointer" },
  btnSecondary: { padding: "9px 18px", fontSize: 13, fontWeight: 500, borderRadius: 8, border: "1px solid #ddd", background: "#fff", color: "#111", cursor: "pointer" },
  btnDisabled: { opacity: 0.4, cursor: "not-allowed" },
  status: { fontSize: 13, color: "#666" },
  statusErr: { fontSize: 13, color: "#c0392b" },
  section: { marginTop: "1.5rem" },
  sectionLabel: { fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#888", marginBottom: 8 },
  orderCard: { border: "1px solid #e5e5e5", borderRadius: 10, background: "#fff", marginBottom: 12, overflow: "hidden" },
  orderHead: { padding: "12px 16px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", gap: 8 },
  orderTitle: { fontSize: 14, fontWeight: 500, color: "#111", flex: 1 },
  orderMeta: { fontSize: 12, color: "#888" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  th: { textAlign: "left", padding: "6px 16px", fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "0.04em", borderBottom: "1px solid #f0f0f0" },
  td: { padding: "7px 16px", borderBottom: "1px solid #f8f8f8", color: "#222" },
  tdSku: { padding: "7px 16px", borderBottom: "1px solid #f8f8f8", color: "#666", fontFamily: "monospace", fontSize: 12 },
  tdQty: { padding: "7px 16px", borderBottom: "1px solid #f8f8f8", color: "#222", textAlign: "right" },
  unmatchedBox: { background: "#fff8f0", border: "1px solid #ffd6a5", borderRadius: 8, padding: "12px 16px", marginTop: 12 },
  unmatchedTitle: { fontSize: 13, fontWeight: 500, color: "#b85c00", marginBottom: 6 },
  unmatchedItem: { fontSize: 13, color: "#b85c00", padding: "2px 0" },
  successBar: { background: "#f0faf4", border: "1px solid #a8e6c0", borderRadius: 8, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, marginBottom: 16 },
  successText: { fontSize: 13, color: "#1a7a3c", flex: 1 },
};

export default function Home() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  async function handleParse() {
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orders: text }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }

  function handleDownload() {
    if (!result?.csv) return;
    const blob = new Blob([result.csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "draft-orders-matrixify.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleReset() {
    setResult(null);
    setText("");
    setError("");
  }

  const totalLines = result?.parsed?.reduce((s, o) => s + o.lines.length, 0) ?? 0;
  const totalQty = result?.parsed?.reduce((s, o) => s + o.lines.reduce((ss, l) => ss + l.quantity, 0), 0) ?? 0;

  return (
    <div style={s.wrap}>
      <div style={s.header}>
        <h1 style={s.h1}>Wholesale Order Parser</h1>
        <p style={s.sub}>Paste one or more customer orders → get a Matrixify-ready CSV</p>
      </div>

      {!result && (
        <>
          <label style={s.label}>
            Order text
            <span style={{ fontWeight: 400, color: "#aaa" }}> — paste one or more orders, separated by a blank line</span>
          </label>
          <textarea
            style={s.textarea}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Example:\nThe Kit mustard\nSkinny chalk 2x\nButtons slate 3x\n\n---\n\nLowdown ocean\nStoryboard blush 4x`}
          />
          <div style={s.btnRow}>
            <button
              style={{ ...s.btnPrimary, ...(loading || !text.trim() ? s.btnDisabled : {}) }}
              onClick={handleParse}
              disabled={loading || !text.trim()}
            >
              {loading ? "Parsing…" : "Parse orders →"}
            </button>
            {error && <span style={s.statusErr}>{error}</span>}
          </div>
        </>
      )}

      {result && (
        <div style={s.section}>
          <div style={s.successBar}>
            <span style={s.successText}>
              ✓ Parsed {result.parsed.length} order{result.parsed.length !== 1 ? "s" : ""} · {totalLines} lines · {totalQty} units
            </span>
            <button style={s.btnPrimary} onClick={handleDownload}>
              ↓ Download CSV
            </button>
            <button style={s.btnSecondary} onClick={handleReset}>
              Parse more
            </button>
          </div>

          {result.unmatched?.length > 0 && (
            <div style={s.unmatchedBox}>
              <div style={s.unmatchedTitle}>⚠ {result.unmatched.length} line{result.unmatched.length !== 1 ? "s" : ""} could not be matched — please check manually:</div>
              {result.unmatched.map((u, i) => (
                <div key={i} style={s.unmatchedItem}>Order {u.order}: "{u.text}"</div>
              ))}
            </div>
          )}

          {result.parsed.map((order) => (
            <div key={order.orderNumber} style={s.orderCard}>
              <div style={s.orderHead}>
                <span style={s.orderTitle}>Order {order.orderNumber}</span>
                <span style={s.orderMeta}>{order.lines.length} lines · {order.lines.reduce((s, l) => s + l.quantity, 0)} units</span>
              </div>
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>Product</th>
                    <th style={s.th}>SKU</th>
                    <th style={{ ...s.th, textAlign: "right" }}>Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {order.lines.map((line, i) => (
                    <tr key={i}>
                      <td style={s.td}>{line.title}</td>
                      <td style={s.tdSku}>{line.sku}</td>
                      <td style={s.tdQty}>{line.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
