"use client";

import { useCallback, useEffect, useState } from "react";

import { ChevronLeft, ChevronRight, Loader, Search } from "lucide-react";
import { handleGetTeacher } from "@/services/courseService";
import { Pagination } from "@/types/course/course";
import { UserAvatar } from "@/components/ui/avatar-cop";
import Link from "next/link";

interface Teacher {
  id: string;
  name: string;
  bio: string | null;
  students: number;
  courses: number;
  image: string | null;
  email: string;
}

const TeachersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const limit = 8;

  const fecthData = useCallback(
    async (search: string, page: number) => {
      setIsLoading(true);
      try {
        const res = await handleGetTeacher({
          search: search,
          page: page,
          limit: limit,
        });

        setTeachers(res.data);
        setPagination(res.pagination);
      } catch (error) {
        console.error("Lỗi khi tải danh sách giảng viên:", error);
        setTeachers([]);
        setPagination(null);
      } finally {
        setIsLoading(false);
      }
    },
    [limit]
  );

  useEffect(() => {
    fecthData(searchQuery, currentPage);
  }, [searchQuery, currentPage, fecthData]);

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <section className="bg-linear-to-r from-violet-950 via-purple-900 to-indigo-950 text-white py-16">
          <div className="container mx-auto px-4 md:px-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Đội Ngũ Giảng Viên
            </h1>
          </div>
        </section>

        <section className="bg-white border-b border-gray-200 ">
          <div className="container mx-auto px-4 md:px-6 py-6">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />

                <input
                  type="text"
                  placeholder="Tìm kiếm giảng viên..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            {isLoading ? (
              <div className="text-center">
                <Loader className="w-12 h-12  animate-spin mx-auto mb-4" />
                <p className="text-black-600">Đang tải dữ liệu...</p>
              </div>
            ) : teachers.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {teachers.map((teacher) => (
                  <div
                    key={teacher.id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 group cursor-pointer border border-gray-100 hover:border-violet-200 transform hover:-translate-y-2"
                  >
                    {/* Image Section */}

                    <div className="relative h-48 bg-linear-to-br from-violet-700 to-purple-600 flex items-center justify-center overflow-hidden">
                      <div className="absolute inset-0 bg-black/10"></div>
                      <UserAvatar
                        fullName={teacher.name || "User"}
                        avatarUrl={teacher.image}
                        size={128}
                      />
                    </div>

                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg group-hover:text-violet-600 transition-colors duration-300">
                          {teacher.name}
                        </h3>
                      </div>

                      <div className="min-h-11">
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {teacher.bio
                            ? `"${teacher.bio}"`
                            : "Chuyên gia đào tạo tâm huyết tại LearnifyX."}
                        </p>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-gray-100">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Email</span>
                          <span className="font-semibold text-gray-700">
                            {teacher.email}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Học viên</span>
                          <span className="font-semibold text-gray-700">
                            {teacher.students.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Khóa học</span>
                          <span className="font-semibold text-gray-700">
                            {teacher.courses.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Link
                          href={`/teachers/${teacher.id}`}
                          className="flex-1"
                        >
                          <button className="flex-1 bg-linear-to-r from-violet-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-violet-700 hover:to-purple-700 transition-all duration-300 font-semibold text-sm shadow-lg hover:shadow-xl cursor-pointer w-full">
                            Xem Hồ Sơ
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-xl text-gray-600">
                  Không tìm thấy giảng viên nào phù hợp với tiêu chí tìm kiếm.
                </p>
                <p className="text-gray-500 mt-2">Vui lòng thử một tên khác.</p>
              </div>
            )}

            {pagination && pagination.totalPages > 1 && (
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
          </div>
        </section>
      </div>
    </>
  );
};

export default TeachersPage;
