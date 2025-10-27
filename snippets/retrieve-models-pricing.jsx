import React, { useEffect, useState } from "react";

export const FetchModelPrices = () => {
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

        // Assuming the response is an array of model objects
        const filteredData = result.map(({ id, input_token_price, output_token_price }) => ({
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

  if (error) {
    return <pre>Error: {error}</pre>;
  }

  return (
    <div style={{ whiteSpace: "pre-wrap", fontFamily: "monospace", padding: "1em" }}>
      {models.length > 0
        ? models
            .map(
              (model) =>
                `ID: ${model.id}\nInput Token Price: ${model.input_token_price}\nOutput Token Price: ${model.output_token_price}\n`
            )
            .join("\n-------------------------\n")
        : "Loading..."}
    </div>
  );
}