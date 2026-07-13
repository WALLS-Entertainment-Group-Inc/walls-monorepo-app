"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Trash2, UserPlus } from "lucide-react";

import { wallsToast } from "@/components/ui/walls-toast";
import { Button } from "@/components/ui/button";
import { Input as BorderlessInput } from "@/components/ui/borderless-input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AccountMemberRecord, AccountRole } from "@/lib/accounts-shared";
import { canManageAccountMembers } from "@/lib/accounts-shared";

const fieldClass =
  "border-0 border-b border-neutral-200 rounded-none px-0 py-2 font-light focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus:ring-0 focus:border-b-[var(--walls-sky)] bg-transparent w-full placeholder:text-neutral-300";
const labelClass =
  "text-xs font-normal text-neutral-400 tracking-wide block mb-1";

function MemberAvatar({
  firstName,
  lastName,
  email,
}: {
  firstName: string | null;
  lastName: string | null;
  email: string;
}) {
  const initials = `${firstName?.charAt(0) ?? ""}${lastName?.charAt(0) ?? ""}`
    .trim()
    .toUpperCase();

  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-xs font-medium text-neutral-700">
      {initials || email.charAt(0).toUpperCase()}
    </div>
  );
}

function displayName(member: AccountMemberRecord): string {
  const fullName = `${member.firstName ?? ""} ${member.lastName ?? ""}`.trim();
  return fullName || member.email;
}

type OrganizationMembersProps = {
  organizationId: string;
  actorRole: AccountRole;
  canEdit: boolean;
};

export function OrganizationMembers({
  organizationId,
  actorRole,
  canEdit,
}: OrganizationMembersProps) {
  const [members, setMembers] = useState<AccountMemberRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<AccountRole>("member");
  const [inviting, setInviting] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [removingUserId, setRemovingUserId] = useState<string | null>(null);

  const canManage = canEdit && canManageAccountMembers(actorRole);

  const loadMembers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/organizations/${organizationId}/members`,
        { cache: "no-store" },
      );
      if (!response.ok) return;

      const payload = (await response.json()) as {
        members?: AccountMemberRecord[];
      };
      setMembers(payload.members ?? []);
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  useEffect(() => {
    void loadMembers();
  }, [loadMembers]);

  async function handleInvite() {
    if (!inviteEmail.trim()) {
      wallsToast.error("Missing email", "Enter a user email to add");
      return;
    }

    setInviting(true);
    try {
      const response = await fetch(
        `/api/organizations/${organizationId}/members`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: inviteEmail.trim(),
            role: inviteRole,
          }),
        },
      );

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        wallsToast.error("Error", payload.error || "Failed to add member");
        return;
      }

      const payload = (await response.json()) as {
        members?: AccountMemberRecord[];
      };
      setMembers(payload.members ?? []);
      setInviteEmail("");
      setInviteRole("member");
      wallsToast.success("Member added", "User was added to this organization");
    } finally {
      setInviting(false);
    }
  }

  async function handleRoleChange(userId: string, role: AccountRole) {
    setUpdatingUserId(userId);
    try {
      const response = await fetch(
        `/api/organizations/${organizationId}/members/${userId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role }),
        },
      );

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        wallsToast.error("Error", payload.error || "Failed to update role");
        return;
      }

      const payload = (await response.json()) as {
        members?: AccountMemberRecord[];
      };
      setMembers(payload.members ?? []);
      wallsToast.success("Role updated", "Member role was updated");
    } finally {
      setUpdatingUserId(null);
    }
  }

  async function handleRemove(userId: string) {
    setRemovingUserId(userId);
    try {
      const response = await fetch(
        `/api/organizations/${organizationId}/members/${userId}`,
        { method: "DELETE" },
      );

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        wallsToast.error("Error", payload.error || "Failed to remove member");
        return;
      }

      const payload = (await response.json()) as {
        members?: AccountMemberRecord[];
      };
      setMembers(payload.members ?? []);
      wallsToast.success("Member removed", "User was removed from this organization");
    } finally {
      setRemovingUserId(null);
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {canManage ? (
        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <p className="mb-4 text-sm font-light text-neutral-500">
            Add an existing WALLS user to this organization by email.
          </p>
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1">
              <label className={labelClass}>Email</label>
              <BorderlessInput
                value={inviteEmail}
                onChange={(event) => setInviteEmail(event.target.value)}
                className={fieldClass}
                placeholder="user@example.com"
              />
            </div>
            <div className="w-full md:w-40">
              <label className={labelClass}>Role</label>
              <Select
                value={inviteRole}
                onValueChange={(value) => setInviteRole(value as AccountRole)}
              >
                <SelectTrigger className="rounded-none border-0 border-b border-neutral-200 px-0 shadow-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  {actorRole === "owner" ? (
                    <SelectItem value="owner">Owner</SelectItem>
                  ) : null}
                </SelectContent>
              </Select>
            </div>
            <Button
              type="button"
              disabled={inviting}
              className="rounded-none border border-neutral-200/50 bg-walls-yellow px-6 py-6 font-normal text-black hover:bg-walls-yellow"
              onClick={() => void handleInvite()}
            >
              {inviting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <UserPlus className="mr-2 h-4 w-4" />
              )}
              Add member
            </Button>
          </div>
        </div>
      ) : null}

      <div className="space-y-2">
        {members.map((member) => {
          const isUpdating = updatingUserId === member.userId;
          const isRemoving = removingUserId === member.userId;
          const canEditMember =
            canManage && (actorRole === "owner" || member.role !== "owner");

          return (
            <div
              key={member.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <MemberAvatar
                  firstName={member.firstName}
                  lastName={member.lastName}
                  email={member.email}
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {displayName(member)}
                  </p>
                  <p className="truncate text-xs font-light text-neutral-500">
                    {member.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {canEditMember ? (
                  <Select
                    value={member.role}
                    disabled={isUpdating || isRemoving}
                    onValueChange={(value) =>
                      void handleRoleChange(member.userId, value as AccountRole)
                    }
                  >
                    <SelectTrigger className="h-9 w-28 rounded-full border border-neutral-200 text-xs shadow-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      {actorRole === "owner" ? (
                        <SelectItem value="owner">Owner</SelectItem>
                      ) : null}
                    </SelectContent>
                  </Select>
                ) : (
                  <span className="rounded-full border border-neutral-200 px-3 py-1 text-xs capitalize text-neutral-600">
                    {member.role}
                  </span>
                )}

                {canEditMember ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={isRemoving || isUpdating}
                    className="h-9 w-9 text-neutral-500 hover:text-red-600"
                    onClick={() => void handleRemove(member.userId)}
                  >
                    {isRemoving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {members.length === 0 ? (
        <p className="text-sm font-light text-neutral-500">
          No members found for this organization account.
        </p>
      ) : null}
    </div>
  );
}
