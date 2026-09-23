import type { Reservation } from "../types/reservation";

interface ReservationCardProps {
  reservation: Reservation;
  onViewDetails: (reservation: Reservation) => void;
}

const statusLabels = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmada",
  COMPLETED: "Completada",
  ABSENT: "Ausente",
  CANCELLED: "Cancelada",
};

export const ReservationCard = ({
  reservation,
  onViewDetails,
}: ReservationCardProps) => {
  return (
    <article
      className="reservation-card"
      data-cy={`reservation-card-${reservation.id}`}
    >
      <div>
        <span className={`status status-${reservation.status.toLowerCase()}`}>
          {statusLabels[reservation.status]}
        </span>

        <h3>{reservation.customerName}</h3>

        <p>{reservation.service}</p>

        <p>
          {reservation.startTime} - {reservation.endTime}
        </p>
      </div>

      <button
        type="button"
        data-cy={`reservation-details-button-${reservation.id}`}
        onClick={() => onViewDetails(reservation)}
      >
        Ver detalle
      </button>
    </article>
  );
};
