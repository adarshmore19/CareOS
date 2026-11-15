export type UserRole = "elderly" | "family" | "caretaker" | "admin";

export type MedicationStatus = "taken" | "skipped" | "missed" | "unconfirmed";

export type AppointmentStatus = "upcoming" | "completed" | "cancelled";

export type TaskPriority = "low" | "medium" | "high" | "urgent";

export type TaskStatus = "pending" | "in_progress" | "completed";

export type NotificationType = "adherence_alert" | "appointment_reminder" | "care_task_assigned" | "emergency";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  avatar_url?: string;
}

export interface ElderlyProfile {
  id: string;
  user_id: string;
  full_name: string;
  date_of_birth?: string;
  blood_group?: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  address?: string;
  medical_notes?: string;
  daily_checkin_status: "pending" | "completed";
}

export interface MedicationSchedule {
  id: string;
  medication_id: string;
  time_of_day: string; // e.g. "08:00 AM", "01:00 PM", "08:00 PM"
  dosage_quantity: string;
  days_of_week: string[];
  reminder_enabled: boolean;
}

export interface Medication {
  id: string;
  elderly_id: string;
  name: string;
  dosage: string;
  instructions: string;
  prescribing_doctor: string;
  start_date: string;
  end_date?: string;
  is_active: boolean;
  schedules?: MedicationSchedule[];
}

export interface MedicationEvent {
  id: string;
  schedule_id?: string;
  medication_id: string;
  medication_name?: string;
  dosage_quantity?: string;
  elderly_id: string;
  scheduled_time: string; // ISO date string or formatted time
  recorded_time?: string;
  status: MedicationStatus;
  notes?: string;
  confirmed_by?: string;
}

export interface Appointment {
  id: string;
  elderly_id: string;
  doctor_name: string;
  clinic_or_hospital: string;
  appointment_time: string;
  purpose: string;
  status: AppointmentStatus;
  caretaker_id?: string;
  caretaker_name?: string;
  notes?: string;
}

export interface CareTask {
  id: string;
  elderly_id: string;
  assigned_to?: string;
  assigned_name?: string;
  created_by?: string;
  title: string;
  description: string;
  priority: TaskPriority;
  due_date?: string;
  status: TaskStatus;
}

export interface NotificationItem {
  id: string;
  recipient_id: string;
  elderly_id?: string;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  link?: string;
  created_at: string;
}

export interface EducationArticle {
  id: string;
  title: string;
  category: "medication_safety" | "wellness" | "nutrition" | "emergency_prep";
  language: "en" | "hi" | "mr";
  summary: string;
  content: string;
  key_takeaways: string[];
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
  audio_script?: string;
}

export interface AdherenceSummary {
  overall_percentage: number;
  total_doses: number;
  taken_count: number;
  missed_count: number;
  skipped_count: number;
  unconfirmed_count: number;
  weekly_trend: {
    day: string;
    percentage: number;
    taken: number;
    total: number;
  }[];
  status_assessment: "excellent" | "needs_attention" | "critical";
  last_alert?: string;
}
