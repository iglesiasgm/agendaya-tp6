/**
 * Test E2E - Filtro por tipo de evento
 * Compañero 3 - TP6 AgendaYA
 *
 * Verifica que el selector de filtro por servicio muestre únicamente
 * las reservas correspondientes al servicio seleccionado.
 *
 * Datos del escenario (fecha 2026-09-23):
 *   - reservation-1: "Consulta inicial"  (CONFIRMED)
 *   - reservation-2: "Demostración"      (PENDING)
 *
 * Los servicios en los datos mock del proyecto usan nombres como
 * "Consulta inicial" y "Demostración". Ajustamos el test al valor
 * exacto de los datos en src/data/reservations.ts.
 */

describe("AgendaYA - Filtro por tipo de evento", () => {
  beforeEach(() => {
    // Navega a la app y carga reservas del día que tiene múltiples servicios
    cy.visit("/");

    cy.get('[data-cy="daily-date-input"]').type("2026-09-23");
    cy.get('[data-cy="search-reservations-button"]').click();

    // Espera a que el selector de filtro sea visible antes de cada test
    cy.get('[data-cy="select-filtro-servicio"]').should("be.visible");
  });

  it("muestra solo las reservas del servicio seleccionado al filtrar por 'Demostración'", () => {
    // ── Arrange ──────────────────────────────────────────────────────────────
    // El selector debe estar visible con la opción "Todos los servicios" por defecto.
    // Verificamos que haya más de una reserva sin filtro activo.
    cy.get('[data-cy="reservation-list"]').should("be.visible");
    cy.get('[data-cy="reservation-item"]').should("have.length.greaterThan", 1);

    // ── Act ───────────────────────────────────────────────────────────────────
    // Seleccionamos "Demostración" en el selector de filtro
    cy.get('[data-cy="select-filtro-servicio"]').select("Demostración");

    // ── Assert ────────────────────────────────────────────────────────────────
    // Todos los items visibles deben contener "Demostración"
    cy.get('[data-cy="reservation-item"]').each(($item) => {
      cy.wrap($item).should("contain", "Demostración");
    });

    // Ningún item debe contener "Consulta inicial" (el otro servicio del día)
    cy.get('[data-cy="reservation-item"]').each(($item) => {
      cy.wrap($item).should("not.contain", "Consulta inicial");
    });
  });

  it("restaura todas las reservas al seleccionar 'Todos los servicios'", () => {
    // ── Arrange ──────────────────────────────────────────────────────────────
    // Primero filtramos por Demostración
    cy.get('[data-cy="select-filtro-servicio"]').select("Demostración");
    cy.get('[data-cy="reservation-item"]').should("have.length", 1);

    // ── Act ───────────────────────────────────────────────────────────────────
    // Volvemos a "Todos los servicios"
    cy.get('[data-cy="select-filtro-servicio"]').select("Todos los servicios");

    // ── Assert ────────────────────────────────────────────────────────────────
    // Deben aparecer todas las reservas del día nuevamente
    cy.get('[data-cy="reservation-item"]').should("have.length.greaterThan", 1);
  });
});
