"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Play, ChevronDown, ChevronUp, Save } from "lucide-react";
import { ImageUploader } from "@/components/teacher/image-uploader";
import { VideoUploader } from "@/components/teacher/video-uploader";
import { QuizEditor } from "@/components/teacher/quiz-editor";
import { v4 as uuidv4 } from "uuid";
import {
  Chapter,
  CreateCourseDto,
  Lesson,
  QuizQuestion,
} from "@/types/course/course";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { getAllCategories } from "@/redux/thunk/categoryThunk";
import { cleanFormData, formatDurationVi } from "@/lib/utils";
import {
  handleCreateCourse,
  handleGetTeacherCourseEdit,
  handleUpdateCourse,
} from "@/services/courseService";
import {
  handleCreateChapter,
  handleDeleteChapter,
  handleUpdateChapter,
} from "@/services/chapterService";
import toast from "react-hot-toast";
import {
  handleCreateLesson,
  handleDeleteLesson,
  handleUpdateLesson,
} from "@/services/lessonService";
import { handleUpdateQuizQuestion } from "@/services/quizService";

interface ICategory {
  categoryId: string;
  categoryName: string;
}

function ArrayInput({
  label,
  values,
  onChange,
}: {
  label: string;
  values: string[];
  onChange: (val: string[]) => void;
}) {
  const [input, setInput] = useState("");

  const addItem = () => {
    if (!input.trim()) return;
    onChange([...values, input.trim()]);
    setInput("");
  };

  const removeItem = (idx: number) => {
    const newArr = values.filter((_, i) => i !== idx);
    onChange(newArr);
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Nhập ${label.toLowerCase()}`}
        />
        <Button onClick={addItem} type="button" className="cursor-pointer">
          Thêm
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        {values.map((item, idx) => (
          <div
            key={idx}
            className="px-3 py-1 bg-accent rounded-full flex items-center gap-2"
          >
            <span>{item}</span>
            <button
              onClick={() => removeItem(idx)}
              type="button"
              className="text-red-500 text-sm"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CreateEditCoursePage({
  isEditMode,
  id,
}: {
  isEditMode: boolean;
  id?: string;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, status: categoryStatus } = useSelector(
    (state: RootState) => state.category
  );
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"basic" | "chapters">("basic");
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentChapterId, setCurrentChapterId] = useState<string | null>(null);
  const [expandedLessonId, setExpandedLessonId] = useState<string | null>(null);
  const [courseId, setCourseId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateCourseDto>({
    title: "",
    description: "",
    requirements: [],
    learnings: [],
    category: "",
    level: "Cơ Bản",
    originalPrice: "",
    hasDiscount: false,
    price: "",
    discountExpiresAt: "",
    image: "",
    status: "",
  });

  const validateBasicInfo = () => {
    const {
      title,
      description,
      requirements,
      learnings,
      originalPrice,
      price,
    } = formData;

    return Boolean(
      (title && title.trim() !== "") ||
        (description && description.trim() !== "") ||
        (requirements && requirements.length > 0) ||
        (learnings && learnings.length > 0) ||
        (originalPrice && originalPrice.trim() !== "") ||
        (price && price.trim() !== "")
    );
  };

  const canPublish = () => {
    if (!validateBasicInfo()) return false;
    if (chapters.length === 0) return false;
    for (const ch of chapters) {
      if (ch.lessons.length === 0) return false;
    }
    return true;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addChapter = async (courseId: string) => {
    const chapterId = uuidv4();
    const newOrder = chapters.length + 1;
    const newTitle = `Chương ${newOrder}`;

    const newChapter: Chapter = {
      id: chapterId,
      title: newTitle,
      order: newOrder,
      lessons: [],
    };
    const loadingToastId = toast.loading("Đang tạo chương mới...");
    try {
      await handleCreateChapter(courseId, chapterId, newTitle, newOrder);
      toast.success("Tạo chương mới thành công!", {
        id: loadingToastId,
      });
      setChapters([...chapters, newChapter]);
      setCurrentChapterId(newChapter.id);
    } catch (error) {
      console.error("Lỗi khi tạo chapter:", error);
      toast.error("Lỗi: Không thể tạo chương mới.", {
        id: loadingToastId,
      });
    }
  };

  const handleSaveChapter = async (currentChapter: Chapter) => {
    const { id, title, order } = currentChapter;

    try {
      await handleUpdateChapter(id, title, order);
      toast.success("Cập nhật chương thành công!");
    } catch (error) {
      console.error(error);
      toast.error("Lỗi: Không thể cập nhật chương.");
    }
  };

  const updateChapter = (id: string, title: string) => {
    setChapters(chapters.map((ch) => (ch.id === id ? { ...ch, title } : ch)));
  };

  const deleteChapter = async (id: string) => {
    if (!courseId) {
      toast.error("Không thể xóa chương. Thiếu ID khóa học.");
      return;
    }

    const chapterToDelete = chapters.find((ch) => ch.id === id);
    if (!chapterToDelete) {
      toast.error("Không tìm thấy chương để xóa.");
      return;
    }

    const loadingToastId = toast.loading(
      `Đang xóa chương "${chapterToDelete.title}"...`
    );

    try {
      await handleDeleteChapter(id);
      const newChapters = chapters.filter((ch) => ch.id !== id);
      setChapters(newChapters);
      if (currentChapterId === id) {
        setCurrentChapterId(newChapters[0]?.id || null);
      }
      toast.success(`Đã xóa chương "${chapterToDelete.title}" thành công!`, {
        id: loadingToastId,
      });
    } catch (error) {
      console.error("Lỗi khi xóa chapter:", error);
      toast.error("Lỗi: Không thể xóa chương. Vui lòng thử lại.", {
        id: loadingToastId,
      });
    }
  };

  const addLesson = async (chapterId: string) => {
    const currentChapter = chapters.find((ch) => ch.id === chapterId);
    if (!currentChapter) {
      toast.error("Không tìm thấy chương để thêm bài học.");
      return;
    }

    const tempId = uuidv4();
    const newOrder = currentChapter.lessons.length + 1;
    const defaultTitle = `Bài học ${newOrder}`;

    const loadingToastId = toast.loading(`Đang tạo bài học `);

    try {
      const createdLesson = await handleCreateLesson(
        chapterId,
        tempId,
        defaultTitle,
        "",
        0,
        undefined,
        newOrder
      );

      setChapters(
        chapters.map((ch) =>
          ch.id === chapterId
            ? {
                ...ch,
                lessons: [...ch.lessons, createdLesson],
              }
            : ch
        )
      );
      toast.success(`Tạo bài học "${createdLesson.title}" thành công!`, {
        id: loadingToastId,
      });
    } catch (error) {
      console.error("Lỗi khi tạo bài học:", error);
      toast.error("Lỗi: Không thể tạo bài học. Vui lòng thử lại.", {
        id: loadingToastId,
      });
    }
  };

  const updateLesson = (
    chapterId: string,
    lessonId: string,
    updates: Partial<Lesson>
  ) => {
    setChapters(
      chapters.map((ch) =>
        ch.id === chapterId
          ? {
              ...ch,
              lessons: ch.lessons.map((l) =>
                l.id === lessonId ? { ...l, ...updates } : l
              ),
            }
          : ch
      )
    );
  };

  const deleteLesson = async (chapterId: string, lessonId: string) => {
    if (!chapterId || !lessonId) {
      toast.error("Không thể xóa bài học. Thiếu ID chương hoặc bài học.");
      return;
    }

    const originalChapters = chapters;
    let deletedLessonTitle = "";

    setChapters(
      chapters.map((ch) => {
        if (ch.id === chapterId) {
          const lessonToDelete = ch.lessons.find((l) => l.id === lessonId);
          if (lessonToDelete) {
            deletedLessonTitle = lessonToDelete.title || "bài học không tên";
          }
          return {
            ...ch,
            lessons: ch.lessons.filter((l) => l.id !== lessonId),
          };
        }
        return ch;
      })
    );

    const loadingToastId = toast.loading(
      `Đang xóa bài học "${deletedLessonTitle}"...`
    );

    try {
      await handleDeleteLesson(lessonId);

      toast.success(`Đã xóa bài học "${deletedLessonTitle}" thành công!`, {
        id: loadingToastId,
      });
    } catch (error) {
      console.error("Lỗi khi xóa bài học:", error);
      setChapters(originalChapters); // Rollback
      toast.error(
        "Lỗi: Không thể xóa bài học trên server. Đã khôi phục trạng thái.",
        {
          id: loadingToastId,
        }
      );
    }
  };

  const handleSaveLesson = async (
    chapterId: string,
    lessonId: string,
    updates: Partial<Lesson>
  ) => {
    let updatedLesson: Lesson | undefined;
    setChapters(
      chapters.map((ch) =>
        ch.id === chapterId
          ? {
              ...ch,
              lessons: ch.lessons.map((l) => {
                if (l.id === lessonId) {
                  updatedLesson = { ...l, ...updates };
                  return updatedLesson;
                }
                return l;
              }),
            }
          : ch
      )
    );
    if (!updatedLesson) {
      toast.error("Không tìm thấy bài học để cập nhật.");
      return;
    }
    const loadingToastId = toast.loading(
      `Đang lưu "${updatedLesson.title}"...`
    );
    try {
      const { id, title, content, duration, order } = updatedLesson;
      await handleUpdateLesson(id, title, content, duration, order);
      toast.success(`Cập nhật bài học "${updatedLesson.title}"!`, {
        id: loadingToastId,
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật bài học:", error);
      toast.error("Lỗi: Không thể lưu thay đổi. Vui lòng thử lại.", {
        id: loadingToastId,
      });
    }
  };

  const handleSaveQuiz = async (
    questions: QuizQuestion[],
    chapterId: string,
    lessonId: string
  ) => {
    const quizArray = Array.isArray(questions) ? questions : [questions];

    if (quizArray.length === 0) {
      toast.error("Không có câu hỏi nào để lưu.");
      return;
    }

    const loadingToastId = toast.loading("Đang lưu Quiz...");

    try {
      const updatePromises = quizArray.map((q) => {
        const dataToSave = {
          ...q,
          lessonId: lessonId,
        };

        return handleUpdateQuizQuestion(dataToSave);
      });

      await Promise.all(updatePromises);

      updateLesson(chapterId, lessonId, {
        quiz: quizArray,
      });

      console.log(questions);
      toast.success("Đã cập nhật Quiz thành công!", { id: loadingToastId });
    } catch (error) {
      console.error("Lỗi khi cập nhật Quiz:", error);
      toast.error("Lỗi: Không thể lưu Quiz. Vui lòng kiểm tra và thử lại.", {
        id: loadingToastId,
      });
    }
  };

  const currentChapter = chapters.find((ch) => ch.id === currentChapterId);

  const calculateDiscount = () => {
    if (!formData.hasDiscount || !formData.originalPrice || !formData.price)
      return "0";
    const discount =
      ((Number.parseFloat(formData.originalPrice) -
        Number.parseFloat(formData.price)) /
        Number.parseFloat(formData.originalPrice)) *
      100;
    return discount.toFixed(1);
  };

  const handleSaveDraft = async () => {
    let initialCourseCreationToastId: string | null = null;
    try {
      if (!validateBasicInfo()) {
        toast.error(
          "Bạn phải nhập ít nhất 1 thông tin cơ bản trước khi lưu nháp!"
        );
        return;
      }
      if (!courseId) {
        initialCourseCreationToastId = toast.loading("Đang lưu khóa học...");

        const created = await handleCreateCourse(cleanFormData(formData));

        if (!created) {
          toast.error("Không thể tạo khóa học. Vui lòng thử lại!", {
            id: initialCourseCreationToastId,
          });
          return;
        }
        toast.success("Khóa học đã được lưu nháp!", {
          id: initialCourseCreationToastId,
        });
        setCourseId(created.id);
      } else {
        initialCourseCreationToastId = toast.loading("Đang lưu khóa học...");
        const form = { id: courseId, ...formData };
        await handleUpdateCourse(cleanFormData(form));
        toast.success("Khóa học đã được lưu nháp!", {
          id: initialCourseCreationToastId,
        });
      }
    } catch (error) {
      console.error(error);
      if (initialCourseCreationToastId) {
        toast.dismiss(initialCourseCreationToastId);
      }
      toast.error("Đã xảy ra lỗi khi lưu nháp. Vui lòng thử lại!");
    }
  };
  const handlePublish = async () => {
    let initialCourseCreationToastId: string | null = null;
    if (!courseId) {
      return;
    }
    try {
      initialCourseCreationToastId = toast.loading(
        "Đang gửi duyệt khóa học..."
      );
      const form = { id: courseId, ...formData, status: "pending" };
      await handleUpdateCourse(cleanFormData(form));
      toast.success("Khóa học đã được gửi duyệt!", {
        id: initialCourseCreationToastId,
      });
    } catch (error) {
      console.error(error);
      if (initialCourseCreationToastId) {
        toast.dismiss(initialCourseCreationToastId);
      }
      toast.error("Đã xảy ra lỗi khi lưu nháp. Vui lòng thử lại!");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const catData: ICategory[] = await dispatch(
          getAllCategories()
        ).unwrap();

        if (isEditMode && id) {
          const res = await handleGetTeacherCourseEdit(id);
          console.log("res: ", res);
          const foundCategory = catData.find(
            (c) => c.categoryName === res.category
          );

          const formattedDate = res.discountExpiresAt
            ? res.discountExpiresAt.slice(0, 10)
            : "";

          const formatted = {
            title: res.title || "",
            description: res.description || "",
            requirements: res.requirements || [],
            learnings: res.learnings || [],
            category: foundCategory?.categoryId || "",
            level: res.level || "",
            originalPrice: res.originalPrice ?? "",
            price: res.price ?? "",
            hasDiscount: Boolean(res.discount),
            discountExpiresAt: formattedDate || "",
            image: res.image || "",
            status: res.status || "",
          };
          const sortedChapters: Chapter[] = res.chapters
            ? res.chapters
                .sort(
                  (a: Chapter, b: Chapter) => (a.order || 0) - (b.order || 0)
                )
                .map((chapter: Chapter) => ({
                  ...chapter,
                  lessons: chapter.lessons
                    ? chapter.lessons
                        .sort(
                          (a: Lesson, b: Lesson) =>
                            (a.order || 0) - (b.order || 0)
                        )
                        .map((lesson: Lesson) => ({
                          ...lesson,
                          quiz: lesson.quiz
                            ? lesson.quiz.sort(
                                (a: QuizQuestion, b: QuizQuestion) =>
                                  (a.order || 0) - (b.order || 0)
                              )
                            : [],
                        }))
                    : [],
                }))
            : [];
          setCourseId(res.id);
          setFormData(formatted);
          setChapters(sortedChapters);
        }
      } catch (error) {
        console.error("Failed to fetch:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dispatch, id, isEditMode]);

  if (isLoading || categoryStatus === "loading") {
    return (
      <div className="max-w-5xl mx-auto p-8 space-y-6">
        <div className="h-10 bg-gray-300 rounded w-1/3 animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>

        <div className="flex gap-4">
          <div className="h-8 w-32 bg-gray-300 rounded animate-pulse"></div>
          <div className="h-8 w-32 bg-gray-300 rounded animate-pulse"></div>
        </div>

        <div className="space-y-4">
          {[...Array(5)].map((_, idx) => (
            <div
              key={idx}
              className="h-10 bg-gray-200 rounded animate-pulse"
            ></div>
          ))}
        </div>

        {[...Array(2)].map((_, idx) => (
          <div key={idx} className="border rounded-lg p-4 space-y-2">
            <div className="h-6 bg-gray-300 rounded w-1/2 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <main className="flex-1 overflow-auto">
      <div className="max-w-5xl mx-auto p-8 space-y-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {isEditMode ? "Chỉnh Sửa Khóa Học" : "Tạo Khóa Học Mới"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isEditMode
                ? "Cập nhật thông tin chi tiết cho khóa học của bạn"
                : "Hãy bắt đầu xây dựng khóa học của bạn"}
            </p>
          </div>
          <div className="flex gap-2 ">
            <Button
              className="cursor-pointer"
              onClick={handlePublish}
              disabled={!canPublish()}
            >
              Gửi Duyệt
            </Button>
          </div>
        </div>

        <Tabs
          value={step}
          onValueChange={(value) => setStep(value as "basic" | "chapters")}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-2 ">
            <TabsTrigger className="cursor-pointer" value="basic">
              Thông Tin Cơ Bản
            </TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="chapters">
              Chương & Bài Học
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <ImageUploader
              currentImageUrl={formData.image}
              onUploadComplete={(url) => {
                setFormData((prev) => ({ ...prev, image: url }));
              }}
              title="Hình Ảnh Khóa Học"
              description="Tải lên hình ảnh đại diện cho khóa học"
            />

            <Card>
              <CardHeader>
                <CardTitle>Thông Tin Cơ Bản</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Tiêu Đề Khóa Học *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Nhập tiêu đề khóa học"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Mô Tả Khóa Học *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Mô tả chi tiết về khóa học"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Danh Mục *</Label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) =>
                        handleSelectChange("category", e.target.value)
                      }
                      className="w-full px-3 py-2 border rounded-md bg-background cursor-pointer"
                    >
                      {categories.map((cat: ICategory) => (
                        <option key={cat.categoryId} value={cat.categoryId}>
                          {cat.categoryName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="level">Trình Độ *</Label>
                    <select
                      id="level"
                      value={formData.level}
                      onChange={(e) =>
                        handleSelectChange("level", e.target.value)
                      }
                      className="w-full px-3 py-2 border rounded-md bg-background cursor-pointer"
                    >
                      <option value="Cơ Bản">Cơ Bản</option>
                      <option value="Trung Câp">Trung Cấp</option>
                      <option value="Nâng Cao">Nâng Cao</option>
                    </select>
                  </div>
                </div>

                <ArrayInput
                  label="Yêu Cầu Tiên Quyết"
                  values={formData.requirements}
                  onChange={(val) =>
                    setFormData((prev) => ({ ...prev, requirements: val }))
                  }
                />

                <ArrayInput
                  label="Những Gì Sẽ Học Được"
                  values={formData.learnings}
                  onChange={(val) =>
                    setFormData((prev) => ({ ...prev, learnings: val }))
                  }
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Giá & Giảm Giá</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="originalPrice">Giá Gốc (VND) *</Label>
                    <Input
                      id="originalPrice"
                      name="originalPrice"
                      type="number"
                      value={formData.originalPrice}
                      onChange={handleChange}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 border rounded-lg bg-accent/50">
                  <input
                    type="checkbox"
                    id="hasDiscount"
                    name="hasDiscount"
                    checked={formData.hasDiscount}
                    onChange={handleChange}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <Label
                    htmlFor="hasDiscount"
                    className="cursor-pointer flex-1"
                  >
                    Áp Dụng Giảm Giá Cho Khóa Học Này
                  </Label>
                </div>

                {formData.hasDiscount && (
                  <div className="space-y-4 p-4 border rounded-lg bg-accent/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price">Giá Sau Giảm (VND) *</Label>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          value={formData.price}
                          onChange={handleChange}
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <Label htmlFor="discountExpiresAt">
                          Ngày Hết Giảm Giá *
                        </Label>
                        <Input
                          id="discountExpiresAt"
                          name="discountExpiresAt"
                          type="date"
                          value={formData.discountExpiresAt}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    {formData.originalPrice && formData.price && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-700">
                          Giảm giá:{" "}
                          <span className="font-bold">
                            {calculateDiscount()}%
                          </span>{" "}
                          - Từ{" "}
                          <span className="line-through">
                            {formData.originalPrice} VND
                          </span>{" "}
                          còn{" "}
                          <span className="font-bold text-green-600">
                            {formData.price} VND
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex gap-4 justify-end pt-6 border-t">
              <Button variant="outline" className="cursor-pointer">
                Hủy
              </Button>
              <Button onClick={handleSaveDraft} className="cursor-pointer">
                <Save className="h-4 w-4 mr-2" />
                Lưu Nháp
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="chapters" className="space-y-6">
            {!courseId ? (
              <div className="p-10 text-center border rounded-lg bg-accent/20">
                <p className="text-lg font-semibold">
                  Bạn cần lưu nháp khóa học trước khi tạo chương & bài học
                </p>
                <Button
                  className="mt-4 cursor-pointer"
                  onClick={handleSaveDraft}
                >
                  Lưu Nháp Ngay
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Chương</CardTitle>
                        <Button
                          onClick={() => addChapter(courseId)}
                          type="button"
                          variant="outline"
                          className="cursor-pointer"
                          size="sm"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {chapters.map((chapter) => (
                        <div
                          key={chapter.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                            currentChapterId === chapter.id
                              ? "bg-primary text-primary-foreground border-primary"
                              : "hover:bg-accent"
                          }`}
                          onClick={() => setCurrentChapterId(chapter.id)}
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold truncate">
                              {chapter.title || "Chương mới"}
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteChapter(chapter.id);
                              }}
                              type="button"
                              className="text-destructive h-6 w-6 p-0 cursor-pointer"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-xs opacity-75 mt-1">
                            {chapter.lessons.length} bài
                          </p>
                        </div>
                      ))}
                      {chapters.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          Chưa có chương nào
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  <div className="md:col-span-2 space-y-6">
                    {currentChapter ? (
                      <>
                        <Card>
                          <CardHeader>
                            <CardTitle>Chỉnh Sửa Chương</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <Label htmlFor="chapter-title">
                                Tên Chương *
                              </Label>
                              <Input
                                id="chapter-title"
                                value={currentChapter.title}
                                onChange={(e) =>
                                  updateChapter(
                                    currentChapter.id,
                                    e.target.value
                                  )
                                }
                                placeholder="Nhập tên chương"
                              />
                            </div>
                          </CardContent>
                          <CardFooter className="flex justify-end border-t pt-4 gap-4">
                            <Button
                              variant="destructive"
                              className="w-full sm:w-auto cursor-pointer"
                              onClick={() => deleteChapter(currentChapter.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Xóa
                            </Button>
                            <Button
                              onClick={() => handleSaveChapter(currentChapter)}
                              className="w-full sm:w-auto cursor-pointer"
                            >
                              <Save className="h-4 w-4 mr-2" />
                              Lưu Thay Đổi
                            </Button>
                          </CardFooter>
                        </Card>

                        <Card>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle>
                                Bài Học ({currentChapter.lessons.length})
                              </CardTitle>
                              <Button
                                onClick={() => addLesson(currentChapter.id)}
                                type="button"
                                size="sm"
                                className="cursor-pointer"
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Thêm Bài
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {currentChapter.lessons.length === 0 ? (
                              <p className="text-muted-foreground text-sm text-center py-4">
                                Chưa có bài học nào
                              </p>
                            ) : (
                              currentChapter.lessons.map((lesson, idx) => (
                                <div
                                  key={lesson.id}
                                  className="border rounded-lg overflow-hidden"
                                >
                                  <div
                                    className="p-4 bg-accent/50 cursor-pointer hover:bg-accent transition-colors flex items-center justify-between"
                                    onClick={() =>
                                      setExpandedLessonId(
                                        expandedLessonId === lesson.id
                                          ? null
                                          : lesson.id
                                      )
                                    }
                                  >
                                    <div className="flex items-center gap-3">
                                      <Play className="h-4 w-4 text-primary" />
                                      <span className="font-semibold text-foreground">
                                        Bài {idx + 1}:{" "}
                                        {lesson.title || "Bài học mới"}
                                      </span>
                                    </div>
                                    {expandedLessonId === lesson.id ? (
                                      <ChevronUp className="h-4 w-4" />
                                    ) : (
                                      <ChevronDown className="h-4 w-4" />
                                    )}
                                  </div>

                                  {expandedLessonId === lesson.id && (
                                    <div className="p-4 space-y-6 border-t bg-background">
                                      {/* Lesson Basic Info */}
                                      <div className="space-y-3">
                                        <div>
                                          <Label
                                            htmlFor={`lesson-title-${lesson.id}`}
                                          >
                                            Tiêu Đề Bài Học
                                          </Label>
                                          <Input
                                            id={`lesson-title-${lesson.id}`}
                                            value={lesson.title}
                                            onChange={(e) =>
                                              updateLesson(
                                                currentChapter.id,
                                                lesson.id,
                                                { title: e.target.value }
                                              )
                                            }
                                            placeholder="Nhập tiêu đề bài học"
                                          />
                                        </div>
                                        <div>
                                          <Label
                                            htmlFor={`lesson-title-${lesson.id}`}
                                          >
                                            Nội Dung Bài Học
                                          </Label>
                                          <Input
                                            id={`lesson-content-${lesson.id}`}
                                            value={lesson.content}
                                            onChange={(e) =>
                                              updateLesson(
                                                currentChapter.id,
                                                lesson.id,
                                                { content: e.target.value }
                                              )
                                            }
                                            placeholder="Nhập nội dung bài học"
                                          />
                                        </div>
                                        <div>
                                          <Label
                                            htmlFor={`lesson-duration-${lesson.id}`}
                                          >
                                            Thời Lượng
                                          </Label>
                                          <Input
                                            id={`lesson-duration-${lesson.id}`}
                                            type="text"
                                            disabled
                                            value={
                                              lesson.duration === 0
                                                ? "0"
                                                : formatDurationVi(
                                                    lesson.duration
                                                  )
                                            }
                                            onChange={(e) =>
                                              updateLesson(
                                                currentChapter.id,
                                                lesson.id,
                                                {
                                                  duration: Number.parseInt(
                                                    e.target.value
                                                  ),
                                                }
                                              )
                                            }
                                            placeholder="0"
                                          />
                                        </div>
                                      </div>

                                      <div className="border-t pt-4">
                                        <h4 className="font-semibold mb-3">
                                          Video Khóa Học
                                        </h4>
                                        <VideoUploader
                                          currentVideoData={
                                            lesson.videoAsset || null
                                          }
                                          lessonId={lesson.id}
                                          onUploadComplete={(data) =>
                                            updateLesson(
                                              currentChapter.id,
                                              lesson.id,
                                              {
                                                videoAsset: data,
                                                duration: data.duration,
                                              }
                                            )
                                          }
                                          onDelete={() =>
                                            updateLesson(
                                              currentChapter.id,
                                              lesson.id,
                                              {
                                                videoAsset: null,
                                                duration: 0,
                                              }
                                            )
                                          }
                                        />
                                      </div>

                                      {/* Quiz Toggle */}
                                      <div className="border-t pt-4">
                                        <div className="flex items-center gap-3">
                                          <input
                                            type="checkbox"
                                            id={`quiz-${lesson.id}`}
                                            checked={lesson.hasQuiz}
                                            onChange={(e) =>
                                              updateLesson(
                                                currentChapter.id,
                                                lesson.id,
                                                { hasQuiz: e.target.checked }
                                              )
                                            }
                                            className="w-4 h-4"
                                          />
                                          <Label
                                            htmlFor={`quiz-${lesson.id}`}
                                            className="cursor-pointer"
                                          >
                                            Bài Học Này Có Quiz
                                          </Label>
                                        </div>
                                      </div>

                                      {/* Quiz Editor */}
                                      {lesson.hasQuiz && (
                                        <div className="border-t pt-4">
                                          <h4 className="font-semibold mb-3">
                                            Tạo Quiz
                                          </h4>
                                          <QuizEditor
                                            lessonId={lesson.id}
                                            initialQuestions={lesson.quiz || []}
                                            onSave={(questions) =>
                                              handleSaveQuiz(
                                                questions,
                                                currentChapter.id,
                                                lesson.id
                                              )
                                            }
                                          />
                                        </div>
                                      )}

                                      <div className="flex justify-end border-t pt-4 gap-4">
                                        <Button
                                          variant="destructive"
                                          size="sm"
                                          className="cursor-pointer"
                                          onClick={() =>
                                            deleteLesson(
                                              currentChapter.id,
                                              lesson.id
                                            )
                                          }
                                        >
                                          <Trash2 className="h-4 w-4 mr-2" />
                                          Xóa Bài Học
                                        </Button>
                                        <Button
                                          className="cursor-pointer"
                                          onClick={() =>
                                            handleSaveLesson(
                                              currentChapter.id,
                                              lesson.id,
                                              lesson
                                            )
                                          }
                                          size="sm"
                                        >
                                          <Save className="h-4 w-4 mr-2" />
                                          Lưu Bài Học
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))
                            )}
                          </CardContent>
                        </Card>
                      </>
                    ) : (
                      <Card>
                        <CardContent className="text-center py-12">
                          <p className="text-muted-foreground">
                            Hãy tạo chương trước tiên
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
        <div className="p-4 mb-4 border-l-4 rounded-md space-y-1">
          <p className="font-semibold">Hướng dẫn:</p>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>Muốn tạo được chương và bài học, bạn phải lưu nháp trước.</li>
            <li>
              Để lưu nháp, bạn phải điền ít nhất 1 thông tin trong phần Thông
              Tin Cơ Bản.
            </li>
            <li>
              Muốn gửi duyệt khóa học, bạn phải lưu nháp và tạo ít nhất 1 chương
              có bài học.
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
