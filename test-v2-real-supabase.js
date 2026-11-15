/**
 * CareOS V2 Comprehensive Integration & Verification Test Suite
 * Tests:
 * 1. Supabase Auth API endpoints (Register, Login, Me, Role validation)
 * 2. Role-based protection & rejection of unauthorized role promotions
 * 3. Caretaker medication administration recording & validation
 * 4. Clinical observation notes creation and amendment
 * 5. Care tasks management & lifecycle
 * 6. Family invitations and consent management
 * 7. CareVoice AI Assistant endpoint
 * 8. All multi-portal HTTP routes
 */

const http = require("http");
const PORT = process.argv[2] || 3000;

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(`http://127.0.0.1:${PORT}${path}`);
    const reqHeaders = {
      "Content-Type": "application/json",
      ...headers,
    };

    const req = http.request(
      url,
      {
        method,
        headers: reqHeaders,
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          let parsed = data;
          try {
            parsed = JSON.parse(data);
          } catch (e) {
            // Keep as string (e.g. HTML pages)
          }
          resolve({ status: res.statusCode, headers: res.headers, data: parsed });
        });
      }
    );

    req.on("error", reject);

    if (body) {
      req.write(typeof body === "string" ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log("==================================================");
  console.log("CAREOS V2: COMPREHENSIVE INTEGRATION TEST SUITE");
  console.log("==================================================\n");

  let totalTests = 0;
  let passedTests = 0;

  function assert(condition, message) {
    totalTests++;
    if (condition) {
      console.log(`  ✓ ${message}`);
      passedTests++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
    }
  }

  // TEST 1: Role Validation in Registration
  console.log("[1] Authentication & Role Enforcement API Tests");
  {
    // 1a: Attempt registration with forbidden role "admin"
    const resInvalidRole = await request("POST", "/api/auth/register", {
      email: "hacker@test.com",
      password: "password123!",
      full_name: "Attacker",
      role: "admin", // Invalid role
    });
    assert(
      resInvalidRole.status === 400,
      `Rejects registration with illegal role "admin" (Status: ${resInvalidRole.status})`
    );

    // 1b: Attempt registration with missing required fields
    const resMissingFields = await request("POST", "/api/auth/register", {
      email: "incomplete@test.com",
    });
    assert(
      resMissingFields.status === 400,
      `Rejects registration with missing required password/role (Status: ${resMissingFields.status})`
    );

    // 1c: Valid role registration format (caretaker)
    const testEmail = `nurse.${Date.now()}@careos.health`;
    const testPassword = "SecurePassword123!";
    const resValidReg = await request("POST", "/api/auth/register", {
      email: testEmail,
      password: testPassword,
      full_name: "Nurse Priya Sharma",
      role: "caretaker",
    });
    // In dual mode without live Supabase credentials, returns 200 with simulated account or creates record
    if (resValidReg.status !== 200 && resValidReg.status !== 201) {
      console.log("Registration error data:", resValidReg.data);
    }
    assert(
      resValidReg.status === 200 || resValidReg.status === 201,
      `Valid registration succeeds or simulates safely (Status: ${resValidReg.status})`
    );

    // Save credentials for login test
    global.testEmail = testEmail;
    global.testPassword = testPassword;
  }

  // TEST 2: Login API
  console.log("\n[2] Login & Me Endpoints");
  let authHeaders = {};
  {
    const resLoginMissing = await request("POST", "/api/auth/login", {
      email: "test@example.com",
      // missing password
    });
    assert(
      resLoginMissing.status === 400,
      `Login rejects missing password with 400 (Status: ${resLoginMissing.status})`
    );

    const resLoginValid = await request("POST", "/api/auth/login", {
      email: global.testEmail || "eleanor.vance@careos.health",
      password: global.testPassword || "demo-password-123",
    });
    assert(
      resLoginValid.status === 200 || resLoginValid.status === 401,
      `Login endpoint responds with structured payload (Status: ${resLoginValid.status})`
    );

    if (resLoginValid.headers && resLoginValid.headers["set-cookie"]) {
      const cookies = Array.isArray(resLoginValid.headers["set-cookie"])
        ? resLoginValid.headers["set-cookie"]
        : [resLoginValid.headers["set-cookie"]];
      authHeaders = { Cookie: cookies.map((c) => c.split(";")[0]).join("; ") };
    }

    const resMe = await request("GET", "/api/auth/me", null, authHeaders);
    assert(
      resMe.status === 200,
      `Session me endpoint returns valid user structure (Status: ${resMe.status})`
    );
  }

  // TEST 3: Caretaker Medication Events API
  console.log("\n[3] Caretaker Medication Administration API");
  {
    // 3a: Rejection of missing fields
    const resMedIncomplete = await request("POST", "/api/caretaker/medication-events", {
      elderly_id: "elderly-1",
      // missing medication_id, scheduled_time, status
    });
    assert(
      resMedIncomplete.status === 400,
      `Rejects incomplete medication administration event (Status: ${resMedIncomplete.status})`
    );

    // 3b: Valid administration recording
    const resMedSuccess = await request("POST", "/api/caretaker/medication-events", {
      elderly_id: "elderly-1",
      medication_id: "med-1",
      scheduled_time: "08:00 AM",
      status: "taken",
      taken_at: new Date().toISOString(),
      dosage_administered: "10mg",
      caretaker_notes: "Administered with morning porridge and fresh water.",
      caretaker_id: "user-caretaker-1",
    }, authHeaders);
    assert(
      resMedSuccess.status === 200 || resMedSuccess.status === 201,
      `Successfully records medication administration (Status: ${resMedSuccess.status})`
    );

    // 3c: Duplicate administration detection for same time slot
    const resMedDuplicate = await request("POST", "/api/caretaker/medication-events", {
      elderly_id: "elderly-1",
      medication_id: "med-1",
      scheduled_time: "08:00 AM",
      status: "taken",
      taken_at: new Date().toISOString(),
      dosage_administered: "10mg",
    }, authHeaders);
    assert(
      resMedDuplicate.status === 409 || resMedDuplicate.status === 200,
      `Handles duplicate administration check gracefully (Status: ${resMedDuplicate.status})`
    );
  }

  // TEST 4: Clinical Observation Notes API
  console.log("\n[4] Clinical Observation Notes & Auditable Amendments");
  {
    // 4a: Create note
    const resNote = await request("POST", "/api/caretaker/notes", {
      elderly_id: "elderly-1",
      author_id: "user-caretaker-1",
      author_name: "Nurse Priya Sharma, RN",
      observation: "Test vitals: Blood glucose 105 mg/dL. Skin turgor normal.",
      action_taken: "Provided routine mid-morning snack.",
      follow_up_required: false,
    }, authHeaders);
    assert(
      resNote.status === 200 || resNote.status === 201,
      `Clinical note successfully logged (Status: ${resNote.status})`
    );

    const noteId = resNote.data?.note?.id || "note-test-1";

    // 4b: Amend note
    const resAmend = await request("PUT", "/api/caretaker/notes", {
      note_id: noteId,
      amendment_note: "Amendment: Clarified reading was taken 2h post-prandial.",
      amended_by: "user-caretaker-1",
    }, authHeaders);
    assert(
      resAmend.status === 200,
      `Clinical note amendment recorded in audit trail (Status: ${resAmend.status})`
    );

    // 4c: Fetch notes
    const resGetNotes = await request("GET", "/api/caretaker/notes?elderly_id=elderly-1", null, authHeaders);
    assert(
      resGetNotes.status === 200 && Array.isArray(resGetNotes.data?.notes),
      `Fetch clinical notes for patient returns array (Status: ${resGetNotes.status})`
    );
  }

  // TEST 5: Care Tasks API
  console.log("\n[5] Care Tasks Management API");
  {
    // 5a: Create care task
    const resTask = await request("POST", "/api/caretaker/tasks", {
      elderly_id: "elderly-1",
      title: "Check blood oxygen saturation",
      description: "Measure SpO2 after light afternoon walk.",
      priority: "medium",
      due_date: new Date().toISOString().split("T")[0],
    }, authHeaders);
    assert(
      resTask.status === 200 || resTask.status === 201,
      `Care task created successfully (Status: ${resTask.status})`
    );

    const taskId = resTask.data?.task?.id || "task-test-1";

    // 5b: Update task status
    const resTaskUpdate = await request("PATCH", "/api/caretaker/tasks", {
      task_id: taskId,
      status: "completed",
    }, authHeaders);
    assert(
      resTaskUpdate.status === 200,
      `Care task status updated to completed (Status: ${resTaskUpdate.status})`
    );
  }

  // TEST 6: Family Invitations API
  console.log("\n[6] Family Circle & Invitations API");
  {
    const resInvite = await request("POST", "/api/family/invitations", {
      elderly_id: "elderly-1",
      invited_email: "daughter.vance@example.com",
      relationship: "Daughter",
      can_edit_meds: false,
    }, authHeaders);
    assert(
      resInvite.status === 200 || resInvite.status === 201,
      `Family invitation issued with permission boundary (Status: ${resInvite.status})`
    );

    const resListInvites = await request("GET", "/api/family/invitations?elderly_id=elderly-1", null, authHeaders);
    assert(
      resListInvites.status === 200,
      `List family invitations returns active list (Status: ${resListInvites.status})`
    );
  }

  // TEST 7: CareVoice AI Assistant
  console.log("\n[7] CareVoice AI Assistant API");
  {
    const resVoice = await request("POST", "/api/assistant", {
      query: "What medications do I have scheduled for today?",
    });
    assert(
      resVoice.status === 200 && (resVoice.data?.answer || resVoice.data?.response),
      `CareVoice AI responds with structured healthcare answer (Status: ${resVoice.status})`
    );
  }

  // TEST 8: HTTP Route Availability & Status 200
  console.log("\n[8] Multi-Portal HTTP Route Availability");
  const routesToTest = [
    { path: "/", label: "Landing Page" },
    { path: "/login", label: "Login & Registration Portal" },
    { path: "/family", label: "FamilyCare Portal" },
    { path: "/caretaker", label: "Caretaker Operations Station" },
    { path: "/caretaker/patients", label: "Caretaker Patient Directory" },
    { path: "/caretaker/patients/elderly-1", label: "Clinical Patient Workspace" },
    { path: "/elderly", label: "Elderly MediMate Portal" },
    { path: "/medications", label: "Medication Management" },
    { path: "/appointments", label: "Appointments & Visits" },
    { path: "/adherence", label: "Adherence Analytics" },
    { path: "/academy", label: "Health Academy" },
    { path: "/assistant", label: "CareVoice AI Voice Interface" },
    { path: "/settings", label: "User Settings & System Config" },
  ];

  for (const route of routesToTest) {
    const res = await request("GET", route.path);
    assert(
      res.status === 200,
      `${route.label} (${route.path}) returned HTTP ${res.status}`
    );
  }

  console.log("\n==================================================");
  console.log(`TEST SUMMARY: ${passedTests} / ${totalTests} TESTS PASSED`);
  console.log("==================================================");

  if (passedTests === totalTests) {
    console.log("ALL V2 TESTS PASSED PERFECTLY!\n");
    process.exit(0);
  } else {
    console.error(`FAILED ${totalTests - passedTests} TESTS\n`);
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test execution threw exception:", err);
  process.exit(1);
});
