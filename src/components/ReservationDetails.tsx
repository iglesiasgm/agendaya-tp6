import type { Reservation } from "../types/reservation";
import { canCancelReservation } from "../domain/reservation";

interface ReservationDetailsProps {
  reservation: Reservation;
  onClose: () => void;
  onRequestCancel: () => void;
}

const statusLabels = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmada",
  COMPLETED: "Completada",
  ABSENT: "Ausente",
  CANCELLED: "Cancelada",
};

export const ReservationDetails = ({
  reservation,
  onClose,
  onRequestCancel,
}: ReservationDetailsProps) => {
  const canCancel = canCancelReservation(reservation);

  return (
    <div className="details-overlay">
      <aside className="details-panel" data-cy="reservation-details-panel">
        <header className="details-header">
          <h2>Detalle de la reserva</h2>

          <button
            type="button"
            className="close-button"
            data-cy="close-reservation-details"
            onClick={onClose}
            aria-label="Cerrar detalle"
          >
            ×
          </button>
        </header>

        <section className="details-section">
          <h3>Información del evento</h3>

          <span
            className={`status status-${reservation.status.toLowerCase()}`}
            data-cy="reservation-status"
          >
            {statusLabels[reservation.status]}
          </span>

          <p>
            <strong>Servicio:</strong> {reservation.service}
          </p>

          <p>
            <strong>Fecha:</strong> {reservation.date}
          </p>

          <p>
            <strong>Horario:</strong> {reservation.startTime} -{" "}
            {reservation.endTime}
          </p>
        </section>

        <section className="details-section">
          <h3>Información del cliente</h3>

          <p>{reservation.customerName}</p>
          <p>{reservation.customerEmail}</p>
          <p>{reservation.customerPhone}</p>
        </section>

        {reservation.notes && (
          <section className="details-section">
            <h3>Información adicional</h3>
            <p>{reservation.notes}</p>
          </section>
        )}

        <section className="details-section">
          <h3>Acciones de gestión</h3>

          <button
            type="button"
            className="danger-button"
            data-cy="cancel-reservation-button"
            disabled={!canCancel}
            onClick={onRequestCancel}
          >
            {canCancel ? "Cancelar reserva" : "Reserva no cancelable"}
          </button>
        </section>
      </aside>
    </div>
  );
};
