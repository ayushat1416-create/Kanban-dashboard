import { KanbanData } from "./initialData";

const KEY = "kanbanData";

// Use unknown instead of any (lint-safe)
function isValidKanbanData(x: unknown): x is KanbanData {
  if (!x || typeof x !== "object") return false;

  const obj = x as Record<string, unknown>;

  const columns = obj.columns;
  const columnOrder = obj.columnOrder;

  if (!columns || typeof columns !== "object") return false;
  if (!Array.isArray(columnOrder) || columnOrder.length === 0) return false;

  const columnsObj = columns as Record<string, unknown>;

  // Every columnOrder id must exist and have tasks array
  for (const colId of columnOrder) {
    if (typeof colId !== "string") return false;

    const col = columnsObj[colId];
    if (!col || typeof col !== "object") return false;

    const colObj = col as Record<string, unknown>;
    if (!Array.isArray(colObj.tasks)) return false;
  }

  return true;
}

export const loadData = (): KanbanData | null => {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (!isValidKanbanData(parsed)) return null;

    return parsed;
  } catch {
    return null;
  }
};

export const saveData = (data: KanbanData): void => {
  localStorage.setItem(KEY, JSON.stringify(data));
};
