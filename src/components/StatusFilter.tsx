import type {
  Reservation,
  ReservationStatus,
} from "../types/reservation";
import { countReservationsByStatus } from "../domain/reservationStatus";

export type StatusFilterValue = ReservationStatus | "ALL";

interface StatusFilterProps {
  reservations: Reservation[];
  value: StatusFilterValue;
  onChange: (value: StatusFilterValue) => void;
}

const statusOptions: { value: ReservationStatus; label: string }[] = [
  { value: "PENDING", label: "Pendiente" },
  { value: "CONFIRMED", label: "Confirmada" },
  { value: "COMPLETED", label: "Completada" },
  { value: "ABSENT", label: "Ausente" },
  { value: "CANCELLED", label: "Cancelada" },
];

export const StatusFilter = ({
  reservations,
  value,
  onChange,
}: StatusFilterProps) => {
  return (
    <div className="status-filter">
      <label htmlFor="status-filter">Estado</label>

      <select
        id="status-filter"
        value={value}
        data-cy="status-filter"
        onChange={(event) =>
          onChange(event.target.value as StatusFilterValue)
        }
      >
        <option value="ALL">{`Todos (${reservations.length})`}</option>

        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {`${option.label} (${countReservationsByStatus(
              reservations,
              option.value,
            )})`}
          </option>
        ))}
      </select>
    </div>
  );
};
