import { describe, expect, it } from "vitest";

import { sortReservationsByStartTime } from "./reservation";
import {
  sortReservationsByDate,
  sortReservationsByDateAndTime,
} from "./ordenamiento-temporal";

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

describe("sortReservationsByDate", () => {
  it("ordena cronológicamente las reservas por su fecha", () => {
    // Arrange
    const reservations = [
      createReservation({ id: "reservation-4", date: "2026-09-24" }),
      createReservation({ id: "reservation-1", date: "2026-09-22" }),
      createReservation({ id: "reservation-3", date: "2026-09-23" }),
    ];

    // Act
    const result = sortReservationsByDate(reservations);

    // Assert
    expect(result.map((reservation) => reservation.date)).toEqual([
      "2026-09-22",
      "2026-09-23",
      "2026-09-24",
    ]);
  });

  it("mantiene el orden cuando las fechas ya están ordenadas", () => {
    // Arrange
    const reservations = [
      createReservation({ id: "reservation-1", date: "2026-09-22" }),
      createReservation({ id: "reservation-3", date: "2026-09-23" }),
      createReservation({ id: "reservation-4", date: "2026-09-24" }),
    ];

    // Act
    const result = sortReservationsByDate(reservations);

    // Assert
    expect(result.map((reservation) => reservation.id)).toEqual([
      "reservation-1",
      "reservation-3",
      "reservation-4",
    ]);
  });

  it("no modifica el array original al ordenar por fecha", () => {
    // Arrange
    const reservations = [
      createReservation({ id: "reservation-4", date: "2026-09-24" }),
      createReservation({ id: "reservation-1", date: "2026-09-22" }),
    ];

    const originalOrder = [...reservations];

    // Act
    const result = sortReservationsByDate(reservations);

    // Assert
    expect(reservations).toEqual(originalOrder);
    expect(result).not.toBe(reservations);
  });
});

describe("sortReservationsByStartTime", () => {
  it("ordena cronológicamente los horarios cuando están invertidos", () => {
    // Arrange
    const reservations = [
      createReservation({ id: "reservation-3", startTime: "15:00" }),
      createReservation({ id: "reservation-1", startTime: "09:00" }),
      createReservation({ id: "reservation-2", startTime: "11:00" }),
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

  it("mantiene el orden cuando los horarios ya están ordenados", () => {
    // Arrange
    const reservations = [
      createReservation({ id: "reservation-1", startTime: "09:00" }),
      createReservation({ id: "reservation-2", startTime: "11:00" }),
      createReservation({ id: "reservation-3", startTime: "15:00" }),
    ];

    // Act
    const result = sortReservationsByStartTime(reservations);

    // Assert
    expect(result.map((reservation) => reservation.id)).toEqual([
      "reservation-1",
      "reservation-2",
      "reservation-3",
    ]);
  });

  it("no modifica el array original al ordenar por hora de inicio", () => {
    // Arrange
    const reservations = [
      createReservation({ id: "reservation-3", startTime: "15:00" }),
      createReservation({ id: "reservation-1", startTime: "09:00" }),
    ];

    const originalOrder = [...reservations];

    // Act
    const result = sortReservationsByStartTime(reservations);

    // Assert
    expect(reservations).toEqual(originalOrder);
    expect(result).not.toBe(reservations);
  });

  it("conserva dos reservas que comparten la misma hora de inicio", () => {
    // Arrange
    const reservations = [
      createReservation({ id: "reservation-1", startTime: "09:00" }),
      createReservation({ id: "reservation-2", startTime: "09:00" }),
    ];

    // Act
    const result = sortReservationsByStartTime(reservations);

    // Assert
    expect(result).toHaveLength(2);
    expect(result.map((reservation) => reservation.id)).toEqual([
      "reservation-1",
      "reservation-2",
    ]);
    expect(result.map((reservation) => reservation.startTime)).toEqual([
      "09:00",
      "09:00",
    ]);
  });
});

describe("sortReservationsByDateAndTime", () => {
  it("ordena por fecha y, dentro de cada fecha, por hora de inicio", () => {
    // Arrange
    const reservations = [
      createReservation({
        id: "reservation-4",
        date: "2026-09-24",
        startTime: "10:00",
      }),
      createReservation({
        id: "reservation-2",
        date: "2026-09-23",
        startTime: "11:00",
      }),
      createReservation({
        id: "reservation-1",
        date: "2026-09-23",
        startTime: "09:00",
      }),
    ];

    // Act
    const result = sortReservationsByDateAndTime(reservations);

    // Assert
    expect(result.map((reservation) => reservation.id)).toEqual([
      "reservation-1",
      "reservation-2",
      "reservation-4",
    ]);
  });

  it("conserva dos reservas que comparten la misma fecha y hora de inicio", () => {
    // Arrange
    const reservations = [
      createReservation({ id: "reservation-1", date: "2026-09-23" }),
      createReservation({ id: "reservation-2", date: "2026-09-23" }),
    ];

    // Act
    const result = sortReservationsByDateAndTime(reservations);

    // Assert
    expect(result).toHaveLength(2);
    expect(result.map((reservation) => reservation.id)).toEqual([
      "reservation-1",
      "reservation-2",
    ]);
  });

  it("no modifica el array original al ordenar temporalmente", () => {
    // Arrange
    const reservations = [
      createReservation({
        id: "reservation-4",
        date: "2026-09-24",
        startTime: "10:00",
      }),
      createReservation({
        id: "reservation-1",
        date: "2026-09-23",
        startTime: "09:00",
      }),
    ];

    const originalOrder = [...reservations];

    // Act
    const result = sortReservationsByDateAndTime(reservations);

    // Assert
    expect(reservations).toEqual(originalOrder);
    expect(result).not.toBe(reservations);
  });
});
