import EditProfilePage from "@/components/ui/AccountEdit";

export default function AccountEdit() {
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white text-gray-900 py-8 shadow-sm border-b">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold">Chỉnh sửa hồ sơ</h1>
            </div>
          </div>
        </div>
        <EditProfilePage />
      </div>
    </>
  );
}
