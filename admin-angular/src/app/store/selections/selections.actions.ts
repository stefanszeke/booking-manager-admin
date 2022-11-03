import { createAction, props } from "@ngrx/store";

export const setSelectedFromCalender = createAction(
  "[Selections] set selected From Calender",
  props<{ dates: string[] }>(),
);

export const setSelectedFromTable = createAction(
  "[Selections] set selected From Table",
  props<{ dates: string[] }>(),
);

export const setSelectedId = createAction(
  "[Selections] set selected From Id ",
  props<{ id: number }>(),
);

export const clearSelectedFromCalender = createAction(
  "[Selections] clear selected From Calender",
);

export const clearSelectedFromTable = createAction(
  "[Selections] clear selected From Table",
);

export const clearSelectedId = createAction(
  "[Selections] clear selected ID",
);

export const setId = createAction(
  "[Selections] set id",
  props<{ id: number }>(),
);

export const setSelectedMonth = createAction(
  "[Selections] set selected Month",
  props<{ month: Date }>(),
);