-- ====================================================================
-- CAREOS V2: REAL DATA PROVENANCE, HARDWARE DEVICE & VERIFIED DIRECTORIES
-- ====================================================================

-- 1. DATA PROVENANCE REGISTRY
CREATE TABLE IF NOT EXISTS data_provenance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    record_type TEXT NOT NULL, -- 'medication', 'appointment', 'facility', 'device_reading', 'clinical_note', 'emergency_contact'
    record_id TEXT NOT NULL,
    source_name TEXT NOT NULL,
    source_url TEXT NOT NULL,
    source_type TEXT NOT NULL CHECK (source_type IN ('government_portal', 'clinical_api', 'verified_registry', 'patient_input', 'device_measured')),
    fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    published_at TIMESTAMPTZ,
    last_verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    data_version TEXT,
    license TEXT,
    verification_status TEXT NOT NULL DEFAULT 'verified' CHECK (verification_status IN ('verified', 'patient_submitted', 'device_measured', 'unverified'))
);

CREATE INDEX IF NOT EXISTS idx_provenance_record ON data_provenance(record_type, record_id);
CREATE INDEX IF NOT EXISTS idx_provenance_source ON data_provenance(source_name, verification_status);

-- 2. AUTHENTIC HARDWARE HEALTH DEVICE READINGS (Web Bluetooth GATT standard)
CREATE TABLE IF NOT EXISTS device_readings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    elderly_id UUID NOT NULL REFERENCES elderly_profiles(id) ON DELETE CASCADE,
    device_name TEXT NOT NULL,
    device_id TEXT,
    metric_type TEXT NOT NULL CHECK (metric_type IN ('heart_rate', 'blood_pressure_systolic', 'blood_pressure_diastolic', 'oxygen_saturation')),
    value NUMERIC NOT NULL,
    unit TEXT NOT NULL, -- 'bpm', 'mmHg', '%'
    measured_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    provenance_id UUID REFERENCES data_provenance(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_device_readings_patient_metric ON device_readings(elderly_id, metric_type, measured_at DESC);

-- 3. VERIFIED HEALTHCARE FACILITIES (Hospitals, Clinics, Centers)
CREATE TABLE IF NOT EXISTS verified_facilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    osm_id TEXT UNIQUE,
    name TEXT NOT NULL,
    facility_type TEXT NOT NULL CHECK (facility_type IN ('hospital', 'clinic', 'pharmacy', 'emergency_center')),
    address TEXT NOT NULL,
    city TEXT,
    state TEXT,
    country TEXT NOT NULL DEFAULT 'India',
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    emergency_services BOOLEAN NOT NULL DEFAULT FALSE,
    phone TEXT,
    website TEXT,
    last_verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_facilities_coords ON verified_facilities(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_facilities_city ON verified_facilities(city, emergency_services);

-- 4. OFFICIAL EMERGENCY SERVICES DIRECTORY
CREATE TABLE IF NOT EXISTS emergency_directory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    service_type TEXT NOT NULL CHECK (service_type IN ('national_emergency', 'ambulance', 'senior_helpline', 'health_helpline', 'mental_health')),
    phone_number TEXT NOT NULL,
    description TEXT NOT NULL,
    coverage_area TEXT NOT NULL,
    hours TEXT NOT NULL DEFAULT '24x7',
    is_toll_free BOOLEAN NOT NULL DEFAULT TRUE,
    official_authority TEXT NOT NULL,
    source_url TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed Official Emergency Directory with authentic, verified Government numbers
INSERT INTO emergency_directory (name, service_type, phone_number, description, coverage_area, hours, is_toll_free, official_authority, source_url)
VALUES
    ('National Emergency Number (ERSS)', 'national_emergency', '112', 'Single unified emergency response number for Police, Fire, and Ambulance across all States and Union Territories in India.', 'Pan-India', '24x7', true, 'Ministry of Home Affairs, Government of India', 'https://112.gov.in/'),
    ('National Ambulance Service', 'ambulance', '108', 'Emergency medical ambulance response with trained EMTs for critical health emergencies.', 'Pan-India (State Emergency Medical Transport)', '24x7', true, 'Ministry of Health and Family Welfare (MoHFW), Government of India', 'https://www.nhp.gov.in/emergency-medical-services_pg'),
    ('Janani Shishu Suraksha Karyakram (JSSK)', 'ambulance', '102', 'Free patient transport ambulance service for elderly, pediatric, and maternal urgent care.', 'Pan-India', '24x7', true, 'MoHFW, Government of India', 'https://www.nhp.gov.in/'),
    ('ELDERLINE - National Helpline for Senior Citizens', 'senior_helpline', '14567', 'Toll-free national eldercare helpline providing healthcare assistance, physical abuse rescue, and emotional support to senior citizens.', 'Pan-India', '8:00 AM - 8:00 PM (Daily)', true, 'Ministry of Social Justice and Empowerment, Government of India', 'https://elderline.dosje.gov.in/'),
    ('National Health Helpline', 'health_helpline', '1075', 'Official national public health consultation and medical emergency helpline.', 'Pan-India', '24x7', true, 'Ministry of Health and Family Welfare, Government of India', 'https://www.mohfw.gov.in/'),
    ('Tele-MANAS Mental Health Support', 'mental_health', '14416', 'Tele Mental Health Assistance and Networking Across States for senior emotional well-being and distress counseling.', 'Pan-India (Multilingual in 20+ Languages)', '24x7', true, 'MoHFW & NIMHANS, Government of India', 'https://telemanas.mohfw.gov.in/')
ON CONFLICT DO NOTHING;

-- 5. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE data_provenance ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE verified_facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_directory ENABLE ROW LEVEL SECURITY;

-- Provenance: Read-only for authenticated and public users
CREATE POLICY "Public read provenance" ON data_provenance FOR SELECT USING (true);

-- Facilities: Public read access
CREATE POLICY "Public read verified facilities" ON verified_facilities FOR SELECT USING (true);

-- Emergency directory: Public read access
CREATE POLICY "Public read emergency directory" ON emergency_directory FOR SELECT USING (true);

-- Device readings: Patient & authorized family/caretaker access
CREATE POLICY "Elderly view own device readings" ON device_readings
    FOR SELECT USING (elderly_id IN (SELECT id FROM elderly_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Elderly insert own device readings" ON device_readings
    FOR INSERT WITH CHECK (elderly_id IN (SELECT id FROM elderly_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Family view linked patient device readings" ON device_readings
    FOR SELECT USING (elderly_id IN (SELECT elderly_id FROM family_memberships WHERE family_user_id = auth.uid()));

CREATE POLICY "Caretaker view assigned patient device readings" ON device_readings
    FOR SELECT USING (elderly_id IN (SELECT elderly_id FROM caretaker_assignments WHERE caretaker_user_id = auth.uid()));

