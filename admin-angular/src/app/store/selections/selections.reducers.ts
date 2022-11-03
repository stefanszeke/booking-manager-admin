import { createReducer, on } from "@ngrx/store";

import * as SelectionsActions from "./selections.actions";

export interface SelectionsState {
  selectedDatesFromCalendar:string[];
  selectedDatesFromTable: string[];
  selectedId: number | null;
  selectedMonth: Date;
}

export const initialState: SelectionsState = {
  selectedDatesFromCalendar: ['test'],
  selectedDatesFromTable: ['test'],
  selectedId: null,
  selectedMonth: new Date()
};

export const selectionsReducer = createReducer(
  initialState,
  on(SelectionsActions.setSelectedFromCalender, (state, { dates }) => ({
    ...state,
    selectedDatesFromCalendar: dates,
  })),
  on(SelectionsActions.setSelectedFromTable, (state, { dates }) => ({
    ...state,
    selectedDatesFromTable: dates,
  })),
  on(SelectionsActions.setSelectedId, (state, { id }) => ({
    ...state,
    selectedId: id,
  })),
  on(SelectionsActions.clearSelectedFromCalender, (state) => ({
    ...state,
    selectedDatesFromCalendar: [],
  })),
  on(SelectionsActions.clearSelectedFromTable, (state) => ({
    ...state,
    selectedDatesFromTable: [],
  })),
  on(SelectionsActions.clearSelectedId, (state) => ({
    ...state,
    selectedId: null,
  })),
  on(SelectionsActions.setId, (state, { id }) => ({
    ...state,
    selectedId: id,
  })),
  on(SelectionsActions.setSelectedMonth, (state, { month }) => ({
    ...state,
    selectedMonth: month,
  })),
);