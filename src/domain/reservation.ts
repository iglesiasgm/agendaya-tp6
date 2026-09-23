import type { Reservation } from "../types/reservation";

export const filterReservationsByDate = (
  reservations: Reservation[],
  date: string,
): Reservation[] => {
  return reservations.filter((reservation) => reservation.date === date);
};

export const sortReservationsByStartTime = (
  reservations: Reservation[],
): Reservation[] => {
  return [...reservations].sort((a, b) =>
    a.startTime.localeCompare(b.startTime),
  );
};

export const canCancelReservation = (reservation: Reservation): boolean => {
  return (
    reservation.status !== "CANCELLED" && reservation.status !== "COMPLETED"
  );
};
