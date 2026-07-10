"use client";

import { useCallback, useState } from "react";

import type { ImageUploadTarget, UploadImageResult } from "../server/types";

export type UseUploadImageOptions = {
  /** Defaults to `/api/upload/image`. */
  endpoint?: string;
  onSuccess?: (result: UploadImageResult) => void;
  onError?: (error: Error) => void;
};

export function useUploadImage(options: UseUploadImageOptions = {}) {
  const { endpoint = "/api/upload/image", onSuccess, onError } = options;
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (file: File, target: ImageUploadTarget): Promise<UploadImageResult> => {
      setIsUploading(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("target", JSON.stringify(target));

        const response = await fetch(endpoint, {
          method: "POST",
          body: formData,
        });

        const payload = (await response.json()) as UploadImageResult & {
          error?: string;
        };

        if (!response.ok) {
          throw new Error(payload.error || "Failed to upload image");
        }

        onSuccess?.(payload);
        return payload;
      } catch (uploadError) {
        const message =
          uploadError instanceof Error
            ? uploadError.message
            : "Failed to upload image";
        setError(message);
        onError?.(uploadError instanceof Error ? uploadError : new Error(message));
        throw uploadError;
      } finally {
        setIsUploading(false);
      }
    },
    [endpoint, onError, onSuccess],
  );

  return { upload, isUploading, error };
}

export function useUploadProfilePicture(options: UseUploadImageOptions = {}) {
  const { upload, isUploading, error } = useUploadImage(options);

  const mutate = useCallback(
    (file: File) => upload(file, { kind: "user-avatar" }),
    [upload],
  );

  return { mutate, upload, isUploading, error };
}

export function useUploadOrganizationIcon(
  organizationId: string | null,
  options: UseUploadImageOptions = {},
) {
  const { upload, isUploading, error } = useUploadImage(options);

  const mutate = useCallback(
    (file: File) => {
      if (!organizationId) {
        return Promise.reject(new Error("No organization selected"));
      }

      return upload(file, {
        kind: "organization-icon",
        organizationId,
      });
    },
    [organizationId, upload],
  );

  return { mutate, upload, isUploading, error };
}
