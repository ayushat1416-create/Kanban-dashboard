import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  id: string;
  content: string;
  isOverlay?: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (id: string, content: string) => void;
}

export default function TaskCard({ id, content, isOverlay, onDelete, onEdit }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id,
      disabled: !!isOverlay,
    });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      // ✅ attributes can stay on the root
      {...(!isOverlay ? attributes : {})}
      className={`
        bg-gradient-to-br from-white to-blue-50 rounded-lg p-4 shadow-md
        border-2 ${isOverlay ? "border-blue-400 shadow-xl" : "border-blue-200 hover:border-blue-400"}
        transition-all duration-200 select-none
        ${!isOverlay ? "hover:shadow-lg hover:-translate-y-1" : ""}
        ${!isOverlay && isDragging ? "opacity-40" : ""}
      `}
    >
      {/* ✅ Drag handle (only this part starts drag) */}
      {!isOverlay && (
        <div
          {...listeners}
          className="mb-2 flex items-center justify-between cursor-grab active:cursor-grabbing touch-none"
        >
          <span className="text-xs text-slate-400">Drag</span>
          <span className="text-slate-300">⋮⋮</span>
        </div>
      )}

      <p className="text-sm text-slate-700 font-medium leading-relaxed">
        {content}
      </p>

      <div className="mt-2 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-blue-400" />
        <span className="text-xs text-slate-400">
          {isOverlay ? "Dragging" : "Draggable"}
        </span>
      </div>

      {/* ✅ Buttons are now fully clickable */}
      {!isOverlay && (
        <div className="mt-3 flex justify-end gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (!onEdit) return;

              const next = window.prompt("Edit task", content);
              if (next === null) return;

              const trimmed = next.trim();
              if (!trimmed) return;

              onEdit(id, trimmed);
            }}
            className="text-xs px-2 py-1 rounded bg-slate-200 hover:bg-slate-300"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (!onDelete) return;
              onDelete(id);
            }}
            className="text-xs px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
