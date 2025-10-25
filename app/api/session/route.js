import { getSession } from "lib/auth";
import { clearSession } from "lib/actions";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();
  return NextResponse.json({ session });
}

export async function POST() {
  try {
    const result = await clearSession();
    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, message: "Logout failed" },
        { status: 500 },
      );
    }
  } catch {
    return NextResponse.json(
      { success: false, message: "Logout failed" },
      { status: 500 },
    );
  }
}
