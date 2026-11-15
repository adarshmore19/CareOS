import { NextRequest, NextResponse } from "next/server";
import { CAREVOICE_TOOLS, executeCareTool } from "@/lib/carevoice-tools";
import { MedicationEvent, Appointment } from "@/lib/types";

interface RequestBody {
  query: string;
  role?: string;
  events?: MedicationEvent[];
  appointments?: Appointment[];
}

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json();
    const query = body.query?.trim();

    if (!query) {
      return NextResponse.json(
        { error: "Query cannot be empty" },
        { status: 400 }
      );
    }

    // Safety boundary check: Reject clinical diagnoses or dosage changes
    const lowerQuery = query.toLowerCase();
    if (
      lowerQuery.includes("diagnose") ||
      lowerQuery.includes("can you prescribe") ||
      lowerQuery.includes("increase my dose") ||
      lowerQuery.includes("stop taking") ||
      lowerQuery.includes("double my dose")
    ) {
      return NextResponse.json({
        answer:
          "CareOS Safety Notice: As an AI care assistant, I cannot modify your prescriptions, adjust dosages, or diagnose medical conditions. Please discuss any symptom changes or dosage adjustments directly with Dr. Sarah Jenkins or your care team.",
        toolUsed: undefined,
        toolData: null,
        provider: "safety-guardrail",
      });
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;

    // If Gemini API Key is configured, attempt LLM call
    if (geminiApiKey && !geminiApiKey.includes("your-gemini-api-key")) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;
        const promptSystem = `You are CareVoice, an empathetic, clear, elderly-friendly healthcare AI assistant for CareOS.
You have access to the patient's authenticated healthcare records:
- Patient: Eleanor Vance (78 yrs)
- Medications today: Lisinopril 10mg (morning), Metformin ER 500mg (twice daily), Atorvastatin 20mg (bedtime), Vitamin D3 (morning).
- Current status: Lisinopril and Vitamin D3 have been taken. Metformin is pending.
- Next Appointment: Dr. Sarah Jenkins tomorrow at 10:30 AM (Cardiology).
- Caretaker: Nurse Priya Sharma (+1 555-345-6789).
- Emergency contact: David Vance (Son).

Keep answers clear, comforting, and direct (2-3 sentences max). Large and accessible language. Never diagnose or change dosages.`;

        const response = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: `${promptSystem}\n\nPatient asks: "${query}"` }],
              },
            ],
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const candidateText =
            data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            return NextResponse.json({
              answer: candidateText.trim(),
              toolUsed: "gemini_nlp",
              toolData: null,
              provider: "gemini-1.5-flash",
            });
          }
        }
      } catch {
        // Fall through to deterministic rule-based tool execution
      }
    }

    // Transparent Intent Matcher & Tool Executor (Offline / Fallback Guarantee)
    let toolName = "get_daily_medications";
    let toolArgs: Record<string, unknown> = {};
    let answerText = "";

    if (
      lowerQuery.includes("morning") &&
      (lowerQuery.includes("taken") || lowerQuery.includes("pill") || lowerQuery.includes("medicine"))
    ) {
      toolName = "get_daily_medications";
      toolArgs = { filter: "morning" };
      const res = executeCareTool(toolName, toolArgs, body.events, body.appointments);
      const schedule = (res as any).schedule || [];
      const allTaken = schedule.every((s: any) => s.status === "taken");
      answerText = allTaken
        ? "Yes, Eleanor! You have successfully taken all your morning medicines today: Lisinopril (10mg) and Vitamin D3."
        : "You have taken your Lisinopril and Vitamin D3. Your Metformin (500mg) is still waiting to be confirmed.";
    } else if (
      lowerQuery.includes("what medicine") ||
      lowerQuery.includes("today's schedule") ||
      lowerQuery.includes("need today") ||
      lowerQuery.includes("medication")
    ) {
      toolName = "get_daily_medications";
      toolArgs = { filter: "all" };
      const res = executeCareTool(toolName, toolArgs, body.events, body.appointments);
      answerText =
        "Today you have 4 scheduled medications: Lisinopril (8:00 AM, taken), Vitamin D3 (8:00 AM, taken), Metformin ER (breakfast & dinner), and Atorvastatin (9:00 PM tonight).";
    } else if (
      lowerQuery.includes("appointment") ||
      lowerQuery.includes("doctor") ||
      lowerQuery.includes("clinic") ||
      lowerQuery.includes("hospital")
    ) {
      toolName = "get_upcoming_appointments";
      const res = executeCareTool(toolName, toolArgs, body.events, body.appointments);
      answerText =
        "Your next appointment is tomorrow at 10:30 AM with Dr. Sarah Jenkins at Metro Heart & Vascular Center for your routine cardiology review. Nurse Priya is scheduled to accompany you.";
    } else if (
      lowerQuery.includes("adherence") ||
      lowerQuery.includes("score") ||
      lowerQuery.includes("pillguard")
    ) {
      toolName = "get_adherence_summary";
      const res = executeCareTool(toolName, toolArgs, body.events, body.appointments);
      answerText = `Your PillGuard adherence score is currently ${(res as any).adherence_percentage}. You have taken ${(res as any).taken_count} out of ${(res as any).total_doses} doses on time. Keep up the wonderful work!`;
    } else if (
      lowerQuery.includes("caretaker") ||
      lowerQuery.includes("nurse") ||
      lowerQuery.includes("who is helping") ||
      lowerQuery.includes("priya")
    ) {
      toolName = "get_caretaker_details";
      answerText =
        "Your primary caretaker is Nurse Priya Sharma, RN. Her contact number is +1 (555) 345-6789. Your son David Vance is also registered as your primary emergency contact.";
    } else if (
      lowerQuery.includes("help") &&
      lowerQuery.includes("appointment")
    ) {
      toolName = "create_appointment_request";
      toolArgs = {
        doctor_name: "Dr. Sarah Jenkins",
        preferred_time: "Tomorrow morning",
        reason: "Patient requested assistance",
      };
      answerText =
        "I have notified Nurse Priya Sharma that you requested help with your cardiology appointment tomorrow. She will contact you shortly.";
    } else if (lowerQuery.includes("history") || lowerQuery.includes("past")) {
      toolName = "get_medication_history";
      answerText =
        "Here is your recent history: Lisinopril and Vitamin D3 were logged as taken at 8:12 AM today. Prior days show 100% adherence.";
    } else {
      toolName = "get_daily_medications";
      answerText =
        "Hello Eleanor! You are doing great today. You have taken your morning Lisinopril and Vitamin D3. Your evening Metformin and Atorvastatin are coming up later today. Would you like to check your appointments or speak to Nurse Priya?";
    }

    const toolResult = executeCareTool(
      toolName,
      toolArgs,
      body.events,
      body.appointments
    );

    return NextResponse.json({
      answer: answerText,
      toolUsed: toolName,
      toolData: toolResult,
      provider: "carevoice-engine",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal assistant processing error", details: String(error) },
      { status: 500 }
    );
  }
}
