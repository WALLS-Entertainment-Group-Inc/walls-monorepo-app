import type { BoardTaskScope } from "./types";

export type TaskScopeMetaRow = {
  project_id: string;
  assignee_id: string | null;
  assigned_by: string | null;
  is_private: boolean;
};

/** Scope flags for a set of projects (pass all accessible ids, or one selected project). */
export function getTaskScopeFlags(
  rows: TaskScopeMetaRow[],
  userId: string,
  projectIds: string[]
): { canSeeOthersTasks: boolean; hasAssignedTasks: boolean } {
  if (projectIds.length === 0) {
    return { canSeeOthersTasks: false, hasAssignedTasks: false };
  }
  const idSet = new Set(projectIds);
  let othersVisible = 0;
  let assignedByUser = 0;

  for (const row of rows) {
    if (!idSet.has(row.project_id)) continue;
    if (row.assigned_by === userId && row.assignee_id !== userId) {
      assignedByUser += 1;
    }
    if (
      !row.is_private &&
      (row.assignee_id !== userId || row.assignee_id == null)
    ) {
      othersVisible += 1;
    }
  }

  return {
    canSeeOthersTasks: othersVisible > 0,
    hasAssignedTasks: assignedByUser > 0,
  };
}

export function getBoardTaskScopeOptions(
  canSeeOthersTasks: boolean,
  hasAssignedTasks: boolean
): BoardTaskScope[] {
  if (!canSeeOthersTasks && !hasAssignedTasks) return [];
  const options: BoardTaskScope[] = ["mine"];
  if (canSeeOthersTasks) options.push("project");
  if (hasAssignedTasks) options.push("assigned");
  return options;
}

export function resolveBoardTaskScope(
  filter: BoardTaskScope,
  options: BoardTaskScope[]
): BoardTaskScope {
  if (options.length === 0) return "mine";
  if (options.includes(filter)) return filter;
  if (options.includes("project")) return "project";
  return options[0] ?? "mine";
}

export function parseBoardTaskScope(param: string | null): BoardTaskScope {
  if (param === "assigned") return "assigned";
  if (param === "mine" || param === "owned") return "mine";
  if (param === "project" || param === "all") return "project";
  return "project";
}

export function defaultBoardTaskScope(options: BoardTaskScope[]): BoardTaskScope {
  if (options.includes("project")) return "project";
  return options[0] ?? "mine";
}
