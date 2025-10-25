"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  Users,
  ChevronRight,
  Award,
  TrendingUp,
  Shield,
  Globe,
  Search,
  ArrowRight,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { getAllCategories } from "@/redux/thunk/categoryThunk";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import CourseCard from "@/components/ui/courseCard";
import Image from "next/image";
import { useWishlistCart } from "@/lib/commonHooks";
import { getHomeCourses } from "@/redux/thunk/courseThunk";

const Homepage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, status: categoryStatus } = useSelector(
    (state: RootState) => state.category
  );
  const { homeCourse: allCourses, status: courseStatus } = useSelector(
    (state: RootState) => state.course
  );
  const { isInWishlist, isInCart, handleWishlistToggle, handleCartToggle } =
    useWishlistCart();

  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const coursesPerPage = 4;
  const maxSlides = Math.ceil(allCourses.length / coursesPerPage) - 1;

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

  const allCategories = [
    {
      name: "Programming",
      icon: "💻",
      color: "from-blue-500 to-indigo-600",
      popular: true,
    },
    {
      name: "Design",
      icon: "🎨",
      color: "from-pink-500 to-rose-600",
      popular: true,
    },
    {
      name: "Marketing",
      icon: "📈",
      color: "from-green-500 to-emerald-600",
      popular: true,
    },
    {
      name: "Business",
      icon: "💼",
      color: "from-purple-500 to-violet-600",
      popular: true,
    },
    {
      name: "Photography",
      icon: "📸",
      color: "from-orange-500 to-amber-600",
      popular: true,
    },
    {
      name: "Music",
      icon: "🎵",
      color: "from-cyan-500 to-teal-600",
      popular: true,
    },
    {
      name: "Writing",
      icon: "✍️",
      color: "from-red-500 to-pink-600",
      popular: false,
    },
    {
      name: "Language",
      icon: "🗣️",
      color: "from-indigo-500 to-blue-600",
      popular: false,
    },
    {
      name: "Health & Fitness",
      icon: "💪",
      color: "from-emerald-500 to-green-600",
      popular: false,
    },
    {
      name: "Cooking",
      icon: "👨‍🍳",
      color: "from-yellow-500 to-orange-600",
      popular: false,
    },
    {
      name: "Personal Development",
      icon: "🚀",
      color: "from-violet-500 to-purple-600",
      popular: false,
    },
    {
      name: "Science",
      icon: "🔬",
      color: "from-teal-500 to-cyan-600",
      popular: false,
    },
    {
      name: "Mathematics",
      icon: "🧮",
      color: "from-gray-500 to-slate-600",
      popular: false,
    },
    {
      name: "History",
      icon: "🏛️",
      color: "from-amber-500 to-yellow-600",
      popular: false,
    },
    {
      name: "Art & Crafts",
      icon: "🎭",
      color: "from-rose-500 to-pink-600",
      popular: false,
    },
  ];

  const stats = [
    { number: "50K+", label: "Active Students", icon: Users },
    { number: "10K+", label: "Total Courses", icon: BookOpen },
    { number: "500+", label: "Expert Instructors", icon: Award },
    { number: "95%", label: "Success Rate", icon: CheckCircle },
  ];

  const categoriesToDisplay = categories.map((dbCat) => {
    const match = allCategories.find((c) => c.name === dbCat.categoryName);
    return {
      id: dbCat.categoryId,
      name: dbCat.categoryName,
      icon: match?.icon || "📚",
      color: match?.color || "from-gray-500 to-gray-600",
      popular: match?.popular || false,
    };
  });

  const displayedCategories = showAllCategories
    ? categoriesToDisplay
    : categoriesToDisplay.slice(0, 6);
  const hasMoreCategories = categoriesToDisplay.length > 6;

  useEffect(() => {
    dispatch(getAllCategories());
    dispatch(getHomeCourses());
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [dispatch]);

  if (categoryStatus === "loading" || isLoading || courseStatus === "loading") {
    return <LoadingSkeleton />;
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Enhanced */}
      <section className="relative bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950 text-white py-32 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Gradient Orbs */}
          <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-3xl"></div>

          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

          {/* Floating Particles */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-float"></div>
            <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-cyan-300 rounded-full animate-float-delayed"></div>
            <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-purple-300 rounded-full animate-float"></div>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-6xl md:text-8xl font-extrabold leading-tight tracking-tight">
                <span className="block mb-2">Learn Without</span>
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
                    Limits
                  </span>
                  <svg
                    className="absolute -bottom-4 left-0 w-full"
                    viewBox="0 0 300 12"
                    fill="none"
                  >
                    <path
                      d="M2 10C50 3 150 3 298 10"
                      stroke="url(#gradient)"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient
                        id="gradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#22d3ee" />
                        <stop offset="50%" stopColor="#60a5fa" />
                        <stop offset="100%" stopColor="#a78bfa" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-blue-100/90 max-w-3xl mx-auto leading-relaxed font-light">
                Transform your career with expert-led courses. Join thousands of
                learners mastering new skills every day.
              </p>
            </div>

            {/* Enhanced Search Bar */}
            <div className="max-w-3xl mx-auto">
              <div className="relative group">
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>

                {/* Search Input */}
                <div className="relative bg-white rounded-2xl p-2 flex items-center shadow-2xl">
                  <div className="flex items-center flex-1 bg-gray-50 rounded-xl px-6 py-5">
                    <Search className="w-6 h-6 text-gray-400" />
                    <input
                      type="text"
                      placeholder="What do you want to learn today?"
                      className="flex-1 px-4 text-gray-700 outline-none text-lg bg-transparent placeholder:text-gray-400"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowSearchDropdown(e.target.value.trim().length > 0);
                      }}
                      onFocus={() => {
                        if (searchQuery.trim().length > 0) {
                          setShowSearchDropdown(true);
                        }
                      }}
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
                  <button className="relative bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white px-10 py-5 rounded-xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group/btn overflow-hidden">
                    <span className="relative z-10 flex items-center gap-2">
                      Search
                      <svg
                        className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>

                {showSearchDropdown && filteredCourses.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl z-50 max-h-96 overflow-y-auto">
                    <div className="p-4">
                      <div className="text-sm font-semibold text-gray-600 mb-3 px-2">
                        Found {filteredCourses.length} course
                        {filteredCourses.length !== 1 ? "s" : ""}
                      </div>
                      <div className="space-y-2">
                        {filteredCourses.slice(0, 8).map((course) => (
                          <div
                            key={course.id}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group/item"
                          >
                            {/* Course Image */}
                            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                              <Image
                                src={course.image || "/placeholder.svg"}
                                alt={course.title}
                                width={100}
                                height={100}
                                className="w-full h-full object-cover group-hover/item:scale-110 transition-transform"
                              />
                            </div>

                            {/* Course Info */}
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
                                <span className="text-xs text-gray-500">
                                  ⭐ {course.rating}
                                </span>
                              </div>
                            </div>

                            {/* Price */}
                            <div className="text-right flex-shrink-0">
                              <div className="font-bold text-gray-800">
                                ${course.price}
                              </div>
                              {course.originalPrice && (
                                <div className="text-xs text-gray-400 line-through">
                                  ${course.originalPrice}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* View All Results Link */}
                      {filteredCourses.length > 8 && (
                        <div className="border-t border-gray-200 mt-3 pt-3">
                          <button className="w-full text-center text-violet-600 hover:text-violet-700 font-semibold text-sm py-2 transition-colors">
                            View all {filteredCourses.length} results →
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* No Results Message */}
                {showSearchDropdown &&
                  searchQuery.trim().length > 0 &&
                  filteredCourses.length === 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl z-50 p-8 text-center">
                      <div className="text-gray-500">
                        <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p className="font-semibold text-gray-700 mb-1">
                          No courses found
                        </p>
                        <p className="text-sm">
                          Try searching with different keywords
                        </p>
                      </div>
                    </div>
                  )}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-12 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="group">
                  <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:-translate-y-1">
                    {/* Icon */}
                    <div className="w-14 h-14 bg-gradient-to-br from-cyan-400/20 to-purple-400/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 border border-white/20">
                      <stat.icon className="w-7 h-7 text-cyan-300" />
                    </div>

                    {/* Number with animation */}
                    <div className="text-4xl font-extrabold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent mb-2">
                      {stat.number}
                    </div>

                    {/* Label */}
                    <div className="text-blue-200/80 text-sm font-medium">
                      {stat.label}
                    </div>

                    {/* Hover Glow */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/0 via-purple-500/0 to-blue-500/0 group-hover:from-cyan-500/10 group-hover:via-purple-500/10 group-hover:to-blue-500/10 transition-all duration-500"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-8 pt-8 opacity-70">
              <div className="text-sm text-blue-200">
                Trusted by top companies
              </div>
              <div className="h-8 w-px bg-white/20"></div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-sm text-blue-200">
                  4.9/5 from 50k+ reviews
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section - Enhanced with View More */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Browse Top Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Explore our comprehensive collection of courses across different
              fields and discover the perfect learning path that matches your
              goals and interests.
            </p>
          </div>

          {/* Categories Grid with Animation */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedCategories.map((category, index) => (
              <div
                key={index}
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
                {/* Popular Badge */}
                {category.popular && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                    Popular
                  </div>
                )}

                {/* Gradient Background on Hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                ></div>

                {/* Content */}
                <div className="relative z-10">
                  <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-500">
                    {category.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-white transition-colors duration-500">
                    {category.name}
                  </h3>

                  <div className="mt-6 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <div className="flex items-center text-white font-semibold">
                      <span>Explore Courses</span>
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View More/Less Button */}
          {hasMoreCategories && (
            <div className="text-center mt-12">
              <button
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="group bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center mx-auto space-x-2"
              >
                <span>
                  {showAllCategories
                    ? `Show Less Categories`
                    : `View All ${categoriesToDisplay.length} Categories`}
                </span>
                {showAllCategories ? (
                  <ChevronUp className="w-5 h-5 group-hover:scale-110 transition-transform" />
                ) : (
                  <ChevronDown className="w-5 h-5 group-hover:scale-110 transition-transform" />
                )}
              </button>
            </div>
          )}

          {/* Quick Category Search */}
          {showAllCategories && (
            <div className="mt-12 bg-gray-50 rounded-2xl p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Find Your Category
                </h3>
                <p className="text-gray-600">
                  Browse by popularity or search for specific topics
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-3 mb-6">
                <button className="bg-white border border-gray-200 hover:border-violet-600 hover:bg-violet-50 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300">
                  Most Popular
                </button>
                <button className="bg-white border border-gray-200 hover:border-violet-600 hover:bg-violet-50 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300">
                  Recently Added
                </button>
                <button className="bg-white border border-gray-200 hover:border-violet-600 hover:bg-violet-50 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300">
                  Trending
                </button>
                <button className="bg-white border border-gray-200 hover:border-violet-600 hover:bg-violet-50 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300">
                  Beginner Friendly
                </button>
              </div>

              <div className="max-w-md mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search categories..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Featured Courses - Enhanced */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                Featured Courses
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl">
                Handpicked courses from our expert instructors, designed to help
                you master in-demand skills
              </p>
            </div>
            <div className="hidden lg:flex items-center space-x-4">
              <button className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2 shadow-lg">
                <span className="font-semibold">View All Courses</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Enhanced Slider */}
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
                  <div key={slideIndex} className="w-full flex-shrink-0">
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
                            isInWishlist={isInWishlist(course.id)}
                            isInCart={isInCart(course.id)}
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

          {/* Enhanced Indicators */}
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

      {/* Why Choose Us - Enhanced */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Why Choose LeanrifyX?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We provide the best learning experience with industry experts,
              cutting-edge curriculum, and a supportive community that helps you
              succeed.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Award,
                title: "Expert Instructors",
                description:
                  "Learn from industry professionals with years of real-world experience and proven track records.",
                color: "from-blue-500 to-indigo-600",
              },
              {
                icon: TrendingUp,
                title: "Updated Content",
                description:
                  "Always up-to-date curriculum following the latest industry trends and best practices.",
                color: "from-green-500 to-emerald-600",
              },
              {
                icon: Shield,
                title: "Lifetime Access",
                description:
                  "Access your courses anytime, anywhere, forever. Learn at your own pace without restrictions.",
                color: "from-purple-500 to-violet-600",
              },
              {
                icon: Globe,
                title: "Global Community",
                description:
                  "Join millions of learners worldwide and connect with peers who share your passion for learning.",
                color: "from-orange-500 to-red-600",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group text-center hover:transform hover:-translate-y-2 transition-all duration-500"
              >
                <div
                  className={`w-20 h-20 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-500 shadow-lg`}
                >
                  <feature.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-violet-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              Join over 50,000 students who have already transformed their
              careers with LeanrifyX. Start learning today and unlock your
              potential with our comprehensive courses.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={() => setIsAuthenticated(true)}
                className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:from-violet-700 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                Get Started Free Today
              </button>
              <button className="bg-white border-2 border-violet-600 text-violet-600 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-violet-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Browse All Courses
              </button>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-gray-500 mb-4">Trusted by students from</p>
              <div className="flex justify-center items-center space-x-8 text-gray-400">
                <span className="font-semibold">Google</span>
                <span className="font-semibold">Microsoft</span>
                <span className="font-semibold">Apple</span>
                <span className="font-semibold">Netflix</span>
                <span className="font-semibold">Amazon</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
