// Simple in-memory storage for test server data
// This simulates persistence for development/testing purposes

interface TestServer {
  id: number;
  label: string;
  status: string;
  region: string;
  type: string;
  ipv4: string[];
  specs: {
    vcpus: number;
    memory: number;
    disk: number;
    transfer: number;
  };
  created: string;
  updated: string;
  image: string;
  group: string;
  tags: string[];
  hypervisor: string;
  watchdog_enabled: boolean;
  alerts: {
    cpu: number;
    network_in: number;
    network_out: number;
    transfer_quota: number;
    io: number;
  };
}

// In-memory storage - this will reset when the server restarts
let testServers: Map<number, TestServer> = new Map();

// Initialize with default test server
const initializeTestServers = () => {
  if (testServers.size === 0) {
    // Running server with green pulsing dot
    testServers.set(12345, {
      id: 12345,
      label: "test-server-001",
      status: "running",
      region: "us-east",
      type: "g6-nanode-1",
      ipv4: ["192.168.1.100"],
      specs: {
        vcpus: 1,
        memory: 1024,
        disk: 25,
        transfer: 1000,
      },
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      image: "linode/ubuntu22.04",
      group: "",
      tags: [],
      hypervisor: "kvm",
      watchdog_enabled: true,
      alerts: {
        cpu: 90,
        network_in: 10,
        network_out: 10,
        transfer_quota: 80,
        io: 10000,
      },
    });

    // Provisioning server with yellow pulsing dot
    testServers.set(12346, {
      id: 12346,
      label: "provisioning-server",
      status: "provisioning",
      region: "eu-central",
      type: "g6-standard-1",
      ipv4: ["192.168.1.101"],
      specs: {
        vcpus: 1,
        memory: 2048,
        disk: 50,
        transfer: 2000,
      },
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      image: "linode/ubuntu22.04",
      group: "",
      tags: [],
      hypervisor: "kvm",
      watchdog_enabled: true,
      alerts: {
        cpu: 90,
        network_in: 10,
        network_out: 10,
        transfer_quota: 80,
        io: 10000,
      },
    });

    // Rebooting server with orange pulsing dot
    testServers.set(12347, {
      id: 12347,
      label: "rebooting-server",
      status: "rebooting",
      region: "ap-northeast",
      type: "g6-standard-2",
      ipv4: ["192.168.1.102"],
      specs: {
        vcpus: 2,
        memory: 4096,
        disk: 80,
        transfer: 4000,
      },
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      image: "linode/debian11",
      group: "",
      tags: [],
      hypervisor: "kvm",
      watchdog_enabled: true,
      alerts: {
        cpu: 90,
        network_in: 10,
        network_out: 10,
        transfer_quota: 80,
        io: 10000,
      },
    });

    // Offline server with red static dot
    testServers.set(12348, {
      id: 12348,
      label: "offline-server",
      status: "offline",
      region: "ca-central",
      type: "g6-nanode-1",
      ipv4: ["192.168.1.103"],
      specs: {
        vcpus: 1,
        memory: 1024,
        disk: 25,
        transfer: 1000,
      },
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      image: "linode/centos8",
      group: "",
      tags: [],
      hypervisor: "kvm",
      watchdog_enabled: true,
      alerts: {
        cpu: 90,
        network_in: 10,
        network_out: 10,
        transfer_quota: 80,
        io: 10000,
      },
    });
  }
};

export const getTestServers = (): TestServer[] => {
  initializeTestServers();
  return Array.from(testServers.values());
};

export const getTestServer = (id: number): TestServer | undefined => {
  initializeTestServers();
  return testServers.get(id);
};

export const updateTestServer = (
  id: number,
  updates: Partial<TestServer>
): TestServer | null => {
  initializeTestServers();
  const server = testServers.get(id);
  if (!server) {
    return null;
  }

  const updatedServer = {
    ...server,
    ...updates,
    updated: new Date().toISOString(),
  };

  testServers.set(id, updatedServer);
  return updatedServer;
};
