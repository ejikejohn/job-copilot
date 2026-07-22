"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { BoardColumn } from "./BoardColumn";
import { ApplicationCard } from "./ApplicationCard";
import { AddApplicationForm } from "./AddApplicationForm";
import {
  STATUS_COLUMNS,
  type Application,
  type ApplicationStatus,
} from "@/types/application";

export function Board({
  initialApplications,
}: {
  initialApplications: Application[];
}) {
  const [applications, setApplications] = useState(initialApplications);
  const [activeApp, setActiveApp] = useState<Application | null>(null);

  // A sensor defines how a drag gesture is detected. Requiring the pointer
  // to move 5px before starting a drag prevents accidental drags on simple clicks.
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  function handleDragStart(event: DragStartEvent) {
    const app = applications.find((a) => a.id === event.active.id);
    setActiveApp(app ?? null);
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveApp(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    // `over.id` is either another card's id, or a column id if dropped
    // directly on an empty/near-empty column area.
    const overId = over.id as string;

    const activeApplication = applications.find((a) => a.id === activeId);
    if (!activeApplication) return;

    const targetColumn = STATUS_COLUMNS.find((c) => c.id === overId);
    const overApplication = applications.find((a) => a.id === overId);

    const newStatus: ApplicationStatus | undefined =
      targetColumn?.id ?? overApplication?.status;

    if (!newStatus || newStatus === activeApplication.status) return;

    // Optimistic update: change the UI immediately, don't wait for the server.
    // This is what makes drag-and-drop feel instant instead of laggy.
    setApplications((prev) =>
      prev.map((a) => (a.id === activeId ? { ...a, status: newStatus } : a))
    );

    const res = await fetch(`/api/applications/${activeId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    // If the server rejected the change, roll back the optimistic update.
    if (!res.ok) {
      setApplications((prev) =>
        prev.map((a) =>
          a.id === activeId ? { ...a, status: activeApplication.status } : a
        )
      );
    }
  }

  async function handleDelete(id: string) {
    const previous = applications;
    setApplications((prev) => prev.filter((a) => a.id !== id));

    const res = await fetch(`/api/applications/${id}`, { method: "DELETE" });
    if (!res.ok) {
      // Roll back if the delete failed on the server
      setApplications(previous);
    }
  }

  function handleCreated(newApp: Application) {
    setApplications((prev) => [newApp, ...prev]);
  }

  return (
    <div>
      <div className="mb-4">
        <AddApplicationForm onCreated={handleCreated} />
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STATUS_COLUMNS.map((column) => (
            <BoardColumn
              key={column.id}
              id={column.id}
              label={column.label}
              applications={applications.filter(
                (a) => a.status === column.id
              )}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {/* DragOverlay renders the card that's currently being dragged,
            floating above everything else, following the cursor smoothly. */}
        <DragOverlay>
          {activeApp ? (
            <ApplicationCard application={activeApp} onDelete={() => {}} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
