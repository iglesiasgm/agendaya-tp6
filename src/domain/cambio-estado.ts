import type { Reservation } from '../types/reservation';

export const canChangeReservationStatus = (
  reservation: Reservation,
  newStatus: Reservation['status']
): boolean => {
  if (reservation.status === newStatus) return false;
  if (reservation.status === 'COMPLETED') return false;
  return true; 
};

export const changeReservationStatus = (
  reservations: Reservation[],
  id: string,
  newStatus: Reservation['status']
): Reservation[] => {
  return reservations.map(res => {
    if (res.id === id && canChangeReservationStatus(res, newStatus)) {
      return { ...res, status: newStatus };
    }
    return res;
  });
};