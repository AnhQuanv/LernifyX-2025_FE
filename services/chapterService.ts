import axiosClient from "@/lib/axios";

export const handleCreateChapter = async (
  courseId: string,
  id: string,
  title: string,
  order: number
) => {
  const res = await axiosClient.post("chapter/create", {
    courseId,
    id,
    title,
    order,
  });
  console.log("res: ", res);
  return res.data.data;
};

export const handleUpdateChapter = async (
  id: string,
  title?: string,
  order?: number
) => {
  const res = await axiosClient.put("chapter/update", {
    id,
    title,
    order,
  });
  console.log("res: ", res);
  return res.data.data;
};

export const handleDeleteChapter = async (chapterId: string) => {
  const res = await axiosClient.delete("chapter/delete", {
    data: {
      chapterId: chapterId,
    },
  });
  console.log("res: ", res);
  return res.data.data;
};
