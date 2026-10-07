import { useState } from "react";

import { isNonWorkingDay } from "../domain/dia-no-laborable";

type NonWorkingDayFormProps = {
  nonWorkingDays: string[];
  onAddNonWorkingDay: (date: string) => void;
};

export function NonWorkingDayForm({
  nonWorkingDays,
  onAddNonWorkingDay,
}: NonWorkingDayFormProps) {
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccess("");

    if (!date) {
      setError("Seleccioná una fecha para bloquear.");
      return;
    }

    if (isNonWorkingDay(date, nonWorkingDays)) {
      setError("Ese día ya está bloqueado.");
      return;
    }

    onAddNonWorkingDay(date);
    setError("");
    setSuccess("Día bloqueado correctamente.");
    setDate("");
  };

  return (
    <>
      <form className="date-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="non-working-date">Fecha a bloquear</label>

          <input
            id="non-working-date"
            type="date"
            value={date}
            data-cy="non-working-date-input"
            onChange={(event) => setDate(event.target.value)}
          />

          {error && (
            <span className="error-message" data-cy="non-working-date-error">
              {error}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="primary-button"
          data-cy="block-day-button"
        >
          Bloquear día
        </button>
      </form>

      {success && (
        <div className="success-message" data-cy="non-working-success">
          {success}
        </div>
      )}

      {nonWorkingDays.length === 0 ? (
        <p data-cy="non-working-days-empty">No hay días bloqueados.</p>
      ) : (
        <ul data-cy="non-working-days-list">
          {nonWorkingDays.map((day) => (
            <li key={day} data-cy={`non-working-day-${day}`}>
              {day}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
