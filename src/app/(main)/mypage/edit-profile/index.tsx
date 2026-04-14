"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Camera, ChevronLeft, Home } from "lucide-react";
import { motion } from "motion/react";

import {
  createDefaultProfileForm,
  fetchMyProfileForm,
  saveMyProfile,
  uploadMyProfileImage,
} from "@/services/mypage/service";
import type { MyProfileFormValues } from "@/services/mypage/types";

const TEXT = {
  back: "\ub4a4\ub85c\uac00\uae30",
  title: "\ud504\ub85c\ud544 \uc218\uc815",
  profileAlt: "\ud504\ub85c\ud544",
  editPhoto: "\ud504\ub85c\ud544 \uc0ac\uc9c4 \uc218\uc815",
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
};

interface ProfileEditScreenProps {
  onBack: () => void;
  onComplete: () => void;
  onLocationEdit?: () => void;
}

export default function ProfileEditScreen({
  onBack,
  onComplete,
  onLocationEdit,
}: ProfileEditScreenProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [form, setForm] = useState<MyProfileFormValues>(
    createDefaultProfileForm(),
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let ignore = false;

    fetchMyProfileForm().then((nextForm) => {
      if (!ignore) {
        setForm(nextForm);
      }
    });

    return () => {
      ignore = true;
    };
  }, []);

  const isFormValid = form.nickname.trim().length >= 2;

  const updateForm = (nextForm: Partial<MyProfileFormValues>) => {
    setForm((prevForm) => ({
      ...prevForm,
      ...nextForm,
    }));
  };

  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const uploadedImage = await uploadMyProfileImage(file);
    updateForm({ profileImageUrl: uploadedImage.profileImageUrl });
    event.target.value = "";
  };

  const handleSave = async () => {
    if (!isFormValid || isSaving) {
      return;
    }

    setIsSaving(true);
    await saveMyProfile(form);
    setIsSaving(false);
    onComplete();
  };

  return (
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
              {form.profileImageUrl ? (
                <img
                  src={form.profileImageUrl}
                  alt={TEXT.profileAlt}
                  className="w-full h-full object-cover"
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
            <label className="text-sm font-bold" htmlFor="nickname">
              {TEXT.nickname}
            </label>
            <input
              id="nickname"
              type="text"
              value={form.nickname}
              onChange={(event) => updateForm({ nickname: event.target.value })}
              placeholder={TEXT.nicknamePlaceholder}
              className="w-full h-12 bg-gray-100 rounded-lg px-4 outline-none focus:ring-2 focus:ring-[#98E446]"
            />
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
          disabled={!isFormValid || isSaving}
          className={`w-full h-14 font-bold rounded-xl transition-colors ${
            isFormValid && !isSaving
              ? "bg-[#98E446] hover:bg-[#87d335] text-black"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {isSaving ? TEXT.saving : TEXT.complete}
        </button>
      </div>
    </motion.div>
  );
}