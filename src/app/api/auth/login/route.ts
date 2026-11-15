import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getAdminClient } from "@/lib/supabase/admin";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = LoginSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid credentials format" },
        { status: 400 }
      );
    }

    const { email, password } = validated.data;
    const serverClient = createServerSupabaseClient();
    const admin = getAdminClient();

    if (serverClient) {
      const { data: authData, error: authError } = await serverClient.auth.signInWithPassword({
        email,
        password,
      });

      if (authError || !authData.user) {
        return NextResponse.json(
          { error: authError?.message || "Invalid email or password" },
          { status: 401 }
        );
      }

      // Fetch profile from database to get verified server-assigned role
      const clientToQuery = admin || serverClient;
      const { data: profile, error: profileError } = await clientToQuery
        .from("profiles")
        .select("id, email, full_name, role, phone, avatar_url")
        .eq("id", authData.user.id)
        .single();

      if (profileError || !profile) {
        return NextResponse.json(
          { error: "Associated user profile not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        user: profile,
        session: {
          access_token: authData.session.access_token,
          expires_at: authData.session.expires_at,
        },
      });
    }

    // Demo fallback for testing without Supabase connection
    return NextResponse.json({
      success: true,
      demoMode: true,
      message: "Signed in using local demo credentials.",
      user: {
        id: "demo-user",
        email,
        full_name: email.split("@")[0],
        role: "elderly",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Login request failed", details: String(error) },
      { status: 500 }
    );
  }
}

