"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Camera, ChevronLeft, Home } from "lucide-react";
import { motion } from "motion/react";

import ResultModal from "@/components/common/modal/ResultModal";
import { checkNicknameAvailability } from "@/services/auth/service";
import {
  createDefaultProfileForm,
  fetchMyProfileForm,
  saveMyProfile,
  uploadMyProfileImage,
} from "@/services/mypage/service";
import { getErrorMessage } from "@/services/apiError";
import {
  clearMyProfileDraft,
  getMyProfileDraft,
  setMyProfileDraft,
} from "@/services/mypage/profileDraft";
import type { MyProfileFormValues } from "@/services/mypage/types";

const TEXT = {
  back: "\ub4a4\ub85c\uac00\uae30",
  title: "\ud504\ub85c\ud544 \uc218\uc815",
  profileAlt: "\ud504\ub85c\ud544",
  editPhoto: "\ud504\ub85c\ud544 \uc0ac\uc9c4 \uc218\uc815",
  name: "\uc774\ub984",
  namePlaceholder: "\uc774\ub984 \uc785\ub825",
  nickname: "\ub2c9\ub124\uc784",
  nicknamePlaceholder: "\ub2c9\ub124\uc784 \uc785\ub825 (2-10\uc790)",
  nicknameHelper: "\ub2e4\ub978 \uc0ac\ub78c\uc5d0\uac8c \ubcf4\uc5ec\uc9c0\ub294 \uc774\ub984\uc774\uc5d0\uc694.",
  location: "\uc9c0\uc5ed",
  locationPlaceholder: "\uc9c0\uc5ed\uc744 \uc124\uc815\ud574 \uc8fc\uc138\uc694.",
  editLocation: "\uc9c0\uc5ed \uc218\uc815",
  bio: "\uc18c\uac1c",
  bioPlaceholder: "\uc790\uae30\uc18c\uac1c\ub97c \uc785\ub825\ud574 \uc8fc\uc138\uc694. (\uc120\ud0dd)",
  saving: "\uc800\uc7a5 \uc911",
  complete: "\uc644\ub8cc",
  duplicateCheck: "\uc911\ubcf5\ud655\uc778",
  verifyEmail: "\uc774\uba54\uc77c \uc778\uc99d\ud558\uae30",
  nicknameAvailable: "\uc0ac\uc6a9 \uac00\ub2a5\ud55c \ub2c9\ub124\uc784\uc785\ub2c8\ub2e4.",
  nicknameDuplicate: "\uc911\ubcf5\ub41c \ub2c9\ub124\uc784\uc785\ub2c8\ub2e4.",
  nicknameCheckTitle: "\ub2c9\ub124\uc784 \uc911\ubcf5 \ud655\uc778",
  verifyEmailTitle: "\uc774\uba54\uc77c \uc778\uc99d",
  verifyEmailMessage:
    "\ud604\uc7ac \uacc4\uc815\uc740 \uc774\uba54\uc77c \ubbf8\uc778\uc99d \uc0c1\ud0dc\uc608\uc694. \uc778\uc99d \ud750\ub984 \uc5f0\uacb0\uc740 \ub2e4\uc74c \ub2e8\uacc4\uc5d0\uc11c \uc774\uc5b4\uc11c \ubd99\uc77c \uc218 \uc788\uac8c \uc900\ube44\ud574\ub450\uc5c8\uc5b4\uc694.",
};

type CheckStatus = "idle" | "available" | "duplicate";

interface ProfileEditScreenProps {
  onBack: () => void;
  onComplete: () => void;
  onLocationEdit?: () => void;
  onEmailVerify?: () => void;
  refreshToken?: string;
}

