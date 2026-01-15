"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Course } from "@/types/course/course";
import { CourseProgressCard } from "./CourseProgressCard";

interface ViewCoursesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courses: (Course & { progress?: number })[];
  title: string;
  role: string;
}

export function ViewCoursesModal({
  open,
  onOpenChange,
  courses,
  title,
  role,
}: ViewCoursesModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-150 max-h-[80vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {role === "student"
              ? "Danh sách các khóa học học viên đã mua và tiến độ học tập."
              : "Danh sách các khóa học đã xuất bản và doanh thu chi tiết."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 pt-2 space-y-4">
          {courses.map((course) => (
            <CourseProgressCard key={course.id} course={course} role={role} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
