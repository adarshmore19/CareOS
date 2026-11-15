import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getAdminClient } from "@/lib/supabase/admin";
import crypto from "crypto";

const InviteSchema = z.object({
  elderly_id: z.string().min(1),
  invited_email: z.string().email(),
  relationship: z.string().min(2),
  can_edit_meds: z.boolean().default(false),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const elderly_id = searchParams.get("elderly_id");

    if (!elderly_id) {
      return NextResponse.json({ error: "Missing elderly_id parameter" }, { status: 400 });
    }

    const serverClient = createServerSupabaseClient();
    const admin = getAdminClient();

    if (serverClient) {
      const client = admin || serverClient;

      // Active members
      const { data: members } = await client
        .from("family_memberships")
        .select(`
          id,
          elderly_id,
          family_user_id,
          relationship,
          can_edit_meds,
          created_at,
          profiles:family_user_id (full_name, email, phone)
        `)
        .eq("elderly_id", elderly_id);

      // Pending invitations
      const { data: invitations } = await client
        .from("family_invitations")
        .select("*")
        .eq("elderly_id", elderly_id)
        .eq("status", "pending");

      // Consents
      const { data: consents } = await client
        .from("patient_consents")
        .select("*")
        .eq("elderly_id", elderly_id)
        .eq("is_active", true);

      return NextResponse.json({
        members: members || [],
        invitations: invitations || [],
        consents: consents || [],
      });
    }

    return NextResponse.json({
      demoMode: true,
      members: [
        {
          id: "mem-1",
          elderly_id,
          family_user_id: "user-family-1",
          relationship: "Son (Primary Guardian)",
          can_edit_meds: true,
          created_at: new Date().toISOString(),
          profiles: {
            full_name: "David Vance",
            email: "david.vance@careos.health",
            phone: "+1 (555) 876-5432",
          },
        },
      ],
      invitations: [],
      consents: [
        {
          id: "con-1",
          elderly_id,
          granted_to: "user-family-1",
          consent_type: "medical_records",
          is_active: true,
        },
        {
          id: "con-2",
          elderly_id,
          granted_to: "user-caretaker-1",
          consent_type: "medication_administration",
          is_active: true,
        },
      ],
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = InviteSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json({ error: "Validation failed", details: validated.error.format() }, { status: 400 });
    }

    const serverClient = createServerSupabaseClient();
    const admin = getAdminClient();

    if (serverClient) {
      const { data: { user } } = await serverClient.auth.getUser();
      if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

      const client = admin || serverClient;
      const token = crypto.randomBytes(24).toString("hex");

      const { data: invitation, error } = await client
        .from("family_invitations")
        .insert({
          elderly_id: validated.data.elderly_id,
          invited_email: validated.data.invited_email,
          invited_by: user.id,
          relationship: validated.data.relationship,
          can_edit_meds: validated.data.can_edit_meds,
          token,
          status: "pending",
        })
        .select()
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });

      return NextResponse.json({ success: true, invitation });
    }

    return NextResponse.json({
      success: true,
      demoMode: true,
      invitation: {
        id: "inv-" + Date.now(),
        ...validated.data,
        status: "pending",
        token: "demo-token",
        created_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const membership_id = searchParams.get("membership_id");
    const invitation_id = searchParams.get("invitation_id");

    const serverClient = createServerSupabaseClient();
    const admin = getAdminClient();

    if (serverClient) {
      const client = admin || serverClient;

      if (membership_id) {
        await client.from("family_memberships").delete().eq("id", membership_id);
      }
      if (invitation_id) {
        await client.from("family_invitations").update({ status: "revoked" }).eq("id", invitation_id);
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: true, demoMode: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
