import { useState } from "react";
import type { Reservation } from "../types/reservation";
import { canCancelReservation } from "../domain/reservation";
import { isTimeSlotAvailable } from "../domain/disponibilidad";

interface ReservationDetailsProps {
  reservation: Reservation;
  reservations: Reservation[];
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
  reservations,
  onClose,
  onRequestCancel,
}: ReservationDetailsProps) => {
  const canCancel = canCancelReservation(reservation);

  // Estado del formulario de reagendamiento
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState(reservation.date);
  const [rescheduleStart, setRescheduleStart] = useState(
    reservation.startTime,
  );
  const [rescheduleEnd, setRescheduleEnd] = useState(reservation.endTime);
  const [conflictError, setConflictError] = useState("");

  const handleOpenReschedule = () => {
    // Reinicia los campos al horario actual de la reserva
    setRescheduleDate(reservation.date);
    setRescheduleStart(reservation.startTime);
    setRescheduleEnd(reservation.endTime);
    setConflictError("");
    setIsRescheduling(true);
  };

  const handleConfirmReschedule = () => {
    setConflictError("");

    const available = isTimeSlotAvailable(
      rescheduleDate,
      rescheduleStart,
      rescheduleEnd,
      reservations,
      reservation.id, // Excluye la reserva actual para no chocar consigo misma
    );

    if (!available) {
      setConflictError("El horario seleccionado ya se encuentra ocupado");
      return;
    }

    // Horario disponible: aquí podría dispararse un callback de actualización.
    // Por ahora cerramos el formulario como señal de éxito.
    setIsRescheduling(false);
    setConflictError("");
  };

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

          {/* ── Sección de reagendamiento ── */}
          {!isRescheduling ? (
            <button
              type="button"
              className="primary-button"
              data-cy="btn-reagendar"
              onClick={handleOpenReschedule}
              style={{ marginTop: "0.75rem" }}
            >
              Reagendar
            </button>
          ) : (
            <div className="reschedule-form" style={{ marginTop: "0.75rem" }}>
              <h4>Nuevo horario</h4>

              <div className="form-field">
                <label htmlFor="reagendar-fecha">Fecha</label>
                <input
                  id="reagendar-fecha"
                  type="date"
                  data-cy="input-reagendar-fecha"
                  value={rescheduleDate}
                  onChange={(e) => {
                    setRescheduleDate(e.target.value);
                    setConflictError("");
                  }}
                />
              </div>

              <div className="form-field">
                <label htmlFor="reagendar-inicio">Hora de inicio</label>
                <input
                  id="reagendar-inicio"
                  type="time"
                  data-cy="input-reagendar-inicio"
                  value={rescheduleStart}
                  onChange={(e) => {
                    setRescheduleStart(e.target.value);
                    setConflictError("");
                  }}
                />
              </div>

              <div className="form-field">
                <label htmlFor="reagendar-fin">Hora de fin</label>
                <input
                  id="reagendar-fin"
                  type="time"
                  data-cy="input-reagendar-fin"
                  value={rescheduleEnd}
                  onChange={(e) => {
                    setRescheduleEnd(e.target.value);
                    setConflictError("");
                  }}
                />
              </div>

              {conflictError && (
                <p
                  className="error-message"
                  data-cy="error-conflicto-horario"
                  role="alert"
                >
                  {conflictError}
                </p>
              )}

              <button
                type="button"
                className="primary-button"
                data-cy="btn-confirmar-reagendamiento"
                onClick={handleConfirmReschedule}
                style={{ marginTop: "0.5rem" }}
              >
                Confirmar reagendamiento
              </button>
            </div>
          )}
        </section>
      </aside>
    </div>
  );
};
