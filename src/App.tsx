import { useState } from "react";
import "./App.css";

import { ReservationList } from "./components/ReservationList";
import type { EmptyReason } from "./components/ReservationList";
import { initialReservations } from "./data/reservations";
import { ReservationDetails } from "./components/ReservationDetails";
import { CancelReservationModal } from "./components/CancelReservationModal";

import {
  cancelReservation,
  filterReservationsByDate,
} from "./domain/reservation";
import {
  filterReservationsByService,
  getAvailableServices,
} from "./domain/filtro-servicio";
import { sortReservationsByDateAndTime } from "./domain/ordenamiento-temporal";
import type { SortDirection } from "./domain/ordenamiento-temporal";
import type { Reservation } from "./types/reservation";

function App() {
  const [reservations, setReservations] =
    useState<Reservation[]>(initialReservations);

  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // Los filtros se aplican en cadena y el orden es temporal: primero por
  // fecha y, dentro de cada fecha, por hora de inicio.
  // La fecha es un filtro adicional, no obligatorio: si no hay fecha cargada
  // el listado parte de todas las reservas.
  const reservationsForDate = selectedDate
    ? filterReservationsByDate(reservations, selectedDate)
    : reservations;

  // Las opciones del selector dependen de la fecha elegida, igual que antes
  // de mover el filtro a este componente.
  const availableServices = getAvailableServices(reservationsForDate);

  const reservationsForService = selectedService
    ? filterReservationsByService(reservationsForDate, selectedService)
    : reservationsForDate;

  const visibleReservations = sortReservationsByDateAndTime(
    reservationsForService,
    sortDirection,
  );

  // Solo el filtro de servicio puede vaciar una lista que la fecha dejó con
  // contenido; en caso contrario el vacío se atribuye a la fecha.
  const emptyReason: EmptyReason =
    reservationsForDate.length > 0 && reservationsForService.length === 0
      ? "service"
      : "date";

  const handleToggleSortDirection = () => {
    setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
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
          <p>Consultá todas las reservas o filtrá por una fecha concreta.</p>
        </div>

        <span className="admin-badge">Administrador</span>
      </header>

      <section className="content-card">
        {successMessage && (
          <div className="success-message" data-cy="reservation-cancel-success">
            {successMessage}
          </div>
        )}
        <form
          className="filters-bar"
          // Cada filtro se aplica en vivo al cambiar el control; el submit
          // solo evita la recarga de la página al presionar Enter.
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="filter-field">
            <label htmlFor="reservation-date">Fecha (opcional)</label>

            <input
              id="reservation-date"
              type="date"
              value={selectedDate}
              data-cy="daily-date-input"
              onChange={(event) => setSelectedDate(event.target.value)}
            />
          </div>

          <div className="filter-field">
            <label htmlFor="filtro-servicio">Servicio</label>

            <select
              id="filtro-servicio"
              data-cy="select-filtro-servicio"
              value={selectedService}
              onChange={(event) => setSelectedService(event.target.value)}
            >
              <option value="">Todos los servicios</option>

              {availableServices.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-field">
            <label htmlFor="sort-reservations-button">Ordenar por</label>

            <button
              id="sort-reservations-button"
              type="button"
              className="secondary-button"
              data-cy="sort-reservations-button"
              onClick={handleToggleSortDirection}
            >
              {sortDirection === "asc"
                ? "Ver recientes primero"
                : "Ver antiguas primero"}
            </button>
          </div>

          <div className="filter-actions">
            <button
              type="submit"
              className="primary-button"
              data-cy="search-reservations-button"
            >
              Buscar
            </button>

            {selectedDate && (
              <button
                type="button"
                className="secondary-button"
                data-cy="clear-date-filter-button"
                onClick={() => setSelectedDate("")}
              >
                Limpiar filtro
              </button>
            )}
          </div>
        </form>

        <section data-cy="search-results">
          <div className="results-header">
            <h2>Resultados</h2>

            <span>
              {visibleReservations.length}{" "}
              {visibleReservations.length === 1 ? "reserva" : "reservas"}
            </span>
          </div>

          <div className="list-status">
            <p className="active-filter" data-cy="active-filter">
              {selectedDate
                ? `Filtrando por el ${selectedDate}`
                : "Mostrando todas las reservas"}
            </p>

            <p className="active-filter" data-cy="sort-order-indicator">
              {sortDirection === "asc"
                ? "Orden: más antiguas primero"
                : "Orden: más recientes primero"}
            </p>
          </div>

          <ReservationList
            reservations={visibleReservations}
            emptyReason={emptyReason}
            onViewDetails={handleViewDetails}
          />
        </section>
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
