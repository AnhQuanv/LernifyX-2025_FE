"use client";

import Footer from "@/components/student/layout/footer";
import Header from "@/components/student/layout/header";
import OfflineBanner from "@/components/ui/offline-banner";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <OfflineBanner />
      <main className="flex-grow bg-gradient-to-br from-indigo-100 via-white to-indigo-200">
        {children}
      </main>
      <Footer />
    </div>
  );
}
