"use client";

import { Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { removeFromWishlist } from "@/redux/thunk/wishlistThunk";
import { AppDispatch, RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { updateCourseWishlist } from "@/redux/features/course/courseSlice";
import { CoursePopoverItem } from "../student/popover/CoursePopoverItem";

export const WishlistPopover = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const items = useSelector((state: RootState) => state.wishlist.allCourses);

  const handleRemoveFromWishlist = async (courseId: string) => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    try {
      await dispatch(removeFromWishlist(courseId)).unwrap();
      dispatch(updateCourseWishlist({ courseId, value: false }));
    } catch (err) {
      console.error("Xóa khỏi danh sách yêu thích thất bại:", err);
    }
  };

  if (items.length === 0) {
    return (
      <div className="w-73 p-6 text-center">
        <Heart className="w-12 h-12 mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500 font-medium">Danh sách yêu thích trống</p>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white rounded-b-lg shadow-lg">
      <div className="px-4 pt-3 pb-2">
        <h3 className="font-semibold text-lg text-gray-900">
          Danh sách yêu thích ({items.length})
        </h3>
      </div>

      <div className="max-h-72 overflow-y-auto">
        {items.map((course, index) => (
          <CoursePopoverItem
            key={course.id}
            course={course}
            isLast={index === items.length - 1}
            onRemove={handleRemoveFromWishlist}
          />
        ))}
      </div>

      <div className="p-3">
        <Button
          className="w-full h-11 bg-violet-700 hover:bg-violet-800 text-white font-semibold cursor-pointer"
          onClick={() => router.push("/wishlist")}
        >
          Xem tất cả danh sách yêu thích
        </Button>
      </div>
    </div>
  );
};
