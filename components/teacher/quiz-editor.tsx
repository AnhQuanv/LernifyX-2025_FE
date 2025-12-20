"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { QuizQuestion } from "@/types/course/course";
import {
  handleCreateQuizQuestion,
  handleDeleteQuizQuestion,
} from "@/services/quizService";
import toast from "react-hot-toast";

interface QuizEditorProps {
  lessonId: string;
  initialQuestions: QuizQuestion[] | undefined;
  onSave?: (questions: QuizQuestion[]) => void;
}

export function QuizEditor({
  lessonId,
  initialQuestions,
  onSave,
}: QuizEditorProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

  const addQuestion = async () => {
    const newQuestion: QuizQuestion = {
      id: crypto.randomUUID(),
      question: "",
      options: [
        { id: crypto.randomUUID(), text: "" },
        { id: crypto.randomUUID(), text: "" },
        { id: crypto.randomUUID(), text: "" },
        { id: crypto.randomUUID(), text: "" },
      ],
      correctOptionId: "",
      order: questions.length + 1,
    };
    const loadingToastId = toast.loading("Đang lưu Quiz...");

    try {
      await handleCreateQuizQuestion(newQuestion, lessonId);
      const updatedQuestions = [...questions, newQuestion];
      setQuestions((prev) => [...prev, newQuestion]);
      onSave?.(updatedQuestions);
      toast.success("Tạo Quiz mới thành công!", {
        id: loadingToastId,
      });
    } catch (error) {
      console.error("Lỗi khi tạo chapter:", error);
      toast.error("Lỗi: Không thể tạo Quiz mới.", {
        id: loadingToastId,
      });
    }
  };

  const updateQuestion = (id: string, updates: Partial<QuizQuestion>) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...updates } : q))
    );
  };

  const deleteQuestion = async (id: string) => {
    const loadingToastId = toast.loading("Đang xóa câu hỏi...");

    try {
      await handleDeleteQuizQuestion(id, lessonId);
      setQuestions((prev) => prev.filter((q) => q.id !== id));
      toast.success("Đã xóa câu hỏi Quiz thành công!", { id: loadingToastId });
    } catch (error) {
      console.error("Lỗi khi xóa câu hỏi Quiz:", error);
      toast.error("Lỗi: Không thể xóa câu hỏi. Vui lòng thử lại.", {
        id: loadingToastId,
      });
    }
  };

  const updateOptionText = (
    questionId: string,
    optionId: string,
    text: string
  ) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt) =>
                opt.id === optionId ? { ...opt, text } : opt
              ),
            }
          : q
      )
    );
  };

  const setcorrectOptionId = (questionId: string, optionId: string) => {
    updateQuestion(questionId, { correctOptionId: optionId });
  };

  useEffect(() => {
    setQuestions(initialQuestions || []);
  }, [initialQuestions]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Quiz cho Bài Học</CardTitle>
            <CardDescription>{questions.length} câu hỏi</CardDescription>
          </div>
          <Button onClick={addQuestion} type="button" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Thêm Câu Hỏi
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {questions.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Chưa có câu hỏi nào. Hãy thêm câu hỏi đầu tiên.
          </p>
        ) : (
          questions.map((question, idx) => (
            <div
              key={question.id}
              className="p-4 border rounded-lg space-y-4 bg-accent/50"
            >
              <div className="flex items-start justify-between">
                <h4 className="font-semibold">Câu hỏi {idx + 1}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteQuestion(question.id)}
                  type="button"
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div>
                <Label>Câu Hỏi *</Label>
                <Input
                  value={question.question}
                  onChange={(e) =>
                    updateQuestion(question.id, { question: e.target.value })
                  }
                  placeholder="Nhập câu hỏi"
                />
              </div>

              <div className="space-y-2">
                <Label>Các Lựa Chọn *</Label>

                {question.options.map((option) => (
                  <div key={option.id} className="flex gap-2 items-center">
                    <input
                      type="radio"
                      checked={question.correctOptionId === option.id}
                      onChange={() =>
                        setcorrectOptionId(question.id, option.id)
                      }
                      className="w-4 h-4 cursor-pointer"
                    />

                    <Input
                      value={option.text}
                      onChange={(e) =>
                        updateOptionText(question.id, option.id, e.target.value)
                      }
                      placeholder="Nhập đáp án"
                      className="flex-1"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))
        )}

        {questions.length > 0 && (
          <Button
            onClick={() => {
              console.log("Dữ liệu quiz chuẩn bị lưu:", questions);
              onSave?.(questions);
            }}
            className="w-full"
            type="button"
          >
            Lưu Quiz
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
