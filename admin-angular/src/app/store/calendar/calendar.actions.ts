import { createAction, props } from "@ngrx/store";

export const setDaysInTheMonth = createAction(
  "[Calendar] set ordering category",
  props<{ days: Date[] }>(),
);

