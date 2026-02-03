import json
from pathlib import Path
from collections import defaultdict
from sklearn.cluster import KMeans
from sentence_transformers import SentenceTransformer
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

print("Loading local model...")

model_name = "google/flan-t5-small"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

with open("../app/feedback.json") as f:
    data = json.load(f)

# Group feedback by concept
by_concept = defaultdict(list)
for row in data:
    by_concept[row.get("concept", "general")].append(row["text"])

embedder = SentenceTransformer("all-MiniLM-L6-v2")

book_path = Path("../book/intro.md")
book_text = book_path.read_text(encoding="utf-8")

for concept, texts in by_concept.items():
    if not texts:
        continue

    print(f"\n=== Concept: {concept} ===")

    embeddings = embedder.encode(texts)

    k = min(2, len(texts))
    kmeans = KMeans(n_clusters=k, random_state=0).fit(embeddings)

    clusters = defaultdict(list)
    for t, label in zip(texts, kmeans.labels_):
        clusters[int(label)].append(t)

    for cid, items in clusters.items():
        print(f"\nCluster {cid}:")
        for t in items:
            print(" -", t)

        prompt = (
            "Students said:\n"
            + "\n".join(items)
            + "\n\nExplain this topic again clearly and simply for beginners."
        )

        inputs = tokenizer(prompt, return_tensors="pt")
        outputs = model.generate(**inputs, max_new_tokens=120, do_sample=False)
        explanation = tokenizer.decode(outputs[0], skip_special_tokens=True)

        insert = f"\n\n### Auto-generated clarification ({concept})\n\n{explanation.strip()}\n"

        # Insert after matching concept anchor if possible
        anchor = f"{{#{concept}}}"
        if anchor in book_text:
            parts = book_text.split(anchor)
            book_text = parts[0] + anchor + insert + parts[1]
        else:
            # fallback: append
            book_text += insert

        print("\nGenerated:\n", explanation)

# Write updated book
book_path.write_text(book_text, encoding="utf-8")

print("\n✅ Textbook updated per concept.")