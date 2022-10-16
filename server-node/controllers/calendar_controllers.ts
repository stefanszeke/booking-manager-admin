import { Request, Response } from "express"
import { Database } from "../database/database"
import AppServices from "../services/appServices"
import { BookingRequest } from "../models/bookingRequest"

export const bookingRequest = async (req: Request, res: Response) => {
  try {

    const bookingRequest: BookingRequest = req.body;

    const validation: boolean = await AppServices.bookingValidation(res, bookingRequest);
    if(!validation) return;

    let insertQuery = `INSERT INTO bookings (checkIn, checkOut, adults, children, email, phone, status) VALUES (?, ?, ?, ?, ?, ?, ?)`
    let insertOptions = [bookingRequest.dates.checkIn, bookingRequest.dates.checkOut, bookingRequest.people.adults, bookingRequest.people.children, bookingRequest.client.email, bookingRequest.client.phone, "pending"]
  
    await Database.useMySql(insertQuery, insertOptions)
  
    res.json({message: "Booking request sent"})

  } catch (err) { console.log(err) }

}

export const getReserved = async (req: Request, res: Response) => {
  try {
    let query = `SELECT * FROM bookings WHERE status = 'reserved'`

    let result: any = await Database.useMySql(query)
    let reservedDates: any[] = []

    result.sort((a: any, b: any) => new Date(a.checkin).getTime() - new Date(b.checkin).getTime())
    
    result.forEach((item: any, index: number) => {
      let datesToPush: string|string[] = AppServices.getIndexedDatesBetween(item.checkin, item.checkout, index)
      reservedDates.push(datesToPush)
    })

    res.json(reservedDates.join(","))

  } catch (err) { console.log(err) }
}

export const getAllRequests = async (req: Request, res: Response) => {

  try {

    let orderBy = req.query.orderBy as string
    const order = req.query.order as string
    let groupBy = ""

    if(!['ASC', 'DESC'].includes(order)) {
      res.status(400).json({message: "Invalid order"})
      return;
    }

    if(!['id','dates','people','status'].includes(orderBy)) {
      res.status(400).json({message: "Invalid order"})
      return;
    }

    if(orderBy === 'people') orderBy = 'sum(adults + children)'
    if(orderBy === 'dates') orderBy = 'checkin'

    let query = ``

    if(req.query.status === 'pendingReserved') {
      query = `SELECT * FROM bookings WHERE status = 'pending' OR status = 'reserved' GROUP BY id ORDER BY ${orderBy} ${order}`
    }
    if(req.query.status === 'archivedRejected') {
      query = `SELECT * FROM bookings WHERE status = 'archived' OR status = 'rejected' GROUP BY id  ORDER BY ${orderBy} ${order}`
    }

    
    let result: any = await Database.useMySql(query, [orderBy, order])
    result.forEach((item: any) => {
      item.dates = AppServices.getDatesBetween(item.checkin, item.checkout);
      item.checkin = new Date(+item.checkin).toLocaleDateString();
      item.checkout = new Date(+item.checkout).toLocaleDateString();
    })

    res.json(result)

  } catch (err) { console.log(err) }

}

export const setStatus = async (req: Request, res: Response) => {
  
    try {
      let queryReserved = `SELECT * FROM bookings WHERE status = 'reserved'`
      let result: any = await Database.useMySql(queryReserved)

      if(req.body.status === 'reserved') {
        let reservedDates: any[] = []

        result.sort((a: any, b: any) => new Date(a.checkin).getTime() - new Date(b.checkin).getTime())
        
        result.forEach((item: any, index: number) => {
          let datesToPush: string|string[] = AppServices.getDatesBetween(item.checkin, item.checkout)
          reservedDates.push(datesToPush)
        })
        
        reservedDates = reservedDates.flat()

        let queryDates = `SELECT * FROM bookings WHERE id = ?`
        let resultDates: any = await Database.useMySql(queryDates, [req.params.id])

        if(reservedDates.includes(resultDates[0].checkin) || reservedDates.includes(resultDates[0].checkout)) {
          res.json({message: "This date is already reserved"})
          return
        }
      }


      let query = `UPDATE bookings SET status = ? WHERE id = ?`
      let options = [req.body.status, req.params.id]
  
      await Database.useMySql(query, options)
  
      res.json({message: "Status updated"})
  
    } catch (err) { console.log(err) }
  
  }
