export interface FilterState {
  selectedOption: string;
  startDate: string;
  endDate: string;
}

export interface FilterChangeEvent {
  selectedOption: string;
  startDate: string;
  endDate: string;
}

export type FilterOption = "activity" | "project";

export type PresetRange =
  | "today"
  | "yesterday"
  | "thisWeek"
  | "lastWeek"
  | "thisMonth"
  | "lastMonth";

export interface DateRange {
  start: string;
  end: string;
}

export interface FilterPreset {
  label: string;
  value: PresetRange;
  dateRange: DateRange;
}
