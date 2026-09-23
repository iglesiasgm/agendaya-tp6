import { useState } from "react";
import "./App.css";

import { ReservationList } from "./components/ReservationList";
import { initialReservations } from "./data/reservations";
import {
  filterReservationsByDate,
  sortReservationsByStartTime,
} from "./domain/reservation";
import type { Reservation } from "./types/reservation";

function App() {
  const [selectedDate, setSelectedDate] = useState("");
  const [searchedDate, setSearchedDate] = useState("");
  const [dateError, setDateError] = useState("");

  const reservationsForSelectedDate = searchedDate
    ? sortReservationsByStartTime(
        filterReservationsByDate(initialReservations, searchedDate),
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
    console.log("Reserva seleccionada:", reservation);
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
    </main>
  );
}

export default App;
