// Simple test script to verify the API endpoint works
const fetch = require("node-fetch");

async function testLabelUpdate() {
  try {
    // This would be the actual server ID you want to test with
    const serverId = 123456; // Replace with a real server ID
    const newLabel = "test-label-" + Date.now();

    const response = await fetch(
      `http://localhost:3000/api/linodes/${serverId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ label: newLabel }),
      }
    );

    const data = await response.json();
    console.log("Test result:", data);
  } catch (error) {
    console.error("Test failed:", error);
  }
}

// Uncomment to run the test
// testLabelUpdate();

console.log(
  "Debug test script ready. Start your dev server and check browser console."
);
