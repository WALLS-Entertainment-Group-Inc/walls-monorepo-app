export type ImageUploadTarget =
  | { kind: "user-avatar" }
  | { kind: "organization-icon"; organizationId: string };

export type UploadImageResult = {
  url: string;
  key: string;
  message: string;
};
