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
} from "./types";

export const INITIAL_PROFILES: UserProfile[] = [
  {
    id: "user-elderly-1",
    email: "eleanor.vance@careos.health",
    full_name: "Eleanor Vance",
    name: "Eleanor Vance",
    role: "elderly",
    phone: "+1 (555) 234-5678",
    avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "user-family-1",
    email: "david.vance@careos.health",
    full_name: "David Vance",
    name: "David Vance",
    role: "family",
    phone: "+1 (555) 876-5432",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "user-caretaker-1",
    email: "priya.sharma@careos.health",
    full_name: "Nurse Priya Sharma, RN",
    name: "Nurse Priya Sharma, RN",
    role: "caretaker",
    phone: "+1 (555) 345-6789",
    avatar_url: "https://images.unsplash.com/photo-1594824813589-424a87383a54?w=150&auto=format&fit=crop&q=80",
  },
];

export const INITIAL_ELDERLY: ElderlyProfile = {
  id: "elderly-1",
  user_id: "user-elderly-1",
  full_name: "Eleanor Vance",
  name: "Eleanor Vance",
  age: 78,
  city: "Springfield",
  date_of_birth: "1948-04-12",
  blood_group: "O+",
  emergency_contact_name: "David Vance (Son)",
  emergency_contact_phone: "+1 (555) 876-5432",
  address: "742 Evergreen Terrace, Springfield",
  medical_notes: "Hypertension, mild Osteoarthritis, Type-2 Diabetes managed via diet and oral medication.",
  daily_checkin_status: "pending",
};

export const INITIAL_MEDICATIONS: Medication[] = [
  {
    id: "med-1",
    elderly_id: "elderly-1",
    name: "Lisinopril",
    dosage: "10mg",
    instructions: "Take once daily in the morning with a full glass of water.",
    prescribing_doctor: "Dr. Sarah Jenkins (Cardiology)",
    start_date: "2026-01-10",
    is_active: true,
    schedules: [
      {
        id: "sch-1",
        medication_id: "med-1",
        time_of_day: "08:00 AM",
        dosage_quantity: "1 tablet",
        days_of_week: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        reminder_enabled: true,
      },
    ],
  },
  {
    id: "med-2",
    elderly_id: "elderly-1",
    name: "Metformin ER",
    dosage: "500mg",
    instructions: "Take with breakfast and dinner to reduce stomach upset.",
    prescribing_doctor: "Dr. Michael Chang (Endocrinology)",
    start_date: "2026-02-01",
    is_active: true,
    schedules: [
      {
        id: "sch-2a",
        medication_id: "med-2",
        time_of_day: "08:30 AM",
        dosage_quantity: "1 tablet",
        days_of_week: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        reminder_enabled: true,
      },
      {
        id: "sch-2b",
        medication_id: "med-2",
        time_of_day: "07:30 PM",
        dosage_quantity: "1 tablet",
        days_of_week: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        reminder_enabled: true,
      },
    ],
  },
  {
    id: "med-3",
    elderly_id: "elderly-1",
    name: "Atorvastatin",
    dosage: "20mg",
    instructions: "Take once at bedtime.",
    prescribing_doctor: "Dr. Sarah Jenkins (Cardiology)",
    start_date: "2026-01-15",
    is_active: true,
    schedules: [
      {
        id: "sch-3",
        medication_id: "med-3",
        time_of_day: "09:00 PM",
        dosage_quantity: "1 tablet",
        days_of_week: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        reminder_enabled: true,
      },
    ],
  },
  {
    id: "med-4",
    elderly_id: "elderly-1",
    name: "Vitamin D3",
    dosage: "1000 IU",
    instructions: "Take with morning meal.",
    prescribing_doctor: "Dr. Emily Taylor (Primary Care)",
    start_date: "2026-03-01",
    is_active: true,
    schedules: [
      {
        id: "sch-4",
        medication_id: "med-4",
        time_of_day: "08:00 AM",
        dosage_quantity: "1 capsule",
        days_of_week: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        reminder_enabled: true,
      },
    ],
  },
];

