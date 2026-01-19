"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  BookOpen,
  Eye,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader,
  MessageSquareText,
  Download,
} from "lucide-react";

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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

import {
  handleApproveChildCourse,
  handleDeleteCourse,
  handleGetAdminCourseCounts,
  handleGetAdminFilteredCourses,
  handleUpdateCourse,
} from "@/services/courseService";
import {
  Course,
  filterTeacherCourseParams,
  Pagination,
} from "@/types/course/course";
import DiscountCountdown from "@/components/ui/discountCountDown";
import {
  formatDurationVi,
  getLevelBadgeColor,
  getPaginationRange,
  getStatusBadge,
} from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const ITEMS_PER_PAGE = 6;

interface CourseCardProps {
  course: Course;
  onDelete: (id: string) => Promise<void>;
  onApprove: (course: Course) => Promise<void>;
  onReject: (course: Course, rejectReason: string) => Promise<void>;
  onUnpublish: (course: Course, reason: string) => Promise<void>;
}

const CourseCard = ({
  course,
  onDelete,
  onApprove,
  onReject,
  onUnpublish,
}: CourseCardProps) => {
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isUnpublishOpen, setIsUnpublishOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [rejectReason, setRejectReason] = useState("");
  const [unpublishReason, setUnpublishReason] = useState("");

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

  const effectiveArchiveReason =
    course.status === "archived" ? course.archiveReason : null;

  return (
    <>
      <Card className="flex flex-col h-full hover:shadow-lg transition-shadow overflow-hidden">
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
                displayLevel,
              )}`}
            >
              {displayLevel}
            </Badge>
          )}
        </div>

        <CardHeader className="space-y-2 p-4 pb-0">
          <div className="flex items-start justify-between gap-2 min-h-10">
            {(() => {
              const badge = getStatusBadge(course, true);
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
                              Ghi chú từ giảng viên
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
          <CardDescription className="line-clamp-1 text-xs font-bold mt-2">
            Giảng viên: {course.instructor || "N/A"}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 pt-4 flex flex-col flex-1 justify-between space-y-4">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm border-t pt-4">
            <StatBox label="Học sinh" value={course.students ?? 0} />
            <StatBox label="Danh mục" value={course.category ?? ""} truncate />
            <StatBox
              label="Đánh giá"
              value={course.rating ? `${course.rating}` : "N/A"}
            />
            <StatBox
              label="Thời lượng"
              value={formatDurationVi(course.duration ?? 0) || "0s"}
            />
            <StatBox
              label="Doanh thu"
              value={`${course.revenue?.toLocaleString() || 0}₫`}
            />
            <StatBox
              label="Thực nhận"
              value={`${course.platformProfit?.toLocaleString() || 0}₫`}
            />
          </div>

          <div className="flex flex-wrap gap-2 pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="flex-1 cursor-pointer"
            >
              <Link href={`/admin/courses/${course.id}`}>
                <Eye className="h-4 w-4 mr-1" /> Xem
              </Link>
            </Button>

            {(course.status === "published" || course.status === "archived") &&
              course.childCourseId &&
              course.childCourseStatus === "pending" && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="flex-1 cursor-pointer"
                  >
                    <Link href={`/admin/courses/${course.childCourseId}`}>
                      <Eye className="h-4 w-4 mr-1" /> Xem bản chờ duyệt
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 cursor-pointer"
                    onClick={() => setIsApproveOpen(true)}
                  >
                    Duyệt bản cập nhật
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 cursor-pointer"
                    onClick={() => setIsRejectOpen(true)}
                  >
                    Từ chối bản cập nhật
                  </Button>
                </>
              )}

            {course.status === "pending" && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 cursor-pointer"
                  onClick={() => setIsApproveOpen(true)}
                >
                  Duyệt
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 cursor-pointer"
                  onClick={() => setIsRejectOpen(true)}
                >
                  Từ chối
                </Button>
              </>
            )}

            {course.status === "published" && !course.childCourseId && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 cursor-pointer"
                onClick={() => setIsUnpublishOpen(true)}
              >
                Gỡ xuống
              </Button>
            )}

            {course.status === "published" &&
              course.childCourseId &&
              course.childCourseStatus === "rejected" && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="flex-1 cursor-pointer"
                  >
                    <Link href={`/admin/courses/${course.childCourseId}`}>
                      <Eye className="h-4 w-4 mr-1" /> Xem bản duyệt bị từ chối
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 cursor-pointer"
                    onClick={() => setIsUnpublishOpen(true)}
                  >
                    Gỡ xuống
                  </Button>
                </>
              )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Phê duyệt khóa học?</AlertDialogTitle>

            {currentDraft?.submissionNote && (
              <div className="bg-white-50  p-3 my-2 text-left">
                <p className="text-[10px] font-bold  uppercase">
                  Ghi chú từ giảng viên:
                </p>
                <p className="text-sm italic whitespace-pre-wrap">
                  {currentDraft.submissionNote}
                </p>
              </div>
            )}

            <AlertDialogDescription>
              Khóa học này sẽ được xuất bản và hiển thị công khai tới tất cả học
              viên.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onApprove(course)}
              className="text-bold text-white cursor-pointer"
            >
              Xác nhận duyệt
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lý do từ chối khóa học</DialogTitle>
            <DialogDescription>
              Vui lòng cung cấp lý do cụ thể để giảng viên có thể sửa đổi nội
              dung.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Nội dung không đạt yêu cầu về chất lượng âm thanh..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="min-h-25"
          />
          <DialogFooter>
            <Button
              className="cursor-pointer"
              variant="outline"
              onClick={() => setIsRejectOpen(false)}
            >
              Hủy
            </Button>
            <Button
              className="text-bold text-white cursor-pointer"
              onClick={() => {
                if (!rejectReason.trim())
                  return toast.error("Vui lòng nhập lý do");
                onReject(course, rejectReason);
                setRejectReason("");
                setIsRejectOpen(false);
              }}
            >
              Xác nhận từ chối
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 3. Gỡ xuống (Dialog with Textarea) */}
      <Dialog open={isUnpublishOpen} onOpenChange={setIsUnpublishOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-bold">Lý do gỡ khóa học</DialogTitle>
            <DialogDescription>
              Khóa học sẽ bị ẩn khỏi hệ thống. Những học sinh đã mua khóa học
              vẫn được học tiếp nhưng không hiển thị để cho học sinh mua. Vui
              lòng nhập lý do gỡ xuống.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Yêu cầu gỡ bỏ do nội dung lỗi thời hoặc vi phạm chính sách..."
            value={unpublishReason}
            onChange={(e) => setUnpublishReason(e.target.value)}
            className="min-h-25"
          />
          <DialogFooter>
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => setIsUnpublishOpen(false)}
            >
              Hủy
            </Button>
            <Button
              className="text-bold text-white cursor-pointer"
              onClick={() => {
                if (!unpublishReason.trim())
                  return toast.error("Vui lòng nhập lý do gỡ");
                onUnpublish(course, unpublishReason);
                setIsUnpublishOpen(false);
              }}
            >
              Xác nhận gỡ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa vĩnh viễn khóa học?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Mọi dữ liệu liên quan sẽ bị xóa
              sạch.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete(course.id)}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
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
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedSortBy, setSelectedSortBy] = useState("newest");
  const [groupedCourses, setGroupedCourses] = useState({
    all: 0,
    published: 0,
    pending: 0,
    rejected: 0,
    archived: 0,
  });
  const [pagination, setPagination] = useState<Pagination | null>(null);

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
        handleGetAdminCourseCounts(),
        handleGetAdminFilteredCourses({ params }),
      ]);

      setGroupedCourses({
        all: counts.totalAll,
        published: counts.totalPublished,
        pending: counts.totalPending,
        rejected: counts.totalRejected,
        archived: counts.totalArchived,
      });
      setCourses(responseData.data);
      setPagination(responseData.pagination);
    } catch {
      toast.error("Lỗi khi tải danh sách.Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, selectedStatus, selectedSortBy]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleDelete = async (courseId: string) => {
    try {
      await handleDeleteCourse(courseId);
      toast.success("Xóa thành công");
      fetchCourses();
    } catch {
      toast.error("Lỗi khi xóa");
    }
  };

  const handleApprove = async (course: Course) => {
    try {
      if (course.status === "pending") {
        await handleUpdateCourse({
          id: course.id,
          status: "published",
          isLive: true,
        });
      } else if (
        course.childCourseStatus === "pending" &&
        course.childDrafts &&
        course.childCourseId
      ) {
        await handleApproveChildCourse(course.childCourseId);
      }
      toast.success("Đã phê duyệt khóa học");
      fetchCourses();
    } catch {
      toast.error("Lỗi khi phê duyệt");
    }
  };

  const handleReject = async (course: Course, rejectReason: string) => {
    try {
      if (course.status === "pending") {
        await handleUpdateCourse({
          id: course.id,
          status: "rejected",
          rejectionReason: rejectReason,
        });
      } else if (
        course.childCourseStatus === "pending" &&
        course.childDrafts &&
        course.childCourseId
      ) {
        await handleUpdateCourse({
          id: course.childCourseId,
          status: "rejected",
          rejectionReason: rejectReason,
        });
      }
      toast.success("Đã từ chối khóa học");
      fetchCourses();
    } catch {
      toast.error("Lỗi khi từ chối");
    }
  };

  const handleUnpublish = async (course: Course, reason: string) => {
    try {
      await handleUpdateCourse({
        id: course.id,
        status: "archived",
        archiveReason: reason,
      });
      toast.success("Đã gỡ khóa học");
      fetchCourses();
    } catch {
      toast.error("Lỗi khi gỡ");
    }
  };

  return (
    <main className="p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Quản Lý Khóa Học </h1>
        <p className="text-muted-foreground mt-1">
          Hệ thống xét duyệt và kiểm soát nội dung giảng dạy
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <SummaryCard label="Tổng Cộng" value={groupedCourses.all} />
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
              <SelectItem className="cursor-pointer" value="rejected">
                Bị từ chối
              </SelectItem>
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
                onDelete={handleDelete}
                onApprove={() => handleApprove(course)}
                onReject={(course, reason) => handleReject(course, reason)}
                onUnpublish={(course, reason) =>
                  handleUnpublish(course, reason)
                }
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
                  (page, index) => (
                    <button
                      key={index}
                      disabled={page === "..."}
                      onClick={() =>
                        page !== "..." && setCurrentPage(Number(page))
                      }
                      className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                        page === "..."
                          ? "cursor-default text-gray-400"
                          : "cursor-pointer"
                      } ${
                        pagination.page === page
                          ? "bg-violet-600 text-white shadow-lg"
                          : "border border-gray-300 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}
              </div>

              <button
                onClick={() =>
                  setCurrentPage(
                    Math.min(pagination.totalPages, pagination.page + 1),
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
