"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { ChevronRight, ChevronLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { ICategory } from "@/types/api/category";
import { getAllCategories } from "@/redux/thunk/categoryThunk";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { CreateUserPreferenceDto } from "@/types/api/auth";
import { handlecreatePreference } from "@/services/authService";
import toast from "react-hot-toast";

const LEVELS = [
  { value: "Cơ Bản", label: "Cơ Bản - Người bắt đầu" },
  { value: "Trung Cấp", label: "Trung Cấp - Có kinh nghiệm" },
  { value: "Nâng Cao", label: "Nâng Cao - Chuyên sâu" },
];

const LEARNING_GOALS = [
  { id: 1, label: "Tìm công việc" },
  { id: 2, label: "Nâng cao kỹ năng hiện tại" },
  { id: 3, label: "Chuyển đổi nghề nghiệp" },
  { id: 4, label: "Khởi nghiệp riêng" },
  { id: 5, label: "Học để phát triển bản thân" },
];

export interface SurveyData {
  mainCategories: ICategory[];
  desiredLevels: string[];
  learningGoals: string[];
  interestedSkills: string[];
}

const SurveyForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { categories, status: categoryStatus } = useSelector(
    (state: RootState) => state.category
  );
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [preferences, setPreferences] = useState<SurveyData>({
    mainCategories: [],
    desiredLevels: [],
    learningGoals: [],
    interestedSkills: [],
  });
  const [skillsText, setSkillsText] = useState("");

  const handleCategoryToggle = (category: ICategory) => {
    setPreferences((prev) => ({
      ...prev,
      mainCategories: prev.mainCategories.some(
        (c) => c.categoryId === category.categoryId
      )
        ? prev.mainCategories.filter(
            (c) => c.categoryId !== category.categoryId
          )
        : [...prev.mainCategories, category],
    }));
  };
  const handleLevelToggle = (level: string) => {
    setPreferences((prev) => ({
      ...prev,
      desiredLevels: prev.desiredLevels.includes(level)
        ? prev.desiredLevels.filter((l) => l !== level)
        : [...prev.desiredLevels, level],
    }));
  };

  const handleGoalToggle = (goal: string) => {
    setPreferences((prev) => ({
      ...prev,
      learningGoals: prev.learningGoals.includes(goal)
        ? prev.learningGoals.filter((g) => g !== goal)
        : [...prev.learningGoals, goal],
    }));
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setSkillsText(text);

    const skillsArray = text
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    setPreferences((prev) => ({
      ...prev,
      interestedSkills: skillsArray,
    }));
  };

  const isStepValid = () => {
    switch (step) {
      case 0:
        return preferences.mainCategories.length > 0;
      case 1:
        return preferences.desiredLevels.length > 0;
      case 2:
        return preferences.learningGoals.length > 0;
      case 3:
        return preferences.interestedSkills.length > 0;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    if (!isStepValid()) return;
    try {
      setIsLoading(true);

      const dto: CreateUserPreferenceDto = {
        mainCategoryIds: preferences.mainCategories.map((c) =>
          c.categoryId.toString()
        ),
        desiredLevels: preferences.desiredLevels,
        learningGoals: preferences.learningGoals,
        interestedSkills: preferences.interestedSkills,
      };

      await handlecreatePreference(dto);

      router.push("/homepage");
    } catch {
      toast.error(
        "Lỗi khi tạo tùy chọn (hoặc sở thích) người dùng.Vui lòng thử lại!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const progressPercent = ((step + 1) / 4) * 100;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await dispatch(getAllCategories());
      setIsLoading(false);
    };
    fetchData();
  }, [dispatch]);

  if (categoryStatus === "loading" || isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-violet-950 via-purple-900 to-indigo-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <div className="p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-2xl font-bold text-gray-800">
                Khảo Sát Quan Tâm Học Tập
              </h2>
              <span className="text-sm font-semibold text-gray-600">
                {step + 1}/4
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-linear-to-r from-violet-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Step Content */}
          <div className="min-h-96">
            {step === 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Bạn quan tâm học những danh mục nào?
                </h3>
                <p className="text-gray-600 mb-6">
                  Chọn 1 hoặc nhiều danh mục quan tâm
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {categories.map((category) => {
                    const isSelected = preferences.mainCategories.some(
                      (c) => c.categoryId === category.categoryId
                    );
                    return (
                      <button
                        key={category.categoryId}
                        onClick={() => handleCategoryToggle(category)}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 text-center ${
                          isSelected
                            ? "border-violet-600 bg-violet-50"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                      >
                        <div className="text-sm font-semibold text-gray-800 cursor-pointer">
                          {category.categoryName}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Mức độ học phù hợp là gì?
                </h3>
                <p className="text-gray-600 mb-6">
                  Chọn 1 hoặc nhiều mức độ phù hợp với bạn
                </p>
                <div className="space-y-4 ">
                  {LEVELS.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => handleLevelToggle(level.value)}
                      className={`w-full p-4 rounded-lg border-2 transition-all cursor-pointer duration-200 text-left flex items-center ${
                        preferences.desiredLevels.includes(level.value)
                          ? "border-violet-600 bg-violet-50"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                          preferences.desiredLevels.includes(level.value)
                            ? "border-violet-600 bg-violet-600"
                            : "border-gray-300"
                        }`}
                      >
                        {preferences.desiredLevels.includes(level.value) && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      <div className="font-semibold text-gray-800">
                        {level.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Mục tiêu học tập của bạn là gì?
                </h3>
                <p className="text-gray-600 mb-6">
                  Chọn tất cả những mục tiêu phù hợp
                </p>
                <div className="space-y-3">
                  {LEARNING_GOALS.map((goal) => (
                    <button
                      key={goal.id}
                      onClick={() => handleGoalToggle(goal.label)}
                      className={`cursor-pointer w-full p-4 rounded-lg border-2 transition-all duration-200 text-left flex items-center ${
                        preferences.learningGoals.includes(goal.label)
                          ? "border-violet-600 bg-violet-50"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${
                          preferences.learningGoals.includes(goal.label)
                            ? "border-violet-600 bg-violet-600"
                            : "border-gray-300"
                        }`}
                      >
                        {preferences.learningGoals.includes(goal.label) && (
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div className="font-semibold text-gray-800">
                        {goal.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Kỹ năng bạn muốn học
                </h3>
                <p className="text-gray-600 mb-6">
                  Nhập các kỹ năng bạn quan tâm (cách nhau bằng dấu phẩy)
                </p>
                <textarea
                  value={skillsText}
                  onChange={handleSkillsChange}
                  placeholder="Ví dụ: React, TypeScript, Design..."
                  className="w-full p-4 border-2 rounded-lg"
                  rows={6}
                />
                <p className="text-sm text-gray-500 mt-3">
                  Mẹo: Thêm nhiều kỹ năng để nhận được gợi ý khóa học phù hợp
                  hơn
                </p>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 gap-4">
            <Button
              onClick={handlePrev}
              variant="outline"
              disabled={step === 0 || isLoading}
              className="gap-2 bg-transparent cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Quay Lại
            </Button>

            {step < 3 ? (
              <Button
                onClick={handleNext}
                disabled={!isStepValid() || isLoading}
                className="bg-linear-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 gap-2 cursor-pointer"
              >
                Tiếp Tục
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!isStepValid() || isLoading}
                className="bg-linear-to-r cursor-pointer gap-2"
              >
                {isLoading ? "Đang lưu..." : "Hoàn Thành"}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
export default SurveyForm;
