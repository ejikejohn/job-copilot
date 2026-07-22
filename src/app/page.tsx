export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 text-center dark:bg-zinc-950">
      <span className="mb-4 rounded-full border border-zinc-300 px-3 py-1 text-xs font-medium tracking-wide text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
        BUILT BY YOU · POWERED BY AI
      </span>
      <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl dark:text-white">
        Job Copilot
      </h1>
      <p className="mt-4 max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
        Track every application, score your fit against any job description,
        and generate tailored cover letters — all in one place.
      </p>
      <div className="mt-8 flex gap-4">
        <a
          href="/dashboard"
          className="rounded-lg bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}
