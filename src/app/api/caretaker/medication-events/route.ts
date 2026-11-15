import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getAdminClient } from "@/lib/supabase/admin";

const MedEventSchema = z.object({
  elderly_id: z.string().min(1),
  medication_id: z.string().min(1),
  schedule_id: z.string().min(1).optional(),
  scheduled_time: z.string(),
  status: z.enum(["taken", "skipped", "missed", "unconfirmed"]),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = MedEventSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid medication event data", details: validated.error.format() },
        { status: 400 }
      );
    }

    const {
      elderly_id,
      medication_id,
      schedule_id,
      scheduled_time,
      status,
      notes,
    } = validated.data;

    const serverClient = createServerSupabaseClient();
    const admin = getAdminClient();

    if (serverClient) {
      // 1. Authenticate user
      const { data: { user } } = await serverClient.auth.getUser();
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const client = admin || serverClient;

      // 2. Verify caretaker assignment or elderly self-record
      const { data: profile } = await client
        .from("profiles")
        .select("role, full_name")
        .eq("id", user.id)
        .single();

      if (!profile) {
        return NextResponse.json({ error: "Profile not found" }, { status: 403 });
      }

      if (profile.role === "caretaker") {
        const { data: assignment } = await client
          .from("caretaker_assignments")
          .select("id")
          .eq("caretaker_id", user.id)
          .eq("elderly_id", elderly_id)
          .single();

        if (!assignment) {
          return NextResponse.json(
            { error: "Security Error: Caretaker is not assigned to this patient." },
            { status: 403 }
          );
        }
      } else if (profile.role === "elderly" && user.id !== elderly_id) {
        return NextResponse.json(
          { error: "Security Error: Patient cannot record doses for another individual." },
          { status: 403 }
        );
      }

      // 3. Duplicate submission prevention
      const scheduledDate = new Date(scheduled_time).toISOString();
      const { data: existing } = await client
        .from("medication_events")
        .select("id, status")
        .eq("elderly_id", elderly_id)
        .eq("medication_id", medication_id)
        .eq("scheduled_time", scheduledDate)
        .eq("status", status);

      if (existing && existing.length > 0) {
        return NextResponse.json(
          { error: "Duplicate submission: This dose has already been recorded as " + status },
          { status: 409 }
        );
      }

      // 4. Insert medication event
      const nowTime = new Date().toISOString();
      const { data: eventData, error: eventError } = await client
        .from("medication_events")
        .insert({
          elderly_id,
          medication_id,
          schedule_id: schedule_id || null,
          scheduled_time: scheduledDate,
          recorded_time: status === "taken" ? nowTime : null,
          status,
          notes: notes || null,
          confirmed_by: user.id,
        })
        .select()
        .single();

      if (eventError) {
        return NextResponse.json(
          { error: eventError.message },
          { status: 500 }
        );
      }

      // 5. Log activity
      await client.from("activity_logs").insert({
        elderly_id,
        actor_id: user.id,
        action_type: "medication_administered",
        description: `${profile.full_name} (${profile.role}) recorded medication as ${status}.`,
        metadata: { event_id: eventData.id, medication_id, status },
      });

      // 6. Notify family members
      const { data: familyMembers } = await client
        .from("family_memberships")
        .select("family_user_id")
        .eq("elderly_id", elderly_id);

      if (familyMembers && familyMembers.length > 0) {
        const notifPayloads = familyMembers.map((fm) => ({
          recipient_id: fm.family_user_id,
          elderly_id,
          type: "adherence_alert",
          title: status === "taken" ? "Medication Administered" : `Dose Marked as ${status}`,
          message: `${profile.full_name} recorded dose intake for Eleanor Vance.`,
          is_read: false,
        }));
        await client.from("notifications").insert(notifPayloads);
      }

      return NextResponse.json({
        success: true,
        event: eventData,
      });
    }

    // Demo Mode Response
    return NextResponse.json({
      success: true,
      demoMode: true,
      event: {
        id: "demo-evt-" + Date.now(),
        ...validated.data,
        recorded_time: new Date().toLocaleTimeString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Medication event administration failed", details: String(error) },
      { status: 500 }
    );
  }
}
