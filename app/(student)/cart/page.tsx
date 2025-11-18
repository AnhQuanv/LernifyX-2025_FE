"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  ArrowLeft,
  Trash2,
  Star,
  Users,
  Clock,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useWishlistCart } from "@/hooks/commonHooks";
import { getCartTotal } from "@/lib/utils";

export default function CartPage() {
  const router = useRouter();
  const cartItems = useSelector((state: RootState) => state.cart.allCourses);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { handleCartToggle } = useWishlistCart();
  const totalValue = getCartTotal(cartItems);

  const tax = totalValue * 0.1;
  const total = totalValue + tax;

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsCheckingOut(false);
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section (Đã sửa để đồng bộ với EditProfilePage) */}
      <div className="bg-white text-gray-900 py-8 sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.back()}
              // Thay đổi: nền trắng/20 thành xám 100
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Go back"
            >
              {/* Thay đổi: icon đen */}
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div>
              <h1 className="text-3xl font-bold">Shopping Cart</h1>
              {/* Thay đổi: text-violet-100 thành text-gray-500 */}
              <p className="text-gray-500 text-sm">
                Review and checkout your courses
              </p>
            </div>
          </div>

          {/* Stats Bar (Đã sửa để đồng bộ với EditProfilePage) */}
          {cartItems.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Thay đổi: Bỏ bg-white/10, backdrop-blur-sm. Dùng nền trắng, bo góc 2xl, shadow-md */}
              <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
                {/* Thay đổi: text-violet-100 thành text-gray-500 */}
                <p className="text-gray-500 text-xs font-medium">Total Items</p>
                {/* Thay đổi: Thêm màu chính (violet-600) cho số liệu quan trọng */}
                <p className="text-2xl font-bold text-violet-600">
                  {cartItems.length}
                </p>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
                <p className="text-gray-500 text-xs font-medium">Subtotal</p>
                <p className="text-2xl font-bold text-violet-600">
                  ${totalValue.toFixed(2)}
                </p>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
                <p className="text-gray-500 text-xs font-medium">Tax (10%)</p>
                <p className="text-2xl font-bold text-violet-600">
                  ${tax.toFixed(2)}
                </p>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
                <p className="text-gray-500 text-xs font-medium">Total</p>
                {/* Tổng tiền dùng màu đậm hơn và kích thước lớn hơn */}
                <p className="text-3xl font-extrabold text-purple-700">
                  ${total.toFixed(2)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 py-12">
        {cartItems.length === 0 ? (
          // Empty State
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="w-10 h-10 text-violet-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                Start adding courses to your cart to begin your learning
                journey. Browse our collection of expert-led courses.
              </p>
              <button
                onClick={() => router.push("/homepage")}
                className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-violet-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center gap-2"
              >
                Continue Shopping
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          // Cart Items
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 group"
                >
                  <div className="flex flex-col sm:flex-row gap-6 p-6">
                    {/* Course Image */}
                    <Link
                      href={`/courses/${course.id}`}
                      className="flex-shrink-0"
                    >
                      <div className="relative w-full sm:w-40 h-40 rounded-xl overflow-hidden bg-gray-200 group-hover:shadow-lg transition-all duration-300">
                        <Image
                          src="https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg"
                          alt={course.title}
                          fill
                          sizes="(max-width: 640px) 100vw, 160px"
                          priority
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-violet-600 px-3 py-1 rounded-full text-xs font-semibold">
                          {course.level}
                        </div>
                      </div>
                    </Link>

                    {/* Course Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <Link href={`/courses/${course.id}`}>
                              <h3 className="text-lg font-bold text-gray-800 hover:text-violet-600 transition-colors line-clamp-2">
                                {course.title}
                              </h3>
                            </Link>
                            <p className="text-sm text-gray-600 mt-1">
                              by {course.instructor}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 ml-4 flex-shrink-0">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-semibold text-gray-700">
                              {course.rating}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{course.students.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{course.duration}</span>
                          </div>
                          <span className="bg-violet-100 text-violet-700 px-2 py-1 rounded-full text-xs font-medium">
                            {course.category}
                          </span>
                        </div>
                      </div>

                      {/* Price and Actions */}
                      <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-bold text-violet-600">
                            ${course.price}
                          </span>
                          {course.originalPrice && (
                            <span className="text-sm text-gray-400 line-through">
                              ${course.originalPrice}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Remove Button */}
                          <button
                            onClick={() => handleCartToggle(course)}
                            className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                            aria-label="Remove from cart"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Sidebar - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-24">
                <h3 className="text-xl font-bold text-gray-800 mb-6">
                  Order Summary
                </h3>

                <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span className="font-semibold text-gray-800">
                      ${totalValue.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (10%):</span>
                    <span className="font-semibold text-gray-800">
                      ${tax.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-800 pt-2">
                    <span>Total:</span>
                    <span className="text-violet-600">${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-violet-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-3"
                >
                  {isCheckingOut ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Proceed to Checkout
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <button
                  onClick={() => router.push("/homepage")}
                  className="w-full border-2 border-violet-600 text-violet-600 px-6 py-3 rounded-xl font-semibold hover:bg-violet-50 transition-all duration-300"
                >
                  Continue Shopping
                </button>

                <div className="mt-6 space-y-3">
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-xs text-green-700 font-medium">
                      ✓ Secure checkout
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-700 font-medium">
                      📦 Lifetime access to courses
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-xs text-purple-700 font-medium">
                      💰 30-day money-back guarantee
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
