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
  Plus,
  MessageSquareText,
  XCircle,
  Download,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  handleCreateCourseDraft,
  handleDeleteCourse,
  handleDeletePublishedCourse,
  handleGetTeacherCourseCounts,
  handleGetTeacherFilteredCourses,
} from "@/services/courseService";
import {
  Course,
  filterTeacherCourseParams,
  Pagination,
} from "@/types/course/course";
import DiscountCountdown from "@/components/ui/discountCountDown";
import {
  formatDurationVi,
  getPaginationRange,
  getStatusBadge,
} from "@/lib/utils";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDebounce } from "@/hooks/useDebounce";

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
  onDelete: (course: Course) => Promise<void>;
}) => {
  const router = useRouter();
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleEditClick = async (course: Course) => {
    setIsLoadingEdit(true);
    try {
      if (course.status === "published" || course.status === "archived") {
        if (course.hasDraft && course.childCourseId) {
          const idDraft = course.childCourseId;
          router.push(`/teacher/course/${idDraft}/edit`);
        } else {
          const res = await handleCreateCourseDraft(course.id);
          router.push(`/teacher/course/${res.id}/edit`);
        }
      } else {
        router.push(`/teacher/course/${course.id}/edit`);
      }
    } catch {
      toast.error("Lỗi khi tạo bản nháp");
    } finally {
      setIsLoadingEdit(false);
    }
  };

  const currentDraft =
    course.childDrafts && course.childDrafts.length > 0
      ? course.childDrafts[0]
      : null;

  const effectiveDiscount = currentDraft
    ? currentDraft.discount
    : course.discount;

  const effectiveExpiresAt = currentDraft
    ? currentDraft.discountExpiresAt
    : course.discountExpiresAt;

  const isDiscounted = Number(effectiveDiscount) > 0;

  const isNotExpired =
    !effectiveExpiresAt || new Date(effectiveExpiresAt) > new Date();
  const shouldShowDiscount = isDiscounted && isNotExpired;

  const displayTitle =
    course.status === "published" && currentDraft
      ? currentDraft.title
      : course.title;

  const displayDescription =
    course.status === "published" && currentDraft
      ? currentDraft.description
      : course.description;

  const displayLevel =
    course.status === "published" && currentDraft
      ? currentDraft.level
      : course.level;

  const displayPrice =
    course.status === "published" && currentDraft
      ? currentDraft.price
      : course.price;

  const displayOriginalPrice =
    course.status === "published" && currentDraft
      ? currentDraft.originalPrice
      : course.originalPrice;

  const effectiveRejectionReason =
    course.childCourseStatus === "rejected" && currentDraft?.rejectionReason
      ? currentDraft.rejectionReason
      : course.status === "rejected"
      ? course.rejectionReason
      : null;

  const effectiveArchiveReason =
    course.status === "archived" ? course.archiveReason : null;

  return (
    <>
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
                displayLevel
              )}`}
            >
              {displayLevel}
            </Badge>
          )}
        </div>

        <CardHeader className="space-y-2 p-4 pb-0">
          <div className="flex items-start justify-between gap-2 min-h-10">
            <div className="flex flex-col gap-1">
              {(() => {
                const badge = getStatusBadge(course);
                return (
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`capitalize ${badge.color}`}
                    >
                      {badge.label}
                    </Badge>

                    {(course.childCourseStatus === "pending" ||
                      course.childCourseStatus === "rejected") &&
                      currentDraft?.submissionNote && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-3 w-3 p-0 text-black-500 hover:text-black-600 hover:bg-amber-50 rounded-full cursor-pointer"
                            >
                              <MessageSquareText className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80 p-4 shadow-xl bg-white">
                            <div className="space-y-2">
                              <h4 className="text-xs font-bold flex items-center gap-1 uppercase tracking-wider">
                                Lời nhắn gửi Admin
                              </h4>
                              <div className="border-t border-white-50 pt-2">
                                <p className="text-sm text-gray-700 whitespace-pre-wrap italic leading-relaxed">
                                  {currentDraft.submissionNote}
                                </p>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}

                    {effectiveRejectionReason &&
                      course.status !== "archived" && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-3 w-3 px-2 text-xs text-destructive hover:bg-red-100 hover:text-destructive font-semibold cursor-pointer underline decoration-dotted"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            align="end"
                            className="w-80 p-4 border-red-200 shadow-xl bg-white"
                          >
                            <div className="space-y-3">
                              <div className="flex items-center gap-2 text-destructive border-b pb-2">
                                <h4 className="text-sm font-bold uppercase">
                                  {course.childCourseStatus === "rejected"
                                    ? "Bản cập nhật bị từ chối"
                                    : "Khóa học bị từ chối"}
                                </h4>
                              </div>
                              <div className="max-h-60 overflow-y-auto">
                                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed italic">
                                  {effectiveRejectionReason}
                                </p>
                              </div>
                              <p className="text-[12px] text-gray-400 text-right italic pt-2 border-t">
                                Vui lòng sửa theo yêu cầu và gửi duyệt lại.
                              </p>
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}

                    {effectiveArchiveReason && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 p-0 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full cursor-pointer"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          align="end"
                          className="w-80 p-4 shadow-xl bg-white border-gray-200"
                        >
                          <div className="space-y-2">
                            <h4 className="text-xs font-bold flex items-center gap-1 uppercase tracking-wider text-red-600">
                              Lý do gỡ khóa học
                            </h4>
                            <div className="border-t border-gray-100 pt-2">
                              <p className="text-sm text-gray-700 whitespace-pre-wrap italic leading-relaxed">
                                {course.archiveReason}
                              </p>
                              <p className="text-[12px] text-gray-400 mt-2 text-right">
                                Hệ thống đã gỡ khóa học này. Học viên đã mua vẫn
                                có thể tiếp tục học tập bình thường, nhưng học
                                viên mới sẽ không thể tìm thấy hoặc đăng ký.
                              </p>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                );
              })()}
            </div>
            <div className="text-right shrink-0">
              {shouldShowDiscount ? (
                <>
                  <p className="text-[10px] text-muted-foreground line-through">
                    {Number(displayOriginalPrice).toLocaleString("vi-VN")}₫
                  </p>
                  <p className="text-base font-bold text-black-600 leading-none">
                    {Number(displayPrice).toLocaleString("vi-VN")}₫
                  </p>
                </>
              ) : (
                <p className="text-base font-bold text-foreground">
                  {Number(displayOriginalPrice).toLocaleString("vi-VN")}₫
                </p>
              )}
            </div>
          </div>
          <CardTitle className="line-clamp-2 min-h-12 text-lg flex items-start">
            {displayTitle || "Chưa có tiêu đề"}
          </CardTitle>
          <CardDescription className="line-clamp-2 min-h-10 text-sm">
            {displayDescription || "Chưa có mô tả..."}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 pt-4 flex flex-col flex-1 justify-between space-y-4">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm border-t pt-4">
            <StatBox label="Học sinh" value={course.students ?? 0} />
            <StatBox label="Danh mục" value={course.category ?? ""} truncate />
            <StatBox
              label="Đánh giá"
              value={
                course.rating
                  ? `${course.rating} (${course.ratingCount || 0})`
                  : "Chưa có đánh giá"
              }
            />
            <StatBox
              label="Thời lượng"
              value={formatDurationVi(course.duration ?? 0) || "0s"}
            />
            <StatBox
              label="Tổng Doanh thu"
              value={`${course.revenue?.toLocaleString() || 0}₫`}
            />

            <StatBox
              label="Thực nhận (sau 10% phí)"
              value={`${course.netRevenue?.toLocaleString() || 0}₫`}
            />
          </div>

          <div className="flex gap-2 pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="flex-1 cursor-pointer"
            >
              <Link href={`/teacher/course/${course.id}`}>
                <Eye className="h-4 w-4 mr-1" /> Xem
              </Link>
            </Button>
            {course.status === "published" &&
              course.hasDraft &&
              course.childCourseId && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="flex-1 cursor-pointer"
                >
                  <Link href={`/teacher/course/${course.childCourseId}`}>
                    <Eye className="h-4 w-4 mr-1" /> Xem bản nháp
                  </Link>
                </Button>
              )}
            <Button
              variant="outline"
              size="sm"
              className="flex-1 cursor-pointer"
              onClick={() => handleEditClick(course)}
              disabled={isLoadingEdit}
            >
              <Edit className="h-4 w-4 mr-1" />
              {isLoadingEdit ? "Đang xử lý..." : "Sửa"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:bg-destructive/10 cursor-pointer"
              onClick={() => setIsDeleteOpen(true)}
              disabled={course.status === "published" && !course.hasDraft}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa bản nháp của khóa học ?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Mọi dữ liệu liên quan sẽ bị xóa
              sạch.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete(course)}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground cursor-pointer"
            >
              Xóa ngay
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
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
    archived: 0,
  });
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const debouncedSearch = useDebounce(searchTerm, 500);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const params: filterTeacherCourseParams = {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: debouncedSearch || undefined,
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
        archived: counts.totalArchived,
      });

      setCourses(responseData.data);
      setTotalCourses(responseData.pagination.total);
      setPagination(responseData.pagination);
    } catch {
      toast.error("Lỗi khi tải trang.Vui lòng thử lại.Vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, selectedStatus, selectedSortBy]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleDelete = async (course: Course) => {
    try {
      if (
        (course.status === "published" || course.status === "archived") &&
        course.childCourseId
      ) {
        await handleDeletePublishedCourse(course.childCourseId);
      } else {
        await handleDeleteCourse(course.id);
      }
      toast.success("Xóa thành công");
      fetchCourses();
    } catch {
      toast.error("Lỗi khi xóa");
    }
  };

  return (
    <main className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Khóa Học của Tôi</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý và chỉnh sửa nội dung giảng dạy
          </p>
        </div>
        <Link href="/teacher/course/create">
          <Button size="lg" className="cursor-pointer">
            <Plus className="mr-2 h-4 w-4" /> Tạo Khóa Học
          </Button>
        </Link>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <SummaryCard label="Tổng Cộng" value={totalCourses} />
        <SummaryCard
          label="Đã Xuất Bản"
          value={groupedCourses.published}
          color="text-black-600"
        />
        <SummaryCard
          label="Chờ Duyệt"
          value={groupedCourses.pending}
          color="text-black-600"
        />
        <SummaryCard
          label="Nháp"
          value={groupedCourses.draft}
          color="text-black-600"
        />
        <SummaryCard
          label="Bị Từ Chối"
          value={groupedCourses.rejected}
          color="text-black-600"
        />
        <SummaryCard
          label="Bị Gỡ Xuống"
          value={groupedCourses.archived}
          color="text-black-600"
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
              <SelectItem className="cursor-pointer" value="all">
                Tất cả
              </SelectItem>
              <SelectItem className="cursor-pointer" value="published">
                Đã xuất bản
              </SelectItem>
              <SelectItem className="cursor-pointer" value="pending">
                Chờ duyệt
              </SelectItem>
              <SelectItem className="cursor-pointer" value="draft">
                Nháp
              </SelectItem>
              <SelectItem className="cursor-pointer" value="rejected">
                Bị từ chối
              </SelectItem>{" "}
              <SelectItem className="cursor-pointer" value="archived">
                Bị gỡ xuống
              </SelectItem>
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
      </Card>

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
                onDelete={() => handleDelete(course)}
              />
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <button
                onClick={() => setCurrentPage(Math.max(1, pagination.page - 1))}
                disabled={pagination.page === 1}
                className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex gap-1">
                {getPaginationRange(pagination.page, pagination.totalPages).map(
                  (page, index) => {
                    if (page === "...") {
                      return (
                        <span
                          key={`dots-${index}`}
                          className="w-10 h-10 flex items-center justify-center text-gray-400"
                        >
                          ...
                        </span>
                      );
                    }

                    return (
                      <button
                        key={index}
                        onClick={() => setCurrentPage(Number(page))}
                        className={`w-10 h-10 rounded-lg font-semibold transition-all cursor-pointer 
                        ${
                          pagination.page === page
                            ? "bg-violet-600 text-white shadow-lg"
                            : "border border-gray-300 text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  }
                )}
              </div>

              <button
                onClick={() =>
                  setCurrentPage(
                    Math.min(pagination.totalPages, pagination.page + 1)
                  )
                }
                disabled={pagination.page === pagination.totalPages}
                className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-all cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
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
