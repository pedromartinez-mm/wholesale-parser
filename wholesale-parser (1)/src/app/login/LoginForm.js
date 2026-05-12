"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginInner() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/";

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push(from);
    } else {
      setError("Incorrect password");
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f9f9f8" }}>
      <div style={{ background: "#fff", border: "1px solid #e5e5e5", borderRadius: 12, padding: "2rem", width: "100%", maxWidth: 360 }}>
        <h1 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 4px" }}>Wholesale Order Parser</h1>
        <p style={{ fontSize: 14, color: "#888", margin: "0 0 24px" }}>Enter the team password to continue</p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoFocus
            style={{ width: "100%", padding: "10px 12px", fontSize: 14, borderRadius: 8, border: "1px solid #ddd", boxSizing: "border-box", marginBottom: 10 }}
          />
          {error && <p style={{ fontSize: 13, color: "#c0392b", margin: "0 0 10px" }}>{error}</p>}
          <button
            type="submit"
            disabled={loading || !password}
            style={{ width: "100%", padding: "10px", fontSize: 14, fontWeight: 500, borderRadius: 8, border: "none", background: "#111", color: "#fff", cursor: loading || !password ? "not-allowed" : "pointer", opacity: loading || !password ? 0.5 : 1 }}
          >
            {loading ? "Checking…" : "Enter →"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginForm() {
  return (
    <Suspense>
      <LoginInner />
    </Suspense>
  );
}
