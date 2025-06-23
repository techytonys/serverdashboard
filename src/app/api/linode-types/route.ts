import { NextResponse } from "next/server";
import LinodeApiClient from "@/lib/linode-client";

export async function GET() {
  try {
    const client = new LinodeApiClient();
    const types = await client.getLinodeTypes();

    return NextResponse.json({
      success: true,
      data: types,
    });
  } catch (error) {
    console.error("Failed to fetch Linode types:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch server types",
      },
      { status: 500 }
    );
  }
}
