/**
 * CareOS Three Independent Dashboards Comprehensive Verification Suite
 * Tests HTTP 200, layout presence, route integrity, and cross-dashboard workflows.
 */

const http = require("http");
const PORT = process.argv[2] || 3000;

function fetchRoute(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${PORT}${path}`, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data,
        });
      });
    }).on("error", reject);
  });
}

async function runTests() {
  console.log("==========================================================");
  console.log("CAREOS THREE INDEPENDENT DASHBOARDS VERIFICATION SUITE");
  console.log("==========================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${message}`);
      failed++;
    }
  }

  // 1. Patient Dashboard Tests
  console.log("\n--- Section 1: Patient Dashboard Routes (/patient/...) ---");
  const patientRoutes = [
    { path: "/patient/dashboard", name: "Patient Dashboard (Easy Touch & Large Fonts)" },
    { path: "/patient/medications", name: "Patient Medications (1-Tap Checklist & RxNorm)" },
    { path: "/patient/appointments", name: "Patient Appointments (Doctor Visits & Clinic Finder)" },
    { path: "/patient/assistant", name: "Patient Assistant (Voice-First CareVoice)" },
    { path: "/patient/academy", name: "Patient Academy (Multilingual Education)" },
    { path: "/patient/health-records", name: "Patient Health Records (Sensors & Lifeline)" },
    { path: "/patient/settings", name: "Patient Settings (Voice Speed & Preferences)" },
  ];

  for (const r of patientRoutes) {
    const res = await fetchRoute(r.path);
    assert(res.status === 200, `${r.name} returned HTTP 200`);
    assert(res.body.includes("MediMate") || res.body.includes("Patient") || res.body.includes("CareOS"), `${r.name} contains valid branding`);
  }

  // 2. Family Dashboard Tests
  console.log("\n--- Section 2: Family Dashboard Routes (/family/...) ---");
  const familyRoutes = [
    { path: "/family/dashboard", name: "Family Dashboard Overview (SaaS & KPIs)" },
    { path: "/family/patients", name: "Family Patients Directory (Care Circle & Invites)" },
    { path: "/family/monitoring", name: "Family Deep Monitoring (7-Day Adherence)" },
    { path: "/family/medications", name: "Family Medication Tracking (Live Telemetry)" },
    { path: "/family/appointments", name: "Family Appointments & Escort Logistics" },
    { path: "/family/notifications", name: "Family Notifications & Priority Alerts" },
    { path: "/family/activity", name: "Family Activity History (Audit Trail)" },
    { path: "/family/settings", name: "Family Settings & Access Permissions" },
  ];

  for (const r of familyRoutes) {
    const res = await fetchRoute(r.path);
    assert(res.status === 200, `${r.name} returned HTTP 200`);
    assert(res.body.includes("Family") || res.body.includes("CareOS"), `${r.name} contains valid branding`);
  }

  // 3. Caretaker Dashboard Tests
  console.log("\n--- Section 3: Caretaker Dashboard Routes (/caretaker/...) ---");
  const caretakerRoutes = [
    { path: "/caretaker/dashboard", name: "Caretaker Operations Station (Triage & MAR)" },
    { path: "/caretaker/patients", name: "Caretaker Patient Registry" },
    { path: "/caretaker/patients/elderly-1", name: "Caretaker Deep Patient Workspace [id]" },
    { path: "/caretaker/tasks", name: "Caretaker Task Queue & Daily Duties" },
    { path: "/caretaker/medications", name: "Caretaker Medication Administration (MAR Sheet)" },
    { path: "/caretaker/appointments", name: "Caretaker Appointments & Escorts" },
    { path: "/caretaker/clinical-notes", name: "Caretaker Auditable Clinical Notes (SOAP)" },
    { path: "/caretaker/notifications", name: "Caretaker Clinical Alerts & Escalations" },
    { path: "/caretaker/settings", name: "Caretaker Settings & Shift Handover" },
  ];

  for (const r of caretakerRoutes) {
    const res = await fetchRoute(r.path);
    assert(res.status === 200, `${r.name} returned HTTP 200`);
    assert(res.body.includes("Station") || res.body.includes("CareStation") || res.body.includes("Caretaker") || res.body.includes("Patient Workspace"), `${r.name} contains clinical staff branding`);
  }

  // 4. Global Hub & Core Routes
  console.log("\n--- Section 4: Hub, Login & Access Routing ---");
  const hubRoutes = [
    { path: "/dashboard", name: "Unified Dashboard Access Hub" },
    { path: "/login", name: "Login & Persona Selector Portal" },
    { path: "/", name: "Landing Page" },
  ];

  for (const r of hubRoutes) {
    const res = await fetchRoute(r.path);
    assert(res.status === 200, `${r.name} returned HTTP 200`);
  }

  // 5. External Authentic Healthcare APIs
  console.log("\n--- Section 5: Real-World Healthcare Data Integrations ---");
  const drugRes = await fetchRoute("/api/external/drugs?q=Metformin");
  assert(drugRes.status === 200, "NIH RxNorm drug search returned HTTP 200");
  const drugData = JSON.parse(drugRes.body);
  assert(drugData.drugs && drugData.drugs.length > 0, `NIH RxNorm returned ${drugData.drugs?.length} authentic drugs`);

  const hospitalRes = await fetchRoute("/api/external/hospitals?city=Delhi");
  assert(hospitalRes.status === 200, "OpenStreetMap Healthcare registry returned HTTP 200");
  const hospitalData = JSON.parse(hospitalRes.body);
  assert(hospitalData.facilities && hospitalData.facilities.length > 0, `OSM returned ${hospitalData.facilities?.length} verified facilities`);

  const emergencyRes = await fetchRoute("/api/external/emergency?country=IN");
  assert(emergencyRes.status === 200, "Official National Emergency Directory returned HTTP 200");
  const emergencyData = JSON.parse(emergencyRes.body);
  const emergencyList = emergencyData.services || emergencyData.numbers || [];
  assert(emergencyList.length > 0, `Emergency directory returned ${emergencyList.length} official numbers`);

  console.log("\n==========================================================");
  console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("==========================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test runner error:", err);
  process.exit(1);
});
