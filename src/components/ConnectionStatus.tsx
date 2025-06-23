interface ConnectionStatusProps {
  isConnected: boolean | null;
}

export default function ConnectionStatus({
  isConnected,
}: ConnectionStatusProps) {
  if (isConnected === null) {
    return (
      <div className="connection-status">
        <div
          className="status-indicator"
          style={{ backgroundColor: "#f59e0b" }}
        ></div>
        <span>Testing connection...</span>
      </div>
    );
  }

  return (
    <div className="connection-status">
      <div
        className={`status-indicator ${
          isConnected ? "connected" : "disconnected"
        }`}
      ></div>
      <span>
        {isConnected
          ? "Connected to Linode API"
          : "Disconnected from Linode API"}
      </span>
    </div>
  );
}
