import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

import { CalendarComponent } from './components/calendar/calendar.component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { reservedReducer } from "./store/reserved/reserved.reducers";
import { ReservedEffects } from "./store/reserved/reserved.effects";
import { RequestsEffects } from "./store/requests/requests.effects";
import { requestsReducer } from "./store/requests/requests.reducers";

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    EffectsModule.forRoot([ ReservedEffects, RequestsEffects]),
    StoreModule.forRoot({reserved: reservedReducer, requests: requestsReducer}, {})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
