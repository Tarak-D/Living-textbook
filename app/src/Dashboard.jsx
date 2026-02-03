import { useEffect, useState } from "react";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/stats")
      .then((r) => r.json())
      .then(setStats);
  }, []);

  if (!stats) return <div>Loading…</div>;

  return (
    <>
      <h2>📊 Learning Dashboard</h2>

      <p>
        Total feedback: <b>{stats.total}</b>
      </p>

      <h3>By concept</h3>

      {Object.entries(stats.byConcept).map(([k, v]) => (
        <div className="card" key={k}>
          <span className={`badge ${k}`}>{k}</span> {v} entries
        </div>
      ))}

      <h3>Recent feedback</h3>

      {stats.recent.map((r, i) => (
        <div className="card" key={i}>
          <span className={`badge ${r.concept}`}>{r.concept}</span>
          {r.text}
        </div>
      ))}
    </>
  );
}