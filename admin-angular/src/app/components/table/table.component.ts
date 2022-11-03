import { Component, OnInit } from '@angular/core';
import { Store } from "@ngrx/store";
import { AppState } from "src/app/store/app.state";
import { Observable } from "rxjs";
import { ViewportScroller } from "@angular/common";

import * as ReservedActions from "../../store/reserved/reserved.actions";
import * as RequestsActions from "../../store/requests/requests.actions";
import * as OrderingActions from "../../store/ordering/ordering.actions";
import * as SelectionsActions from "../../store/selections/selections.actions";

import { FormBuilder, FormGroup } from "@angular/forms";
import { faArrowDownWideShort, faArrowUpWideShort } from "@fortawesome/free-solid-svg-icons";
import { ReservedQuery } from "src/app/models/reservedQuery";
import { OrderingState } from "src/app/store/ordering/ordering.reducers";
import { CalendarService } from "src/app/services/calendar.service";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  currentMonth$: Observable<Date> = this.store.select(state => state.selections.selectedMonth)
  daysInTheMonth:Date[] = []

  statusForm: FormGroup

  selectedDatesFromCalendar$: Observable<string[]> = this.store.select(state => state.selections.selectedDatesFromCalendar)
  selectedDatesFromTable$: Observable<string[]> = this.store.select(state => state.selections.selectedDatesFromTable)

  selectedId$: Observable<number | null> = this.store.select(state => state.selections.selectedId)

  isLoadingRequests$: Observable<boolean> = this.store.select((state) => state.requests.isLoadingRequests);
  requests$: Observable<any> = this.store.select((state) => state.requests.requests);
  requestError$: Observable<string | null> = this.store.select((state) => state.requests.requestError);

  isMakingStatusChange$: Observable<boolean> = this.store.select(state => state.requests.isMakingStatusChange)
  statusChangeMessage$: Observable<string | null> = this.store.select(state => state.requests.statusChangeMessage)
  statusChangeError$: Observable<string | null> = this.store.select(state => state.requests.statusChangeError)
  statusChangeId = ''

  category: ReservedQuery = "pendingReserved"

  ordering$: Observable<OrderingState> = this.store.select(state => state.ordering)

  faArrowDownWideShort = faArrowDownWideShort; faArrowUpWideShort = faArrowUpWideShort;

  constructor(private store: Store<AppState>, private formBuilder: FormBuilder,  private calenderService: CalendarService) { 
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
    if(category === 'main') { this.store.dispatch(OrderingActions.setCategory({payload: "pendingReserved"})), this.store.dispatch(RequestsActions.clearRequests()), this.getRequests() }
    else if(category === 'rest') { this.store.dispatch(OrderingActions.setCategory({payload: "archivedRejected"})), this.store.dispatch(RequestsActions.clearRequests()), this.getRequests() }
    else { this.store.dispatch(OrderingActions.setCategory({payload: category as ReservedQuery})), this.store.dispatch(RequestsActions.clearRequests()), this.getRequests() }
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

  isSelectedFromCalender(id:string) {
    let isSelected = false
    this.selectedId$.subscribe(selectedId => {
    isSelected = +id === selectedId
    }).unsubscribe()
    return isSelected
  }

  selectFromTable(dates:string[], id:string) {
    this.selectedDatesFromTable$.subscribe(d => {
    let selectedMonth = new Date(dates[0])
    this.store.dispatch(SelectionsActions.setSelectedMonth({month: selectedMonth}))

    this.store.dispatch(SelectionsActions.setSelectedFromTable({dates}))
    this.store.dispatch(SelectionsActions.setSelectedId({id: +id}))
    this.store.dispatch(SelectionsActions.clearSelectedFromCalender())
    this.setDaysInTheMonth()
    
  }).unsubscribe()
  }

  isSelectedFromTable(date:string): boolean {
    let isSelected = false
    this.selectedDatesFromTable$.subscribe(selectedDatesFromTable => {
      isSelected = selectedDatesFromTable.includes(date)
    }).unsubscribe()
    return isSelected
  }

  getCurrentMonth() {
    let currentMonth: Date = new Date()
    this.currentMonth$.subscribe(month => {
      currentMonth = month
    }).unsubscribe()
    return currentMonth
  }


  changeOrder(orderByInput:string) {
    let order = ""
    let orderBy = ""
    this.ordering$.subscribe(ordering => {
      order = ordering.order === 'ASC' ? 'DESC' : 'ASC';
      orderBy = ordering.orderBy 
    }).unsubscribe()

    if(orderBy === orderByInput) {
      this.store.dispatch(OrderingActions.setOrder({payload: order}));
    } else {
      this.store.dispatch(OrderingActions.setOrderBy({payload: orderByInput}));
      this.store.dispatch(OrderingActions.setOrder({payload: 'DESC'}));
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
    this.store.dispatch(RequestsActions.requestRequests())
  }

  setDaysInTheMonth() {
    this.calenderService.setDaysInTheMonth()
  }
  

  // isSameDate(date1:Date, date2:Date) {
  //   return date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear()
  // }

  // isBeforeToday(day:Date) {
  //   return day < new Date()
  // }

  formatDate(date:string) {
    return new Date(date).toLocaleDateString("en-GB", {year: 'numeric', month: 'long', day: 'numeric'})
  }

}
