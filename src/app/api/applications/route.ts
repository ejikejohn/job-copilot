import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/applications - list the logged-in user's applications
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const applications = await prisma.application.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(applications);
}

// POST /api/applications - create a new application for the logged-in user
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { company, role, jobUrl, jobDescription, notes } =
      await request.json();

    if (!company || !role) {
      return NextResponse.json(
        { error: "Company and role are required." },
        { status: 400 }
      );
    }

    const application = await prisma.application.create({
      data: {
        company,
        role,
        jobUrl: jobUrl || null,
        jobDescription: jobDescription || null,
        notes: notes || null,
        userId: session.user.id,
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error("Create application error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
