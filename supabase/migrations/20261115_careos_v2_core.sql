-- ====================================================================
-- CAREOS V2: COMPREHENSIVE MULTI-USER HEALTHCARE SCHEMA & RLS POLICIES
-- ====================================================================

-- 1. Ensure required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. New tables for V2

-- A. CLINICAL OBSERVATION NOTES (Auditable, immutable with amendment tracking)
CREATE TABLE IF NOT EXISTS clinical_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    elderly_id UUID NOT NULL REFERENCES elderly_profiles(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    observation TEXT NOT NULL,
    action_taken TEXT,
    follow_up_required BOOLEAN NOT NULL DEFAULT FALSE,
    follow_up_date DATE,
    related_appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    related_task_id UUID REFERENCES care_tasks(id) ON DELETE SET NULL,
    is_amended BOOLEAN NOT NULL DEFAULT FALSE,
    amendment_note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    amended_at TIMESTAMPTZ
);

-- B. PATIENT CONSENTS (HIPAA/GDPR explicit access permissions)
CREATE TABLE IF NOT EXISTS patient_consents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    elderly_id UUID NOT NULL REFERENCES elderly_profiles(id) ON DELETE CASCADE,
    granted_to UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    consent_type TEXT NOT NULL, -- 'medical_records', 'medication_administration', 'appointment_coordination', 'emergency_access'
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    revoked_at TIMESTAMPTZ,
    UNIQUE(elderly_id, granted_to, consent_type)
);

-- C. NOTIFICATION PREFERENCES
CREATE TABLE IF NOT EXISTS notification_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
    in_app_adherence BOOLEAN NOT NULL DEFAULT TRUE,
    in_app_appointments BOOLEAN NOT NULL DEFAULT TRUE,
    in_app_tasks BOOLEAN NOT NULL DEFAULT TRUE,
    email_alerts BOOLEAN NOT NULL DEFAULT FALSE,
    sms_alerts BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- D. FAMILY INVITATIONS
CREATE TABLE IF NOT EXISTS family_invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    elderly_id UUID NOT NULL REFERENCES elderly_profiles(id) ON DELETE CASCADE,
    invited_email TEXT NOT NULL,
    invited_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    relationship TEXT NOT NULL,
    can_edit_meds BOOLEAN NOT NULL DEFAULT FALSE,
    token TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'revoked')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days')
);

-- 3. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_clinical_notes_patient ON clinical_notes(elderly_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_patient_consents ON patient_consents(elderly_id, granted_to, is_active);
CREATE INDEX IF NOT EXISTS idx_family_invitations_token ON family_invitations(token);
CREATE INDEX IF NOT EXISTS idx_family_invitations_elderly ON family_invitations(elderly_id, status);

-- 4. ENABLE RLS ON ALL NEW TABLES
ALTER TABLE clinical_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_invitations ENABLE ROW LEVEL SECURITY;

-- 5. ADVANCED RLS POLICIES

-- CLINICAL NOTES POLICIES
-- Caretakers assigned can read notes
CREATE POLICY "Assigned caretakers can view clinical notes" ON clinical_notes FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM caretaker_assignments 
        WHERE caretaker_assignments.elderly_id = clinical_notes.elderly_id 
          AND caretaker_assignments.caretaker_id = auth.uid()
    ) OR
    EXISTS (
        SELECT 1 FROM family_memberships 
        WHERE family_memberships.elderly_id = clinical_notes.elderly_id 
          AND family_memberships.family_user_id = auth.uid()
    ) OR
    auth.uid() = elderly_id
);

-- Only assigned caretakers can insert clinical notes
CREATE POLICY "Assigned caretakers can create clinical notes" ON clinical_notes FOR INSERT
WITH CHECK (
    auth.uid() = author_id AND
    EXISTS (
        SELECT 1 FROM caretaker_assignments 
        WHERE caretaker_assignments.elderly_id = clinical_notes.elderly_id 
          AND caretaker_assignments.caretaker_id = auth.uid()
    )
);

