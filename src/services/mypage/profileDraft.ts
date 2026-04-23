import type { MyProfileFormValues } from "@/services/mypage/types";

let myProfileDraft: MyProfileFormValues | null = null;

export function getMyProfileDraft() {
  return myProfileDraft;
}

export function setMyProfileDraft(form: MyProfileFormValues) {
  myProfileDraft = form;
}

export function updateMyProfileDraft(nextForm: Partial<MyProfileFormValues>) {
  if (!myProfileDraft) {
    return;
  }

  myProfileDraft = {
    ...myProfileDraft,
    ...nextForm,
  };
}

export function clearMyProfileDraft() {
  myProfileDraft = null;
}
