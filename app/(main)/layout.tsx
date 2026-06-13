import React from "react";
import Sidebar from "../../components/Sidebar";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen w-full bg-white overflow-hidden text-gray-900">
        <Sidebar />
        <main className="flex-1 overflow-y-auto relative">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
