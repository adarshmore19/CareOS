import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getAdminClient } from "@/lib/supabase/admin";

const TaskCreateSchema = z.object({
  elderly_id: z.string().min(1),
  title: z.string().min(3),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  due_date: z.string().optional(),
  assigned_to: z.string().min(1).optional(),
});

const TaskStatusSchema = z.object({
  task_id: z.string().min(1),
  status: z.enum(["pending", "in_progress", "completed", "cancelled", "overdue"]),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const elderly_id = searchParams.get("elderly_id");

    const serverClient = createServerSupabaseClient();
    const admin = getAdminClient();

    if (serverClient) {
      const client = admin || serverClient;
      let query = client.from("care_tasks").select(`
        id,
        elderly_id,
        assigned_to,
        created_by,
        title,
        description,
        priority,
        due_date,
        status,
        created_at,
        assigned_user:assigned_to (full_name, role)
      `);

      if (elderly_id) {
        query = query.eq("elderly_id", elderly_id);
      }

      const { data: tasks, error } = await query.order("created_at", { ascending: false });
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ tasks: tasks || [] });
    }

    return NextResponse.json({ demoMode: true, tasks: [] });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = TaskCreateSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json({ error: "Validation error", details: validated.error.format() }, { status: 400 });
    }

    const serverClient = createServerSupabaseClient();
    const admin = getAdminClient();

    if (serverClient) {
      const { data: { user } } = await serverClient.auth.getUser();
      if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

      const client = admin || serverClient;

      const { data: task, error } = await client
        .from("care_tasks")
        .insert({
          elderly_id: validated.data.elderly_id,
          title: validated.data.title,
          description: validated.data.description || null,
          priority: validated.data.priority,
          due_date: validated.data.due_date || null,
          assigned_to: validated.data.assigned_to || user.id,
          created_by: user.id,
          status: "pending",
        })
        .select()
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });

      // Notify assigned user or family
      await client.from("notifications").insert({
        recipient_id: validated.data.assigned_to || user.id,
        elderly_id: validated.data.elderly_id,
        type: "care_task_assigned",
        title: "New Care Task Assigned",
        message: `Task: "${validated.data.title}" was scheduled.`,
        is_read: false,
      });

      return NextResponse.json({ success: true, task });
    }

    return NextResponse.json({ success: true, demoMode: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = TaskStatusSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json({ error: "Validation failed" }, { status: 400 });
    }

    const serverClient = createServerSupabaseClient();
    const admin = getAdminClient();

    if (serverClient) {
      const client = admin || serverClient;
      const { data: task, error } = await client
        .from("care_tasks")
        .update({ status: validated.data.status })
        .eq("id", validated.data.task_id)
        .select()
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true, task });
    }

    return NextResponse.json({ success: true, demoMode: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