export default function ProfileEditScreen({
  onBack,
  onComplete,
  onLocationEdit,
  onEmailVerify,
  refreshToken = "",
}: ProfileEditScreenProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imagePreviewUrlRef = useRef<string | null>(null);
  const [form, setForm] = useState<MyProfileFormValues>(
    createDefaultProfileForm(),
  );
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [initialNickname, setInitialNickname] = useState("");
  const [nicknameCheckStatus, setNicknameCheckStatus] =
    useState<CheckStatus>("idle");
  const [isEmailVerified, setIsEmailVerified] = useState<boolean | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [resultModal, setResultModal] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  useEffect(() => {
    const draft = getMyProfileDraft();

    if (draft) {
      setForm(draft);
    }

    let ignore = false;

    fetchMyProfileForm().then((profileEditData) => {
      if (ignore) {
        return;
      }

      const nextForm = profileEditData.form;
      setInitialNickname(nextForm.nickname);
      setIsEmailVerified(profileEditData.verified);

      if (!draft || refreshToken) {
        setForm(nextForm);
        setMyProfileDraft(nextForm);
      }
    }).catch((error) => {
      if (!ignore) {
        openResultModal(
          "프로필 조회 실패",
          getErrorMessage(error, "프로필 정보를 불러오지 못했습니다."),
        );
      }
    });

    return () => {
      ignore = true;
    };
  }, [refreshToken]);

  useEffect(() => {
    return () => {
      if (imagePreviewUrlRef.current) {
        URL.revokeObjectURL(imagePreviewUrlRef.current);
      }
    };
  }, []);

  const isFormValid =
    form.name.trim().length >= 1 && form.nickname.trim().length >= 2;
  const isNicknameUnchanged =
    form.nickname.trim() !== "" &&
    form.nickname.trim() === initialNickname.trim();
  const canSave =
    isFormValid && (isNicknameUnchanged || nicknameCheckStatus === "available");

  const openResultModal = (title: string, message: string) => {
    setResultModal({ isOpen: true, title, message });
  };

  const updateForm = (nextForm: Partial<MyProfileFormValues>) => {
    setForm((prevForm) => {
      const mergedForm = {
        ...prevForm,
        ...nextForm,
      };

      setMyProfileDraft(mergedForm);
      return mergedForm;
    });
  };

  const updateImagePreviewUrl = (nextPreviewUrl: string | null) => {
    if (imagePreviewUrlRef.current) {
      URL.revokeObjectURL(imagePreviewUrlRef.current);
    }

    imagePreviewUrlRef.current = nextPreviewUrl;
    setImagePreviewUrl(nextPreviewUrl);
  };

  const handleNicknameChange = (nickname: string) => {
    updateForm({ nickname });
    setNicknameCheckStatus("idle");
  };

  const handleNicknameCheck = async () => {
    if (!form.nickname.trim()) {
      openResultModal(TEXT.nicknameCheckTitle, "닉네임을 입력해주세요.");
      return;
    }

    if (isNicknameUnchanged) {
      setNicknameCheckStatus("available");
      openResultModal(TEXT.nicknameCheckTitle, "현재 사용 중인 닉네임입니다.");
      return;
    }

    try {
      const result = await checkNicknameAvailability(form.nickname);
      setNicknameCheckStatus(result.available ? "available" : "duplicate");
      openResultModal(
        TEXT.nicknameCheckTitle,
        result.available ? TEXT.nicknameAvailable : TEXT.nicknameDuplicate,
      );
    } catch (error) {
      setNicknameCheckStatus("idle");
      openResultModal(
        TEXT.nicknameCheckTitle,
        getErrorMessage(error, "닉네임 중복 확인에 실패했습니다."),
      );
    }
  };

  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleEmailVerifyClick = () => {
    if (onEmailVerify) {
      onEmailVerify();
      return;
    }

    openResultModal(TEXT.verifyEmailTitle, TEXT.verifyEmailMessage);
  };

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const nextPreviewUrl = URL.createObjectURL(file);
    updateImagePreviewUrl(nextPreviewUrl);

    try {
      const uploadedImage = await uploadMyProfileImage(file);
      updateForm({ profileImageUrl: uploadedImage.profileImageUrl });
    } catch (error) {
      updateImagePreviewUrl(null);
      window.alert(getErrorMessage(error, "프로필 이미지 업로드에 실패했습니다."));
    } finally {
      event.target.value = "";
    }
  };

  const handleSave = async () => {
    if (!canSave || isSaving) {
      return;
    }

    setIsSaving(true);

    try {
      await saveMyProfile(form);
      clearMyProfileDraft();
      onComplete();
    } catch (error) {
      window.alert(getErrorMessage(error, "프로필 저장에 실패했습니다."));
    } finally {
      setIsSaving(false);
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
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label={TEXT.back}
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="flex-1 text-center font-bold text-lg mr-10">
          {TEXT.title}
        </h1>
      </div>

      <div className="flex-1 px-8 py-10 space-y-10">
        <div className="flex flex-col items-center space-y-4">
          <button
            type="button"
            onClick={handleImageButtonClick}
            className="relative group"
            aria-label={TEXT.editPhoto}
          >
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border border-gray-200 group-hover:opacity-90 transition-opacity">
              {imagePreviewUrl || form.profileImageUrl ? (
                <img
                  src={imagePreviewUrl || form.profileImageUrl || ""}
                  alt={TEXT.profileAlt}
                  className="w-full h-full object-cover"
                  onError={() => {
                    if (imagePreviewUrl) {
                      updateImagePreviewUrl(null);
                      return;
                    }

                    updateForm({ profileImageUrl: null });
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
            className="text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors"
          >
            {TEXT.editPhoto}
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
            <label className="text-sm font-bold" htmlFor="name">
              {TEXT.name}
            </label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(event) => updateForm({ name: event.target.value })}
              placeholder={TEXT.namePlaceholder}
              className="w-full h-12 bg-gray-100 rounded-lg px-4 outline-none focus:ring-2 focus:ring-[#98E446]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold" htmlFor="nickname">
              {TEXT.nickname}
            </label>
            <div className="flex space-x-2 w-full">
              <input
                id="nickname"
                type="text"
                value={form.nickname}
                onChange={(event) => handleNicknameChange(event.target.value)}
                placeholder={TEXT.nicknamePlaceholder}
                className="flex-1 min-w-0 h-12 bg-gray-100 rounded-lg px-4 outline-none focus:ring-2 focus:ring-[#98E446]"
              />
              <button
                type="button"
                onClick={handleNicknameCheck}
                className="whitespace-nowrap px-4 h-12 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 shrink-0"
              >
                {TEXT.duplicateCheck}
              </button>
            </div>
            {nicknameCheckStatus === "available" && !isNicknameUnchanged && (
              <p className="text-[10px] text-green-600">
                {TEXT.nicknameAvailable}
              </p>
            )}
            {nicknameCheckStatus === "duplicate" && (
              <p className="text-[10px] text-red-500">
                {TEXT.nicknameDuplicate}
              </p>
            )}
            <p className="text-xs text-gray-400">{TEXT.nicknameHelper}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold">{TEXT.location}</label>
            <button
              type="button"
              onClick={onLocationEdit}
              disabled={!onLocationEdit}
              className="w-full h-12 bg-gray-100 rounded-lg px-4 flex items-center justify-between text-left hover:bg-gray-200 transition-colors disabled:cursor-default disabled:hover:bg-gray-100"
            >
              <span className={form.location ? "text-black" : "text-gray-400"}>
                {form.location || TEXT.locationPlaceholder}
              </span>
              <span className="flex items-center gap-1 text-xs font-medium text-gray-500">
                <Home size={14} />
                {TEXT.editLocation}
              </span>
            </button>
          </div>

          {isEmailVerified === false && (
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleEmailVerifyClick}
                className="w-full h-12 rounded-lg border border-[#98E446] bg-[#F4FFE7] text-sm font-semibold text-[#3C6B12] transition-colors hover:bg-[#EAFAD3]"
              >
                {TEXT.verifyEmail}
              </button>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-bold" htmlFor="bio">
              {TEXT.bio}
            </label>
            <textarea
              id="bio"
              value={form.bio}
              onChange={(event) => updateForm({ bio: event.target.value })}
              placeholder={TEXT.bioPlaceholder}
              className="w-full h-32 bg-gray-100 rounded-lg p-4 outline-none focus:ring-2 focus:ring-[#98E446] resize-none"
            />
          </div>
        </div>
      </div>

      <div className="p-6">
        <button
          onClick={handleSave}
          disabled={!canSave || isSaving}
          className={`w-full h-14 font-bold rounded-xl transition-colors ${
            canSave && !isSaving
              ? "bg-[#98E446] hover:bg-[#87d335] text-black"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {isSaving ? TEXT.saving : TEXT.complete}
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
