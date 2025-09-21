export default function HomePage() {
  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-2xl shadow-lg text-center max-w-sm">
          <div className="flex justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            Đăng nhập thành công!
          </h2>
          <p className="text-gray-600 mt-2">Chào mừng bạn đã quay trở lại 🎉</p>
          <button className="mt-4 px-5 py-2 bg-green-500 text-white rounded-xl shadow hover:bg-green-600 transition">
            Vào trang chủ
          </button>
        </div>
      </div>
      ;
    </>
  );
}
