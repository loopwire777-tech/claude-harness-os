import { useEffect, useState } from "react";
import type { Card, ColumnId } from "@task-board/shared";
import { fetchCards, createCard, moveCard, completeCard } from "./api";

const COLUMNS: { id: ColumnId; label: string }[] = [
  { id: "todo", label: "To Do" },
  { id: "in-progress", label: "In Progress" },
  { id: "done", label: "Done" },
];

export function App() {
  const [cards, setCards] = useState<Card[]>([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetchCards().then(setCards);
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const card = await createCard(title, "todo");
    setCards((prev) => [...prev, card]);
    setTitle("");
  }

  async function handleMove(id: string, columnId: ColumnId) {
    const card = await moveCard(id, columnId);
    setCards((prev) => prev.map((c) => (c.id === id ? card : c)));
  }

  async function handleComplete(id: string) {
    const card = await completeCard(id);
    setCards((prev) => prev.map((c) => (c.id === id ? card : c)));
  }

  return (
    <div>
      <h1>Task Board</h1>
      <form onSubmit={handleCreate}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New card title"
        />
        <button type="submit">Add card</button>
      </form>
      <div style={{ display: "flex", gap: "1rem" }}>
        {COLUMNS.map((column) => (
          <div key={column.id} style={{ flex: 1 }}>
            <h2>{column.label}</h2>
            {cards
              .filter((c) => c.columnId === column.id)
              .map((card) => (
                <div key={card.id} data-testid="card">
                  <span style={{ textDecoration: card.completed ? "line-through" : "none" }}>
                    {card.title}
                  </span>
                  <select
                    value={card.columnId}
                    onChange={(e) => handleMove(card.id, e.target.value as ColumnId)}
                  >
                    {COLUMNS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                  {!card.completed && (
                    <button onClick={() => handleComplete(card.id)}>Complete</button>
                  )}
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
