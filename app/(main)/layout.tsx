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
      <div className="flex h-screen w-full bg-white dark:bg-gray-950 overflow-hidden text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <Sidebar />
        <main className="flex-1 overflow-y-auto relative bg-white dark:bg-gray-950">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
