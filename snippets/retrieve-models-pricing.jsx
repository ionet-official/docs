"use client";
import React, { useEffect, useState } from "react";

export const FetchModelPrices = () => {
  const [models, setModels] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch("https://api.intelligence.io.solutions/api/v1/models");
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const result = await response.json();

        // Handle different response structures (array or nested data)
        const modelArray = Array.isArray(result)
          ? result
          : result.data || result.models || result.items || [];

        if (!Array.isArray(modelArray)) throw new Error("Unexpected API format");

        // Multiply prices by 1,000,000 for display and round to two decimals
        const formattedData = modelArray.map(({ id, input_token_price, output_token_price }) => ({
          id,
          input_token_price: (input_token_price * 1_000_000).toFixed(2),
          output_token_price: (output_token_price * 1_000_000).toFixed(2),
        }));

        setModels(formattedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div style={{ padding: "1em", fontFamily: "system-ui, sans-serif" }}>
      <h2>🧮 Model Token Prices (×10⁶)</h2>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "1em",
          border: "1px solid #ccc",
        }}
      >
        <thead style={{ backgroundColor: "#f2f2f2" }}>
          <tr>
            <th style={thStyle}>Model ID</th>
            <th style={thStyle}>Input Token Price (×10⁶)</th>
            <th style={thStyle}>Output Token Price (×10⁶)</th>
          </tr>
        </thead>
        <tbody>
          {models.map((m) => (
            <tr key={m.id}>
              <td style={tdStyle}>{m.id}</td>
              <td style={{ ...tdStyle, textAlign: "right" }}>{m.input_token_price}</td>
              <td style={{ ...tdStyle, textAlign: "right" }}>{m.output_token_price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Simple styling
const thStyle = {
  textAlign: "left",
  padding: "10px 8px",
  borderBottom: "2px solid #ddd",
  fontWeight: "bold",
};

const tdStyle = {
  padding: "8px",
  borderBottom: "1px solid #eee",
  fontSize: "0.95rem",
};
