"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Star,
  Users,
  Clock,
  PlayCircle,
  Heart,
  Search,
  TrendingDown,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
} from "lucide-react";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";

const CountdownTimer = ({ expiresAt }: { expiresAt: string }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const expiryTime = new Date(expiresAt).getTime();
      const difference = expiryTime - now;

      if (difference <= 0) {
        setTimeLeft("Expired");
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      const formatNumber = (num: number) => (num < 10 ? `0${num}` : num);

      setTimeLeft(
        `${formatNumber(days)}d : ${formatNumber(hours)}h : ${formatNumber(
          minutes
        )}m : ${formatNumber(seconds)}s`
      );
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  return <span className="text-xs font-semibold text-white">{timeLeft}</span>;
};

const CoursesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [selectedRating, setSelectedRating] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [wishlist, setWishlist] = useState(new Set());
  const [cart, setCart] = useState(new Set());
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const itemsPerPage = 6;

  const allCourses = [
    {
      id: 1,
      title: "Complete React Development Course",
      instructor: "John Smith",
      rating: 4.8,
      students: 12500,
      price: 89.99,
      originalPrice: 199.99,
      discount: 55,
      level: "Intermediate",
      duration: "40 hours",
      category: "Programming",
      discountExpiresAt: new Date(
        Date.now() + 5 * 24 * 60 * 60 * 1000
      ).toISOString(),
      image:
        "https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg",
    },
    {
      id: 2,
      title: "Digital Marketing Masterclass",
      instructor: "Sarah Johnson",
      rating: 4.9,
      students: 8900,
      price: 149.99,
      originalPrice: null,
      discount: null,
      level: "Beginner",
      duration: "25 hours",
      category: "Marketing",
      discountExpiresAt: null,
      image:
        "https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg",
    },
    {
      id: 3,
      title: "UI/UX Design Fundamentals",
      instructor: "Mike Chen",
      rating: 4.7,
      students: 15200,
      price: 69.99,
      originalPrice: 129.99,
      discount: 46,
      level: "Beginner",
      duration: "30 hours",
      category: "Design",
      discountExpiresAt: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ).toISOString(),
      image:
        "https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg",
    },
    {
      id: 4,
      title: "Python for Data Science",
      instructor: "Lisa Wang",
      rating: 4.9,
      students: 20100,
      price: 179.99,
      originalPrice: null,
      discount: null,
      level: "Advanced",
      duration: "50 hours",
      category: "Data Science",
      discountExpiresAt: null,
      image:
        "https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg",
    },
    {
      id: 5,
      title: "Machine Learning Bootcamp",
      instructor: "David Brown",
      rating: 4.8,
      students: 18400,
      price: 109.99,
      originalPrice: 249.99,
      discount: 56,
      level: "Advanced",
      duration: "60 hours",
      category: "Data Science",
      discountExpiresAt: new Date(
        Date.now() + 1 * 24 * 60 * 60 * 1000
      ).toISOString(),
      image:
        "https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg",
    },
    {
      id: 6,
      title: "WordPress Development",
      instructor: "Emma Wilson",
      rating: 4.6,
      students: 9200,
      price: 119.99,
      originalPrice: null,
      discount: null,
      level: "Beginner",
      duration: "20 hours",
      category: "Web Development",
      discountExpiresAt: null,
      image:
        "https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg",
    },
    {
      id: 7,
      title: "Photoshop Mastery Course",
      instructor: "Alex Turner",
      rating: 4.9,
      students: 13800,
      price: 74.99,
      originalPrice: 159.99,
      discount: 53,
      level: "Intermediate",
      duration: "35 hours",
      category: "Design",
      discountExpiresAt: new Date(
        Date.now() + 6 * 24 * 60 * 60 * 1000
      ).toISOString(),
      image:
        "https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg",
    },
    {
      id: 8,
      title: "JavaScript Advanced Concepts",
      instructor: "Maria Garcia",
      rating: 4.8,
      students: 16700,
      price: 179.99,
      originalPrice: null,
      discount: null,
      level: "Advanced",
      duration: "45 hours",
      category: "Programming",
      discountExpiresAt: null,
      image:
        "https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg",
    },
    {
      id: 9,
      title: "SEO Optimization Masterclass",
      instructor: "Tom Wilson",
      rating: 4.7,
      students: 7600,
      price: 64.99,
      originalPrice: 129.99,
      discount: 50,
      level: "Intermediate",
      duration: "28 hours",
      category: "Marketing",
      discountExpiresAt: new Date(
        Date.now() + 8 * 24 * 60 * 60 * 1000
      ).toISOString(),
      image:
        "https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg",
    },
    {
      id: 10,
      title: "Web Design with Figma",
      instructor: "Lisa Park",
      rating: 4.8,
      students: 11200,
      price: 149.99,
      originalPrice: null,
      discount: null,
      level: "Beginner",
      duration: "32 hours",
      category: "Design",
      discountExpiresAt: null,
      image:
        "https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg",
    },
    {
      id: 11,
      title: "Node.js Backend Development",
      instructor: "James Lee",
      rating: 4.9,
      students: 14500,
      price: 99.99,
      originalPrice: 199.99,
      discount: 50,
      level: "Intermediate",
      duration: "48 hours",
      category: "Programming",
      discountExpiresAt: new Date(
        Date.now() + 5 * 24 * 60 * 60 * 1000
      ).toISOString(),
      image:
        "https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg",
    },
    {
      id: 12,
      title: "Content Marketing Strategy",
      instructor: "Rachel Green",
      rating: 4.6,
      students: 6800,
      price: 139.99,
      originalPrice: null,
      discount: null,
      level: "Beginner",
      duration: "22 hours",
      category: "Marketing",
      discountExpiresAt: null,
      image:
        "https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg",
    },
  ];

  const categories = [
    "All",
    "Programming",
    "Design",
    "Marketing",
    "Data Science",
    "Web Development",
  ];
  const levels = ["All", "Beginner", "Intermediate", "Advanced"];
  const ratings = ["All", "4.5+", "4.7+", "4.9"];
  const sortOptions = [
    { value: "default", label: "Mặc định" },
    { value: "a-z", label: "A - Z" },
    { value: "z-a", label: "Z - A" },
    { value: "price_asc", label: "Giá: Thấp đến Cao" },
    { value: "price_desc", label: "Giá: Cao đến Thấp" },
  ];

  let filteredCourses = allCourses.filter((course) => {
    const matchesCategory =
      selectedCategory === "All" || course.category === selectedCategory;
    const matchesLevel =
      selectedLevel === "All" || course.level === selectedLevel;
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    let matchesRating = true;
    if (selectedRating !== "All") {
      const ratingThreshold = Number.parseFloat(selectedRating);
      matchesRating = course.rating >= ratingThreshold;
    }

    return matchesCategory && matchesLevel && matchesSearch && matchesRating;
  });

  if (sortBy === "a-z") {
    filteredCourses = [...filteredCourses].sort((a, b) =>
      a.title.localeCompare(b.title)
    );
  } else if (sortBy === "z-a") {
    filteredCourses = [...filteredCourses].sort((a, b) =>
      b.title.localeCompare(a.title)
    );
  } else if (sortBy === "price_asc") {
    filteredCourses = [...filteredCourses].sort((a, b) => a.price - b.price);
  } else if (sortBy === "price_desc") {
    filteredCourses = [...filteredCourses].sort((a, b) => b.price - a.price);
  }

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCourses = filteredCourses.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedLevel, selectedRating, sortBy, searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const toggleWishlist = (courseId: number) => {
    const newWishlist = new Set(wishlist);
    if (newWishlist.has(courseId)) {
      newWishlist.delete(courseId);
    } else {
      newWishlist.add(courseId);
    }
    setWishlist(newWishlist);
  };

  const toggleCart = (courseId: number) => {
    const newCart = new Set(cart);
    if (newCart.has(courseId)) {
      newCart.delete(courseId);
    } else {
      newCart.add(courseId);
    }
    setCart(newCart);
  };

  const FilterSection = () => (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <div className="w-1 h-6 bg-violet-600 rounded-full"></div>
          Danh mục
        </h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Level Filter */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <div className="w-1 h-6 bg-violet-600 rounded-full"></div>
          Cấp độ
        </h3>
        <div className="space-y-2">
          {levels.map((level) => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                selectedLevel === level
                  ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <div className="w-1 h-6 bg-violet-600 rounded-full"></div>
          Đánh giá
        </h3>
        <div className="space-y-2">
          {ratings.map((rating) => (
            <button
              key={rating}
              onClick={() => setSelectedRating(rating)}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                selectedRating === rating
                  ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Star className="w-4 h-4" />
              {rating}
            </button>
          ))}
        </div>
      </div>

      {/* Sort Filter */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <div className="w-1 h-6 bg-violet-600 rounded-full"></div>
          Sắp xếp
        </h3>
        <div className="space-y-2">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSortBy(option.value)}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                sortBy === option.value
                  ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-violet-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-violet-700 via-purple-600 to-indigo-700 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-2xl leading-tight">
              Khám phá khóa học
              <span className="block text-violet-200 mt-2">của bạn</span>
            </h1>
            <p className="text-xl md:text-2xl text-violet-50 max-w-2xl drop-shadow-lg leading-relaxed">
              Hàng nghìn khóa học chất lượng cao từ các chuyên gia hàng đầu. Học
              tập linh hoạt, nâng cao kỹ năng mọi lúc mọi nơi.
            </p>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex gap-4 items-center">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-3 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-all"
            >
              <Filter className="w-5 h-5" />
              Lọc
            </button>
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm khóa học..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent shadow-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Filters Overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
          <div className="bg-white w-80 h-full overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Bộ lọc</h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <FilterSection />
          </div>
        </div>
      )}

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex gap-8">
            {/* Sidebar Filters - Desktop */}
            <aside className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-24">
                <FilterSection />
              </div>
            </aside>

            <div className="flex-1 min-w-0">
              <div className="mb-8 flex justify-between items-center">
                <p className="text-gray-600 text-lg">
                  Showing {paginatedCourses.length} of {filteredCourses.length}{" "}
                  courses
                </p>
                <p className="text-gray-600 text-sm">
                  Page {currentPage} of {totalPages}
                </p>
              </div>

              {paginatedCourses.length > 0 ? (
                <>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedCourses.map((course: any) => (
                      <div
                        key={course.id}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 group border border-gray-100 hover:border-violet-200 transform hover:-translate-y-2"
                      >
                        <Link href={`/courses/${course.id}`} className="block">
                          <div className="relative h-52 overflow-hidden bg-gray-200 cursor-pointer">
                            <img
                              src={course.image || "/placeholder.svg"}
                              alt={course.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300"></div>
                            <PlayCircle className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 z-10" />

                            {/* Level Badge */}
                            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-violet-600 px-3 py-1 rounded-full text-sm font-semibold">
                              {course.level}
                            </div>

                            {/* Discount Badge */}
                            <div className="absolute top-4 right-4 flex flex-col gap-2">
                              {/* Wishlist Button */}
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  toggleWishlist(course.id);
                                }}
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
                                  wishlist.has(course.id)
                                    ? "bg-red-500 text-white"
                                    : "bg-white/95 backdrop-blur-sm text-gray-600 hover:bg-white"
                                }`}
                              >
                                <Heart
                                  className={`w-5 h-5 ${
                                    wishlist.has(course.id)
                                      ? "fill-current"
                                      : ""
                                  }`}
                                />
                              </button>
                            </div>
                          </div>

                          <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-sm font-medium">
                                {course.category}
                              </span>
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="text-sm font-semibold text-gray-700">
                                  {course.rating}
                                </span>
                              </div>
                            </div>

                            <h3 className="font-bold text-gray-800 text-lg group-hover:text-violet-600 transition-colors duration-300 line-clamp-2">
                              {course.title}
                            </h3>

                            <p className="text-gray-600 font-medium">
                              by {course.instructor}
                            </p>

                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Users className="w-4 h-4" />
                                <span>{course.students.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>{course.duration}</span>
                              </div>
                            </div>

                            {/* Discount & Countdown Row */}
                            <div className="h-[60px]">
                              {course.discount && (
                                <div className="flex items-center gap-3">
                                  {/* Discount Badge */}
                                  <div className="relative flex-shrink-0">
                                    <div className="bg-gradient-to-r from-red-500 via-red-600 to-red-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-red-400/50 backdrop-blur-sm animate-pulse">
                                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-xl animate-shimmer"></div>
                                      <TrendingDown className="w-5 h-5 flex-shrink-0 drop-shadow-lg" />
                                      <span className="text-base tracking-wide drop-shadow-lg whitespace-nowrap">
                                        -{course.discount}%
                                      </span>
                                    </div>
                                  </div>

                                  {/* Countdown Timer */}
                                  <div className="relative group flex-1">
                                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                                    <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white px-3 py-2 rounded-lg font-bold shadow-xl border border-orange-500/30">
                                      <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-1.5">
                                          <Clock className="w-4 h-4 text-orange-400 animate-pulse flex-shrink-0" />
                                          <span className="text-orange-300 text-xs font-semibold whitespace-nowrap">
                                            Kết thúc:
                                          </span>
                                        </div>
                                        <div className="text-sm font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-red-300 to-pink-300">
                                          <CountdownTimer
                                            expiresAt={course.discountExpiresAt}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                  <span className="text-2xl font-bold text-violet-600">
                                    ${course.price}
                                  </span>
                                  <span className="text-gray-400 line-through">
                                    ${course.originalPrice}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>

                        <div className="px-6 pb-6 flex gap-2">
                          <button className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-4 py-2.5 rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">
                            Enroll Now
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCart(course.id);
                            }}
                            className={`px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 ${
                              cart.has(course.id)
                                ? "bg-green-500 text-white hover:bg-green-600"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-12">
                      <button
                        onClick={() =>
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>

                      <div className="flex gap-1">
                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1
                        ).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                              currentPage === page
                                ? "bg-violet-600 text-white shadow-lg"
                                : "border border-gray-300 text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() =>
                          setCurrentPage(Math.min(totalPages, currentPage + 1))
                        }
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16">
                  <p className="text-xl text-gray-600">
                    No courses found matching your criteria.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CoursesPage;