export const INITIAL_TODAY_EVENTS: MedicationEvent[] = [
  {
    id: "evt-1",
    schedule_id: "sch-1",
    medication_id: "med-1",
    medication_name: "Lisinopril (10mg)",
    dosage_quantity: "1 tablet",
    elderly_id: "elderly-1",
    scheduled_time: "08:00 AM",
    status: "taken",
    recorded_time: "08:12 AM",
    notes: "Taken with breakfast water",
    confirmed_by: "user-elderly-1",
  },
  {
    id: "evt-2",
    schedule_id: "sch-4",
    medication_id: "med-4",
    medication_name: "Vitamin D3 (1000 IU)",
    dosage_quantity: "1 capsule",
    elderly_id: "elderly-1",
    scheduled_time: "08:00 AM",
    status: "taken",
    recorded_time: "08:12 AM",
    confirmed_by: "user-elderly-1",
  },
  {
    id: "evt-3",
    schedule_id: "sch-2a",
    medication_id: "med-2",
    medication_name: "Metformin ER (500mg)",
    dosage_quantity: "1 tablet",
    elderly_id: "elderly-1",
    scheduled_time: "08:30 AM",
    status: "unconfirmed",
  },
  {
    id: "evt-4",
    schedule_id: "sch-2b",
    medication_id: "med-2",
    medication_name: "Metformin ER (500mg)",
    dosage_quantity: "1 tablet",
    elderly_id: "elderly-1",
    scheduled_time: "07:30 PM",
    status: "unconfirmed",
  },
  {
    id: "evt-5",
    schedule_id: "sch-3",
    medication_id: "med-3",
    medication_name: "Atorvastatin (20mg)",
    dosage_quantity: "1 tablet",
    elderly_id: "elderly-1",
    scheduled_time: "09:00 PM",
    status: "unconfirmed",
  },
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: "apt-1",
    elderly_id: "elderly-1",
    doctor_name: "Dr. Sarah Jenkins",
    clinic_or_hospital: "Metro Heart & Vascular Center",
    appointment_time: "Tomorrow at 10:30 AM",
    purpose: "Routine blood pressure checkup and echocardiogram follow-up",
    status: "upcoming",
    caretaker_id: "user-caretaker-1",
    caretaker_name: "Nurse Priya Sharma",
    notes: "Please bring blood pressure log for the past 14 days.",
  },
  {
    id: "apt-2",
    elderly_id: "elderly-1",
    doctor_name: "Dr. Michael Chang",
    clinic_or_hospital: "St. Jude Endocrinology Suite",
    appointment_time: "Nov 22, 2026 at 02:00 PM",
    purpose: "HbA1c diabetes 3-month review",
    status: "upcoming",
    caretaker_id: "user-caretaker-1",
    caretaker_name: "Nurse Priya Sharma",
    notes: "Fasting blood sample required morning of visit.",
  },
  {
    id: "apt-3",
    elderly_id: "elderly-1",
    doctor_name: "Dr. Emily Taylor",
    clinic_or_hospital: "Oakridge Primary Health Clinic",
    appointment_time: "Oct 15, 2026 at 11:00 AM",
    purpose: "Annual wellness examination & seasonal flu immunization",
    status: "completed",
    notes: "Vitals stable, flu vaccination administered.",
  },
];

export const INITIAL_CARE_TASKS: CareTask[] = [
  {
    id: "task-1",
    elderly_id: "elderly-1",
    assigned_to: "user-caretaker-1",
    assigned_name: "Nurse Priya Sharma",
    title: "Check blood pressure and log readings",
    description: "Measure resting BP before 10:00 AM and enter in CareOS.",
    priority: "high",
    due_date: "Today at 10:00 AM",
    status: "completed",
  },
  {
    id: "task-2",
    elderly_id: "elderly-1",
    assigned_to: "user-family-1",
    assigned_name: "David Vance",
    title: "Pick up Lisinopril refill from Walgreens",
    description: "Refill prescription #84920 ready for pickup on 4th street.",
    priority: "medium",
    due_date: "Tomorrow by 5:00 PM",
    status: "pending",
  },
  {
    id: "task-3",
    elderly_id: "elderly-1",
    assigned_to: "user-caretaker-1",
    assigned_name: "Nurse Priya Sharma",
    title: "Accompany Eleanor to Dr. Jenkins appointment",
    description: "Transport coordination confirmed. Arrive 15 mins prior.",
    priority: "urgent",
    due_date: "Tomorrow at 10:00 AM",
    status: "pending",
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    recipient_id: "user-family-1",
    elderly_id: "elderly-1",
    type: "adherence_alert",
    title: "Morning Dose Confirmed",
    message: "Eleanor took Lisinopril 10mg and Vitamin D3 on schedule at 08:12 AM.",
    is_read: false,
    created_at: "Today, 08:13 AM",
  },
  {
    id: "notif-2",
    recipient_id: "user-caretaker-1",
    elderly_id: "elderly-1",
    type: "appointment_reminder",
    title: "Upcoming Cardiology Checkup",
    message: "Appointment with Dr. Sarah Jenkins tomorrow at 10:30 AM.",
    is_read: false,
    link: "/appointments",
    created_at: "Today, 07:00 AM",
  },
];

