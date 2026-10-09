import { describe, expect, it } from "vitest";

import {
  countReservationsByStatus,
  filterReservationsByStatus,
} from "./reservationStatus";

import type { Reservation } from "../types/reservation";

const createReservation = (
  overrides: Partial<Reservation> = {},
): Reservation => ({
  id: "reservation-1",
  customerName: "Juan Pérez",
  customerEmail: "juan@email.com",
  customerPhone: "+54 261 555-0101",
  service: "Consulta",
  date: "2026-09-23",
  startTime: "09:00",
  endTime: "10:00",
  status: "CONFIRMED",
  ...overrides,
});

const reservations = [
  createReservation({ id: "reservation-1", status: "PENDING" }),
  createReservation({ id: "reservation-2", status: "CONFIRMED" }),
  createReservation({ id: "reservation-3", status: "PENDING" }),
  createReservation({ id: "reservation-4", status: "COMPLETED" }),
];

describe("filterReservationsByStatus", () => {
  it("devuelve solamente las reservas en estado PENDING", () => {
    // Arrange
    // Se utiliza la lista `reservations` definida arriba.

    // Act
    const result = filterReservationsByStatus(reservations, "PENDING");

    // Assert
    expect(result).toHaveLength(2);
    expect(result.map((reservation) => reservation.id)).toEqual([
      "reservation-1",
      "reservation-3",
    ]);
  });

  it("devuelve solamente las reservas en estado CONFIRMED", () => {
    // Arrange
    // Se utiliza la lista `reservations` definida arriba.

    // Act
    const result = filterReservationsByStatus(reservations, "CONFIRMED");

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("reservation-2");
    expect(result[0].status).toBe("CONFIRMED");
  });

  it("devuelve un array vacío cuando ninguna reserva tiene el estado indicado", () => {
    // Arrange
    // Ninguna reserva de la lista está en estado CANCELLED.

    // Act
    const result = filterReservationsByStatus(reservations, "CANCELLED");

    // Assert
    expect(result).toEqual([]);
  });
});

describe("countReservationsByStatus", () => {
  it("cuenta correctamente las reservas de un estado", () => {
    // Arrange
    // La lista contiene dos reservas PENDING.

    // Act
    const result = countReservationsByStatus(reservations, "PENDING");

    // Assert
    expect(result).toBe(2);
  });

  it("devuelve 0 cuando no existen reservas con ese estado", () => {
    // Arrange
    // Ninguna reserva de la lista está en estado ABSENT.

    // Act
    const result = countReservationsByStatus(reservations, "ABSENT");

    // Assert
    expect(result).toBe(0);
  });
});
