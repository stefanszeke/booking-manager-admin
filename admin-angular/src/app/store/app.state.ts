import { RequestsState } from "./requests/requests.reducers";
import { ReservedState } from "./reserved/reserved.reducers";


export interface AppState {
  reserved: ReservedState;
  requests: RequestsState
}