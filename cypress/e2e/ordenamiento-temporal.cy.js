/**
 * Test E2E - Ordenamiento temporal de reservas
 *
 * Camino feliz: al pedir el orden "más recientes primero" la lista queda
 * ordenada de más reciente a más antigua.
 *
 * Los datos de src/data/reservations.ts se declaran desordenados a propósito,
 * así que este test solo pasa si la aplicación ordena de verdad.
 *
 * Cronología de las reservas (src/data/reservations.ts):
 *   reservation-1  2026-09-23  09:00  Juan Pérez
 *   reservation-2  2026-09-23  11:00  Ana García
 *   reservation-3  2026-09-23  15:00  Carlos Rodríguez
 *   reservation-4  2026-09-24  10:00  María López
 *
 * Orden esperado de más reciente a más antigua:
 *   reservation-4 → reservation-3 → reservation-2 → reservation-1
 */

describe("AgendaYA - Ordenamiento temporal", () => {
  it("ordena las reservas de más recientes a más antiguas", () => {
    // Arrange
    cy.visit("/");
    cy.get('[data-cy="sort-order-indicator"]').should(
      "contain",
      "Orden: más antiguas primero",
    );

    // Act
    cy.get('[data-cy="sort-reservations-button"]').click();

    // Assert
    cy.get('[data-cy="sort-order-indicator"]').should(
      "contain",
      "Orden: más recientes primero",
    );

    // Se lee el id de cada tarjeta en el orden en que quedaron renderizadas.
    cy.get('[data-cy^="reservation-card-"]').then(($cards) => {
      const sequence = [...$cards].map((card) =>
        card.getAttribute("data-cy").replace("reservation-card-", ""),
      );

      expect(sequence).to.deep.equal([
        "reservation-4",
        "reservation-3",
        "reservation-2",
        "reservation-1",
      ]);
    });
  });
});
