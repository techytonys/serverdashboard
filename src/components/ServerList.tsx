"use client";

import { useState, useEffect } from "react";
import { LinodeInstance, CreateLinodeRequest } from "@/types/linode";
import CreateServerModal from "./CreateServerModal";
import EditableLabel from "./EditableLabel";
import { formatRegionDisplay, getRegionTooltip } from "@/lib/region-flags";

export default function ServerList() {
  const [servers, setServers] = useState<LinodeInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    fetchServers();
  }, []);

  const fetchServers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/linodes");
      const data = await response.json();

      if (data.success) {
        setServers(data.data);
        setError(null);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to fetch servers");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateServer = async (config: CreateLinodeRequest) => {
    try {
      setCreating(true);
      const response = await fetch("/api/linodes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage(
          "Server created successfully! It may take a few minutes to provision."
        );
        setIsModalOpen(false);
        fetchServers(); // Refresh the server list
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to create server");
    } finally {
      setCreating(false);
    }
  };

  const handleLabelSave = async (
    serverId: number,
    newLabel: string
  ): Promise<boolean> => {
    try {
      console.log("Starting save operation:", {
        serverId,
        newLabel,
        serverIdType: typeof serverId,
        newLabelType: typeof newLabel,
      });

      // Validate inputs on the client side
      if (!serverId || typeof serverId !== "number" || serverId <= 0) {
        console.error("Invalid server ID:", serverId);
        setError("Invalid server ID");
        return false;
      }

      if (!newLabel || typeof newLabel !== "string" || !newLabel.trim()) {
        console.error("Invalid label:", newLabel);
        setError("Invalid label");
        return false;
      }

      const requestBody = { label: newLabel.trim() };
      console.log("Request body:", requestBody);

      const response = await fetch(`/api/linodes/${serverId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      // Get the response text first
      const responseText = await response.text();
      console.log("Raw response text:", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
        console.log("Parsed response data:", data);
      } catch (jsonError) {
        console.error("Failed to parse JSON response:", jsonError);
        console.error("Response was:", responseText);
        setError(`Server returned invalid response: ${responseText}`);
        return false;
      }

      if (response.ok && data && data.success) {
        // Update the server in the local state
        setServers((prevServers) =>
          prevServers.map((server) =>
            server.id === serverId ? { ...server, label: newLabel } : server
          )
        );
        console.log("Successfully updated local state");

        // Show success message to user
        setSuccessMessage(`Server "${newLabel}" updated successfully!`);
        setTimeout(() => setSuccessMessage(null), 3000); // Auto-hide after 3 seconds

        return true;
      } else {
        // Handle error responses properly
        const errorMessage =
          data?.message || `HTTP ${response.status}: ${response.statusText}`;
        console.error("API returned error:", errorMessage);
        setError(errorMessage);
        return false;
      }
    } catch (err) {
      console.error("Request failed with error:", err);
      setError("Failed to update server label");
      return false;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "running":
        return "status-badge status-running";
      case "offline":
        return "status-badge status-offline";
      case "provisioning":
        return "status-badge status-provisioning";
      case "booting":
        return "status-badge status-booting";
      case "rebooting":
        return "status-badge status-rebooting";
      case "rebuilding":
        return "status-badge status-rebuilding";
      default:
        return "status-badge";
    }
  };

  const renderStatusWithDot = (status: string) => {
    return (
      <span className={getStatusBadgeClass(status)}>
        <span className="status-dot"></span>
        {status}
      </span>
    );
  };

  const renderRegionWithFlag = (region: string) => {
    return (
      <span
        title={getRegionTooltip(region)}
        style={{ cursor: "help" }}
        className="region-display"
      >
        <span className="region-flag">
          {formatRegionDisplay(region).split(" ")[0]}
        </span>
        <span>{region}</span>
      </span>
    );
  };

  const copyToClipboard = async (text: string, serverId: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(serverId);
      setTimeout(() => setCopiedId(null), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopiedId(serverId);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const renderIpWithCopy = (ip: string, serverId: number) => {
    const ipAddress = ip || "N/A";
    const isCopied = copiedId === serverId;

    if (ipAddress === "N/A") {
      return <span>{ipAddress}</span>;
    }

    return (
      <div className="ip-address-container">
        <span>{ipAddress}</span>
        <button
          className={`copy-button ${isCopied ? "copied" : ""}`}
          onClick={() => copyToClipboard(ipAddress, serverId)}
          title={isCopied ? "Copied!" : "Copy IP address"}
          aria-label="Copy IP address to clipboard"
        >
          {isCopied ? "✓" : "📋"}
        </button>
      </div>
    );
  };

  // Billing rates per hour (based on Linode pricing)
  const getBillingRate = (serverType: string): number => {
    const rates: Record<string, number> = {
      "g6-nanode-1": 0.0075, // $0.0075/hour = $5.5/month
      "g6-standard-1": 0.015, // $0.015/hour = $11/month
      "g6-standard-2": 0.03, // $0.03/hour = $22/month
      "g6-standard-4": 0.06, // $0.06/hour = $44/month
      "g6-standard-6": 0.12, // $0.12/hour = $88/month
      "g6-dedicated-2": 0.045, // $0.045/hour = $33/month
      "g6-dedicated-4": 0.09, // $0.09/hour = $66/month
    };
    return rates[serverType] || 0.01; // Default rate if not found
  };

  const RealTimeBillingCounter = ({ server }: { server: LinodeInstance }) => {
    const [currentCost, setCurrentCost] = useState(0);
    const hourlyRate = getBillingRate(server.type);

    useEffect(() => {
      // Calculate initial cost based on server creation time
      const createdTime = new Date(server.created).getTime();
      const currentTime = Date.now();
      const hoursRunning = (currentTime - createdTime) / (1000 * 60 * 60);
      const initialCost = hoursRunning * hourlyRate;
      setCurrentCost(initialCost);

      // Update cost every second for real-time effect
      const interval = setInterval(() => {
        const now = Date.now();
        const totalHours = (now - createdTime) / (1000 * 60 * 60);
        const newCost = totalHours * hourlyRate;
        setCurrentCost(newCost);
      }, 1000);

      return () => clearInterval(interval);
    }, [hourlyRate, server.created]);

    // Only show billing for running servers
    if (server.status === "offline") {
      return <span className="billing-offline">Not charging</span>;
    }

    return (
      <div className="billing-counter">
        <div className="billing-amount">${currentCost.toFixed(4)}</div>
        <div className="billing-rate">${hourlyRate}/hr</div>
      </div>
    );
  };

  if (loading) {
    return <div className="loading">Loading servers...</div>;
  }

  return (
    <div>
      {successMessage && (
        <div className="success">
          {successMessage}
          <button
            style={{
              float: "right",
              background: "none",
              border: "none",
              fontSize: "1.2rem",
            }}
            onClick={() => setSuccessMessage(null)}
          >
            ×
          </button>
        </div>
      )}

      {error && (
        <div className="error">
          Error: {error}
          <button
            style={{
              float: "right",
              background: "none",
              border: "none",
              fontSize: "1.2rem",
            }}
            onClick={() => setError(null)}
          >
            ×
          </button>
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Your Servers</h2>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            className="create-server-btn"
            onClick={() => setIsModalOpen(true)}
          >
            + Create Server
          </button>
          <button className="btn btn-primary" onClick={fetchServers}>
            Refresh
          </button>
        </div>
      </div>

      {servers.length === 0 ? (
        <div className="card">
          <h3>No servers found</h3>
          <p>You don't have any Linode instances yet.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Label</th>
                <th>Status</th>
                <th>Region</th>
                <th>Type</th>
                <th>IP Address</th>
                <th>Specs</th>
                <th>Billing</th>
              </tr>
            </thead>
            <tbody>
              {servers.map((server) => (
                <tr key={server.id}>
                  <td>
                    <EditableLabel
                      value={server.label}
                      serverId={server.id}
                      onSaveAction={handleLabelSave}
                    />
                  </td>
                  <td>{renderStatusWithDot(server.status)}</td>
                  <td>{renderRegionWithFlag(server.region)}</td>
                  <td>{server.type}</td>
                  <td>{renderIpWithCopy(server.ipv4?.[0], server.id)}</td>
                  <td>
                    {server.specs
                      ? `${server.specs.vcpus} CPU, ${server.specs.memory}MB RAM, ${server.specs.disk}GB Disk`
                      : "Specs unavailable"}
                  </td>
                  <td>
                    <RealTimeBillingCounter server={server} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CreateServerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateServer}
        loading={creating}
      />
    </div>
  );
}
