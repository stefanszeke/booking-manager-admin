import mysql from "mysql2";
import dotenv from "dotenv";
import { Response, Request } from "express";
import { BookingRequest } from "../models/bookingRequest";
dotenv.config();

export default class AppServices {

  private static dockerConnection: mysql.ConnectionOptions = {
    host: 'localhost',
    database: 'post_app',
    user: 'admin',
    password: 'admin',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    port: 3398
  }

  private static mysqlConnection: mysql.ConnectionOptions = {
    host: process.env.HOST,
    database: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  }

  public static async bookingValidation(res: Response, bookingRequest: BookingRequest): Promise<boolean> {
    // const { name, email, phoneNumber, date, time } = data;
    // const emailRegex = new RegExp("^[\\w._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$");
    // const phoneNumberRegex = new RegExp("[^0-9\\s+]", "g");
    // const matchNumbersRegex = new RegExp("[0-9]", "g");
    // const checkEmail = emailRegex.test(email);
    // const checkPhoneNumber = !phoneNumberRegex.test(phoneNumber);
    // const checkPhoneNumberLength = phoneNumber.match(matchNumbersRegex)!.length > 7;

    const {adults, children,} = bookingRequest.people;
    const {checkIn, checkOut} = bookingRequest.dates;
    const {email, phone} = bookingRequest.client;

    if(!checkIn || !checkOut || !adults || !email || !phone) { res.status(401).json({message: "Not all fields are filled"}); return false; }

    if(![1,2,3,4].includes(adults) || ![0,1,2,3].includes(children)) { res.status(401).json({message: "Wrong number of people"}); return false; }
    return true
  }

  public static getIndexedDatesBetween(startDate: string, endDate: string, id: number, index: number ): (string | string[]) {
    startDate = new Date(startDate).toLocaleDateString();
    endDate = new Date(endDate).toLocaleDateString();

    index = index % 2 === 0 ? 0 : 1;

    let datesWithIndex: string[] = [`id${id}-i${index}-d${startDate}`];

    let nextDay = new Date(startDate);

    let isEndDate: boolean = nextDay.toLocaleDateString() === new Date(endDate).toLocaleDateString();

    while(!isEndDate) {
      nextDay.setDate(nextDay.getDate() + 1);
      datesWithIndex.push(`id${id}-i${index}-d${nextDay.toLocaleDateString()}`);
      isEndDate = nextDay.toLocaleDateString() === new Date(endDate).toLocaleDateString();
    }
    
    return datesWithIndex.join(",");
  }

  public static getDatesBetween(startDate: string, endDate: string, index?: number ): string[] {
    startDate = new Date(startDate).toLocaleDateString();
    endDate = new Date(endDate).toLocaleDateString();

    let dates: string[] = [startDate];

    let nextDay = new Date(startDate);

    let isEndDate: boolean = nextDay.toLocaleDateString() === new Date(endDate).toLocaleDateString();

    while(!isEndDate) {
      nextDay.setDate(nextDay.getDate() + 1);
      dates.push(nextDay.toLocaleDateString());
      isEndDate = nextDay.toLocaleDateString() === new Date(endDate).toLocaleDateString();
    }
    
    return dates;
  }

  public static getRequestsQuery(req: Request, res: Response): string {
    
    let orderBy = req.query.orderBy as string
    const order = req.query.order as string
    let status = req.query.status as string

    if(!['ASC', 'DESC'].includes(order)) {
      res.status(400).json({message: "Invalid order"})
      return "Invalid order";
    } 

    if(!['archivedRejected','pendingReserved','pending','reserved','archived','rejected'].includes(status)) {
      res.status(400).json({message: "Invalid order"})
      return "Invalid order";
    }

    if(!['id','dates','people','status'].includes(orderBy)) {
      res.status(400).json({message: "Invalid order"})
      return "Invalid order";
    }

    if(orderBy === 'people') orderBy = 'sum(adults + children)'
    if(orderBy === 'dates') orderBy = 'checkin'

    let category = `'${req.query.status}'`

    if(req.query.status === 'pendingReserved') {
      category = `'pending' OR status = 'reserved'`
    }
    if(req.query.status === 'archivedRejected') {
      category = `'archived' OR status = 'rejected'`
    }

    let query = `SELECT * FROM bookings WHERE status = ${category} GROUP BY id ORDER BY ${orderBy} ${order}`

    return query
  }

  public static async isAlreadyReserved(checkin: string, checkout: string, reservedDates: string[]): Promise<boolean> {
    let isReserved: boolean = false;

    let datesToCheck: string[] = AppServices.getDatesBetween(checkin, checkout);

    for(let item of datesToCheck) {
      if(reservedDates.join(",").match(item)) { isReserved = true; break }
    }

    return isReserved
  }

  public static getConnection(): mysql.ConnectionOptions | undefined {
    if(process.env.NODE_ENV === 'development') return AppServices.dockerConnection;
    if(process.env.NODE_ENV === 'production') return AppServices.mysqlConnection;
  }
}