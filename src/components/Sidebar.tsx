interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: Array<{ id: string; label: string; component: React.ComponentType }>;
}

export default function Sidebar({
  activeTab,
  onTabChange,
  tabs,
}: SidebarProps) {
  return (
    <aside className="sidebar">
      <h1>VPS Dashboard</h1>
      <nav>
        <ul className="nav-menu">
          {tabs.map((tab) => (
            <li key={tab.id} className="nav-item">
              <button
                className={`nav-link ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => onTabChange(tab.id)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
