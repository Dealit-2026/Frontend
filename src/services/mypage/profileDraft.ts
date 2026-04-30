import type { MyProfileDraftValues } from "@/services/mypage/types";

let myProfileDraft: MyProfileDraftValues | null = null;

export function getMyProfileDraft() {
  return myProfileDraft;
}

export function setMyProfileDraft(form: MyProfileDraftValues) {
  myProfileDraft = form;
}

export function updateMyProfileDraft(nextForm: Partial<MyProfileDraftValues>) {
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
