"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
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

interface CareContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentUser: UserProfile;
  elderlyProfile: ElderlyProfile;
  medications: Medication[];
  events: MedicationEvent[];
  appointments: Appointment[];
  careTasks: CareTask[];
  notifications: NotificationItem[];
  articles: EducationArticle[];
  adherence: AdherenceSummary;
  confirmMedication: (eventId: string, status: MedicationStatus, notes?: string) => void;
  addMedication: (med: Omit<Medication, "id">) => void;
  addAppointment: (apt: Omit<Appointment, "id">) => void;
  addCareTask: (task: Omit<CareTask, "id">) => void;
  updateCareTaskStatus: (taskId: string, status: TaskStatus) => void;
  addNotification: (notif: Omit<NotificationItem, "id" | "created_at">) => void;
  markNotificationRead: (notifId: string) => void;
  resetDemoData: () => void;
}

const CareContext = createContext<CareContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = "careos_data_v1_";

export function CareProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>("elderly");
  const [events, setEvents] = useState<MedicationEvent[]>(INITIAL_TODAY_EVENTS);
  const [medications, setMedications] = useState<Medication[]>(INITIAL_MEDICATIONS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [careTasks, setCareTasks] = useState<CareTask[]>(INITIAL_CARE_TASKS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [articles] = useState<EducationArticle[]>(INITIAL_ARTICLES);
  const [isClient, setIsClient] = useState(false);

  // Load persisted state from localStorage on client mount
  useEffect(() => {
    setIsClient(true);
    try {
      const savedEvents = localStorage.getItem(STORAGE_KEY_PREFIX + "events");
      if (savedEvents) setEvents(JSON.parse(savedEvents));

      const savedMeds = localStorage.getItem(STORAGE_KEY_PREFIX + "medications");
      if (savedMeds) setMedications(JSON.parse(savedMeds));

      const savedApts = localStorage.getItem(STORAGE_KEY_PREFIX + "appointments");
      if (savedApts) setAppointments(JSON.parse(savedApts));

      const savedTasks = localStorage.getItem(STORAGE_KEY_PREFIX + "tasks");
      if (savedTasks) setCareTasks(JSON.parse(savedTasks));

      const savedNotifs = localStorage.getItem(STORAGE_KEY_PREFIX + "notifications");
      if (savedNotifs) setNotifications(JSON.parse(savedNotifs));

      const savedRole = localStorage.getItem(STORAGE_KEY_PREFIX + "role") as UserRole | null;
      if (savedRole) setCurrentRole(savedRole);
    } catch {
      // LocalStorage access failure fallback
    }
  }, []);

  // Save changes to localStorage
  const saveToStorage = (key: string, data: unknown) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(data));
      } catch {
        // Storage quota or private mode fallback
      }
    }
  };

  const handleSetRole = (role: UserRole) => {
    setCurrentRole(role);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_PREFIX + "role", role);
    }
  };

  const currentUser =
    INITIAL_PROFILES.find((p) => p.role === currentRole) || INITIAL_PROFILES[0];

  const adherence = calculateAdherence(events);

  const confirmMedication = (eventId: string, status: MedicationStatus, notes?: string) => {
    const nowTime = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const updated = events.map((evt) => {
      if (evt.id === eventId) {
        return {
          ...evt,
          status,
          recorded_time: status === "taken" ? nowTime : undefined,
          notes: notes || evt.notes,
          confirmed_by: currentUser.id,
        };
      }
      return evt;
    });

    setEvents(updated);
    saveToStorage("events", updated);

    // Auto-generate notification for family & caretaker
    const targetEvent = events.find((e) => e.id === eventId);
    if (targetEvent) {
      const isTaken = status === "taken";
      const newNotif: NotificationItem = {
        id: "notif-" + Date.now(),
        recipient_id: "user-family-1",
        elderly_id: "elderly-1",
        type: "adherence_alert",
        title: isTaken ? "Dose Confirmed" : `Dose Marked as ${status}`,
        message: `${INITIAL_ELDERLY.full_name} marked ${targetEvent.medication_name} as ${status} at ${nowTime}.`,
        is_read: false,
        created_at: `Today, ${nowTime}`,
      };

      const updatedNotifs = [newNotif, ...notifications];
      setNotifications(updatedNotifs);
      saveToStorage("notifications", updatedNotifs);
    }
  };

  const addMedication = (newMed: Omit<Medication, "id">) => {
    const medWithId: Medication = {
      ...newMed,
      id: "med-" + Date.now(),
    };
    const updated = [medWithId, ...medications];
    setMedications(updated);
    saveToStorage("medications", updated);

    // Also schedule a today event for it
    const newEvent: MedicationEvent = {
      id: "evt-" + Date.now(),
      medication_id: medWithId.id,
      medication_name: `${medWithId.name} (${medWithId.dosage})`,
      dosage_quantity: medWithId.schedules?.[0]?.dosage_quantity || "1 dose",
      elderly_id: medWithId.elderly_id,
      scheduled_time: medWithId.schedules?.[0]?.time_of_day || "12:00 PM",
      status: "unconfirmed",
    };
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    saveToStorage("events", updatedEvents);
  };

  const addAppointment = (newApt: Omit<Appointment, "id">) => {
    const aptWithId: Appointment = {
      ...newApt,
      id: "apt-" + Date.now(),
    };
    const updated = [aptWithId, ...appointments];
    setAppointments(updated);
    saveToStorage("appointments", updated);

    const nowTime = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const newNotif: NotificationItem = {
      id: "notif-" + Date.now(),
      recipient_id: "user-caretaker-1",
      elderly_id: "elderly-1",
      type: "appointment_reminder",
      title: "New Appointment Scheduled",
      message: `Appointment with ${newApt.doctor_name} scheduled for ${newApt.appointment_time}.`,
      is_read: false,
      link: "/appointments",
      created_at: `Today, ${nowTime}`,
    };
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    saveToStorage("notifications", updatedNotifs);
  };

  const addCareTask = (newTask: Omit<CareTask, "id">) => {
    const taskWithId: CareTask = {
      ...newTask,
      id: "task-" + Date.now(),
    };
    const updated = [taskWithId, ...careTasks];
    setCareTasks(updated);
    saveToStorage("tasks", updated);
  };

  const updateCareTaskStatus = (taskId: string, status: TaskStatus) => {
    const updated = careTasks.map((t) => (t.id === taskId ? { ...t, status } : t));
    setCareTasks(updated);
    saveToStorage("tasks", updated);
  };

  const addNotification = (notif: Omit<NotificationItem, "id" | "created_at">) => {
    const nowTime = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const item: NotificationItem = {
      ...notif,
      id: "notif-" + Date.now(),
      created_at: `Today, ${nowTime}`,
    };
    const updated = [item, ...notifications];
    setNotifications(updated);
    saveToStorage("notifications", updated);
  };

  const markNotificationRead = (notifId: string) => {
    const updated = notifications.map((n) =>
      n.id === notifId ? { ...n, is_read: true } : n
    );
    setNotifications(updated);
    saveToStorage("notifications", updated);
  };

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
  };

  return (
    <CareContext.Provider
      value={{
        currentRole,
        setCurrentRole: handleSetRole,
        currentUser,
        elderlyProfile: INITIAL_ELDERLY,
        medications,
        events,
        appointments,
        careTasks,
        notifications,
        articles,
        adherence,
        confirmMedication,
        addMedication,
        addAppointment,
        addCareTask,
        updateCareTaskStatus,
        addNotification,
        markNotificationRead,
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
