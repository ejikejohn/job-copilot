import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH /api/applications/:id - update a single application (e.g. its status)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Security check: make sure this application actually belongs to the
  // logged-in user before letting them change it. Never trust the client.
  const existing = await prisma.application.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json();
  const allowedFields = [
    "company",
    "role",
    "jobUrl",
    "jobDescription",
    "status",
    "notes",
  ] as const;

  const data: Record<string, string | null> = {};
  for (const field of allowedFields) {
    if (field in body) {
      data[field] = body[field];
    }
  }

  const updated = await prisma.application.update({
    where: { id },
    data,
  });

  return NextResponse.json(updated);
}

// DELETE /api/applications/:id - remove an application
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.application.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.application.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
