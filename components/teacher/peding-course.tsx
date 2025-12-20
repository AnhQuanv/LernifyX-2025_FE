"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";

export function PendingCourses() {
  // Mock data - khóa học chờ duyệt
  const pendingCourses = [
    {
      id: 1,
      title: "Lập Trình React Nâng Cao",
      image: "/react-course.png",
      submitDate: "2024-12-03",
      lessons: 24,
    },
    {
      id: 2,
      title: "Web Development Full Stack",
      image: null, // Khóa học chưa cập nhật ảnh
      submitDate: "2024-12-02",
      lessons: 18,
    },
    {
      id: 3,
      title: "JavaScript ES6+",
      image: "/javascript-course.png",
      submitDate: "2024-12-01",
      lessons: 15,
    },
  ];

  if (pendingCourses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            Khóa Học Chờ Duyệt
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Bạn không có khóa học nào chờ duyệt
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-amber-600" />
          Khóa Học Chờ Duyệt ({pendingCourses.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pendingCourses.map((course) => (
            <div
              key={course.id}
              className="flex gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-shrink-0 w-20 h-14 bg-muted rounded-md overflow-hidden">
                {course.image ? (
                  <img
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-200 to-blue-100">
                    <span className="text-xs text-blue-600 font-semibold">
                      No Image
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground truncate">
                  {course.title}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {course.lessons} bài học
                </p>
                <p className="text-xs text-muted-foreground">
                  Gửi: {new Date(course.submitDate).toLocaleDateString("vi-VN")}
                </p>
              </div>

              <div className="flex-shrink-0">
                <Badge
                  variant="outline"
                  className="bg-amber-50 text-amber-700 border-amber-200"
                >
                  Chờ Duyệt
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
