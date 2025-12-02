"use client";

import { ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { AppDispatch, RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { removeFromCart } from "@/redux/thunk/cartThunk";
import { updateCourseCart } from "@/redux/features/course/courseSlice";
import { getCartTotal } from "@/lib/utils";

export const CartPopover = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
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
        <p className="text-gray-500 font-medium">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white rounded-b-lg shadow-lg">
      <div className="px-4 pt-3 pb-2">
        <h3 className="font-semibold text-lg text-gray-900">
          Shopping Cart ({items.length})
        </h3>
      </div>

      <div className="max-h-72 overflow-y-auto">
        {items.map((course, index) => (
          <div
            key={course.id}
            className="px-4 py-3 relative hover:bg-gray-50 transition-colors"
          >
            {index < items.length - 1 && (
              <div className="absolute left-4 right-4 bottom-0 h-px bg-gray-200" />
            )}

            <div className="flex gap-3 items-start">
              <div className="w-14 h-14 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                <Image
                  src={
                    course.image ||
                    "https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg"
                  }
                  alt={course.title}
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0 pr-1">
                <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">
                  {course.title}
                </h4>
                <p className="text-xs text-gray-500 mt-0.5 truncate">
                  {course.instructor}
                </p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-base font-bold text-gray-900">
                    {course.price.toLocaleString()}₫
                  </span>
                  {course.discountExpiresAt &&
                    course.originalPrice &&
                    new Date(course.discountExpiresAt).getTime() >
                      Date.now() && (
                      <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded">
                        {course.originalPrice.toLocaleString()}₫
                      </span>
                    )}
                </div>
              </div>

              <button
                onClick={() => handleRemoveFromCart(course.id)}
                className="bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex-shrink-0 pt-0.5 cursor-pointer"
                aria-label="Remove from cart"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
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
          Checkout
        </Button>
      </div>
    </div>
  );
};
