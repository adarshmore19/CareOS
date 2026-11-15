import {
  INITIAL_ELDERLY,
  INITIAL_MEDICATIONS,
  INITIAL_TODAY_EVENTS,
  INITIAL_APPOINTMENTS,
  INITIAL_PROFILES,
  calculateAdherence,
} from "./store";

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

export const CAREVOICE_TOOLS: ToolDefinition[] = [
  {
    name: "get_daily_medications",
    description: "Returns the elderly user's scheduled medications for today along with their current taken or unconfirmed status.",
    parameters: {
      type: "object",
      properties: {
        filter: {
          type: "string",
          enum: ["all", "taken", "unconfirmed", "morning", "evening"],
          description: "Optional filter for daily schedule",
        },
      },
    },
  },
  {
    name: "get_upcoming_appointments",
    description: "Returns all upcoming doctor visits, hospital visits, and clinical checkups.",
    parameters: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Max number of appointments to return",
        },
      },
    },
  },
  {
    name: "get_medication_history",
    description: "Returns past recorded medication events and intake notes.",
    parameters: {
      type: "object",
      properties: {
        days: {
          type: "number",
          description: "Number of days of history",
        },
      },
    },
  },
  {
    name: "get_adherence_summary",
    description: "Returns the adherence score (PillGuard percentage) and compliance breakdown.",
    parameters: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_caretaker_details",
    description: "Returns the contact information and title of the assigned primary caretaker and emergency family contact.",
    parameters: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "create_appointment_request",
    description: "Requests a new doctor appointment for care coordination. Requires confirmation before locking.",
    parameters: {
      type: "object",
      properties: {
        doctor_name: { type: "string" },
        preferred_time: { type: "string" },
        reason: { type: "string" },
      },
      required: ["doctor_name", "preferred_time", "reason"],
    },
  },
  {
    name: "create_care_task",
    description: "Creates a care or reminder task for family or caretaker.",
    parameters: {
      type: "object",
      properties: {
        title: { type: "string" },
        priority: { type: "string", enum: ["low", "medium", "high", "urgent"] },
      },
      required: ["title"],
    },
  },
];

// Backend tool executor
export function executeCareTool(
  name: string,
  args: Record<string, unknown>,
  currentEvents = INITIAL_TODAY_EVENTS,
  currentAppointments = INITIAL_APPOINTMENTS
) {
  switch (name) {
    case "get_daily_medications": {
      const filter = args.filter as string | undefined;
      let list = currentEvents;
      if (filter === "taken") {
        list = list.filter((e) => e.status === "taken");
      } else if (filter === "unconfirmed") {
        list = list.filter((e) => e.status === "unconfirmed");
      } else if (filter === "morning") {
        list = list.filter((e) => e.scheduled_time.includes("AM"));
      } else if (filter === "evening") {
        list = list.filter((e) => e.scheduled_time.includes("PM"));
      }

      return {
        patient: INITIAL_ELDERLY.full_name,
        total_scheduled_today: currentEvents.length,
        filtered_count: list.length,
        schedule: list.map((e) => ({
          medicine: e.medication_name,
          time: e.scheduled_time,
          status: e.status,
          recorded_at: e.recorded_time || "Not yet recorded",
        })),
      };
    }

    case "get_upcoming_appointments": {
      const upcoming = currentAppointments.filter((a) => a.status === "upcoming");
      return {
        patient: INITIAL_ELDERLY.full_name,
        upcoming_count: upcoming.length,
        appointments: upcoming.map((a) => ({
          doctor: a.doctor_name,
          facility: a.clinic_or_hospital,
          time: a.appointment_time,
          purpose: a.purpose,
          escort: a.caretaker_name || "Family/Self",
        })),
      };
    }

    case "get_medication_history": {
      return {
        patient: INITIAL_ELDERLY.full_name,
        history: currentEvents.map((e) => ({
          medication: e.medication_name,
          time: e.scheduled_time,
          status: e.status,
          notes: e.notes || "None",
        })),
      };
    }

    case "get_adherence_summary": {
      const adh = calculateAdherence(currentEvents);
      return {
        patient: INITIAL_ELDERLY.full_name,
        adherence_percentage: `${adh.overall_percentage}%`,
        status_assessment: adh.status_assessment,
        taken_count: adh.taken_count,
        missed_count: adh.missed_count,
        unconfirmed_count: adh.unconfirmed_count,
        total_doses: adh.total_doses,
      };
    }

    case "get_caretaker_details": {
      const caretaker = INITIAL_PROFILES.find((p) => p.role === "caretaker");
      return {
        primary_caretaker: {
          name: caretaker?.full_name || "Nurse Priya Sharma",
          phone: caretaker?.phone || "+1 (555) 345-6789",
          role: "Primary Geriatric Nurse",
        },
        emergency_contact: {
          name: INITIAL_ELDERLY.emergency_contact_name,
          phone: INITIAL_ELDERLY.emergency_contact_phone,
        },
      };
    }

    case "create_appointment_request": {
      return {
        action: "REQUEST_CONFIRMATION",
        message: `I have prepared an appointment request with ${args.doctor_name} for ${args.preferred_time} regarding "${args.reason}". Shall I send this to your caregiver team for confirmation?`,
        draft: args,
      };
    }

    case "create_care_task": {
      return {
        action: "SUCCESS",
        message: `New care task "${args.title}" with priority ${args.priority || "medium"} has been scheduled.`,
        task: args,
      };
    }

    default:
      return { error: `Tool ${name} not found.` };
  }
}
