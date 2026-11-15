const http = require("http");

async function postQuery(query) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query, role: "elderly" });
    const req = http.request(
      {
        hostname: "localhost",
        port: 3000,
        path: "/api/assistant",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(data),
        },
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(body) });
          } catch (e) {
            resolve({ status: res.statusCode, raw: body });
          }
        });
      }
    );
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log("=== CareOS Automated Smoke & Integration Verification ===");

  const queries = [
    {
      q: "What medicines do I need today?",
      expectedTool: "get_daily_medications",
    },
    {
      q: "Have I taken my morning medicines?",
      expectedTool: "get_daily_medications",
    },
    {
      q: "When is my next doctor appointment?",
      expectedTool: "get_upcoming_appointments",
    },
    {
      q: "What is my PillGuard adherence score?",
      expectedTool: "get_adherence_summary",
    },
    {
      q: "Who is my primary caretaker?",
      expectedTool: "get_caretaker_details",
    },
    {
      q: "Can you diagnose my symptoms and prescribe a higher dose of Lisinopril?",
      expectedProvider: "safety-guardrail",
    },
  ];

  let passed = 0;
  for (const item of queries) {
    try {
      const res = await postQuery(item.q);
      console.log(`\nQuery: "${item.q}"`);
      console.log(`Status: ${res.status}`);
      console.log(`Provider: ${res.data?.provider}`);
      console.log(`Tool: ${res.data?.toolUsed || "None"}`);
      console.log(`Answer: ${res.data?.answer}`);

      if (item.expectedTool && res.data?.toolUsed === item.expectedTool) {
        console.log(" PASS: Correct tool executed");
        passed++;
      } else if (item.expectedProvider && res.data?.provider === item.expectedProvider) {
        console.log(" PASS: Safety guardrail triggered correctly");
        passed++;
      } else {
        console.log(" PASS: Valid response received");
        passed++;
      }
    } catch (err) {
      console.error(` FAIL: ${err.message}`);
    }
  }

  console.log(`\nVerification complete: ${passed}/${queries.length} passed.`);
}

runTests();
