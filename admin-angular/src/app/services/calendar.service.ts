import { Injectable } from '@angular/core';
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { AppState } from "../store/app.state";

import * as CalendarActions from "../store/calendar/calendar.actions";

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  currentMonth$: Observable<Date> = this.store.select(state => state.selections.selectedMonth)

  constructor(private store: Store<AppState>) { }

  setDaysInTheMonth() {
    let daysInTheMonth = [...this.getDaysFromMonday(),...this.getDaysInMonth(),...this.getDaysTillSunday()]
    this.store.dispatch(CalendarActions.setDaysInTheMonth({days: daysInTheMonth}))
  }
  getDaysFromMonday():Date[] {
    let days:Date[] = []
    let firstDay = this.getFirstDayOfMonth().getDay() == 0 ? 7 : this.getFirstDayOfMonth().getDay() 
    for(let i = 0; i > - firstDay+1; i--) {
      days.push( new Date(this.getCurrentMonth().getFullYear(), this.getCurrentMonth().getMonth(), i) )
    }
    return days.reverse();
  }
  getDaysTillSunday():Date[] {
    let days:Date[] = []
    let lastDay = this.getLastDayOfMonth().getDay() == 0 ? 7 : this.getLastDayOfMonth().getDay()
    for(let i = 1; i < 8-lastDay; i++) {
      days.push( new Date(this.getCurrentMonth().getFullYear(), this.getCurrentMonth().getMonth(), this.getLastDayOfMonth().getDate()+i) )
    }
    return days;
  }
  getDaysInMonth():Date[] {
    let days:Date[] = [];
    for (let i = 1; i <= this.getLastDayOfMonth().getDate(); i++) {
      days.push( new Date(this.getCurrentMonth().getFullYear(), this.getCurrentMonth().getMonth(), i) );
    }
    return days;
  }

  getCurrentMonth() {
    let currentMonth: Date = new Date()
    this.currentMonth$.subscribe(month => {
      currentMonth = month
    }).unsubscribe()
    return currentMonth
  }

  getFirstDayOfMonth() {
    return new Date(this.getCurrentMonth().getFullYear(), this.getCurrentMonth().getMonth(), 1)
  }
  getLastDayOfMonth() {

    return new Date(this.getCurrentMonth().getFullYear(), this.getCurrentMonth().getMonth() + 1, 0);
  }
  getFirstDayOfNextMonth() {
    return new Date(this.getCurrentMonth().getFullYear(), this.getCurrentMonth().getMonth()+1, 1);
  }
  getLastDayOfPrevMonth() {
    return new Date(this.getCurrentMonth().getFullYear(), this.getCurrentMonth().getMonth(), 0);
  }
}


