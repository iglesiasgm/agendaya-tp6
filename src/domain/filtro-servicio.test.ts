import { describe, expect, it } from "vitest";

import {
  filterReservationsByService,
  getAvailableServices,
} from "./filtro-servicio";
import type { Reservation } from "../types/reservation";

// Array de reservas mockeado con múltiples servicios y duplicados intencionales
const mockReservations: Reservation[] = [
  {
    id: "reservation-1",
    customerName: "Juan Pérez",
    customerEmail: "juan.perez@email.com",
    customerPhone: "+54 261 555-0101",
    service: "Consulta",
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
    service: "Consulta",
    date: "2026-09-24",
    startTime: "15:00",
    endTime: "16:00",
    status: "COMPLETED",
  },
  {
    id: "reservation-4",
    customerName: "María López",
    customerEmail: "maria.lopez@email.com",
    customerPhone: "+54 261 555-0104",
    service: "Demostración",
    date: "2026-09-24",
    startTime: "10:00",
    endTime: "11:00",
    status: "CONFIRMED",
  },
  {
    id: "reservation-5",
    customerName: "Pedro Sánchez",
    customerEmail: "pedro.sanchez@email.com",
    customerPhone: "+54 261 555-0105",
    service: "Seguimiento",
    date: "2026-09-25",
    startTime: "14:00",
    endTime: "14:30",
    status: "PENDING",
  },
];

describe("Compañero 3 - Filtro por tipo de evento", () => {
  it("filtra correctamente las reservas de tipo 'Consulta'", () => {
    // Arrange
    // mockReservations tiene 2 reservas de "Consulta" (reservation-1 y reservation-3)

    // Act
    const result = filterReservationsByService(mockReservations, "Consulta");

    // Assert
    expect(result).toHaveLength(2);
    expect(result.every((r) => r.service === "Consulta")).toBe(true);
    expect(result.map((r) => r.id)).toEqual(["reservation-1", "reservation-3"]);
  });

  it("filtra correctamente las reservas de tipo 'Demostración'", () => {
    // Arrange
    // mockReservations tiene 2 reservas de "Demostración" (reservation-2 y reservation-4)

    // Act
    const result = filterReservationsByService(
      mockReservations,
      "Demostración",
    );

    // Assert
    expect(result).toHaveLength(2);
    expect(result.every((r) => r.service === "Demostración")).toBe(true);
    expect(result.map((r) => r.id)).toEqual(["reservation-2", "reservation-4"]);
  });

  it("devuelve un array vacío al buscar un servicio que no existe", () => {
    // Arrange
    const servicioInexistente = "Masajes";

    // Act
    const result = filterReservationsByService(
      mockReservations,
      servicioInexistente,
    );

    // Assert
    expect(result).toEqual([]);
  });

  it("devuelve los servicios disponibles sin duplicados", () => {
    // Arrange
    // mockReservations tiene: "Consulta" x2, "Demostración" x2, "Seguimiento" x1
    // → se esperan 3 servicios únicos

    // Act
    const result = getAvailableServices(mockReservations);

    // Assert
    // Verifica que no haya duplicados comparando tamaño vs Set
    expect(result.length).toBe(new Set(result).size);
    expect(result).toHaveLength(3);
    expect(result).toContain("Consulta");
    expect(result).toContain("Demostración");
    expect(result).toContain("Seguimiento");
  });

  it("devuelve un array vacío cuando se pasa un array de reservas vacío", () => {
    // Arrange
    const reservasVacias: Reservation[] = [];

    // Act
    const result = getAvailableServices(reservasVacias);

    // Assert
    expect(result).toEqual([]);
  });
});
