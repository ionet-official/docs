import React, { useEffect, useState } from 'react';

export const FetchModelPrices = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchModels() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('https://api.intelligence.io.solutions/api/v1/models', {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        const data = await res.json();
        const list = Array.isArray(data) ? data : (Array.isArray(data.models) ? data.models : []);
        setModels(list);
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message || 'Unexpected error');
      } finally {
        setLoading(false);
      }
    }

    fetchModels();
    return () => controller.abort();
  }, []);

  return (
    <div className="flex justify-center items-start min-h-screen p-6 bg-transparent text-white">
      <div className="w-full max-w-5xl">
        <h1 className="text-2xl font-semibold mb-4">Model Pricing Data</h1>

        {loading && <div className="italic opacity-80">Loading...</div>}
        {error && <div className="text-red-300">Error: {error}</div>}

        {!loading && !error && models.length > 0 && (
          <div className="overflow-x-auto rounded-2xl">
            <table className="min-w-full border-collapse border border-white/40 text-white">
              <thead>
                <tr className="bg-white/10">
                  <th className="border border-white/40 px-4 py-2 text-left">ID</th>
                  <th className="border border-white/40 px-4 py-2 text-left">Input Token Price</th>
                  <th className="border border-white/40 px-4 py-2 text-left">Output Token Price</th>
                </tr>
              </thead>
              <tbody>
                {models.map((m, i) => (
                  <tr key={m.id ?? i} className="hover:bg-white/5">
                    <td className="border border-white/40 px-4 py-2">{String(m.id ?? '')}</td>
                    <td className="border border-white/40 px-4 py-2">{m.input_token_price ?? '—'}</td>
                    <td className="border border-white/40 px-4 py-2">{m.output_token_price ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && models.length === 0 && (
          <div className="opacity-80">No data available.</div>
        )}
      </div>
    </div>
  );
}