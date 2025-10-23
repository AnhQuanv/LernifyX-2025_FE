export const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="flex flex-col items-center space-y-6">
        {/* Animated Spinner */}
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-violet-600 border-r-violet-600 animate-spin"></div>
        </div>

        {/* Loading Text */}
        <div className="text-center">
          <p className="text-gray-800 font-semibold text-lg">Loading ...</p>
          <p className="text-gray-500 text-sm mt-2">
            Vui lòng đợi trong giây lát
          </p>
        </div>
      </div>
    </div>
  );
};
