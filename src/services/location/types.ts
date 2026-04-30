export type LocationSource = "MANUAL" | "POSTCODE" | "GPS";

export interface ResolveLocationRequest {
  latitude: number;
  longitude: number;
}

export interface ResolvedLocationResponse {
  location: string;
  postalCode: string | null;
  roadAddress: string | null;
  jibunAddress: string | null;
  detailAddress: string | null;
  latitude: number;
  longitude: number;
  locationSource: LocationSource;
  region1DepthName: string | null;
  region2DepthName: string | null;
  region3DepthName: string | null;
}

export interface LocationFormValues {
  location: string;
  postalCode: string;
  roadAddress: string;
  jibunAddress: string;
  detailAddress: string;
  latitude: number | null;
  longitude: number | null;
  locationSource: LocationSource | null;
  region1DepthName: string;
  region2DepthName: string;
  region3DepthName: string;
}

export interface DaumPostcodeAddressData {
  zonecode: string;
  address: string;
  addressType: "R" | "J";
  userSelectedType: "R" | "J";
  roadAddress: string;
  jibunAddress: string;
  buildingName: string;
  apartment: "Y" | "N";
  bname: string;
  sido: string;
  sigungu: string;
  bname1: string;
  bname2: string;
}
