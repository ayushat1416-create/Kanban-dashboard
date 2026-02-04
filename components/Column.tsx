import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Column as ColumnType } from "@/lib/initialData";
import TaskCard from "./TaskCard";
import { useState } from "react";

interface Props {
  column: ColumnType;
  onAddTask: (columnId: string, content: string) => void;
  onDeleteTask: (taskKey: string) => void;
  onEditTask: (taskKey: string, content: string) => void;
}


export default function Column({ column, onAddTask, onDeleteTask, onEditTask, }: Props) {
  const { setNodeRef } = useDroppable({ id: column.id });

  const [isAdding, setIsAdding] = useState(false);
  const [text, setText] = useState("");

  function submit() {
    const value = text.trim();
    if (!value) return;
    onAddTask(column.id, value);
    setText("");
    setIsAdding(false);
  }

  return (
    <div className="w-80 bg-white rounded-2xl shadow-lg p-5 flex-shrink-0 border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
      <div className="mb-4 pb-4 border-b-2 border-blue-100 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-lg text-slate-800">{column.title}</h3>
          <p className="text-xs text-slate-500 mt-1">{column.tasks.length} tasks</p>
        </div>

        {!isAdding ? (
          <button
            onClick={() => setIsAdding(true)}
            className="text-sm px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            + Add
          </button>
        ) : (
          <button
            onClick={() => {
              setIsAdding(false);
              setText("");
            }}
            className="text-sm px-3 py-1.5 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 transition"
          >
            Cancel
          </button>
        )}
      </div>

      {isAdding && (
        <div className="mb-4 space-y-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
              if (e.key === "Escape") {
                setIsAdding(false);
                setText("");
              }
            }}
            placeholder="Task title..."
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-300"
            autoFocus
          />
          <button
            onClick={submit}
            className="w-full rounded-lg bg-blue-600 text-white py-2 text-sm hover:bg-blue-700 transition"
          >
            Add task
          </button>
        </div>
      )}

      <div
        ref={setNodeRef}
        className="space-y-3 min-h-[400px] bg-gradient-to-b from-blue-50/30 to-transparent rounded-xl p-3"
      >
        <SortableContext
          items={column.tasks.map((t) => `${column.id}:${t.id}`)}
          strategy={verticalListSortingStrategy}
        >
          {column.tasks.length === 0 ? (
            <div className="flex items-center justify-center h-full text-slate-400">
              <p className="text-sm">Drop tasks here</p>
            </div>
          ) : (
            column.tasks.map((task) => (
  <TaskCard
    key={task.id}
    id={`${column.id}:${task.id}`}
    content={task.content}
    onDelete={onDeleteTask}
    onEdit={onEditTask}
  />
))

          )}
        </SortableContext>
      </div>
    </div>
  );
}
