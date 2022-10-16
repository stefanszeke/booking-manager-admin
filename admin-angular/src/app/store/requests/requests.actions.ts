import { createAction, props } from "@ngrx/store";
import { BookingRequest } from "src/app/models/bookingRequest";
import { Orders } from "src/app/models/orders";
import { ReservedQuery } from "src/app/models/reservedQuery";

// request
export const requestRequests = createAction(
  "[Requests] Request Requests",
  (status: ReservedQuery, orders: Orders) => ({ status, orders }),
);

export const requestRequestsSuccess = createAction(
  "[Requests] Request Requests Success",
  props<{ payload: BookingRequest[] }>(),
);

export const requestRequestsFailure = createAction(
  "[Requests] Request Requests Failure",
  props<{ requestError: string }>(),
);
export const clearRequests = createAction(
  "[Requests] Clear Requests"
);

// status change
export const requestStatusChange = createAction(
  "[Requests] Request Status Change",
  (id: number, status: string) => ({ id, status }),
);

export const requestStatusChangeSuccess = createAction(
  "[Requests] Request Status Change Success",
  props<{ payload: { message: string } }>(),
)

export const requestStatusChangeFailure = createAction(
  "[Requests] Request Status Change Failure",
  props<{ statusChangeError: string }>(),
);

export const resetStatusMessage = createAction(
  "[Requests] Reset Status Message",
);