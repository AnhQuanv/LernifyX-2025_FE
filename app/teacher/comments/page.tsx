"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, CheckCircle, Clock } from "lucide-react";

const comments = [
  {
    id: 1,
    student: "Nguyễn Văn A",
    course: "React Basics",
    lesson: "State và Props",
    comment: "Phần này rất khó hiểu, có thể giải thích thêm được không?",
    date: "2 giờ trước",
    status: "unanswered",
    studentEmail: "nguyena@email.com",
  },
  {
    id: 2,
    student: "Trần Thị B",
    course: "JavaScript Advanced",
    lesson: "Closures",
    comment: "Cảm ơn bạn, cách giảng dạy rất hiệu quả!",
    date: "1 ngày trước",
    status: "answered",
    studentEmail: "tranb@email.com",
  },
  {
    id: 3,
    student: "Lê Văn C",
    course: "Node.js Backend",
    lesson: "Express Setup",
    comment: "Bạn có file example code không chia sẻ được không?",
    date: "3 giờ trước",
    status: "unanswered",
    studentEmail: "levanc@email.com",
  },
  {
    id: 4,
    student: "Phạm Thị D",
    course: "React Basics",
    lesson: "Hooks Basics",
    comment: "Bài học này giúp tôi hiểu rõ hooks hơn. Cảm ơn!",
    date: "5 giờ trước",
    status: "answered",
    studentEmail: "phamthid@email.com",
  },
  {
    id: 5,
    student: "Vũ Minh E",
    course: "UI/UX Design",
    lesson: "Color Theory",
    comment: "Khi nào xuất bản phần tiếp theo?",
    date: "1 ngày trước",
    status: "unanswered",
    studentEmail: "vuminhe@email.com",
  },
];

export default function CommentsPage() {
  return (
    <main className="flex-1 overflow-auto">
      <div className="p-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Bình Luận của Học Viên
          </h1>
          <p className="text-muted-foreground mt-2">
            Quản lý và trả lời bình luận từ học viên của bạn
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Tổng Bình Luận</p>
              <p className="text-3xl font-bold text-foreground">45</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Chưa Trả Lời</p>
              <p className="text-3xl font-bold text-orange-500">12</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Đã Trả Lời</p>
              <p className="text-3xl font-bold text-green-500">33</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">Tất Cả</TabsTrigger>
            <TabsTrigger value="unanswered">Chưa Trả Lời</TabsTrigger>
            <TabsTrigger value="answered">Đã Trả Lời</TabsTrigger>
          </TabsList>

          {/* Comments List */}
          <TabsContent value="all" className="space-y-4">
            {comments.map((comment) => (
              <Card
                key={comment.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-foreground">
                          {comment.student}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          {comment.course}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {comment.lesson}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {comment.studentEmail}
                      </p>
                    </div>
                    <Badge
                      variant={
                        comment.status === "answered" ? "default" : "outline"
                      }
                      className={
                        comment.status === "answered"
                          ? "bg-green-500"
                          : "border-orange-500"
                      }
                    >
                      {comment.status === "answered" ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Đã Trả Lời
                        </>
                      ) : (
                        <>
                          <Clock className="h-3 w-3 mr-1" />
                          Chưa Trả Lời
                        </>
                      )}
                    </Badge>
                  </div>

                  {/* Comment */}
                  <div className="bg-muted/50 rounded-lg p-3 border">
                    <p className="text-sm text-foreground">{comment.comment}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {comment.date}
                    </p>
                  </div>

                  {/* Reply Section */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Viết câu trả lời..."
                      className="flex-1 px-3 py-2 rounded-lg border bg-background text-foreground placeholder-muted-foreground text-sm"
                    />
                    <Button size="sm">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Unanswered Tab */}
          <TabsContent value="unanswered" className="space-y-4">
            {comments
              .filter((c) => c.status === "unanswered")
              .map((comment) => (
                <Card key={comment.id}>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-foreground">
                            {comment.student}
                          </h4>
                          <Badge variant="outline" className="text-xs">
                            {comment.course}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {comment.studentEmail}
                        </p>
                      </div>
                      <Badge variant="outline" className="border-orange-500">
                        <Clock className="h-3 w-3 mr-1" />
                        Chưa Trả Lời
                      </Badge>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3 border">
                      <p className="text-sm text-foreground">
                        {comment.comment}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Viết câu trả lời..."
                        className="flex-1 px-3 py-2 rounded-lg border bg-background text-foreground placeholder-muted-foreground text-sm"
                      />
                      <Button size="sm">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>

          {/* Answered Tab */}
          <TabsContent value="answered" className="space-y-4">
            {comments
              .filter((c) => c.status === "answered")
              .map((comment) => (
                <Card key={comment.id}>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-foreground">
                            {comment.student}
                          </h4>
                          <Badge variant="outline" className="text-xs">
                            {comment.course}
                          </Badge>
                        </div>
                      </div>
                      <Badge className="bg-green-500">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Đã Trả Lời
                      </Badge>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3 border">
                      <p className="text-sm text-foreground">
                        {comment.comment}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
