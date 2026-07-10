import type { SupabaseClient, User } from "@supabase/supabase-js";

import {
  organizationIconPrefix,
  userAvatarPrefix,
} from "./prefixes";
import {
  deleteObjectsWithPrefix,
  getR2PublicUrl,
  putImageObject,
} from "./r2";
import { resolveAppUserRecord } from "./resolve-user";
import type { ImageUploadTarget, UploadImageResult } from "./types";

const EDITABLE_ORG_ROLES = new Set(["owner", "admin"]);

function fileExtension(file: File): string {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName && /^[a-z0-9]+$/.test(fromName)) {
    return fromName;
  }

  const fromType = file.type.split("/").pop()?.toLowerCase();
  if (fromType && fromType !== "octet-stream") {
    return fromType === "jpeg" ? "jpg" : fromType;
  }

  return "jpg";
}

async function assertCanEditOrganization(
  supabase: SupabaseClient,
  userId: string,
  organizationId: string,
): Promise<void> {
  const { data, error } = await supabase
    .from("user_organizations")
    .select("role")
    .eq("user_id", userId)
    .eq("organization_id", organizationId)
    .maybeSingle();

  if (error || !data?.role || !EDITABLE_ORG_ROLES.has(data.role)) {
    throw new Error("Forbidden");
  }
}

async function uploadToPrefix(
  file: File,
  prefix: string,
): Promise<{ url: string; key: string }> {
  await deleteObjectsWithPrefix(prefix);

  const key = `${prefix}${crypto.randomUUID()}.${fileExtension(file)}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await putImageObject(key, buffer, file.type || "application/octet-stream");

  return {
    key,
    url: getR2PublicUrl(key),
  };
}

export async function uploadImage({
  supabase,
  authUser,
  file,
  target,
}: {
  supabase: SupabaseClient;
  authUser: User;
  file: File;
  target: ImageUploadTarget;
}): Promise<UploadImageResult> {
  if (!file.size) {
    throw new Error("File is empty");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Only image uploads are supported");
  }

  const appUser = await resolveAppUserRecord(supabase, authUser);

  if (target.kind === "user-avatar") {
    const prefix = userAvatarPrefix(appUser.id);
    const { url, key } = await uploadToPrefix(file, prefix);

    const { error } = await supabase
      .from("users")
      .update({ avatar_url: url })
      .eq("id", appUser.id);

    if (error) {
      throw new Error(error.message || "Failed to save avatar URL");
    }

    return {
      url,
      key,
      message: "Profile picture updated successfully",
    };
  }

  await assertCanEditOrganization(supabase, appUser.id, target.organizationId);

  const prefix = organizationIconPrefix(target.organizationId);
  const { url, key } = await uploadToPrefix(file, prefix);

  const { error } = await supabase
    .from("organizations")
    .update({ icon_url: url })
    .eq("id", target.organizationId);

  if (error) {
    throw new Error(error.message || "Failed to save organization icon URL");
  }

  return {
    url,
    key,
    message: "Organization icon updated successfully",
  };
}
