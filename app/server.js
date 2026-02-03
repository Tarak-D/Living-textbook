import express from "express";
import fs from "fs";
import cors from "cors";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

const BOOK_PATH = path.resolve("../book/intro.md");

// Serve textbook
app.get("/book", (req, res) => {
  res.sendFile(BOOK_PATH);
});

// Receive feedback
app.post("/feedback", (req, res) => {
  const entry = {
    text: req.body.text,
    concept: req.body.concept || "general",
    time: new Date().toISOString(),
  };

  let data = [];
  if (fs.existsSync("feedback.json")) {
    data = JSON.parse(fs.readFileSync("feedback.json"));
  }

  data.push(entry);

  fs.writeFileSync("feedback.json", JSON.stringify(data, null, 2));

  res.json({ ok: true });
});

// Simple dashboard stats
app.get("/stats", (req, res) => {
  let data = [];
  if (fs.existsSync("feedback.json")) {
    data = JSON.parse(fs.readFileSync("feedback.json"));
  }

  const byConcept = {};
  for (const row of data) {
    const c = row.concept || "general";
    byConcept[c] = (byConcept[c] || 0) + 1;
  }

  res.json({
    total: data.length,
    byConcept,
    recent: data.slice(-10).reverse(),
  });
});

app.listen(3001, () => {
  console.log("Server running on 3001");
});