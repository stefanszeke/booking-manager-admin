export interface BookingRequest {
    email: string;
    phone: string;
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
    dates: string[]
}