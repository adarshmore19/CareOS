"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  UserProfile,
  ElderlyProfile,
  Medication,
  MedicationEvent,
  Appointment,
  CareTask,
  NotificationItem,
  EducationArticle,
  AdherenceSummary,
  UserRole,
  MedicationStatus,
  TaskStatus,
  ClinicalNote,
  PatientConsent,
  FamilyInvitation,
  ActivityLog,
} from "@/lib/types";
import {
  INITIAL_PROFILES,
  INITIAL_ELDERLY,
  INITIAL_MEDICATIONS,
  INITIAL_TODAY_EVENTS,
  INITIAL_APPOINTMENTS,
  INITIAL_CARE_TASKS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ARTICLES,
  calculateAdherence,
} from "@/lib/store";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

interface CareContextType {
  // Authentication & Role
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentUser: UserProfile;
  isAuthenticated: boolean;
  isRealSupabase: boolean;
  signInWithPassword: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUpWithPassword: (data: any) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;

  // Patients (Supports multiple linked elderly patients)
  elderlyProfiles: ElderlyProfile[];
  activePatient: ElderlyProfile;
  elderlyProfile: ElderlyProfile;
  setActivePatientId: (id: string) => void;
  registerElderlyPatient: (data: Omit<ElderlyProfile, "id">) => Promise<ElderlyProfile>;

  // Environment & Authentic Data Mode
  dataMode: "demo" | "authentic";
  setDataMode: (mode: "demo" | "authentic") => void;
  dbMode: "clean" | "seed";
  setDbMode: (mode: "clean" | "seed") => void;

  // Data Collections
  medications: Medication[];
  events: MedicationEvent[];
  appointments: Appointment[];
  careTasks: CareTask[];
  notifications: NotificationItem[];
  articles: EducationArticle[];
  clinicalNotes: ClinicalNote[];
  consents: PatientConsent[];
  invitations: FamilyInvitation[];
  activityLogs: ActivityLog[];
  adherence: AdherenceSummary;

  // Actions
  confirmMedication: (eventId: string, status?: MedicationStatus, notes?: string) => Promise<void>;
  skipMedication: (eventId: string, notes?: string) => Promise<void>;
  addMedication: (med: Omit<Medication, "id">) => Promise<void>;
  addAppointment: (apt: Omit<Appointment, "id">) => Promise<void>;
  addCareTask: (task: Omit<CareTask, "id">) => Promise<void>;
  updateCareTaskStatus: (taskId: string, status: TaskStatus) => Promise<void>;
  addClinicalNote: (note: Omit<ClinicalNote, "id" | "created_at" | "is_amended">) => Promise<void>;
  amendClinicalNote: (noteId: string, amendment: string) => Promise<void>;
  addNotification: (notif: Omit<NotificationItem, "id" | "created_at">) => void;
  markNotificationRead: (notifId: string) => void;
  inviteFamilyMember: (email: string, relationship: string, canEditMeds: boolean) => Promise<void>;
  revokeFamilyMember: (membershipId?: string, invitationId?: string) => Promise<void>;
  resetDemoData: () => void;
}

const CareContext = createContext<CareContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = "careos_data_v2_";

const EMPTY_PATIENT_FALLBACK: ElderlyProfile = {
  id: "none",
  user_id: "",
  full_name: "No Patient Record Available",
  emergency_contact_name: "Not Configured",
  emergency_contact_phone: "",
  address: "Not Provided",
  medical_notes: "No medical records recorded yet. Register an authentic patient or connect with family.",
  daily_checkin_status: "pending",
};

