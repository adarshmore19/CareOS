# CareOS V2: AI-Powered Elderly Healthcare & Multi-Portal Care Management

> **Healthcare that keeps everyone connected.**  
> An intelligent, accessible elderly care ecosystem that unifies patient independence, family circle monitoring, professional caregiving operations, and voice-assisted healthcare intelligence.

---

## 1. What's New in CareOS V2

CareOS V2 elevates the platform from an MVP into a production-grade, multi-user healthcare platform powered by Supabase:

1. **FamilyCare Portal (`/family`)**:
   - Multi-patient switcher supporting families caring for multiple elderly relatives.
   - Comprehensive patient monitoring: Adherence trends, today's doses, appointments, care activities, and alert center.
   - Family Circle member invitation workflow with permission boundaries (`can_edit_meds`).
   - Active patient consent tracking (HIPAA/GDPR compliance).

2. **Caretaker Operations Station (`/caretaker`, `/caretaker/patients`, `/caretaker/patients/[id]`)**:
   - **Station Overview (`/caretaker`)**: Summary metrics, outstanding doses, incomplete duties, and clinical notes feed.
   - **Patient Directory (`/caretaker/patients`)**: Filterable roster of all assigned patients with real-time adherence indicators and emergency triggers.
   - **Clinical Patient Workspace (`/caretaker/patients/[id]`)**:
     - Direct medication administration recording with duplicate check verification.
     - Clinical observation notes with auditable amendment attachments.
     - Care task creation and priority updates.
     - Read-only patient emergency profile and medical history.

3. **Supabase Real Backend & SSR Auth**:
   - Supabase Auth integration (`@supabase/ssr`) with HttpOnly session cookies.
   - PostgreSQL schema with 17 normalized relational tables and composite indexes.
   - Server-enforced Row-Level Security (RLS) policies protecting patient privacy.
   - Database trigger `prevent_role_self_promotion()` blocking client-side privilege escalation.
   - Dual-Mode Resilience: Operates against live Supabase or seamlessly in an isolated demo environment.

4. **Zero-Slop Clean Clinical Design**:
   - Audited with `@impeccable/detect` (0 findings).
   - Calibrated contrast, clean typography, WCAG AAA accessibility, and zero AI decorative fluff.

---

## 2. Core Portals & Workspaces

| Portal | Route | Primary User | Key Capabilities |
|:---|:---|:---|:---|
| **MediMate** | `/elderly` | Elderly Patient | 1-Tap dose confirmation, voice read-aloud, emergency dial, high legibility |
| **FamilyCare** | `/family` | Family Circle | Multi-patient monitoring, dose timeline, notifications, circle invitations |
| **Caretaker Station** | `/caretaker` | Nurses / Caregivers | Clinical workspace, dose administration, auditable notes, care task checklist |
| **Patient Directory**| `/caretaker/patients` | Caregiver Agency | Search & filter assigned patients, review adherence scores, emergency call |
| **CareSync** | `/appointments` | All Roles | Doctor appointment scheduling, clinical escort assignments |
| **PillGuard** | `/adherence` | All Roles | Adherence trends, missed dose tracking, clinical non-diagnostic alerts |
| **Health Academy** | `/academy` | Patients / Family | Multilingual health education (English, Hindi, Marathi) with quizzes |
| **CareVoice AI** | `/assistant` | All Roles | Voice assistant with deterministic tool calling and safety guardrails |

---

## 3. Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.6
- **Styling**: Tailwind CSS, PostCSS, Lucide Icons
- **Database & Auth**: Supabase PostgreSQL with Row Level Security (RLS) & Supabase Auth (`@supabase/ssr`)
- **AI / NLP**: Google Gemini API + Offline Deterministic CareVoice Tool Execution Engine
- **Speech**: Browser Speech Recognition (`webkitSpeechRecognition`) & Speech Synthesis (`SpeechSynthesisUtterance`)
- **Testing**: Node.js Automated Integration & E2E Test Suites (`test-v2-real-supabase.js`, `test-e2e-workflow.js`)

---

## 4. Documentation

Comprehensive technical documentation is available in the [`docs/`](docs/) directory:

- [**System Architecture**](docs/ARCHITECTURE.md): Multi-portal architecture, data flows, and realtime sync pipeline.
- [**Database Schema**](docs/DATABASE.md): Detailed 17-table relational schema, foreign keys, and performance indexes.
- [**Authentication & Session**](docs/AUTHENTICATION.md): Supabase Auth lifecycle, HttpOnly cookies, and SSR patterns.
- [**Role & Permission Matrix**](docs/ROLE_PERMISSIONS.md): Fine-grained permission boundaries across Elderly, Family, and Caretaker roles.
- [**Security & Compliance**](docs/SECURITY.md): Row-Level Security policies, clinical note immutability, and duplicate dose prevention.
- [**Deployment Guide**](docs/DEPLOYMENT.md): Step-by-step instructions for Vercel, Supabase, and Docker self-hosting.

---

## 5. Local Setup & Testing

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/CareOS.git
cd CareOS

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

### Running Automated Test Suites

```bash
# Run CareOS V2 comprehensive integration tests (30 tests: Auth, RLS, Portals, API)
node test-v2-real-supabase.js

# Run CareVoice AI and E2E workflow verification
node test-e2e-workflow.js

# Run production build check
npm run build
```

---

## 6. Instant Demo Personas

On `/login`, evaluate role-tailored experiences with one click:
- **👵 Eleanor Vance (Patient, 78y)**: High-contrast, large touch targets, audio prompts, 1-tap dose logging.
- **👨 David Vance (Family Member)**: Multi-patient FamilyCare dashboard, adherence monitoring, and emergency links.
- **👩‍⚕️ Nurse Priya Sharma, RN (Licensed Caregiver)**: Caretaker operations station, clinical observation logging, and patient directory.
