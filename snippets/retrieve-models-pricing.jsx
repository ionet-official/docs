import React, { useEffect, useState } from "react";

const cell = (v) => (v === null || v === undefined || v === "" ? "—" : String(v));

export const FetchModelPricesTable = () => {
  const [models, setModels] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("https://api.intelligence.io.solutions/api/v1/models");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const result = await res.json();

        // Normalize possible shapes: array or object with a collection field
        const arr = Array.isArray(result)
          ? result
          : result?.data || result?.models || result?.items || [];

        if (!Array.isArray(arr)) throw new Error("Unexpected API format");

        const filtered = arr.map(({ id, input_token_price, output_token_price }) => ({
          id,
          input_token_price,
          output_token_price,
        }));

        setModels(filtered);
      } catch (e) {
        setError(e.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  if (loading) return <div style={{ fontFamily: "system-ui, sans-serif" }}>Loading…</div>;
  if (error) return <div style={{ color: "crimson", fontFamily: "system-ui, sans-serif" }}>Error: {error}</div>;

  return (
    <div style={{ padding: 16, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif" }}>
      <table
        role="table"
        style={{
          width: "100%",
          borderCollapse: "separate",
          borderSpacing: 0,
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <thead style={{ background: "#f9fafb" }}>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Input Token Price</th>
            <th style={thStyle}>Output Token Price</th>
          </tr>
        </thead>
        <tbody>
          {models.map((m) => (
            <tr key={m.id ?? Math.random()}>
              <td style={tdStyle}>{cell(m.id)}</td>
              <td style={tdStyle}>{cell(m.input_token_price)}</td>
              <td style={tdStyle}>{cell(m.output_token_price)}</td>
            </tr>
          ))}
          {models.length === 0 && (
            <tr>
              <td style={tdStyle} colSpan={3}>
                No data
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const thStyle = {
  textAlign: "left",
  padding: "12px 14px",
  fontWeight: 600,
  fontSize: 14,
  borderBottom: "1px solid #e5e7eb",
};

const tdStyle = {
  padding: "12px 14px",
  fontSize: 14,
  borderBottom: "1px solid #f1f5f9",
}