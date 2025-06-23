import { NextResponse } from "next/server";
import LinodeApiClient from "@/lib/linode-client";

export async function GET() {
  try {
    const client = new LinodeApiClient();
    const images = await client.getImages();

    return NextResponse.json({
      success: true,
      data: images,
    });
  } catch (error) {
    console.error("Failed to fetch images:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch images",
      },
      { status: 500 }
    );
  }
}
