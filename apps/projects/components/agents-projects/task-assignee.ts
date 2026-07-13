import type { ProjectTask, TaskAssignee, TaskStatus } from "./types";

export function getTaskAssigneeDisplayName(
  assignee: TaskAssignee | null | undefined,
  assigneeId: string | null | undefined,
  currentUserId?: string | null
): string {
  if (assigneeId && currentUserId && assigneeId === currentUserId) return "You";
  if (!assignee) return assigneeId ? "Assigned" : "Unassigned";
  const name = `${assignee.first_name ?? ""} ${assignee.last_name ?? ""}`.trim();
  return name || assignee.email || "Unassigned";
}

export function getTaskAssigneeInitials(
  assignee: TaskAssignee | null | undefined
): string {
  if (!assignee) return "?";
  const first = assignee.first_name?.[0] ?? "";
  const last = assignee.last_name?.[0] ?? "";
  if (first || last) return `${first}${last}`.toUpperCase();
  return assignee.email?.[0]?.toUpperCase() ?? "?";
}

/** Normalizes a Supabase `project_tasks` row (optional embedded assignee). */
export function mapProjectTaskRow(
  row: Record<string, unknown>
): Omit<ProjectTask, "project"> {
  const assigneeRaw = row.assignee ?? row.users;
  let assignee: TaskAssignee | null = null;
  if (assigneeRaw) {
    const entry = Array.isArray(assigneeRaw) ? assigneeRaw[0] : assigneeRaw;
    if (entry && typeof entry === "object" && "id" in entry) {
      assignee = entry as TaskAssignee;
    }
  }

  const { assignee: _a, users: _u, ...rest } = row;
  const rawStatus = String(rest.status ?? "todo");
  const status = (
    rawStatus === "done" ? "completed" : rawStatus
  ) as TaskStatus;

  return {
    ...(rest as Omit<ProjectTask, "project" | "assignee" | "status">),
    status,
    assignee,
  };
}

/** Select fragment for task queries that need assignee on cards. */
export const PROJECT_TASK_SELECT_WITH_ASSIGNEE =
  "id, project_id, title, description, status, due_date, priority, position, parent_task_id, created_at, updated_at, completed_at, start_date, assignee_id, assigned_by, is_private, estimated_minutes, actual_minutes, metadata, assignee:users!assignee_id(id, first_name, last_name, email, avatar_url)";
