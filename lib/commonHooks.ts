"use client";

import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/redux/features/wishlist/wishListSlice";
import { addToCart, removeFromCart } from "@/redux/features/cart/cartSlice";
import type { Course } from "@/types/course/course";

export const useWishlistCart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const isInWishlist = (courseId: string): boolean =>
    wishlistItems.some((item) => item.id === courseId);

  const isInCart = (courseId: string): boolean =>
    cartItems.some((item) => item.id === courseId);

  const handleWishlistToggle = (course: Course): void => {
    if (isInWishlist(course.id)) {
      dispatch(removeFromWishlist(course.id));
    } else {
      dispatch(addToWishlist(course));
    }
  };

  const handleCartToggle = (course: Course): void => {
    if (isInCart(course.id)) {
      dispatch(removeFromCart(course.id));
    } else {
      dispatch(addToCart(course));
    }
  };

  return {
    wishlistItems,
    cartItems,
    isInWishlist,
    isInCart,
    handleWishlistToggle,
    handleCartToggle,
  };
};
