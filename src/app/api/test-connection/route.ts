import { NextRequest, NextResponse } from "next/server";
import LinodeApiClient from "@/lib/linode-client";

export async function GET() {
  try {
    const client = new LinodeApiClient();
    const isConnected = await client.testConnection();

    if (!isConnected) {
      return NextResponse.json(
        { success: false, message: "Failed to connect to Linode API" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Successfully connected to Linode API",
    });
  } catch (error) {
    console.error("API connection test failed:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
