import type { Reservation } from "../types/reservation";
import { sortReservationsByStartTime } from "./reservation";

export const sortReservationsByDate = (
  reservations: Reservation[],
): Reservation[] => {
  return [...reservations].sort((a, b) => a.date.localeCompare(b.date));
};

export const sortReservationsByDateAndTime = (
  reservations: Reservation[],
): Reservation[] => {
  return sortReservationsByDate(sortReservationsByStartTime(reservations));
};
