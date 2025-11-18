import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import type { Course } from "@/types/course/course";
import { addToWishlist, removeFromWishlist } from "@/redux/thunk/wishlistThunk";
import { addToCart, removeFromCart } from "@/redux/thunk/cartThunk";
import {
  updateCourseWishlist,
  updateCourseCart,
} from "@/redux/features/course/courseSlice";
import { useRouter } from "next/navigation";

export const useWishlistCart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const isAuthenticated = useSelector((state: RootState) => state.auth);

  const wishlistItems = useSelector(
    (state: RootState) => state.wishlist.allCourses
  );
  const cartItems = useSelector((state: RootState) => state.cart.allCourses);

  const handleWishlistToggle = async (course: Course) => {
    if (!isAuthenticated) return router.push("/auth/login");

    const isInWishlist = wishlistItems.some((item) => item.id === course.id);

    try {
      if (isInWishlist) {
        await dispatch(removeFromWishlist(course.id)).unwrap();
        dispatch(updateCourseWishlist({ courseId: course.id, value: false }));
      } else {
        await dispatch(addToWishlist(course.id)).unwrap();
        dispatch(updateCourseWishlist({ courseId: course.id, value: true }));
      }
    } catch (error) {
      console.error("Wishlist update failed", error);
    }
  };

  const handleCartToggle = async (course: Course) => {
    if (!isAuthenticated) return router.push("/auth/login");

    const isInCart = cartItems.some((item) => item.id === course.id);

    try {
      if (isInCart) {
        await dispatch(removeFromCart(course.id)).unwrap();
        dispatch(updateCourseCart({ courseId: course.id, value: false }));
      } else {
        await dispatch(addToCart(course.id)).unwrap();
        dispatch(updateCourseCart({ courseId: course.id, value: true }));
      }
    } catch (error) {
      console.error("Cart update failed", error);
    }
  };

  return { handleWishlistToggle, handleCartToggle };
};
