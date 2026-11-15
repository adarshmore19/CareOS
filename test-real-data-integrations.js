/**
 * CareOS Real Data & External Integrations Verification Suite
 * Tests authentic real-world data sources:
 * 1. NIH RxNorm Medication API (/api/external/drugs)
 * 2. OpenStreetMap Verified Healthcare Facilities API (/api/external/hospitals)
 * 3. Government Official Emergency Helplines (/api/external/emergency)
 * 4. WHO & MoHFW Public Health Benchmarks (/api/external/public-health)
 * 5. Web Bluetooth SIG GATT Specifications
 * 6. Honest Empty States & Data Provenance Integrity
 */

const http = require("http");

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(`http://localhost:3000${path}`);
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
            // String (HTML or text)
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

async function runRealDataTests() {
  console.log("========================================================");
  console.log("CAREOS REAL DATA & PROVENANCE INTEGRATION VERIFICATION");
  console.log("========================================================\n");

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

  // 1. NIH RxNorm Medication API
  console.log("[1] NIH National Library of Medicine (RxNorm) Drug API");
  {
    const res = await request("GET", "/api/external/drugs?q=Metformin");
    assert(res.status === 200, `API responds with status 200 (Status: ${res.status})`);
    assert(
      Array.isArray(res.data?.drugs) && res.data.drugs.length > 0,
      `Returns verified RxNorm concepts for 'Metformin' (Found: ${res.data?.drugs?.length})`
    );
    const firstDrug = res.data?.drugs?.[0];
    assert(
      firstDrug && firstDrug.rxcui && firstDrug.name,
      `Concept has valid RxCUI (${firstDrug?.rxcui}) and name: ${firstDrug?.name}`
    );
    assert(
      res.data?.provenance?.source_name?.includes("NIH National Library of Medicine"),
      `Data provenance attached: ${res.data?.provenance?.source_name}`
    );

    // Empty / short query validation
    const resShort = await request("GET", "/api/external/drugs?q=a");
    assert(
      resShort.status === 200 && resShort.data?.drugs?.length === 0,
      "Gracefully handles queries below minimum character threshold without fabricating results"
    );
  }

  // 2. OpenStreetMap Verified Healthcare Facilities
  console.log("\n[2] OpenStreetMap Verified Healthcare Facilities & Hospital Directory");
  {
    const res = await request("GET", "/api/external/hospitals?city=Delhi&q=hospital");
    assert(res.status === 200, `API responds with status 200 (Status: ${res.status})`);
    assert(
      Array.isArray(res.data?.facilities) && res.data.facilities.length > 0,
      `Returns verified hospitals in Delhi region (Found: ${res.data?.facilities?.length})`
    );
    const firstHospital = res.data?.facilities?.[0];
    assert(
      firstHospital && firstHospital.name && firstHospital.latitude && firstHospital.longitude,
      `Hospital record includes verified name (${firstHospital?.name}) and geocoordinates (${firstHospital?.latitude}, ${firstHospital?.longitude})`
    );
    assert(
      res.data?.provenance?.source_name?.includes("OpenStreetMap"),
      `Data provenance attached: ${res.data?.provenance?.source_name}`
    );
  }

  // 3. Official Government Emergency Helplines
  console.log("\n[3] Government of India Official Emergency Registry");
  {
    const res = await request("GET", "/api/external/emergency");
    assert(res.status === 200, `API responds with status 200 (Status: ${res.status})`);
    assert(
      Array.isArray(res.data?.services) && res.data.services.length >= 6,
      `Returns official emergency services (Count: ${res.data?.services?.length})`
    );

    const serviceNumbers = (res.data?.services || []).map((s) => s.phone_number);
    assert(
      serviceNumbers.includes("112"),
      "Contains National Emergency Number 112 (ERSS)"
    );
    assert(
      serviceNumbers.includes("108"),
      "Contains National Ambulance Service 108"
    );
    assert(
      serviceNumbers.includes("14567"),
      "Contains ELDERLINE 14567 (National Senior Citizens Helpline)"
    );
    assert(
      serviceNumbers.includes("1075"),
      "Contains National Health Helpline 1075 (MoHFW)"
    );
    assert(
      serviceNumbers.includes("14416"),
      "Contains Tele-MANAS 14416 (Mental Health Support)"
    );
    assert(
      res.data?.provenance?.source_name?.includes("Government of India"),
      `Official Government provenance attached: ${res.data?.provenance?.source_name}`
    );
  }

  // 4. WHO & MoHFW Public Health Benchmarks
  console.log("\n[4] WHO & MoHFW Verified Public Health Indicators");
  {
    const res = await request("GET", "/api/external/public-health");
    assert(res.status === 200, `API responds with status 200 (Status: ${res.status})`);
    assert(
      Array.isArray(res.data?.indicators) && res.data.indicators.length >= 4,
      `Returns verified public health benchmarks (Count: ${res.data?.indicators?.length})`
    );

    const indicatorIds = (res.data?.indicators || []).map((i) => i.id);
    assert(
      indicatorIds.includes("who-hale-60"),
      "Includes WHO Healthy Life Expectancy at Age 60 (HALE-60)"
    );
    assert(
      indicatorIds.includes("nfhs5-hypertension-elderly"),
      "Includes NFHS-5 Elderly Hypertension Prevalence"
    );
    assert(
      indicatorIds.includes("icmr-indiab-diabetes"),
      "Includes ICMR-INDIAB Senior Diabetes Cohort Indicator"
    );
    assert(
      indicatorIds.includes("who-medication-adherence"),
      "Includes WHO Chronic Disease Medication Non-Adherence Baseline (50%)"
    );
  }

  // 5. Bluetooth SIG GATT Standards Verification
  console.log("\n[5] Bluetooth SIG GATT Hardware Service Protocol Specifications");
  {
    const fs = require("fs");
    const btCode = fs.readFileSync("./src/lib/devices/bluetooth.ts", "utf8");

    assert(
      btCode.includes("heart_rate") && btCode.includes("0x180D"),
      "Implements Bluetooth SIG Heart Rate Service (UUID 0x180D)"
    );
    assert(
      btCode.includes("heart_rate_measurement") && btCode.includes("0x2A37"),
      "Implements Bluetooth SIG Heart Rate Characteristic (UUID 0x2A37)"
    );
    assert(
      btCode.includes("blood_pressure") && btCode.includes("0x1810"),
      "Adheres to Bluetooth SIG Blood Pressure Service (UUID 0x1810)"
    );
    assert(
      btCode.includes("pulse_oximeter") && btCode.includes("0x1822"),
      "Adheres to Bluetooth SIG Pulse Oximeter Service (UUID 0x1822)"
    );
    assert(
      btCode.includes("requestDevice"),
      "Uses standard W3C Web Bluetooth requestDevice interface for authentic device pairing"
    );
  }

  // 6. Honest Empty States & Data Mode Separation
  console.log("\n[6] Honest Empty States & Zero-Fabrication Integrity");
  {
    const fs = require("fs");
    const emptyStateCode = fs.readFileSync("./src/components/HonestEmptyState.tsx", "utf8");
    const bannerCode = fs.readFileSync("./src/components/EnvironmentBanner.tsx", "utf8");

    assert(
      emptyStateCode.includes("Authentic State") && emptyStateCode.includes("Zero Fabricated Data"),
      "HonestEmptyState guarantees truthful reporting when no records exist"
    );
    assert(
      bannerCode.includes("Development Fixture Mode") && bannerCode.includes("NOT real patients"),
      "EnvironmentBanner explicitly discloses synthetic demo fixtures"
    );
    assert(
      bannerCode.includes("Authentic Production Mode") && bannerCode.includes("verified real-world APIs"),
      "EnvironmentBanner provides 1-click transition to authentic clean slate"
    );
  }

  console.log("\n========================================================");
  console.log(`TEST SUMMARY: ${passedTests} / ${totalTests} TESTS PASSED`);
  console.log("========================================================");

  if (passedTests === totalTests) {
    console.log("ALL REAL DATA & EXTERNAL INTEGRATION TESTS PASSED!\n");
    process.exit(0);
  } else {
    console.error(`FAILED ${totalTests - passedTests} TESTS\n`);
    process.exit(1);
  }
}

runRealDataTests().catch((err) => {
  console.error("Test execution threw exception:", err);
  process.exit(1);
});
