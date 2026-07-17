import { createClient } from "@walls/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import {
  findAutoScheduleSlots,
  type AutoScheduleRequest,
} from "@/lib/auto-schedule";

/**
 * POST /api/project-tasks/auto-schedule
 * Algorithmically finds the next open slot(s) inside a user schedule,
 * avoiding calendar events (incl. recurring) and existing task blocks.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const userScheduleId =
      typeof body.userScheduleId === "string" ? body.userScheduleId.trim() : "";
    const durationMinutes = Number(body.durationMinutes);

    if (!userScheduleId) {
      return NextResponse.json(
        { error: "userScheduleId is required" },
        { status: 400 }
      );
    }
    if (!Number.isFinite(durationMinutes) || durationMinutes < 15) {
      return NextResponse.json(
        { error: "durationMinutes must be at least 15" },
        { status: 400 }
      );
    }

    const payload: AutoScheduleRequest = {
      userScheduleId,
      durationMinutes,
      allowSplitBlocks: body.allowSplitBlocks === true,
      minBlockMinutes:
        body.minBlockMinutes != null ? Number(body.minBlockMinutes) : undefined,
      preferredDate:
        typeof body.preferredDate === "string" ? body.preferredDate : null,
      dueDate: typeof body.dueDate === "string" ? body.dueDate : null,
      priority: body.priority != null ? Number(body.priority) : null,
      isBlocking: body.isBlocking === true,
      excludeTaskId:
        typeof body.excludeTaskId === "string" ? body.excludeTaskId : null,
      assigneeId:
        typeof body.assigneeId === "string" && body.assigneeId
          ? body.assigneeId
          : user.id,
      timezone: typeof body.timezone === "string" ? body.timezone : null,
    };

    const result = await findAutoScheduleSlots(supabase, user.id, payload);

    if (result.slots.length === 0) {
      return NextResponse.json(
        {
          error:
            "No open slot found in that schedule for the given duration. Try splitting, a shorter duration, or a different schedule.",
          urgencyScore: result.urgencyScore,
          searchDays: result.searchDays,
          timezone: result.timezone,
          slots: [],
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      slots: result.slots,
      timezone: result.timezone,
      urgencyScore: result.urgencyScore,
      searchDays: result.searchDays,
      isBlocking: payload.isBlocking === true,
    });
  } catch (e) {
    console.error("Error in auto-schedule:", e);
    const message =
      e instanceof Error ? e.message : "Failed to find a schedule slot";
    const status =
      message.includes("not found") || message.includes("no active days")
        ? 400
        : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
