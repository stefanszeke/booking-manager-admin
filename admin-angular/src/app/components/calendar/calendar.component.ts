import { Component, OnInit } from '@angular/core';
import { Store } from "@ngrx/store";
import { AppState } from "src/app/store/app.state";
import { Observable } from "rxjs";


import * as ReservedActions from "../../store/reserved/reserved.actions";
import * as RequestsActions from "../../store/requests/requests.actions";
import * as OrderingActions from "../../store/ordering/ordering.actions";
import * as SelectionsActions from "../../store/selections/selections.actions";
import * as CalendarActions from "../../store/calendar/calendar.actions";

import { FormBuilder, FormGroup } from "@angular/forms";
import { ReservedQuery } from "src/app/models/reservedQuery";
import { CalendarService } from "src/app/services/calendar.service";


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})

export class CalendarComponent implements OnInit {


  currentMonth$: Observable<Date> = this.store.select(state => state.selections.selectedMonth)
  daysInTheMonth:Date[] = []
  daysInTheMonth$: Observable<Date[]> = this.store.select(state => state.calendar.daysInTheMonth)

  isLoadingReserved$: Observable<boolean> = this.store.select(state => state.reserved.isLoadingReserved)
  reservedDates$: Observable<string> = this.store.select(state => state.reserved.reserved)
  reservedError$: Observable<string | null> = this.store.select(state => state.reserved.error)

  statusForm: FormGroup

  selectedDatesFromCalendar$: Observable<string[]> = this.store.select(state => state.selections.selectedDatesFromCalendar)
  selectedDatesFromTable$: Observable<string[]> = this.store.select(state => state.selections.selectedDatesFromTable)
  selectedId$: Observable<number | null> = this.store.select(state => state.selections.selectedId)

  category$: Observable<ReservedQuery> = this.store.select(state => state.ordering.category)

  orderBy: string = 'id'
  order:string = 'DESC'

  constructor(private store: Store<AppState>, private formBuilder: FormBuilder, private calenderService: CalendarService) { 
    this.statusForm = this.formBuilder.group({
      status: [null]
    })
  }

  ngOnInit(): void {
    this.store.dispatch(ReservedActions.requestReserved())
    this.getRequests()

    this.setDaysInTheMonth();
    
  }

  selectFromCalendar(date:Date) {
    let dateRegex = new RegExp(`id\\d+-i\\d-d(${date.toLocaleDateString()})`, 'g')
    this.store.dispatch(SelectionsActions.clearSelectedFromTable())

    this.reservedDates$.subscribe(reservedDates => {
      let check = reservedDates.match(dateRegex) || null

      if(check !== null) {
        let id = reservedDates.match(dateRegex)![0].match('id(?<id>\\d+)')?.groups?.['id'] || null
        if(id != null) { this.store.dispatch(SelectionsActions.setSelectedId({id: +id})) }
        let idMatch = new RegExp(`id${id}-i\\d-d(\\d+\/\\d+\/\\d+)`, 'g')
        let match = reservedDates.match(idMatch)
  
        let selectedDatesFromCalendar = match?.map(m => m.split('-d')[1]) || []
        this.store.dispatch(SelectionsActions.setSelectedFromCalender({dates: selectedDatesFromCalendar}))

        this.category$.subscribe(category => {
        if(category !== 'reserved') {
          this.store.dispatch(OrderingActions.setCategory({payload: 'reserved'}))
          this.getRequests()
        }}).unsubscribe()

      } else { this.store.dispatch(SelectionsActions.clearSelectedFromCalender()); this.store.dispatch(SelectionsActions.clearSelectedId()) }
    }).unsubscribe()
  }

  isSelectedFromTable(date:string): boolean {
    let isSelected = false
    this.selectedDatesFromTable$.subscribe(selectedDatesFromTable => {
      isSelected = selectedDatesFromTable.includes(date)
    }).unsubscribe()
    return isSelected
  }

  isSelectedFromCalendar(date:Date): boolean {
    let isSelected = false
    this.selectedDatesFromCalendar$.subscribe(selectedDatesFromCalendar => {
    isSelected = selectedDatesFromCalendar.includes(date.toLocaleDateString())
    }).unsubscribe()
    return isSelected
  }

  getRequests() {
    this.store.dispatch(RequestsActions.requestRequests())
  }

  // calendar //////////////

  // buttons
  nextMonth() {
    let currentMonth = new Date(this.getCurrentMonth().getFullYear(), this.getCurrentMonth().getMonth()+1, 1);
    this.store.dispatch(SelectionsActions.setSelectedMonth({month: currentMonth}))
    this.setDaysInTheMonth()
  }
  prevMonth() {
    let currentMonth = new Date(this.getCurrentMonth().getFullYear(), this.getCurrentMonth().getMonth()-1, 1);
    this.store.dispatch(SelectionsActions.setSelectedMonth({month: currentMonth}))
    this.setDaysInTheMonth()
  }

  resetDate(){
    let currentMonth = new Date()
    this.store.dispatch(SelectionsActions.setSelectedMonth({month: currentMonth}))
    this.setDaysInTheMonth()
  }

  
  setDaysInTheMonth() {
    this.calenderService.setDaysInTheMonth()
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


  getCurrentMonth() {
    let currentMonth: Date = new Date()
    this.currentMonth$.subscribe(month => {
      currentMonth = month
    }).unsubscribe()
    return currentMonth
  }
} 

