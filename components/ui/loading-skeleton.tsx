export const LoadingSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      {/* Hero Section Skeleton */}
      <section className="relative bg-linear-to-br from-violet-950 via-purple-900 to-indigo-950 py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            {/* Heading Skeleton */}
            <div className="space-y-6">
              <div className="h-20 bg-purple-800/50 rounded-lg mx-auto w-3/4"></div>
              <div className="h-8 bg-purple-800/50 rounded-lg mx-auto w-2/3"></div>
            </div>

            {/* Search Bar Skeleton */}
            <div className="max-w-3xl mx-auto">
              <div className="h-16 bg-purple-800/50 rounded-2xl"></div>
            </div>

            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-12">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white/5 rounded-2xl p-6 h-32"></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section Skeleton */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <div className="h-12 bg-gray-200 rounded-lg mx-auto w-1/2 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded-lg mx-auto w-2/3"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-100 rounded-2xl p-8 h-48"></div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses Skeleton */}
      <section className="py-20 bg-linear-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-16">
            <div className="h-12 bg-gray-200 rounded-lg w-1/3 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded-lg w-1/2"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden shadow-lg"
              >
                <div className="h-52 bg-gray-200"></div>
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-8 bg-gray-200 rounded mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export function CommentSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="flex gap-4 animate-pulse border-b border-gray-200 pb-6 last:border-0"
        >
          <div className="w-12 h-12 rounded-full bg-gray-300" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            <div className="h-3 bg-gray-300 rounded w-full"></div>
            <div className="h-3 bg-gray-300 rounded w-5/6"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
