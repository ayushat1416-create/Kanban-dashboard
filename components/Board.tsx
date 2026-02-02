"use client";

import React, { useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCorners,
} from "@dnd-kit/core";
import Column from "./Column";
import TaskCard from "./TaskCard";
import { KanbanData, Task } from "@/lib/initialData";

interface Props {
  data: KanbanData;
  setData: React.Dispatch<React.SetStateAction<KanbanData>>;
}

function parseTaskId(id: string) {
  // expected: "columnId:taskId"
  const [colId, taskId] = id.split(":");
  return { colId, taskId };
}

export default function Board({ data, setData }: Props) {
  // ✅ HARD GUARD: prevents "map of undefined"
 /* if (!data || !Array.isArray(data.columnOrder) || !data.columns) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded">
        Invalid board data (columnOrder/columns missing)
        <pre className="mt-2 text-xs">{JSON.stringify(data, null, 2)}</pre>
      </div>
    );
  }*/

  const [activeId, setActiveId] = useState<string | null>(null);

  const activeTask = useMemo((): { colId: string; task: Task } | null => {
    if (!activeId || !activeId.includes(":")) return null;
    const { colId, taskId } = parseTaskId(activeId);
    const task = data.columns[colId]?.tasks.find((t) => t.id === taskId);
    return task ? { colId, task } : null;
  }, [activeId, data]);

  function addTask(columnId: string, content: string) {
  setData((prev) => {
    const column = prev.columns[columnId];
    if (!column) return prev;

    const newTask = {
      id: `task-${Date.now()}`,
      content,
    };

    return {
      ...prev,
      columns: {
        ...prev.columns,
        [columnId]: {
          ...column,
          tasks: [newTask, ...column.tasks],
        },
      },
    };
  });
}

  function deleteTask(taskKey: string) {
  const { colId, taskId } = parseTaskId(taskKey);
  setData((prev) => {
    const col = prev.columns[colId];
    if (!col) return prev;

    return {
      ...prev,
      columns: {
        ...prev.columns,
        [colId]: {
          ...col,
          tasks: col.tasks.filter((t) => t.id !== taskId),
        },
      },
    };
  });
}

function editTask(taskKey: string, nextContent: string) {
  const { colId, taskId } = parseTaskId(taskKey);
  const value = nextContent.trim();
  if (!value) return;

  setData((prev) => {
    const col = prev.columns[colId];
    if (!col) return prev;

    return {
      ...prev,
      columns: {
        ...prev.columns,
        [colId]: {
          ...col,
          tasks: col.tasks.map((t) =>
            t.id === taskId ? { ...t, content: value } : t
          ),
        },
      },
    };
  });
}


  function onDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const activeStr = String(active.id);
    const overStr = String(over.id);

    // active is always a task id in format "col:task"
    if (!activeStr.includes(":")) return;

    const from = parseTaskId(activeStr);

    // over can be:
    // - a task id: "col:task"
    // - a column id: "todo" / "inprogress" / "done"
    const to = overStr.includes(":")
      ? parseTaskId(overStr)
      : { colId: overStr, taskId: "" };

    if (!from.colId || !from.taskId || !to.colId) return;
    if (!data.columns[from.colId] || !data.columns[to.colId]) return;

    setData((prev) => {
      const fromTasks = [...prev.columns[from.colId].tasks];
      const fromIndex = fromTasks.findIndex((t) => t.id === from.taskId);
      if (fromIndex === -1) return prev;

      const [moved] = fromTasks.splice(fromIndex, 1);

      // ✅ SAME COLUMN REORDER
      if (from.colId === to.colId) {
        // if dropping on column itself -> move to end
        const toIndex = to.taskId
          ? fromTasks.findIndex((t) => t.id === to.taskId)
          : fromTasks.length;

        const safeToIndex = toIndex < 0 ? fromTasks.length : toIndex;

        // Insert moved at the target index
        fromTasks.splice(safeToIndex, 0, moved);

        return {
          ...prev,
          columns: {
            ...prev.columns,
            [from.colId]: {
              ...prev.columns[from.colId],
              tasks: fromTasks,
            },
          },
        };
      }

      // ✅ MOVE ACROSS COLUMNS
      const toTasks = [...prev.columns[to.colId].tasks];
      const toIndex = to.taskId
        ? toTasks.findIndex((t) => t.id === to.taskId)
        : toTasks.length;

      const safeToIndex = toIndex < 0 ? toTasks.length : toIndex;
      toTasks.splice(safeToIndex, 0, moved);

      return {
        ...prev,
        columns: {
          ...prev.columns,
          [from.colId]: { ...prev.columns[from.colId], tasks: fromTasks },
          [to.colId]: { ...prev.columns[to.colId], tasks: toTasks },
        },
      };
    });
  }

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="flex gap-8 overflow-x-auto pb-4 px-2">
        {data.columnOrder.map((colId) => {

          const column = data.columns[colId];
          if (!column) return null;
          return <Column key={column.id} column={column} onAddTask={addTask} onDeleteTask={deleteTask}
  onEditTask={editTask}/>;

        })}
      </div>

      <DragOverlay>
        {activeTask ? (
          <TaskCard
            id={`${activeTask.colId}:${activeTask.task.id}`}
            content={activeTask.task.content}
            isOverlay
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
