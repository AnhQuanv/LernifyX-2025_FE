import axiosClient from "@/lib/axios";
import { QuizQuestion } from "@/types/course/course";

export const handleCreateQuizQuestion = async (
  questionData: QuizQuestion,
  lessonId: string
) => {
  const payload = {
    ...questionData,
    lessonId,
  };

  const res = await axiosClient.post("quiz-question/create", payload);
  return res.data.data;
};

export const handleUpdateQuizQuestion = async (
  updateData: Partial<QuizQuestion>
) => {
  const res = await axiosClient.put("quiz-question/update", updateData);
  return res.data.data;
};

export const handleDeleteQuizQuestion = async (
  questionId: string,
  lessonId: string
) => {
  const res = await axiosClient.delete("quiz-question/delete", {
    data: {
      questionId,
      lessonId,
    },
  });
  return res.data;
};
