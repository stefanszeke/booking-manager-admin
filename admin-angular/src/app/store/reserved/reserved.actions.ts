import { createAction, props } from "@ngrx/store";
import { ReservedDate } from "src/app/models/reservedDate";

export const requestReserved = createAction(
  "[Reserved] Request Reserved",
);

export const requestReservedSuccess = createAction(
  "[Reserved] Request Reserved Success",
  props<{ payload: string }>(),
);

export const requestReservedFailure = createAction(
  "[Reserved] Request Reserved Failure",
  props<{ error: string }>(),
);