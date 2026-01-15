import EditProfilePage from "@/components/ui/AccountEdit";

export default function AccountEdit() {
  return (
    <>
      <main className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Chỉnh sửa hồ sơ
            </h1>
          </div>
          <EditProfilePage />
        </div>
      </main>
    </>
  );
}
