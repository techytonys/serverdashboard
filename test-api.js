#!/usr/bin/env node

// Simple test script to verify Linode API integration
const axios = require("axios");

async function testLinodeAPI() {
  // Load environment variables
  require("dotenv").config({ path: ".env.local" });

  const token = process.env.LINODE_API_TOKEN;

  if (!token) {
    console.error("❌ LINODE_API_TOKEN not found in .env.local");
    console.log("Please set your Linode API token in .env.local file");
    process.exit(1);
  }

  console.log("🔍 Testing Linode API connection...");

  try {
    const response = await axios.get("https://api.linode.com/v4/account", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      console.log("✅ Successfully connected to Linode API!");
      console.log(`📧 Account Email: ${response.data.email}`);
      console.log(`💰 Account Balance: $${response.data.balance}`);
      console.log(`📅 Active Since: ${response.data.active_since}`);

      // Test fetching Linodes
      const linodesResponse = await axios.get(
        "https://api.linode.com/v4/linode/instances",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(
        `🖥️  Found ${linodesResponse.data.results} Linode instance(s)`
      );

      if (linodesResponse.data.data.length > 0) {
        console.log("📋 Your Linode instances:");
        linodesResponse.data.data.forEach((linode, index) => {
          console.log(
            `   ${index + 1}. ${linode.label} (${linode.status}) - ${
              linode.region
            }`
          );
        });
      }
    } else {
      console.error("❌ Unexpected response from Linode API:", response.status);
    }
  } catch (error) {
    if (error.response?.status === 401) {
      console.error("❌ Authentication failed - Invalid API token");
      console.log("Please check your LINODE_API_TOKEN in .env.local");
    } else if (error.response?.status === 429) {
      console.error("❌ Rate limit exceeded - Too many requests");
    } else {
      console.error("❌ API connection failed:", error.message);
    }
    process.exit(1);
  }
}

testLinodeAPI();
