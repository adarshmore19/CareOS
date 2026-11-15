import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getAdminClient } from "@/lib/supabase/admin";

const NoteCreateSchema = z.object({
  elderly_id: z.string().min(1),
  observation: z.string().min(5),
  action_taken: z.string().optional(),
  follow_up_required: z.boolean().default(false),
  follow_up_date: z.string().optional(),
  related_appointment_id: z.string().min(1).optional(),
  related_task_id: z.string().min(1).optional(),
});

const NoteAmendSchema = z.object({
  note_id: z.string().min(1),
  amendment_note: z.string().min(5),
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
      const { data: notes, error } = await client
        .from("clinical_notes")
        .select(`
          id,
          elderly_id,
          author_id,
          observation,
          action_taken,
          follow_up_required,
          follow_up_date,
          related_appointment_id,
          related_task_id,
          is_amended,
          amendment_note,
          created_at,
          amended_at,
          profiles:author_id (
            full_name,
            role
          )
        `)
        .eq("elderly_id", elderly_id)
        .order("created_at", { ascending: false });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ notes: notes || [] });
    }

    // Demo Mode default notes
    return NextResponse.json({
      demoMode: true,
      notes: [
        {
          id: "note-demo-1",
          elderly_id,
          author_id: "user-caretaker-1",
          author_name: "Nurse Priya Sharma, RN",
          observation: "Resting BP measured at 124/82 mmHg. Pulse regular at 72 bpm. Patient in cheerful spirits.",
          action_taken: "Logged vitals and verified morning Lisinopril intake.",
          follow_up_required: false,
          is_amended: false,
          created_at: new Date(Date.now() - 86400000).toISOString(),
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
    const validated = NoteCreateSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json({ error: "Validation failed", details: validated.error.format() }, { status: 400 });
    }

    const serverClient = createServerSupabaseClient();
    const admin = getAdminClient();

    if (serverClient) {
      const { data: { user } } = await serverClient.auth.getUser();
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const client = admin || serverClient;

      // Verify caretaker assignment
      const { data: assignment } = await client
        .from("caretaker_assignments")
        .select("id")
        .eq("caretaker_id", user.id)
        .eq("elderly_id", validated.data.elderly_id)
        .single();

      if (!assignment) {
        return NextResponse.json(
          { error: "Security Error: Only assigned caretakers can log clinical notes." },
          { status: 403 }
        );
      }

      const { data: newNote, error } = await client
        .from("clinical_notes")
        .insert({
          elderly_id: validated.data.elderly_id,
          author_id: user.id,
          observation: validated.data.observation,
          action_taken: validated.data.action_taken || null,
          follow_up_required: validated.data.follow_up_required,
          follow_up_date: validated.data.follow_up_date || null,
          related_appointment_id: validated.data.related_appointment_id || null,
          related_task_id: validated.data.related_task_id || null,
        })
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      // Record in activity log
      await client.from("activity_logs").insert({
        elderly_id: validated.data.elderly_id,
        actor_id: user.id,
        action_type: "clinical_note_logged",
        description: `Clinical observation logged by Nurse Priya.`,
      });

      return NextResponse.json({ success: true, note: newNote });
    }

    return NextResponse.json({
      success: true,
      demoMode: true,
      note: {
        id: "note-demo-" + Date.now(),
        ...validated.data,
        author_id: "demo-caretaker",
        created_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = NoteAmendSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json({ error: "Validation failed" }, { status: 400 });
    }

    const serverClient = createServerSupabaseClient();
    const admin = getAdminClient();

    if (serverClient) {
      const { data: { user } } = await serverClient.auth.getUser();
      if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

      const client = admin || serverClient;

      // Ensure user is the author
      const { data: existing } = await client
        .from("clinical_notes")
        .select("author_id, elderly_id")
        .eq("id", validated.data.note_id)
        .single();

      if (!existing || existing.author_id !== user.id) {
        return NextResponse.json({ error: "Only original author can amend a note" }, { status: 403 });
      }

      const { data: updated, error } = await client
        .from("clinical_notes")
        .update({
          is_amended: true,
          amendment_note: validated.data.amendment_note,
          amended_at: new Date().toISOString(),
        })
        .eq("id", validated.data.note_id)
        .select()
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });

      return NextResponse.json({ success: true, note: updated });
    }

    return NextResponse.json({ success: true, demoMode: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
