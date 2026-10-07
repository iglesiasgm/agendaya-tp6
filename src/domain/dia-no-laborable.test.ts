import { describe, it, expect } from 'vitest';
import { addNonWorkingDay, isNonWorkingDay } from './dia-no-laborable';

describe('Día no laborable', () => {
  describe('isNonWorkingDay', () => {
    it('reconoce una fecha bloqueada', () => {
      // Arrange
      const nonWorkingDays = ['2026-12-25', '2026-01-01'];

      // Act
      const result = isNonWorkingDay('2026-12-25', nonWorkingDays);

      // Assert
      expect(result).toBe(true);
    });

    it('devuelve false para una fecha normal', () => {
      // Arrange
      const nonWorkingDays = ['2026-12-25', '2026-01-01'];

      // Act
      const result = isNonWorkingDay('2026-12-26', nonWorkingDays);

      // Assert
      expect(result).toBe(false);
    });

    it('devuelve false con lista vacía', () => {
      // Arrange
      const nonWorkingDays: string[] = [];

      // Act
      const result = isNonWorkingDay('2026-12-25', nonWorkingDays);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('addNonWorkingDay', () => {
    it('agrega un día nuevo', () => {
      // Arrange
      const nonWorkingDays = ['2026-12-25'];

      // Act
      const result = addNonWorkingDay(nonWorkingDays, '2026-12-31');

      // Assert
      expect(result).toEqual(['2026-12-25', '2026-12-31']);
    });

    it('no duplica una fecha ya bloqueada', () => {
      // Arrange
      const nonWorkingDays = ['2026-12-25'];

      // Act
      const result = addNonWorkingDay(nonWorkingDays, '2026-12-25');

      // Assert
      expect(result).toHaveLength(1);
    });
  });
});
