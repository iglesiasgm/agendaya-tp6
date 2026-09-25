import type { Reservation } from "../types/reservation";

/**
 * Filtra un array de reservas devolviendo solo aquellas cuyo campo
 * `service` coincida exactamente con el parámetro recibido.
 *
 * @param reservations - Array completo de reservas a filtrar.
 * @param service - Nombre exacto del servicio a buscar.
 * @returns Subconjunto de reservas que coinciden con el servicio indicado.
 */
export const filterReservationsByService = (
  reservations: Reservation[],
  service: string,
): Reservation[] => {
  return reservations.filter(
    (reservation) => reservation.service === service,
  );
};

/**
 * Extrae todos los nombres de servicio únicos presentes en el array
 * de reservas recibido, sin duplicados.
 *
 * @param reservations - Array de reservas del que extraer los servicios.
 * @returns Array de strings con los servicios disponibles, sin repetidos.
 */
export const getAvailableServices = (reservations: Reservation[]): string[] => {
  const seen = new Set<string>();

  for (const reservation of reservations) {
    seen.add(reservation.service);
  }

  return Array.from(seen);
};
