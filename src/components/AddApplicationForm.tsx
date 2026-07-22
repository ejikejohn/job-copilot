"use client";

import { useState } from "react";
import type { Application } from "@/types/application";

export function AddApplicationForm({
  onCreated,
}: {
  onCreated: (application: Application) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company, role, jobUrl }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong.");
      return;
    }

    onCreated(data);
    setCompany("");
    setRole("");
    setJobUrl("");
    setIsOpen(false);
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        + Add Application
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 flex flex-wrap items-end gap-3 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
    >
      <div className="flex flex-col">
        <label className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">
          Company
        </label>
        <input
          required
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="w-40 rounded-lg border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          placeholder="Acme Corp"
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">
          Role
        </label>
        <input
          required
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-48 rounded-lg border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          placeholder="Frontend Developer"
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">
          Job URL (optional)
        </label>
        <input
          value={jobUrl}
          onChange={(e) => setJobUrl(e.target.value)}
          className="w-56 rounded-lg border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          placeholder="https://..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-zinc-900 px-4 py-1.5 text-sm font-semibold text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {loading ? "Adding..." : "Add"}
      </button>
      <button
        type="button"
        onClick={() => setIsOpen(false)}
        className="rounded-lg border border-zinc-300 px-4 py-1.5 text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
      >
        Cancel
      </button>

      {error && (
        <p className="w-full text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </form>
  );
}
