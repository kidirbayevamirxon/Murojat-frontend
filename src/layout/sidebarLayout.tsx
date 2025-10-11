import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Shield, LayoutDashboard, Building2, Grid2X2 } from "lucide-react";

export default function SidebarLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { name: "Organizations", icon: <Building2 size={18} />, path: "/" },
    { name: "Applications", icon: <Grid2X2 size={18} />, path: "/applications" },
    { name: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/dashboard" },
  ];

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col">
        <div className="flex items-center space-x-2 px-2 py-3 mb-6 mt-7">
          <div className="bg-blue-600 text-white p-2 rounded-lg">
            <Shield size={20} />
          </div>
          <span className="font-semibold text-lg">Admin Panel</span>
        </div>

        <nav className="flex flex-col space-y-1">
          {menu.map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                location.pathname === item.path
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">
        <Outlet /> {/* Bu yerda child route content ko‘rinadi */}
      </main>
    </div>
  );
}
