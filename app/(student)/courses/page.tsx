"use client";

import { useState, useEffect } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import CourseCard from "@/components/ui/courseCard";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { getAllCategories } from "@/redux/thunk/categoryThunk";
import { getFilterCourses } from "@/redux/thunk/courseThunk";
import type { Course, filterCourseParams } from "@/types/course/course";
import { useWishlistCart } from "@/hooks/commonHooks";
import { useDebounce } from "@/hooks/useDebounce";

const CoursesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [selectedRating, setSelectedRating] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { categories, status: categoryStatus } = useSelector(
    (state: RootState) => state.category
  );
  const {
    filteredCourses,
    pagination,
    status: courseStatus,
  } = useSelector((state: RootState) => state.course);
  const { handleWishlistToggle, handleCartToggle } = useWishlistCart();
  const debouncedSearch = useDebounce(searchQuery, 500);

  const displayCategories = [
    "All",
    ...categories.map((cat) => cat.categoryName),
  ];
  const levels = ["All", "Beginner", "Intermediate", "Advanced"];
  // const ratings = ["All", "4.5+", "4.7+", "4.9"];
  const ratings = [
    { label: "All", value: "All" },
    { label: "4.5+", value: "4.5" },
    { label: "4.0+", value: "4.0" },
    { label: "3.5+", value: "3.5" },
    { label: "3.0+", value: "3.0" },
  ];
  const sortOptions = [
    { value: "default", label: "Default" },
    { value: "a-z", label: "A - Z" },
    { value: "z-a", label: "Z - A" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
  ];

  const categoriesToShow = showAllCategories
    ? displayCategories
    : displayCategories.slice(0, 4);

  useEffect(() => {
    if (categoryStatus === "idle" || categories.length === 0) {
      dispatch(getAllCategories());
    }
  }, [dispatch, categoryStatus, categories.length]);

  useEffect(() => {
    if (courseStatus === "loading") {
      setIsFilterLoading(true);
    } else if (courseStatus === "succeeded") {
      const timer = setTimeout(() => setIsFilterLoading(false), 100);
      return () => clearTimeout(timer);
    }
  }, [courseStatus]);

  useEffect(() => {
    const params: filterCourseParams = {
      category: selectedCategory !== "All" ? selectedCategory : undefined,
      level: selectedLevel !== "All" ? selectedLevel : undefined,
      rating: selectedRating !== "All" ? selectedRating : undefined,
      sortBy: sortBy !== "default" ? (sortBy as any) : undefined,
      search: debouncedSearch ? debouncedSearch : undefined,
      page: currentPage,
      limit: 9,
    };

    dispatch(getFilterCourses({ params }));
  }, [
    dispatch,
    selectedCategory,
    selectedLevel,
    selectedRating,
    sortBy,
    currentPage,
    debouncedSearch,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [dispatch]);

  if (isLoading || categoryStatus === "loading" || categoryStatus === "idle") {
    return <LoadingSkeleton />;
  }

  const FilterSection = () => (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <div className="w-1 h-6 bg-violet-600 rounded-full"></div>
          Category
        </h3>
        <div className="space-y-2">
          {categoriesToShow.map((category) => (
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
        {displayCategories.length > 3 && (
          <button
            onClick={() => setShowAllCategories(!showAllCategories)}
            className="w-full mt-3 px-4 py-2 text-violet-600 hover:text-violet-700 font-medium text-sm transition-colors flex items-center justify-center gap-1"
          >
            {showAllCategories ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Thu gọn
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Show all ({displayCategories.length - 3} more categories)
              </>
            )}
          </button>
        )}
      </div>

      {/* Level Filter */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <div className="w-1 h-6 bg-violet-600 rounded-full"></div>
          Level
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
          Rating
        </h3>
        <div className="space-y-2">
          {ratings.map((rating) => (
            <button
              key={rating.value}
              onClick={() => setSelectedRating(rating.value)}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                selectedRating === rating.value
                  ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {rating.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sort Filter */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <div className="w-1 h-6 bg-violet-600 rounded-full"></div>
          Sort By
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
              Discover{" "}
              <span className="block text-violet-200 mt-2">
                Your Learning Journey
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-violet-50 max-w-2xl drop-shadow-lg leading-relaxed">
              Thousands of high-quality courses from leading experts. Learn
              flexibly and upgrade your skills anytime, anywhere.
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
                  Showing {filteredCourses.length} courses
                </p>
                <p className="text-gray-600 text-sm">
                  Page {pagination.page} of {pagination.totalPages}
                </p>
              </div>

              {filteredCourses.length > 0 ? (
                <>
                  <div
                    className={`grid md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-300 ${
                      isFilterLoading
                        ? "blur-sm opacity-50 pointer-events-none"
                        : "blur-0 opacity-100"
                    }`}
                  >
                    {filteredCourses.map((course: Course, index: number) => (
                      <div
                        key={course.id}
                        className={`transition-all duration-500 ${
                          isFilterLoading
                            ? "opacity-0 translate-y-4"
                            : "opacity-100 translate-y-0"
                        }`}
                        style={{
                          transitionDelay: isFilterLoading
                            ? "0ms"
                            : `${index * 50}ms`,
                        }}
                      >
                        <CourseCard
                          key={course.id}
                          course={course}
                          onWishlistToggle={handleWishlistToggle}
                          onCartToggle={handleCartToggle}
                        />
                      </div>
                    ))}
                  </div>

                  {pagination.totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-12">
                      <button
                        onClick={() =>
                          setCurrentPage(Math.max(1, pagination.page - 1))
                        }
                        disabled={pagination.page === 1}
                        className="p-2 rounded-lg border border-gray-300 text-gray-600 
                                  hover:bg-gray-100 hover:scale-105 hover:shadow-md 
                                  cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed 
                                  transition-all"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>

                      <div className="flex gap-1">
                        {Array.from(
                          { length: pagination.totalPages },
                          (_, i) => i + 1
                        ).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-10 h-10 rounded-lg font-semibold transition-all cursor-pointer 
                               ${
                                 currentPage === page
                                   ? "bg-violet-600 text-white shadow-lg hover:scale-105 hover:shadow-xl"
                                   : "border border-gray-300 text-gray-600 hover:bg-gray-100 hover:scale-105 hover:shadow-md"
                               }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() =>
                          setCurrentPage(
                            Math.min(pagination.totalPages, pagination.page + 1)
                          )
                        }
                        disabled={currentPage === pagination.totalPages}
                        className="p-2 rounded-lg border border-gray-300 text-gray-600 
                                  hover:bg-gray-100 hover:scale-105 hover:shadow-md 
                                  cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed 
                                  transition-all"
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
