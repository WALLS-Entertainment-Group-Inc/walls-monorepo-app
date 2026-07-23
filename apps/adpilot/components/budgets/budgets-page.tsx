"use client";

import * as React from "react";
import {
  Check,
  ChevronDown,
  Landmark,
  Loader2,
  Pencil,
  Plus,
  Star,
  Target,
  Trash2,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@walls/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@walls/ui/dropdown-menu";
import { Textarea } from "@walls/ui/textarea";
import { cn } from "@walls/utils";

import {
  ALLOCATION_CATEGORY_OPTIONS,
  CHANNEL_OPTIONS,
  OBJECTIVE_METRIC_OPTIONS,
  PERIOD_STATUS_OPTIONS,
  PERIOD_TYPE_OPTIONS,
  TARGET_OPERATOR_OPTIONS,
  formatBudgetCurrency,
  formatObjectiveTarget,
  formatPeriodRange,
  metricLabel,
  microsToDollars,
  type BudgetAllocation,
  type BudgetAllocationCategory,
  type BudgetChannel,
  type BudgetObjective,
  type BudgetObjectiveMetric,
  type BudgetPeriod,
  type BudgetPeriodStatus,
  type BudgetPeriodType,
  type BudgetTargetOperator,
} from "@/lib/budgets-shared";

import {
  panelGlassClass,
  primaryButtonClass,
  secondaryButtonClass,
  dangerButtonClass,
  glassToggleCardBaseClass,
  glassToggleCardActiveClass,
  glassToggleCardInactiveClass,
} from "@/components/ui/button-styles";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { FloatingLabelDatePicker } from "@/components/ui/floating-label-date-picker";
import { SectionLabel } from "@/components/settings/section-label";

function parseIsoDate(iso: string | null | undefined): Date | null {
  if (!iso) return null;
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function toIsoDate(date: Date | null): string | null {
  if (!date || Number.isNaN(date.getTime())) return null;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function statusBadgeClass(status: BudgetPeriodStatus, effective: boolean) {
  if (effective) {
    return "bg-emerald-50 text-emerald-700 ring-emerald-200/80";
  }
  switch (status) {
    case "active":
      return "bg-sky-50 text-sky-700 ring-sky-200/80";
    case "planned":
      return "bg-amber-50 text-amber-800 ring-amber-200/80";
    case "completed":
      return "bg-neutral-100 text-neutral-600 ring-neutral-200/80";
    case "archived":
      return "bg-neutral-50 text-neutral-400 ring-neutral-200/60";
  }
}

function statusLabel(period: BudgetPeriod) {
  if (period.isCurrentlyEffective) return "In effect";
  return PERIOD_STATUS_OPTIONS.find((s) => s.value === period.status)?.label ?? period.status;
}

function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (value: T) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <div className="pt-2">
      <p className="mb-1.5 px-1 text-[11px] font-medium uppercase tracking-wider text-neutral-400">
        {label}
      </p>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex h-12 w-full items-center justify-between rounded-2xl border border-neutral-200 bg-kenoo-white px-4 text-sm font-light text-foreground outline-none transition hover:border-neutral-300"
          >
            <span>{selected?.label ?? "Select"}</span>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-neutral-400 transition-transform",
                open && "rotate-180",
              )}
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="z-50 max-h-72 w-[var(--radix-dropdown-menu-trigger-width)] overflow-y-auto rounded-2xl border-0 bg-kenoo-white p-1.5 shadow-xl"
        >
          {options.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onSelect={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={cn(
                "cursor-pointer rounded-xl px-3 py-2.5 text-sm",
                option.value === value
                  ? "bg-neutral-100 font-semibold"
                  : "font-medium hover:bg-neutral-50",
              )}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

type PeriodFormState = {
  name: string;
  description: string;
  periodType: BudgetPeriodType;
  fiscalYear: string;
  fiscalQuarter: string;
  startDate: Date | null;
  endDate: Date | null;
  status: BudgetPeriodStatus;
  primaryFocus: string;
};

function emptyPeriodForm(): PeriodFormState {
  const now = new Date();
  const quarter = Math.floor(now.getMonth() / 3) + 1;
  const start = new Date(now.getFullYear(), (quarter - 1) * 3, 1);
  const end = new Date(now.getFullYear(), quarter * 3, 0);
  return {
    name: `Q${quarter} ${now.getFullYear()}`,
    description: "",
    periodType: "quarter",
    fiscalYear: String(now.getFullYear()),
    fiscalQuarter: String(quarter),
    startDate: start,
    endDate: end,
    status: "planned",
    primaryFocus: "",
  };
}

function periodToForm(period: BudgetPeriod): PeriodFormState {
  return {
    name: period.name,
    description: period.description ?? "",
    periodType: period.periodType,
    fiscalYear: period.fiscalYear != null ? String(period.fiscalYear) : "",
    fiscalQuarter:
      period.fiscalQuarter != null ? String(period.fiscalQuarter) : "",
    startDate: parseIsoDate(period.startDate),
    endDate: parseIsoDate(period.endDate),
    status: period.status,
    primaryFocus: period.primaryFocus ?? "",
  };
}

type AllocationFormState = {
  name: string;
  category: BudgetAllocationCategory;
  channel: BudgetChannel | "";
  amountDollars: string;
  notes: string;
};

function emptyAllocationForm(): AllocationFormState {
  return {
    name: "Ad spend",
    category: "media_spend",
    channel: "all",
    amountDollars: "100000",
    notes: "",
  };
}

type ObjectiveFormState = {
  name: string;
  metricKey: BudgetObjectiveMetric;
  customMetricLabel: string;
  targetValue: string;
  targetOperator: BudgetTargetOperator;
  targetUnit: string;
  isPrimary: boolean;
  notes: string;
};

function emptyObjectiveForm(): ObjectiveFormState {
  return {
    name: "Primary ROAS",
    metricKey: "roas",
    customMetricLabel: "",
    targetValue: "3",
    targetOperator: "gte",
    targetUnit: "x",
    isPrimary: true,
    notes: "",
  };
}

export function BudgetsPage() {
  const [periods, setPeriods] = React.useState<BudgetPeriod[]>([]);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  const [creatingPeriod, setCreatingPeriod] = React.useState(false);
  const [editingPeriod, setEditingPeriod] = React.useState(false);
  const [periodForm, setPeriodForm] = React.useState<PeriodFormState>(
    emptyPeriodForm,
  );

  const [addingAllocation, setAddingAllocation] = React.useState(false);
  const [allocationForm, setAllocationForm] = React.useState<AllocationFormState>(
    emptyAllocationForm,
  );
  const [editingAllocationId, setEditingAllocationId] = React.useState<
    string | null
  >(null);

  const [addingObjective, setAddingObjective] = React.useState(false);
  const [objectiveForm, setObjectiveForm] = React.useState<ObjectiveFormState>(
    emptyObjectiveForm,
  );
  const [editingObjectiveId, setEditingObjectiveId] = React.useState<
    string | null
  >(null);

  const selected = periods.find((p) => p.id === selectedId) ?? null;

  const loadPeriods = React.useCallback(async (preferId?: string | null) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/budgets");
      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? "Failed to load budgets");
      }
      const payload = (await response.json()) as { periods: BudgetPeriod[] };
      setPeriods(payload.periods);
      setSelectedId((current) => {
        if (preferId && payload.periods.some((p) => p.id === preferId)) {
          return preferId;
        }
        if (current && payload.periods.some((p) => p.id === current)) {
          return current;
        }
        return (
          payload.periods.find((p) => p.isCurrentlyEffective)?.id ??
          payload.periods[0]?.id ??
          null
        );
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load budgets");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadPeriods();
  }, [loadPeriods]);

  const startCreatePeriod = () => {
    setCreatingPeriod(true);
    setEditingPeriod(false);
    setPeriodForm(emptyPeriodForm());
  };

  const startEditPeriod = (period: BudgetPeriod) => {
    setEditingPeriod(true);
    setCreatingPeriod(false);
    setPeriodForm(periodToForm(period));
  };

  const cancelPeriodForm = () => {
    setCreatingPeriod(false);
    setEditingPeriod(false);
  };

  const savePeriod = async () => {
    if (!periodForm.name.trim() || !periodForm.startDate) {
      setError("Name and start date are required.");
      return;
    }
    if (periodForm.periodType !== "ongoing" && !periodForm.endDate) {
      setError("End date is required unless the period is ongoing.");
      return;
    }

    setBusy(true);
    setError(null);

    const body = {
      name: periodForm.name.trim(),
      description: periodForm.description.trim() || null,
      periodType: periodForm.periodType,
      fiscalYear: periodForm.fiscalYear
        ? Number(periodForm.fiscalYear)
        : null,
      fiscalQuarter: periodForm.fiscalQuarter
        ? Number(periodForm.fiscalQuarter)
        : null,
      startDate: toIsoDate(periodForm.startDate),
      endDate:
        periodForm.periodType === "ongoing"
          ? null
          : toIsoDate(periodForm.endDate),
      status: periodForm.status,
      primaryFocus: periodForm.primaryFocus.trim() || null,
    };

    const isEdit = editingPeriod && selected;
    const response = await fetch(
      isEdit ? `/api/budgets/${selected.id}` : "/api/budgets",
      {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
    );

    setBusy(false);

    if (!response.ok) {
      const payload = (await response.json()) as { error?: string };
      setError(payload.error ?? "Failed to save period");
      return;
    }

    const payload = (await response.json()) as { period: BudgetPeriod };
    cancelPeriodForm();
    await loadPeriods(payload.period.id);
  };

  const deletePeriod = async (period: BudgetPeriod) => {
    if (
      !window.confirm(
        `Delete “${period.name}” and all of its budgets and objectives?`,
      )
    ) {
      return;
    }
    setBusy(true);
    setError(null);
    const response = await fetch(`/api/budgets/${period.id}`, {
      method: "DELETE",
    });
    setBusy(false);
    if (!response.ok) {
      const payload = (await response.json()) as { error?: string };
      setError(payload.error ?? "Failed to delete period");
      return;
    }
    await loadPeriods(null);
  };

  const saveAllocation = async () => {
    if (!selected) return;
    const amount = Number(allocationForm.amountDollars);
    if (!allocationForm.name.trim() || !Number.isFinite(amount) || amount < 0) {
      setError("Allocation name and a valid amount are required.");
      return;
    }

    setBusy(true);
    setError(null);

    const body = {
      name: allocationForm.name.trim(),
      category: allocationForm.category,
      channel: allocationForm.channel || null,
      amountDollars: amount,
      notes: allocationForm.notes.trim() || null,
    };

    const isEdit = Boolean(editingAllocationId);
    const response = await fetch(
      isEdit
        ? `/api/budgets/${selected.id}/allocations/${editingAllocationId}`
        : `/api/budgets/${selected.id}/allocations`,
      {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
    );

    setBusy(false);

    if (!response.ok) {
      const payload = (await response.json()) as { error?: string };
      setError(payload.error ?? "Failed to save allocation");
      return;
    }

    setAddingAllocation(false);
    setEditingAllocationId(null);
    setAllocationForm(emptyAllocationForm());
    await loadPeriods(selected.id);
  };

  const deleteAllocation = async (allocation: BudgetAllocation) => {
    if (!selected) return;
    if (!window.confirm(`Delete allocation “${allocation.name}”?`)) return;
    setBusy(true);
    const response = await fetch(
      `/api/budgets/${selected.id}/allocations/${allocation.id}`,
      { method: "DELETE" },
    );
    setBusy(false);
    if (!response.ok) {
      const payload = (await response.json()) as { error?: string };
      setError(payload.error ?? "Failed to delete allocation");
      return;
    }
    await loadPeriods(selected.id);
  };

  const saveObjective = async () => {
    if (!selected) return;
    const targetValue = Number(objectiveForm.targetValue);
    if (!objectiveForm.name.trim() || !Number.isFinite(targetValue)) {
      setError("Objective name and target value are required.");
      return;
    }
    if (
      objectiveForm.metricKey === "custom" &&
      !objectiveForm.customMetricLabel.trim()
    ) {
      setError("Custom metric label is required.");
      return;
    }

    setBusy(true);
    setError(null);

    const body = {
      name: objectiveForm.name.trim(),
      metricKey: objectiveForm.metricKey,
      customMetricLabel: objectiveForm.customMetricLabel.trim() || null,
      targetValue,
      targetOperator: objectiveForm.targetOperator,
      targetUnit: objectiveForm.targetUnit.trim() || null,
      isPrimary: objectiveForm.isPrimary,
      notes: objectiveForm.notes.trim() || null,
    };

    const isEdit = Boolean(editingObjectiveId);
    const response = await fetch(
      isEdit
        ? `/api/budgets/${selected.id}/objectives/${editingObjectiveId}`
        : `/api/budgets/${selected.id}/objectives`,
      {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
    );

    setBusy(false);

    if (!response.ok) {
      const payload = (await response.json()) as { error?: string };
      setError(payload.error ?? "Failed to save objective");
      return;
    }

    setAddingObjective(false);
    setEditingObjectiveId(null);
    setObjectiveForm(emptyObjectiveForm());
    await loadPeriods(selected.id);
  };

  const deleteObjective = async (objective: BudgetObjective) => {
    if (!selected) return;
    if (!window.confirm(`Delete objective “${objective.name}”?`)) return;
    setBusy(true);
    const response = await fetch(
      `/api/budgets/${selected.id}/objectives/${objective.id}`,
      { method: "DELETE" },
    );
    setBusy(false);
    if (!response.ok) {
      const payload = (await response.json()) as { error?: string };
      setError(payload.error ?? "Failed to delete objective");
      return;
    }
    await loadPeriods(selected.id);
  };

  const activatePeriod = async (period: BudgetPeriod) => {
    setBusy(true);
    setError(null);
    const response = await fetch(`/api/budgets/${period.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "active" }),
    });
    setBusy(false);
    if (!response.ok) {
      const payload = (await response.json()) as { error?: string };
      setError(payload.error ?? "Failed to activate period");
      return;
    }
    await loadPeriods(period.id);
  };

  const showPeriodForm = creatingPeriod || editingPeriod;

  return (
    <main className="min-h-full w-full bg-kenoo-white px-6 py-8 md:px-10 md:py-12">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-neutral-500">
              Workspace
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
              Budgets
            </h1>
            <p className="mt-2 max-w-xl text-sm font-light leading-6 text-neutral-500">
              Plan organization media budgets and period objectives — quarters,
              fiscal years, or ongoing targets that stay in effect until you
              archive them.
            </p>
          </div>
          {!showPeriodForm ? (
            <Button
              type="button"
              onClick={startCreatePeriod}
              className={cn(primaryButtonClass, "shrink-0")}
            >
              <Plus className="mr-2 h-4 w-4" />
              New period
            </Button>
          ) : null}
        </header>

        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {error}
          </div>
        ) : null}

        {showPeriodForm ? (
          <PeriodEditor
            title={creatingPeriod ? "New planning period" : "Edit period"}
            form={periodForm}
            setForm={setPeriodForm}
            busy={busy}
            onCancel={cancelPeriodForm}
            onSave={() => void savePeriod()}
          />
        ) : null}

        {loading ? (
          <div
            className={cn(
              "flex items-center justify-center gap-2 rounded-[28px] py-16 text-sm font-light text-neutral-500",
              panelGlassClass,
            )}
          >
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading budget periods…
          </div>
        ) : periods.length === 0 && !showPeriodForm ? (
          <EmptyState onCreate={startCreatePeriod} />
        ) : (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)]">
            <aside className="space-y-2">
              <SectionLabel
                title="Periods"
                description="Active windows surface first."
              />
              {periods.map((period) => {
                const isActive = selectedId === period.id;
                return (
                  <button
                    key={period.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(period.id);
                      setAddingAllocation(false);
                      setAddingObjective(false);
                      setEditingAllocationId(null);
                      setEditingObjectiveId(null);
                    }}
                    className={cn(
                      glassToggleCardBaseClass,
                      "w-full",
                      isActive
                        ? glassToggleCardActiveClass
                        : glassToggleCardInactiveClass,
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={cn(
                          "truncate text-sm",
                          isActive
                            ? "font-semibold text-foreground"
                            : "font-medium text-foreground",
                        )}
                      >
                        {period.name}
                      </p>
                      <span
                        className={cn(
                          "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ring-1 ring-inset",
                          statusBadgeClass(
                            period.status,
                            period.isCurrentlyEffective,
                          ),
                        )}
                      >
                        {statusLabel(period)}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs font-light text-neutral-500">
                      {formatPeriodRange(period.startDate, period.endDate)}
                    </p>
                    <p className="mt-2 text-sm font-medium tabular-nums text-foreground">
                      {formatBudgetCurrency(
                        period.totalBudgetMicros,
                        period.currency,
                        { compact: true },
                      )}
                    </p>
                  </button>
                );
              })}
            </aside>

            <div className="min-w-0">
              {selected ? (
                <PeriodDetail
                  period={selected}
                  busy={busy}
                  onEdit={() => startEditPeriod(selected)}
                  onDelete={() => void deletePeriod(selected)}
                  onActivate={() => void activatePeriod(selected)}
                  addingAllocation={addingAllocation}
                  setAddingAllocation={setAddingAllocation}
                  allocationForm={allocationForm}
                  setAllocationForm={setAllocationForm}
                  editingAllocationId={editingAllocationId}
                  setEditingAllocationId={setEditingAllocationId}
                  onSaveAllocation={() => void saveAllocation()}
                  onDeleteAllocation={(a) => void deleteAllocation(a)}
                  onStartEditAllocation={(allocation) => {
                    setEditingAllocationId(allocation.id);
                    setAddingAllocation(true);
                    setAllocationForm({
                      name: allocation.name,
                      category: allocation.category,
                      channel: allocation.channel ?? "",
                      amountDollars: String(
                        microsToDollars(allocation.amountMicros),
                      ),
                      notes: allocation.notes ?? "",
                    });
                  }}
                  addingObjective={addingObjective}
                  setAddingObjective={setAddingObjective}
                  objectiveForm={objectiveForm}
                  setObjectiveForm={setObjectiveForm}
                  editingObjectiveId={editingObjectiveId}
                  setEditingObjectiveId={setEditingObjectiveId}
                  onSaveObjective={() => void saveObjective()}
                  onDeleteObjective={(o) => void deleteObjective(o)}
                  onStartEditObjective={(objective) => {
                    setEditingObjectiveId(objective.id);
                    setAddingObjective(true);
                    setObjectiveForm({
                      name: objective.name,
                      metricKey: objective.metricKey,
                      customMetricLabel: objective.customMetricLabel ?? "",
                      targetValue: String(objective.targetValue),
                      targetOperator: objective.targetOperator,
                      targetUnit: objective.targetUnit ?? "",
                      isPrimary: objective.isPrimary,
                      notes: objective.notes ?? "",
                    });
                  }}
                />
              ) : (
                <div
                  className={cn(
                    "rounded-[28px] px-6 py-16 text-center text-sm font-light text-neutral-500",
                    panelGlassClass,
                  )}
                >
                  Select a period to manage budgets and objectives.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-4 rounded-[28px] px-6 py-16 text-center",
        panelGlassClass,
      )}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
        <Landmark className="h-5 w-5" />
      </span>
      <div>
        <p className="text-base font-medium text-foreground">
          No budget periods yet
        </p>
        <p className="mt-1.5 max-w-sm text-sm font-light text-neutral-500">
          Create a quarter or ongoing period, allocate spend (e.g. $100K ad
          budget), and set primary objectives like ROAS or brand recognition.
        </p>
      </div>
      <Button type="button" onClick={onCreate} className={primaryButtonClass}>
        <Plus className="mr-2 h-4 w-4" />
        Create first period
      </Button>
    </div>
  );
}

function PeriodEditor({
  title,
  form,
  setForm,
  busy,
  onCancel,
  onSave,
}: {
  title: string;
  form: PeriodFormState;
  setForm: React.Dispatch<React.SetStateAction<PeriodFormState>>;
  busy: boolean;
  onCancel: () => void;
  onSave: () => void;
}) {
  return (
    <section className={cn("rounded-[28px] px-5 py-6 md:px-7 md:py-7", panelGlassClass)}>
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-neutral-500">
            Planning period
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground">
            {title}
          </h2>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full p-2 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-600"
          aria-label="Cancel"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FloatingLabelInput
          label="Period name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
        <SelectField
          label="Type"
          value={form.periodType}
          options={PERIOD_TYPE_OPTIONS.map((o) => ({
            value: o.value,
            label: o.label,
          }))}
          onChange={(periodType) =>
            setForm((f) => ({
              ...f,
              periodType,
              endDate: periodType === "ongoing" ? null : f.endDate,
            }))
          }
        />
        <FloatingLabelDatePicker
          label="Start date"
          value={form.startDate}
          onChange={(startDate) => setForm((f) => ({ ...f, startDate }))}
        />
        {form.periodType !== "ongoing" ? (
          <FloatingLabelDatePicker
            label="End date"
            value={form.endDate}
            onChange={(endDate) => setForm((f) => ({ ...f, endDate }))}
          />
        ) : (
          <div className="flex items-end">
            <p className="rounded-2xl border border-dashed border-neutral-200 px-4 py-3 text-sm font-light text-neutral-500">
              Ongoing — remains in effect until archived
            </p>
          </div>
        )}
        <SelectField
          label="Status"
          value={form.status}
          options={PERIOD_STATUS_OPTIONS}
          onChange={(status) => setForm((f) => ({ ...f, status }))}
        />
        <div className="grid grid-cols-2 gap-3">
          <FloatingLabelInput
            label="Fiscal year"
            inputMode="numeric"
            value={form.fiscalYear}
            onChange={(e) =>
              setForm((f) => ({ ...f, fiscalYear: e.target.value }))
            }
          />
          <FloatingLabelInput
            label="Fiscal Q"
            inputMode="numeric"
            value={form.fiscalQuarter}
            onChange={(e) =>
              setForm((f) => ({ ...f, fiscalQuarter: e.target.value }))
            }
          />
        </div>
      </div>

      <div className="mt-4">
        <FloatingLabelInput
          label="Primary focus (optional)"
          value={form.primaryFocus}
          onChange={(e) =>
            setForm((f) => ({ ...f, primaryFocus: e.target.value }))
          }
        />
        <p className="mt-1.5 px-1 text-xs font-light text-neutral-400">
          Stakeholder headline — e.g. “Profitable Meta prospecting at ≥3× ROAS”
        </p>
      </div>

      <div className="mt-4">
        <Textarea
          value={form.description}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
          placeholder="Notes for this planning period…"
          className="min-h-[88px] rounded-2xl border-neutral-200 bg-kenoo-white font-light"
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button
          type="button"
          disabled={busy}
          onClick={onSave}
          className={primaryButtonClass}
        >
          {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Save period
        </Button>
        <Button
          type="button"
          disabled={busy}
          onClick={onCancel}
          className={secondaryButtonClass}
        >
          Cancel
        </Button>
      </div>
    </section>
  );
}

function PeriodDetail({
  period,
  busy,
  onEdit,
  onDelete,
  onActivate,
  addingAllocation,
  setAddingAllocation,
  allocationForm,
  setAllocationForm,
  editingAllocationId,
  setEditingAllocationId,
  onSaveAllocation,
  onDeleteAllocation,
  onStartEditAllocation,
  addingObjective,
  setAddingObjective,
  objectiveForm,
  setObjectiveForm,
  editingObjectiveId,
  setEditingObjectiveId,
  onSaveObjective,
  onDeleteObjective,
  onStartEditObjective,
}: {
  period: BudgetPeriod;
  busy: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onActivate: () => void;
  addingAllocation: boolean;
  setAddingAllocation: (v: boolean) => void;
  allocationForm: AllocationFormState;
  setAllocationForm: React.Dispatch<React.SetStateAction<AllocationFormState>>;
  editingAllocationId: string | null;
  setEditingAllocationId: (id: string | null) => void;
  onSaveAllocation: () => void;
  onDeleteAllocation: (a: BudgetAllocation) => void;
  onStartEditAllocation: (a: BudgetAllocation) => void;
  addingObjective: boolean;
  setAddingObjective: (v: boolean) => void;
  objectiveForm: ObjectiveFormState;
  setObjectiveForm: React.Dispatch<React.SetStateAction<ObjectiveFormState>>;
  editingObjectiveId: string | null;
  setEditingObjectiveId: (id: string | null) => void;
  onSaveObjective: () => void;
  onDeleteObjective: (o: BudgetObjective) => void;
  onStartEditObjective: (o: BudgetObjective) => void;
}) {
  const primaryObjective = period.objectives.find((o) => o.isPrimary);

  return (
    <div className="space-y-8">
      <section className={cn("rounded-[28px] px-5 py-6 md:px-7 md:py-7", panelGlassClass)}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                {period.name}
              </h2>
              <span
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ring-1 ring-inset",
                  statusBadgeClass(period.status, period.isCurrentlyEffective),
                )}
              >
                {statusLabel(period)}
              </span>
            </div>
            <p className="mt-1.5 text-sm font-light text-neutral-500">
              {formatPeriodRange(period.startDate, period.endDate)}
              {" · "}
              {PERIOD_TYPE_OPTIONS.find((t) => t.value === period.periodType)
                ?.label ?? period.periodType}
              {period.fiscalYear
                ? ` · FY${period.fiscalYear}${
                    period.fiscalQuarter ? ` Q${period.fiscalQuarter}` : ""
                  }`
                : ""}
            </p>
            {period.primaryFocus ? (
              <p className="mt-3 text-sm font-medium leading-6 text-foreground">
                {period.primaryFocus}
              </p>
            ) : null}
            {period.description ? (
              <p className="mt-2 text-sm font-light leading-6 text-neutral-500">
                {period.description}
              </p>
            ) : null}
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            {period.status !== "active" ? (
              <Button
                type="button"
                disabled={busy}
                onClick={onActivate}
                className={primaryButtonClass}
              >
                <Check className="mr-2 h-4 w-4" />
                Mark active
              </Button>
            ) : null}
            <Button
              type="button"
              disabled={busy}
              onClick={onEdit}
              className={secondaryButtonClass}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button
              type="button"
              disabled={busy}
              onClick={onDelete}
              className={dangerButtonClass}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <SummaryStat
            icon={Wallet}
            label="Total budget"
            value={formatBudgetCurrency(
              period.totalBudgetMicros,
              period.currency,
            )}
          />
          <SummaryStat
            icon={Landmark}
            label="Allocations"
            value={String(period.allocations.length)}
          />
          <SummaryStat
            icon={Target}
            label="Primary objective"
            value={
              primaryObjective
                ? `${metricLabel(
                    primaryObjective.metricKey,
                    primaryObjective.customMetricLabel,
                  )} ${formatObjectiveTarget(primaryObjective)}`
                : "Not set"
            }
          />
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <SectionLabel
            title="Budget allocations"
            description="Line items for this period — media spend, creative, fees, contingency."
          />
          {!addingAllocation ? (
            <Button
              type="button"
              onClick={() => {
                setEditingAllocationId(null);
                setAllocationForm(emptyAllocationForm());
                setAddingAllocation(true);
              }}
              className={cn(secondaryButtonClass, "shrink-0")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add
            </Button>
          ) : null}
        </div>

        {addingAllocation ? (
          <div
            className={cn(
              "mb-4 rounded-[24px] px-4 py-5 md:px-5",
              panelGlassClass,
            )}
          >
            <p className="mb-3 text-sm font-medium text-foreground">
              {editingAllocationId ? "Edit allocation" : "New allocation"}
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <FloatingLabelInput
                label="Name"
                value={allocationForm.name}
                onChange={(e) =>
                  setAllocationForm((f) => ({ ...f, name: e.target.value }))
                }
              />
              <FloatingLabelInput
                label="Amount (USD)"
                inputMode="decimal"
                value={allocationForm.amountDollars}
                onChange={(e) =>
                  setAllocationForm((f) => ({
                    ...f,
                    amountDollars: e.target.value,
                  }))
                }
              />
              <SelectField
                label="Category"
                value={allocationForm.category}
                options={ALLOCATION_CATEGORY_OPTIONS}
                onChange={(category) =>
                  setAllocationForm((f) => ({ ...f, category }))
                }
              />
              <SelectField
                label="Channel"
                value={(allocationForm.channel || "all") as BudgetChannel}
                options={CHANNEL_OPTIONS}
                onChange={(channel) =>
                  setAllocationForm((f) => ({ ...f, channel }))
                }
              />
            </div>
            <div className="mt-3">
              <Textarea
                value={allocationForm.notes}
                onChange={(e) =>
                  setAllocationForm((f) => ({ ...f, notes: e.target.value }))
                }
                placeholder="Notes…"
                className="min-h-[72px] rounded-2xl border-neutral-200 bg-kenoo-white font-light"
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                type="button"
                disabled={busy}
                onClick={onSaveAllocation}
                className={primaryButtonClass}
              >
                {busy ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Save allocation
              </Button>
              <Button
                type="button"
                disabled={busy}
                onClick={() => {
                  setAddingAllocation(false);
                  setEditingAllocationId(null);
                }}
                className={secondaryButtonClass}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : null}

        {period.allocations.length === 0 && !addingAllocation ? (
          <div
            className={cn(
              "rounded-[24px] px-5 py-10 text-center text-sm font-light text-neutral-500",
              panelGlassClass,
            )}
          >
            No allocations yet. Add something like a $100K ad spend line.
          </div>
        ) : (
          <ul className="space-y-2">
            {period.allocations.map((allocation) => (
              <li
                key={allocation.id}
                className={cn(
                  "flex items-start justify-between gap-3 rounded-[22px] px-4 py-4 md:px-5",
                  panelGlassClass,
                )}
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {allocation.name}
                  </p>
                  <p className="mt-1 text-xs font-light text-neutral-500">
                    {ALLOCATION_CATEGORY_OPTIONS.find(
                      (c) => c.value === allocation.category,
                    )?.label ?? allocation.category}
                    {allocation.channel
                      ? ` · ${
                          CHANNEL_OPTIONS.find(
                            (c) => c.value === allocation.channel,
                          )?.label ?? allocation.channel
                        }`
                      : ""}
                  </p>
                  {allocation.notes ? (
                    <p className="mt-1.5 text-xs font-light text-neutral-400">
                      {allocation.notes}
                    </p>
                  ) : null}
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <p className="mr-2 text-sm font-semibold tabular-nums text-foreground">
                    {formatBudgetCurrency(
                      allocation.amountMicros,
                      allocation.currency,
                    )}
                  </p>
                  <IconButton
                    label="Edit allocation"
                    onClick={() => onStartEditAllocation(allocation)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </IconButton>
                  <IconButton
                    label="Delete allocation"
                    onClick={() => onDeleteAllocation(allocation)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </IconButton>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <SectionLabel
            title="Objectives"
            description="Primary and supporting KPIs for this period — ROAS, CTR, recognition, and more."
          />
          {!addingObjective ? (
            <Button
              type="button"
              onClick={() => {
                setEditingObjectiveId(null);
                setObjectiveForm({
                  ...emptyObjectiveForm(),
                  isPrimary: period.objectives.length === 0,
                });
                setAddingObjective(true);
              }}
              className={cn(secondaryButtonClass, "shrink-0")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add
            </Button>
          ) : null}
        </div>

        {addingObjective ? (
          <div
            className={cn(
              "mb-4 rounded-[24px] px-4 py-5 md:px-5",
              panelGlassClass,
            )}
          >
            <p className="mb-3 text-sm font-medium text-foreground">
              {editingObjectiveId ? "Edit objective" : "New objective"}
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <FloatingLabelInput
                label="Name"
                value={objectiveForm.name}
                onChange={(e) =>
                  setObjectiveForm((f) => ({ ...f, name: e.target.value }))
                }
              />
              <SelectField
                label="Metric"
                value={objectiveForm.metricKey}
                options={OBJECTIVE_METRIC_OPTIONS.map((m) => ({
                  value: m.value,
                  label: m.label,
                }))}
                onChange={(metricKey) => {
                  const defaults = OBJECTIVE_METRIC_OPTIONS.find(
                    (m) => m.value === metricKey,
                  );
                  setObjectiveForm((f) => ({
                    ...f,
                    metricKey,
                    targetOperator:
                      defaults?.defaultOperator ?? f.targetOperator,
                    targetUnit: defaults?.defaultUnit ?? "",
                    name:
                      f.name === emptyObjectiveForm().name ||
                      OBJECTIVE_METRIC_OPTIONS.some(
                        (m) => m.label === f.name || `Primary ${m.label}` === f.name,
                      )
                        ? metricKey === "custom"
                          ? "Custom objective"
                          : `Primary ${defaults?.label ?? metricKey}`
                        : f.name,
                  }));
                }}
              />
              {objectiveForm.metricKey === "custom" ? (
                <FloatingLabelInput
                  label="Custom metric label"
                  value={objectiveForm.customMetricLabel}
                  onChange={(e) =>
                    setObjectiveForm((f) => ({
                      ...f,
                      customMetricLabel: e.target.value,
                    }))
                  }
                />
              ) : null}
              <SelectField
                label="Operator"
                value={objectiveForm.targetOperator}
                options={TARGET_OPERATOR_OPTIONS.map((o) => ({
                  value: o.value,
                  label: `${o.symbol} ${o.label}`,
                }))}
                onChange={(targetOperator) =>
                  setObjectiveForm((f) => ({ ...f, targetOperator }))
                }
              />
              <FloatingLabelInput
                label="Target value"
                inputMode="decimal"
                value={objectiveForm.targetValue}
                onChange={(e) =>
                  setObjectiveForm((f) => ({
                    ...f,
                    targetValue: e.target.value,
                  }))
                }
              />
              <FloatingLabelInput
                label="Unit (x, %, $…)"
                value={objectiveForm.targetUnit}
                onChange={(e) =>
                  setObjectiveForm((f) => ({
                    ...f,
                    targetUnit: e.target.value,
                  }))
                }
              />
            </div>

            <label className="mt-4 flex cursor-pointer items-center gap-2.5 px-1">
              <input
                type="checkbox"
                checked={objectiveForm.isPrimary}
                onChange={(e) =>
                  setObjectiveForm((f) => ({
                    ...f,
                    isPrimary: e.target.checked,
                  }))
                }
                className="h-4 w-4 rounded border-neutral-300"
              />
              <span className="text-sm font-light text-neutral-600">
                Primary objective for this period
              </span>
            </label>

            <div className="mt-3">
              <Textarea
                value={objectiveForm.notes}
                onChange={(e) =>
                  setObjectiveForm((f) => ({ ...f, notes: e.target.value }))
                }
                placeholder="Notes…"
                className="min-h-[72px] rounded-2xl border-neutral-200 bg-kenoo-white font-light"
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                type="button"
                disabled={busy}
                onClick={onSaveObjective}
                className={primaryButtonClass}
              >
                {busy ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Save objective
              </Button>
              <Button
                type="button"
                disabled={busy}
                onClick={() => {
                  setAddingObjective(false);
                  setEditingObjectiveId(null);
                }}
                className={secondaryButtonClass}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : null}

        {period.objectives.length === 0 && !addingObjective ? (
          <div
            className={cn(
              "rounded-[24px] px-5 py-10 text-center text-sm font-light text-neutral-500",
              panelGlassClass,
            )}
          >
            No objectives yet. Set a primary ROAS, CTR, or recognition target.
          </div>
        ) : (
          <ul className="space-y-2">
            {period.objectives.map((objective) => (
              <li
                key={objective.id}
                className={cn(
                  "flex items-start justify-between gap-3 rounded-[22px] px-4 py-4 md:px-5",
                  panelGlassClass,
                )}
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-medium text-foreground">
                      {objective.name}
                    </p>
                    {objective.isPrimary ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-amber-800 ring-1 ring-inset ring-amber-200/80">
                        <Star className="h-3 w-3" />
                        Primary
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-xs font-light text-neutral-500">
                    {metricLabel(
                      objective.metricKey,
                      objective.customMetricLabel,
                    )}{" "}
                    · {formatObjectiveTarget(objective)}
                  </p>
                  {objective.notes ? (
                    <p className="mt-1.5 text-xs font-light text-neutral-400">
                      {objective.notes}
                    </p>
                  ) : null}
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <IconButton
                    label="Edit objective"
                    onClick={() => onStartEditObjective(objective)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </IconButton>
                  <IconButton
                    label="Delete objective"
                    onClick={() => onDeleteObjective(objective)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </IconButton>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function SummaryStat({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-black/[0.04] bg-neutral-50/70 px-4 py-3.5">
      <div className="flex items-center gap-2 text-neutral-400">
        <Icon className="h-3.5 w-3.5" />
        <p className="text-[10px] font-medium uppercase tracking-wider">
          {label}
        </p>
      </div>
      <p className="mt-1.5 truncate text-sm font-semibold text-foreground">
        {value}
      </p>
    </div>
  );
}

function IconButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className="rounded-full p-2 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
    >
      {children}
    </button>
  );
}
