import type { WallieThread } from "@walls/wallie-core";

type TimeCategory =
  | "Pinned"
  | "Today"
  | "This Week"
  | "Last Week"
  | "This Month"
  | "Last Month"
  | "This Year"
  | "Older";

const categoryOrder: TimeCategory[] = [
  "Pinned",
  "Today",
  "This Week",
  "Last Week",
  "This Month",
  "Last Month",
  "This Year",
  "Older",
];

function getTimeCategory(dateString: string): TimeCategory {
  const date = new Date(dateString);
  const now = new Date();

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const threadDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  const diffTime = today.getTime() - threadDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  const startOfLastWeek = new Date(startOfWeek);
  startOfLastWeek.setDate(startOfWeek.getDate() - 7);

  if (diffDays === 0) return "Today";
  if (threadDate >= startOfWeek) return "This Week";
  if (threadDate >= startOfLastWeek) return "Last Week";
  if (
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  ) {
    return "This Month";
  }
  if (
    (date.getMonth() === now.getMonth() - 1 &&
      date.getFullYear() === now.getFullYear()) ||
    (now.getMonth() === 0 &&
      date.getMonth() === 11 &&
      date.getFullYear() === now.getFullYear() - 1)
  ) {
    return "Last Month";
  }
  if (date.getFullYear() === now.getFullYear()) return "This Year";
  return "Older";
}

export interface ThreadSection {
  title: TimeCategory;
  data: WallieThread[];
}

export function categorizeThreads(threads: WallieThread[]): ThreadSection[] {
  const groups: Record<TimeCategory, WallieThread[]> = {
    Pinned: [],
    Today: [],
    "This Week": [],
    "Last Week": [],
    "This Month": [],
    "Last Month": [],
    "This Year": [],
    Older: [],
  };

  threads.forEach((thread) => {
    if (thread.is_pinned) {
      groups.Pinned.push(thread);
      return;
    }

    const category = getTimeCategory(thread.updated_at || thread.created_at);
    groups[category].push(thread);
  });

  return categoryOrder
    .filter((category) => groups[category].length > 0)
    .map((category) => ({
      title: category,
      data: groups[category],
    }));
}
