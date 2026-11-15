import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAdminClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  full_name: z.string().min(2),
  role: z.enum(["elderly", "family", "caretaker"]),
  phone: z.string().optional(),
  // Elderly specific fields
  date_of_birth: z.string().optional(),
  blood_group: z.string().optional(),
  emergency_contact_name: z.string().optional(),
  emergency_contact_phone: z.string().optional(),
  address: z.string().optional(),
  medical_notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = RegisterSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.format() },
        { status: 400 }
      );
    }

    const {
      email,
      password,
      full_name,
      role,
      phone,
      date_of_birth,
      blood_group,
      emergency_contact_name,
      emergency_contact_phone,
      address,
      medical_notes,
    } = validated.data;

    const admin = getAdminClient();
    const serverClient = createServerSupabaseClient();

    // If Supabase is configured, create real auth user
    if (admin && serverClient) {
      const { data: authData, error: authError } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name, role },
      });

      if (authError || !authData.user) {
        return NextResponse.json(
          { error: authError?.message || "Failed to create authentication record" },
          { status: 400 }
        );
      }

      const userId = authData.user.id;

      // Insert profile with server-verified role
      const { error: profileError } = await admin.from("profiles").insert({
        id: userId,
        email,
        full_name,
        role,
        phone: phone || null,
      });

      if (profileError) {
        // Rollback auth user
        await admin.auth.admin.deleteUser(userId);
        return NextResponse.json(
          { error: `Profile creation failed: ${profileError.message}` },
          { status: 500 }
        );
      }

      // If elderly, create elderly_profile record
      if (role === "elderly") {
        const { error: elderlyError } = await admin.from("elderly_profiles").insert({
          id: userId,
          date_of_birth: date_of_birth || null,
          blood_group: blood_group || null,
          emergency_contact_name: emergency_contact_name || "Emergency Contact",
          emergency_contact_phone: emergency_contact_phone || "Not Provided",
          address: address || null,
          medical_notes: medical_notes || null,
        });

        if (elderlyError) {
          return NextResponse.json(
            { error: `Elderly profile creation failed: ${elderlyError.message}` },
            { status: 500 }
          );
        }
      }

      // Initialize default notification preferences
      await admin.from("notification_preferences").insert({
        user_id: userId,
        in_app_adherence: true,
        in_app_appointments: true,
        in_app_tasks: true,
        email_alerts: false,
        sms_alerts: false,
      });

      return NextResponse.json({
        success: true,
        user: {
          id: userId,
          email,
          full_name,
          role,
        },
      });
    }

    // Isolated Demo / Local Mode (when Supabase credentials are not yet supplied)
    return NextResponse.json({
      success: true,
      demoMode: true,
      message: "User registered in isolated local demo session.",
      user: {
        id: `demo-${Date.now()}`,
        email,
        full_name,
        role,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Server registration error", details: String(error) },
      { status: 500 }
    );
  }
}