-- Clinical notes are immutable (no DELETE)
-- Amendments can be added by the original author
CREATE POLICY "Original author can amend clinical note" ON clinical_notes FOR UPDATE
USING (auth.uid() = author_id)
WITH CHECK (auth.uid() = author_id);

-- PATIENT CONSENTS POLICIES
CREATE POLICY "Elderly user manages their consents" ON patient_consents FOR ALL
USING (auth.uid() = elderly_id)
WITH CHECK (auth.uid() = elderly_id);

CREATE POLICY "Granted users can view their consents" ON patient_consents FOR SELECT
USING (auth.uid() = granted_to);

-- NOTIFICATION PREFERENCES POLICIES
CREATE POLICY "Users manage their own notification preferences" ON notification_preferences FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- FAMILY INVITATIONS POLICIES
CREATE POLICY "Elderly and authorized family can view invitations" ON family_invitations FOR SELECT
USING (
    auth.uid() = elderly_id OR
    auth.uid() = invited_by OR
    EXISTS (
        SELECT 1 FROM family_memberships 
        WHERE family_memberships.elderly_id = family_invitations.elderly_id 
          AND family_memberships.family_user_id = auth.uid()
    )
);

CREATE POLICY "Elderly and family can create invitations" ON family_invitations FOR INSERT
WITH CHECK (
    auth.uid() = invited_by AND (
        auth.uid() = elderly_id OR
        EXISTS (
            SELECT 1 FROM family_memberships 
            WHERE family_memberships.elderly_id = family_invitations.elderly_id 
              AND family_memberships.family_user_id = auth.uid()
        )
    )
);

-- 6. MEDICATION EVENTS POLICIES (Enforce non-duplicate, role-verified recording)
CREATE POLICY "Elderly can record own medication intake" ON medication_events FOR INSERT
WITH CHECK (
    auth.uid() = elderly_id AND confirmed_by = auth.uid()
);

CREATE POLICY "Assigned caretakers can record patient medication events" ON medication_events FOR INSERT
WITH CHECK (
    confirmed_by = auth.uid() AND
    EXISTS (
        SELECT 1 FROM caretaker_assignments 
        WHERE caretaker_assignments.elderly_id = medication_events.elderly_id 
          AND caretaker_assignments.caretaker_id = auth.uid()
    )
);

CREATE POLICY "Authorized family with permission can record medication events" ON medication_events FOR INSERT
WITH CHECK (
    confirmed_by = auth.uid() AND
    EXISTS (
        SELECT 1 FROM family_memberships 
        WHERE family_memberships.elderly_id = medication_events.elderly_id 
          AND family_memberships.family_user_id = auth.uid()
          AND family_memberships.can_edit_meds = TRUE
    )
);

-- 7. PREVENT USER ROLE SELF-PROMOTION
-- A trigger to ensure users cannot update their own role column
CREATE OR REPLACE FUNCTION prevent_role_self_promotion()
RETURNS TRIGGER AS $$
BEGIN
    IF (OLD.role IS DISTINCT FROM NEW.role) AND (current_user != 'service_role') THEN
        RAISE EXCEPTION 'Users cannot modify their own assigned security role.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_role_self_promotion ON profiles;
CREATE TRIGGER trg_prevent_role_self_promotion
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION prevent_role_self_promotion();

-- 8. REALTIME REPLICATION PUBLICATION
-- Enable Realtime for live cross-portal events
DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE medication_events;
    ALTER PUBLICATION supabase_realtime ADD TABLE appointments;
    ALTER PUBLICATION supabase_realtime ADD TABLE care_tasks;
    ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
    ALTER PUBLICATION supabase_realtime ADD TABLE activity_logs;
    ALTER PUBLICATION supabase_realtime ADD TABLE clinical_notes;
EXCEPTION
    WHEN duplicate_object THEN null;
    WHEN undefined_object THEN null;
END $$;

