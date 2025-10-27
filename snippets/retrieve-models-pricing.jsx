// File: FetchModelPricesTable.jsx
"use client";
import React, { useEffect, useState } from "react";

const toMicro = (v) => {
  if (v === null || v === undefined || v === "") return "—";
  const num = Number(v);
  if (Number.isNaN(num)) return "—";
  return (num * 1_000_000).toFixed(2);
};

export default function FetchModelPrices() {
  const [models, setModels] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("https://api.intelligence.io.solutions/api/v1/models");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const result = await res.json();

        const arr = Array.isArray(result)
          ? result
          : result?.data || result?.models || result?.items || [];

        if (!Array.isArray(arr)) throw new Error("Unexpected API format");

        const rows = arr.map(({ id, input_token_price, output_token_price }) => ({
          id: id ?? "(no id)",
          input_token_price: toMicro(input_token_price),
          output_token_price: toMicro(output_token_price),
        }));

        console.log("Models to render:", rows);
        setModels(rows);
      } catch (e) {
        console.error(e);
        setError(e?.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p>Loading…</p>;
  if (error) return <p style={{ color: "crimson" }}>Error: {error}</p>;

  return (
    <div style={{ padding: 16, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif" }}>
      <h3 style={{ margin: 0 }}>Model Token Prices (×10⁶)</h3>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: 12,
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <thead style={{ background: "#f9fafb" }}>
          <tr>
            <th style={thStyle}>Model ID</th>
            <th style={thStyle, { textAlign: "right", padding: "10px 12px", borderBottom: "1px solid #e5e7eb" }}>
              Input Token Price (×10⁶)
            </th>
            <th style={thStyle, { textAlign: "right", padding: "10px 12px", borderBottom: "1px solid #e5e7eb" }}>
              Output Token Price (×10⁶)
            </th>
          </tr>
        </thead>
        <tbody>
          {models.length === 0 ? (
            <tr>
              <td style={tdStyle} colSpan={3}>No data</td>
            </tr>
          ) : (
            models.map((m, idx) => (
              <tr key={m.id || idx}>
                <td style={tdStyle}>{m.id}</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>{m.input_token_price}</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>{m.output_token_price}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  textAlign: "left",
  padding: "10px 12px",
  borderBottom: "1px solid #e5e7eb",
  fontWeight: 600,
  fontSize: 14,
};

const tdStyle = {
  padding: "10px 12px",
  borderBottom: "1px solid #f1f5f9",
  fontSize: 14,
};