export const INITIAL_ARTICLES: EducationArticle[] = [
  {
    id: "art-1",
    title: "Why Taking Blood Pressure Medicine at the Same Time Matters",
    category: "medication_safety",
    language: "en",
    summary: "Consistency in taking hypertension medicines helps maintain a steady protective level in your bloodstream 24/7.",
    content: "Blood pressure fluctuates throughout the day and peaks in the morning. When medications like ACE inhibitors (such as Lisinopril) are taken consistently at the same time each morning, they prevent dangerous blood pressure surges that could strain your heart or blood vessels. Pair your pill with a daily morning habit, such as your morning glass of warm water or breakfast, so it becomes second nature.",
    key_takeaways: [
      "Taking your medicine at the same time prevents morning blood pressure spikes.",
      "Never double up on doses if you missed one earlier; consult your care team.",
      "Pair your dose with an established morning routine.",
    ],
    quiz: [
      {
        question: "What is the best way to remember taking your daily blood pressure pill?",
        options: [
          "Take it randomly whenever you remember",
          "Pair it with an established daily routine like breakfast",
          "Wait until your head aches",
          "Double the dose the next day",
        ],
        correctIndex: 1,
        explanation: "Habit pairing (like taking it with breakfast) creates a reliable trigger that reduces missed doses.",
      },
      {
        question: "If you accidentally forget a dose, what is the safest step?",
        options: [
          "Take two pills at once right away",
          "Check your care instructions or consult your doctor before taking extra",
          "Stop taking the medication entirely",
          "Drink double water",
        ],
        correctIndex: 1,
        explanation: "Doubling doses can cause sudden drops in blood pressure (hypotension). Always follow clinical guidance.",
      },
    ],
    audio_script: "Welcome to Health Academy. Today's lesson is on blood pressure consistency. Blood pressure medicines work best when kept at a stable level in your body. Taking your pill every morning with breakfast keeps you safely protected throughout the day.",
  },
  {
    id: "art-2",
    title: "सटीक समय पर दवा क्यों जरूरी है? (Medication Timing in Hindi)",
    category: "medication_safety",
    language: "hi",
    summary: "रक्तचाप और मधुमेह की दवाएं सही समय पर लेने से स्वास्थ्य स्थिर रहता है।",
    content: "दवाइयों का पूरा असर तब मिलता है जब शरीर में दवा का स्तर हमेशा एक समान बना रहे। रोज़ाना सुबह नाश्ते के साथ या तय समय पर दवा लेने से भूलने की संभावना कम होती है। किसी भी खुराक को छोड़ना या अचानक दोहरी गोली लेना खतरनाक हो सकता है।",
    key_takeaways: [
      "रोज़ाना तय समय पर दवा लें।",
      "दवा को पानी के साथ लें।",
      "भूल जाने पर डॉक्टर की सलाह के बिना दोहरी खुराक न लें।",
    ],
    quiz: [
      {
        question: "दवा याद रखने का सबसे आसान तरीका क्या है?",
        options: [
          "नाश्ते या सुबह की दिनचर्या के साथ दवा जोड़ना",
          "जब याद आए तब लेना",
          "दवा न लेना",
          "दोहरी गोली लेना",
        ],
        correctIndex: 0,
        explanation: "दैनिक दिनचर्या से जोड़ना सबसे सुरक्षित तरीका है।",
      },
    ],
    audio_script: "हेल्थ एकेडमी में आपका स्वागत है। समय पर दवा लेना आपके दिल और स्वास्थ्य के लिए अत्यंत आवश्यक है।",
  },
  {
    id: "art-3",
    title: "औषधे वेळेवर घेणे का महत्त्वाचे आहे? (Medication Timing in Marathi)",
    category: "medication_safety",
    language: "mr",
    summary: "वेळेवर औषधे घेतल्याने शरीरातील औषधाची पातळी योग्य राहते आणि आरोग्य सुरक्षित राहते.",
    content: "रक्तदाब आणि मधुमेहाची औषधे नियमित वेळी घेणे गरजेचे आहे. रोज सकाळी ठरलेल्या वेळी नाश्त्यानंतर औषध घेतल्यास विसरण्याची शक्यता कमी होते. औषधाची गोळी सुटल्यास डॉक्टरांच्या सल्ल्याशिवाय दुप्पट गोळी घेऊ नका.",
    key_takeaways: [
      "औषध नेहमी ठरलेल्या वेळी घ्या.",
      "नाश्त्याच्या सवयीशी औषध जोडा.",
      "काही अडचण आल्यास काळजीवाहकाला सांगा.",
    ],
    quiz: [
      {
        question: "औषध वेळेवर आठवण्यासाठी काय करावे?",
        options: [
          "सकाळच्या नाश्त्यासोबत औषध घेण्याची सवय लावावी",
          "कधीही गोळी घ्यावी",
          "गोळी घेणे सोडून द्यावे",
          "एकत्र दोन गोळ्या घ्याव्यात",
        ],
        correctIndex: 0,
        explanation: "नियमित सवयीसोबत जोडल्यास औषध विसरत नाही.",
      },
    ],
    audio_script: "केअर ओएस हेल्थ अकादमी मध्ये आपले स्वागत आहे. नियमित औषधोपचार हे दीर्घायुष्याची गुरुकिल्ली आहे.",
  },
  {
    id: "art-4",
    title: "Understanding Your Prescription Label at a Glance",
    category: "medication_safety",
    language: "en",
    summary: "Learn what the instructions, refills, and warning symbols mean on your prescription bottles.",
    content: "Prescription bottles carry critical safeguards. 'Take with food' means the medicine may irritate an empty stomach. 'Rx #' is your unique identifier when ordering refills. 'Take Q.D.' means once daily, while 'B.I.D.' means twice daily. Knowing these terms keeps you in full control of your wellness.",
    key_takeaways: [
      "Always check the medicine name and dosage strength on the bottle label.",
      "Look for cautionary labels like 'Take with meals' or 'May cause drowsiness'.",
      "Keep prescription numbers handy for family or caretaker refills.",
    ],
    quiz: [
      {
        question: "What does 'Take with food' primarily help prevent?",
        options: [
          "Stomach irritation and upset",
          "Headache",
          "Tiredness",
          "High fever",
        ],
        correctIndex: 0,
        explanation: "Taking medications with food buffers the stomach lining and ensures smooth absorption.",
      },
    ],
    audio_script: "Today in Health Academy, we decode prescription labels. Always look for instructions like taking with food to protect your stomach.",
  },
];

