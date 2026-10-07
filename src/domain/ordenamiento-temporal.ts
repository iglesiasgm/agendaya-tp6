import type { Reservation } from "../types/reservation";
import { sortReservationsByStartTime } from "./reservation";

export const sortReservationsByDate = (
  reservations: Reservation[],
): Reservation[] => {
  return [...reservations].sort((a, b) => a.date.localeCompare(b.date));
};

export type SortDirection = "asc" | "desc";

export const sortReservationsByDateAndTime = (
  reservations: Reservation[],
  direction: SortDirection = "asc",
): Reservation[] => {
  const ordered = sortReservationsByDate(
    sortReservationsByStartTime(reservations),
  );

  return direction === "desc" ? [...ordered].reverse() : ordered;
};
