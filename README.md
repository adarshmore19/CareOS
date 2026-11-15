# CareOS: AI-Powered Elderly Healthcare & Medication Management Ecosystem

> **Healthcare that keeps everyone connected.**  
> An intelligent, accessible elderly care platform that brings medication management, family coordination, and voice-powered assistance into one unified ecosystem.

---

## 1. Product Overview

CareOS is designed to help elderly individuals manage their daily healthcare routines independently while keeping family members and caretakers synchronized in real time. Rather than six isolated tools, CareOS functions as a cohesive, single-deployment ecosystem where actions in one module instantly inform the others.

### The Six Connected Modules

1. **MediMate (Module A - Medication Management)**
   - Smart medication schedule with dosages, frequencies, and doctor instructions.
   - Interactive daily intake timeline with one-touch intake confirmation ("Confirm Taken", "Skip", "Undo").
   - Registry for prescribed dosages entered by authorized caretakers or family.

2. **FamilyCare (Module B - Shared Family Dashboard)**
   - Transparent, real-time family view of patient health status, vitals, and medication timeline.
   - Activity notifications and alerts delivered to family circles.
   - Immediate one-touch emergency and nurse calling actions.

3. **CareSync (Module C - Healthcare Coordination)**
   - Doctor appointments, clinic visits, and escort assignments.
   - Synchronized care tasks checklist with urgency indicators (Low, Medium, High, Urgent).

4. **PillGuard (Module D - Adherence Monitoring & Analytics)**
   - Deterministic compliance score calculation from scheduled vs recorded events.
   - 7-day adherence trend bar visualization.
   - Missed dose detection and automated caretaker alert dispatching with clear non-diagnostic clinical explanations.

5. **Health Academy (Module E - Interactive Healthcare Education)**
   - Patient-friendly, plain-language lessons on medication timing, prescription labels, and safety.
   - Multilingual support: **English**, **हिंदी (Hindi)**, and **मराठी (Marathi)**.
   - Interactive knowledge check quizzes with instant explanations.
   - Built-in speech synthesis read-aloud for elderly auditory assistance.

6. **CareVoice AI (Module F - Conversational Healthcare Assistant)**
   - Voice-powered conversational companion with tool calling.
   - Powered by Gemini API with an offline deterministic tool-calling engine fallback.
   - Controlled backend tools:
     - `get_daily_medications`
     - `get_upcoming_appointments`
     - `get_medication_history`
     - `get_adherence_summary`
     - `get_caretaker_details`
     - `create_appointment_request`
     - `create_care_task`
   - Strict safety guardrails: Rejects medical diagnoses and autonomous prescription adjustments.

---

## 2. Elderly Accessibility (WCAG 2.1 Compliant)

CareOS features a dedicated **Elderly Easy View** (`/elderly`):
- **Large readable typography:** 20px–32px high-legibility fonts.
- **Large touch targets:** Minimum 48px–56px button targets.
- **High contrast:** WCAG AAA color ratios on soothing, non-fatiguing backgrounds.
- **Audio read-aloud:** Speaks schedules, pill instructions, and lessons using the Web Speech API.
- **Microphone speech input:** Hands-free voice querying for elderly users with arthritis or tremors.

---

## 3. Technology Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5.6
- **Styling:** Tailwind CSS, PostCSS, Lucide Icons
- **Database:** Supabase PostgreSQL with Row Level Security (RLS) & Local Reactive Store
- **AI / NLP:** Google Gemini API & CareVoice Tool Execution Engine
- **Voice:** Browser Speech Recognition (`webkitSpeechRecognition`) & Speech Synthesis (`SpeechSynthesisUtterance`)

---

## 4. End-to-End Integrated Workflow

1. **Patient Check-in:** Eleanor Vance logs in and views her daily medication schedule on `/elderly` or `/medications`.
2. **Intake Confirmation:** Eleanor confirms her morning dose with one tap.
3. **PillGuard Recalculation:** PillGuard immediately recalculates her adherence percentage (updating the live compliance metric).
4. **Family & Caregiver Sync:** David Vance (son) and Nurse Priya Sharma (RN) receive an instant notification in `/family` and `/caretaker`.
5. **CareVoice Query:** Eleanor asks: *"Have I taken my morning medicines?"* CareVoice executes `get_daily_medications`, verifies that Lisinopril and Vitamin D3 were taken, and speaks the confirmation aloud.
6. **CareSync Appointments:** Doctor visits with Dr. Jenkins and assigned escort details are tracked at `/appointments`.
7. **Health Academy:** Eleanor reviews a lesson on blood pressure medication in English, Hindi, or Marathi at `/academy`.

---

## 5. Instant Demo Personas (No Password Needed)

On `/login`, or using the persistent role switcher in the top banner:
- **👵 Eleanor Vance (Elderly Individual, 78y):** Focuses on large buttons, audio prompts, and daily pill confirmations.
- **👨 David Vance (Family Member / Son):** Shared health monitoring, adherence overview, and emergency contact.
- **👩‍⚕️ Nurse Priya Sharma, RN (Primary Caregiver):** Clinical observation logging, visit coordination, and care task management.

---

## 6. Installation & Local Development

### Prerequisites
- Node.js >= 18
- npm >= 9

### Setup
```bash
# Clone the repository
git clone <repo-url>
cd CareOS

# Install dependencies
npm install

# Run development server
npm run dev

# Or run optimized production build
npm run build
npm run start
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 7. Automated Smoke & Integration Tests

Run the built-in end-to-end verification script:
```bash
node test-e2e-workflow.js
```

This verifies:
- `get_daily_medications` tool execution
- `get_upcoming_appointments` tool execution
- `get_adherence_summary` tool execution
- `get_caretaker_details` tool execution
- Strict safety guardrails rejecting unauthorized diagnosis/prescription changes

---

## 8. Database Migrations (Supabase PostgreSQL)

Database schemas with Row Level Security (RLS) policies are located at:
`supabase/migrations/20261115_careos_schema.sql`

To apply to your Supabase project:
1. Create a project at [supabase.com](https://supabase.com).
2. Go to the SQL Editor and execute the contents of `supabase/migrations/20261115_careos_schema.sql`.
3. Add your Supabase URL and Anon Key to `.env.local`.

---

## 9. Environment Variables

Documented in `.env.example`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GEMINI_API_KEY=your-gemini-api-key
NEXT_PUBLIC_DEMO_MODE=true
```
*(If credentials are omitted, CareOS operates seamlessly in offline demo mode using its built-in reactive store).*

---

## 10. Deployment (Vercel)

CareOS is structured as a single-deployment Next.js application:
```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Deploy to Vercel
vercel --prod
```

Configure `GEMINI_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in your Vercel Project Settings.
