import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, delay, map, mergeMap, of, switchMap, withLatestFrom } from 'rxjs';


import { ApiService } from "src/app/services/api.service";

import * as ReservedActions from "./reserved.actions";


@Injectable()
export class ReservedEffects {

  constructor(
    private actions$: Actions,
    private apiService: ApiService
  ) {}

  loadAllPostsEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReservedActions.requestReserved), // action1
      // delay(500), // for testing

      mergeMap(
        () =>

          this.apiService
            .getReservedDates()
            .pipe(map((payload) => ReservedActions.requestReservedSuccess( {payload} ))) // action2
      ),

      catchError(
        (err) => of(ReservedActions.requestReservedFailure({ error: 'something wrong' })) // action3
      )
    )
  );

  
}

