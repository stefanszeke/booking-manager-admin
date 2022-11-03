import { createReducer, on } from "@ngrx/store";
import { ReservedQuery } from "src/app/models/reservedQuery";

import * as OrderingActions from "./ordering.actions";

export interface OrderingState {
  category: ReservedQuery,
  order: string
  orderBy: string,
}

export const initialState: OrderingState = {
  category: "pendingReserved",
  order: "DESC",
  orderBy: "id"
};

export const orderingReducer = createReducer(
  initialState,
  on(OrderingActions.setCategory, (state, { payload }) => ({
    ...state,
    category: payload,
  })),
  on(OrderingActions.setOrder, (state, { payload }) => ({
    ...state,
    order: payload,
  })),
  on(OrderingActions.setOrderBy, (state, { payload }) => ({
    ...state,
    orderBy: payload,
  })),
);