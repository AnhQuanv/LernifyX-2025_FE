"use client";

import { ShoppingCart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { AppDispatch, RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { removeFromCart } from "@/redux/thunk/cartThunk";
import { updateCourseCart } from "@/redux/features/course/courseSlice";
import { getCartTotal } from "@/lib/utils";
import { CoursePopoverItem } from "../student/popover/CoursePopoverItem";

export const CartPopover = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  const items = useSelector((state: RootState) => state.cart.allCourses);
  const totalPrice = getCartTotal(items);

  const handleRemoveFromCart = async (courseId: string) => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    try {
      await dispatch(removeFromCart(courseId)).unwrap();
      dispatch(updateCourseCart({ courseId, value: false }));
    } catch (err) {
      console.error("Xóa khỏi cart thất bại:", err);
    }
  };

  if (items.length === 0) {
    return (
      <div className="w-73 p-6 text-center">
        <ShoppingCart className="w-12 h-12 mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500 font-medium">Giỏ hàng trống</p>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white rounded-b-lg shadow-lg">
      <div className="px-4 pt-3 pb-2">
        <h3 className="font-semibold text-lg text-gray-900">
          Giỏ hàng ({items.length})
        </h3>
      </div>

      <div className="max-h-72 overflow-y-auto">
        {items.map((course, index) => (
          <CoursePopoverItem
            key={course.id}
            course={course}
            isLast={index === items.length - 1}
            onRemove={handleRemoveFromCart}
          />
        ))}
      </div>

      <div className="p-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
        <div className="flex justify-between items-center mb-3 px-1">
          <span className="text-sm font-medium text-gray-900">Total:</span>
          <span className="text-lg font-bold text-gray-900">
            {totalPrice.toLocaleString()}₫
          </span>
        </div>
        <Button
          className="w-full h-11 bg-violet-700 hover:bg-violet-800 text-white font-semibold cursor-pointer"
          onClick={() => router.push("/cart")}
        >
          Xem tất cả giỏ hàng
        </Button>
      </div>
    </div>
  );
};
