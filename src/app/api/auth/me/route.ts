import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const serverClient = createServerSupabaseClient();
    if (!serverClient) {
      return NextResponse.json({ authenticated: false, demoMode: true });
    }

    const { data: { user }, error: authError } = await serverClient.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Fetch verified profile
    const { data: profile } = await serverClient
      .from("profiles")
      .select("id, email, full_name, role, phone, avatar_url")
      .eq("id", user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ authenticated: false, error: "Profile missing" }, { status: 404 });
    }

    // If family member, fetch linked patients
    let linkedPatients: any[] = [];
    if (profile.role === "family") {
      const { data: memberships } = await serverClient
        .from("family_memberships")
        .select(`
          elderly_id,
          relationship,
          can_edit_meds,
          elderly_profiles:elderly_id (
            id,
            date_of_birth,
            blood_group,
            medical_notes,
            emergency_contact_name,
            emergency_contact_phone,
            profiles:id (
              full_name,
              email
            )
          )
        `)
        .eq("family_user_id", user.id);
      linkedPatients = memberships || [];
    }

    // If caretaker, fetch assigned patients
    let assignedPatients: any[] = [];
    if (profile.role === "caretaker") {
      const { data: assignments } = await serverClient
        .from("caretaker_assignments")
        .select(`
          elderly_id,
          role_title,
          is_primary,
          elderly_profiles:elderly_id (
            id,
            medical_notes,
            emergency_contact_name,
            emergency_contact_phone,
            profiles:id (
              full_name,
              email
            )
          )
        `)
        .eq("caretaker_id", user.id);
      assignedPatients = assignments || [];
    }

    return NextResponse.json({
      authenticated: true,
      user: profile,
      linkedPatients,
      assignedPatients,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Session verification error", details: String(error) },
      { status: 500 }
    );
  }
}
