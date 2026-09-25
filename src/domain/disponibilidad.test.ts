import { describe, expect, it } from "vitest";

import { isTimeSlotAvailable } from "./disponibilidad";
import type { Reservation } from "../types/reservation";

// Array de reservas mockeado utilizado en todos los tests
const mockReservations: Reservation[] = [
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
  {
    id: "reservation-3",
    customerName: "Carlos Rodríguez",
    customerEmail: "carlos.rodriguez@email.com",
    customerPhone: "+54 261 555-0103",
    service: "Seguimiento",
    date: "2026-09-24",
    startTime: "15:00",
    endTime: "16:00",
    status: "COMPLETED",
  },
];

describe("Disponibilidad al reagendar", () => {
  it("detecta mismo horario ocupado", () => {
    // Arrange
    // reservation-1 ocupa 09:00-10:00 el día 2026-09-23

    // Act
    const result = isTimeSlotAvailable(
      "2026-09-23",
      "09:00",
      "10:00",
      mockReservations,
    );

    // Assert
    expect(result).toBe(false);
  });

  it("detecta superposición parcial de horarios", () => {
    // Arrange
    // reservation-1 ocupa 09:00-10:00; el nuevo horario 09:30-10:30 se superpone

    // Act
    const result = isTimeSlotAvailable(
      "2026-09-23",
      "09:30",
      "10:30",
      mockReservations,
    );

    // Assert
    expect(result).toBe(false);
  });

  it("horarios consecutivos no generan conflicto", () => {
    // Arrange
    // reservation-1 termina a las 10:00; el nuevo horario empieza exactamente a las 10:00

    // Act
    const result = isTimeSlotAvailable(
      "2026-09-23",
      "10:00",
      "11:00",
      mockReservations,
    );

    // Assert
    expect(result).toBe(true);
  });

  it("el mismo horario en otro día no genera conflicto", () => {
    // Arrange
    // reservation-1 ocupa 09:00-10:00 el 2026-09-23, pero el 2026-09-25 no hay nada

    // Act
    const result = isTimeSlotAvailable(
      "2026-09-25",
      "09:00",
      "10:00",
      mockReservations,
    );

    // Assert
    expect(result).toBe(true);
  });

  it("puede excluir la reserva que se está reagendando para no chocar consigo misma", () => {
    // Arrange
    // Intentamos reagendar reservation-1 al mismo horario que ya ocupa (09:00-10:00).
    // Sin exclusión habría conflicto; al excluir su propio ID, debe estar disponible.

    // Act
    const result = isTimeSlotAvailable(
      "2026-09-23",
      "09:00",
      "10:00",
      mockReservations,
      "reservation-1", // excludeReservationId
    );

    // Assert
    expect(result).toBe(true);
  });
});
