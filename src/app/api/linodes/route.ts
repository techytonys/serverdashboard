import { NextRequest, NextResponse } from "next/server";
import LinodeApiClient from "@/lib/linode-client";
import { getTestServers } from "@/lib/test-storage";

export async function GET() {
  try {
    const client = new LinodeApiClient();

    // Try to get real servers first
    let linodes;
    try {
      linodes = await client.getLinodes();
    } catch (apiError) {
      console.log("API failed, using test servers:", apiError);
      // If API fails, return test servers from storage
      linodes = getTestServers();
    }

    return NextResponse.json({
      success: true,
      data: linodes,
    });
  } catch (error) {
    console.error("Failed to fetch Linode instances:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch instances",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const client = new LinodeApiClient();

    // Validate required fields
    const { type, region, image, label, root_pass } = body;
    if (!type || !region || !image || !label || !root_pass) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Missing required fields: type, region, image, label, root_pass",
        },
        { status: 400 }
      );
    }

    const newLinode = await client.createLinode(body);

    return NextResponse.json({
      success: true,
      data: newLinode,
      message: "Server created successfully",
    });
  } catch (error) {
    console.error("Failed to create Linode instance:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to create server",
      },
      { status: 500 }
    );
  }
}
