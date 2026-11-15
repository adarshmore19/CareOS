import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const serverClient = createServerSupabaseClient();
    if (serverClient) {
      await serverClient.auth.signOut();
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Logout failed", details: String(error) },
      { status: 500 }
    );
  }
}

