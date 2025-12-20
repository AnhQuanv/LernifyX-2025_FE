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
  AlertCircle,
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

const useTimeRemaining = (endDateString: string | null) => {
  const calculateTime = useCallback(() => {
    if (!endDateString) return null;
    const now = new Date().getTime();
    const end = new Date(endDateString).getTime();
    const distance = end - now;

    if (distance <= 0) {
      return "Đã kết thúc";
    }

    if (distance < 60000) {
      return `Còn dưới 1 phút`;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      return `Còn ${days} ngày`;
    }
    if (hours > 0) {
      return `Còn ${hours} giờ ${minutes} phút`;
    }
    return `Còn ${minutes} phút`;
  }, [endDateString]);

  const [timeRemaining, setTimeRemaining] = useState(() => calculateTime());

  useEffect(() => {
    if (!endDateString) return;

    const interval = setInterval(() => {
      setTimeRemaining(calculateTime());
    }, 60000);

    setTimeRemaining(calculateTime());

    return () => clearInterval(interval);
  }, [endDateString, calculateTime]);

  return timeRemaining;
};

const getStatusBadge = (status: Course["status"]) => {
  type VariantType = "default" | "outline" | "secondary" | "destructive";
  const variants: {
    [key: string]: { variant: VariantType; label: string; color: string };
  } = {
    published: {
      variant: "default",
      label: "Đã Xuất Bản",
      color: "bg-green-100",
    },
    draft: { variant: "outline", label: "Nháp", color: "bg-gray-100" },
    pending: {
      variant: "secondary",
      label: "Chờ Duyệt",
      color: "bg-yellow-100",
    },
    rejected: {
      variant: "destructive",
      label: "Bị Từ Chối",
      color: "bg-red-100",
    },
  };
  const key = status ?? "draft";
  return variants[key] || variants.draft;
};

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
  onDelete: (courseId: string) => Promise<void>;
}) => {
  const statusInfo = getStatusBadge(course.status);

  const actualDiscount = course.discount ?? 0;
  const isDiscounted = actualDiscount > 0;

  const timeRemaining = useTimeRemaining(course.discountExpiresAt);

  const shouldShowDiscount =
    isDiscounted &&
    course.discountExpiresAt &&
    timeRemaining !== "Đã kết thúc" &&
    timeRemaining !== null;

  const ratingValue = parseFloat(`${course.rating || "0.00"}`);
  const displayRating =
    ratingValue > 0
      ? `${ratingValue.toFixed(1)}★(${course.ratingCount})`
      : "N/A";

  return (
    <Card
      key={course.id}
      className="hover:shadow-lg transition-shadow overflow-hidden"
    >
      <div className="relative w-full h-40 bg-gray-200">
        {course.image ? (
          <Image
            src={course.image || "/placeholder.svg"}
            alt={course.title}
            fill
            loading="eager"
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

        <div className="h-15  absolute top-2 right-2">
          {course.discount != null && course.discountExpiresAt ? (
            <DiscountCountdown
              discount={course.discount}
              discountExpiresAt={course.discountExpiresAt}
            />
          ) : (
            <div className="h-full"></div>
          )}
        </div>
        {/* Level Badge */}
        {course.level && (
          <Badge
            className={`absolute top-2 left-2 text-white gap-1 z-10 ${getLevelBadgeColor(
              course.level
            )}`}
          >
            {course.level}
          </Badge>
        )}
      </div>
      <CardHeader>
        <div className="flex items-start justify-start gap-3 mb-2">
          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
          <div className="flex flex-col items-end ml-auto max-w-35 shrink-0">
            {shouldShowDiscount && course.originalPrice !== null ? (
              <span className="text-xs text-muted-foreground line-through truncate w-full text-right">
                {Number(course.originalPrice).toLocaleString("vi-VN")}₫
              </span>
            ) : (
              <span className="text-xs">&nbsp;</span>
            )}

            <span
              className={`font-semibold truncate w-full text-right ${
                shouldShowDiscount
                  ? "text-lg text-black-600"
                  : "text-base text-foreground"
              }`}
            >
              {shouldShowDiscount
                ? course.price !== null && course.price !== undefined
                  ? `${Number(course.price).toLocaleString("vi-VN")}₫`
                  : ""
                : course.originalPrice !== null &&
                  course.originalPrice !== undefined
                ? `${Number(course.originalPrice).toLocaleString("vi-VN")}₫`
                : ""}
            </span>
          </div>
        </div>
        <CardTitle className="line-clamp-2">{course.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {course.description || "Chưa có mô tả..."}
        </CardDescription>
        <p className="text-xs text-muted-foreground mt-2">
          Tạo:{" "}
          {course.createdAt
            ? new Date(course.createdAt).toLocaleString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Chưa cập nhật"}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">Học sinh</p>
            <p className="font-semibold text-foreground">
              {course.students ?? "N/A"}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Danh mục</p>
            <p className="font-semibold text-foreground">
              {course.category ?? "N/A"}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Đánh giá</p>
            <p className="font-semibold text-foreground">{displayRating}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Thời lượng</p>
            <p className="font-semibold text-foreground">
              {formatDurationVi(course.duration ?? 0) || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Doanh thu</p>
            <p className="font-semibold text-foreground">
              {course.revenue != null
                ? course.revenue.toLocaleString() + "₫"
                : "N/A"}
            </p>
          </div>
        </div>

        {/* Rejected Notice */}
        <div className="min-h-12">
          {course.status === "rejected" && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
              <div className="text-sm text-red-800">
                <p className="font-semibold">Bị từ chối</p>
                <p className="text-xs">
                  Vui lòng chỉnh sửa và gửi lại để duyệt
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t">
          <Link href={`/course/${course.id}`} className="flex-1">
            <Button
              variant="outline"
              size="sm"
              className="w-full bg-transparent cursor-pointer"
            >
              <Eye className="h-4 w-4 mr-1" />
              Xem
            </Button>
          </Link>
          <Link href={`/course/${course.id}/edit`} className="flex-1">
            <Button
              variant="outline"
              size="sm"
              className="w-full bg-transparent cursor-pointer"
            >
              <Edit className="h-4 w-4 mr-1" />
              Chỉnh sửa
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 text-destructive hover:text-destructive cursor-pointer"
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

  const handleFilterChange = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setter: React.Dispatch<React.SetStateAction<any>>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any
  ) => {
    setter(value);
    setCurrentPage(1);
  };

  const handleDelete = async (courseId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa khóa học này không?")) {
      return;
    }
    const loadingToastId = toast.loading(`Đang xóa khóa học...`);
    try {
      setLoading(true);
      await handleDeleteCourse(courseId);
      toast.success(`Xóa khóa học thành công!`, {
        id: loadingToastId,
      });
      await fetchCourses();
    } catch (error) {
      console.error("Lỗi khi xóa khóa học:", error);
      toast.error("Lỗi: Không thể xóa khóa học. Vui lòng thử lại.", {
        id: loadingToastId,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const params: filterTeacherCourseParams = {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      };

      if (searchTerm) {
        params.search = searchTerm;
      }
      if (selectedStatus !== "all") {
        params.status = selectedStatus as Course["status"];
      }
      if (selectedSortBy) {
        params.sortBy = selectedSortBy as filterTeacherCourseParams["sortBy"];
      }
      const counts = await handleGetTeacherCourseCounts();

      const responseData = await handleGetTeacherFilteredCourses({ params });

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
      console.error("Lỗi khi fetch khóa học:", error);
      setCourses([]);
      setTotalCourses(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, selectedStatus, selectedSortBy]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const totalPages = Math.ceil(totalCourses / ITEMS_PER_PAGE);

  return (
    <main className="flex-1 overflow-auto">
      <div className="p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Khóa Học của Tôi
            </h1>
            <p className="text-muted-foreground mt-2">
              Quản lý và chỉnh sửa khóa học của bạn
            </p>
          </div>
          <Link href="/course/create">
            <Button size="lg" className="cursor-pointer">
              <BookOpen className="mr-2 h-4 w-4" />
              Tạo Khóa Học
            </Button>
          </Link>
        </div>

        {/* Status Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Tổng Cộng</p>
              <p className="text-2xl font-bold text-foreground">
                {totalCourses}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Đã Xuất Bản</p>
              <p className="text-2xl font-bold text-green-600">
                {groupedCourses.published}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Chờ Duyệt</p>
              <p className="text-2xl font-bold text-yellow-600">
                {groupedCourses.pending}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Nháp</p>
              <p className="text-2xl font-bold text-gray-600">
                {groupedCourses.draft}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Bị Từ Chối</p>
              <p className="text-2xl font-bold text-red-600">
                {groupedCourses.rejected}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Input Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm khóa học..."
                  value={searchTerm}
                  onChange={(e) =>
                    handleFilterChange(setSearchTerm, e.target.value)
                  }
                  className="pl-10"
                />
              </div>

              {/* Select Status */}
              <Select
                value={selectedStatus}
                onValueChange={(value) =>
                  handleFilterChange(setSelectedStatus, value)
                }
              >
                <SelectTrigger className="w-full md:w-48 cursor-pointer">
                  <SelectValue placeholder="Lọc theo trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem className="cursor-pointer" value="all">
                    Tất Cả
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="published">
                    Đã Xuất Bản
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="pending">
                    Chờ Duyệt
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="draft">
                    Nháp
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="rejected">
                    Bị Từ Chối
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Select Sắp xếp (SortBy) */}
              <Select
                value={selectedSortBy}
                onValueChange={(value) =>
                  handleFilterChange(setSelectedSortBy, value)
                }
              >
                <SelectTrigger className="w-full md:w-48 cursor-pointer">
                  <SelectValue placeholder="Sắp xếp theo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem className="cursor-pointer" value="newest">
                    Mới nhất
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="oldest">
                    Cũ nhất
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="a-z">
                    Tên (A-Z)
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="z-a">
                    Tên (Z-A)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Display Logic */}
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Loader className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-3 text-lg text-muted-foreground">
              Đang tải dữ liệu...
            </p>
          </div>
        ) : totalCourses === 0 && !searchTerm && selectedStatus === "all" ? (
          <Card className="border-2 border-dashed">
            <CardContent className="pt-12 pb-12 flex flex-col items-center justify-center text-center space-y-6">
              <div className="space-y-2 max-w-md">
                <h2 className="text-2xl font-bold text-foreground">
                  Bạn chưa có khóa học nào
                </h2>
                <p className="text-muted-foreground">
                  Bạn chưa tạo khóa học nào. Hãy tạo khóa học đầu tiên để bắt
                  đầu kiếm tiền
                </p>
              </div>
              <Link href="/course/create">
                <Button size="lg" className="gap-2 cursor-pointer">
                  Tạo Khóa Học Đầu Tiên
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : courses.length === 0 && (searchTerm || selectedStatus !== "all") ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">
                Không tìm thấy khóa học nào phù hợp với tiêu chí tìm kiếm
              </p>
            </CardContent>
          </Card>
        ) : (
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
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
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
