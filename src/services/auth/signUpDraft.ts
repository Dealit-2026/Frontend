import {
  createDefaultSignUpForm,
} from "@/services/auth/service";
import type { SignUpFormValues } from "@/services/auth/types";

let signUpDraft: SignUpFormValues = createDefaultSignUpForm();

export function getSignUpDraft() {
  return signUpDraft;
}

export function setSignUpDraft(nextDraft: SignUpFormValues) {
  signUpDraft = nextDraft;
}

export function updateSignUpDraft(nextDraft: Partial<SignUpFormValues>) {
  signUpDraft = {
    ...signUpDraft,
    ...nextDraft,
  };
}

export function clearSignUpDraft() {
  signUpDraft = createDefaultSignUpForm();
}
