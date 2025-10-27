import React, { useEffect, useState } from 'react';

const FetchModelPrices = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('https://api.intelligence.io.solutions/api/v1/models', {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
          },
        });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const data = await res.json();
        // Expecting an array; gracefully handle objects or unexpected shapes
        const list = Array.isArray(data) ? data : (Array.isArray(data?.models) ? data.models : []);
        setModels(list);
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, []);

  return (
    <div className="flex justify-center items-start min-h-screen p-6 bg-transparent text-white">
      <div className="w-full max-w-5xl">
        <h1 className="text-2xl font-semibold mb-4">Models</h1>

        {loading && (
          <div className="italic opacity-80">Loading…</div>
        )}
        {error && (
          <div className="text-red-300">Error: {error}</div>
        )}

        {!loading && !error && (
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
                {models.length === 0 && (
                  <tr>
                    <td colSpan={3} className="border border-white/40 px-4 py-6 text-center opacity-80">
                      No models found.
                    </td>
                  </tr>
                )}
                {models.map((m, i) => (
                  <tr key={m.id ?? i} className="hover:bg-white/5">
                    <td className="border border-white/40 px-4 py-2 align-middle">
                      {String(m.id ?? '')}
                    </td>
                    <td className="border border-white/40 px-4 py-2 align-middle">
                      {m.input_token_price ?? '—'}
                    </td>
                    <td className="border border-white/40 px-4 py-2 align-middle">
                      {m.output_token_price ?? '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}