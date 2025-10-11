import { Outlet } from "react-router-dom";

export default function Home() {

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
