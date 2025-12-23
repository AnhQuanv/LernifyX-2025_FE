import axiosClient from "@/lib/axios";

export const handleAddNoteToLesson = async (
  progressId: string,
  text: string
) => {
  const res = await axiosClient.post(`lesson-note/create`, {
    progressId,
    text,
  });
  return res.data.data;
};

export const handleUpdateNoteToLesson = async (
  noteId: string,
  text: string
) => {
  const res = await axiosClient.patch(`lesson-note/update`, {
    noteId,
    text,
  });
  return res.data.data;
};

export const handleDeleteNoteToLesson = async (noteId: string) => {
  const res = await axiosClient.delete(`lesson-note/delete`, {
    data: { noteId },
  });
  return res.data.data;
};

export const handleCreateLessonProgress = async (lessonId: string) => {
  console.log("lessonId: ", lessonId);
  const res = await axiosClient.post(`lesson-progress/create`, {
    lessonId,
  });
  return res.data.data;
};

export const handleUpdateLessonProgress = async (
  progressId: string,
  completed?: boolean,
  lastPosition?: number
) => {
  const res = await axiosClient.patch(`lesson-progress/update`, {
    progressId,
    completed,
    lastPosition,
  });
  return res.data.data;
};
