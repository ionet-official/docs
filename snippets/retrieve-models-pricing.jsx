export function FetchModelsRaw() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("https://api.intelligence.io.solutions/api/v1/models");
        if (!res.ok) {
          throw new Error("HTTP error! status: " + res.status);
        }
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <p>Loading data...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <pre
      style={{
        background: "#f4f4f4",
        padding: "16px",
        borderRadius: "8px",
        overflowX: "auto",
        whiteSpace: "pre-wrap"
      }}
    >
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}
