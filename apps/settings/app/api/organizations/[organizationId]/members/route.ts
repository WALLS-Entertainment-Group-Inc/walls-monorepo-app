import { NextResponse } from "next/server";

import {
  addAccountMember,
  canManageAccountMembers,
  findUserByEmail,
  getAccountMembershipForUser,
  listAccountMembers,
} from "@/lib/accounts";
import { canEditOrganization, getOrganizationForUser } from "@/lib/organizations";
import { getCurrentUserId } from "@/lib/session";

type RouteContext = {
  params: Promise<{ organizationId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { organizationId: accountId } = await context.params;
  const organization = await getOrganizationForUser(userId, accountId);

  if (!organization) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const members = await listAccountMembers(accountId);
  return NextResponse.json({ members, accountId });
}

export async function POST(request: Request, context: RouteContext) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { organizationId: accountId } = await context.params;
  const organization = await getOrganizationForUser(userId, accountId);

  if (!organization || !canEditOrganization(organization.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const actorMembership = await getAccountMembershipForUser(userId, accountId);
  if (!actorMembership || !canManageAccountMembers(actorMembership.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as {
    email?: string;
    userId?: string;
    role?: "owner" | "admin" | "member";
  };

  if (!body.email?.trim() && !body.userId) {
    return NextResponse.json(
      { error: "Email or user ID is required" },
      { status: 400 },
    );
  }

  let targetUserId = body.userId;
  if (!targetUserId && body.email) {
    const user = await findUserByEmail(body.email);
    if (!user) {
      return NextResponse.json(
        { error: "No user found with that email" },
        { status: 404 },
      );
    }
    targetUserId = user.id;
  }

  if (!targetUserId) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const role = body.role ?? "member";
  if (role === "owner" && actorMembership.role !== "owner") {
    return NextResponse.json(
      { error: "Only owners can assign the owner role" },
      { status: 403 },
    );
  }

  const result = await addAccountMember({
    accountId,
    userId: targetUserId,
    role,
  });

  if (!result.ok) {
    const status = result.error.includes("already") ? 409 : 400;
    return NextResponse.json({ error: result.error }, { status });
  }

  const members = await listAccountMembers(accountId);
  return NextResponse.json({ members });
}
