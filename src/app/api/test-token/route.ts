import { NextResponse } from "next/server";
import LinodeApiClient from "@/lib/linode-client";

export async function GET() {
  try {
    console.log(
      "Environment token:",
      process.env.LINODE_API_TOKEN?.substring(0, 10) + "..."
    );
    const client = new LinodeApiClient();

    // Get account info to check token permissions
    const account = await client.getAccountInfo();
    console.log("Account info:", account);

    // Get first server and try to read it
    const servers = await client.getLinodes();
    if (servers.length > 0) {
      const firstServer = servers[0];
      console.log("First server:", firstServer);

      return NextResponse.json({
        success: true,
        message: "Token works for reading",
        account: account,
        firstServerId: firstServer.id,
        firstServerLabel: firstServer.label,
      });
    } else {
      return NextResponse.json({
        success: true,
        message: "Token works but no servers found",
        account: account,
      });
    }
  } catch (error) {
    console.error("Token test failed:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Token test failed",
      },
      { status: 500 }
    );
  }
}
