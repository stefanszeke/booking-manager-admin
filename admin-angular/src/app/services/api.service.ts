import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";
import { BookingRequest } from "../models/bookingRequest";
import { ReservedDate } from "../models/reservedDate";
import { Orders } from "../models/orders";
import { ReservedQuery } from "../models/reservedQuery";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  url = environment.apiUrl;

  options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  }

  constructor(private http: HttpClient) { }

  sendBookingRequest(data: BookingRequest): Observable<{message: string}> {
    return this.http.post<{message: string}>(`${this.url}/booking`, data, this.options);
  }
  getReservedDates(): Observable<string> {
    return this.http.get<string>(`${this.url}/booking/reserved`, this.options);
  }
  getRequests(status: ReservedQuery, orders: Orders): Observable<BookingRequest[]> {
    console.log(status, orders);
    return this.http.get<BookingRequest[]>(`${this.url}/booking?status=${status}&orderBy=${orders.orderBy}&order=${orders.order}`, this.options);
  }
  setStatus(id: number, status: string): Observable<{message: string}> {
    return this.http.patch<{message: string}>(`${this.url}/booking/${id}`, {status}, this.options);
  }
}
