import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, delay, map, mergeMap, of, switchMap, withLatestFrom } from 'rxjs';


import { ApiService } from "src/app/services/api.service";

import * as RequestsActions from "./requests.actions";


@Injectable()
export class RequestsEffects {

  constructor(
    private actions$: Actions,
    private apiService: ApiService
  ) {}

  getRequests$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RequestsActions.requestRequests), // action1
      delay(1000),  // for testing

      mergeMap(
        (action) =>

          this.apiService
            .getRequests(action.status, action.orders)
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
    delay(1000),  // for testing

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

