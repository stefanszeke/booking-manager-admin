import { createReducer, on } from "@ngrx/store";
import { ReservedDate } from "src/app/models/reservedDate";
import * as ReservedActions from "./reserved.actions";

export interface ReservedState {
  isLoadingReserved: boolean;
  reserved: string;
  error: string | null;
}

export const initialState: ReservedState = {
  isLoadingReserved: false,
  reserved:"",
  error: null,
};

export const reservedReducer = createReducer(
  initialState,
  on(ReservedActions.requestReserved, (state) => ({
    ...state,
    isLoadingReserved: true,
  })),
  on(ReservedActions.requestReservedSuccess, (state, { payload }) => ({
    ...state,
    reserved: payload,
    isLoadingReserved: false,
  })),
  on(ReservedActions.requestReservedFailure, (state, { error }) => ({
    ...state,
    isLoadingReserved: false,
    error: error,
  }))
);