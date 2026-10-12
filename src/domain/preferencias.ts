export type CalendarView = 'Mes' | 'Semana' | 'Día';

export interface UserPreferences {
  view: CalendarView;
  darkMode: boolean;
}

export const STORAGE_KEYS = {
  VIEW: 'agenda_default_view',
  DARK_MODE: 'agenda_dark_mode',
  BACKUP: 'pending_transaction_backup',
};

// M05-CP05: Persistencia de preferencias
export function savePreferences(
  storage: Storage,
  prefs: Partial<UserPreferences>
): UserPreferences {
  if (prefs.view !== undefined) {
    storage.setItem(STORAGE_KEYS.VIEW, prefs.view);
  }
  if (prefs.darkMode !== undefined) {
    storage.setItem(STORAGE_KEYS.DARK_MODE, String(prefs.darkMode));
  }
  return loadPreferences(storage);
}

export function loadPreferences(storage: Storage): UserPreferences {
  const view = (storage.getItem(STORAGE_KEYS.VIEW) as CalendarView) || 'Mes';
  const darkMode = storage.getItem(STORAGE_KEYS.DARK_MODE) === 'true';
  return { view, darkMode };
}

// M05-CP06: Tiempos de respuesta y control de degradación/timeout
export const LATENCY_THRESHOLDS = {
  UI_SPINNER_MS: 200,      // > 0.2s muestra spinner
  WARN_TRANSACTION_MS: 2500, // > 2.5s mensaje de advertencia
  ABORT_TRANSACTION_MS: 5000, // > 5.0s aborta y respalda en sesión
};

export function shouldShowSpinner(durationMs: number): boolean {
  return durationMs > LATENCY_THRESHOLDS.UI_SPINNER_MS;
}

export function evaluateTransactionLatency(
  durationMs: number,
  payload: any,
  sessionStore?: Storage
): { status: 'OK' | 'WARNING' | 'TIMEOUT'; message?: string } {
  if (durationMs > LATENCY_THRESHOLDS.ABORT_TRANSACTION_MS) {
    if (sessionStore && payload) {
      sessionStore.setItem(STORAGE_KEYS.BACKUP, JSON.stringify(payload));
    }
    return {
      status: 'TIMEOUT',
      message: 'Operación cancelada por timeout. Datos respaldados en sesión.',
    };
  }

  if (durationMs > LATENCY_THRESHOLDS.WARN_TRANSACTION_MS) {
    return {
      status: 'WARNING',
      message: 'Lo sentimos, la operación está tomando más de lo esperado',
    };
  }

  return { status: 'OK' };
}