import CreateEditCoursePage from "@/components/teacher/create-edit-course";

export default async function EditCoursePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  return (
    <>
      <CreateEditCoursePage isEditMode={true} id={id} />
    </>
  );
}
