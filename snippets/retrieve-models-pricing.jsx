import React, { useEffect, useState } from "react";

export const FetchModels = () => {
  const [data, setData] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch("https://api.intelligence.io.solutions/api/v1/models");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        // Convert the JSON result into formatted plain text
        const plainText = JSON.stringify(result, null, 2);
        setData(plainText);
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
      {data ? data : "Loading..."}
    </div>
  );
}
