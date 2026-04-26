import * as locationApi from "@/services/location/api";
import type {
  DaumPostcodeAddressData,
  LocationFormValues,
  ResolvedLocationResponse,
} from "@/services/location/types";
import type { MyLocationResponse } from "@/services/mypage/types";

declare global {
  interface Window {
    daum?: {
      Postcode: new (options: {
        oncomplete: (data: DaumPostcodeAddressData) => void;
        onclose?: (state: "COMPLETE_CLOSE" | "FORCE_CLOSE") => void;
      }) => {
        open: () => void;
      };
    };
  }
}

const DAUM_POSTCODE_SCRIPT_URL =
  "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";

let postcodeScriptPromise: Promise<void> | null = null;

function normalizeText(value: string | null | undefined) {
  return value?.trim() ?? "";
}

function createDisplayLocation(baseAddress: string, detailAddress: string) {
  const normalizedBaseAddress = normalizeText(baseAddress);
  const normalizedDetailAddress = normalizeText(detailAddress);

  if (!normalizedBaseAddress) {
    return normalizedDetailAddress;
  }

  return normalizedDetailAddress
    ? `${normalizedBaseAddress} ${normalizedDetailAddress}`
    : normalizedBaseAddress;
}

export function createDefaultLocationForm(): LocationFormValues {
  return {
    location: "",
    postalCode: "",
    roadAddress: "",
    jibunAddress: "",
    detailAddress: "",
    latitude: null,
    longitude: null,
    locationSource: null,
    region1DepthName: "",
    region2DepthName: "",
    region3DepthName: "",
  };
}

export function getLocationDisplayName(locationForm: LocationFormValues) {
  return (
    normalizeText(locationForm.location) ||
    createDisplayLocation(
      locationForm.roadAddress || locationForm.jibunAddress,
      locationForm.detailAddress,
    )
  );
}

export function isLocationFormReady(locationForm: LocationFormValues) {
  return Boolean(
    normalizeText(locationForm.location) ||
      normalizeText(locationForm.roadAddress) ||
      normalizeText(locationForm.jibunAddress),
  );
}

export function applyLocationDetailAddress(
  locationForm: LocationFormValues,
  detailAddress: string,
): LocationFormValues {
  const nextDetailAddress = normalizeText(detailAddress);
  const baseAddress = normalizeText(
    locationForm.roadAddress || locationForm.jibunAddress || locationForm.location,
  );

  return {
    ...locationForm,
    detailAddress: nextDetailAddress,
    location: createDisplayLocation(baseAddress, nextDetailAddress),
  };
}

export function createLocationFormFromSavedLocation(
  savedLocation: MyLocationResponse,
): LocationFormValues {
  return {
    location: normalizeText(savedLocation.location),
    postalCode: normalizeText(savedLocation.postalCode),
    roadAddress: normalizeText(savedLocation.roadAddress),
    jibunAddress: normalizeText(savedLocation.jibunAddress),
    detailAddress: normalizeText(savedLocation.detailAddress),
    latitude: savedLocation.latitude,
    longitude: savedLocation.longitude,
    locationSource: savedLocation.locationSource,
    region1DepthName: "",
    region2DepthName: "",
    region3DepthName: "",
  };
}

export function createLocationFormFromResolvedLocation(
  resolvedLocation: ResolvedLocationResponse,
): LocationFormValues {
  return {
    location: normalizeText(resolvedLocation.location),
    postalCode: normalizeText(resolvedLocation.postalCode),
    roadAddress: normalizeText(resolvedLocation.roadAddress),
    jibunAddress: normalizeText(resolvedLocation.jibunAddress),
    detailAddress: normalizeText(resolvedLocation.detailAddress),
    latitude: resolvedLocation.latitude,
    longitude: resolvedLocation.longitude,
    locationSource: resolvedLocation.locationSource,
    region1DepthName: normalizeText(resolvedLocation.region1DepthName),
    region2DepthName: normalizeText(resolvedLocation.region2DepthName),
    region3DepthName: normalizeText(resolvedLocation.region3DepthName),
  };
}

export function createLocationFormFromPostcode(
  addressData: DaumPostcodeAddressData,
  currentDetailAddress = "",
): LocationFormValues {
  const roadAddress = normalizeText(addressData.roadAddress);
  const jibunAddress = normalizeText(addressData.jibunAddress);
  const baseAddress =
    roadAddress || jibunAddress || normalizeText(addressData.address);
  const detailAddress = normalizeText(currentDetailAddress);

  return {
    location: createDisplayLocation(baseAddress, detailAddress),
    postalCode: normalizeText(addressData.zonecode),
    roadAddress,
    jibunAddress,
    detailAddress,
    latitude: null,
    longitude: null,
    locationSource: "POSTCODE",
    region1DepthName: normalizeText(addressData.sido),
    region2DepthName: normalizeText(addressData.sigungu),
    region3DepthName:
      normalizeText(addressData.bname) ||
      normalizeText(addressData.bname2) ||
      normalizeText(addressData.bname1),
  };
}

export async function loadDaumPostcodeScript() {
  if (typeof window === "undefined") {
    return;
  }

  if (window.daum?.Postcode) {
    return;
  }

  if (!postcodeScriptPromise) {
    postcodeScriptPromise = new Promise<void>((resolve, reject) => {
      const existingScript = document.querySelector<HTMLScriptElement>(
        `script[src="${DAUM_POSTCODE_SCRIPT_URL}"]`,
      );

      if (existingScript) {
        existingScript.addEventListener("load", () => resolve(), { once: true });
        existingScript.addEventListener(
          "error",
          () => reject(new Error("카카오 우편번호 스크립트를 불러오지 못했습니다.")),
          { once: true },
        );
        return;
      }

      const script = document.createElement("script");
      script.src = DAUM_POSTCODE_SCRIPT_URL;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () =>
        reject(new Error("카카오 우편번호 스크립트를 불러오지 못했습니다."));
      document.body.appendChild(script);
    }).catch((error) => {
      postcodeScriptPromise = null;
      throw error;
    });
  }

  return postcodeScriptPromise;
}

export async function openDaumPostcodeSearch(
  currentDetailAddress = "",
): Promise<LocationFormValues> {
  await loadDaumPostcodeScript();

  return new Promise<LocationFormValues>((resolve, reject) => {
    if (!window.daum?.Postcode) {
      reject(new Error("카카오 우편번호 서비스를 사용할 수 없습니다."));
      return;
    }

    new window.daum.Postcode({
      oncomplete: (data) =>
        resolve(createLocationFormFromPostcode(data, currentDetailAddress)),
      onclose: (state) => {
        if (state === "FORCE_CLOSE") {
          reject(new Error("주소 검색이 취소되었습니다."));
        }
      },
    }).open();
  });
}

function getCurrentPosition() {
  return new Promise<GeolocationPosition>((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("이 브라우저에서는 현재 위치를 지원하지 않습니다."));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });
  });
}

export async function resolveCurrentLocation() {
  const position = await getCurrentPosition();
  const resolvedLocation = await locationApi.resolveLocation({
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  });

  return createLocationFormFromResolvedLocation(resolvedLocation);
}
