import type { Reservation } from "../types/reservation";

/**
 * Evalúa si dos rangos de horas en formato "HH:mm" se superponen.
 * Utiliza comparación de strings, que funciona correctamente para el formato ISO de hora.
 *
 * Dos rangos se superponen si el inicio de uno es menor que el fin del otro, y viceversa.
 * Horarios consecutivos (ej. 09:00-10:00 y 10:00-11:00) NO se consideran conflicto.
 */
export const hasTimeConflict = (
  newStart: string,
  newEnd: string,
  existingStart: string,
  existingEnd: string,
): boolean => {
  return newStart < existingEnd && newEnd > existingStart;
};

/**
 * Verifica si un nuevo horario está disponible, comparándolo contra un array de reservas.
 *
 * @param newDate - Fecha propuesta para el reagendamiento (formato "YYYY-MM-DD").
 * @param newStart - Hora de inicio propuesta (formato "HH:mm").
 * @param newEnd - Hora de fin propuesta (formato "HH:mm").
 * @param reservations - Array completo de reservas a verificar.
 * @param excludeReservationId - ID opcional de la reserva que se está reagendando.
 *   Si se provee, esa reserva se excluye de la validación para evitar un falso conflicto
 *   consigo misma.
 * @returns `true` si el horario está libre, `false` si hay al menos un conflicto.
 */
export const isTimeSlotAvailable = (
  newDate: string,
  newStart: string,
  newEnd: string,
  reservations: Reservation[],
  excludeReservationId?: string | number | null,
): boolean => {
  return !reservations.some((reservation) => {
    // Ignora la reserva que se está reagendando para no chocar con sí misma
    if (
      excludeReservationId != null &&
      reservation.id === String(excludeReservationId)
    ) {
      return false;
    }

    // Solo compara reservas del mismo día
    if (reservation.date !== newDate) {
      return false;
    }

    return hasTimeConflict(
      newStart,
      newEnd,
      reservation.startTime,
      reservation.endTime,
    );
  });
};
