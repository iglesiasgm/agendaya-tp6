/**
 * Test E2E - Disponibilidad al reagendar
 * Compañero 5 - TP6 AgendaYA
 *
 * Verifica el camino negativo: impide reagendar una reserva
 * si el nuevo horario genera conflicto con otra reserva existente.
 *
 * Datos del escenario:
 *   - reservation-1: 2026-09-23, 09:00 - 10:00 (CONFIRMED)
 *   - reservation-2: 2026-09-23, 11:00 - 11:30 (PENDING)
 *
 * Se intenta reagendar reservation-1 al horario 11:00-11:30,
 * que está ocupado por reservation-2 → debe mostrar error de conflicto.
 */

describe("AgendaYA - Disponibilidad al reagendar", () => {
  it("impide reagendar una reserva si el nuevo horario genera conflicto", () => {
    // ── Arrange ──────────────────────────────────────────────────────────────
    // Navega a la aplicación y busca las reservas del día con conflictos conocidos
    cy.visit("/");

    cy.get('[data-cy="daily-date-input"]').type("2026-09-23");
    cy.get('[data-cy="search-reservations-button"]').click();

    // Abre el panel de detalle de reservation-1 (09:00-10:00)
    cy.get('[data-cy="reservation-details-button-reservation-1"]').click();

    cy.get('[data-cy="reservation-details-panel"]').should("be.visible");

    // Hace clic en el botón de reagendar para habilitar el formulario
    cy.get('[data-cy="btn-reagendar"]').click();

    // ── Act ───────────────────────────────────────────────────────────────────
    // Limpia los inputs e ingresa el horario conflictivo:
    // reservation-2 ya ocupa 11:00-11:30 el mismo día
    cy.get('[data-cy="input-reagendar-fecha"]')
      .clear()
      .type("2026-09-23");

    cy.get('[data-cy="input-reagendar-inicio"]')
      .clear()
      .type("11:00");

    cy.get('[data-cy="input-reagendar-fin"]')
      .clear()
      .type("11:30");

    // Confirma el reagendamiento con el horario en conflicto
    cy.get('[data-cy="btn-confirmar-reagendamiento"]').click();

    // ── Assert ────────────────────────────────────────────────────────────────
    // Verifica que el mensaje de error de conflicto sea visible
    // y contenga el texto esperado
    cy.get('[data-cy="error-conflicto-horario"]')
      .should("be.visible")
      .and("contain", "El horario seleccionado ya se encuentra ocupado");

    // El panel de detalles debe seguir visible (no se cierra ante error)
    cy.get('[data-cy="reservation-details-panel"]').should("be.visible");
  });
});
