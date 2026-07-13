import { NextResponse } from "next/server";

import {
  canChangeAccountMemberRole,
  canManageAccountMembers,
  canRemoveAccountMember,
  getAccountMembershipForUser,
  listAccountMembers,
  removeAccountMember,
  updateAccountMemberRole,
  type AccountRole,
} from "@/lib/accounts";
import { canEditOrganization, getOrganizationForUser } from "@/lib/organizations";
import { getCurrentUserId } from "@/lib/session";

type RouteContext = {
  params: Promise<{ organizationId: string; userId: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const actorUserId = await getCurrentUserId();
  if (!actorUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { organizationId: accountId, userId: targetUserId } =
    await context.params;
  const organization = await getOrganizationForUser(actorUserId, accountId);

  if (!organization || !canEditOrganization(organization.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const actorMembership = await getAccountMembershipForUser(
    actorUserId,
    accountId,
  );
  const targetMembership = await getAccountMembershipForUser(
    targetUserId,
    accountId,
  );

  if (
    !actorMembership ||
    !targetMembership ||
    !canManageAccountMembers(actorMembership.role)
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as { role?: AccountRole };
  if (!body.role) {
    return NextResponse.json({ error: "Role is required" }, { status: 400 });
  }

  if (!canChangeAccountMemberRole(actorMembership.role, targetMembership.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (body.role === "owner" && actorMembership.role !== "owner") {
    return NextResponse.json(
      { error: "Only owners can assign the owner role" },
      { status: 403 },
    );
  }

  const result = await updateAccountMemberRole({
    accountId,
    userId: targetUserId,
    role: body.role,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const members = await listAccountMembers(accountId);
  return NextResponse.json({ members });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const actorUserId = await getCurrentUserId();
  if (!actorUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { organizationId: accountId, userId: targetUserId } =
    await context.params;
  const organization = await getOrganizationForUser(actorUserId, accountId);

  if (!organization || !canEditOrganization(organization.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const actorMembership = await getAccountMembershipForUser(
    actorUserId,
    accountId,
  );
  const targetMembership = await getAccountMembershipForUser(
    targetUserId,
    accountId,
  );

  if (
    !actorMembership ||
    !targetMembership ||
    !canManageAccountMembers(actorMembership.role)
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (
    !canRemoveAccountMember(
      actorMembership.role,
      targetMembership.role,
      actorUserId,
      targetUserId,
    )
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const result = await removeAccountMember({
    accountId,
    userId: targetUserId,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const members = await listAccountMembers(accountId);
  return NextResponse.json({ members });
}
