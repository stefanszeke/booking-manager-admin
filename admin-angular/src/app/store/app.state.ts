import { CalendarState } from "./calendar/calendar.reducer";
import { OrderingState } from "./ordering/ordering.reducers";
import { RequestsState } from "./requests/requests.reducers";
import { ReservedState } from "./reserved/reserved.reducers";
import { SelectionsState } from "./selections/selections.reducers";

export interface AppState {
  reserved: ReservedState;
  requests: RequestsState;
  ordering: OrderingState;
  selections: SelectionsState;
  calendar: CalendarState;
}

