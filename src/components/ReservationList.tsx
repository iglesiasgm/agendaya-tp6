import type { Reservation } from "../types/reservation";
import { ReservationCard } from "./ReservationCard";

interface ReservationListProps {
  reservations: Reservation[];
  onViewDetails: (reservation: Reservation) => void;
}

export const ReservationList = ({
  reservations,
  onViewDetails,
}: ReservationListProps) => {
  if (reservations.length === 0) {
    return (
      <p className="empty-message" data-cy="no-reservations-message">
        No hay reservas para la fecha seleccionada.
      </p>
    );
  }

  return (
    <div className="reservation-list" data-cy="reservation-list">
      {reservations.map((reservation) => (
        <ReservationCard
          key={reservation.id}
          reservation={reservation}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};