export function CareProvider({ children }: { children: React.ReactNode }) {
  const [dataMode, setDataModeState] = useState<"demo" | "authentic">("demo");
  const [currentRole, setCurrentRole] = useState<UserRole>("elderly");
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_PROFILES[0]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Multi-patient list
  const [elderlyProfiles, setElderlyProfiles] = useState<ElderlyProfile[]>([
    INITIAL_ELDERLY,
    {
      id: "elderly-2",
      user_id: "user-elderly-2",
      full_name: "Arthur Pendelton",
      name: "Arthur Pendelton",
      age: 81,
      city: "Springfield",
      date_of_birth: "1944-09-21",
      blood_group: "A+",
      emergency_contact_name: "Sarah Pendelton (Daughter)",
      emergency_contact_phone: "+1 (555) 901-2345",
      address: "12 Pinecrest Way, Springfield",
      medical_notes: "Chronic Kidney Disease Stage 3, Osteoarthritis. Sodium-restricted diet.",
      daily_checkin_status: "completed",
    },
  ]);
  const [activePatientId, setActivePatientId] = useState<string>("elderly-1");

  // Core Data Collections
  const [events, setEvents] = useState<MedicationEvent[]>(INITIAL_TODAY_EVENTS);
  const [medications, setMedications] = useState<Medication[]>(INITIAL_MEDICATIONS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [careTasks, setCareTasks] = useState<CareTask[]>(INITIAL_CARE_TASKS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [articles] = useState<EducationArticle[]>(INITIAL_ARTICLES);
  const [clinicalNotes, setClinicalNotes] = useState<ClinicalNote[]>([
    {
      id: "note-1",
      elderly_id: "elderly-1",
      author_id: "user-caretaker-1",
      author_name: "Nurse Priya Sharma, RN",
      observation: "Resting BP measured at 124/82 mmHg. Pulse regular at 72 bpm. Patient in cheerful spirits.",
      action_taken: "Logged vitals and verified morning Lisinopril intake with breakfast.",
      follow_up_required: false,
      is_amended: false,
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "note-2",
      elderly_id: "elderly-1",
      author_id: "user-caretaker-1",
      author_name: "Nurse Priya Sharma, RN",
      observation: "Accompanied patient on 20-min garden walk. Joint mobility normal without pain complaint.",
      action_taken: "Hydration provided.",
      follow_up_required: false,
      is_amended: false,
      created_at: new Date(Date.now() - 172800000).toISOString(),
    },
  ]);
  const [consents, setConsents] = useState<PatientConsent[]>([
    {
      id: "con-1",
      elderly_id: "elderly-1",
      granted_to: "user-family-1",
      consent_type: "medical_records",
      is_active: true,
      granted_at: "2026-01-01T00:00:00Z",
    },
    {
      id: "con-2",
      elderly_id: "elderly-1",
      granted_to: "user-caretaker-1",
      consent_type: "medication_administration",
      is_active: true,
      granted_at: "2026-01-01T00:00:00Z",
    },
  ]);
  const [invitations, setInvitations] = useState<FamilyInvitation[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([
    {
      id: "act-1",
      elderly_id: "elderly-1",
      actor_name: "Eleanor Vance",
      action_type: "medication_confirmed",
      description: "Confirmed Lisinopril 10mg morning intake.",
      created_at: "Today, 08:12 AM",
    },
    {
      id: "act-2",
      elderly_id: "elderly-1",
      actor_name: "Nurse Priya Sharma",
      action_type: "clinical_note_logged",
      description: "Logged resting blood pressure reading (124/82).",
      created_at: "Yesterday, 10:00 AM",
    },
  ]);

  const setDataMode = useCallback((mode: "demo" | "authentic") => {
    setDataModeState(mode);
    if (typeof window !== "undefined") {
      localStorage.setItem("careos_data_mode", mode);
    }
    if (mode === "authentic") {
      try {
        const saved = localStorage.getItem("careos_authentic_patients");
        if (saved) {
          const parsed = JSON.parse(saved);
          setElderlyProfiles(parsed);
          setActivePatientId(parsed[0]?.id || "");
        } else {
          setElderlyProfiles([]);
          setActivePatientId("");
        }
      } catch (e) {
        setElderlyProfiles([]);
        setActivePatientId("");
      }
      setEvents([]);
      setMedications([]);
      setAppointments([]);
      setCareTasks([]);
      setClinicalNotes([]);
      setActivityLogs([]);
    } else {
      setElderlyProfiles([
        INITIAL_ELDERLY,
        {
          id: "elderly-2",
          user_id: "user-elderly-2",
          full_name: "Arthur Pendelton",
          date_of_birth: "1944-09-21",
          blood_group: "A+",
          emergency_contact_name: "Sarah Pendelton (Daughter)",
          emergency_contact_phone: "+1 (555) 901-2345",
          address: "12 Pinecrest Way, Springfield",
          medical_notes: "Chronic Kidney Disease Stage 3, Osteoarthritis. Sodium-restricted diet.",
          daily_checkin_status: "completed",
        },
      ]);
      setActivePatientId("elderly-1");
      setEvents(INITIAL_TODAY_EVENTS);
      setMedications(INITIAL_MEDICATIONS);
      setAppointments(INITIAL_APPOINTMENTS);
      setCareTasks(INITIAL_CARE_TASKS);
      setNotifications(INITIAL_NOTIFICATIONS);
    }
  }, []);

  const registerElderlyPatient = useCallback(async (data: Omit<ElderlyProfile, "id">): Promise<ElderlyProfile> => {
    const newId = `patient-${Date.now()}`;
    const newPatient: ElderlyProfile = {
      ...data,
      id: newId,
    };
    const updated = [...elderlyProfiles, newPatient];
    setElderlyProfiles(updated);
    setActivePatientId(newId);
    if (typeof window !== "undefined") {
      localStorage.setItem("careos_authentic_patients", JSON.stringify(updated));
    }
    return newPatient;
  }, [elderlyProfiles]);

  const activePatient =
    elderlyProfiles.find((p) => p.id === activePatientId) ||
    (elderlyProfiles.length > 0 ? elderlyProfiles[0] : EMPTY_PATIENT_FALLBACK);

  const adherence = calculateAdherence(
    activePatient.id !== "none" ? events.filter((e) => e.elderly_id === activePatient.id) : []
  );

  // Initialize and check Supabase session
  useEffect(() => {
    const supabase = createClient();
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setIsAuthenticated(true);
          supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single()
            .then(({ data: profile }) => {
              if (profile) {
                setCurrentUser(profile);
                setCurrentRole(profile.role);
              }
            });
        }
      });

      // Listen to Auth State Changes
      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      });

      // Supabase Realtime Channels
      const channel = supabase
        .channel("careos-v2-realtime")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "medication_events" },
          (payload) => {
            if (payload.eventType === "INSERT") {
              setEvents((prev) => [payload.new as MedicationEvent, ...prev]);
            } else if (payload.eventType === "UPDATE") {
              setEvents((prev) =>
                prev.map((e) => (e.id === payload.new.id ? (payload.new as MedicationEvent) : e))
              );
            }
          }
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "appointments" },
          (payload) => {
            if (payload.eventType === "INSERT") {
              setAppointments((prev) => [payload.new as Appointment, ...prev]);
            }
          }
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "care_tasks" },
          (payload) => {
            if (payload.eventType === "INSERT") {
              setCareTasks((prev) => [payload.new as CareTask, ...prev]);
            } else if (payload.eventType === "UPDATE") {
              setCareTasks((prev) =>
                prev.map((t) => (t.id === payload.new.id ? (payload.new as CareTask) : t))
              );
            }
          }
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "clinical_notes" },
          (payload) => {
            if (payload.eventType === "INSERT") {
              setClinicalNotes((prev) => [payload.new as ClinicalNote, ...prev]);
            }
          }
        )
        .subscribe();

      return () => {
        authListener.subscription.unsubscribe();
        supabase.removeChannel(channel);
      };
    } else {
      // Fallback: load persisted demo state from localStorage
      try {
        const savedEvents = localStorage.getItem(STORAGE_KEY_PREFIX + "events");
        if (savedEvents) setEvents(JSON.parse(savedEvents));

        const savedMeds = localStorage.getItem(STORAGE_KEY_PREFIX + "medications");
        if (savedMeds) setMedications(JSON.parse(savedMeds));

        const savedApts = localStorage.getItem(STORAGE_KEY_PREFIX + "appointments");
        if (savedApts) setAppointments(JSON.parse(savedApts));

        const savedTasks = localStorage.getItem(STORAGE_KEY_PREFIX + "tasks");
        if (savedTasks) setCareTasks(JSON.parse(savedTasks));

        const savedNotes = localStorage.getItem(STORAGE_KEY_PREFIX + "notes");
        if (savedNotes) setClinicalNotes(JSON.parse(savedNotes));

        const savedNotifs = localStorage.getItem(STORAGE_KEY_PREFIX + "notifications");
        if (savedNotifs) setNotifications(JSON.parse(savedNotifs));

        const savedRole = localStorage.getItem(STORAGE_KEY_PREFIX + "role") as UserRole | null;
        if (savedRole) {
          setCurrentRole(savedRole);
          const p = INITIAL_PROFILES.find((x) => x.role === savedRole) || INITIAL_PROFILES[0];
          setCurrentUser(p);
        }
      } catch {
        // Safe fallback
      }
    }
  }, []);

  const saveStorage = (key: string, data: unknown) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(data));
      } catch {
        // LocalStorage quota fallback
      }
    }
  };

  const handleSetRole = (role: UserRole) => {
    setCurrentRole(role);
    const p = INITIAL_PROFILES.find((x) => x.role === role) || INITIAL_PROFILES[0];
    setCurrentUser(p);
    saveStorage("role", role);
  };

  const signInWithPassword = async (email: string, password: string) => {
    const supabase = createClient();
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { success: false, error: error.message };
      if (data.user) {
        setIsAuthenticated(true);
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();
        if (profile) {
          setCurrentUser(profile);
          setCurrentRole(profile.role);
        }
      }
      return { success: true };
    }

    // Demo Mode signin
    const matchedProfile = INITIAL_PROFILES.find((p) => p.email.toLowerCase() === email.toLowerCase());
    if (matchedProfile) {
      setCurrentUser(matchedProfile);
      setCurrentRole(matchedProfile.role);
      setIsAuthenticated(true);
      return { success: true };
    }

    // Default demo fallback
    setIsAuthenticated(true);
    return { success: true };
  };

  const signUpWithPassword = async (formData: any) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Registration failed" };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const signOut = async () => {
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    await fetch("/api/auth/logout", { method: "POST" });
    setIsAuthenticated(false);
  };

  // Confirm Medication
  const confirmMedication = async (eventId: string, status: MedicationStatus = "taken", notes?: string) => {
    const nowTime = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    // Update locally / optimistic
    const updated = events.map((e) => {
      if (e.id === eventId) {
        return {
          ...e,
          status,
          recorded_time: status === "taken" ? nowTime : undefined,
          notes: notes || e.notes,
          confirmed_by: currentUser.id,
        };
      }
      return e;
    });

    setEvents(updated);
    saveStorage("events", updated);

    // Activity Log
    const targetEvt = events.find((e) => e.id === eventId);
    const newLog: ActivityLog = {
      id: "act-" + Date.now(),
      elderly_id: activePatient.id,
      actor_name: currentUser.full_name,
      action_type: "medication_event",
      description: `${currentUser.full_name} (${currentUser.role}) marked ${targetEvt?.medication_name || "dose"} as ${status}.`,
      created_at: `Today, ${nowTime}`,
    };
    const updatedLogs = [newLog, ...activityLogs];
    setActivityLogs(updatedLogs);
    saveStorage("activity_logs", updatedLogs);

    // Call API if connected
    if (isSupabaseConfigured && targetEvt) {
      fetch("/api/caretaker/medication-events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          elderly_id: activePatient.id,
          medication_id: targetEvt.medication_id,
          schedule_id: targetEvt.schedule_id,
          scheduled_time: new Date().toISOString(),
          status,
          notes,
        }),
      }).catch(() => {});
    }
  };

  const skipMedication = async (eventId: string, notes?: string) => {
    return confirmMedication(eventId, "skipped", notes);
  };

  // Add Medication
  const addMedication = async (newMed: Omit<Medication, "id">) => {
    const medWithId: Medication = { ...newMed, id: "med-" + Date.now() };
    const updated = [medWithId, ...medications];
    setMedications(updated);
    saveStorage("medications", updated);

    // Schedule today event
    const newEvt: MedicationEvent = {
      id: "evt-" + Date.now(),
      medication_id: medWithId.id,
      medication_name: `${medWithId.name} (${medWithId.dosage})`,
      dosage_quantity: medWithId.schedules?.[0]?.dosage_quantity || "1 dose",
      elderly_id: medWithId.elderly_id,
      scheduled_time: medWithId.schedules?.[0]?.time_of_day || "12:00 PM",
      status: "unconfirmed",
    };
    const updatedEvents = [...events, newEvt];
    setEvents(updatedEvents);
    saveStorage("events", updatedEvents);
  };

  // Add Appointment
  const addAppointment = async (newApt: Omit<Appointment, "id">) => {
    const aptWithId: Appointment = { ...newApt, id: "apt-" + Date.now() };
    const updated = [aptWithId, ...appointments];
    setAppointments(updated);
    saveStorage("appointments", updated);

    // Activity Log
    const newLog: ActivityLog = {
      id: "act-" + Date.now(),
      elderly_id: newApt.elderly_id,
      actor_name: currentUser.full_name,
      action_type: "appointment_created",
      description: `Scheduled appointment with ${newApt.doctor_name} for ${newApt.appointment_time}.`,
      created_at: `Today, ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
    };
    setActivityLogs([newLog, ...activityLogs]);
  };

  // Add Care Task
  const addCareTask = async (newTask: Omit<CareTask, "id">) => {
    const taskWithId: CareTask = { ...newTask, id: "task-" + Date.now() };
    const updated = [taskWithId, ...careTasks];
    setCareTasks(updated);
    saveStorage("tasks", updated);
  };

  // Update Care Task Status
  const updateCareTaskStatus = async (taskId: string, status: TaskStatus) => {
    const updated = careTasks.map((t) => (t.id === taskId ? { ...t, status } : t));
    setCareTasks(updated);
    saveStorage("tasks", updated);

    // Sync to API
    if (isSupabaseConfigured) {
      fetch("/api/caretaker/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task_id: taskId, status }),
      }).catch(() => {});
    }
  };

  // Add Clinical Note
  const addClinicalNote = async (note: Omit<ClinicalNote, "id" | "created_at" | "is_amended">) => {
    const newNote: ClinicalNote = {
      ...note,
      id: "note-" + Date.now(),
      author_id: note.author_id || currentUser.id,
      author_name: note.author_name || note.caretaker_name || currentUser.full_name,
      caretaker_name: note.caretaker_name || currentUser.full_name,
      observation: note.observation || note.content || "Clinical check performed",
      content: note.content || note.observation || "Clinical check performed",
      follow_up_required: note.follow_up_required ?? false,
      is_amended: false,
      created_at: new Date().toISOString(),
    };
    const updated = [newNote, ...clinicalNotes];
    setClinicalNotes(updated);
    saveStorage("notes", updated);

    // Sync to API
    if (isSupabaseConfigured) {
      fetch("/api/caretaker/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(note),
      }).catch(() => {});
    }
  };

  // Amend Clinical Note
  const amendClinicalNote = async (noteId: string, amendment: string) => {
    const updated = clinicalNotes.map((n) => {
      if (n.id === noteId) {
        return {
          ...n,
          is_amended: true,
          amendment_note: amendment,
        };
      }
      return n;
    });
    setClinicalNotes(updated);
    saveStorage("notes", updated);

    if (isSupabaseConfigured) {
      fetch("/api/caretaker/notes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note_id: noteId, amendment_note: amendment }),
      }).catch(() => {});
    }
  };

  // Notification helpers
  const addNotification = (notif: Omit<NotificationItem, "id" | "created_at">) => {
    const item: NotificationItem = {
      ...notif,
      id: "notif-" + Date.now(),
      created_at: `Today, ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
    };
    const updated = [item, ...notifications];
    setNotifications(updated);
    saveStorage("notifications", updated);
  };

  const markNotificationRead = (notifId: string) => {
    const updated = notifications.map((n) => (n.id === notifId ? { ...n, is_read: true } : n));
    setNotifications(updated);
    saveStorage("notifications", updated);
  };

  // Family Invitations
  const inviteFamilyMember = async (email: string, relationship: string, canEditMeds: boolean) => {
    const newInv: FamilyInvitation = {
      id: "inv-" + Date.now(),
      elderly_id: activePatient.id,
      invited_email: email,
      invited_by: currentUser.id,
      relationship,
      can_edit_meds: canEditMeds,
      token: "tok-" + Date.now(),
      status: "pending",
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 7 * 86400000).toISOString(),
    };
    setInvitations([newInv, ...invitations]);

    if (isSupabaseConfigured) {
      fetch("/api/family/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          elderly_id: activePatient.id,
          invited_email: email,
          relationship,
          can_edit_meds: canEditMeds,
        }),
      }).catch(() => {});
    }
  };

  const revokeFamilyMember = async (membershipId?: string, invitationId?: string) => {
    if (invitationId) {
      setInvitations(invitations.filter((i) => i.id !== invitationId));
    }
    if (isSupabaseConfigured) {
      const params = new URLSearchParams();
      if (membershipId) params.append("membership_id", membershipId);
      if (invitationId) params.append("invitation_id", invitationId);
      fetch(`/api/family/invitations?${params.toString()}`, { method: "DELETE" }).catch(() => {});
    }
  };

  // Reset Demo State
  const resetDemoData = () => {
    if (typeof window !== "undefined") {
      Object.keys(localStorage)
        .filter((k) => k.startsWith(STORAGE_KEY_PREFIX))
        .forEach((k) => localStorage.removeItem(k));
    }
    setEvents(INITIAL_TODAY_EVENTS);
    setMedications(INITIAL_MEDICATIONS);
    setAppointments(INITIAL_APPOINTMENTS);
    setCareTasks(INITIAL_CARE_TASKS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setCurrentRole("elderly");
    setCurrentUser(INITIAL_PROFILES[0]);
    setActivePatientId("elderly-1");
  };

  return (
    <CareContext.Provider
      value={{
        currentRole,
        setCurrentRole: handleSetRole,
        currentUser,
        isAuthenticated,
        isRealSupabase: isSupabaseConfigured,
        signInWithPassword,
        signUpWithPassword,
        signOut,
        elderlyProfiles,
        activePatient,
        elderlyProfile: activePatient,
        setActivePatientId,
        registerElderlyPatient,
        dataMode,
        setDataMode,
        dbMode: dataMode === "authentic" ? "clean" : "seed",
        setDbMode: (mode: "clean" | "seed") => setDataModeState(mode === "clean" ? "authentic" : "demo"),
        medications,
        events,
        appointments,
        careTasks,
        notifications,
        articles,
        clinicalNotes,
        consents,
        invitations,
        activityLogs,
        adherence,
        confirmMedication,
        skipMedication,
        addMedication,
        addAppointment,
        addCareTask,
        updateCareTaskStatus,
        addClinicalNote,
        amendClinicalNote,
        addNotification,
        markNotificationRead,
        inviteFamilyMember,
        revokeFamilyMember,
        resetDemoData,
      }}
    >
      {children}
    </CareContext.Provider>
  );
}

export function useCare() {
  const context = useContext(CareContext);
  if (!context) {
    throw new Error("useCare must be used within a CareProvider");
  }
  return context;
}
