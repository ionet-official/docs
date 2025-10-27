import React, { useEffect, useState } from "react";

export function ModelsTable() {
  const [models, setModels] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fmt = (n) => {
    if (typeof n !== "number" || Number.isNaN(n)) return "—";
    const multiplied = n * 1000000;
    return "$" + multiplied.toLocaleString(undefined, {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3
    });
  };

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const res = await fetch("https://api.intelligence.io.solutions/api/v1/models");
        if (!res.ok) throw new Error("HTTP error! status: " + res.status);
        const data = await res.json();
        if (!cancelled) {
          const list = Array.isArray(data)
            ? data
            : data && Array.isArray(data.models)
            ? data.models
            : [];
          setModels(list);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <p>Loading model prices…</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!models.length) return <p>No models found.</p>;

  return (
    <div style={{ marginTop: "1rem" }}>
      <table
        style={{
          borderCollapse: "collapse",
          width: "100%",
          backgroundColor: "#fff",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#0f62fe", color: "white" }}>
            <th style={{ padding: "12px", textAlign: "left" }}>ID</th>
            <th style={{ padding: "12px", textAlign: "left" }}>Input Token Price (×1M)</th>
            <th style={{ padding: "12px", textAlign: "left" }}>Output Token Price (×1M)</th>
          </tr>
        </thead>
        <tbody>
          {models.map((m) => (
            <tr key={m?.id ?? Math.random()} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "12px" }}>{m?.id ?? "—"}</td>
              <td style={{ padding: "12px" }}>{fmt(m?.input_token_price)}</td>
              <td style={{ padding: "12px" }}>{fmt(m?.output_token_price)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