// Helper to compute live adherence summary
export function calculateAdherence(events: MedicationEvent[]): AdherenceSummary {
  const total = events.length;
  if (total === 0) {
    return {
      overall_percentage: 0,
      total_doses: 0,
      taken_count: 0,
      missed_count: 0,
      skipped_count: 0,
      unconfirmed_count: 0,
      weekly_trend: [],
      status_assessment: "excellent",
      last_alert: "No medication events scheduled or recorded yet.",
    };
  }

  const taken = events.filter((e) => e.status === "taken").length;
  const missed = events.filter((e) => e.status === "missed").length;
  const skipped = events.filter((e) => e.status === "skipped").length;
  const unconfirmed = events.filter((e) => e.status === "unconfirmed").length;

  // Percentage based on resolved doses (or overall today)
  const resolved = taken + missed + skipped;
  const percentage = resolved > 0 ? Math.round((taken / (taken + missed)) * 100) : 100;

  let status: "excellent" | "needs_attention" | "critical" = "excellent";
  if (missed >= 2 || percentage < 75) {
    status = "critical";
  } else if (missed === 1 || percentage < 90) {
    status = "needs_attention";
  }

  const weeklyTrend = [
    { day: "Mon", percentage: 100, taken: 4, total: 4 },
    { day: "Tue", percentage: 100, taken: 4, total: 4 },
    { day: "Wed", percentage: 75, taken: 3, total: 4 },
    { day: "Thu", percentage: 100, taken: 4, total: 4 },
    { day: "Fri", percentage: 100, taken: 4, total: 4 },
    { day: "Sat", percentage: 80, taken: 4, total: 5 },
    { day: "Sun (Today)", percentage: percentage, taken: taken, total: total },
  ];

  return {
    overall_percentage: percentage,
    total_doses: total,
    taken_count: taken,
    missed_count: missed,
    skipped_count: skipped,
    unconfirmed_count: unconfirmed,
    weekly_trend: weeklyTrend,
    status_assessment: status,
    last_alert: missed > 0 ? `${missed} dose marked missed recently` : undefined,
  };
}
