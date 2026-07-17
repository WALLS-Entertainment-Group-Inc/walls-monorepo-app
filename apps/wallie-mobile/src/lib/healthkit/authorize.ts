import { Platform } from "react-native";

import {
  isHealthDataAvailable,
  requestAuthorization,
} from "@kingstinct/react-native-healthkit";

import {
  HEALTHKIT_READ_TYPES,
  HEALTHKIT_WRITE_TYPES,
} from "./permissions";

export function isAppleHealthSupported(): boolean {
  if (Platform.OS !== "ios") return false;
  try {
    return isHealthDataAvailable();
  } catch {
    return false;
  }
}

/**
 * Presents the iOS HealthKit permission sheet.
 * Must be called before any HealthKit reads or the app can crash.
 */
export async function requestAppleHealthAuthorization(): Promise<boolean> {
  if (!isAppleHealthSupported()) return false;
  return requestAuthorization(
    [...HEALTHKIT_WRITE_TYPES],
    [...HEALTHKIT_READ_TYPES],
  );
}
