import type { Reservation } from "../types/reservation";
import { ReservationCard } from "./ReservationCard";

/**
 * Causa posible de un listado vacío. El filtro de servicio y el de fecha
 * pueden dejar la lista sin resultados por separado, y cada caso necesita
 * un mensaje distinto para no confundir al usuario.
 */
export type EmptyReason = "date" | "service";

interface ReservationListProps {
  reservations: Reservation[];
  emptyReason: EmptyReason;
  onViewDetails: (reservation: Reservation) => void;
}

export const ReservationList = ({
  reservations,
  emptyReason,
  onViewDetails,
}: ReservationListProps) => {
  if (reservations.length === 0) {
    // Si la fecha tiene reservas pero el listado llegó vacío, el filtro
    // de servicio es el responsable aunque la fecha también esté activa.
    return emptyReason === "service" ? (
      <p className="empty-message" data-cy="empty-filter-message">
        No hay reservas para el servicio seleccionado.
      </p>
    ) : (
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
