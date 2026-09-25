import { useState } from "react";
import "./App.css";

import { ReservationList } from "./components/ReservationList";
import { initialReservations } from "./data/reservations";
import { ReservationDetails } from "./components/ReservationDetails";
import { CancelReservationModal } from "./components/CancelReservationModal";

import {
  cancelReservation,
  filterReservationsByDate,
  sortReservationsByStartTime,
} from "./domain/reservation";
import type { Reservation } from "./types/reservation";

function App() {
  const [reservations, setReservations] =
    useState<Reservation[]>(initialReservations);

  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [searchedDate, setSearchedDate] = useState("");
  const [dateError, setDateError] = useState("");

  const reservationsForSelectedDate = searchedDate
    ? sortReservationsByStartTime(
        filterReservationsByDate(reservations, searchedDate),
      )
    : [];

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedDate) {
      setDateError("Seleccioná una fecha para consultar las reservas.");
      return;
    }

    setDateError("");
    setSearchedDate(selectedDate);
  };

  const handleViewDetails = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setSuccessMessage("");
  };

  const handleCloseDetails = () => {
    setSelectedReservation(null);
  };

  const handleRequestCancel = () => {
    setIsCancelModalOpen(true);
  };

  const handleCloseCancelModal = () => {
    setIsCancelModalOpen(false);
  };

  const handleConfirmCancellation = () => {
    if (!selectedReservation) {
      return;
    }

    const updatedReservations = cancelReservation(
      reservations,
      selectedReservation.id,
    );

    setReservations(updatedReservations);
    setIsCancelModalOpen(false);
    setSelectedReservation(null);
    setSuccessMessage("Reserva cancelada correctamente.");
  };

  return (
    <main className="app-container">
      <header className="page-header">
        <div>
          <span className="eyebrow">AgendaYA</span>
          <h1>Gestión de Agenda</h1>
          <p>Consultá las reservas correspondientes a un día.</p>
        </div>

        <span className="admin-badge">Administrador</span>
      </header>

      <section className="content-card">
        {successMessage && (
          <div className="success-message" data-cy="reservation-cancel-success">
            {successMessage}
          </div>
        )}
        <h2>Reservas del día</h2>

        <form className="date-form" onSubmit={handleSearch}>
          <div className="form-field">
            <label htmlFor="reservation-date">Fecha</label>

            <input
              id="reservation-date"
              type="date"
              value={selectedDate}
              data-cy="daily-date-input"
              onChange={(event) => setSelectedDate(event.target.value)}
            />

            {dateError && (
              <span className="error-message" data-cy="date-error">
                {dateError}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="primary-button"
            data-cy="search-reservations-button"
          >
            Buscar reservas
          </button>
        </form>

        {searchedDate && (
          <section data-cy="search-results">
            <div className="results-header">
              <h2>Resultados</h2>

              <span>
                {reservationsForSelectedDate.length}{" "}
                {reservationsForSelectedDate.length === 1
                  ? "reserva"
                  : "reservas"}
              </span>
            </div>

            <ReservationList
              reservations={reservationsForSelectedDate}
              onViewDetails={handleViewDetails}
            />
          </section>
        )}
      </section>
      {selectedReservation && (
        <ReservationDetails
          reservation={selectedReservation}
          reservations={reservations}
          onClose={handleCloseDetails}
          onRequestCancel={handleRequestCancel}
        />
      )}

      {isCancelModalOpen && (
        <CancelReservationModal
          onConfirm={handleConfirmCancellation}
          onClose={handleCloseCancelModal}
        />
      )}
    </main>
  );
}

export default App;
