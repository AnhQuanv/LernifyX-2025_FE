"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import {
  BookOpen,
  Edit,
  Trash2,
  Eye,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  handleDeleteCourse,
  handleGetTeacherCourseCounts,
  handleGetTeacherFilteredCourses,
} from "@/services/courseService";
import { Course, filterTeacherCourseParams } from "@/types/course/course";
import DiscountCountdown from "@/components/ui/discountCountDown";
import { formatDurationVi } from "@/lib/utils";
import toast from "react-hot-toast";

const ITEMS_PER_PAGE = 6;

const getLevelBadgeColor = (level: Course["level"]) => {
  switch (level) {
    case "Cơ Bản":
      return "bg-blue-500 hover:bg-blue-600";
    case "Trung Cấp":
      return "bg-yellow-500 hover:bg-yellow-600";
    case "Nâng Cao":
      return "bg-red-500 hover:bg-red-600";
    default:
      return "bg-gray-500 hover:bg-gray-600";
  }
};

const CourseCard = ({
  course,
  onDelete,
}: {
  course: Course;
  onDelete: (id: string) => Promise<void>;
}) => {
  const isDiscounted = (course.discount ?? 0) > 0;
  const shouldShowDiscount = isDiscounted && course.discountExpiresAt;

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow overflow-hidden">
      {/* Ảnh và Badge */}
      <div className="relative w-full h-40 bg-gray-200 shrink-0">
        {course.image ? (
          <Image
            src={course.image}
            alt={course.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <BookOpen className="h-8 w-8 text-gray-400 mx-auto mb-1" />
              <p className="text-xs text-gray-500">Chưa có ảnh</p>
            </div>
          </div>
        )}
        <div className="absolute top-2 right-2 scale-90 origin-top-right">
          {course.discount != null && course.discountExpiresAt && (
            <DiscountCountdown
              discount={course.discount}
              discountExpiresAt={course.discountExpiresAt}
            />
          )}
        </div>
        {course.level && (
          <Badge
            className={`absolute top-2 left-2 text-white z-10 ${getLevelBadgeColor(
              course.level
            )}`}
          >
            {course.level}
          </Badge>
        )}
      </div>

      {/* Nội dung tiêu đề - Cố định độ cao để card đều nhau */}
      <CardHeader className="space-y-2 p-4 pb-0">
        <div className="flex items-start justify-between gap-2 min-h-10">
          <Badge variant="outline" className="capitalize">
            {course.status === "draft" && "Nháp"}
            {course.status === "published" && "Đã xuất bản"}
            {course.status === "pending" && "Chờ duyệt"}
            {course.status === "rejected" && "Bị từ chối"}
          </Badge>
          <div className="text-right shrink-0">
            {shouldShowDiscount ? (
              <>
                <p className="text-[10px] text-muted-foreground line-through">
                  {Number(course.originalPrice).toLocaleString("vi-VN")}₫
                </p>
                <p className="text-base font-bold text-black-600 leading-none">
                  {Number(course.price).toLocaleString("vi-VN")}₫
                </p>
              </>
            ) : (
              <p className="text-base font-bold text-foreground">
                {Number(course.originalPrice).toLocaleString("vi-VN")}₫
              </p>
            )}
          </div>
        </div>
        <CardTitle className="line-clamp-2 min-h-12 text-lg flex items-start">
          {course.title}
        </CardTitle>
        <CardDescription className="line-clamp-2 min-h-10 text-sm">
          {course.description || "Chưa có mô tả..."}
        </CardDescription>
      </CardHeader>

      {/* Thông số và Nút bấm */}
      <CardContent className="p-4 pt-4 flex flex-col flex-1 justify-between space-y-4">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm border-t pt-4">
          <StatBox label="Học sinh" value={course.students ?? 0} />
          <StatBox label="Danh mục" value={course.category ?? ""} truncate />
          <StatBox
            label="Đánh giá"
            value={course.rating ? `${course.rating}` : ""}
          />
          <StatBox
            label="Thời lượng"
            value={formatDurationVi(course.duration ?? 0) || "0s"}
          />
          <div className="col-span-2">
            <StatBox
              label="Doanh thu"
              value={`${course.revenue?.toLocaleString() || 0}₫`}
            />
          </div>
        </div>

        <div className="flex gap-2 pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="flex-1 cursor-pointer"
          >
            <Link href={`/course/${course.id}`}>
              <Eye className="h-4 w-4 mr-1" /> Xem
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="flex-1 cursor-pointer"
          >
            <Link href={`/course/${course.id}/edit`}>
              <Edit className="h-4 w-4 mr-1" /> Sửa
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:bg-destructive/10"
            onClick={() => onDelete(course.id)}
            disabled={
              course.status === "published" || course.status === "pending"
            }
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const StatBox = ({ label, value, truncate }: any) => (
  <div className="min-w-0">
    <p className="text-[11px] text-muted-foreground uppercase font-medium">
      {label}
    </p>
    <p
      className={`font-semibold text-foreground text-xs ${
        truncate ? "truncate" : ""
      }`}
    >
      {value}
    </p>
  </div>
);

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCourses, setTotalCourses] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedSortBy, setSelectedSortBy] = useState("newest");
  const [groupedCourses, setGroupedCourses] = useState({
    all: 0,
    published: 0,
    pending: 0,
    draft: 0,
    rejected: 0,
  });

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const params: filterTeacherCourseParams = {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: searchTerm || undefined,
        status:
          selectedStatus !== "all"
            ? (selectedStatus as Course["status"])
            : undefined,
        sortBy: selectedSortBy as filterTeacherCourseParams["sortBy"],
      };

      const [counts, responseData] = await Promise.all([
        handleGetTeacherCourseCounts(),
        handleGetTeacherFilteredCourses({ params }),
      ]);

      setGroupedCourses({
        all: counts.totalAll,
        published: counts.totalPublished,
        pending: counts.totalPending,
        draft: counts.totalDraft,
        rejected: counts.totalRejected,
      });

      setCourses(responseData.data);
      setTotalCourses(responseData.pagination.total);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, selectedStatus, selectedSortBy]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleDelete = async (courseId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa?")) return;
    try {
      await handleDeleteCourse(courseId);
      toast.success("Xóa thành công");
      fetchCourses();
    } catch {
      toast.error("Lỗi khi xóa");
    }
  };

  const totalPages = Math.ceil(totalCourses / ITEMS_PER_PAGE);

  return (
    <main className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Khóa Học của Tôi</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý và chỉnh sửa nội dung giảng dạy
          </p>
        </div>
        <Link href="/course/create">
          <Button size="lg">
            <BookOpen className="mr-2 h-4 w-4" /> Tạo Khóa Học
          </Button>
        </Link>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <SummaryCard label="Tổng Cộng" value={totalCourses} />
        <SummaryCard
          label="Đã Xuất Bản"
          value={groupedCourses.published}
          color="text-green-600"
        />
        <SummaryCard
          label="Chờ Duyệt"
          value={groupedCourses.pending}
          color="text-yellow-600"
        />
        <SummaryCard
          label="Nháp"
          value={groupedCourses.draft}
          color="text-gray-600"
        />
        <SummaryCard
          label="Bị Từ Chối"
          value={groupedCourses.rejected}
          color="text-red-600"
        />
      </div>

      {/* Search & Filter */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm khóa học..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>
          <Select
            value={selectedStatus}
            onValueChange={(v) => {
              setSelectedStatus(v);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-full md:w-44">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="published">Đã xuất bản</SelectItem>
              <SelectItem value="pending">Chờ duyệt</SelectItem>
              <SelectItem value="draft">Nháp</SelectItem>
              <SelectItem value="rejected">Bị từ chối</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={selectedSortBy}
            onValueChange={(v) => {
              setSelectedSortBy(v);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-full md:w-44">
              <SelectValue placeholder="Sắp xếp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Mới nhất</SelectItem>
              <SelectItem value="oldest">Cũ nhất</SelectItem>
              <SelectItem value="a-z">Tên (A-Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Grid Danh sách */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader className="animate-spin h-8 w-8 text-primary" />
        </div>
      ) : courses.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Pagination - Giữ nguyên logic của bạn */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                )
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-lg border-2 border-dashed">
          <p className="text-muted-foreground">Không tìm thấy khóa học nào.</p>
        </div>
      )}
    </main>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SummaryCard({ label, value, color = "text-foreground" }: any) {
  return (
    <Card className="p-4">
      <p className="text-xs text-muted-foreground uppercase font-bold">
        {label}
      </p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </Card>
  );
}
