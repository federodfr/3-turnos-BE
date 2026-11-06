import crypto from "crypto";
import {promises as fs} from "fs";

class BookingManager {

    constructor(path, serviceManager) {
        this.path = path;
        this.serviceManager = serviceManager;
    }

    async readBookings() {
        try {
            const data = await fs.readFile(this.path, "utf-8");
            return JSON.parse(data);
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async writeBookings(bookings) {
        try {
            await fs.writeFile(this.path, JSON.stringify(bookings, null, 2));
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getBookingByID(id) {
        try {
            const bookings = await this.readBookings();
            const booking =  bookings?.find(booking => booking.id === id);

            if(!booking) {
                throw new Error("Reserva no encontrada");
            }

            return booking;
        } catch(error) {
            console.log(error)
            return null
        }
        
    }

    async createBooking(clientName, clientEmail, date, time, status, services) {
        try {
            if(!clientName || !clientEmail || !date || !time || !status || !services) {
                throw new Error("Todos los campos son requeridos");
            }

            const bookings = await this.readBookings();

            const newBooking = {
                id: crypto.randomUUID(),
                clientName,
                clientEmail,
                date,
                time,
                status,
                services
            };

            bookings.push(newBooking);
            await this.writeBookings(bookings);
            return newBooking;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async updateServiceForBooking(bid, sid) {
        try {

            const bookings = await this.readBookings();
            const bookingIdx = bookings.findIndex((booking) => booking.id === bid);

            if(bookingIdx === -1) {
                throw new Error("Reserva no encontrada")
            }
            console.log(sid)
            const service = await this.serviceManager.getServicesById(sid);

            if (!service) { 
                throw new Error("Servicio no encontrado");
            }

            const booking = bookings[bookingIdx]
            if (!Array.isArray(booking.services)) {
                booking.services = [];
              }

            const bookingService = booking.services.find((s) => 
                s.service === sid);

            if(bookingService) {
                bookingService.quantity += 1;
            } else {
                booking.services.push({service: sid, quantity: 1})
            }


            await this.writeBookings(bookings);
            return booking
        } catch (error) {
            console.error(error);
            return null;
        }

    }

}

export default BookingManager;