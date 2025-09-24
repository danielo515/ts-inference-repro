export interface FilterTag {
  readonly field: string;
  readonly value: string;
  readonly label?: string;
}

export interface ChatFilterHandlers {
  readonly onApplyFilters?: (filters: ReadonlyArray<FilterTag>, replace: boolean) => void;
  readonly onClearFilters?: (filterFields?: ReadonlyArray<string>) => void;
  readonly onSetSearchContext?: (context: {
    readonly dateRange?: { readonly start: string; readonly end: string };
    readonly costCenters?: ReadonlyArray<string>;
    readonly areas?: ReadonlyArray<string>;
    readonly conceptNumbers?: ReadonlyArray<string>;
    readonly keywords?: ReadonlyArray<string>;
  }) => void;
  readonly onClearSearchContext?: () => void;
}
