import { Tool } from "ai";
import { z } from "zod";

export type ToolResult<T> = {
  success: boolean;
  data?: T;
  message?: string;
};

export type FilterTag = {
  readonly field: string;
  readonly value: string;
  readonly label?: string;
};

export type ChatFilterHandlers = {
  readonly onApplyFilters?: (
    filters: ReadonlyArray<FilterTag>,
    replace: boolean
  ) => void;
  readonly onClearFilters?: (filterFields?: ReadonlyArray<string>) => void;
  readonly onSetSearchContext?: (context: {
    readonly dateRange?: { readonly start: string; readonly end: string };
    readonly costCenters?: ReadonlyArray<string>;
    readonly areas?: ReadonlyArray<string>;
    readonly conceptNumbers?: ReadonlyArray<string>;
    readonly keywords?: ReadonlyArray<string>;
  }) => void;
  readonly onClearSearchContext?: () => void;
};

export const ToolFilterTagSchema = z.object({
  field: z.string(),
  value: z.string(),
  label: z.string().optional(),
});

export type ToolFilterTag = z.infer<typeof ToolFilterTagSchema>;

export const ToolApplyViewFiltersParamsSchema = z.object({
  filters: z.array(ToolFilterTagSchema),
  replace: z.boolean().optional(),
});

export type ToolApplyViewFiltersParams = z.infer<
  typeof ToolApplyViewFiltersParamsSchema
>;

export const ToolClearViewFiltersParamsSchema = z.object({
  filterFields: z.array(z.string()).optional(),
});

export type ToolClearViewFiltersParams = z.infer<
  typeof ToolClearViewFiltersParamsSchema
>;

export const ToolSetSearchContextParamsSchema = z.object({
  context: z.object({
    dateRange: z
      .object({
        start: z.string(),
        end: z.string(),
      })
      .optional(),
    costCenters: z.array(z.string()).optional(),
    areas: z.array(z.string()).optional(),
    conceptNumbers: z.array(z.string()).optional(),
    keywords: z.array(z.string()).optional(),
  }),
});

export type ToolSetSearchContextParams = z.infer<
  typeof ToolSetSearchContextParamsSchema
>;

export const ToolClearSearchContextParamsSchema = z.object({});

export type ToolClearSearchContextParams = z.infer<
  typeof ToolClearSearchContextParamsSchema
>;

type StaticPlanningToolInvocation =
  | {
      readonly toolName: "applyViewFilters";
      readonly input: ToolApplyViewFiltersParams;
      readonly dynamic?: false;
    }
  | {
      readonly toolName: "clearViewFilters";
      readonly input: ToolClearViewFiltersParams;
      readonly dynamic?: false;
    }
  | {
      readonly toolName: "setSearchContext";
      readonly input: ToolSetSearchContextParams;
      readonly dynamic?: false;
    }
  | {
      readonly toolName: "clearSearchContext";
      readonly input: ToolClearSearchContextParams;
      readonly dynamic?: false;
    }
  | {
      readonly toolName: string;
      readonly input: unknown;
      readonly dynamic?: false;
    };

export type PlanningToolInvocation =
  | StaticPlanningToolInvocation
  | {
      readonly dynamic: true;
      readonly toolName: string;
      readonly input: unknown;
    };

export type ChatFilterCommand =
  | {
      readonly type: "applyViewFilters";
      readonly input: ToolApplyViewFiltersParams;
    }
  | {
      readonly type: "clearViewFilters";
      readonly input: ToolClearViewFiltersParams;
    }
  | {
      readonly type: "setSearchContext";
      readonly input: ToolSetSearchContextParams;
    }
  | {
      readonly type: "clearSearchContext";
      readonly input: ToolClearSearchContextParams;
    };

export const DataParts = {
  applyViewFilters: ToolApplyViewFiltersParamsSchema,
  clearViewFilters: ToolClearViewFiltersParamsSchema,
  setSearchContext: ToolSetSearchContextParamsSchema,
  clearSearchContext: ToolClearSearchContextParamsSchema,
} as const;

export type PlanningToolSet = {
  applyViewFilters: Tool<
    ToolApplyViewFiltersParams,
    ToolResult<{ applied: boolean }>
  >;
  clearViewFilters: Tool<
    ToolClearViewFiltersParams,
    ToolResult<{ cleared: boolean }>
  >;
  setSearchContext: Tool<
    ToolSetSearchContextParams,
    ToolResult<{ contextSet: boolean }>
  >;
  clearSearchContext: Tool<
    ToolClearSearchContextParams,
    ToolResult<{ contextCleared: boolean }>
  >;
};

export type PlanningToolNames = keyof PlanningToolSet;
