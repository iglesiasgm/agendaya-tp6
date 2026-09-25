import { useState } from "react";
import type { Reservation } from "../types/reservation";
import { ReservationCard } from "./ReservationCard";
import {
  filterReservationsByService,
  getAvailableServices,
} from "../domain/filtro-servicio";

interface ReservationListProps {
  reservations: Reservation[];
  onViewDetails: (reservation: Reservation) => void;
}

export const ReservationList = ({
  reservations,
  onViewDetails,
}: ReservationListProps) => {
  // Estado del filtro: string vacío = "Todos los servicios"
  const [selectedService, setSelectedService] = useState("");

  // Servicios únicos disponibles a partir del array recibido
  const availableServices = getAvailableServices(reservations);

  // Reservas filtradas: si no hay filtro activo, se muestran todas
  const filteredReservations =
    selectedService === ""
      ? reservations
      : filterReservationsByService(reservations, selectedService);

  if (reservations.length === 0) {
    return (
      <p className="empty-message" data-cy="no-reservations-message">
        No hay reservas para la fecha seleccionada.
      </p>
    );
  }

  return (
    <div>
      {/* ── Control de filtro por tipo de servicio ── */}
      <div className="filter-bar">
        <label htmlFor="filtro-servicio">Filtrar por servicio:</label>

        <select
          id="filtro-servicio"
          data-cy="select-filtro-servicio"
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
        >
          <option value="">Todos los servicios</option>

          {availableServices.map((service) => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </select>
      </div>

      {/* ── Lista de reservas filtradas ── */}
      {filteredReservations.length === 0 ? (
        <p
          className="empty-message"
          data-cy="empty-filter-message"
        >
          No hay reservas para el servicio seleccionado.
        </p>
      ) : (
        <div className="reservation-list" data-cy="reservation-list">
          {filteredReservations.map((reservation) => (
            <ReservationCard
              key={reservation.id}
              reservation={reservation}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
};
