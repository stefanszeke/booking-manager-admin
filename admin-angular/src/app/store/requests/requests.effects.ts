import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from "@ngrx/store";
import { catchError, delay, map, mergeMap, Observable, of, switchMap, withLatestFrom } from 'rxjs';
import { ReservedQuery } from "src/app/models/reservedQuery";


import { ApiService } from "src/app/services/api.service";
import { AppState } from "../app.state";

import * as RequestsActions from "./requests.actions";


@Injectable()
export class RequestsEffects {

  category$: Observable<ReservedQuery> = this.store.select(state => state.ordering.category)
  order$: Observable<string> = this.store.select(state => state.ordering.order)
  orderBy$: Observable<string> = this.store.select(state => state.ordering.orderBy)

  constructor(
    private store: Store<AppState>,
    private actions$: Actions,
    private apiService: ApiService
  ) {}

  // getRequests$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(RequestsActions.requestRequests), // action1
  //     // delay(500),  // for testing

  //     mergeMap(
  //       (action) =>

  //         this.apiService
  //           .getRequests(action.status, action.orders)
  //           .pipe(map((payload) => RequestsActions.requestRequestsSuccess( {payload} ))) // action2
  //     ),

  //     catchError(
  //       (err) => of(RequestsActions.requestRequestsFailure({ requestError: 'something wrong' })) // action3
  //     )
  //   )
  // );

  getRequests$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RequestsActions.requestRequests), // action1
      withLatestFrom(this.store),
      // delay(500),  // for testing

      mergeMap(
        ([actions,store]) =>

          this.apiService
            .getRequests(store.ordering.category, {order: store.ordering.order,orderBy: store.ordering.orderBy})
            .pipe(map((payload) => RequestsActions.requestRequestsSuccess( {payload} ))) // action2
      ),

      catchError(
        (err) => of(RequestsActions.requestRequestsFailure({ requestError: 'something wrong' })) // action3
      )
    )
  );

  changeStatus$ = createEffect(() =>
  this.actions$.pipe(
    ofType(RequestsActions.requestStatusChange), // action1
    // delay(500),  // for testing

    mergeMap(
      (action) =>

        this.apiService
          .setStatus(action.id, action.status)
          .pipe(map((payload) => RequestsActions.requestStatusChangeSuccess( {payload} ))) // action2
    ),

    catchError(
      (err) => of(RequestsActions.requestStatusChangeFailure({ statusChangeError: 'something wrong' })) // action3
    )
  )
);

  
}

