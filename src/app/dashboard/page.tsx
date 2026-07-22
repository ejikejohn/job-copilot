import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Board } from "@/components/Board";
import type { Application } from "@/types/application";

// This is a Server Component (no "use client"), so we can directly
// check the session and query the database before the page even renders.
export default async function DashboardPage() {
  const session = await auth();

  // Route protection: if there's no logged-in user, bounce them to /login
  if (!session?.user) {
    redirect("/login");
  }

  const applications = await prisma.application.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  // Prisma returns real Date objects, but once this data crosses to a
  // Client Component it gets JSON-serialized, turning dates into strings.
  // We convert explicitly here so our types stay accurate end-to-end.
  const serializedApplications: Application[] = applications.map((app) => ({
    ...app,
    status: app.status as Application["status"],
    createdAt: app.createdAt.toISOString(),
    updatedAt: app.updatedAt.toISOString(),
  }));


  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Welcome, {session.user.name || session.user.email}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            You have {applications.length} application
            {applications.length === 1 ? "" : "s"} tracked.
          </p>
        </div>

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button
            type="submit"
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Log out
          </button>
        </form>
      </div>

      <Board initialApplications={serializedApplications} />
    </div>
  );
}
