import mysql from "mysql2";
import dotenv from "dotenv";
import { Response } from "express";
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

  public static getIndexedDatesBetween(startDate: string, endDate: string, index?: number ): (string | string[]) {
    startDate = new Date(+startDate).toLocaleDateString();
    endDate = new Date(+endDate).toLocaleDateString();

    let datesWithIndex: string[] = [`i${index}/d${startDate}`];

    let nextDay = new Date(startDate);

    let isEndDate: boolean = nextDay.toLocaleDateString() === new Date(endDate).toLocaleDateString();

    while(!isEndDate) {
      nextDay.setDate(nextDay.getDate() + 1);
      datesWithIndex.push(`i${index}/d${nextDay.toLocaleDateString()}`);
      isEndDate = nextDay.toLocaleDateString() === new Date(endDate).toLocaleDateString();
    }
    
    return datesWithIndex.join(",");
  }

  public static getDatesBetween(startDate: string, endDate: string, index?: number ): (string | string[]) {
    startDate = new Date(+startDate).toLocaleDateString();
    endDate = new Date(+endDate).toLocaleDateString();

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

  public static getConnection(): mysql.ConnectionOptions | undefined {
    if(process.env.NODE_ENV === 'development') return AppServices.dockerConnection;
    if(process.env.NODE_ENV === 'production') return AppServices.mysqlConnection;
  }
}