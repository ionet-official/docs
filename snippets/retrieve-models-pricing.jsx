// File: FetchModelPricesTable.jsx
import React, { useEffect, useState } from "react";

export const FetchModelPricesTable = () => {
  const [models, setModels] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch("https://api.intelligence.io.solutions/api/v1/models");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();

        // Normalize response structure
        const modelArray =
          Array.isArray(result)
            ? result
            : result.data || result.models || result.items || [];

        if (!Array.isArray(modelArray)) {
          throw new Error("Unexpected API format");
        }

        // Filter only needed fields
        const filteredData = modelArray.map(({ id, input_token_price, output_token_price }) => ({
          id,
          input_token_price,
          output_token_price,
        }));

        setModels(filteredData);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchModels();
  }, []);

  if (error) return <pre>Error: {error}</pre>;
  if (models.length === 0) return <pre>Loading...</pre>;

  // Build Markdown table text
  const tableHeader = "| ID | Input Token Price | Output Token Price |\n| --- | --- | --- |";
  const tableRows = models
    .map(
      (m) =>
        `| ${m.id ?? "-"} | ${m.input_token_price ?? "-"} | ${m.output_token_price ?? "-"} |`
    )
    .join("\n");

  const markdownTable = `${tableHeader}\n${tableRows}`;

  return (
    <div style={{ fontFamily: "monospace", whiteSpace: "pre-wrap", padding: "1em" }}>
      {markdownTable}
    </div>
  );
}