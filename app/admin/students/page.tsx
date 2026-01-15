"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Search,
  Plus,
  Trash2,
  Edit2,
  Eye,
  Loader,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { AddStudentModal } from "@/components/admin/add-account-modal";
import { DeleteModal } from "@/components/admin/delete-modal";
import { UserWithProgress } from "@/types/user/user";
import { Course } from "@/types/course/course";
import { ViewCoursesModal } from "@/components/admin/view-courses-modal";
import {
  handleDeleteUser,
  handleGetStudentsCourseProgress,
} from "@/services/authService";
import toast from "react-hot-toast";
import { getPaginationRange } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";

export default function StudentContent() {
  const [students, setStudents] = useState<UserWithProgress[]>([]);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [viewCoursesModalOpen, setViewCoursesModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] =
    useState<UserWithProgress | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UserWithProgress | null>(
    null
  );
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("student");

  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [modalType, setModalType] = useState<"add" | "update">("add");

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await handleGetStudentsCourseProgress({
        limit: 6,
        page: currentPage,
        search: debouncedSearch,
        role: selectedRole,
      });
      console.log("res: ", res);
      setStudents(res.data);
      setPagination(res.pagination);
    } catch {
      toast.error("Lỗi khi tải trang. Vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedSearch, selectedRole]);

  const handleAddStudent = async () => {
    await fetchData();
    setAddModalOpen(false);
    setSelectedStudent(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await handleDeleteUser(deleteTarget.userId);
      toast.success(`Đã xóa tài khoản thành công`);
      setStudents(students.filter((s) => s.userId !== deleteTarget.userId));
      setDeleteTarget(null);
      setDeleteModalOpen(false);
    } catch {
      toast.error("Xóa tài khoản thất bại. Vui lòng thử lại");
    }
  };

  const openViewCoursesModal = (student: UserWithProgress) => {
    setSelectedStudent(student);
    setSelectedCourses(student.course || []);
    setViewCoursesModalOpen(true);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getTitle = () => {
    switch (selectedRole) {
      case "teacher":
        return "Quản Lý Giảng Viên";
      case "admin":
        return "Quản Lý Quản Trị Viên";
      default:
        return "Quản Lý Học Sinh";
    }
  };

  return (
    <main className="flex-1 overflow-auto bg-background">
      <div className="p-8 space-y-8  max-w-400 mx-auto">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {getTitle()}
              </h1>
              <p className="text-muted-foreground mt-1">Quản lý thông tin</p>
            </div>
            <Button
              className="cursor-pointer"
              onClick={() => {
                setSelectedStudent(null);
                setAddModalOpen(true);
                setModalType("add");
              }}
            >
              <Plus size={18} /> Thêm Mới
            </Button>
          </div>

          {/* 4. Bộ lọc Role (Tabs) */}
          <div className="flex gap-2 p-1 bg-muted w-fit rounded-xl border border-border">
            {[
              { id: "student", label: "Học sinh" },
              { id: "teacher", label: "Giảng viên" },
              { id: "admin", label: "Admin" },
            ].map((role) => (
              <button
                key={role.id}
                onClick={() => {
                  setSelectedRole(role.id);
                  setCurrentPage(1); // Reset về trang 1 khi đổi tab
                }}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  selectedRole === role.id
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {role.label}
              </button>
            ))}
          </div>

          <Card className="border border-border">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="flex-1 flex items-center gap-3 bg-input rounded-lg px-4 py-2">
                  <Search size={20} className="text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Tìm kiếm ${
                      selectedRole === "student" ? "học sinh" : "tài khoản"
                    }...`}
                    className="bg-transparent outline-none text-foreground flex-1"
                  />
                  {isLoading && (
                    <Loader className="w-4 h-4 animate-spin text-muted-foreground" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader className="w-12 h-12 animate-spin mx-auto mb-4" />
                <p className="text-black-600">Đang tải dữ liệu...</p>
              </div>
            </div>
          ) : (
            <>
              <Card className="border border-border">
                <CardHeader>
                  <CardTitle>
                    Danh Sách{" "}
                    {selectedRole === "student"
                      ? "Học Sinh"
                      : selectedRole === "teacher"
                      ? "Giảng Viên"
                      : "Quản Trị Viên"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 font-medium">
                            Họ Tên
                          </th>
                          <th className="text-left py-3 px-4 font-medium">
                            Email
                          </th>
                          <th className="text-left py-3 px-4 font-medium">
                            Trạng Thái
                          </th>
                          <th className="text-left py-3 px-4 font-medium">
                            Ngày Tham Gia
                          </th>
                          <th className="text-left py-3 px-4 font-medium">
                            Hành Động
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((student) => (
                          <tr
                            key={student.userId}
                            className="border-b border-border hover:bg-muted/50"
                          >
                            <td className="py-3 px-4 font-medium">
                              {student.fullName}
                            </td>
                            <td className="py-3 px-4 font-medium">
                              {student.email}
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-3 py-1 rounded-full text-xs font-medium ">
                                {student.isActive
                                  ? "Đã Xác Thực"
                                  : "Chưa Xác Thực"}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-muted-foreground">
                              {student.createdAt
                                ? new Date(
                                    student.createdAt
                                  ).toLocaleDateString("vi-VN")
                                : "---"}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2">
                                {selectedRole !== "admin" && (
                                  <button
                                    className="p-1 hover:bg-muted rounded text-blue-600 cursor-pointer"
                                    onClick={() =>
                                      openViewCoursesModal(student)
                                    }
                                    title={
                                      selectedRole === "teacher"
                                        ? "Xem doanh thu khóa học"
                                        : "Xem tiến độ học tập"
                                    }
                                  >
                                    <Eye size={16} />
                                  </button>
                                )}
                                <button
                                  className="p-1 hover:bg-muted rounded cursor-pointer"
                                  onClick={() => {
                                    setSelectedStudent(student);
                                    setAddModalOpen(true);
                                    setModalType("update");
                                  }}
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  className="p-1 hover:bg-muted rounded text-red-600 cursor-pointer"
                                  onClick={() => {
                                    setDeleteTarget(student);
                                    setDeleteModalOpen(true);
                                  }}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {students.length === 0 && (
                      <div className="text-center py-10 text-muted-foreground">
                        Không tìm thấy dữ liệu phù hợp.
                      </div>
                    )}
                  </div>
                </CardContent>

                {pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 py-6 border-t border-border">
                    <button
                      onClick={() =>
                        setCurrentPage(Math.max(1, pagination.page - 1))
                      }
                      disabled={pagination.page === 1}
                      className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="flex gap-1">
                      {getPaginationRange(
                        pagination.page,
                        pagination.totalPages
                      ).map((page, index) => (
                        <button
                          key={page === "..." ? `dots-${index}` : page}
                          onClick={() =>
                            typeof page === "number" && setCurrentPage(page)
                          }
                          disabled={page === "..."}
                          className={`w-10 h-10 rounded-lg font-semibold transition-all cursor-pointer 
                            ${
                              pagination.page === page
                                ? "bg-violet-600 text-white shadow-lg"
                                : "border border-border text-gray-600 hover:bg-muted"
                            } ${page === "..." ? "cursor-default" : ""}`}
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
                      disabled={pagination.page === pagination.totalPages}
                      className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 cursor-pointer"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </Card>
            </>
          )}

          <AddStudentModal
            open={addModalOpen}
            onOpenChange={setAddModalOpen}
            onSubmit={handleAddStudent}
            user={selectedStudent}
            type={modalType}
          />

          <DeleteModal
            open={deleteModalOpen}
            onOpenChange={setDeleteModalOpen}
            onConfirm={confirmDelete}
            title={`Xóa ${
              selectedRole === "student" ? "Học Sinh" : "Tài Khoản"
            }`}
            description="Hành động này không thể hoàn tác."
            itemName={deleteTarget?.fullName || ""}
          />

          <ViewCoursesModal
            open={viewCoursesModalOpen}
            onOpenChange={setViewCoursesModalOpen}
            courses={selectedCourses}
            title={
              selectedRole === "teacher"
                ? "Khóa Học Đã Dạy"
                : "Danh Sách Khóa Học"
            }
            role={selectedRole}
          />
        </div>
      </div>
    </main>
  );
}
