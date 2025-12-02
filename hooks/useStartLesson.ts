"use client";

import { useMemo } from "react";
import { CourseDetail, Lesson } from "@/types/course/course";
import { useRouter } from "next/navigation";

export const useStartLesson = (course: CourseDetail | null) => {
  const router = useRouter();

  const startLesson = useMemo<Lesson | null>(() => {
    if (!course) return null;

    // 1. Sort chapters và lessons theo order (phòng trường hợp backend chưa sort)
    const sortedChapters = [...course.chapters].sort(
      (a, b) => a.order - b.order
    );

    for (const chapter of sortedChapters) {
      const sortedLessons = [...chapter.lessons].sort(
        (a, b) => a.order - b.order
      );

      // 2. Tìm lesson chưa hoàn thành đầu tiên
      const lesson = sortedLessons.find(
        (l) => !l.progress?.completed || (l.progress?.lastPosition ?? 0) > 0
      );
      if (lesson) return lesson;
    }

    // 3. Nếu tất cả hoàn thành → trả lesson đầu tiên
    return (
      sortedChapters[0]?.lessons.sort((a, b) => a.order - b.order)[0] || null
    );
  }, [course]);

  const goToLesson = () => {
    if (!course || !startLesson) return;
    router.push(`/courses/${course.id}/lessons/${startLesson.id}`);
  };

  return { startLesson, goToLesson };
};
