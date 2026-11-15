-- CareOS Database Schema Migration
-- Standard PostgreSQL / Supabase Schema with Row Level Security (RLS)

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS & TYPES
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('elderly', 'family', 'caretaker', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE med_event_status AS ENUM ('taken', 'skipped', 'missed', 'unconfirmed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE appointment_status AS ENUM ('upcoming', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE task_status AS ENUM ('pending', 'in_progress', 'completed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'elderly',
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. ELDERLY PROFILES
CREATE TABLE IF NOT EXISTS elderly_profiles (
    id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    date_of_birth DATE,
    blood_group TEXT,
    emergency_contact_name TEXT NOT NULL,
    emergency_contact_phone TEXT NOT NULL,
    address TEXT,
    medical_notes TEXT,
    daily_checkin_status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. FAMILY MEMBERSHIPS
CREATE TABLE IF NOT EXISTS family_memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    elderly_id UUID NOT NULL REFERENCES elderly_profiles(id) ON DELETE CASCADE,
    family_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    relationship TEXT NOT NULL,
    can_edit_meds BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(elderly_id, family_user_id)
);

-- 6. CARETAKER ASSIGNMENTS
CREATE TABLE IF NOT EXISTS caretaker_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    elderly_id UUID NOT NULL REFERENCES elderly_profiles(id) ON DELETE CASCADE,
    caretaker_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role_title TEXT NOT NULL DEFAULT 'Primary Caregiver',
    contact_number TEXT,
    is_primary BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(elderly_id, caretaker_id)
);

-- 7. MEDICATIONS
CREATE TABLE IF NOT EXISTS medications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    elderly_id UUID NOT NULL REFERENCES elderly_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    dosage TEXT NOT NULL,
    instructions TEXT,
    prescribing_doctor TEXT,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. MEDICATION SCHEDULES
CREATE TABLE IF NOT EXISTS medication_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    medication_id UUID NOT NULL REFERENCES medications(id) ON DELETE CASCADE,
    time_of_day TEXT NOT NULL, -- e.g. '08:00 AM', '01:00 PM', '08:00 PM'
    dosage_quantity TEXT NOT NULL DEFAULT '1 tablet',
    days_of_week TEXT[] DEFAULT ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    reminder_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. MEDICATION EVENTS (PillGuard tracking)
CREATE TABLE IF NOT EXISTS medication_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    schedule_id UUID REFERENCES medication_schedules(id) ON DELETE SET NULL,
    medication_id UUID NOT NULL REFERENCES medications(id) ON DELETE CASCADE,
    elderly_id UUID NOT NULL REFERENCES elderly_profiles(id) ON DELETE CASCADE,
    scheduled_time TIMESTAMPTZ NOT NULL,
    recorded_time TIMESTAMPTZ,
    status med_event_status NOT NULL DEFAULT 'unconfirmed',
    notes TEXT,
    confirmed_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. APPOINTMENTS (CareSync)
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    elderly_id UUID NOT NULL REFERENCES elderly_profiles(id) ON DELETE CASCADE,
    doctor_name TEXT NOT NULL,
    clinic_or_hospital TEXT NOT NULL,
    appointment_time TIMESTAMPTZ NOT NULL,
    purpose TEXT NOT NULL,
    status appointment_status NOT NULL DEFAULT 'upcoming',
    caretaker_id UUID REFERENCES profiles(id),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. CARE TASKS
CREATE TABLE IF NOT EXISTS care_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    elderly_id UUID NOT NULL REFERENCES elderly_profiles(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES profiles(id),
    created_by UUID REFERENCES profiles(id),
    title TEXT NOT NULL,
    description TEXT,
    priority task_priority NOT NULL DEFAULT 'medium',
    due_date TIMESTAMPTZ,
    status task_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    elderly_id UUID REFERENCES elderly_profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'adherence_alert', 'appointment_reminder', 'care_task_assigned', 'emergency'
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    link TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. HEALTHCARE EDUCATION (Health Academy)
CREATE TABLE IF NOT EXISTS healthcare_education (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    language TEXT NOT NULL DEFAULT 'en', -- 'en', 'hi', 'mr'
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    key_takeaways TEXT[] DEFAULT ARRAY[]::TEXT[],
    quiz_questions JSONB DEFAULT '[]'::JSONB,
    audio_script TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. LEARNING PROGRESS
CREATE TABLE IF NOT EXISTS learning_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    article_id UUID NOT NULL REFERENCES healthcare_education(id) ON DELETE CASCADE,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    quiz_score INTEGER,
    last_accessed TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, article_id)
);

-- 15. ACTIVITY LOGS
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    elderly_id UUID NOT NULL REFERENCES elderly_profiles(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES profiles(id),
    action_type TEXT NOT NULL,
    description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_med_events_elderly_time ON medication_events(elderly_id, scheduled_time DESC);
CREATE INDEX IF NOT EXISTS idx_medications_elderly ON medications(elderly_id, is_active);
CREATE INDEX IF NOT EXISTS idx_appointments_elderly_time ON appointments(elderly_id, appointment_time ASC);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_id, is_read);
CREATE INDEX IF NOT EXISTS idx_care_tasks_elderly ON care_tasks(elderly_id, status);

-- 17. ROW LEVEL SECURITY (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE elderly_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE caretaker_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE medication_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE medication_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE healthcare_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Allow public read on healthcare education
CREATE POLICY "Public read healthcare education" ON healthcare_education FOR SELECT USING (true);

-- Base policy templates (Users can view their own profile and records they are linked to)
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Elderly & Linked care access policies
CREATE POLICY "Elderly and linked members can view elderly_profile" ON elderly_profiles FOR SELECT
USING (
    auth.uid() = id OR
    EXISTS (SELECT 1 FROM family_memberships WHERE family_memberships.elderly_id = elderly_profiles.id AND family_memberships.family_user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM caretaker_assignments WHERE caretaker_assignments.elderly_id = elderly_profiles.id AND caretaker_assignments.caretaker_id = auth.uid())
);

CREATE POLICY "Elderly and linked members can view medications" ON medications FOR SELECT
USING (
    auth.uid() = elderly_id OR
    EXISTS (SELECT 1 FROM family_memberships WHERE family_memberships.elderly_id = medications.elderly_id AND family_memberships.family_user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM caretaker_assignments WHERE caretaker_assignments.elderly_id = medications.elderly_id AND caretaker_assignments.caretaker_id = auth.uid())
);

CREATE POLICY "Elderly and linked members can view medication_events" ON medication_events FOR SELECT
USING (
    auth.uid() = elderly_id OR
    EXISTS (SELECT 1 FROM family_memberships WHERE family_memberships.elderly_id = medication_events.elderly_id AND family_memberships.family_user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM caretaker_assignments WHERE caretaker_assignments.elderly_id = medication_events.elderly_id AND caretaker_assignments.caretaker_id = auth.uid())
);

CREATE POLICY "Elderly and linked members can view appointments" ON appointments FOR SELECT
USING (
    auth.uid() = elderly_id OR
    EXISTS (SELECT 1 FROM family_memberships WHERE family_memberships.elderly_id = appointments.elderly_id AND family_memberships.family_user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM caretaker_assignments WHERE caretaker_assignments.elderly_id = appointments.elderly_id AND caretaker_assignments.caretaker_id = auth.uid())
);
