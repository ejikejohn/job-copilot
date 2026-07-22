"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Application } from "@/types/application";

export function ApplicationCard({
  application,
  onDelete,
}: {
  application: Application;
  onDelete: (id: string) => void;
}) {
  // useSortable gives us everything needed to make this card draggable:
  // - attributes/listeners: spread onto the element to detect drag gestures
  // - transform/transition: CSS values that animate the card while dragging
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: application.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group cursor-grab rounded-lg border border-zinc-200 bg-white p-3 shadow-sm active:cursor-grabbing dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-white">
            {application.role}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {application.company}
          </p>
        </div>
        <button
          type="button"
          // Stop the click from also triggering a drag gesture
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onDelete(application.id)}
          className="opacity-0 transition-opacity group-hover:opacity-100 text-zinc-400 hover:text-red-500"
          aria-label="Delete application"
        >
          ✕
        </button>
      </div>
      {application.jobUrl && (
        <a
          href={application.jobUrl}
          target="_blank"
          rel="noopener noreferrer"
          onPointerDown={(e) => e.stopPropagation()}
          className="mt-2 inline-block text-xs text-blue-600 underline dark:text-blue-400"
        >
          View posting ↗
        </a>
      )}
    </div>
  );
}
