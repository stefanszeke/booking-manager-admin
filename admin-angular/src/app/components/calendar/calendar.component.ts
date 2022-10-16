import { Component, OnInit } from '@angular/core';
import { Store } from "@ngrx/store";
import { AppState } from "src/app/store/app.state";
import { Observable } from "rxjs";
import { ViewportScroller } from "@angular/common";

import * as ReservedActions from "../../store/reserved/reserved.actions";
import * as RequestsActions from "../../store/requests/requests.actions";

import { FormBuilder, FormGroup } from "@angular/forms";


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})

export class CalendarComponent implements OnInit {

  currentMonth = new Date();
  daysInTheMonth:Date[] = []

  requests$: Observable<any> = this.store.select((state) => state.requests.requests);

  showMessageWindow: boolean = false;

  statusForm: FormGroup
  selectedDatesOnCalendar:string[] = []
  selectedDatesOnTable: string[] = []
  selectedOnTableId: string = ''

  isLoadingReserved$: Observable<boolean> = this.store.select(state => state.reserved.isLoadingReserved)
  reservedDates$: Observable<string> = this.store.select(state => state.reserved.reserved)
  reservedError$: Observable<string | null> = this.store.select(state => state.reserved.error)

  isMakingStatusChange$: Observable<boolean> = this.store.select(state => state.requests.isMakingStatusChange)
  statusChangeMessage$: Observable<string | null> = this.store.select(state => state.requests.statusChangeMessage)
  statusChangeError$: Observable<string | null> = this.store.select(state => state.requests.statusChangeError)


  orderBy: string = 'id'
  order:string = 'DESC'



  constructor(private store: Store<AppState>, private formBuilder: FormBuilder, private scroll: ViewportScroller) { 
    this.statusForm = this.formBuilder.group({
      status: [null]
    })
  }

  ngOnInit(): void {
    this.store.dispatch(ReservedActions.requestReserved())
    this.getRequests()
    this.setDaysInTheMonth();
  }


  setDaysInTheMonth() {
    this.daysInTheMonth = [...this.getDaysFromMonday(),...this.getDaysInMonth(),...this.getDaysTillSunday()]
  }


  getFirstDayOfMonth() {
    return new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
  }
  getLastDayOfMonth() {
    return new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0);
  }
  getFirstDayOfNextMonth() {
    return new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth()+1, 1);
  }
  getLastDayOfPrevMonth() {
    return new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 0);
  }

  isSameDate(date1:Date, date2:Date) {
    return date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear()
  }

  isReservedDate(date:Date): string {
    const dateRegex = new RegExp(`i(?<indx>\\d+)/d(${date.toLocaleDateString()})`, 'g')

    let reserved = 'not reserved'
    this.reservedDates$.subscribe(reservedDates => {
      const execRegex = dateRegex.exec(reservedDates)

      if (execRegex && execRegex.groups?.['indx']) {
        if(+execRegex.groups['indx'] % 2 === 0) {
          reserved = "even"
        } else {
          reserved = "odd"
        }
      }
    }).unsubscribe()
    return reserved
  }

  getDaysFromMonday():Date[] {
    let days:Date[] = []
    let firstDay = this.getFirstDayOfMonth().getDay() == 0 ? 7 : this.getFirstDayOfMonth().getDay() 
    for(let i = 0; i > - firstDay+1; i--) {
      days.push( new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), i) )
    }
    return days.reverse();
  }
  getDaysTillSunday():Date[] {
    let days:Date[] = []
    let lastDay = this.getLastDayOfMonth().getDay() == 0 ? 7 : this.getLastDayOfMonth().getDay()
    for(let i = 1; i < 8-lastDay; i++) {
      days.push( new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), this.getLastDayOfMonth().getDate()+i) )
    }
    return days;
  }
  getDaysInMonth():Date[] {
    let days:Date[] = [];
    for (let i = 1; i <= this.getLastDayOfMonth().getDate(); i++) {
      days.push( new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), i) );
    }
    return days;
  }

  isBeforeToday(day:Date) {
    return day < new Date()
  }

  formatDate(date:string) {
    return new Date(date).toLocaleDateString("en-GB", {year: 'numeric', month: 'long', day: 'numeric'})
  }


  // buttons
  nextMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth()+1, 1);
    this.setDaysInTheMonth()
  }
  prevMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth()-1, 1);
    this.setDaysInTheMonth()
  }

  resetDate(){
    this.currentMonth = new Date()
    this.setDaysInTheMonth()
  }

  getRequests() {
    this.store.dispatch(RequestsActions.requestRequests("pendingReserved", {orderBy: this.orderBy, order: this.order}))
  }
  getRequestsArchived() {
    this.store.dispatch(RequestsActions.requestRequests('archivedRejected', {orderBy: this.orderBy, order: this.order}))
  }

  makeStatusChange(id:string,) {
    if(this.statusForm.value.status) {
      this.store.dispatch(RequestsActions.requestStatusChange(+id, this.statusForm.value.status))
      this.isMakingStatusChange$.subscribe(isMakingStatusChange => {
        if(!isMakingStatusChange) {
          this.store.dispatch(ReservedActions.requestReserved())
          this.getRequests()
          this.setDaysInTheMonth()
        }
      })
    }
  }

  resetStatusMessage() {
    this.store.dispatch(RequestsActions.resetStatusMessage())
  }
  selectDate(date:Date) {
    let dateRegex = new RegExp(`i(?<indx>\\d+)/d(${date.toLocaleDateString()})`, 'g')
    this.selectedOnTableId = ''
    this.selectedDatesOnTable = []


    this.reservedDates$.subscribe(reservedDates => {
      let index = dateRegex.exec(reservedDates)?.groups?.['indx']
      console.log(index)
  
    let indexMatch = new RegExp(`i(?<indx>${index})\/d(\\d+\/\\d+\/\\d+)`, 'g')
  
    let match = reservedDates.match(indexMatch)
    return this.selectedDatesOnCalendar = match?.map(m => m.split('/d')[1]) || []
    }).unsubscribe()
  }

  selectDatesOnTable(dates:string[], id:string) {
    this.currentMonth = new Date(dates[0])
    this.selectedOnTableId = id
    this.selectedDatesOnTable = dates
    this.selectedDatesOnCalendar = []

    this.setDaysInTheMonth()
  }

  isSelectedOnTable(date:string) {
    return this.selectedDatesOnTable.includes(date)
  }

  isSelectDate(date:Date) {
    return this.selectedDatesOnCalendar.includes(date.toLocaleDateString())
  }

  isSelectedOnCalender(dates:string[]) {
    if(this.selectedDatesOnCalendar.length > 0) {
      return dates.every(date => this.selectedDatesOnCalendar.includes(date))
    } else {
      return false
    }
  }

  changeOrder(orderBy:string) {
    if(this.orderBy === orderBy) {
      this.order = this.order === 'ASC' ? 'DESC' : 'ASC'
    } else {
      this.orderBy = orderBy
      this.order = 'DESC'
    }
    this.getRequests()
  }

} 