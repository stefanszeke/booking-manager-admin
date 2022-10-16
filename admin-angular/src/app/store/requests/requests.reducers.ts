import { createReducer, on } from "@ngrx/store";
import { BookingRequest } from "src/app/models/bookingRequest";
import * as RequestsActions from "./requests.actions";

export interface RequestsState {
  isLoadingRequests: boolean;
  requests: BookingRequest[];
  requestError: string | null;

  isMakingStatusChange: boolean;
  statusChangeMessage: string | null;
  statusChangeError: string | null;
}

export const initialState: RequestsState = {
  isLoadingRequests: false,
  requests:[],
  requestError: null,

  isMakingStatusChange: false,
  statusChangeMessage: null,
  statusChangeError: null,
};

export const requestsReducer = createReducer(
  initialState,
  on(RequestsActions.requestRequests, (state) => ({
    ...state,
    isLoadingRequests: true,
  })),
  on(RequestsActions.requestRequestsSuccess, (state, { payload }) => ({
    ...state,
    isLoadingRequests: false,
    requests: payload,
  })),
  on(RequestsActions.requestRequestsFailure, (state, { requestError }) => ({
    ...state,
    isLoadingRequests: false,
    requestError: requestError,
  })),
  on(RequestsActions.clearRequests, (state) => ({
    ...state,
    requests: [],
  })),

  on(RequestsActions.requestStatusChange, (state) => ({
    ...state,
    isMakingStatusChange: true,
  })),
  on(RequestsActions.requestStatusChangeSuccess, (state, { payload }) => ({
    ...state,
    isMakingStatusChange: false,
    statusChangeMessage: payload.message,
  })),
  on(RequestsActions.requestStatusChangeFailure, (state, { statusChangeError }) => ({
    ...state,
    isMakingStatusChange: false,
    statusChangeError: statusChangeError,
  })),
  on(RequestsActions.resetStatusMessage, (state) => ({
    ...state,
    statusChangeMessage: null,
  })),
);