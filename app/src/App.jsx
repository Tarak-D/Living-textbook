import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import Dashboard from "./Dashboard";

function App() {
  const [content, setContent] = useState("");
  const [feedback, setFeedback] = useState("");
  const [concept, setConcept] = useState("derivative");
  const [page, setPage] = useState("book");

  useEffect(() => {
    fetch("http://localhost:3001/book")
      .then((res) => res.text())
      .then(setContent);
  }, []);

  async function submitFeedback() {
    await fetch("http://localhost:3001/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: feedback, concept }),
    });

    setFeedback("");

    const updated = await fetch("http://localhost:3001/book").then((r) =>
      r.text()
    );
    setContent(updated);
  }

  if (page === "dashboard") {
    return (
      <div className="container">
        <div className="nav">
          <button onClick={() => setPage("book")}>← Book</button>
        </div>
        <Dashboard />
      </div>
    );
  }

  return (
    <div className="container">
      <div className="nav">
        <h2>📘 Living Textbook</h2>
        <button onClick={() => setPage("dashboard")}>Dashboard</button>
      </div>

      <ReactMarkdown>{content}</ReactMarkdown>

      <hr />

      <label>Concept</label>
      <select value={concept} onChange={(e) => setConcept(e.target.value)}>
        <option value="derivative">Derivative</option>
        <option value="limit">Limit</option>
        <option value="general">General</option>
      </select>

      <label style={{ marginTop: 20 }}>Your feedback</label>

      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Explain what confused you…"
        style={{ height: 120 }}
      />

      <br />
      <br />

      <button onClick={submitFeedback}>Submit</button>
    </div>
  );
}

export default App;