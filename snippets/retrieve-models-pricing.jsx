import React, { useEffect, useState } from "react";

export const FetchModelPrices = () => {
  const [tableText, setTableText] = useState("Loading...");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch("https://api.intelligence.io.solutions/api/v1/models");
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const result = await response.json();

        // Normalize possible structures
        const modelArray = Array.isArray(result)
          ? result
          : result.data || result.models || result.items || [];

        if (!Array.isArray(modelArray)) throw new Error("Unexpected API format");

        // Create table rows with values * 1,000,000 and formatted nicely
        const rows = modelArray.map(({ id, input_token_price, output_token_price }) => {
          const inPrice = (input_token_price * 1_000_000).toFixed(2);
          const outPrice = (output_token_price * 1_000_000).toFixed(2);
          return `| ${id ?? "-"} | ${inPrice} | ${outPrice} |`;
        });

        // Construct the markdown table
        const markdown =
          `### Model Token Prices\n\n` +
          `| Model | Input/M | Output/M |\n` +
          `| --- | ---: | ---: |\n` +
          rows.join("\n");

        setTableText(markdown);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchModels();
  }, []);

  if (error) return <pre style={{ color: "red" }}>Error: {error}</pre>;

  return (
    <div style={{ fontFamily: "monospace", whiteSpace: "pre-wrap", padding: "1em" }}>
      {tableText}
    </div>
  );
}