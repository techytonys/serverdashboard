"use client";

import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import ConnectionStatus from "./ConnectionStatus";
import ServerList from "./ServerList";
import BillingInfo from "./BillingInfo";

interface DashboardTab {
  id: string;
  label: string;
  component: React.ComponentType;
}

const tabs: DashboardTab[] = [
  { id: "servers", label: "Servers", component: ServerList },
  { id: "billing", label: "Billing", component: BillingInfo },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("servers");
  const [connectionStatus, setConnectionStatus] = useState<boolean | null>(
    null
  );

  useEffect(() => {
    // Test API connection on load
    fetch("/api/test-connection")
      .then((res) => res.json())
      .then((data) => setConnectionStatus(data.success))
      .catch(() => setConnectionStatus(false));
  }, []);

  const ActiveComponent =
    tabs.find((tab) => tab.id === activeTab)?.component || ServerList;

  return (
    <div className="dashboard-container">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />
      <main className="main-content">
        <div className="header">
          <h1>VPS Server Dashboard</h1>
          <ConnectionStatus isConnected={connectionStatus} />
        </div>
        <ActiveComponent />
      </main>
    </div>
  );
}
