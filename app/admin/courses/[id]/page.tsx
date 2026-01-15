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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import {
  ArrowLeft,
  Edit,
  Clock,
  Star,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Video,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import DiscountCountdown from "@/components/ui/discountCountDown";
import { useEffect, useState } from "react";
import { formatDurationVi } from "@/lib/utils";
import {
  Chapter,
  CourseDetail,
  Lesson,
  Pagination,
} from "@/types/course/course";
import {
  handleGetTeacherCourseDetail,
  handleGetTeacherCourseStudentProgress,
} from "@/services/courseService";
import { useParams } from "next/navigation";
import { UserAvatar } from "@/components/ui/avatar-cop";
import { Comment } from "@/types/comment/comment";
import { handleGetCommentsByCourse } from "@/services/commentService";
import toast from "react-hot-toast";

export interface UserProgressInfo {
  userId: string;
  fullName: string;
  email: string;
  avatar: string | null;
}
export interface StudentProgressItem {
  user: UserProgressInfo;
  progressPercentage: number;
}
export interface ProgressData {
  data: StudentProgressItem[];
  pagination: Pagination;
}

export default function CourseDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [studentList, setStudentList] = useState<StudentProgressItem[]>([]);
  const [paginationS, setPaginationS] = useState<Pagination | null>(null);
  const [currentPageS, setCurrentPageS] = useState(1);
  const [commentCourse, setCommentCourse] = useState<Comment[]>([]);
  const [paginationC, setPaginationC] = useState<Pagination | null>(null);
  const [currentPageC, setCurrentPageC] = useState(1);

  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        const res = await handleGetTeacherCourseDetail(id);
        setCourse(res);
        if (res.status === "published") {
          const res1: ProgressData =
            await handleGetTeacherCourseStudentProgress({
              courseId: id,
              page: currentPageS,
              limit: 6,
            });
          setStudentList(res1.data);
          setPaginationS(res1.pagination);
          const res2 = await handleGetCommentsByCourse(id, currentPageC, 6);
          setCommentCourse(res2.data);
          setPaginationC(res2.pagination);
        }
      } catch {
        toast.error(
          "Đã xảy ra lỗi khi tải khóa học của bạn. Vui lòng thử lại!",
          {
            duration: 4000,
          }
        );
      }
    };
    fetchCourseDetail();
  }, [id, currentPageS, currentPageC]);

  if (!course) {
    return (
      <main className="flex-1 flex items-center justify-center h-screen">
        <div className="text-xl font-semibold text-muted-foreground">
          Đang tải dữ liệu khóa học...
        </div>
      </main>
    );
  }

  let totalLessons = 0;
  course.chapters.forEach((chapter) => {
    totalLessons += chapter.lessons.length;
  });

  const formattedDuration = course.duration
    ? formatDurationVi(course.duration)
    : "0 phút";

  const courseDisplayData = {
    ...course,
    lessons: totalLessons,
    duration: formattedDuration,
    rating: course.rating ? Number(course.rating).toFixed(2) : "0.00",
    students: course.students,
  };

  const isPublished = courseDisplayData.status === "published";

  return (
    <main className="flex-1 overflow-auto">
      <div className="max-w-6xl mx-auto p-8 space-y-8">
        {/* Header with Image */}
        <div className="flex flex-col md:flex-row gap-6 pb-6 border-b">
          <div className="md:w-1/3">
            {courseDisplayData.image ? (
              <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted">
                <Image
                  src={courseDisplayData.image}
                  alt={courseDisplayData.title}
                  fill
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full h-48 rounded-lg bg-muted flex items-center justify-center">
                <div className="text-center">
                  <BookOpen className="h-8 w-8 text-gray-400 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Chưa có ảnh</p>
                </div>
              </div>
            )}
          </div>

          <div className="md:w-2/3 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge>{courseDisplayData.level}</Badge>
                <Badge variant="outline">
                  {courseDisplayData.category}
                </Badge>{" "}
                {/* Đảm bảo category có categoryName */}
                {courseDisplayData.status && (
                  <Badge
                    variant={
                      courseDisplayData.status === "draft"
                        ? "destructive"
                        : "default"
                    }
                  >
                    {courseDisplayData.status === "draft"
                      ? "Bản Nháp"
                      : "Đã Xuất Bản"}
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold text-foreground">
                {courseDisplayData.title}
              </h1>
              <p className="text-muted-foreground mt-2">
                {courseDisplayData.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mt-4 items-end">
              <div className="relative">
                <div className="flex items-baseline gap-3 mb-4">
                  <div className="flex-1">
                    <div className="flex items-baseline gap-3">
                      {/* Logic hiển thị giá sau giảm giá */}
                      {courseDisplayData.discount &&
                      courseDisplayData.discountExpiresAt &&
                      new Date(courseDisplayData.discountExpiresAt) >
                        new Date() &&
                      course.price ? (
                        <>
                          <span className="text-5xl font-extrabold text-black bg-clip-text">
                            {courseDisplayData.price?.toLocaleString() ?? "0"}₫
                          </span>
                          <span className="text-xl text-gray-400 line-through font-medium">
                            {courseDisplayData.originalPrice.toLocaleString()}₫
                          </span>
                        </>
                      ) : (
                        <span className="text-5xl font-extrabold text-black bg-clip-text">
                          {courseDisplayData.originalPrice?.toLocaleString() ??
                            "N/A"}
                          ₫
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-15">
                {courseDisplayData.discount &&
                courseDisplayData.discountExpiresAt &&
                new Date(courseDisplayData.discountExpiresAt) > new Date() ? (
                  <DiscountCountdown
                    discount={courseDisplayData.discount}
                    discountExpiresAt={courseDisplayData.discountExpiresAt}
                  />
                ) : (
                  <div className="h-full"></div>
                )}
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-2 mt-4">
              <Link href="/teacher/course">
                <Button variant="ghost" className="cursor-pointer">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Quay Lại
                </Button>
              </Link>
              <Link href={`/teacher/course/${id}/edit`}>
                <Button className="cursor-pointer">
                  <Edit className="mr-2 h-4 w-4" />
                  Chỉnh Sửa
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {isPublished && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Học sinh</p>
                <p className="text-2xl font-bold text-foreground">
                  {(courseDisplayData.students ?? 0).toLocaleString()}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Đánh giá</p>
                <p className="text-2xl font-bold text-foreground">
                  {courseDisplayData.rating}★({course.ratingCount})
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Bài học</p>
                <p className="text-2xl font-bold text-foreground">
                  {courseDisplayData.lessons}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Thời lượng</p>
                <p className="text-2xl font-bold text-foreground">
                  {formattedDuration || "N/A"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Doanh thu</p>
                <p className="text-2xl font-bold text-foreground">
                  {course.revenue != null
                    ? course.revenue.toLocaleString() + "₫"
                    : "N/A"}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs
          defaultValue={isPublished ? "lessons" : "lessons"}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger className="cursor-pointer" value="lessons">
              Bài Học
            </TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="description">
              Mô tả/Yêu cầu
            </TabsTrigger>
            <TabsTrigger
              className="cursor-pointer"
              value="students"
              disabled={!isPublished}
            >
              Học Sinh
            </TabsTrigger>
            <TabsTrigger
              className="cursor-pointer"
              value="reviews"
              disabled={!isPublished}
            >
              Đánh Giá
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lessons" className="space-y-4">
            <CourseCurriculum courseId={id} chapters={course.chapters} />
          </TabsContent>

          {/* Tab Mô tả/Yêu cầu */}
          <TabsContent value="description" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Giới thiệu bài học</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    {courseDisplayData.description}
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Những gì bạn sẽ học</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {(courseDisplayData.learnings ?? []).map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Yêu cầu</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {(courseDisplayData.requirements ?? []).map(
                      (item, index) => (
                        <li key={index}>{item}</li>
                      )
                    )}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {isPublished && (
            <TabsContent value="students" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Danh sách học sinh</CardTitle>
                  <CardDescription>
                    {(courseDisplayData.students ?? 0).toLocaleString()} học
                    sinh đã đăng ký
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {studentList.length > 0 ? (
                      studentList.map((item) => (
                        <div
                          key={item.user.userId}
                          className="flex items-center justify-between p-4 rounded-lg border"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                              <UserAvatar
                                fullName={item.user.fullName || "User"}
                                avatarUrl={item.user.avatar}
                                size={64}
                              />
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">
                                {item.user.fullName}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {item.user.email}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-foreground">
                              {item.progressPercentage.toFixed(2)}%
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Hoàn thành
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-4">
                        Khóa học này chưa có học sinh nào đăng ký.
                      </p>
                    )}
                    {paginationS && paginationS.totalPages > 1 && (
                      <div className="flex justify-center items-center gap-2 mt-12">
                        <button
                          onClick={() =>
                            setCurrentPageS(Math.max(1, paginationS.page - 1))
                          }
                          disabled={paginationS.page === 1}
                          className="p-2 rounded-lg border border-gray-300 text-gray-600 
                 hover:bg-gray-100 hover:scale-105 hover:shadow-md 
                 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed 
                 transition-all"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>

                        <div className="flex gap-1">
                          {Array.from(
                            { length: paginationS.totalPages },
                            (_, i) => i + 1
                          ).map((page) => (
                            <button
                              key={page}
                              onClick={() => setCurrentPageS(page)}
                              className={`w-10 h-10 rounded-lg font-semibold transition-all cursor-pointer 
              ${
                currentPageS === page
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
                            setCurrentPageS(
                              Math.min(
                                paginationS.totalPages,
                                paginationS.page + 1
                              )
                            )
                          }
                          disabled={currentPageS === paginationS.totalPages}
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
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {isPublished && (
            <TabsContent value="reviews" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Đánh giá khóa học</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {commentCourse && commentCourse.length > 0 ? (
                    commentCourse.map((review) => (
                      <div
                        key={review.id}
                        className="border border-gray-200 rounded-xl p-6 hover:border-violet-300 transition-colors"
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <UserAvatar
                            fullName={review.user.fullName || "User"}
                            avatarUrl={review.user.avatarUrl}
                            size={64}
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-gray-800">
                                {review.user.fullName}
                              </h3>
                              <span className="text-sm text-gray-500">
                                {review.createdAt.slice(0, 10)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 mb-3">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < (review.rating ?? 0)
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-gray-700">{review.content}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">Chưa có đánh giá nào.</p>
                  )}
                  {paginationC && paginationC.totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-12">
                      <button
                        onClick={() =>
                          setCurrentPageC(Math.max(1, paginationC.page - 1))
                        }
                        disabled={paginationC.page === 1}
                        className="p-2 rounded-lg border border-gray-300 text-gray-600 
                 hover:bg-gray-100 hover:scale-105 hover:shadow-md 
                 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed 
                 transition-all"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>

                      <div className="flex gap-1">
                        {Array.from(
                          { length: paginationC.totalPages },
                          (_, i) => i + 1
                        ).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPageC(page)}
                            className={`w-10 h-10 rounded-lg font-semibold transition-all cursor-pointer 
              ${
                currentPageC === page
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
                          setCurrentPageC(
                            Math.min(
                              paginationC.totalPages,
                              paginationC.page + 1
                            )
                          )
                        }
                        disabled={currentPageC === paginationC.totalPages}
                        className="p-2 rounded-lg border border-gray-300 text-gray-600 
                 hover:bg-gray-100 hover:scale-105 hover:shadow-md 
                 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed 
                 transition-all"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </main>
  );
}

const CourseCurriculum = ({
  chapters,
  courseId,
}: {
  chapters: Chapter[];
  courseId: string;
}) => {
  const sortedChapters = [...chapters].sort((a, b) => a.order - b.order);

  const [openChapterIds, setOpenChapterIds] = useState<string[]>([]);

  const toggleChapter = (chapterId: string) => {
    setOpenChapterIds((prevIds) =>
      prevIds.includes(chapterId)
        ? prevIds.filter((id) => id !== chapterId)
        : [...prevIds, chapterId]
    );
  };

  const getLessonDuration = (lesson: Lesson) => {
    const durationInSeconds =
      lesson.videoAsset?.duration || lesson.duration || 0;
    return formatDurationVi(durationInSeconds);
  };

  const isChapterOpen = (chapterId: string) =>
    openChapterIds.includes(chapterId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nội dung khóa học</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sortedChapters.map((chapter) => (
          <div key={chapter.id} className="border rounded-lg overflow-hidden">
            <div
              className="flex items-center justify-between p-4 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
              onClick={() => toggleChapter(chapter.id)}
            >
              <div className="flex items-center gap-3">
                {isChapterOpen(chapter.id) ? (
                  <ChevronUp className="h-5 w-5 text-primary" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-primary" />
                )}
                <h3 className="font-semibold text-foreground">
                  {chapter.title}
                </h3>
              </div>
              <div className="text-sm text-muted-foreground hidden sm:block">
                {chapter.lessons.length} bài học
              </div>
            </div>

            {isChapterOpen(chapter.id) && (
              <div className="border-t">
                {chapter.lessons
                  .sort((a, b) => a.order - b.order)
                  .map((lesson) => (
                    <Link
                      key={lesson.id}
                      href={`/teacher/course/${courseId}/lessons/${lesson.id}`}
                      className="flex items-center justify-between p-4 pl-12 hover:bg-accent/50 transition-colors border-b last:border-b-0 cursor-pointer group"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex-1">
                          <h4 className="font-normal text-foreground">
                            {lesson.title}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {lesson.content.substring(0, 50)}
                            {lesson.content.length > 50 ? "..." : ""}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {lesson.canViewVideo && (
                          <Badge variant="secondary" className="mr-2">
                            <Video className="h-3 w-3" />
                          </Badge>
                        )}
                        {lesson.hasQuiz && (
                          <Badge variant="secondary" className="mr-2">
                            Quiz
                          </Badge>
                        )}
                        <p className="text-sm text-muted-foreground inline-flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {getLessonDuration(lesson)}
                        </p>
                      </div>
                    </Link>
                  ))}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
