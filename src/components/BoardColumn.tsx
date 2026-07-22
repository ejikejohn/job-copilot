"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ApplicationCard } from "./ApplicationCard";
import type { Application, ApplicationStatus } from "@/types/application";

export function BoardColumn({
  id,
  label,
  applications,
  onDelete,
}: {
  id: ApplicationStatus;
  label: string;
  applications: Application[];
  onDelete: (id: string) => void;
}) {
  // useDroppable marks this column as a valid place to drop a card into,
  // even when the column itself is empty.
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`flex w-72 shrink-0 flex-col rounded-xl border p-3 transition-colors ${
        isOver
          ? "border-zinc-400 bg-zinc-100 dark:border-zinc-500 dark:bg-zinc-800/50"
          : "border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50"
      }`}
    >
      <div className="mb-3 flex items-center justify-between px-1">
        <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          {label}
        </h2>
        <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
          {applications.length}
        </span>
      </div>

      <SortableContext
        items={applications.map((a) => a.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex min-h-[80px] flex-col gap-2">
          {applications.map((app) => (
            <ApplicationCard
              key={app.id}
              application={app}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
