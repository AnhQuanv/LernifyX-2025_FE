"use client";

import { ShoppingCart, X } from "lucide-react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Course } from "@/types/course/course";
import { removeFromCart } from "@/redux/features/cart/cartSlice";

interface CartItem extends Course {
  quantity: number;
}

interface CartPopoverProps {
  items: CartItem[];
}

export const CartPopover = ({ items }: CartPopoverProps) => {
  const dispatch = useDispatch();

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (items.length === 0) {
    return (
      <div className="w-80 p-6 text-center">
        <ShoppingCart className="w-12 h-12 mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500 font-medium">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="w-96 max-h-96 overflow-y-auto">
      <div className="p-4 border-b border-gray-200 sticky top-0 bg-white">
        <h3 className="font-semibold text-gray-900">
          Shopping Cart ({items.length})
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
                  <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded">
                    x{course.quantity}
                  </span>
                </div>
              </div>
              <button
                onClick={() => dispatch(removeFromCart(course.id))}
                className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                aria-label="Remove from cart"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-gray-900">Total:</span>
          <span className="text-lg font-bold text-gray-900">
            ${total.toFixed(2)}
          </span>
        </div>
        <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white">
          Checkout
        </Button>
      </div>
    </div>
  );
};
