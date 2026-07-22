import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

// This function runs when the frontend sends a POST request to /api/signup
export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // 1. Basic validation - never trust data coming from the client
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    // 2. Check if a user with this email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    // 3. Hash the password before storing it - never save plain text passwords
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create the user in the database
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // 5. Never send the password hash back to the client, even hashed
    return NextResponse.json(
      { id: user.id, name: user.name, email: user.email },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
