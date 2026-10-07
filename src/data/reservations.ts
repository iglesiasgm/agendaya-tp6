import type { Reservation } from "../types/reservation";

/*
 * El array se declara deliberadamente desordenado para que los tests de
 * ordenamiento temporal tengan sentido: si las reservas ya vinieran en orden
 * cronológico, una prueba de ordenamiento pasaría aunque la aplicación no
 * ordenara nada. El ordenamiento real ocurre en src/domain/ordenamiento-temporal.ts
 * y se aplica en App.tsx antes de renderizar la lista.
 */
export const initialReservations: Reservation[] = [
  {
    id: "reservation-3",
    customerName: "Carlos Rodríguez",
    customerEmail: "carlos.rodriguez@email.com",
    customerPhone: "+54 261 555-0103",
    service: "Seguimiento",
    date: "2026-09-23",
    startTime: "15:00",
    endTime: "16:00",
    status: "COMPLETED",
  },
  {
    id: "reservation-1",
    customerName: "Juan Pérez",
    customerEmail: "juan.perez@email.com",
    customerPhone: "+54 261 555-0101",
    service: "Consulta inicial",
    date: "2026-09-23",
    startTime: "09:00",
    endTime: "10:00",
    status: "CONFIRMED",
    notes: "Primera consulta del cliente.",
  },
  {
    id: "reservation-4",
    customerName: "María López",
    customerEmail: "maria.lopez@email.com",
    customerPhone: "+54 261 555-0104",
    service: "Consulta inicial",
    date: "2026-09-24",
    startTime: "10:00",
    endTime: "11:00",
    status: "CONFIRMED",
  },
  {
    id: "reservation-2",
    customerName: "Ana García",
    customerEmail: "ana.garcia@email.com",
    customerPhone: "+54 261 555-0102",
    service: "Demostración",
    date: "2026-09-23",
    startTime: "11:00",
    endTime: "11:30",
    status: "PENDING",
  },
];
