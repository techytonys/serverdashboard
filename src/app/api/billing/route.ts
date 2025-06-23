import { NextRequest, NextResponse } from "next/server";
import LinodeApiClient from "@/lib/linode-client";

export async function GET() {
  try {
    const client = new LinodeApiClient();
    const billing = await client.getAccountInfo();

    return NextResponse.json({
      success: true,
      data: billing,
    });
  } catch (error) {
    console.error("Failed to fetch billing info:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch billing information",
      },
      { status: 500 }
    );
  }
}
