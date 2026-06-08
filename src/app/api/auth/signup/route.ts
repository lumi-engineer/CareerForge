import { NextRequest, NextResponse } from "next/server";
import { registerUser, createSession, AuthError } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required." }, { status: 400 });
    }

    const user = await registerUser(email, password, name);
    await createSession(user);

    return NextResponse.json({ success: true, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
    console.error("Signup error:", error);
    return NextResponse.json({ success: false, error: "Failed to create account." }, { status: 500 });
  }
}
