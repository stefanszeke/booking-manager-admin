import { createAction, props } from "@ngrx/store";
import { ReservedQuery } from "src/app/models/reservedQuery";

export const setCategory = createAction(
  "[Ordering] set ordering category",
  props<{ payload: ReservedQuery }>(),
);

export const setOrder = createAction(
  "[Ordering] set ordering order",
  props<{ payload: string }>(),
);

export const setOrderBy = createAction(
  "[Ordering] set ordering order by",
  props<{ payload: string }>(),
);