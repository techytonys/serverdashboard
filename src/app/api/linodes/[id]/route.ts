import { NextRequest, NextResponse } from "next/server";
import LinodeApiClient from "@/lib/linode-client";
import { updateTestServer } from "@/lib/test-storage";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log("=== API PUT START ===");
  console.log("URL:", request.url);
  console.log("Params:", params);

  try {
    // Validate params first
    if (!params?.id) {
      console.error("Missing ID parameter");
      return NextResponse.json(
        { success: false, message: "Server ID is required" },
        { status: 400 }
      );
    }

    const id = parseInt(params.id);
    console.log("Parsed ID:", id);

    if (isNaN(id) || id <= 0) {
      console.error("Invalid ID:", params.id);
      return NextResponse.json(
        { success: false, message: `Invalid server ID: ${params.id}` },
        { status: 400 }
      );
    }

    // Parse request body
    const contentType = request.headers.get("content-type");
    console.log("Content-Type:", contentType);

    let body;
    try {
      const bodyText = await request.text();
      console.log("Raw request body:", bodyText);
      body = JSON.parse(bodyText);
      console.log("Parsed body:", body);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return NextResponse.json(
        { success: false, message: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const { label } = body;
    console.log("Extracted label:", label);

    if (!label || typeof label !== "string" || !label.trim()) {
      console.error("Invalid label:", label);
      return NextResponse.json(
        {
          success: false,
          message: `Valid label is required. Received: ${label}`,
        },
        { status: 400 }
      );
    }

    console.log("About to call Linode API with:", { id, label: label.trim() });

    // Special handling for test servers (ID range 12345-12999)
    if (id >= 12345 && id <= 12999) {
      console.log("Handling test server update");
      const updatedServer = updateTestServer(id, { label: label.trim() });

      if (!updatedServer) {
        return NextResponse.json(
          { success: false, message: "Test server not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: updatedServer,
        message: "Test server label updated successfully",
      });
    }

    try {
      const client = new LinodeApiClient();

      // Try the update directly - skip the existence check for now
      console.log("Calling updateLinode with:", { id, label: label.trim() });

      const updatedLinode = await client.updateLinode(id, {
        label: label.trim(),
      });

      console.log("Linode API call successful:", updatedLinode);
      return NextResponse.json({
        success: true,
        data: updatedLinode,
        message: "Server label updated successfully",
      });
    } catch (linodeError) {
      console.error("Linode API Error Details:", linodeError);

      // Check if it's a permissions error
      if (linodeError instanceof Error) {
        if (
          linodeError.message.includes("403") ||
          linodeError.message.includes("Forbidden")
        ) {
          return NextResponse.json(
            {
              success: false,
              message:
                "Your API token doesn't have permission to modify servers. Please create a new token with 'Read/Write' permissions in your Linode account.",
            },
            { status: 403 }
          );
        }
      }

      return NextResponse.json(
        {
          success: false,
          message: `Failed to update server: ${
            linodeError instanceof Error ? linodeError.message : "Unknown error"
          }`,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error message:", errorMessage);

    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}

// Test endpoint to verify route parameter parsing
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  console.log("API GET - Route called for testing");
  console.log("API GET - Context:", context);

  const { params } = context;
  const id = parseInt(params?.id || "0");

  return NextResponse.json({
    success: true,
    message: "Route test successful",
    receivedId: params?.id,
    parsedId: id,
    isValidId: !isNaN(id) && id > 0,
  });
}
