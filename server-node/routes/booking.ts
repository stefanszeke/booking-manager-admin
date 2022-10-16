import router from 'express'
import * as CalendarControllers from '../controllers/calendar_controllers'

export const calendarRouter = router();

calendarRouter.post('/', CalendarControllers.bookingRequest);

calendarRouter.get('/reserved', CalendarControllers.getReserved);

calendarRouter.get('/', CalendarControllers.getAllRequests);

calendarRouter.patch('/:id', CalendarControllers.setStatus);