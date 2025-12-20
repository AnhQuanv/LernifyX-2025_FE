import axiosClient from "@/lib/axios";

export const handleCreateLesson = async (
  chapterId: string,
  id: string,
  title: string,
  content?: string,
  duration?: number,
  videoUrl?: string,
  order?: number
) => {
  const res = await axiosClient.post("lesson/create", {
    chapterId,
    id,
    title,
    content,
    duration,
    videoUrl,
    order,
  });
  console.log("res lesson create: ", res);
  return res.data.data;
};

export const handleUpdateLesson = async (
  id: string,
  title?: string,
  content?: string,
  duration?: number,
  order?: number
) => {
  const res = await axiosClient.put("lesson/update", {
    id,
    title,
    content,
    duration,
    order,
  });
  console.log("res lesson update: ", res);
  return res.data.data;
};

export const handleDeleteLesson = async (lessonId: string) => {
  const res = await axiosClient.delete("lesson/delete", {
    data: {
      lessonId: lessonId,
    },
  });
  console.log("res lesson delete: ", res);
  return res.data.data;
};
