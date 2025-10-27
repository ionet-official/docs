import React, { useEffect, useState } from "react";

export const FetchModelPrices = () => {
  const [models, setModels] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://api.intelligence.io.solutions/api/v1/models");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();

        // Handle different possible response shapes
        const modelArray = Array.isArray(result)
          ? result
          : result.data || result.models || result.items || [];

        if (!Array.isArray(modelArray)) {
          throw new Error("Unexpected API format");
        }

        const filteredData = modelArray.map(({ id, input_token_price, output_token_price }) => ({
          id,
          input_token_price,
          output_token_price,
        }));

        setModels(filteredData);
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
    <div style={{ padding: "1em", fontFamily: "sans-serif" }}>
      <h2>Model Prices</h2>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "1em",
          textAlign: "left",
        }}
      >
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Input Token Price</th>
            <th style={thStyle}>Output Token Price</th>
          </tr>
        </thead>
        <tbody>
          {models.map((m) => (
            <tr key={m.id}>
              <td style={tdStyle}>{m.id}</td>
              <td style={tdStyle}>{m.input_token_price}</td>
              <td style={tdStyle}>{m.output_token_price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Basic table styling
const thStyle = {
  borderBottom: "2px solid #ddd",
  padding: "8px",
  backgroundColor: "#f9f9f9",
  fontWeight: "bold",
};

const tdStyle = {
  borderBottom: "1px solid #eee",
  padding: "8px",
};

export default FetchModelPricesTable;
