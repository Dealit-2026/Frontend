"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Camera, ChevronLeft } from "lucide-react";
import { motion } from "motion/react";

import { getErrorMessage } from "@/services/apiError";
import ResultModal from "@/components/common/modal/ResultModal";
import { checkNicknameAvailability } from "@/services/auth/service";
import { saveMyProfile, uploadMyProfileImage } from "@/services/mypage/service";

type CheckStatus = "idle" | "available" | "duplicate";

export default function ProfileSetupScreen({
  showToast,
  onBack,
  onComplete,
}: {
  showToast: (msg: string) => void;
  onBack: () => void;
  onComplete: () => void;
  key?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imagePreviewUrlRef = useRef<string | null>(null);
  const [nickname, setNickname] = useState("비드마스터");
  const [bio, setBio] = useState("안녕하세요! 비드마스터입니다. 좋은 거래 부탁드려요.");
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [nicknameCheckStatus, setNicknameCheckStatus] =
    useState<CheckStatus>("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [resultModal, setResultModal] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  const isFormValid = nickname.trim().length >= 2;
  const canSubmit = isFormValid && nicknameCheckStatus === "available";

  const openResultModal = (title: string, message: string) => {
    setResultModal({ isOpen: true, title, message });
  };

  useEffect(() => {
    return () => {
      if (imagePreviewUrlRef.current) {
        URL.revokeObjectURL(imagePreviewUrlRef.current);
      }
    };
  }, []);

  const updateImagePreviewUrl = (nextPreviewUrl: string | null) => {
    if (imagePreviewUrlRef.current) {
      URL.revokeObjectURL(imagePreviewUrlRef.current);
    }

    imagePreviewUrlRef.current = nextPreviewUrl;
    setImagePreviewUrl(nextPreviewUrl);
  };

  const handleNicknameCheck = async () => {
    if (!nickname.trim()) {
      openResultModal("닉네임 확인", "닉네임을 입력해주세요.");
      return;
    }

    try {
      const result = await checkNicknameAvailability(nickname);
      setNicknameCheckStatus(result.available ? "available" : "duplicate");
      openResultModal(
        "닉네임 중복 확인",
        result.available
          ? "사용 가능한 닉네임입니다."
          : "중복된 닉네임입니다.",
      );
    } catch (error) {
      setNicknameCheckStatus("idle");
      openResultModal("닉네임 중복 확인", getErrorMessage(error, "닉네임 중복 확인에 실패했습니다."));
    }
  };

  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setIsUploadingImage(true);
    updateImagePreviewUrl(URL.createObjectURL(file));

    try {
      const uploadedImage = await uploadMyProfileImage(file);
      setProfileImageUrl(uploadedImage.profileImageUrl);
    } catch (error) {
      updateImagePreviewUrl(null);
      openResultModal("이미지 업로드 실패", getErrorMessage(error, "프로필 이미지 업로드에 실패했습니다."));
    } finally {
      setIsUploadingImage(false);
      event.target.value = "";
    }
  };

  const handleComplete = async () => {
    if (!canSubmit || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      await saveMyProfile({
        nickname,
        bio,
        profileImageUrl,
        location: "",
      });
      showToast("프로필 설정이 저장되었습니다.");
      onComplete();
    } catch (error) {
      openResultModal("프로필 저장 실패", getErrorMessage(error, "프로필 설정 저장에 실패했습니다."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="flex-1 flex flex-col"
      >
        <div className="h-16 flex items-center px-4 border-b border-gray-100">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h1 className="flex-1 text-center font-bold text-lg mr-10">프로필 설정</h1>
        </div>

        <div className="flex-1 px-8 py-10 space-y-10">
          <div className="flex flex-col items-center space-y-4">
            <button
              type="button"
              onClick={handleImageButtonClick}
              disabled={isUploadingImage}
              className="relative group disabled:cursor-wait"
              aria-label="프로필 사진 수정"
            >
              <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border border-gray-200 group-hover:opacity-90 transition-opacity">
                {imagePreviewUrl || profileImageUrl ? (
                  <img
                    src={imagePreviewUrl || profileImageUrl || ""}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={() => {
                      if (imagePreviewUrl) {
                        updateImagePreviewUrl(null);
                        return;
                      }

                      setProfileImageUrl(null);
                    }}
                  />
                ) : (
                  <Camera size={36} className="text-gray-300" />
                )}
              </div>
              <span className="absolute bottom-0 right-0 w-10 h-10 bg-[#98E446] rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                <Camera size={20} className="text-black" />
              </span>
            </button>
            <button
              type="button"
              onClick={handleImageButtonClick}
              disabled={isUploadingImage}
              className="text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors disabled:cursor-wait"
            >
              {isUploadingImage ? "업로드 중" : "프로필 사진 수정"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="sr-only"
            />
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold">닉네임</label>
              <div className="flex space-x-2 w-full">
                <input
                  type="text"
                  value={nickname}
                  onChange={(event) => {
                    setNickname(event.target.value);
                    setNicknameCheckStatus("idle");
                  }}
                  placeholder="닉네임 입력 (2-10자)"
                  className="flex-1 min-w-0 h-12 bg-gray-100 rounded-lg px-4 outline-none focus:ring-2 focus:ring-[#98E446]"
                />
                <button onClick={handleNicknameCheck} className="whitespace-nowrap px-4 h-12 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 shrink-0">
                  중복확인
                </button>
              </div>
              {nicknameCheckStatus === "available" && (
                <p className="text-[10px] text-green-600">사용 가능한 닉네임입니다.</p>
              )}
              {nicknameCheckStatus === "duplicate" && (
                <p className="text-[10px] text-red-500">중복된 닉네임입니다.</p>
              )}
              <p className="text-xs text-gray-400">다른 사람에게 보여질 이름이에요</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold">소개</label>
              <textarea
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                placeholder="자기소개를 입력해주세요 (선택)"
                className="w-full h-32 bg-gray-100 rounded-lg p-4 outline-none focus:ring-2 focus:ring-[#98E446] resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        <div className="p-6">
          <button
            onClick={handleComplete}
            disabled={!canSubmit || isSubmitting || isUploadingImage}
            className={`w-full h-14 font-bold rounded-xl transition-colors ${
              canSubmit && !isSubmitting && !isUploadingImage
                ? "bg-[#98E446] hover:bg-[#87d335] text-black"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? "저장 중" : "완료"}
          </button>
        </div>
      </motion.div>

      <ResultModal
        isOpen={resultModal.isOpen}
        title={resultModal.title}
        message={resultModal.message}
        onClose={() => setResultModal({ ...resultModal, isOpen: false })}
      />
    </>
  );
}
