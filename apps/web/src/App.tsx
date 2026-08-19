import { useEffect, useState } from "react";
import type { Card, ColumnId } from "@task-board/shared";
import { fetchCards, createCard, moveCard, completeCard, deleteCard } from "./api";
import { formatRelativeTime } from "./relativeTime";
import "./App.css";

const COLUMNS: { id: ColumnId; label: string }[] = [
  { id: "todo", label: "To Do" },
  { id: "in-progress", label: "In Progress" },
  { id: "done", label: "Done" },
];

export function App() {
  const [cards, setCards] = useState<Card[]>([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

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

  async function handleDelete(id: string) {
    try {
      await deleteCard(id);
      setCards((prev) => prev.filter((c) => c.id !== id));
      setError(null);
    } catch {
      setError("Failed to delete card. Please try again.");
    }
  }

  return (
    <div className="board">
      <h1>Task Board</h1>
      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}
      <form className="new-card-form" onSubmit={handleCreate}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New card title"
        />
        <button type="submit">Add card</button>
      </form>
      <div className="columns">
        {COLUMNS.map((column) => (
          <div key={column.id} className="column">
            <h2>{column.label}</h2>
            {cards
              .filter((c) => c.columnId === column.id)
              .map((card) => (
                <div key={card.id} className="card" data-testid="card">
                  <span className={`card-title${card.completed ? " completed" : ""}`}>
                    {card.title}
                  </span>
                  <div className="card-controls">
                    <time className="card-time" dateTime={card.createdAt} data-testid="card-created-at">
                      {formatRelativeTime(card.createdAt)}
                    </time>
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
                    <button
                      className="delete-btn"
                      aria-label={`Delete ${card.title}`}
                      onClick={() => handleDelete(card.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
