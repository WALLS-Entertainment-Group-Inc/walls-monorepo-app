"use client";

import { Building2, Users } from "lucide-react";

import { AdminViewUser } from "@/components/admin/adminUsers/admin-view-user";
import { useActiveAccount } from "@/components/active-account-context";
import type { AccountRole } from "@/lib/accounts-shared";
import { canManageAccountMembers } from "@/lib/accounts-shared";

type UsersUserPageContentProps = {
  userId: string;
};

export function UsersUserPageContent({ userId }: UsersUserPageContentProps) {
  const { activeAccount, activeAccountId, loading } = useActiveAccount();

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl animate-pulse space-y-4 py-2">
        <div className="h-4 w-24 rounded bg-neutral-200/80" />
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-neutral-200/80" />
          <div className="space-y-2">
            <div className="h-7 w-48 rounded bg-neutral-200/80" />
            <div className="h-4 w-56 rounded bg-neutral-100" />
          </div>
        </div>
        <div className="h-64 rounded-xl bg-white" />
      </div>
    );
  }

  if (!activeAccountId || !activeAccount) {
    return (
      <div className="mx-auto max-w-3xl rounded-xl border border-neutral-200/80 bg-white px-6 py-16 text-center">
        <Building2 className="mx-auto h-10 w-10 text-neutral-300" />
        <p className="mt-4 text-sm font-medium text-neutral-800">
          No account selected
        </p>
        <p className="mt-1 text-sm font-light text-neutral-500">
          Choose an account from the header to view this user.
        </p>
      </div>
    );
  }

  if (activeAccount.accountType !== "organization") {
    return (
      <div className="mx-auto max-w-3xl rounded-xl border border-neutral-200/80 bg-white px-6 py-12 text-center">
        <Users className="mx-auto h-8 w-8 text-neutral-300" />
        <p className="mt-3 text-sm font-medium text-neutral-800">
          User details are available for organizations
        </p>
        <p className="mt-1 text-sm font-light text-neutral-500">
          Switch to an organization account in the header to manage members.
        </p>
      </div>
    );
  }

  const actorRole = (activeAccount.role as AccountRole) || "member";
  const canEdit = canManageAccountMembers(actorRole);

  return (
    <AdminViewUser
      userId={userId}
      organizationId={activeAccountId}
      actorRole={actorRole}
      canEdit={canEdit}
    />
  );
}
