"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Loader,
} from "lucide-react";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  getDetailCourse,
  getLessonDetailForTeacher,
} from "@/redux/thunk/courseThunk";
import { useParams } from "next/navigation";
import { CommentSkeleton } from "@/components/ui/loading-skeleton";
import { getCommentsByLesson } from "@/redux/thunk/commentThunk";
import Image from "next/image";
import { handlePostComment } from "@/services/commentService";
import {
  extractPlaybackId,
  formatDurationVi,
  getInitials,
  getPaginationRange,
} from "@/lib/utils";
import MuxPlayer from "@mux/mux-player-react";

export default function LessonPage() {
  const params = useParams<{ id: string; lessonId: string }>();
  const courseId = params?.id;
  const lessonId = params?.lessonId;

  const {
    selectedCourse: course,
    selectedLesson: lesson,
    statusCourseDetail,
    statusLessonDetail,
  } = useSelector((state: RootState) => state.course);

  const {
    comments,
    pagination,
    status: statusComments,
  } = useSelector((state: RootState) => state.comment);

  const [expandedSections, setExpandedSections] = useState<string[]>(["1"]);
  const [quizAnswers, setQuizAnswers] = useState<{
    [questionId: string]: string;
  }>({});
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [commentTab, setCommentTab] = useState<"comments" | "quiz" | "notes">(
    "comments"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [comment, setComment] = useState("");
  const [openReplies, setOpenReplies] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const dispatch = useDispatch<AppDispatch>();
  const isLoading =
    (statusCourseDetail === "loading" && !course) ||
    (statusLessonDetail === "loading" && !lesson);

  const handleAddComment = async () => {
    if (!comment.trim()) return;

    await handlePostComment({
      content: comment,
      parentId: null,
      type: "lesson",
      targetId: lessonId,
    });
    setComment("");
    dispatch(getCommentsByLesson({ lessonId, page: currentPage, limit: 6 }));
  };

  const handleAddReply = async (parentId: string) => {
    const content = replyText[parentId];
    if (!content?.trim()) return;

    await handlePostComment({
      content,
      parentId,
      type: "lesson",
      targetId: lessonId,
    });

    setReplyText((prev) => ({ ...prev, [parentId]: "" }));

    dispatch(getCommentsByLesson({ lessonId, page: currentPage, limit: 6 }));
  };

  const handleToggleReplies = (commentId: string) => {
    setOpenReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleQuizAnswer = (questionId: string, optionId: string) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const getQuizScore = () => {
    if (!lesson?.quiz) return 0;

    let correct = 0;

    lesson.quiz.forEach((q) => {
      if (quizAnswers[q.id] === q.correctOptionId) {
        correct++;
      }
    });

    return Math.round((correct / lesson.quiz.length) * 100);
  };

  const getCorrectCount = () => {
    if (!lesson?.quiz) return 0;
    let correct = 0;
    lesson.quiz.forEach((q) => {
      if (quizAnswers[q.id] === q.correctOptionId) {
        correct++;
      }
    });

    return correct;
  };

  const toggleSection = (chapterId: string) => {
    setExpandedSections((prev) =>
      prev.includes(chapterId)
        ? prev.filter((id) => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const playbackId = useMemo(
    () => extractPlaybackId(lesson?.videoAsset?.originalUrl) || undefined,
    [lesson?.videoAsset?.originalUrl]
  );

  useEffect(() => {
    if (courseId && lessonId) {
      dispatch(getLessonDetailForTeacher({ courseId, lessonId }));
      dispatch(getDetailCourse(courseId));
    }
    if (lessonId) {
      dispatch(
        getCommentsByLesson({
          lessonId: lessonId,
          page: currentPage,
          limit: 6,
        })
      );
    }
  }, [courseId, lessonId, dispatch, currentPage]);

  if (isLoading) {
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm h-20 flex items-center">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <Link
            href={`/teacher/course/${params.id}`}
            className="inline-flex items-center gap-2 text-violet-600 hover:text-violet-700 font-semibold transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại khóa học
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-0 flex-1 overflow-hidden">
        <div className="bg-white border-r border-gray-200 overflow-y-auto hidden lg:flex flex-col">
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                Nội dung khóa học
              </h2>
            </div>

            <div className="space-y-2">
              {course?.chapters
                .slice()
                .sort((a, b) => a.order - b.order)
                .map((chapter) => (
                  <div key={chapter.id}>
                    <button
                      onClick={() => toggleSection(chapter.id)}
                      className="w-full border border-gray-200 rounded-lg p-3 hover:border-violet-300 hover:bg-violet-50 transition-all text-left"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer">
                          <ChevronDown
                            className={`w-4 h-4 text-violet-600 transition-transform duration-300 shrink-0 ${
                              expandedSections.includes(chapter.id)
                                ? "rotate-180"
                                : ""
                            }`}
                          />
                          <h3
                            className="font-semibold text-sm text-gray-800 truncate"
                            title={chapter.title}
                          >
                            {chapter.title}
                          </h3>
                        </div>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full whitespace-nowrap ml-2 shrink-0">
                          {chapter.lessons.length}
                        </span>
                      </div>
                    </button>

                    {expandedSections.includes(chapter.id) && (
                      <div className="space-y-1 p-2">
                        {chapter.lessons
                          .slice()
                          .sort((a, b) => a.order - b.order)
                          .map((les) => {
                            return (
                              <Link
                                key={les.id}
                                href={`/teacher/course/${course.id}/lessons/${les.id}`}
                                className={`flex items-center justify-between p-2 rounded-md border text-sm transition-colors ${
                                  les.id === lessonId
                                    ? "bg-violet-100 border-violet-300 font-semibold"
                                    : "border-gray-200 hover:bg-violet-50 hover:border-violet-200"
                                }`}
                                title={les.title}
                              >
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  <span className="text-xs truncate text-gray-700">
                                    {les.title}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                  {les.hasQuiz && (
                                    <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold">
                                      📝 Quiz
                                    </span>
                                  )}
                                  <span className="text-xs text-gray-500 shrink-0 whitespace-nowrap">
                                    {formatDurationVi(les.duration)}
                                  </span>
                                </div>
                              </Link>
                            );
                          })}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Main Lesson Content */}
        <div className="overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
            {/* Lesson Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {lesson?.title}
              </h1>
            </div>

            {/* Video Player */}
            <div className="mb-12 rounded-xl overflow-hidden shadow-lg bg-black">
              <MuxPlayer
                className="w-full aspect-video bg-black"
                playbackId={playbackId}
                metadata={{
                  player_name: "lms-video-player",
                  video_id: lesson?.id,
                }}
                accentColor="#dc2626"
                primaryColor="#FFFFFF"
                streamType="on-demand"
                onLoadedMetadata={(e) => {
                  const player = e.target as HTMLVideoElement;
                  const lastPosition = lesson?.progress?.lastPosition;
                  if (player && lastPosition !== undefined) {
                    player.currentTime = lastPosition;
                  }
                }}
                nohotkeys={true}
              />
            </div>

            {/* Lesson Content */}
            {lesson?.content && (
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-slate-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Giới thiệu bài học
                </h2>
                <div className="text-gray-700 leading-relaxed prose prose-slate max-w-none">
                  {lesson.content}
                </div>
              </div>
            )}

            {/* Tabs Comments/Quiz/Notes */}
            <div className="space-y-6">
              <div className="border-b border-gray-200">
                <div className="flex gap-8 overflow-x-auto">
                  <button
                    onClick={() => setCommentTab("comments")}
                    className={`pb-4 cursor-pointer px-2 font-semibold text-sm whitespace-nowrap transition-colors ${
                      commentTab === "comments"
                        ? "text-violet-600 border-b-2 border-violet-600"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Bình luận
                  </button>
                  {lesson?.hasQuiz && (
                    <button
                      onClick={() => setCommentTab("quiz")}
                      className={`pb-4 px-2 font-semibold text-sm whitespace-nowrap transition-colors ${
                        commentTab === "quiz"
                          ? "text-violet-600 border-b-2 border-violet-600"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      📝 Bài tập
                    </button>
                  )}
                </div>
              </div>

              {/* Comments Section */}
              {commentTab === "comments" && (
                <div className="bg-white rounded-xl shadow-lg p-8">
                  {statusComments === "loading" ? (
                    <CommentSkeleton count={3} />
                  ) : (
                    <>
                      <div className="mb-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                          Thêm bình luận
                        </h3>
                        <textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Chia sẻ ý kiến của bạn..."
                          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600 resize-none"
                          rows={4}
                        />
                        <button
                          onClick={handleAddComment}
                          className="mt-2 bg-violet-600 text-white px-6 py-2 rounded-lg hover:bg-violet-700 transition-all font-semibold cursor-pointer"
                        >
                          Đăng bình luận
                        </button>
                      </div>

                      {/* List of comments */}
                      <div className="space-y-6 border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-bold text-gray-900">
                          Bình luận
                        </h3>

                        {comments.map((c) => (
                          <div
                            key={c.id}
                            className="border-b border-gray-200 pb-6 last:border-0"
                          >
                            <div className="flex gap-4 mb-3">
                              <div className="w-12 h-12 rounded-full overflow-hidden relative">
                                {c.user.avatarUrl ? (
                                  <Image
                                    src={c.user.avatarUrl}
                                    alt={c.user.fullName || "User"}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-violet-600 to-purple-600 text-white font-semibold text-sm">
                                    {getInitials(c.user.fullName || "User")}
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="font-semibold text-gray-900">
                                    {c.user.fullName}
                                    {c.user.roleName && (
                                      <span className="ml-1 text-gray-500 font-normal">
                                        (
                                        {c.user.roleName.toLowerCase() ===
                                        "student"
                                          ? "Học viên"
                                          : c.user.roleName.toLowerCase() ===
                                              "teacher" ||
                                            c.user.roleName.toLowerCase() ===
                                              "instructor"
                                          ? "Giảng viên"
                                          : c.user.roleName === "admin"
                                          ? "Quản trị viên"
                                          : c.user.roleName}
                                        )
                                      </span>
                                    )}
                                  </h4>
                                  <span className="text-sm text-gray-500">
                                    {new Date(c.createdAt).toLocaleDateString(
                                      "vi-VN"
                                    )}
                                  </span>
                                </div>
                                <p className="text-gray-700">{c.content}</p>

                                {/* Show reply toggle */}
                                <div
                                  className="text-sm text-violet-600 hover:text-violet-700 mt-2 font-semibold cursor-pointer"
                                  onClick={() => handleToggleReplies(c.id)}
                                >
                                  Trả lời{" "}
                                  {c.replies && c.replies.length > 0
                                    ? `(${c.replies.length})`
                                    : ""}
                                </div>

                                {openReplies[c.id] && (
                                  <div className="ml-12 mt-2 space-y-2">
                                    {c.replies.map((r) => (
                                      <div key={r.id} className="flex gap-2">
                                        <div className="w-12 h-12 rounded-full overflow-hidden relative">
                                          {r.user.avatarUrl ? (
                                            <Image
                                              src={r.user.avatarUrl}
                                              alt={r.user.fullName || "User"}
                                              fill
                                              className="object-cover"
                                            />
                                          ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-violet-600 to-purple-600 text-white font-semibold text-sm">
                                              {getInitials(
                                                c.user.fullName || "User"
                                              )}
                                            </div>
                                          )}
                                        </div>
                                        <div className="flex-1">
                                          <div className="flex items-center justify-between">
                                            <h5 className="font-semibold text-gray-900 text-sm">
                                              {r.user.fullName}
                                              {r.user.roleName && (
                                                <span className="ml-1 text-gray-500 font-normal">
                                                  (
                                                  {r.user.roleName.toLowerCase() ===
                                                  "student"
                                                    ? "Học viên"
                                                    : r.user.roleName.toLowerCase() ===
                                                        "teacher" ||
                                                      r.user.roleName.toLowerCase() ===
                                                        "teacher"
                                                    ? "Giảng viên"
                                                    : r.user.roleName ===
                                                      "admin"
                                                    ? "Quản trị viên"
                                                    : r.user.roleName}
                                                  )
                                                </span>
                                              )}
                                            </h5>
                                            <span className="text-xs text-gray-500">
                                              {new Date(
                                                r.createdAt
                                              ).toLocaleDateString("vi-VN")}
                                            </span>
                                          </div>
                                          <p className="text-gray-700 text-sm">
                                            {r.content}
                                          </p>
                                        </div>
                                      </div>
                                    ))}

                                    {/* Input reply */}
                                    <div className="flex gap-2 items-start mt-2">
                                      <textarea
                                        rows={2}
                                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-600 resize-none"
                                        placeholder="Viết trả lời..."
                                        value={replyText[c.id] || ""}
                                        onChange={(e) =>
                                          setReplyText((prev) => ({
                                            ...prev,
                                            [c.id]: e.target.value,
                                          }))
                                        }
                                      />
                                      <button
                                        onClick={() => handleAddReply(c.id)}
                                        className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition-all cursor-pointer"
                                      >
                                        Trả lời
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                          <div className="flex justify-center items-center gap-2 mt-12">
                            <button
                              onClick={() =>
                                setCurrentPage(Math.max(1, currentPage - 1))
                              }
                              disabled={currentPage === 1}
                              className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 hover:scale-105 hover:shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                              <ChevronLeft className="w-5 h-5" />
                            </button>

                            <div className="flex gap-1">
                              {getPaginationRange(
                                pagination.page,
                                pagination.totalPages
                              ).map((page, index) => {
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
                              })}
                            </div>

                            <button
                              onClick={() =>
                                setCurrentPage(
                                  Math.min(
                                    pagination.totalPages,
                                    currentPage + 1
                                  )
                                )
                              }
                              disabled={currentPage === pagination.totalPages}
                              className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 hover:scale-105 hover:shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                              <ChevronRight className="w-5 h-5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Quiz Section */}
              {commentTab === "quiz" && lesson?.hasQuiz && (
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">
                    Bài tập
                  </h3>

                  {!showQuizResults ? (
                    <div className="space-y-8">
                      {lesson?.quiz?.map((q, index) => (
                        <div key={q.id} className="p-4 border rounded-lg mb-4">
                          <h4 className="font-semibold mb-2">
                            {index + 1}. {q.question}
                          </h4>

                          <div className="space-y-2">
                            {q.options.map((opt, optIndex) => (
                              <button
                                key={optIndex}
                                onClick={() => handleQuizAnswer(q.id, opt.id)}
                                className={`w-full text-left p-3 border rounded-lg flex items-center gap-2 ${
                                  quizAnswers[q.id] === opt.id
                                    ? "border-violet-500 bg-violet-50"
                                    : "border-gray-200 hover:bg-gray-100"
                                }`}
                              >
                                <span className="font-bold">
                                  {String.fromCharCode(65 + optIndex)}.
                                </span>
                                <span>{opt.text}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}

                      <button
                        onClick={() => setShowQuizResults(true)}
                        disabled={
                          Object.keys(quizAnswers).length <
                          (lesson?.quiz?.length || 0)
                        }
                        className="w-full bg-linear-to-r from-violet-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-violet-700 hover:to-purple-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Nộp bài
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg p-8 text-center border-2 border-blue-200">
                        <div className="mb-4">
                          <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
                        </div>
                        <h4 className="text-2xl font-bold text-blue-900 mb-2">
                          Hoàn thành !
                        </h4>
                        <p className="text-blue-700 text-lg font-bold mb-2">
                          Điểm của bạn: {getQuizScore()}%
                        </p>
                        <p className="text-blue-600">
                          Bạn trả lời đúng {getCorrectCount()} trên{" "}
                          {lesson?.quiz?.length} câu hỏi
                        </p>
                      </div>

                      <div className="space-y-6">
                        <h4 className="text-lg font-bold text-gray-900">
                          Xem lại câu trả lời
                        </h4>
                        {lesson?.quiz?.map((question, idx) => {
                          const userAnswer = quizAnswers[question.id];
                          const isCorrect =
                            userAnswer === question.correctOptionId;
                          return (
                            <div
                              key={question.id}
                              className={`border-2 rounded-lg p-6 ${
                                isCorrect
                                  ? "border-green-300 bg-green-50"
                                  : "border-red-300 bg-red-50"
                              }`}
                            >
                              <div className="flex items-start gap-3 mb-4">
                                {isCorrect ? (
                                  <CheckCircle className="w-6 h-6 text-green-600 shrink-0 mt-1" />
                                ) : (
                                  <XCircle className="w-6 h-6 text-red-600 shrink-0 mt-1" />
                                )}
                                <div className="flex-1">
                                  <h5
                                    className={`font-semibold mb-2 ${
                                      isCorrect
                                        ? "text-green-900"
                                        : "text-red-900"
                                    }`}
                                  >
                                    {idx + 1}. {question.question}
                                  </h5>
                                  <p
                                    className={`text-sm mb-2 ${
                                      isCorrect
                                        ? "text-green-700"
                                        : "text-red-700"
                                    }`}
                                  >
                                    {isCorrect ? "Đúng" : "Sai"}
                                  </p>
                                </div>
                              </div>

                              <div className="space-y-2 ml-9">
                                {question.options.map((option, optIdx) => {
                                  const isUserAnswer = userAnswer === option.id;
                                  const iscorrectOptionId =
                                    option.id === question.correctOptionId;
                                  return (
                                    <div
                                      key={optIdx}
                                      className={`flex items-center gap-2 p-2 rounded ${
                                        iscorrectOptionId
                                          ? "bg-green-200 text-green-900"
                                          : isUserAnswer && !isCorrect
                                          ? "bg-red-200 text-red-900"
                                          : "text-gray-700"
                                      }`}
                                    >
                                      <span className="font-bold">
                                        {String.fromCharCode(65 + optIdx)}.
                                      </span>
                                      <span>{option.text}</span>

                                      {iscorrectOptionId && (
                                        <CheckCircle className="w-5 h-5 shrink-0" />
                                      )}
                                      {isUserAnswer && !isCorrect && (
                                        <XCircle className="w-5 h-5 shrink-0" />
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => {
                          setShowQuizResults(false);
                          setQuizAnswers({});
                        }}
                        className="w-full bg-violet-600 text-white px-6 py-3 rounded-lg hover:bg-violet-700 transition-all font-semibold"
                      >
                        Làm lại
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
