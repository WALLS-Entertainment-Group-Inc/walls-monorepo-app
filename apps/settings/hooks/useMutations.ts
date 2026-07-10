"use client";

import { useCallback } from "react";

import { wallsToast } from "@/components/ui/walls-toast";
import {
  useUploadOrganizationIcon as useR2UploadOrganizationIcon,
  useUploadProfilePicture as useR2UploadProfilePicture,
} from "@walls/storage/react";

export function useUploadProfilePicture() {
  const { mutate: uploadProfilePicture, isUploading } = useR2UploadProfilePicture({
    onSuccess: () => {
      wallsToast.success(
        "Profile picture updated",
        "Your avatar has been saved",
      );
    },
    onError: () => {
      wallsToast.error("Upload failed", "Could not update profile picture");
    },
  });

  const mutate = useCallback(
    async (file: File) => {
      try {
        await uploadProfilePicture(file);
      } catch {
        // Toast handled in onError.
      }
    },
    [uploadProfilePicture],
  );

  return { mutate, isUploading };
}

export function useUploadOrganizationIcon(organizationId: string | null) {
  const { mutate: uploadOrganizationIcon, isUploading } =
    useR2UploadOrganizationIcon(organizationId, {
      onSuccess: () => {
        wallsToast.success("Icon updated", "Organization icon has been saved");
      },
      onError: () => {
        wallsToast.error("Upload failed", "Could not update organization icon");
      },
    });

  const mutate = useCallback(
    async (file: File) => {
      try {
        return await uploadOrganizationIcon(file);
      } catch {
        // Toast handled in onError.
        return null;
      }
    },
    [uploadOrganizationIcon],
  );

  return { mutate, isUploading };
}

export function useUploadTimezone() {
  const mutate = useCallback(async (_timezone: string) => {
    // Stub — timezone form handles persistence directly for now.
  }, []);

  return { mutate };
}
