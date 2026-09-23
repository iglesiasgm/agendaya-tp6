import { describe, expect, it } from "vitest";

import {
  cancelReservation,
  canCancelReservation,
  filterReservationsByDate,
  sortReservationsByStartTime,
} from "./reservation";

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

describe("filterReservationsByDate", () => {
  it("devuelve solamente las reservas correspondientes a la fecha indicada", () => {
    // Arrange
    const reservations = [
      createReservation({
        id: "reservation-1",
        date: "2026-09-23",
      }),
      createReservation({
        id: "reservation-2",
        date: "2026-09-24",
      }),
      createReservation({
        id: "reservation-3",
        date: "2026-09-23",
      }),
    ];

    // Act
    const result = filterReservationsByDate(reservations, "2026-09-23");

    // Assert
    expect(result).toHaveLength(2);
    expect(result.map((reservation) => reservation.id)).toEqual([
      "reservation-1",
      "reservation-3",
    ]);
  });

  it("devuelve un array vacío cuando no existen reservas para la fecha", () => {
    // Arrange
    const reservations = [
      createReservation({
        date: "2026-09-23",
      }),
    ];

    // Act
    const result = filterReservationsByDate(reservations, "2026-09-25");

    // Assert
    expect(result).toEqual([]);
  });
});

describe("sortReservationsByStartTime", () => {
  it("ordena las reservas de menor a mayor según su horario de inicio", () => {
    // Arrange
    const reservations = [
      createReservation({
        id: "reservation-1",
        startTime: "15:00",
      }),
      createReservation({
        id: "reservation-2",
        startTime: "09:00",
      }),
      createReservation({
        id: "reservation-3",
        startTime: "11:00",
      }),
    ];

    // Act
    const result = sortReservationsByStartTime(reservations);

    // Assert
    expect(result.map((reservation) => reservation.startTime)).toEqual([
      "09:00",
      "11:00",
      "15:00",
    ]);
  });

  it("no modifica el array original al ordenar las reservas", () => {
    // Arrange
    const reservations = [
      createReservation({
        id: "reservation-1",
        startTime: "15:00",
      }),
      createReservation({
        id: "reservation-2",
        startTime: "09:00",
      }),
    ];

    const originalOrder = [...reservations];

    // Act
    sortReservationsByStartTime(reservations);

    // Assert
    expect(reservations).toEqual(originalOrder);
  });
});

describe("canCancelReservation", () => {
  it("permite cancelar una reserva confirmada", () => {
    // Arrange
    const reservation = createReservation({
      status: "CONFIRMED",
    });

    // Act
    const result = canCancelReservation(reservation);

    // Assert
    expect(result).toBe(true);
  });

  it("permite cancelar una reserva pendiente", () => {
    // Arrange
    const reservation = createReservation({
      status: "PENDING",
    });

    // Act
    const result = canCancelReservation(reservation);

    // Assert
    expect(result).toBe(true);
  });

  it("impide cancelar una reserva completada", () => {
    // Arrange
    const reservation = createReservation({
      status: "COMPLETED",
    });

    // Act
    const result = canCancelReservation(reservation);

    // Assert
    expect(result).toBe(false);
  });

  it("impide cancelar una reserva ya cancelada", () => {
    // Arrange
    const reservation = createReservation({
      status: "CANCELLED",
    });

    // Act
    const result = canCancelReservation(reservation);

    // Assert
    expect(result).toBe(false);
  });
});

describe("cancelReservation", () => {
  it("cambia a CANCELLED el estado de la reserva indicada", () => {
    // Arrange
    const reservations = [
      createReservation({
        id: "reservation-1",
        status: "CONFIRMED",
      }),
    ];

    // Act
    const result = cancelReservation(reservations, "reservation-1");

    // Assert
    expect(result[0].status).toBe("CANCELLED");
  });

  it("no modifica otras reservas al cancelar una", () => {
    // Arrange
    const reservations = [
      createReservation({
        id: "reservation-1",
        status: "CONFIRMED",
      }),
      createReservation({
        id: "reservation-2",
        status: "PENDING",
      }),
    ];

    // Act
    const result = cancelReservation(reservations, "reservation-1");

    // Assert
    expect(result[0].status).toBe("CANCELLED");
    expect(result[1].status).toBe("PENDING");
  });

  it("no cancela una reserva completada", () => {
    // Arrange
    const reservations = [
      createReservation({
        id: "reservation-1",
        status: "COMPLETED",
      }),
    ];

    // Act
    const result = cancelReservation(reservations, "reservation-1");

    // Assert
    expect(result[0].status).toBe("COMPLETED");
  });
});
