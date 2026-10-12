import { describe, it, expect, beforeEach } from 'vitest';
import {
  savePreferences,
  loadPreferences,
  shouldShowSpinner,
  evaluateTransactionLatency,
  STORAGE_KEYS,
} from './preferencias';

// Mock simple de Web Storage para entorno Node/Vitest
class MockStorage implements Storage {
  private store: Record<string, string> = {};
  get length() { return Object.keys(this.store).length; }
  clear() { this.store = {}; }
  getItem(key: string) { return this.store[key] ?? null; }
  setItem(key: string, value: string) { this.store[key] = String(value); }
  removeItem(key: string) { delete this.store[key]; }
  key(index: number) { return Object.keys(this.store)[index] ?? null; }
}

describe('M05-CP05: Persistencia de preferencias de interfaz', () => {
  let localStorageMock: Storage;

  beforeEach(() => {
    localStorageMock = new MockStorage();
  });

  it('Escenario 1: debe guardar la vista seleccionada y recuperarla', () => {
    // Valor inicial por defecto
    const initial = loadPreferences(localStorageMock);
    expect(initial.view).toBe('Mes');

    // Modificar a Semana
    savePreferences(localStorageMock, { view: 'Semana' });
    expect(localStorageMock.getItem(STORAGE_KEYS.VIEW)).toBe('Semana');

    // Recuperar (simula recarga de página / nuevo inicio de sesión)
    const reloaded = loadPreferences(localStorageMock);
    expect(reloaded.view).toBe('Semana');
  });

  it('Escenario 2: debe activar y persistir el modo oscuro', () => {
    const initial = loadPreferences(localStorageMock);
    expect(initial.darkMode).toBe(false);

    // Activar modo oscuro
    savePreferences(localStorageMock, { darkMode: true });
    expect(localStorageMock.getItem(STORAGE_KEYS.DARK_MODE)).toBe('true');

    // Recuperar
    const reloaded = loadPreferences(localStorageMock);
    expect(reloaded.darkMode).toBe(true);
  });
});

describe('M05-CP06: Tiempos de respuesta del sistema', () => {
  let sessionStorageMock: Storage;

  beforeEach(() => {
    sessionStorageMock = new MockStorage();
  });

  it('Escenario 1: latencia > 2.5s debe emitir mensaje de advertencia', () => {
    const res = evaluateTransactionLatency(2600, { data: 'test' }, sessionStorageMock);
    expect(res.status).toBe('WARNING');
    expect(res.message).toBe('Lo sentimos, la operación está tomando más de lo esperado');
    expect(sessionStorageMock.getItem(STORAGE_KEYS.BACKUP)).toBeNull();
  });

  it('Escenario 1: latencia > 5.0s debe cancelar y respaldar datos en sessionStorage', () => {
    const payload = { view: 'Mes', darkMode: false };
    const res = evaluateTransactionLatency(5100, payload, sessionStorageMock);

    expect(res.status).toBe('TIMEOUT');
    expect(res.message).toBe('Operación cancelada por timeout. Datos respaldados en sesión.');

    const backup = sessionStorageMock.getItem(STORAGE_KEYS.BACKUP);
    expect(backup).not.toBeNull();
    expect(JSON.parse(backup!)).toEqual(payload);
  });

  it('Escenario 2: interacción UI con demora > 0.2s (200ms) debe mostrar componente de carga', () => {
    // Acción rápida (100ms) -> No requiere spinner
    expect(shouldShowSpinner(100)).toBe(false);

    // Acción demorada (250ms) -> Supera 0.2s, debe mostrar spinner
    expect(shouldShowSpinner(250)).toBe(true);
  });
});