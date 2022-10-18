import { Component, OnInit } from '@angular/core';
import { Store } from "@ngrx/store";
import { AppState } from "src/app/store/app.state";
import { Observable } from "rxjs";
import { ViewportScroller } from "@angular/common";

import * as ReservedActions from "../../store/reserved/reserved.actions";
import * as RequestsActions from "../../store/requests/requests.actions";

import { FormBuilder, FormGroup } from "@angular/forms";
import { faArrowDownWideShort, faArrowUpWideShort } from "@fortawesome/free-solid-svg-icons";
import { ReservedQuery } from "src/app/models/reservedQuery";


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})

export class CalendarComponent implements OnInit {

  currentMonth = new Date();
  daysInTheMonth:Date[] = []

  statusForm: FormGroup

  selectedDatesFromCalendar:string[] = []
  selectedDatesFromTable: string[] = []

  selectedId: number | null = null

  isLoadingRequests$: Observable<boolean> = this.store.select((state) => state.requests.isLoadingRequests);
  requests$: Observable<any> = this.store.select((state) => state.requests.requests);
  requestError$: Observable<string | null> = this.store.select((state) => state.requests.requestError);

  isLoadingReserved$: Observable<boolean> = this.store.select(state => state.reserved.isLoadingReserved)
  reservedDates$: Observable<string> = this.store.select(state => state.reserved.reserved)
  reservedError$: Observable<string | null> = this.store.select(state => state.reserved.error)

  isMakingStatusChange$: Observable<boolean> = this.store.select(state => state.requests.isMakingStatusChange)
  statusChangeMessage$: Observable<string | null> = this.store.select(state => state.requests.statusChangeMessage)
  statusChangeError$: Observable<string | null> = this.store.select(state => state.requests.statusChangeError)
  statusChangeId = ''

  category: ReservedQuery = "pendingReserved"

  orderBy: string = 'id'
  order:string = 'DESC'

  faArrowDownWideShort = faArrowDownWideShort; faArrowUpWideShort = faArrowUpWideShort;

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

  changeCategory(category:string) {
    if(category === 'main') { this.category = 'pendingReserved' ,this.store.dispatch(RequestsActions.clearRequests()), this.getRequests() }
    else if(category === 'rest') { this.category = 'archivedRejected' ,this.store.dispatch(RequestsActions.clearRequests()), this.getRequests() }
    else { this.category = category as ReservedQuery, this.store.dispatch(RequestsActions.clearRequests()), this.getRequests() }
  }

  makeStatusChange(id:string,) {
    if(this.statusForm.value === null) return
    this.statusChangeId = id
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

  selectFromCalendar(date:Date) {
    let dateRegex = new RegExp(`id\\d+-i\\d-d(${date.toLocaleDateString()})`, 'g')
    this.selectedDatesFromTable = []

    this.reservedDates$.subscribe(reservedDates => {
      let check = reservedDates.match(dateRegex) || null

      if(check !== null) {
        let id = reservedDates.match(dateRegex)![0].match('id(?<id>\\d+)')?.groups?.['id'] || null
        if(id != null) { this.selectedId = +id }
        let idMatch = new RegExp(`id${id}-i\\d-d(\\d+\/\\d+\/\\d+)`, 'g')
        let match = reservedDates.match(idMatch)
  
        this.selectedDatesFromCalendar = match?.map(m => m.split('-d')[1]) || []

        if(this.category !== 'reserved') {
          this.changeCategory('reserved')
        }

      } else { this.selectedDatesFromCalendar = []; this.selectedId = null }
    }).unsubscribe()
  }
  isSelectedFromCalender(id:string) {
    return +id === this.selectedId
  }

  selectFromTable(dates:string[], id:string) {
    this.currentMonth = new Date(dates[0])
    this.selectedDatesFromTable = dates
    this.selectedId = +id
    this.selectedDatesFromCalendar = []

    this.setDaysInTheMonth()
  }

  isSelectedFromTable(date:string) {
    return this.selectedDatesFromTable.includes(date)
  }

  isSelectedDate(date:Date) {
    return this.selectedDatesFromCalendar.includes(date.toLocaleDateString())
  }


  changeOrder(orderBy:string) {
    this.statusChangeId = ''
    if(this.orderBy === orderBy) {
      this.order = this.order === 'ASC' ? 'DESC' : 'ASC'
    } else {
      this.orderBy = orderBy
      this.order = 'DESC'
    }
    this.getRequests()
  }

  isMakingStatusChangeThisRow(id:string) {
    id === this.statusChangeId ? true : false
  }

  resetStatusMessage() {
    this.store.dispatch(RequestsActions.resetStatusMessage())
  }

  getRequests() {
    this.store.dispatch(RequestsActions.requestRequests(this.category, {orderBy: this.orderBy, order: this.order}))
  }

  // calendar //////////////

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
    const dateRegex = new RegExp(`id\\d+-i\\d-d(${date.toLocaleDateString()})`, 'g')

    let reserved = 'not reserved'
    this.reservedDates$.subscribe(reservedDates => {

      const match = reservedDates.match(dateRegex)

      if(match) {
        let id = match[0].match('id(?<id>\\d+)')?.groups?.['id']
        let index = match[0].match('-i(?<index>\\d+)')?.groups?.['index']
        if(index === "0") reserved = 'even'
        else if(index === "1") reserved = 'odd'
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

} 

