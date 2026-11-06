import { Router } from "express";
import BookingManager from "../managers/BookingManager.js"
import ServiceManager from "../managers/ServiceManager.js";


const REQUIRED_FIELDS = ['clientName', 'clientEmail', 'date', 'time', 'status', 'services']

const router = Router();
const serviceManagerObject = new ServiceManager("./src/data/services.json");
const bookingManagerObject = new BookingManager("./src/data/bookings.json", serviceManagerObject);

router.get("/:bid", async(req, res) => {
  const booking = await bookingManagerObject.getBookingByID(req.params.bid);

  if (!booking) {
    return res.status(404).json({ error: "Reserva no encontrada" });
  }

  return res.status(200).json(booking);
});

router.post("/", async(req, res) => {
  const body = req.body;

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return res.status(400).json({ error: "El body debe ser un objeto JSON" });
  }

  const missingFields = REQUIRED_FIELDS.filter((field) => {
    const value = body[field];
    return value === undefined || value === null || value === "";
  });

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: `Body inválido. Faltan campos requeridos: ${missingFields.join(", ")}`,
    });
  }

  const created = await bookingManagerObject.createBooking(
    body.clientName,
    body.clientEmail,
    body.date,
    body.time,
    body.status,
    body.services
  );

  if (!created) {
    return res.status(400).json({
      error: "No se pudo crear la reserva. Todos los campos son requeridos.",
    });
  }

  return res.status(201).json(created);
});

router.post("/:bid/services/:sid", async(req, res) => {
  const { bid, sid } = req.params;

  const updated = bookingManagerObject.updateServiceForBooking(bid, sid);

  if (!updated) {
    return res.status(404).json({ error: "Reserva no encontrada" });
  }

  return res.status(200).json(updated);
});


export default router;
