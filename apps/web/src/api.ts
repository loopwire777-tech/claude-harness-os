import type { Card, ColumnId } from "@task-board/shared";

const base = "/api";

export async function fetchCards(): Promise<Card[]> {
  const res = await fetch(`${base}/cards`);
  return res.json();
}

export async function createCard(title: string, columnId: ColumnId): Promise<Card> {
  const res = await fetch(`${base}/cards`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, columnId }),
  });
  return res.json();
}

export async function moveCard(id: string, columnId: ColumnId): Promise<Card> {
  const res = await fetch(`${base}/cards/${id}/move`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ columnId }),
  });
  return res.json();
}

export async function completeCard(id: string): Promise<Card> {
  const res = await fetch(`${base}/cards/${id}/complete`, { method: "PATCH" });
  return res.json();
}

export async function deleteCard(id: string): Promise<void> {
  const res = await fetch(`${base}/cards/${id}`, { method: "DELETE" });
  if (!res.ok) {
    throw new Error(`Failed to delete card: ${res.status}`);
  }
}
