import { NextResponse } from "next/server";
import LinodeApiClient from "@/lib/linode-client";

export async function GET() {
  try {
    const client = new LinodeApiClient();
    const regions = await client.getRegions();

    return NextResponse.json({
      success: true,
      data: regions,
    });
  } catch (error) {
    console.error("Failed to fetch regions:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch regions",
      },
      { status: 500 }
    );
  }
}
