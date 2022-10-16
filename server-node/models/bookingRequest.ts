export interface BookingRequest {
  client: {
    email: string;
    phone: string;
  },
  dates: {
    checkIn: string;
    checkOut: string;
  },
  people: {
    adults: number;
    children: number;
  },
  status: string;
}