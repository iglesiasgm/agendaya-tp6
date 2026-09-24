import type {
  Reservation,
  ReservationStatus,
} from "../types/reservation";

export const filterReservationsByStatus = (
  reservations: Reservation[],
  status: ReservationStatus,
): Reservation[] => {
  return reservations.filter((reservation) => reservation.status === status);
};

export const countReservationsByStatus = (
  reservations: Reservation[],
  status: ReservationStatus,
): number => {
  return filterReservationsByStatus(reservations, status).length;
};
