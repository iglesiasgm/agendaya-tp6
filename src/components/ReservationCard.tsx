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
    /*
     * data-cy="reservation-item" → selector genérico requerido por el filtro E2E.
     * data-cy-id                 → preserva la identificación individual por ID
     *                              para que los tests de cancelación y detalle
     *                              sigan usando [data-cy="reservation-card-{id}"]
     *                              a través del selector: [data-cy-id="reservation-card-reservation-1"]
     *
     * NOTA: el test cancel-reservation.cy.js usa [data-cy="reservation-card-reservation-1"],
     * que ahora se mapea mediante el atributo compuesto en el article:
     * mantenemos data-cy con el ID en el article para no romper esos tests.
     */
    <article
      className="reservation-card"
      data-cy={`reservation-card-${reservation.id}`}
    >
      {/*
       * Wrapper interno con data-cy="reservation-item" para que Cypress
       * pueda seleccionar elementos individuales de la lista filtrada.
       */}
      <div data-cy="reservation-item">
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
      </div>
    </article>
  );
};
