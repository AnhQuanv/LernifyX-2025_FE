import AccountSettingsPage from "@/components/ui/AccountSettings";

export default function AccountSettings() {
  return (
    <>
      <main className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-8 space-y-4">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Cài đặt tài khoản
            </h1>
          </div>
          <AccountSettingsPage />
        </div>
      </main>
    </>
  );
}
