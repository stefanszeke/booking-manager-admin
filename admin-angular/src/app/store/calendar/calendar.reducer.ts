import { createReducer, on } from "@ngrx/store";

import * as CalendarActions from "./calendar.actions";

export interface CalendarState {
  daysInTheMonth: Date[];

}

export const initialState: CalendarState = {
  daysInTheMonth: [],
};

export const calendarReducer = createReducer(
  initialState,
  on(CalendarActions.setDaysInTheMonth, (state, { days }) => ({
    ...state,
    daysInTheMonth: days,
  })),
);