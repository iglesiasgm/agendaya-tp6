interface CancelReservationModalProps {
  onConfirm: () => void;
  onClose: () => void;
}

export const CancelReservationModal = ({
  onConfirm,
  onClose,
}: CancelReservationModalProps) => {
  return (
    <div className="modal-overlay">
      <div className="confirmation-modal" data-cy="cancel-confirmation-modal">
        <h2>Cancelar reserva</h2>

        <p>
          ¿Está seguro que desea cancelar esta reserva? Esta acción liberará el
          turno.
        </p>

        <div className="modal-actions">
          <button
            type="button"
            className="secondary-button"
            data-cy="cancel-back-button"
            onClick={onClose}
          >
            Volver
          </button>

          <button
            type="button"
            className="danger-button"
            data-cy="cancel-confirm-button"
            onClick={onConfirm}
          >
            Confirmar cancelación
          </button>
        </div>
      </div>
    </div>
  );
};
