"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  ChevronRight,
  Search,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  X,
  Loader,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { getAllCategories } from "@/redux/thunk/categoryThunk";
import CourseCard from "@/components/ui/courseCard";
import Image from "next/image";
import {
  getCourseRecommendation,
  getHomeCourses,
} from "@/redux/thunk/courseThunk";
import { useWishlistCart } from "@/hooks/commonHooks";
import { useRouter } from "next/navigation";

const Homepage = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { categories, status: categoryStatus } = useSelector(
    (state: RootState) => state.category
  );
  const {
    homeCourse: allCourses,
    recommendationCourse,
    status: courseStatus,
    statusRecommendationCourse,
  } = useSelector((state: RootState) => state.course);
  const auth = useSelector((state: RootState) => state.auth);
  const { handleWishlistToggle, handleCartToggle } = useWishlistCart();

  const [isLoading, setIsLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentSlideRecommendation, setCurrentSlideRecommendation] =
    useState(0);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const coursesPerPage = 4;
  const maxSlides = Math.ceil(allCourses.length / coursesPerPage) - 1;
  const maxSlidesRecommend =
    Math.ceil(recommendationCourse.length / coursesPerPage) - 1;

  const filteredCourses = searchQuery.trim()
    ? allCourses.filter(
        (course) =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev < maxSlides ? prev + 1 : 0));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : maxSlides));
  };

  const categoriesToDisplay = categories.map((dbCat) => {
    return {
      id: dbCat.categoryId,
      name: dbCat.categoryName,
      icon: "📚",
      color: "from-gray-500 to-gray-600",
      popular: false,
    };
  });

  const handleCategoryClick = () => {
    router.push(`/courses`);
  };

  const displayedCategories = showAllCategories
    ? categoriesToDisplay
    : categoriesToDisplay.slice(0, 6);
  const hasMoreCategories = categoriesToDisplay.length > 6;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const promises = [
        dispatch(getAllCategories()),
        dispatch(getHomeCourses()),
      ];
      if (auth.isAuthenticated) {
        promises.push(dispatch(getCourseRecommendation()));
      }
      await Promise.all(promises);
      setIsLoading(false);
    };
    fetchData();
  }, [dispatch, auth.isAuthenticated]);

  if (
    categoryStatus === "loading" ||
    isLoading ||
    courseStatus === "loading" ||
    statusRecommendationCourse === "loading"
  ) {
    return (
      <>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader className="w-12 h-12  animate-spin mx-auto mb-4" />
            <p className="text-black-600">Đang tải dữ liệu...</p>
          </div>
        </div>
        ;
      </>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-violet-950 via-purple-900 to-indigo-950 text-white py-32">
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="space-y-6">
              <h1 className="text-6xl md:text-8xl font-extrabold leading-tight tracking-tight">
                <span className="block mb-2">Học tập không</span>
                <span className="relative inline-block">
                  <span className="bg-linear-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-linear">
                    giới hạn
                  </span>
                </span>
              </h1>
            </div>

            {/* Search */}
            <div className="max-w-3xl mx-auto relative group">
              <div className="absolute -inset-1 bg-linear-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
              <div className="relative bg-white rounded-2xl p-2 flex items-center shadow-2xl">
                <div className="flex items-center flex-1 bg-gray-50 rounded-xl px-6 py-5">
                  <Search className="w-6 h-6 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Bạn muốn học gì hôm nay?"
                    className="flex-1 px-4 text-gray-700 outline-none text-lg bg-transparent placeholder:text-gray-400"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSearchDropdown(e.target.value.trim().length > 0);
                    }}
                    onFocus={() =>
                      searchQuery.trim().length > 0 &&
                      setShowSearchDropdown(true)
                    }
                  />
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setShowSearchDropdown(false);
                      }}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <button className="relative bg-linear-to-r from-violet-600 via-purple-600 to-indigo-600 text-white px-10 py-5 rounded-xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group/btn overflow-hidden cursor-pointer">
                  <span className="relative z-10 flex items-center gap-2">
                    Tìm kiếm
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </button>

                {/* Dropdown */}
                {showSearchDropdown && filteredCourses.length > 0 && (
                  <div
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl z-9999 max-h-96 overflow-y-auto"
                    style={{ position: "absolute", zIndex: 9999 }}
                  >
                    <div className="p-4">
                      <div className="space-y-2">
                        {filteredCourses.slice(0, 8).map((course) => (
                          <div
                            key={course.id}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group/item"
                          >
                            <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-200">
                              <Image
                                src={
                                  course.image ||
                                  "https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg"
                                }
                                alt={course.title}
                                width={100}
                                height={100}
                                className="w-full h-full object-cover group-hover/item:scale-110 transition-transform"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-800 text-sm truncate group-hover/item:text-violet-600 transition-colors">
                                {course.title}
                              </h4>
                              <p className="text-xs text-gray-500 truncate">
                                {course.instructor}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded">
                                  {course.category}
                                </span>
                                {course.rating != null &&
                                  course.ratingCount != null && (
                                    <span className="text-xs text-gray-500">
                                      ⭐ {course.rating}({course.ratingCount}{" "}
                                      đánh giá)
                                    </span>
                                  )}
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <div className="font-bold text-gray-800">
                                {course.price !== null
                                  ? `${course.price.toLocaleString("vi-VN")}₫`
                                  : course.originalPrice !== null
                                  ? `${course.originalPrice.toLocaleString(
                                      "vi-VN"
                                    )}₫`
                                  : "Miễn phí"}
                              </div>

                              {course.price !== null &&
                                course.originalPrice !== null &&
                                course.price < course.originalPrice && (
                                  <div className="text-xs text-gray-400 line-through">
                                    {course.originalPrice.toLocaleString(
                                      "vi-VN"
                                    )}
                                    ₫
                                  </div>
                                )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {showSearchDropdown &&
                  searchQuery.trim().length > 0 &&
                  filteredCourses.length === 0 && (
                    <div
                      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl z-9999 p-8 text-center"
                      style={{ position: "absolute", zIndex: 9999 }}
                    >
                      <div className="text-gray-500">
                        <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p className="font-semibold text-gray-700 mb-1">
                          Không tìm thấy khóa học
                        </p>
                        <p className="text-sm">Hãy thử tìm với từ khóa khác</p>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Khám phá các chuyên mục
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedCategories.map((category, index) => (
              <div
                key={index}
                onClick={() => handleCategoryClick()}
                className={`group relative overflow-hidden rounded-2xl p-8 bg-white border border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-500 cursor-pointer ${
                  !showAllCategories && index >= 6
                    ? "opacity-0 scale-95"
                    : "opacity-100 scale-100"
                }`}
                style={{
                  transitionDelay: showAllCategories
                    ? `${(index % 3) * 100}ms`
                    : "0ms",
                }}
              >
                {category.popular && (
                  <div className="absolute top-4 right-4 bg-linear-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                    Phổ biến
                  </div>
                )}
                <div
                  className={`absolute inset-0 bg-linear-to-r ${category.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                ></div>
                <div className="relative z-10">
                  <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-500">
                    {category.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-white transition-colors duration-500">
                    {category.name}
                  </h3>
                  <div className="mt-6 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <div className="flex items-center text-white font-semibold">
                      <span>Khám phá khóa học</span>
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {hasMoreCategories && (
            <div className="text-center mt-12">
              <button
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="group bg-linear-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center mx-auto space-x-2 cursor-pointer"
              >
                <span>
                  {showAllCategories
                    ? "Thu gọn danh mục"
                    : `Xem tất cả ${categoriesToDisplay.length} danh mục`}
                </span>
                {showAllCategories ? (
                  <ChevronUp className="w-5 h-5 group-hover:scale-110 transition-transform" />
                ) : (
                  <ChevronDown className="w-5 h-5 group-hover:scale-110 transition-transform" />
                )}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-linear-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                Khóa học nổi bật
              </h2>
            </div>
            <div className="hidden lg:flex items-center space-x-4">
              <button
                className="bg-linear-to-r from-violet-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2 shadow-lg cursor-pointer"
                onClick={() => router.push("/courses")}
              >
                <span className="font-semibold">Xem tất cả khóa học</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Slider */}
          <div className="relative">
            <button
              onClick={prevSlide}
              className="absolute -left-6 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:bg-violet-600 hover:text-white hover:border-violet-600 transition-all duration-300 shadow-xl z-10 group"
            >
              <ChevronRight className="w-6 h-6 rotate-180 group-hover:scale-110 transition-transform" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute -right-6 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:bg-violet-600 hover:text-white hover:border-violet-600 transition-all duration-300 shadow-xl z-10 group"
            >
              <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>
            <div className="overflow-hidden rounded-2xl">
              <div
                className="flex transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {Array.from({
                  length: Math.ceil(allCourses.length / coursesPerPage),
                }).map((_, slideIndex) => (
                  <div key={slideIndex} className="w-full shrink-0">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                      {allCourses
                        .slice(
                          slideIndex * coursesPerPage,
                          (slideIndex + 1) * coursesPerPage
                        )
                        .map((course) => (
                          <CourseCard
                            key={course.id}
                            course={course}
                            onWishlistToggle={handleWishlistToggle}
                            onCartToggle={handleCartToggle}
                          />
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Indicators */}
          <div className="flex justify-center mt-12 space-x-3">
            {Array.from({ length: maxSlides + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-3 rounded-full transition-all duration-300 ${
                  currentSlide === index
                    ? "bg-violet-600 w-8"
                    : "bg-gray-300 hover:bg-gray-400 w-3"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {recommendationCourse && recommendationCourse.length > 0 && (
        <section className="py-20 bg-linear-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex justify-between items-center mb-16">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                  Gợi ý khóa học
                </h2>
              </div>
              <div className="hidden lg:flex items-center space-x-4">
                <button
                  className="bg-linear-to-r from-violet-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2 shadow-lg cursor-pointer"
                  onClick={() => router.push("/courses")}
                >
                  <span className="font-semibold">Xem tất cả khóa học</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Slider */}
            <div className="relative">
              <button
                onClick={() =>
                  setCurrentSlideRecommendation((prev) =>
                    prev > 0
                      ? prev - 1
                      : Math.ceil(
                          recommendationCourse.length / coursesPerPage
                        ) - 1
                  )
                }
                className="absolute -left-6 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:bg-violet-600 hover:text-white hover:border-violet-600 transition-all duration-300 shadow-xl z-10 group"
              >
                <ChevronRight className="w-6 h-6 rotate-180 group-hover:scale-110 transition-transform" />
              </button>
              <button
                onClick={() =>
                  setCurrentSlideRecommendation((prev) =>
                    prev <
                    Math.ceil(recommendationCourse.length / coursesPerPage) - 1
                      ? prev + 1
                      : 0
                  )
                }
                className="absolute -right-6 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:bg-violet-600 hover:text-white hover:border-violet-600 transition-all duration-300 shadow-xl z-10 group"
              >
                <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </button>
              <div className="overflow-hidden rounded-2xl">
                <div
                  className="flex transition-transform duration-700 ease-out"
                  style={{
                    transform: `translateX(-${
                      currentSlideRecommendation * 100
                    }%)`,
                  }}
                >
                  {Array.from({
                    length: Math.ceil(
                      recommendationCourse.length / coursesPerPage
                    ),
                  }).map((_, slideIndex) => (
                    <div key={slideIndex} className="w-full shrink-0">
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {recommendationCourse
                          .slice(
                            slideIndex * coursesPerPage,
                            (slideIndex + 1) * coursesPerPage
                          )
                          .map((course) => (
                            <CourseCard
                              key={course.id}
                              course={course}
                              onWishlistToggle={handleWishlistToggle}
                              onCartToggle={handleCartToggle}
                            />
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Indicators */}
            <div className="flex justify-center mt-12 space-x-3">
              {Array.from({ length: maxSlidesRecommend + 1 }).map(
                (_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlideRecommendation(index)}
                    className={`h-3 rounded-full transition-all duration-300 ${
                      currentSlideRecommendation === index
                        ? "bg-violet-600 w-8"
                        : "bg-gray-300 hover:bg-gray-400 w-3"
                    }`}
                  />
                )
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Homepage;
