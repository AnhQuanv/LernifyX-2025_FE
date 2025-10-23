"use client";
import { Heart, X } from "lucide-react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Course } from "@/types/course/course";
import { removeFromWishlist } from "@/redux/features/wishlist/wishListSlice";

interface WishlistPopoverProps {
  items: Course[];
}

export const WishlistPopover = ({ items }: WishlistPopoverProps) => {
  const dispatch = useDispatch();

  if (items.length === 0) {
    return (
      <div className="w-80 p-6 text-center">
        <Heart className="w-12 h-12 mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500 font-medium">Your wishlist is empty</p>
      </div>
    );
  }

  return (
    <div className="w-96 max-h-96 overflow-y-auto">
      <div className="p-4 border-b border-gray-200 sticky top-0 bg-white">
        <h3 className="font-semibold text-gray-900">
          Wishlist ({items.length})
        </h3>
      </div>
      <div className="divide-y divide-gray-200">
        {items.map((course) => (
          <div
            key={course.id}
            className="p-3 hover:bg-gray-50 transition-colors"
          >
            <div className="flex gap-3">
              <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={course.image || "/placeholder.svg"}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {course.title}
                </h4>
                <p className="text-xs text-gray-500 truncate">
                  {course.instructor}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-semibold text-gray-900">
                    ${course.price}
                  </span>
                  <span className="text-xs text-gray-400 line-through">
                    ${course.originalPrice}
                  </span>
                </div>
              </div>
              <button
                onClick={() => dispatch(removeFromWishlist(course.id))}
                className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                aria-label="Remove from wishlist"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white">
          View All Wishlist
        </Button>
      </div>
    </div>
  );
};
